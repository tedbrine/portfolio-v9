import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name.full} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const photoData = await readFile(
    join(process.cwd(), "public/opengraph-photo.jpg"),
    "base64",
  );
  const photoSource = `data:image/jpeg;base64,${photoData}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#f3f0e8",
        color: "#202923",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "690px",
          flexShrink: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "66px 54px 48px 76px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 70,
              fontWeight: 700,
              letterSpacing: "-0.055em",
              fontFamily: "ui-monospace, monospace",
              lineHeight: 1.08,
            }}
          >
            {site.name.full}
          </div>
          <div
            style={{
              marginTop: "12px",
              fontSize: 26,
              color: "#69736b",
            }}
          >
            {site.title}
          </div>
          <div
            style={{
              width: "48px",
              height: "3px",
              marginTop: "34px",
              marginBottom: "24px",
              background: "#b66f4c",
            }}
          />
          <div
            style={{
              maxWidth: "500px",
              fontSize: 29,
              lineHeight: 1.38,
              color: "#303a33",
            }}
          >
            {site.seo.tagline}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ height: "1px", background: "#d7d4cb" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 18,
              color: "#68726a",
            }}
          >
            <span>{site.location.label}</span>
            <span>{site.url.replace("https://", "").replace(/\/$/, "")}</span>
          </div>
        </div>
      </div>

      {/* biome-ignore lint/performance/noImgElement: ImageResponse uses img to render embedded assets */}
      <img
        alt=""
        src={photoSource}
        style={{
          width: "510px",
          height: "630px",
          flexShrink: 0,
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </div>,
    { ...size },
  );
}
