import { NextRequest, NextResponse } from "next/server";

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

    // Check if Web3Forms is configured
    const accessKey =
      process.env.WEB3FORMS_ACCESS_KEY ||
      "50d76527-8aaa-4be3-9610-af0ea18a4abe";
    const successUrl =
      process.env.WEB3FORMS_SUCCESS_URL ||
      "https://abhinavsingh.online/subscribe";

    // Send subscription to Web3Forms
    try {
      // Web3Forms expects form data format
      const formData = new URLSearchParams();
      formData.append("access_key", accessKey);
      formData.append("email", email);
      formData.append("subject", "New Newsletter Subscription");
      formData.append("from_name", "Blog Newsletter");
      formData.append("message", `New newsletter subscription from: ${email}`);
      formData.append("success_url", successUrl);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("Web3Forms error:", errorText);
        throw new Error(`Web3Forms returned status ${response.status}`);
      }

      const responseData = await response.json().catch(() => ({}));

      // Web3Forms returns { success: true } on success
      if (responseData.success === false) {
        throw new Error(responseData.message || "Subscription failed");
      }

      return NextResponse.json(
        { message: "Successfully subscribed to newsletter" },
        { status: 200 }
      );
    } catch (web3formsError: unknown) {
      const error = web3formsError as { message?: string };
      console.error("Web3Forms error:", error);

      // Handle specific errors
      if (
        error.message?.includes("429") ||
        error.message?.includes("rate limit")
      ) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }

      if (
        error.message?.includes("Invalid") ||
        error.message?.includes("invalid")
      ) {
        return NextResponse.json(
          { error: "Invalid email or configuration. Please contact support." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Failed to process subscription. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription. Please try again later." },
      { status: 500 }
    );
  }
}
