import { NextRequest, NextResponse } from "next/server";
import { getLikeState, toggleLike } from "@/lib/likes";

const noStore = { headers: { "Cache-Control": "no-store" } };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const userId = request.nextUrl.searchParams.get("userId") ?? undefined;
    const state = await getLikeState(slug, userId);
    return NextResponse.json({ slug, ...state }, noStore);
  } catch (error) {
    console.error("[api/likes] GET failed:", error);
    return NextResponse.json(
      { error: "Unable to load likes" },
      { status: 503, ...noStore }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    let body: { userId?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { userId } = body;
    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const result = await toggleLike(slug, userId);
    return NextResponse.json({ slug, ...result }, noStore);
  } catch (error) {
    console.error("[api/likes] POST failed:", error);
    return NextResponse.json(
      { error: "Unable to save like" },
      { status: 503, ...noStore }
    );
  }
}
