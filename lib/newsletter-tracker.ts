import fs from "fs";
import path from "path";

const sentNewslettersFile = path.join(
  process.cwd(),
  "data",
  "sent-newsletters.json"
);

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Initialize sent newsletters file if it doesn't exist
function initializeSentNewslettersFile() {
  ensureDataDirectory();
  if (!fs.existsSync(sentNewslettersFile)) {
    fs.writeFileSync(sentNewslettersFile, JSON.stringify([], null, 2));
  }
}

export interface SentNewsletter {
  slug: string;
  sentAt: string;
  subscribersCount: number;
}

// Get all sent newsletters
export function getSentNewsletters(): SentNewsletter[] {
  try {
    initializeSentNewslettersFile();
    const content = fs.readFileSync(sentNewslettersFile, "utf8");
    return JSON.parse(content) as SentNewsletter[];
  } catch (error) {
    console.error("Error reading sent newsletters:", error);
    return [];
  }
}

// Check if a newsletter for a post has been sent
export function hasNewsletterBeenSent(slug: string): boolean {
  const sentNewsletters = getSentNewsletters();
  return sentNewsletters.some((newsletter) => newsletter.slug === slug);
}

// Mark a newsletter as sent
export function markNewsletterAsSent(
  slug: string,
  subscribersCount: number
): void {
  try {
    initializeSentNewslettersFile();
    const sentNewsletters = getSentNewsletters();

    // Remove any existing entry for this slug (in case of re-sending)
    const filtered = sentNewsletters.filter((n) => n.slug !== slug);

    // Add new entry
    const newEntry: SentNewsletter = {
      slug,
      sentAt: new Date().toISOString(),
      subscribersCount,
    };

    filtered.push(newEntry);
    fs.writeFileSync(sentNewslettersFile, JSON.stringify(filtered, null, 2));
  } catch (error) {
    console.error("Error marking newsletter as sent:", error);
  }
}

// Get posts that haven't had newsletters sent yet
export function getUnsentPostSlugs(allPostSlugs: string[]): string[] {
  const sentNewsletters = getSentNewsletters();
  const sentSlugs = new Set(sentNewsletters.map((n) => n.slug));
  return allPostSlugs.filter((slug) => !sentSlugs.has(slug));
}
