import { NextResponse } from "next/server";
import {
  getStorageConfig,
  getStorageHint,
  probeEngagementStorage,
} from "@/lib/engagement-storage";

export async function GET() {
  const config = getStorageConfig();
  const probe = await probeEngagementStorage();

  return NextResponse.json({
    ready: probe.writable,
    writable: probe.writable,
    backend: probe.backend,
    ...config,
    hint: probe.writable ? "Storage is writable." : getStorageHint(),
  });
}
