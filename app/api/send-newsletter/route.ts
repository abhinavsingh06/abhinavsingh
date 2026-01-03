import { NextRequest, NextResponse } from "next/server";
import { getAllSubscribers } from "@/lib/subscribers";
import { getPostBySlug, BlogPost } from "@/lib/posts";

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
    const subscribers = getAllSubscribers();
    if (subscribers.length === 0) {
      return NextResponse.json(
        { message: "No subscribers found", sent: 0 },
        { status: 200 }
      );
    }

    // Prepare email content
    const subject = `🌊 New Blog Post: ${post.title}`;
    const htmlContent = getNewsletterHTML(post);

    // Send emails to all subscribers
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
