import fs from "fs";
import path from "path";
import { isLocalFileStorage } from "./blob-store";
import { getBrevoListEmails } from "./email";
import {
  isPostgresConfigured,
  postgresAddSubscriber,
  postgresGetSubscribers,
  type PostgresSubscriber,
} from "./postgres-store";

const subscribersFile = path.join(process.cwd(), "data", "subscribers.json");

export interface Subscriber {
  email: string;
  subscribedAt: string;
  active: boolean;
}

function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readSubscribersFile(): Subscriber[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(subscribersFile)) return [];
    const content = fs.readFileSync(subscribersFile, "utf8");
    const subscribers = JSON.parse(content) as Subscriber[];
    return subscribers.filter((sub) => sub.active !== false);
  } catch (error) {
    console.error("Error reading subscribers from file:", error);
    return [];
  }
}

function writeSubscribersFile(subscribers: Subscriber[]) {
  ensureDataDirectory();
  fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
}

function addSubscriberFile(email: string): boolean {
  const normalized = email.toLowerCase();
  const subscribers = readSubscribersFile();
  if (subscribers.some((sub) => sub.email.toLowerCase() === normalized)) {
    return false;
  }

  subscribers.push({
    email: normalized,
    subscribedAt: new Date().toISOString(),
    active: true,
  });
  writeSubscribersFile(subscribers);
  return true;
}

function mergeSubscribers(...groups: Subscriber[][]): Subscriber[] {
  const map = new Map<string, Subscriber>();
  for (const group of groups) {
    for (const subscriber of group) {
      if (subscriber.active === false) continue;
      map.set(subscriber.email.toLowerCase(), subscriber);
    }
  }
  return [...map.values()];
}

function brevoEmailsToSubscribers(emails: string[]): Subscriber[] {
  return emails.map((email) => ({
    email: email.toLowerCase(),
    subscribedAt: "",
    active: true,
  }));
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  let fromPostgres: PostgresSubscriber[] = [];
  if (isPostgresConfigured()) {
    try {
      fromPostgres = await postgresGetSubscribers();
    } catch (error) {
      console.error("[subscribers] Postgres read failed:", error);
    }
  }

  const fromFile = isLocalFileStorage() ? readSubscribersFile() : [];

  let fromBrevo: Subscriber[] = [];
  try {
    const brevoEmails = await getBrevoListEmails();
    fromBrevo = brevoEmailsToSubscribers(brevoEmails);
  } catch (error) {
    console.error("[subscribers] Brevo list read failed:", error);
  }

  return mergeSubscribers(fromPostgres, fromFile, fromBrevo);
}

export async function addSubscriber(email: string): Promise<boolean> {
  const normalized = email.toLowerCase();

  if (isPostgresConfigured()) {
    try {
      const added = await postgresAddSubscriber(normalized);
      if (added) return true;

      const existing = await getAllSubscribers();
      if (existing.some((sub) => sub.email.toLowerCase() === normalized)) {
        return false;
      }
    } catch (error) {
      console.error("[subscribers] Postgres write failed:", error);
    }
  }

  if (isLocalFileStorage()) {
    return addSubscriberFile(normalized);
  }

  const existing = await getAllSubscribers();
  return !existing.some((sub) => sub.email.toLowerCase() === normalized);
}

export async function getSubscriberCount(): Promise<number> {
  const subscribers = await getAllSubscribers();
  return subscribers.length;
}
