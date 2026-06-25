import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, BlogPost } from "@/lib/posts";
import { getAllSubscribers } from "@/lib/subscribers";
import {
  markNewsletterAsSent,
  getUnsentPostSlugs,
} from "@/lib/newsletter-tracker";
import { sendEmailViaBrevo, getBrevoSender } from "@/lib/email";
import { isNewsletterAuthorized } from "@/lib/newsletter-auth";
import {
  getNewsletterPostEmailHTML,
  getNewsletterPostSubject,
} from "@/lib/email-templates";

// Newsletter email HTML template for new blog posts — see lib/email-templates.ts

// Send email via Brevo
async function sendEmailViaBrevoWrapper(
  toEmail: string,
  subject: string,
  htmlContent: string
): Promise<{ success: boolean; error?: string }> {
  const sender = getBrevoSender();
  const result = await sendEmailViaBrevo({
    to: toEmail,
    toName: "Subscriber",
    subject,
    htmlContent,
    fromEmail: sender.email,
    fromName: sender.name,
    replyTo: sender.replyTo,
  });

  return {
    success: result.success,
    error:
      typeof result.error === "string"
        ? result.error
        : result.error
          ? JSON.stringify(result.error)
          : undefined,
  };
}

// Send newsletter for a specific post
async function sendNewsletterForPost(post: BlogPost): Promise<{
  sent: number;
  failed: number;
  errors: string[];
}> {
  const subscribers = await getAllSubscribers();
  if (subscribers.length === 0) {
    return { sent: 0, failed: 0, errors: [] };
  }

  const subject = getNewsletterPostSubject(post);
  const htmlContent = getNewsletterPostEmailHTML(post);

  let sentCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  for (const subscriber of subscribers) {
    const result = await sendEmailViaBrevoWrapper(
      subscriber.email,
      subject,
      htmlContent
    );
    if (result.success) {
      sentCount++;
    } else {
      failedCount++;
      if (result.error) {
        errors.push(`${subscriber.email}: ${result.error}`);
      }
    }
    // Small delay to avoid rate limiting (Brevo allows 300 emails/day free)
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return { sent: sentCount, failed: failedCount, errors };
}

/** Skip emailing the full archive on first run — only notify for the newest post. */
async function bootstrapOlderPosts(allPosts: BlogPost[]): Promise<number> {
  if (allPosts.length <= 1) return 0;

  const unsentSlugs = await getUnsentPostSlugs(allPosts.map((post) => post.slug));
  if (unsentSlugs.length !== allPosts.length) return 0;

  const sorted = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const olderPosts = sorted.slice(1);

  for (const post of olderPosts) {
    await markNewsletterAsSent(post.slug, 0);
  }

  return olderPosts.length;
}

export async function POST(request: NextRequest) {
  try {
    if (!isNewsletterAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all posts
    const allPosts = getAllPosts();
    const allPostSlugs = allPosts.map((post) => post.slug);

    const bootstrapped = await bootstrapOlderPosts(allPosts);

    // Find posts that haven't been sent newsletters yet
    const unsentSlugs = await getUnsentPostSlugs(allPostSlugs);

    if (unsentSlugs.length === 0) {
      return NextResponse.json(
        {
          message: "No new posts to send newsletters for",
          checked: allPostSlugs.length,
          bootstrapped,
          sent: 0,
        },
        { status: 200 }
      );
    }

    // Get subscribers count
    const subscribers = await getAllSubscribers();
    const subscriberCount = subscribers.length;

    if (subscriberCount === 0) {
      return NextResponse.json(
        {
          message: "No subscribers found",
          checked: allPostSlugs.length,
          unsent: unsentSlugs.length,
        },
        { status: 200 }
      );
    }

    // Send newsletters for all unsent posts
    const results: Array<{
      slug: string;
      title: string;
      sent: number;
      failed: number;
      errors?: string[];
    }> = [];

    for (const slug of unsentSlugs) {
      const post = allPosts.find((p) => p.slug === slug);
      if (!post) continue;

      console.log(`Sending newsletter for post: ${post.title} (${slug})`);
      const { sent, failed, errors } = await sendNewsletterForPost(post);

      // Mark as sent only if at least one email was sent successfully
      if (sent > 0) {
        await markNewsletterAsSent(slug, sent);
      }

      results.push({
        slug,
        title: post.title,
        sent,
        failed,
        ...(errors.length > 0 ? { errors } : {}),
      });

      // Small delay between posts to avoid overwhelming the email service
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const totalSent = results.reduce((sum, r) => sum + r.sent, 0);
    const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);

    return NextResponse.json(
      {
        message: "Automatic newsletter check completed",
        checked: allPostSlugs.length,
        bootstrapped,
        sent: unsentSlugs.length,
        results,
        summary: {
          totalSent,
          totalFailed,
          subscribersCount: subscriberCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auto newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to process automatic newsletter" },
      { status: 500 }
    );
  }
}

// Also support GET for easier webhook/testing
export async function GET(request: NextRequest) {
  try {
    if (!isNewsletterAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all posts
    const allPosts = getAllPosts();
    const allPostSlugs = allPosts.map((post) => post.slug);

    // Find posts that haven't been sent newsletters yet
    const unsentSlugs = await getUnsentPostSlugs(allPostSlugs);

    const subscribers = await getAllSubscribers();

    return NextResponse.json(
      {
        message: "Newsletter status",
        totalPosts: allPostSlugs.length,
        unsentPosts: unsentSlugs.length,
        unsentSlugs,
        subscribersCount: subscribers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auto newsletter GET error:", error);
    return NextResponse.json(
      { error: "Failed to check newsletter status" },
      { status: 500 }
    );
  }
}
