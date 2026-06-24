import { NextResponse } from "next/server";
import { isBlobAvailable } from "@/lib/blob-store";
import { isKvConfigured } from "@/lib/kv";
import { isPostgresConfigured } from "@/lib/postgres-store";

export async function GET() {
  const postgres = isPostgresConfigured();
  const kv = isKvConfigured();
  const blob = isBlobAvailable();
  const ready = postgres || kv || blob;

  return NextResponse.json({
    ready,
    postgres,
    kv,
    blob,
    vercel: process.env.VERCEL === "1",
    hint: ready
      ? "Storage is configured."
      : "Connect Neon Postgres, Upstash Redis, or Blob in Vercel → Storage, then redeploy.",
  });
}
