import { NextRequest, NextResponse } from "next/server";
import { getViewCount, incrementViewCount } from "@/lib/views";

const noStore = { headers: { "Cache-Control": "no-store" } };

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const views = await getViewCount(slug);
  return NextResponse.json({ slug, views }, noStore);
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const views = await incrementViewCount(slug);
  return NextResponse.json({ slug, views }, noStore);
}
