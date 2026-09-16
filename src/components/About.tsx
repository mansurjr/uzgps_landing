"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { useDict } from "@/i18n/DictProvider";
import { useReveal } from "@/lib/useReveal";

export default function About() {
  const { t } = useDict();
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  useReveal(root, { step: 50 });

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "scaleX(1)";
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      animate(el, { scaleX: [0, 1], duration: 1600, ease: "inOutQuart" });
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root} id="about" className="border-t border-rule bg-white py-24 lg:py-36">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <h2 data-reveal className="h-section">
            {t.about.title}
          </h2>
          <div data-reveal className="space-y-5 text-[18px] leading-relaxed text-graphite lg:pt-2">
            <p>{t.about.text1}</p>
            <p>{t.about.text2}</p>
          </div>
        </div>

        {/* timeline */}
        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-7 hidden h-[3px] bg-rule-strong lg:block" />
          <div ref={bar} className="absolute left-0 right-0 top-7 hidden h-[3px] origin-left scale-x-0 bg-primary lg:block" />

          <ol className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {t.content.timeline.map((item) => (
              <li
                key={item.year}
                data-reveal
                className="group flex flex-col justify-between rounded-sm border border-ink/20 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div>
                  <span className="num font-display text-[30px] font-bold tracking-[-0.04em] text-navy transition-colors group-hover:text-primary sm:text-[34px]">
                    {item.year}
                  </span>

                  <div className="my-3 hidden items-center gap-2 lg:flex">
                    <span className="size-3.5 rounded-full border-2 border-primary bg-navy shadow-sm transition-transform group-hover:scale-125" />
                    <span className="h-px flex-1 bg-rule transition-colors group-hover:bg-primary/50" />
                  </div>

                  <h3 className="mt-3 text-[18px] font-bold leading-snug text-ink">{item.title}</h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-graphite">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* why UZGPS */}
        <div className="mt-28 grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-start">
          <div>
            <h3 data-reveal className="font-display text-[30px] leading-tight tracking-[-0.03em] sm:text-[34px]">
              {t.about.reasonsTitle}
            </h3>
            <p className="mt-4 text-[16px] leading-relaxed text-graphite">{t.about.reasonsLead}</p>
          </div>

          <ul className="grid border-t-2 border-ink sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
            {t.content.reasons.map((r) => (
              <li key={r} data-reveal className="flex items-start gap-3 border-b border-rule py-4 text-[16px]">
                <svg width="18" height="18" viewBox="0 0 16 16" className="mt-1 shrink-0" aria-hidden>
                  <circle cx="8" cy="8" r="8" fill="#00adec" fillOpacity="0.15" />
                  <path d="M4.5 8l2.5 2.5L11.5 5" stroke="#00adec" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
