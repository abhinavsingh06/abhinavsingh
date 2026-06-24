import fs from "fs";
import path from "path";
import { isLocalFileStorage } from "./blob-store";
import {
  isPostgresConfigured,
  postgresGetSentNewsletterSlugs,
  postgresMarkNewsletterSent,
} from "./postgres-store";

const sentNewslettersFile = path.join(
  process.cwd(),
  "data",
  "sent-newsletters.json"
);

export interface SentNewsletter {
  slug: string;
  sentAt: string;
  subscribersCount: number;
}

function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readSentNewslettersFile(): SentNewsletter[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(sentNewslettersFile)) return [];
    const content = fs.readFileSync(sentNewslettersFile, "utf8");
    return JSON.parse(content) as SentNewsletter[];
  } catch (error) {
    console.error("Error reading sent newsletters from file:", error);
    return [];
  }
}

function writeSentNewslettersFile(newsletters: SentNewsletter[]) {
  ensureDataDirectory();
  fs.writeFileSync(sentNewslettersFile, JSON.stringify(newsletters, null, 2));
}

async function getSentSlugs(): Promise<Set<string>> {
  const slugs = new Set<string>();

  if (isPostgresConfigured()) {
    try {
      for (const slug of await postgresGetSentNewsletterSlugs()) {
        slugs.add(slug);
      }
    } catch (error) {
      console.error("[newsletter-tracker] Postgres read failed:", error);
    }
  }

  if (isLocalFileStorage()) {
    for (const entry of readSentNewslettersFile()) {
      slugs.add(entry.slug);
    }
  }

  return slugs;
}

export async function hasNewsletterBeenSent(slug: string): Promise<boolean> {
  const sentSlugs = await getSentSlugs();
  return sentSlugs.has(slug);
}

export async function markNewsletterAsSent(
  slug: string,
  subscribersCount: number
): Promise<void> {
  if (isPostgresConfigured()) {
    try {
      await postgresMarkNewsletterSent(slug, subscribersCount);
      return;
    } catch (error) {
      console.error("[newsletter-tracker] Postgres write failed:", error);
    }
  }

  if (isLocalFileStorage()) {
    const sentNewsletters = readSentNewslettersFile().filter((n) => n.slug !== slug);
    sentNewsletters.push({
      slug,
      sentAt: new Date().toISOString(),
      subscribersCount,
    });
    writeSentNewslettersFile(sentNewsletters);
  }
}

export async function getUnsentPostSlugs(
  allPostSlugs: string[]
): Promise<string[]> {
  const sentSlugs = await getSentSlugs();
  return allPostSlugs.filter((slug) => !sentSlugs.has(slug));
}
