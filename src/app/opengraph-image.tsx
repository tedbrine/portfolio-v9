import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name.full} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#1c1c1f",
        color: "#fafafa",
        padding: "72px",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            <span>{site.name.first}</span>
            <span
              style={{
                color: "rgba(250,250,250,0.55)",
                fontWeight: 500,
                marginLeft: "16px",
              }}
            >
              {site.name.last}
            </span>
          </div>
          <div style={{ fontSize: 28, color: "rgba(250,250,250,0.55)" }}>
            {site.title}
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: 30,
          lineHeight: 1.45,
          color: "rgba(250,250,250,0.72)",
          maxWidth: "900px",
        }}
      >
        {site.seo.tagline}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
          color: "rgba(250,250,250,0.45)",
        }}
      >
        <span>{site.location.label}</span>
        <span>{site.url.replace("https://", "")}</span>
      </div>
    </div>,
    { ...size },
  );
}
