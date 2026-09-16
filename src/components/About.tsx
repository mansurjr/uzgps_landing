"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { reasons, timeline } from "@/data/content";
import { useReveal } from "@/lib/useReveal";

export default function About() {
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
          <div>
            <h2 data-reveal className="h-section mt-1">
              Национальная система спутникового мониторинга
            </h2>
          </div>
          <div data-reveal className="space-y-5 text-[18px] leading-relaxed text-graphite lg:pt-2">
            <p>
              UZGPS разработана центром программистов BePro совместно с АК «Узбектелеком» в рамках развития Национальной
              информационной системы.
            </p>
            <p>
              Наша главная миссия — полное импортозамещение технологий спутникового мониторинга, диспетчеризации и навигации в
              Узбекистане с обеспечением высшего уровня надежности и безопасности данных.
            </p>
          </div>
        </div>

        {/* Enhanced Visual Timeline Roadmap (2014 -> 2018-19) */}
        <div className="relative mt-20">
          <div className="hidden lg:block absolute left-0 right-0 top-7 h-[3px] bg-rule-strong" />
          <div ref={bar} className="hidden lg:block absolute left-0 right-0 top-7 h-[3px] origin-left scale-x-0 bg-primary" />

          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 relative z-10">
            {timeline.map((t) => (
              <li
                key={t.year}
                data-reveal
                className="group flex flex-col justify-between rounded-sm border border-ink/20 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-lg hover:-translate-y-1"
              >
                <div>
                  {/* Step header: Year + 01-05 number badge */}
                  <div className="flex items-center justify-between">
                    <span className="num font-display text-[30px] sm:text-[34px] font-bold tracking-[-0.04em] text-navy group-hover:text-primary transition-colors">
                      {t.year}
                    </span>
                  </div>

                  {/* Node marker line */}
                  <div className="hidden lg:flex my-3 items-center gap-2">
                    <span className="size-3.5 rounded-full bg-navy border-2 border-primary shadow-sm group-hover:scale-125 transition-transform" />
                    <span className="h-px flex-1 bg-rule group-hover:bg-primary/50 transition-colors" />
                  </div>

                  <h3 className="mt-3 text-[18px] font-bold text-ink leading-snug">{t.title}</h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-graphite">{t.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Why choose UZGPS block */}
        <div className="mt-28 grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-start">
          <div>
            <h3 data-reveal className="font-display text-[30px] sm:text-[34px] leading-tight tracking-[-0.03em] mt-1">
              Почему выбирают UZGPS
            </h3>
            <p className="mt-4 text-[16px] text-graphite leading-relaxed">
              Собственная платформа, разработанная в Узбекистане, техническая поддержка и отраслевые решения под задачи клиента.
            </p>
          </div>

          <ul className="grid border-t-2 border-ink sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
            {reasons.map((r) => (
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
