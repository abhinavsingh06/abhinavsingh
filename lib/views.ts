import fs from "fs";
import path from "path";
import { readJsonBlob, writeJsonBlob } from "./blob-store";
import { getKv } from "./kv";

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
    if (!fs.existsSync(viewsFile)) {
      fs.writeFileSync(viewsFile, JSON.stringify({}, null, 2));
    }
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
  const fromBlob = await readJsonBlob<Record<string, number>>(viewsBlobPath, {});
  if (Object.keys(fromBlob).length > 0) return fromBlob;
  return readViewsFile();
}

async function writeViewsDocument(views: Record<string, number>): Promise<void> {
  const wroteBlob = await writeJsonBlob(viewsBlobPath, views);
  if (wroteBlob) return;

  try {
    writeViewsFile(views);
  } catch (error) {
    console.error("Error writing view counts to file:", error);
    throw new Error("Unable to persist views");
  }
}

function viewsKey(slug: string) {
  return `views:${slug}`;
}

export async function getViewCount(slug: string): Promise<number> {
  const kv = getKv();
  if (kv) {
    try {
      const count = await kv.get<number>(viewsKey(slug));
      return Number(count) || 0;
    } catch (error) {
      console.error("[views] KV read failed, using document store:", error);
    }
  }

  const views = await readViewsDocument();
  return views[slug] ?? 0;
}

export async function incrementViewCount(slug: string): Promise<number> {
  const kv = getKv();
  if (kv) {
    try {
      return Number(await kv.incr(viewsKey(slug)));
    } catch (error) {
      console.error("[views] KV write failed, using document store:", error);
    }
  }

  const views = await readViewsDocument();
  const next = (views[slug] ?? 0) + 1;
  views[slug] = next;
  await writeViewsDocument(views);
  return next;
}

export function getViewCountSync(slug: string): number {
  const views = readViewsFile();
  return views[slug] ?? 0;
}
