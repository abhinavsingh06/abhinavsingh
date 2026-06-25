import { NextRequest, NextResponse } from "next/server";
import {
  sendEmailViaBrevo,
  isBrevoConfigured,
  getBrevoSender,
} from "@/lib/email";
import {
  getWelcomeEmailHTML,
  getWelcomeEmailSubject,
} from "@/lib/email-templates";

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

    // Check if Brevo is configured
    if (!isBrevoConfigured()) {
      console.error("Welcome email failed - Brevo not configured:", {
        email: email,
        hasApiKey: false,
      });
      console.error(
        "Set BREVO_API_KEY environment variable to enable welcome emails."
      );

      return NextResponse.json(
        {
          message: "Welcome email failed - Brevo not configured",
          error: "Missing Brevo API key",
          configured: {
            brevoApiKey: false,
          },
        },
        { status: 200 }
      );
    }

    // Send welcome email via Brevo
    const sender = getBrevoSender();
    const result = await sendEmailViaBrevo({
      to: email,
      toName: "Subscriber",
      subject: getWelcomeEmailSubject(),
      htmlContent: getWelcomeEmailHTML(),
      fromEmail: sender.email,
      fromName: sender.name,
      replyTo: sender.replyTo,
    });

    if (!result.success) {
      console.error("Welcome email failed:", result.error);
      return NextResponse.json(
        {
          message: "Subscribed, but welcome email failed to send",
          error: result.error,
        },
        { status: 200 }
      );
    }

    console.log("Welcome email sent successfully to:", email);
    return NextResponse.json(
      { message: "Welcome email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Welcome email API error:", error);
    return NextResponse.json(
      { message: "Subscribed, but welcome email failed to send" },
      { status: 200 }
    );
  }
}
