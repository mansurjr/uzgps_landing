"use client";

import { useRef } from "react";
import { useDict } from "@/i18n/DictProvider";
import { useReveal } from "@/lib/useReveal";

export default function Solutions() {
  const { t } = useDict();
  const root = useRef<HTMLElement>(null);
  useReveal(root, { step: 50 });

  return (
    <section ref={root} id="solutions" className="border-t border-rule bg-white py-24 lg:py-36">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 data-reveal className="h-section">
            {t.solutions.title}
          </h2>
          <p data-reveal className="lead max-w-[520px] lg:justify-self-end">
            {t.solutions.lead}
          </p>
        </div>

        <ul className="mt-16 border-t-2 border-ink">
          {t.content.industries.map((it) => (
            <li key={it.title} data-reveal>
              <a
                href="#contact"
                className="group grid items-baseline gap-2 border-b border-rule py-7 transition-colors hover:bg-navy hover:text-paper md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_40px] md:gap-10 md:px-4"
              >
                <h3 className="font-display text-[clamp(24px,2.6vw,36px)] leading-tight tracking-[-0.03em]">{it.title}</h3>
                <p className="text-[17px] leading-relaxed text-graphite group-hover:text-paper/75">{it.text}</p>
                <span className="hidden text-right text-[22px] transition-transform group-hover:translate-x-1 md:block">→</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-24">
          <h3 data-reveal className="font-display text-[30px] leading-tight tracking-[-0.03em]">
            {t.solutions.deployTitle}
          </h3>
          <div data-reveal className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[16px]">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="w-[28%] py-4 pr-6 font-normal text-graphite" />
                  <th className="py-4 pr-6 font-display text-[22px] font-medium tracking-[-0.02em]">{t.solutions.cloud}</th>
                  <th className="py-4 font-display text-[22px] font-medium tracking-[-0.02em]">{t.solutions.server}</th>
                </tr>
              </thead>
              <tbody>
                {t.solutions.deploy.map((row) => (
                  <tr key={row.k} className="border-b border-rule">
                    <td className="py-4 pr-6 text-graphite">{row.k}</td>
                    <td className="py-4 pr-6">{row.cloud}</td>
                    <td className="py-4">{row.server}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
