import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/subscribers";

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

    // Add subscriber
    const success = addSubscriber(email);
    if (!success) {
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Subscriber added successfully" },
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
