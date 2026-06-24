import { NextResponse } from "next/server";
import { getBrevoSenderStatus, isBrevoConfigured } from "@/lib/email";
import { getSubscriberCount } from "@/lib/subscribers";

export async function GET() {
  const senderStatus = await getBrevoSenderStatus();
  const subscribersCount = await getSubscriberCount();

  return NextResponse.json({
    brevoConfigured: isBrevoConfigured(),
    subscribersCount,
    ...senderStatus,
  });
}
