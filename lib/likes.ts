import fs from "fs";
import path from "path";
import {
  isBlobAvailable,
  isLocalFileStorage,
  readJsonBlob,
  writeJsonBlob,
} from "./blob-store";
import { getKv, warnIfNoPersistentStorage } from "./kv";
import {
  isPostgresConfigured,
  postgresGetLikeCount,
  postgresHasUserLiked,
  postgresToggleLike,
} from "./postgres-store";

const likesFile = path.join(process.cwd(), "data", "post-likes.json");
const likesBlobPath = "engagement/post-likes.json";

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
    if (!fs.existsSync(likesFile)) return {};
    const content = fs.readFileSync(likesFile, "utf8");
    return JSON.parse(content) as PostLikes;
  } catch (error) {
    console.error("Error reading like counts from file:", error);
    return {};
  }
}

function writeLikesFile(likes: PostLikes) {
  ensureDataDirectory();
  fs.writeFileSync(likesFile, JSON.stringify(likes, null, 2));
}

async function readLikesDocument(): Promise<PostLikes> {
  if (isBlobAvailable()) {
    const fromBlob = await readJsonBlob<PostLikes>(likesBlobPath, {});
    if (fromBlob !== null) return fromBlob;
  }
  if (isLocalFileStorage()) return readLikesFile();
  return {};
}

async function writeLikesDocument(likes: PostLikes): Promise<void> {
  warnIfNoPersistentStorage();
  if (isBlobAvailable()) {
    const wroteBlob = await writeJsonBlob(likesBlobPath, likes);
    if (wroteBlob) return;
  }
  if (isLocalFileStorage()) {
    writeLikesFile(likes);
    return;
  }
  throw new Error("No persistent storage available");
}

function likesKey(slug: string) {
  return `likes:${slug}`;
}

async function toggleLikeKv(
  slug: string,
  userId: string
): Promise<{ likes: number; liked: boolean }> {
  const kv = getKv();
  if (!kv) throw new Error("KV not configured");
  const key = likesKey(slug);
  const alreadyLiked = Boolean(await kv.sismember(key, userId));
  if (alreadyLiked) await kv.srem(key, userId);
  else await kv.sadd(key, userId);
  const likes = Number(await kv.scard(key)) || 0;
  return { likes, liked: !alreadyLiked };
}

async function getLikeCountKv(slug: string): Promise<number> {
  const kv = getKv();
  if (!kv) throw new Error("KV not configured");
  return Number(await kv.scard(likesKey(slug))) || 0;
}

async function hasUserLikedKv(slug: string, userId: string): Promise<boolean> {
  const kv = getKv();
  if (!kv) throw new Error("KV not configured");
  return Boolean(await kv.sismember(likesKey(slug), userId));
}

async function toggleLikeDocument(
  slug: string,
  userId: string
): Promise<{ likes: number; liked: boolean }> {
  const allLikes = await readLikesDocument();
  const users = [...(allLikes[slug] ?? [])];
  const index = users.indexOf(userId);
  if (index >= 0) users.splice(index, 1);
  else users.push(userId);
  allLikes[slug] = users;
  await writeLikesDocument(allLikes);
  return { likes: users.length, liked: index < 0 };
}

export async function toggleLike(
  slug: string,
  userId: string
): Promise<{ likes: number; liked: boolean }> {
  if (isPostgresConfigured()) {
    try {
      return await postgresToggleLike(slug, userId);
    } catch (error) {
      console.error("[likes] Postgres failed:", error);
    }
  }

  if (getKv()) {
    try {
      return await toggleLikeKv(slug, userId);
    } catch (error) {
      console.error("[likes] KV failed:", error);
    }
  }

  return toggleLikeDocument(slug, userId);
}

export async function getLikeCount(slug: string): Promise<number> {
  if (isPostgresConfigured()) {
    try {
      return await postgresGetLikeCount(slug);
    } catch (error) {
      console.error("[likes] Postgres read failed:", error);
    }
  }

  if (getKv()) {
    try {
      return await getLikeCountKv(slug);
    } catch (error) {
      console.error("[likes] KV read failed:", error);
    }
  }

  const likes = await readLikesDocument();
  return likes[slug]?.length ?? 0;
}

export async function hasUserLiked(
  slug: string,
  userId: string
): Promise<boolean> {
  if (isPostgresConfigured()) {
    try {
      return await postgresHasUserLiked(slug, userId);
    } catch (error) {
      console.error("[likes] Postgres read failed:", error);
    }
  }

  if (getKv()) {
    try {
      return await hasUserLikedKv(slug, userId);
    } catch (error) {
      console.error("[likes] KV read failed:", error);
    }
  }

  const likes = await readLikesDocument();
  return likes[slug]?.includes(userId) ?? false;
}

export async function getLikeState(
  slug: string,
  userId?: string
): Promise<{ likes: number; liked: boolean }> {
  const likes = await getLikeCount(slug);
  const liked = userId ? await hasUserLiked(slug, userId) : false;
  return { likes, liked };
}

export function getLikeCountSync(slug: string): number {
  if (!isLocalFileStorage()) return 0;
  return readLikesFile()[slug]?.length ?? 0;
}
