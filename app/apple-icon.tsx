import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          borderRadius: 36,
        }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            background: "linear-gradient(135deg, #7a9e1f 0%, #d4ff3a 55%, #f2ff9a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 48px #d4ff3a66",
          }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: "#0a0a0a",
              border: "6px solid #d4ff3a",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
