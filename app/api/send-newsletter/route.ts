import { NextRequest, NextResponse } from "next/server";
import { getAllSubscribers } from "@/lib/subscribers";
import { getPostBySlug } from "@/lib/posts";
import { sendEmailViaBrevo, getBrevoSender } from "@/lib/email";
import {
  getNewsletterPostEmailHTML,
  getNewsletterPostSubject,
} from "@/lib/email-templates";

// Send email via Brevo
async function sendEmailViaBrevoWrapper(
  toEmail: string,
  subject: string,
  htmlContent: string
): Promise<boolean> {
  const sender = getBrevoSender();
  const result = await sendEmailViaBrevo({
    to: toEmail,
    toName: "Subscriber",
    subject: subject,
    htmlContent: htmlContent,
    fromEmail: sender.email,
    fromName: sender.name,
    replyTo: sender.replyTo,
  });

  return result.success;
}

export async function POST(request: NextRequest) {
  try {
    const { slug, secret } = await request.json();

    // Simple secret check (you can improve this)
    const expectedSecret = process.env.NEWSLETTER_SECRET || "your-secret-key";
    if (secret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    // Get the blog post
    const post = getPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get all subscribers
    const subscribers = await getAllSubscribers();
    if (subscribers.length === 0) {
      return NextResponse.json(
        { message: "No subscribers found", sent: 0 },
        { status: 200 }
      );
    }

    // Prepare email content
    const subject = getNewsletterPostSubject(post);
    const htmlContent = getNewsletterPostEmailHTML(post);

    // Send emails to all subscribers
    let sentCount = 0;
    let failedCount = 0;

    for (const subscriber of subscribers) {
      const success = await sendEmailViaBrevoWrapper(
        subscriber.email,
        subject,
        htmlContent
      );
      if (success) {
        sentCount++;
      } else {
        failedCount++;
      }
      // Small delay to avoid rate limiting (Brevo allows 300 emails/day free)
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return NextResponse.json(
      {
        message: "Newsletter sent",
        sent: sentCount,
        failed: failedCount,
        total: subscribers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter sending error:", error);
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
}
