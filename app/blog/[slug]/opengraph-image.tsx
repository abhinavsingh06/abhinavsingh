import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? "Blog post";
  const category = post?.category ?? "Writing";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#0a0a0a",
          color: "#ededec",
          fontFamily: "system-ui, sans-serif",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#d4ff3a",
              boxShadow: "0 0 20px #d4ff3a88",
            }}
          />
          <div
            style={{
              fontSize: 24,
              color: "#d4ff3a",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
            {category}
          </div>
        </div>

        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            maxWidth: 1000,
          }}>
          {title}
        </div>

        <div style={{ fontSize: 26, color: "#8a8a85" }}>abhinavsingh.online</div>
      </div>
    ),
    { ...size }
  );
}
