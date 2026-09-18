"use client";

import { useRef } from "react";
import { useDict } from "@/i18n/DictProvider";
import { useReveal } from "@/lib/useReveal";

export default function About() {
  const { t } = useDict();
  const root = useRef<HTMLElement>(null);
  useReveal(root, { step: 50 });

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

        {/* why UZGPS */}
        <div className="mt-28 grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-start">
          <div className="self-center">
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
