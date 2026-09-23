"use client";

import { useRef } from "react";
import { useDict } from "@/i18n/DictProvider";
import { useReveal } from "@/lib/useReveal";
import TablerIcon, { type TablerName } from "./smpo/TablerIcon";
import { CloudArt, ServerArt } from "./DeployArt";

const ROW_ICONS: TablerName[] = ["database", "target", "truck", "tool"];

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
          <p data-reveal className="lead max-w-130 lg:justify-self-end">
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
                <span className="hidden self-center text-right text-[22px] transition-transform group-hover:translate-x-1 md:block">→</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-24">
          <h3 data-reveal className="font-display text-[30px] leading-tight tracking-[-0.03em]">
            {t.solutions.deployTitle}
          </h3>
          <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-6">
            {(
              [
                { key: "cloud", title: t.solutions.cloud, dark: true },
                { key: "server", title: t.solutions.server, dark: false },
              ] as const
            ).map((opt, i) => (
              <article
                key={opt.key}
                data-reveal
                className={`flex flex-col rounded-[2px] p-7 lg:p-10 ${
                  opt.dark ? "bg-navy text-paper" : "border border-rule-strong bg-paper"
                }`}
              >
                <div
                  className={`-mx-7 -mt-7 mb-8 flex justify-center border-b px-7 pb-6 pt-8 lg:-mx-10 lg:-mt-10 lg:px-10 ${
                    opt.dark ? "border-rule-inv bg-navy-2/40" : "border-rule bg-paper-2/60"
                  }`}
                >
                  {opt.dark ? <CloudArt /> : <ServerArt />}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <h4 className="flex items-center gap-3 font-display text-[26px] font-medium leading-tight tracking-[-0.02em] lg:text-[30px]">
                    <TablerIcon name={opt.key} size={28} className={opt.dark ? "text-primary" : "text-navy"} />
                    {opt.title}
                  </h4>
                  <span className={`num font-display text-[15px] ${opt.dark ? "text-primary" : "text-graphite"}`}>
                    0{i + 1}
                  </span>
                </div>
                <dl className={`mt-8 border-t ${opt.dark ? "border-rule-inv" : "border-rule"}`}>
                  {t.solutions.deploy.map((row, r) => (
                    <div
                      key={row.k}
                      className={`grid gap-2 border-b py-5 last:border-b-0 last:pb-0 ${
                        opt.dark ? "border-rule-inv" : "border-rule"
                      }`}
                    >
                      <dt
                        className={`flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.08em] ${
                          opt.dark ? "text-paper/55" : "text-graphite"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            opt.dark ? "bg-paper/10 text-primary" : "bg-navy/8 text-navy"
                          }`}
                        >
                          <TablerIcon name={ROW_ICONS[r] ?? "check"} size={17} />
                        </span>
                        {row.k}
                      </dt>
                      <dd className="pl-11 text-[17px] leading-relaxed">{row[opt.key]}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
