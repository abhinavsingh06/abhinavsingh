import fs from "fs";
import path from "path";

const likesFile = path.join(process.cwd(), "data", "post-likes.json");

type PostLikes = Record<string, string[]>;

function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function initializeLikesFile() {
  ensureDataDirectory();
  if (!fs.existsSync(likesFile)) {
    fs.writeFileSync(likesFile, JSON.stringify({}, null, 2));
  }
}

function readLikes(): PostLikes {
  try {
    initializeLikesFile();
    const content = fs.readFileSync(likesFile, "utf8");
    return JSON.parse(content) as PostLikes;
  } catch (error) {
    console.error("Error reading like counts:", error);
    return {};
  }
}

function writeLikes(likes: PostLikes) {
  initializeLikesFile();
  fs.writeFileSync(likesFile, JSON.stringify(likes, null, 2));
}

export function getLikeCount(slug: string): number {
  const likes = readLikes();
  return likes[slug]?.length ?? 0;
}

export function hasUserLiked(slug: string, userId: string): boolean {
  const likes = readLikes();
  return likes[slug]?.includes(userId) ?? false;
}

export function toggleLike(
  slug: string,
  userId: string
): { likes: number; liked: boolean } {
  const allLikes = readLikes();
  const users = allLikes[slug] ?? [];
  const index = users.indexOf(userId);

  if (index >= 0) {
    users.splice(index, 1);
  } else {
    users.push(userId);
  }

  allLikes[slug] = users;
  writeLikes(allLikes);

  return { likes: users.length, liked: index < 0 };
}

export function getLikeState(
  slug: string,
  userId?: string
): { likes: number; liked: boolean } {
  const likes = getLikeCount(slug);
  const liked = userId ? hasUserLiked(slug, userId) : false;
  return { likes, liked };
}
