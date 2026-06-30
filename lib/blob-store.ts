import { BlobNotFoundError, head, put } from "@vercel/blob";

function isVercel(): boolean {
  return process.env.VERCEL === "1";
}

/** Blob is only available when credentials exist — not merely because we're on Vercel. */
export function isBlobAvailable(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
      process.env.BLOB_STORE_ID?.trim()
  );
}

export async function readJsonBlob<T>(
  pathname: string,
  fallback: T
): Promise<T | null> {
  if (!isBlobAvailable()) return null;

  try {
    const meta = await head(pathname);
    const res = await fetch(meta.downloadUrl, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch (error) {
    if (error instanceof BlobNotFoundError) return fallback;
    console.error(`[blob] read failed (${pathname}):`, error);
    return null;
  }
}

export async function writeJsonBlob<T>(
  pathname: string,
  data: T
): Promise<boolean> {
  if (!isBlobAvailable()) return false;

  try {
    await put(pathname, JSON.stringify(data), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return true;
  } catch (error) {
    console.error(`[blob] write failed (${pathname}):`, error);
    return false;
  }
}

export async function probeBlobWrite(): Promise<boolean> {
  if (!isBlobAvailable()) return false;
  return writeJsonBlob("engagement/.health-check.json", {
    ts: Date.now(),
  });
}

/** Writable local `data/` — local dev and vercel dev, not serverless production. */
export function isLocalFileStorage(): boolean {
  if (!isVercel()) return true;
  if (process.env.NODE_ENV === "development") return true;
  if (process.env.VERCEL_ENV === "development") return true;
  return false;
}
