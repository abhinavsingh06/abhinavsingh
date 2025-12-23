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
      // Web3Forms supports both JSON and form-data formats
      // Using JSON format for better reliability
      const payload = {
        access_key: accessKey,
        email: email,
        subject: "New Newsletter Subscription",
        from_name: "Blog Newsletter",
        message: `New newsletter subscription from: ${email}`,
        success_url: successUrl,
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch {
        // If response is not JSON, log it for debugging
        console.error("Web3Forms non-JSON response:", responseText);
        responseData = { success: false, message: responseText };
      }

      if (!response.ok) {
        console.error("Web3Forms API error:", {
          status: response.status,
          statusText: response.statusText,
          body: responseData,
        });

        // Handle specific error cases
        if (response.status === 429) {
          return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
          );
        }

        if (response.status === 400 || response.status === 422) {
          return NextResponse.json(
            {
              error:
                responseData.message ||
                "Invalid request. Please check your email address.",
            },
            { status: 400 }
          );
        }

        throw new Error(
          responseData.message || `Web3Forms returned status ${response.status}`
        );
      }

      // Web3Forms returns { success: true } on success
      if (responseData.success === false) {
        console.error("Web3Forms returned success: false", responseData);
        throw new Error(responseData.message || "Subscription failed");
      }

      // Success!
      console.log("Newsletter subscription successful:", email);
      return NextResponse.json(
        { message: "Successfully subscribed to newsletter" },
        { status: 200 }
      );
    } catch (web3formsError: unknown) {
      const error = web3formsError as { message?: string };
      console.error("Web3Forms error details:", {
        error,
        email,
        accessKey: accessKey.substring(0, 10) + "...",
      });

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
        error.message?.includes("invalid") ||
        error.message?.includes("access_key")
      ) {
        return NextResponse.json(
          { error: "Invalid configuration. Please contact support." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error: "Failed to process subscription. Please try again later.",
          // Include error details in development
          ...(process.env.NODE_ENV === "development" && {
            details: error.message,
          }),
        },
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
