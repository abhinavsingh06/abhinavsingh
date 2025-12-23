import { NextRequest, NextResponse } from "next/server";

// Welcome email HTML template with enhanced ocean theme
const getWelcomeEmailHTML = () => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Abhinav Singh's Newsletter</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #cffafe 100%);">
  <table role="presentation" style="width: 100%; border-collapse: collapse; padding: 20px;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.1);">
          <!-- Ocean Wave Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #0891b2 30%, #06b6d4 60%, #22d3ee 100%); padding: 50px 30px; text-align: center; position: relative; overflow: hidden;">
              <!-- Decorative wave pattern -->
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.1; background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px);"></div>
              <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: bold; text-shadow: 0 4px 8px rgba(0,0,0,0.2); position: relative; z-index: 1;">
                🌊 Welcome to the Ocean! 🌊
              </h1>
              <p style="margin: 15px 0 0 0; color: rgba(255,255,255,0.95); font-size: 18px; position: relative; z-index: 1;">
                Dive into the depths of tech knowledge
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 45px 35px; background: linear-gradient(to bottom, rgba(255,255,255,0.98) 0%, rgba(240, 249, 255, 0.95) 100%);">
              <h2 style="margin: 0 0 25px 0; color: #1e40af; font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #1e40af 0%, #0891b2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                Thanks for Subscribing! 🎉
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #1e3a8a; font-size: 17px; line-height: 1.7;">
                Hi there! 👋
              </p>
              
              <p style="margin: 0 0 25px 0; color: #1e3a8a; font-size: 17px; line-height: 1.7;">
                I'm absolutely thrilled to have you join my newsletter! You're now part of an amazing community of developers, tech enthusiasts, and curious minds diving deep into the ocean of knowledge together.
              </p>
              
              <!-- Ocean-themed divider -->
              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; width: 60px; height: 4px; background: linear-gradient(90deg, #1e40af 0%, #0891b2 50%, #06b6d4 100%); border-radius: 2px;"></div>
                <span style="margin: 0 15px; color: #0891b2; font-size: 24px;">🐠</span>
                <div style="display: inline-block; width: 60px; height: 4px; background: linear-gradient(90deg, #06b6d4 0%, #0891b2 50%, #1e40af 100%); border-radius: 2px;"></div>
              </div>
              
              <p style="margin: 25px 0 15px 0; color: #1e40af; font-size: 18px; font-weight: 600;">
                🌊 What to expect in your inbox:
              </p>
              
              <ul style="margin: 0 0 25px 0; padding-left: 25px; color: #1e3a8a; font-size: 16px; line-height: 2;">
                <li style="margin-bottom: 12px;">📚 <strong>Latest blog posts</strong> on software development, web technologies, and programming insights</li>
                <li style="margin-bottom: 12px;">💡 <strong>Tips & tricks</strong> and best practices from real-world experience</li>
                <li style="margin-bottom: 12px;">🚀 <strong>Project updates</strong> and experiments I'm working on</li>
                <li style="margin-bottom: 12px;">🎯 <strong>Exclusive content</strong> you won't find anywhere else</li>
                <li style="margin-bottom: 12px;">🌊 <strong>Deep dives</strong> into interesting tech topics</li>
              </ul>
              
              <!-- Ocean-themed quote box -->
              <div style="background: linear-gradient(135deg, rgba(30, 64, 175, 0.08) 0%, rgba(8, 145, 178, 0.08) 50%, rgba(6, 182, 212, 0.08) 100%); border-left: 5px solid #3b82f6; border-radius: 12px; padding: 25px; margin: 35px 0; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);">
                <p style="margin: 0; color: #1e40af; font-size: 17px; line-height: 1.7; font-style: italic; text-align: center;">
                  "Like the ocean, knowledge has no boundaries. Let's explore its depths together." 🌊
                </p>
              </div>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="https://abhinavsingh.online" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #0891b2 50%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 25px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3); transition: transform 0.2s;">
                  Explore My Blog 🐠
                </a>
              </div>
              
              <p style="margin: 25px 0; color: #1e3a8a; font-size: 16px; line-height: 1.7;">
                Feel free to explore my blog and let me know if you have any questions or topics you'd like me to cover. I love hearing from readers!
              </p>
              
              <p style="margin: 25px 0 0 0; color: #1e3a8a; font-size: 16px; line-height: 1.7;">
                Happy coding, and welcome to the community! 💻✨
              </p>
              
              <p style="margin: 35px 0 0 0; color: #1e3a8a; font-size: 17px; line-height: 1.7;">
                Best regards,<br>
                <strong style="color: #1e40af; font-size: 18px;">Abhinav Singh</strong><br>
                <span style="color: #0891b2; font-size: 15px;">Software Engineer & Tech Enthusiast</span><br>
                <span style="color: #64748b; font-size: 14px;">Diving deep into the ocean of technology 🌊</span>
              </p>
            </td>
          </tr>
          
          <!-- Ocean-themed Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%); padding: 35px 30px; text-align: center; border-top: 3px solid transparent; border-image: linear-gradient(90deg, #1e40af 0%, #0891b2 50%, #06b6d4 100%) 1;">
              <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                You're receiving this email because you subscribed to my newsletter at <a href="https://abhinavsingh.online" style="color: #3b82f6; text-decoration: none; font-weight: 600;">abhinavsingh.online</a>
              </p>
              <div style="margin: 20px 0;">
                <a href="https://abhinavsingh.online" style="color: #3b82f6; text-decoration: none; margin: 0 12px; font-weight: 500; font-size: 14px;">Visit Blog</a>
                <span style="color: #cbd5e1;">|</span>
                <a href="mailto:abhinavsingh9986@gmail.com" style="color: #3b82f6; text-decoration: none; margin: 0 12px; font-weight: 500; font-size: 14px;">Contact Me</a>
              </div>
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

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check if EmailJS is configured
    const emailjsServiceId =
      process.env.EMAILJS_SERVICE_ID || "service_7nmxoqi";
    const emailjsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
    const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY;

    if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
      // If EmailJS is not configured, we'll use a simple approach
      // For now, just log that we would send the email
      console.log("Welcome email would be sent to:", email);
      console.log(
        "EmailJS not configured. Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY to enable welcome emails."
      );

      // Return success anyway so the subscription flow continues
      return NextResponse.json(
        { message: "Welcome email queued (EmailJS not configured)" },
        { status: 200 }
      );
    }

    // Send welcome email via EmailJS
    try {
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
              to_email: email,
              to_name: "Subscriber",
              from_name: "Abhinav Singh",
              from_email: "abhinavsingh9986@gmail.com",
              subject: "🎉 Welcome to My Newsletter!",
              message_html: getWelcomeEmailHTML(),
              reply_to: "abhinavsingh9986@gmail.com",
            },
          }),
        }
      );

      const responseData = await response.json().catch(async () => {
        const text = await response.text();
        return { text, status: response.status };
      });

      if (!response.ok) {
        console.error("EmailJS error:", {
          status: response.status,
          data: responseData,
        });
        // Don't fail the subscription if email fails
        return NextResponse.json(
          { message: "Subscribed, but welcome email failed to send" },
          { status: 200 }
        );
      }

      console.log("Welcome email sent successfully to:", email);
      return NextResponse.json(
        { message: "Welcome email sent successfully" },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Welcome email error:", emailError);
      // Don't fail the subscription if email fails
      return NextResponse.json(
        { message: "Subscribed, but welcome email failed to send" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Welcome email API error:", error);
    // Don't fail the subscription if email fails
    return NextResponse.json(
      { message: "Subscribed, but welcome email failed to send" },
      { status: 200 }
    );
  }
}
