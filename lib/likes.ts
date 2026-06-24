import fs from "fs";
import path from "path";
import { getKv } from "./kv";

const likesFile = path.join(process.cwd(), "data", "post-likes.json");
type PostLikes = Record<string, string[]>;

function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readLikesFile(): PostLikes {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(likesFile)) {
      fs.writeFileSync(likesFile, JSON.stringify({}, null, 2));
    }
    const content = fs.readFileSync(likesFile, "utf8");
    return JSON.parse(content) as PostLikes;
  } catch (error) {
    console.error("Error reading like counts:", error);
    return {};
  }
}

function writeLikesFile(likes: PostLikes) {
  ensureDataDirectory();
  fs.writeFileSync(likesFile, JSON.stringify(likes, null, 2));
}

function likesKey(slug: string) {
  return `likes:${slug}`;
}

export async function getLikeCount(slug: string): Promise<number> {
  const kv = getKv();
  if (kv) {
    return (await kv.scard(likesKey(slug))) ?? 0;
  }
  const likes = readLikesFile();
  return likes[slug]?.length ?? 0;
}

export async function hasUserLiked(
  slug: string,
  userId: string
): Promise<boolean> {
  const kv = getKv();
  if (kv) {
    return Boolean(await kv.sismember(likesKey(slug), userId));
  }
  const likes = readLikesFile();
  return likes[slug]?.includes(userId) ?? false;
}

export async function toggleLike(
  slug: string,
  userId: string
): Promise<{ likes: number; liked: boolean }> {
  const kv = getKv();
  if (kv) {
    const key = likesKey(slug);
    const alreadyLiked = await kv.sismember(key, userId);
    if (alreadyLiked) {
      await kv.srem(key, userId);
    } else {
      await kv.sadd(key, userId);
    }
    const likes = (await kv.scard(key)) ?? 0;
    return { likes, liked: !alreadyLiked };
  }

  const allLikes = readLikesFile();
  const users = allLikes[slug] ?? [];
  const index = users.indexOf(userId);

  if (index >= 0) {
    users.splice(index, 1);
  } else {
    users.push(userId);
  }

  allLikes[slug] = users;
  writeLikesFile(allLikes);

  return { likes: users.length, liked: index < 0 };
}

export async function getLikeState(
  slug: string,
  userId?: string
): Promise<{ likes: number; liked: boolean }> {
  const likes = await getLikeCount(slug);
  const liked = userId ? await hasUserLiked(slug, userId) : false;
  return { likes, liked };
}

/** Sync read for static build — always 0 in production without local file */
export function getLikeCountSync(slug: string): number {
  const likes = readLikesFile();
  return likes[slug]?.length ?? 0;
}
