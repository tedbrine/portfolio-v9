import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "A black-and-white butterfly on an orange flower";
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
    </div>,
    { ...size },
  );
}
