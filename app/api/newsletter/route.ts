import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Newsletter service is not configured" },
        { status: 500 }
      );
    }

    // Add contact to Resend audience
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!audienceId) {
      console.error("RESEND_AUDIENCE_ID is not configured");
      return NextResponse.json(
        { error: "Newsletter service is not configured" },
        { status: 500 }
      );
    }

    // Create Resend instance only when needed (not at module level)
    const resend = new Resend(apiKey);

    try {
      await resend.contacts.create({
        email,
        audienceId,
      });

      return NextResponse.json(
        { message: "Successfully subscribed to newsletter" },
        { status: 200 }
      );
    } catch (resendError: unknown) {
      // Handle duplicate email error gracefully
      const error = resendError as { message?: string; statusCode?: number };
      if (
        error.message?.includes("already exists") ||
        error.statusCode === 422
      ) {
        return NextResponse.json(
          { message: "You're already subscribed to our newsletter!" },
          { status: 200 }
        );
      }
      throw resendError;
    }
  } catch (error: unknown) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription. Please try again later." },
      { status: 500 }
    );
  }
}
