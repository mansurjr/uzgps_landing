import { existsSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/i18n";
import { DictProvider } from "@/i18n/DictProvider";
import Header from "@/components/Header";
import SectionScroll from "@/components/SectionScroll";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import Problems from "@/components/Problems";
import Platform, { type PlatformMedia } from "@/components/Platform";
import HowItWorks from "@/components/HowItWorks";
import Calculator from "@/components/Calculator";
import Solutions from "@/components/Solutions";
import Equipment from "@/components/Equipment";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

// real СМПО captures dropped into public/platform replace the drawn mockups:
// track|fuel|reports|control .webp/.png/.jpg (~1600x1000) and overview.mp4. Detected at build time.
function platformMedia(): PlatformMedia {
  const dir = path.join(process.cwd(), "public", "platform");
  const find = (name: string) =>
    [".webp", ".png", ".jpg"].map((ext) => name + ext).find((f) => existsSync(path.join(dir, f)));
  const screens: PlatformMedia["screens"] = {};
  for (const tab of ["track", "fuel", "reports", "control"]) {
    const f = find(tab);
    if (f) screens[tab] = `/platform/${f}`;
  }
  return { screens, video: existsSync(path.join(dir, "overview.mp4")) ? "/platform/overview.mp4" : undefined };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);

  return (
    <DictProvider t={t} locale={locale}>
      <SectionScroll />
      <StructuredData t={t} locale={locale} />
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-navy focus:px-4 focus:py-2 focus:text-paper"
      >
        {t.common.skipToContent}
      </a>
      <Header />
      <main>
        <Hero />
        <Clients />
        <Problems />
        <Platform media={platformMedia()} />
        <HowItWorks />
        <Calculator />
        <Solutions />
        <Equipment />
        <About />
        <Contact />
      </main>
      <Footer t={t} />
    </DictProvider>
  );
}
