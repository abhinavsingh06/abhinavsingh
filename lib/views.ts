import fs from "fs";
import path from "path";

const viewsFile = path.join(process.cwd(), "data", "post-views.json");

function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function initializeViewsFile() {
  ensureDataDirectory();
  if (!fs.existsSync(viewsFile)) {
    fs.writeFileSync(viewsFile, JSON.stringify({}, null, 2));
  }
}

function readViews(): Record<string, number> {
  try {
    initializeViewsFile();
    const content = fs.readFileSync(viewsFile, "utf8");
    const views = JSON.parse(content) as Record<string, number>;
    return views;
  } catch (error) {
    console.error("Error reading view counts:", error);
    return {};
  }
}

function writeViews(views: Record<string, number>) {
  initializeViewsFile();
  fs.writeFileSync(viewsFile, JSON.stringify(views, null, 2));
}

export function getViewCount(slug: string): number {
  const views = readViews();
  return views[slug] ?? 0;
}

export function incrementViewCount(slug: string): number {
  const views = readViews();
  const next = (views[slug] ?? 0) + 1;
  views[slug] = next;
  writeViews(views);
  return next;
}

export function getAllViewCounts(): Record<string, number> {
  return readViews();
}
