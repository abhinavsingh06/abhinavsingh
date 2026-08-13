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
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return { sent: sentCount, failed: failedCount, errors };
}

function newestFirst(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** Mark leftover unsent posts as handled so the backlog never emails. */
async function hushUnsentExcept(
  allPosts: BlogPost[],
  keepSlug: string | null
): Promise<string[]> {
  const unsent = await getUnsentPostSlugs(allPosts.map((post) => post.slug));
  const hushed: string[] = [];

  for (const slug of unsent) {
    if (keepSlug && slug === keepSlug) continue;
    await markNewsletterAsSent(slug, 0);
    hushed.push(slug);
  }

  return hushed;
}

export async function POST(request: NextRequest) {
  try {
    if (!isNewsletterAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allPosts = newestFirst(getAllPosts());
    const requestedSlug = new URL(request.url).searchParams.get("slug")?.trim();

    if (requestedSlug) {
      const post = allPosts.find((p) => p.slug === requestedSlug);
      if (!post) {
        return NextResponse.json(
          {
            error: "Post not deployed yet",
            slug: requestedSlug,
          },
          { status: 409 }
        );
      }

      const unsent = await getUnsentPostSlugs(allPosts.map((p) => p.slug));
      const alreadySent = !unsent.includes(requestedSlug);
      const hushed = await hushUnsentExcept(allPosts, requestedSlug);

      if (alreadySent) {
        return NextResponse.json({
          message: "Requested post already had a newsletter",
          slug: requestedSlug,
          sent: 0,
          hushed,
        });
      }

      const subscribers = await getAllSubscribers();
      if (subscribers.length === 0) {
        return NextResponse.json({
          message: "No subscribers found",
          slug: requestedSlug,
          sent: 0,
          hushed,
        });
      }

      const { sent, failed, errors } = await sendNewsletterForPost(post);
      if (sent > 0) {
        await markNewsletterAsSent(requestedSlug, sent);
      }

      return NextResponse.json({
        message: "Newsletter sent for requested post",
        slug: requestedSlug,
        title: post.title,
        sent,
        failed,
        hushed,
        ...(errors.length > 0 ? { errors } : {}),
      });
    }

    const newest = allPosts[0];
    if (!newest) {
      return NextResponse.json({ message: "No posts found", sent: 0 });
    }

    const unsent = await getUnsentPostSlugs(allPosts.map((p) => p.slug));
    const newestUnsent = unsent.includes(newest.slug);
    const hushed = await hushUnsentExcept(
      allPosts,
      newestUnsent ? newest.slug : null
    );

    if (!newestUnsent) {
      return NextResponse.json({
        message: "Newest post already sent; backlog cleared",
        newest: newest.slug,
        checked: allPosts.length,
        hushed,
        sent: 0,
      });
    }

    const subscribers = await getAllSubscribers();
    if (subscribers.length === 0) {
      return NextResponse.json({
        message: "No subscribers found",
        newest: newest.slug,
        hushed,
        sent: 0,
      });
    }

    const { sent, failed, errors } = await sendNewsletterForPost(newest);
    if (sent > 0) {
      await markNewsletterAsSent(newest.slug, sent);
    }

    return NextResponse.json({
      message: "Newsletter sent for newest post only",
      slug: newest.slug,
      title: newest.title,
      checked: allPosts.length,
      hushed,
      sent,
      failed,
      ...(errors.length > 0 ? { errors } : {}),
    });
  } catch (error) {
    console.error("Auto newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to process automatic newsletter" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!isNewsletterAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allPosts = newestFirst(getAllPosts());
    const allPostSlugs = allPosts.map((post) => post.slug);
    const unsentSlugs = await getUnsentPostSlugs(allPostSlugs);
    const subscribers = await getAllSubscribers();

    return NextResponse.json({
      message: "Newsletter status",
      totalPosts: allPostSlugs.length,
      newest: allPosts[0]?.slug ?? null,
      unsentPosts: unsentSlugs.length,
      unsentSlugs,
      wouldSend: unsentSlugs.includes(allPosts[0]?.slug ?? "")
        ? allPosts[0]?.slug
        : null,
      subscribersCount: subscribers.length,
    });
  } catch (error) {
    console.error("Auto newsletter GET error:", error);
    return NextResponse.json(
      { error: "Failed to check newsletter status" },
      { status: 500 }
    );
  }
}
