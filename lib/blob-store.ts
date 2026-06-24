import { BlobNotFoundError, head, put } from "@vercel/blob";

function isVercel(): boolean {
  return process.env.VERCEL === "1";
}

export function isBlobAvailable(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      isVercel()
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

export function isLocalFileStorage(): boolean {
  return !isVercel();
}
