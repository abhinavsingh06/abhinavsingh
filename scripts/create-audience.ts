/**
 * Script to create a Resend Audience
 *
 * Usage:
 * 1. Make sure you have RESEND_API_KEY in your .env.local file
 * 2. Run: npx tsx scripts/create-audience.ts
 *
 * Or with ts-node:
 * npx ts-node scripts/create-audience.ts
 */

import { Resend } from "resend";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const resend = new Resend(process.env.RESEND_API_KEY);

async function createAudience() {
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is not set in .env.local");
    console.log("\nPlease add your Resend API key to .env.local:");
    console.log("RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    process.exit(1);
  }

  const audienceName = process.argv[2] || "Newsletter Subscribers";

  try {
    console.log(`📧 Creating audience: "${audienceName}"...`);

    const { data, error } = await resend.audiences.create({
      name: audienceName,
    });

    if (error) {
      console.error("❌ Error creating audience:", error);
      process.exit(1);
    }

    if (data) {
      console.log("\n✅ Audience created successfully!");
      console.log("\n📋 Add this to your .env.local file:");
      console.log(`RESEND_AUDIENCE_ID=${data.id}\n`);
      console.log("Audience Details:");
      console.log(`  Name: ${data.name}`);
      console.log(`  ID: ${data.id}`);
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

createAudience();
