import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.title,
    short_name: SITE.name,
    description: SITE.shortDescription,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#043168",
    lang: "ru",
    icons: [{ src: "/brand/pin.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
