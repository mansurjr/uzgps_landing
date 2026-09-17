"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, splitText, stagger } from "animejs";
import HeroBackdrop from "./HeroBackdrop";
import { useDict } from "@/i18n/DictProvider";

const figureValues = [
  { value: 10, prefix: "", prefixUz: "", suffix: "+", suffixUz: "+" },
  { value: 30, prefix: "до ", prefixUz: "", suffix: "%", suffixUz: "% gacha" },
  { value: 10000, prefix: "", prefixUz: "", suffix: " +", suffixUz: "" },
];

export default function Hero() {
  const { t, locale } = useDict();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((n) => (n.style.opacity = "1"));
      return;
    }
    const heading = el.querySelector<HTMLElement>("h1")!;
    heading.style.opacity = "1";
    if (!heading.dataset.split) {
      heading.dataset.split = "1";
      splitText(heading, { words: { wrap: "clip" } });
    }

    const tl = createTimeline({ defaults: { ease: "outQuart" } })
      .add(heading.querySelectorAll("[data-word]"), { translateY: ["105%", "0%"], duration: 1000, delay: stagger(45) }, 150)
      .add(el.querySelectorAll("[data-hero-copy]"), { opacity: [0, 1], translateY: [18, 0], duration: 800, delay: stagger(100) }, 600);

    const counters = Array.from(el.querySelectorAll<HTMLElement>("[data-count]")).map((node) => {
      const target = Number(node.dataset.count);
      const obj = { v: 0 };
      return animate(obj, {
        v: target,
        duration: 1800,
        delay: 900,
        ease: "outExpo",
        onUpdate: () => {
          node.textContent = Math.round(obj.v).toLocaleString("ru-RU");
        },
      });
    });

    return () => {
      tl.pause();
      counters.forEach((c) => c.pause());
    };
  }, []);

  return (
    <section ref={root} id="top" className="relative isolate overflow-hidden bg-ink pt-20 text-paper lg:pt-24">
      <HeroBackdrop />

      <div className="wrap relative flex flex-col items-center justify-center pb-20 pt-20 text-center lg:min-h-[calc(100svh-96px)] lg:pb-24">
        <h1 data-reveal className="h-display mx-auto max-w-245 text-[clamp(44px,6.4vw,100px)]">
          {t.hero.h1}
        </h1>
        <p data-reveal data-hero-copy className="mx-auto mt-8 max-w-155 text-[clamp(17px,1.4vw,20px)] leading-relaxed text-paper/75">
          {t.hero.lead}
        </p>
        <div data-reveal data-hero-copy className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <a href="#contact" className="btn-primary">
            {t.common.consultation}
          </a>
          <a href="#platform" className="btn-ghost text-paper">
            {t.hero.ctaSecondary}
          </a>
        </div>

        <dl data-reveal data-hero-copy className="mx-auto mt-20 grid w-full max-w-190 grid-cols-3 border-t border-paper/20">
          {figureValues.map((f, i) => (
            <div key={f.value} className={`px-3 pt-6 sm:px-6 ${i ? "border-l border-paper/15" : ""}`}>
              <dt className="sr-only">{t.hero.figures[i].label}</dt>
              <dd className="num font-display text-[clamp(24px,3vw,42px)] font-medium tracking-[-0.03em]">
                {locale === "ru" ? f.prefix : f.prefixUz}
                <span data-count={f.value}>{f.value.toLocaleString("ru-RU")}</span>
                {locale === "ru" ? f.suffix : f.suffixUz}
              </dd>
              <dd className="mt-1 text-[13px] leading-snug text-paper/55 sm:text-[14px]">{t.hero.figures[i].label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
