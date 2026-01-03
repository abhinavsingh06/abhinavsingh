#!/usr/bin/env tsx
/**
 * Test script for welcome email
 *
 * Usage:
 *   npx tsx scripts/test-welcome-email.ts <email>
 *
 * Example:
 *   npx tsx scripts/test-welcome-email.ts test@example.com
 */

import * as dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const email = process.argv[2];

if (!email) {
  console.error("❌ Error: Email address required");
  console.log("\nUsage:");
  console.log("  npx tsx scripts/test-welcome-email.ts <email>");
  console.log("\nExample:");
  console.log("  npx tsx scripts/test-welcome-email.ts test@example.com");
  process.exit(1);
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function testWelcomeEmail() {
  console.log("📧 Testing welcome email...\n");
  console.log(`Email: ${email}`);
  console.log(`API URL: ${baseUrl}/api/welcome-email\n`);

  try {
    const response = await fetch(`${baseUrl}/api/welcome-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    console.log(`HTTP Status: ${response.status}`);
    console.log("\nResponse:");
    console.log(JSON.stringify(data, null, 2));

    if (response.ok && data.message?.includes("successfully")) {
      console.log("\n✅ Welcome email sent successfully!");
      console.log("Check your inbox (and spam folder) for the welcome email!");
    } else if (data.error || data.message?.includes("failed")) {
      console.log("\n❌ Welcome email failed to send");
      console.log(`\nMessage: ${data.message}`);

      if (data.status) {
        console.log(`\nHTTP Status from EmailJS: ${data.status}`);
      }

      if (data.statusText) {
        console.log(`Status Text: ${data.statusText}`);
      }

      if (data.error || data.emailjsError) {
        const error = data.error || data.emailjsError;
        console.log("\n📋 EmailJS Error Details:");
        if (typeof error === "object") {
          console.log(JSON.stringify(error, null, 2));
        } else {
          console.log(error);
        }
      }

      if (data.configured) {
        console.log("\n⚙️  EmailJS Configuration Status:");
        console.log(
          `  Service ID: ${data.configured.serviceId ? "✅ Set" : "❌ Missing"}`
        );
        console.log(
          `  Template ID: ${
            data.configured.templateId ? "✅ Set" : "❌ Missing"
          }`
        );
        console.log(
          `  Public Key: ${data.configured.publicKey ? "✅ Set" : "❌ Missing"}`
        );
      }

      console.log("\n💡 Troubleshooting Steps:");
      console.log(
        "1. Check server logs (terminal where 'npm run dev' is running) for detailed errors"
      );
      console.log("2. Verify BREVO_API_KEY in .env.local is correct");
      console.log("3. Check Brevo dashboard: https://app.brevo.com/");
      console.log("4. Verify your sender email is verified in Brevo");
      console.log(
        "5. Check Brevo quota (free tier: 300 emails/day, 9,000/month)"
      );
      console.log(
        "6. Check Brevo Statistics → Email activity for delivery status"
      );
    } else {
      console.log("\n⚠️  Unexpected response");
    }
  } catch (error) {
    console.error("\n❌ Error testing welcome email:", error);
    process.exit(1);
  }
}

testWelcomeEmail();
