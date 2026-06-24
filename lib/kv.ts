import { Redis } from "@upstash/redis";

let redis: Redis | null = null;
let warned = false;

export function isKvConfigured(): boolean {
  return Boolean(getKvCredentials());
}

function getKvCredentials(): { url: string; token: string } | null {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!url.startsWith("https://")) return null;
  return { url, token };
}

export function getKv(): Redis | null {
  if (redis) return redis;
  const creds = getKvCredentials();
  if (!creds) return null;
  redis = new Redis(creds);
  return redis;
}

export function warnIfNoPersistentStorage(): void {
  if (warned || process.env.VERCEL !== "1") return;
  const hasPostgres = Boolean(
    process.env.DATABASE_URL ?? process.env.POSTGRES_URL
  );
  const hasKv = isKvConfigured();
  const hasBlob = Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID
  );
  if (!hasPostgres && !hasKv && !hasBlob) {
    warned = true;
    console.error(
      "[storage] No database connected. Add Neon Postgres (recommended), Upstash Redis, or Blob in Vercel Storage → redeploy."
    );
  }
}
