import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "ANTRABUMI — Connecting Knowledge, Nature, & Communities";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0F172A",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Top header / branding */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#0D5C4D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "24px",
                color: "#A7F3D0",
              }}
            >
              A
            </div>
            <span
              style={{
                fontSize: "28px",
                fontWeight: "800",
                letterSpacing: "0.15em",
                color: "#ffffff",
              }}
            >
              ANTRABUMI
            </span>
          </div>

          <div
            style={{
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              fontSize: "14px",
              color: "#94A3B8",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Profile & Knowledge Hub 2026
          </div>
        </div>

        {/* Center Tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: "800",
              lineHeight: 1.15,
              color: "#ffffff",
              maxWidth: "960px",
            }}
          >
            Connecting Knowledge, Nature, &amp; Communities.
          </div>
          <p
            style={{
              fontSize: "22px",
              color: "#94A3B8",
              lineHeight: 1.5,
              maxWidth: "850px",
              margin: 0,
            }}
          >
            Menghubungkan riset, pengalaman lapangan, dan kearifan lokal untuk masa depan yang berkelanjutan dan inklusif.
          </p>
        </div>

        {/* Bottom pillars */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "30px",
          }}
        >
          <div style={{ display: "flex", gap: "32px" }}>
            <span style={{ fontSize: "16px", fontWeight: "600", color: "#34D399", letterSpacing: "0.1em" }}>
              • KNOWLEDGE
            </span>
            <span style={{ fontSize: "16px", fontWeight: "600", color: "#38BDF8", letterSpacing: "0.1em" }}>
              • NATURE
            </span>
            <span style={{ fontSize: "16px", fontWeight: "600", color: "#FBBF24", letterSpacing: "0.1em" }}>
              • COMMUNITIES
            </span>
          </div>

          <div style={{ fontSize: "16px", color: "#64748B" }}>antrabumi.org</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
