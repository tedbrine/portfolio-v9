import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.name.full;
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
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        overflow: "hidden",
        background: "#101710",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: ImageResponse uses img to render embedded assets */}
      <img
        alt=""
        src={photoSource}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.22) 22%, rgba(0,0,0,0) 40%)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          position: "absolute",
          left: "72px",
          bottom: "40px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            color: "#fffdf8",
            fontSize: 38,
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1,
          }}
        >
          {site.name.first}
        </div>
        <div
          style={{
            color: "#ffc47d",
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: "-0.06em",
            lineHeight: 1,
          }}
        >
          {site.name.last}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
