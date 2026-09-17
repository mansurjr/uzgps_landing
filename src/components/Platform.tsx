"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import Image from "next/image";
import { useReveal } from "@/lib/useReveal";
import { appScreens, contacts } from "@/data/content";
import { useDict } from "@/i18n/DictProvider";
import type { Dict } from "@/i18n";
import SmpoMonitoring from "./smpo/SmpoMonitoring";
import SmpoTracking from "./smpo/SmpoTracking";
import SmpoReports from "./smpo/SmpoReports";
import SmpoSettings from "./smpo/SmpoSettings";

/** Real captures found in public/platform (see page.tsx): overview video and per-tab screenshots. */
export type PlatformMedia = { video?: string; screens: Partial<Record<string, string>> };

const tabKeys = ["track", "fuel", "reports", "control"] as const;

type TabKey = (typeof tabKeys)[number];

const screens: Record<TabKey, () => React.ReactElement> = {
  track: () => <SmpoMonitoring />,
  fuel: () => <SmpoTracking />,
  reports: () => <SmpoReports />,
  control: () => <SmpoSettings />,
};

export default function Platform({ media = { screens: {} } }: { media?: PlatformMedia }) {
  const { t } = useDict();
  const tabs: (Dict["content"]["platformTabs"][number] & { key: TabKey })[] = tabKeys.map((key, i) => ({ key, ...t.content.platformTabs[i] }));
  const root = useRef<HTMLElement>(null);
  const screenBox = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<TabKey>("track");
  const current = tabs.find((t) => t.key === tab)!;
  const first = useRef(true);
  useReveal(root);

  // soft cross-fade when switching tabs (not on first paint — the reveal handles that)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = screenBox.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = animate(el, { opacity: [0, 1], translateY: [14, 0], duration: 500, ease: "outQuart" });
    return () => {
      a.pause();
    };
  }, [tab]);

  const Screen = screens[tab];
  const real = media.screens[tab];

  return (
    <section ref={root} id="platform" className="bg-ink py-24 text-paper lg:py-36">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 data-reveal className="h-section">{t.platform.title}</h2>
          <p data-reveal className="max-w-130 text-[18px] leading-relaxed text-paper/60 lg:justify-self-end">
            {t.platform.lead}
          </p>
        </div>

        <div
          data-reveal
          role="tablist"
          aria-label={t.platform.tabsLabel}
          className="mt-12 grid grid-cols-2 gap-x-5 gap-y-2 border-b border-rule-inv sm:flex sm:gap-10"
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={tab === t.key}
              aria-controls="platform-panel"
              onClick={() => setTab(t.key)}
              className={`relative min-w-0 pb-3 text-left text-[16px] font-medium transition-colors focus-visible:outline-primary sm:shrink-0 sm:pb-4 sm:text-[19px] ${
                tab === t.key ? "text-paper" : "text-paper/70 hover:text-paper"
              }`}
            >
              {t.label}
              <span className={`absolute inset-x-0 -bottom-px h-0.75 bg-primary transition-transform duration-300 ${tab === t.key ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          ))}
        </div>

        <div id="platform-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-12">
          <div data-reveal className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
            <h3 className="font-display text-[28px] tracking-[-0.03em] sm:text-[34px]">{current.title}</h3>
            <ul className="grid gap-x-8 border-t border-rule-inv sm:grid-cols-3">
              {current.points.map((p) => (
                <li key={p} className="flex items-center gap-3 border-b border-rule-inv py-4 text-[16px] text-paper/80">
                  <span className="size-1.5 shrink-0 bg-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="mt-10">
            <div ref={screenBox}>
              {real ? (
                <div className="overflow-hidden rounded-md shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)]">
                  <Image src={real} alt={current.title} width={1600} height={1000} sizes="(min-width:1360px) 1264px, 100vw" className="h-auto w-full" />
                </div>
              ) : (
                <Screen key={tab} />
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[14px] text-paper/45">{current.caption}</p>
              <a href="#contact" className="btn-ghost text-primary">{t.common.demo}</a>
            </div>
          </div>
        </div>

        {media.video && (
          <div data-reveal className="mt-20">
            <h3 className="font-display text-[30px] leading-tight tracking-[-0.03em]">{t.platform.videoTitle}</h3>
            <video
              className="mt-8 w-full rounded-md bg-ink-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)]"
              src={media.video}
              poster={media.screens.track}
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
            />
          </div>
        )}

        <div data-reveal className="mt-24 border-t border-rule-inv pt-14">
          <h3 className="font-display text-[30px] leading-tight tracking-[-0.03em]">{t.platform.modulesTitle}</h3>
          <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.content.systemModules.map((m) => (
              <li key={m.title} className="border-t border-rule-inv py-5">
                <p className="text-[17px] font-medium">{m.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-paper/60">{m.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[14px] text-paper/45">{t.platform.statuses}: {t.content.objectStatuses.join(" · ")}</p>
        </div>

        <MobileApp />
      </div>
    </section>
  );
}

function MobileApp() {
  const { t } = useDict();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const phones = el.querySelectorAll<HTMLElement>("[data-phone]");
    phones.forEach((ph) => (ph.style.opacity = "0"));
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        animate(phones, { opacity: [0, 1], translateY: { from: stagger(30, { start: 80 }), to: 0 }, duration: 1100, delay: stagger(110), ease: "outQuart" });
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} className="mt-24 grid gap-12 border-t border-rule-inv pt-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
      <div>
        <h3 className="font-display text-[30px] leading-tight tracking-[-0.03em] sm:text-[36px]">{t.platform.mobile.title}</h3>
        <p className="mt-4 text-[17px] leading-relaxed text-paper/70">
          {t.platform.mobile.text}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={contacts.playStore} target="_blank" rel="noreferrer" className="btn-primary">
            Google Play
          </a>
          <a
            href={contacts.appStore}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center border border-paper/30 px-6 py-4 font-semibold text-paper transition-colors hover:border-paper hover:bg-white/5"
          >
            App Store
          </a>
        </div>
      </div>

      <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        {appScreens.map((src, i) => (
          <li key={src} data-phone className={`w-[46%] shrink-0 snap-start sm:w-auto ${i % 2 ? "sm:mt-12" : ""}`}>
            <div className="overflow-hidden rounded-[22px] border-[5px] border-ink-3 bg-ink-3 shadow-[0_30px_50px_-25px_rgba(0,0,0,.7)]">
              <Image src={src} alt={`${t.platform.mobile.screenAlt} ${i + 1}`} width={360} height={800} sizes="(min-width:640px) 180px, 46vw" className="h-auto w-full rounded-[17px]" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
