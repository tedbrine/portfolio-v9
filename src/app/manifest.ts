import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name.full} — ${site.title}`,
    short_name: site.name.first,
    description: site.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#242428",
    theme_color: "#242428",
    lang: "en-GB",
    categories: ["portfolio", "technology"],
    icons: [
      {
        src: site.assets.icon,
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}

