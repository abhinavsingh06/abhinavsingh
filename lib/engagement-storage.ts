import { isBlobAvailable, probeBlobWrite } from "@/lib/blob-store";
import { getKv, isKvConfigured } from "@/lib/kv";
import { isPostgresConfigured, postgresPing } from "@/lib/postgres-store";

const STORAGE_HINT =
  "Connect Neon Postgres (recommended), Upstash Redis, or Blob in Vercel → Storage, then redeploy.";

export async function probeEngagementStorage(): Promise<{
  writable: boolean;
  backend: "postgres" | "kv" | "blob" | null;
}> {
  if (isPostgresConfigured()) {
    try {
      if (await postgresPing()) return { writable: true, backend: "postgres" };
    } catch (error) {
      console.error("[storage] Postgres probe failed:", error);
    }
  }

  const kv = getKv();
  if (kv) {
    try {
      await kv.set("__engagement_health", Date.now(), { ex: 60 });
      return { writable: true, backend: "kv" };
    } catch (error) {
      console.error("[storage] KV probe failed:", error);
    }
  }

  if (isBlobAvailable()) {
    try {
      if (await probeBlobWrite()) return { writable: true, backend: "blob" };
    } catch (error) {
      console.error("[storage] Blob probe failed:", error);
    }
  }

  return { writable: false, backend: null };
}

export function getStorageHint(): string {
  return STORAGE_HINT;
}

export function getStorageConfig() {
  return {
    postgres: isPostgresConfigured(),
    kv: isKvConfigured(),
    blob: isBlobAvailable(),
    vercel: process.env.VERCEL === "1",
  };
}
