import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Abhinav Singh — software engineer & writer";

export default function OpenGraphImage() {
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #7a9e1f, #d4ff3a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px #d4ff3a55",
            }}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: "#0a0a0a",
                border: "4px solid #d4ff3a",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, color: "#8a8a85", letterSpacing: "0.12em" }}>
              ABHINAVSINGH.ONLINE
            </div>
            <div style={{ fontSize: 42, fontWeight: 700, marginTop: 4 }}>
              Abhinav Singh
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}>
            <span>Software engineer &amp; </span>
            <span style={{ color: "#d4ff3a" }}>writer.</span>
          </div>
          <div style={{ fontSize: 30, color: "#cfcfca", maxWidth: 820, lineHeight: 1.4 }}>
            Field notes, essays, and tutorials on engineering and the craft of
            building software.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
