import type { Metadata, Viewport } from "next";
import { Geologica, Golos_Text, Inter } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s — UZGPS",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "GPS мониторинг",
    "мониторинг транспорта",
    "спутниковый мониторинг",
    "контроль топлива",
    "датчик уровня топлива",
    "ДУТ",
    "GPS трекер",
    "Teltonika",
    "мониторинг персонала",
    "СМПО",
    "UZGPS",
    "Узбекистан",
    "Ташкент",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: {
    canonical: "/",
    languages: {
      ru: "/",
      uz: "https://uzgps.uz/uz",
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    alternateLocale: ["uz_UZ"],
    url: SITE.url,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  category: "technology",
  icons: {
    icon: [
      { url: "/brand/pin.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: "/brand/pin.svg",
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#043168",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${display.variable} ${body.variable} ${smpo.variable}`}>
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
