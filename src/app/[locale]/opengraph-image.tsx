import { ImageResponse } from "next/og";
import { getDict, isLocale, locales } from "@/i18n";
import { contacts } from "@/data/content";

export const alt = "UZGPS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDict(isLocale(locale) ? locale : "ru");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #061a36 0%, #043168 100%)",
          color: "#f4f6f9",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 22, height: 34, borderRadius: "50% 50% 50% 50% / 42% 42% 58% 58%", background: "#00adec" }} />
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>UZGPS</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2, maxWidth: 960 }}>{t.seo.ogTitle}</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "rgba(244,246,249,.72)", maxWidth: 900 }}>{t.seo.ogSubtitle}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26 }}>
          <div style={{ display: "flex", gap: 28, color: "rgba(244,246,249,.7)" }}>
            <span>uzgps.uz</span>
            <span>{contacts.sales}</span>
          </div>
          <div style={{ display: "flex", height: 8, width: 320, background: "#00adec" }} />
        </div>
      </div>
    ),
    size,
  );
}
