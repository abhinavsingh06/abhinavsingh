import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
        }}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 999,
            background: "#d4ff3a",
            boxShadow: "0 0 12px #d4ff3a88",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
