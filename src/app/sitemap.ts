import type { MetadataRoute } from "next";
import { locales } from "@/i18n";
import { localeUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, localeUrl(l)]));

  return locales.map((locale) => ({
    url: localeUrl(locale),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "ru" ? 1 : 0.8,
    alternates: { languages },
  }));
}
