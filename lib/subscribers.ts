import fs from "fs";
import path from "path";

const subscribersFile = path.join(process.cwd(), "data", "subscribers.json");

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Initialize subscribers file if it doesn't exist
function initializeSubscribersFile() {
  ensureDataDirectory();
  if (!fs.existsSync(subscribersFile)) {
    fs.writeFileSync(subscribersFile, JSON.stringify([], null, 2));
  }
}

export interface Subscriber {
  email: string;
  subscribedAt: string;
  active: boolean;
}

// Get all subscribers
export function getAllSubscribers(): Subscriber[] {
  try {
    initializeSubscribersFile();
    const content = fs.readFileSync(subscribersFile, "utf8");
    const subscribers = JSON.parse(content) as Subscriber[];
    return subscribers.filter((sub) => sub.active !== false);
  } catch (error) {
    console.error("Error reading subscribers:", error);
    return [];
  }
}

// Add a new subscriber
export function addSubscriber(email: string): boolean {
  try {
    initializeSubscribersFile();
    const subscribers = getAllSubscribers();

    // Check if email already exists
    if (
      subscribers.some((sub) => sub.email.toLowerCase() === email.toLowerCase())
    ) {
      return false; // Already subscribed
    }

    const newSubscriber: Subscriber = {
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      active: true,
    };

    subscribers.push(newSubscriber);
    fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
    return true;
  } catch (error) {
    console.error("Error adding subscriber:", error);
    return false;
  }
}

// Remove a subscriber (unsubscribe)
export function removeSubscriber(email: string): boolean {
  try {
    initializeSubscribersFile();
    const subscribers = getAllSubscribers();
    const updated = subscribers.map((sub) =>
      sub.email.toLowerCase() === email.toLowerCase()
        ? { ...sub, active: false }
        : sub
    );
    fs.writeFileSync(subscribersFile, JSON.stringify(updated, null, 2));
    return true;
  } catch (error) {
    console.error("Error removing subscriber:", error);
    return false;
  }
}

// Get subscriber count
export function getSubscriberCount(): number {
  return getAllSubscribers().length;
}
