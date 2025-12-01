/**
 * Script to get your Resend Audience ID
 *
 * Usage:
 * 1. Make sure you have RESEND_API_KEY in your .env.local file
 * 2. Run: npx tsx scripts/get-audience-id.ts
 */

import { Resend } from "resend";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const resend = new Resend(process.env.RESEND_API_KEY);

async function getAudienceId() {
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is not set in .env.local");
    console.log("\nPlease add your Resend API key to .env.local:");
    console.log("RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    process.exit(1);
  }

  try {
    console.log("📧 Fetching your audiences...\n");

    const { data, error } = await resend.audiences.list();

    if (error) {
      console.error("❌ Error fetching audiences:", error);
      process.exit(1);
    }

    if (data && data.data && data.data.length > 0) {
      console.log("✅ Found audience(s):\n");
      data.data.forEach((audience, index) => {
        console.log(`${index + 1}. ${audience.name}`);
        console.log(`   ID: ${audience.id}`);
        if ("created_at" in audience && audience.created_at) {
          console.log(`   Created: ${audience.created_at}\n`);
        } else {
          console.log();
        }
      });

      // If there's only one audience, show it prominently
      if (data.data.length === 1) {
        console.log("📋 Add this to your .env.local file:");
        console.log(`RESEND_AUDIENCE_ID=${data.data[0].id}\n`);
      }
    } else {
      console.log("⚠️  No audiences found.");
      console.log("\nYou need to create an audience first.");
      console.log("Option 1: Use the Resend dashboard");
      console.log("Option 2: Run: npx tsx scripts/create-audience.ts\n");
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

getAudienceId();
