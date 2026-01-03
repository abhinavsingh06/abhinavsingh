import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, BlogPost } from "@/lib/posts";
import { getAllSubscribers } from "@/lib/subscribers";
import {
  hasNewsletterBeenSent,
  markNewsletterAsSent,
  getUnsentPostSlugs,
} from "@/lib/newsletter-tracker";

// Newsletter email HTML template for new blog posts
const getNewsletterHTML = (post: BlogPost) => {
  const postUrl = `https://abhinavsingh.online/blog/${post.slug}`;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Blog Post: ${post.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #cffafe 100%);">
  <table role="presentation" style="width: 100%; border-collapse: collapse; padding: 20px;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.1);">
          <!-- Ocean Wave Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #0891b2 30%, #06b6d4 60%, #22d3ee 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.1; background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px);"></div>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; text-shadow: 0 4px 8px rgba(0,0,0,0.2); position: relative; z-index: 1;">
                🌊 New Blog Post! 🌊
              </h1>
              <p style="margin: 15px 0 0 0; color: rgba(255,255,255,0.95); font-size: 16px; position: relative; z-index: 1;">
                Fresh content from the ocean of knowledge
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 45px 35px; background: linear-gradient(to bottom, rgba(255,255,255,0.98) 0%, rgba(240, 249, 255, 0.95) 100%);">
              <h2 style="margin: 0 0 20px 0; color: #1e40af; font-size: 28px; font-weight: bold; line-height: 1.3;">
                ${post.title}
              </h2>
              
              <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px; flex-wrap: wrap;">
                <span style="display: inline-flex; align-items: center; gap: 5px; color: #0891b2; font-size: 14px; font-weight: 500;">
                  📅 ${new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span style="display: inline-flex; align-items: center; gap: 5px; color: #06b6d4; font-size: 14px; font-weight: 500;">
                  ⏱️ ${post.readTime}
                </span>
                <span style="display: inline-flex; align-items: center; gap: 5px; color: #1e40af; font-size: 14px; font-weight: 500; background: rgba(30, 64, 175, 0.1); padding: 4px 12px; border-radius: 12px;">
                  🏷️ ${post.category}
                </span>
              </div>
              
              <p style="margin: 0 0 30px 0; color: #1e3a8a; font-size: 17px; line-height: 1.8; font-style: italic; border-left: 4px solid #3b82f6; padding-left: 20px; background: rgba(30, 64, 175, 0.05); padding: 15px 20px; border-radius: 8px;">
                ${post.excerpt}
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${postUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #0891b2 50%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 25px; font-weight: 600; font-size: 17px; box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3); transition: transform 0.2s;">
                  Read Full Article 🐠
                </a>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; width: 60px; height: 4px; background: linear-gradient(90deg, #1e40af 0%, #0891b2 50%, #06b6d4 100%); border-radius: 2px;"></div>
                <span style="margin: 0 15px; color: #0891b2; font-size: 24px;">🐠</span>
                <div style="display: inline-block; width: 60px; height: 4px; background: linear-gradient(90deg, #06b6d4 0%, #0891b2 50%, #1e40af 100%); border-radius: 2px;"></div>
              </div>
              
              <p style="margin: 25px 0; color: #1e3a8a; font-size: 16px; line-height: 1.7; text-align: center;">
                Thanks for being part of our community! If you have any questions or feedback, feel free to reply to this email.
              </p>
              
              <p style="margin: 30px 0 0 0; color: #1e3a8a; font-size: 16px; line-height: 1.7;">
                Happy reading! 📚✨
              </p>
              
              <p style="margin: 35px 0 0 0; color: #1e3a8a; font-size: 17px; line-height: 1.7;">
                Best regards,<br>
                <strong style="color: #1e40af; font-size: 18px;">Abhinav Singh</strong><br>
                <span style="color: #0891b2; font-size: 15px;">Software Engineer & Tech Enthusiast</span>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%); padding: 35px 30px; text-align: center; border-top: 3px solid transparent; border-image: linear-gradient(90deg, #1e40af 0%, #0891b2 50%, #06b6d4 100%) 1;">
              <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                You're receiving this because you subscribed to my newsletter at <a href="https://abhinavsingh.online" style="color: #3b82f6; text-decoration: none; font-weight: 600;">abhinavsingh.online</a>
              </p>
              <p style="margin: 0 0 15px 0;">
                <a href="${postUrl}" style="color: #3b82f6; text-decoration: none; margin: 0 12px; font-weight: 500; font-size: 14px;">Read Article</a>
                <span style="color: #cbd5e1;">|</span>
                <a href="https://abhinavsingh.online" style="color: #3b82f6; text-decoration: none; margin: 0 12px; font-weight: 500; font-size: 14px;">Visit Blog</a>
                <span style="color: #cbd5e1;">|</span>
                <a href="mailto:abhinavsingh9986@gmail.com?subject=Unsubscribe" style="color: #3b82f6; text-decoration: none; margin: 0 12px; font-weight: 500; font-size: 14px;">Unsubscribe</a>
              </p>
              <p style="margin: 15px 0 0 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                © ${new Date().getFullYear()} Abhinav Singh. All rights reserved.<br>
                <span style="color: #cbd5e1;">🌊 Made with passion for sharing knowledge</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Send email via EmailJS
async function sendEmailViaEmailJS(
  toEmail: string,
  subject: string,
  htmlContent: string
): Promise<boolean> {
  try {
    const emailjsServiceId =
      process.env.EMAILJS_SERVICE_ID || "service_7nmxoqi";
    const emailjsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
    const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY;

    if (!emailjsTemplateId || !emailjsPublicKey) {
      console.error("EmailJS not configured");
      return false;
    }

    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: emailjsServiceId,
          template_id: emailjsTemplateId,
          user_id: emailjsPublicKey,
          template_params: {
            to_email: toEmail,
            to_name: "Subscriber",
            from_name: "Abhinav Singh",
            from_email: "abhinavsingh9986@gmail.com",
            subject: subject,
            message_html: htmlContent,
            reply_to: "abhinavsingh9986@gmail.com",
          },
        }),
      }
    );

    if (!response.ok) {
      const responseData = await response.json().catch(() => ({}));
      console.error("EmailJS error:", responseData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Send newsletter for a specific post
async function sendNewsletterForPost(post: BlogPost): Promise<{
  sent: number;
  failed: number;
}> {
  const subscribers = getAllSubscribers();
  if (subscribers.length === 0) {
    return { sent: 0, failed: 0 };
  }

  const subject = `🌊 New Blog Post: ${post.title}`;
  const htmlContent = getNewsletterHTML(post);

  let sentCount = 0;
  let failedCount = 0;

  for (const subscriber of subscribers) {
    const success = await sendEmailViaEmailJS(
      subscriber.email,
      subject,
      htmlContent
    );
    if (success) {
      sentCount++;
    } else {
      failedCount++;
    }
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return { sent: sentCount, failed: failedCount };
}

export async function POST(request: NextRequest) {
  try {
    // Optional: Add secret authentication
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.NEWSLETTER_SECRET || "your-secret-key";

    // Check if secret is provided (optional - can be disabled by not setting NEWSLETTER_SECRET)
    if (
      expectedSecret !== "your-secret-key" &&
      authHeader !== `Bearer ${expectedSecret}`
    ) {
      // Also check query parameter for webhook compatibility
      const url = new URL(request.url);
      const secretParam = url.searchParams.get("secret");
      if (secretParam !== expectedSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Get all posts
    const allPosts = getAllPosts();
    const allPostSlugs = allPosts.map((post) => post.slug);

    // Find posts that haven't been sent newsletters yet
    const unsentSlugs = getUnsentPostSlugs(allPostSlugs);

    if (unsentSlugs.length === 0) {
      return NextResponse.json(
        {
          message: "No new posts to send newsletters for",
          checked: allPostSlugs.length,
          sent: 0,
        },
        { status: 200 }
      );
    }

    // Get subscribers count
    const subscribers = getAllSubscribers();
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
    }> = [];

    for (const slug of unsentSlugs) {
      const post = allPosts.find((p) => p.slug === slug);
      if (!post) continue;

      console.log(`Sending newsletter for post: ${post.title} (${slug})`);
      const { sent, failed } = await sendNewsletterForPost(post);

      // Mark as sent only if at least one email was sent successfully
      if (sent > 0) {
        markNewsletterAsSent(slug, sent);
      }

      results.push({
        slug,
        title: post.title,
        sent,
        failed,
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
    // Optional: Add secret authentication
    const url = new URL(request.url);
    const secretParam = url.searchParams.get("secret");
    const expectedSecret = process.env.NEWSLETTER_SECRET || "your-secret-key";

    if (
      expectedSecret !== "your-secret-key" &&
      secretParam !== expectedSecret
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all posts
    const allPosts = getAllPosts();
    const allPostSlugs = allPosts.map((post) => post.slug);

    // Find posts that haven't been sent newsletters yet
    const unsentSlugs = getUnsentPostSlugs(allPostSlugs);

    const subscribers = getAllSubscribers();

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
