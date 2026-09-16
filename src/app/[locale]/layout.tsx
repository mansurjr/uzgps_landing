import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Geologica, Golos_Text, Inter } from "next/font/google";
import { getDict, isLocale, locales } from "@/i18n";
import { SITE, localeUrl } from "@/lib/site";
import "../globals.css";

const display = Geologica({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

const body = Golos_Text({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

// the СМПО web client (Vuexy) is set in Inter; used only inside the product replica
const smpo = Inter({
  variable: "--font-smpo",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);

  return {
    metadataBase: new URL(SITE.url),
    title: { default: t.seo.title, template: "%s — UZGPS" },
    description: t.seo.description,
    applicationName: SITE.name,
    keywords: [...t.seo.keywords],
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    publisher: SITE.name,
    alternates: {
      canonical: localeUrl(locale),
      languages: { ru: localeUrl("ru"), uz: localeUrl("uz"), "x-default": localeUrl("ru") },
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: locale === "uz" ? "uz_UZ" : "ru_RU",
      alternateLocale: locale === "uz" ? ["ru_RU"] : ["uz_UZ"],
      url: localeUrl(locale),
      title: t.seo.title,
      description: t.seo.description,
    },
    twitter: { card: "summary_large_image", title: t.seo.title, description: t.seo.short },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    category: "technology",
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
      apple: "/icon.svg",
    },
    formatDetection: { telephone: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#043168",
  colorScheme: "light",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} suppressHydrationWarning className={`${display.variable} ${body.variable} ${smpo.variable}`}>
      <head>
        {/* product images and app screenshots come from these hosts */}
        <link rel="preconnect" href="https://static.wixstatic.com" />
        <link rel="dns-prefetch" href="https://play-lh.googleusercontent.com" />
      </head>
      <body>
        {/* marks JS as available so reveal targets start hidden; no-JS users see everything */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
      </body>
    </html>
  );
}
