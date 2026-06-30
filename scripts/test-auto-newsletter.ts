#!/usr/bin/env tsx
/**
 * Test script for automatic newsletter system
 *
 * Usage:
 *   npx tsx scripts/test-auto-newsletter.ts [check|send]
 *
 * Examples:
 *   npx tsx scripts/test-auto-newsletter.ts check  # Check status only
 *   npx tsx scripts/test-auto-newsletter.ts send   # Trigger newsletter sending
 */

import * as dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const command = process.argv[2] || "check";
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.abhinavsingh.online";
const secret = process.env.NEWSLETTER_SECRET || "your-secret-key";

async function checkStatus() {
  console.log("🔍 Checking newsletter status...\n");

  try {
    const url = `${baseUrl}/api/auto-newsletter?secret=${secret}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error:", data.error || "Unknown error");
      process.exit(1);
    }

    console.log("📊 Newsletter Status:");
    console.log("─────────────────────");
    console.log(`Total Posts: ${data.totalPosts}`);
    console.log(`Unsent Posts: ${data.unsentPosts}`);
    console.log(`Subscribers: ${data.subscribersCount}`);

    if (data.unsentSlugs && data.unsentSlugs.length > 0) {
      console.log("\n📝 Posts waiting for newsletters:");
      data.unsentSlugs.forEach((slug: string) => {
        console.log(`  • ${slug}`);
      });
    } else {
      console.log("\n✅ All posts have been sent newsletters!");
    }

    console.log();
  } catch (error) {
    console.error("❌ Failed to check status:", error);
    process.exit(1);
  }
}

async function sendNewsletters() {
  console.log("📧 Triggering newsletter sending...\n");

  try {
    const url = `${baseUrl}/api/auto-newsletter?secret=${secret}`;
    const response = await fetch(url, {
      method: "POST",
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error:", data.error || "Unknown error");
      process.exit(1);
    }

    console.log("✅ Newsletter sending completed!\n");
    console.log("📊 Results:");
    console.log("─────────────────────");
    console.log(`Checked: ${data.checked} posts`);
    console.log(`Sent newsletters for: ${data.sent} posts`);

    if (data.summary) {
      console.log(`Total emails sent: ${data.summary.totalSent}`);
      console.log(`Total emails failed: ${data.summary.totalFailed}`);
      console.log(`Subscribers: ${data.summary.subscribersCount}`);
    }

    if (data.results && data.results.length > 0) {
      console.log("\n📝 Post Details:");
      data.results.forEach((result: any) => {
        console.log(`\n  ${result.title} (${result.slug})`);
        console.log(`    Sent: ${result.sent}, Failed: ${result.failed}`);
      });
    }

    if (data.message) {
      console.log(`\n💬 ${data.message}`);
    }

    console.log();
  } catch (error) {
    console.error("❌ Failed to send newsletters:", error);
    process.exit(1);
  }
}

async function main() {
  console.log("🌊 Automatic Newsletter System Test\n");
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Command: ${command}\n`);

  if (command === "check") {
    await checkStatus();
  } else if (command === "send") {
    await sendNewsletters();
  } else {
    console.error(`Unknown command: ${command}`);
    console.log("\nUsage:");
    console.log(
      "  npx tsx scripts/test-auto-newsletter.ts check  # Check status"
    );
    console.log(
      "  npx tsx scripts/test-auto-newsletter.ts send   # Send newsletters"
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
