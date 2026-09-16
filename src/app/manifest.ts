import type { MetadataRoute } from "next";
import { ru } from "@/i18n/ru";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: ru.seo.title,
    short_name: "UZGPS",
    description: ru.seo.short,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#043168",
    lang: "ru",
    icons: [{ src: "/brand/pin.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
