import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/subscribers";
import * as emailLib from "@/lib/email";
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

    const success = await addSubscriber(email);
    const normalizedEmail = email.toLowerCase();

    const results = {
      subscriberAdded: success,
      brevoContactAdded: false,
      welcomeEmailSent: false,
      errors: [] as string[],
    };

    if (emailLib.isBrevoConfigured()) {
      const contactResult =
        await emailLib.addContactToBrevo(normalizedEmail);
      results.brevoContactAdded = contactResult.success;
      if (!contactResult.success && contactResult.error) {
        results.errors.push(`Brevo contact sync: ${contactResult.error}`);
      }
    } else {
      results.errors.push(
        "BREVO_API_KEY is missing — contact not added to Brevo."
      );
    }

    if (!success) {
      return NextResponse.json(
        {
          message: "Email already subscribed",
          ...results,
        },
        { status: 200 }
      );
    }

    // Send welcome email for new subscribers
    if (emailLib.isBrevoConfigured()) {
      try {
        const sender = emailLib.getBrevoSender();
        const emailResult = await emailLib.sendEmailViaBrevo({
          to: normalizedEmail,
          toName: "Subscriber",
          subject: getWelcomeEmailSubject(),
          htmlContent: getWelcomeEmailHTML(),
          fromEmail: sender.email,
          fromName: sender.name,
          replyTo: sender.replyTo,
        });

        if (emailResult.success) {
          results.welcomeEmailSent = true;
        } else if (emailResult.error) {
          results.errors.push(`Welcome email: ${emailResult.error}`);
        }
      } catch (emailError) {
        results.errors.push(
          `Welcome email error: ${
            emailError instanceof Error ? emailError.message : String(emailError)
          }`
        );
      }
    }

    return NextResponse.json(
      {
        message: "Subscriber added successfully",
        ...results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { error: "Failed to add subscriber" },
      { status: 500 }
    );
  }
}
