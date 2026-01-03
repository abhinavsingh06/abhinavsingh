#!/usr/bin/env tsx
/**
 * Test script for subscribe flow
 *
 * Usage:
 *   npx tsx scripts/test-subscribe.ts <email>
 *
 * Example:
 *   npx tsx scripts/test-subscribe.ts test@example.com
 */

import * as dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const email = process.argv[2];

if (!email) {
  console.error("❌ Error: Email address required");
  console.log("\nUsage:");
  console.log("  npx tsx scripts/test-subscribe.ts <email>");
  console.log("\nExample:");
  console.log("  npx tsx scripts/test-subscribe.ts test@example.com");
  process.exit(1);
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function testSubscribe() {
  console.log("📧 Testing subscribe flow...\n");
  console.log(`Email: ${email}`);
  console.log(`API URL: ${baseUrl}/api/subscribe\n`);

  // Check environment variables
  console.log("🔍 Checking environment variables...");
  const brevoApiKey = process.env.BREVO_API_KEY;
  console.log(`BREVO_API_KEY: ${brevoApiKey ? "✅ Set" : "❌ Missing"}`);
  if (brevoApiKey) {
    console.log(`  Key preview: ${brevoApiKey.substring(0, 20)}...`);
  }
  console.log();

  try {
    console.log("📤 Calling subscribe API...");
    const response = await fetch(`${baseUrl}/api/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    console.log(`\nHTTP Status: ${response.status}`);
    console.log("\nResponse:");
    console.log(JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("\n✅ Subscribe API call successful!");
      console.log("\n💡 Next steps:");
      console.log(
        "1. Check server logs (terminal where 'npm run dev' is running)"
      );
      console.log("2. Check Brevo dashboard → Contacts → All contacts");
      console.log("3. Check inbox for welcome email");
    } else {
      console.log("\n❌ Subscribe API call failed");
      if (data.error) {
        console.log(`Error: ${data.error}`);
      }
    }
  } catch (error) {
    console.error("\n❌ Error testing subscribe:", error);
    process.exit(1);
  }
}

testSubscribe();
