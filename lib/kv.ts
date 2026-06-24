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
  return { url, token };
}

export function getKv(): Redis | null {
  if (redis) return redis;
  const creds = getKvCredentials();
  if (!creds) {
    if (process.env.VERCEL && !warned) {
      warned = true;
      console.warn(
        "[storage] KV_REST_API_URL / KV_REST_API_TOKEN not set — likes and views will not persist on Vercel."
      );
    }
    return null;
  }
  redis = new Redis(creds);
  return redis;
}
