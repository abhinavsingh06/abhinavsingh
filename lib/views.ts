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
  postgresGetViewCount,
  postgresIncrementViewCount,
} from "./postgres-store";

const viewsFile = path.join(process.cwd(), "data", "post-views.json");
const viewsBlobPath = "engagement/post-views.json";

function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readViewsFile(): Record<string, number> {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(viewsFile)) return {};
    const content = fs.readFileSync(viewsFile, "utf8");
    return JSON.parse(content) as Record<string, number>;
  } catch (error) {
    console.error("Error reading view counts from file:", error);
    return {};
  }
}

function writeViewsFile(views: Record<string, number>) {
  ensureDataDirectory();
  fs.writeFileSync(viewsFile, JSON.stringify(views, null, 2));
}

async function readViewsDocument(): Promise<Record<string, number>> {
  if (isBlobAvailable()) {
    const fromBlob = await readJsonBlob<Record<string, number>>(
      viewsBlobPath,
      {}
    );
    if (fromBlob !== null) return fromBlob;
  }
  if (isLocalFileStorage()) return readViewsFile();
  return {};
}

async function writeViewsDocument(
  views: Record<string, number>
): Promise<void> {
  warnIfNoPersistentStorage();
  if (isBlobAvailable()) {
    const wroteBlob = await writeJsonBlob(viewsBlobPath, views);
    if (wroteBlob) return;
  }
  if (isLocalFileStorage()) {
    writeViewsFile(views);
    return;
  }
  throw new Error("No persistent storage available");
}

function viewsKey(slug: string) {
  return `views:${slug}`;
}

export async function getViewCount(slug: string): Promise<number> {
  if (isPostgresConfigured()) {
    try {
      return await postgresGetViewCount(slug);
    } catch (error) {
      console.error("[views] Postgres read failed:", error);
    }
  }

  const kv = getKv();
  if (kv) {
    try {
      const count = await kv.get<number>(viewsKey(slug));
      return Number(count) || 0;
    } catch (error) {
      console.error("[views] KV read failed:", error);
    }
  }

  const views = await readViewsDocument();
  return views[slug] ?? 0;
}

export async function incrementViewCount(slug: string): Promise<number> {
  if (isPostgresConfigured()) {
    try {
      return await postgresIncrementViewCount(slug);
    } catch (error) {
      console.error("[views] Postgres write failed:", error);
    }
  }

  const kv = getKv();
  if (kv) {
    try {
      return Number(await kv.incr(viewsKey(slug)));
    } catch (error) {
      console.error("[views] KV write failed:", error);
    }
  }

  const views = await readViewsDocument();
  const next = (views[slug] ?? 0) + 1;
  views[slug] = next;
  await writeViewsDocument(views);
  return next;
}

export function getViewCountSync(slug: string): number {
  if (!isLocalFileStorage()) return 0;
  return readViewsFile()[slug] ?? 0;
}
