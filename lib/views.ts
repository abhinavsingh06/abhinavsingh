import fs from "fs";
import path from "path";
import { getKv } from "./kv";

const viewsFile = path.join(process.cwd(), "data", "post-views.json");

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
    console.error("Error reading view counts:", error);
    return {};
  }
}

function writeViewsFile(views: Record<string, number>) {
  ensureDataDirectory();
  fs.writeFileSync(viewsFile, JSON.stringify(views, null, 2));
}

function viewsKey(slug: string) {
  return `views:${slug}`;
}

export async function getViewCount(slug: string): Promise<number> {
  const kv = getKv();
  if (kv) {
    const count = await kv.get<number>(viewsKey(slug));
    return count ?? 0;
  }
  const views = readViewsFile();
  return views[slug] ?? 0;
}

export async function incrementViewCount(slug: string): Promise<number> {
  const kv = getKv();
  if (kv) {
    return await kv.incr(viewsKey(slug));
  }

  const views = readViewsFile();
  const next = (views[slug] ?? 0) + 1;
  views[slug] = next;
  writeViewsFile(views);
  return next;
}

/** Sync read for static build — always 0 in production without local file */
export function getViewCountSync(slug: string): number {
  const views = readViewsFile();
  return views[slug] ?? 0;
}
