"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, splitText, stagger } from "animejs";
import HeroBackdrop from "./HeroBackdrop";

const figures = [
  { value: 2014, prefix: "с ", suffix: "", label: "года на рынке Узбекистана" },
  { value: 30, prefix: "до ", suffix: "%", label: "снижение затрат на топливо" },
  { value: 10000, prefix: "", suffix: "", label: "машин на одном сервере СМПО" },
];

export default function Hero() {
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
    // StrictMode runs effects twice; split the heading only once
    if (!heading.dataset.split) {
      heading.dataset.split = "1";
      splitText(heading, { words: { wrap: "clip" } });
    }

    const tl = createTimeline({ defaults: { ease: "outQuart" } })
      .add(heading.querySelectorAll("[data-word]"), { translateY: ["105%", "0%"], duration: 1000, delay: stagger(45) }, 150)
      .add(el.querySelectorAll("[data-hero-copy]"), { opacity: [0, 1], translateY: [18, 0], duration: 800, delay: stagger(100) }, 600);

    const counters = Array.from(el.querySelectorAll<HTMLElement>("[data-count]")).map((node) => {
      const target = Number(node.dataset.count);
      const obj = { v: target === 2014 ? 1990 : 0 };
      return animate(obj, {
        v: target,
        duration: 1800,
        delay: 900,
        ease: "outExpo",
        onUpdate: () => {
          node.textContent = target === 2014 ? String(Math.round(obj.v)) : Math.round(obj.v).toLocaleString("ru-RU");
        },
      });
    });

    return () => {
      tl.pause();
      counters.forEach((c) => c.pause());
    };
  }, []);

  return (
    <section ref={root} id="top" className="relative isolate overflow-hidden bg-ink pt-[76px] text-paper lg:pt-[112px]">
      <HeroBackdrop />

      <div className="wrap relative flex flex-col items-center justify-center pb-20 pt-20 text-center lg:min-h-[calc(100svh-112px)] lg:pb-24">
        <h1 data-reveal className="h-display mx-auto max-w-[980px] text-[clamp(44px,6.4vw,100px)]">
          Контроль автопарка без догадок
        </h1>
        <p data-reveal data-hero-copy className="mx-auto mt-8 max-w-[620px] text-[clamp(17px,1.4vw,20px)] leading-relaxed text-paper/75">
          Спутниковый мониторинг транспорта и персонала: где машина, сколько топлива, кто нарушил маршрут — онлайн, в браузере
          и в мобильном приложении.
        </p>
        <div data-reveal data-hero-copy className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <a href="#contact" className="btn-primary">
            Получить консультацию
          </a>
          <a href="#platform" className="btn-ghost text-paper">
            Посмотреть систему
          </a>
        </div>

        <dl data-reveal data-hero-copy className="mx-auto mt-20 grid w-full max-w-[760px] grid-cols-3 border-t border-paper/20">
          {figures.map((f, i) => (
            <div key={f.label} className={`px-3 pt-6 sm:px-6 ${i ? "border-l border-paper/15" : ""}`}>
              <dt className="sr-only">{f.label}</dt>
              <dd className="num font-display text-[clamp(24px,3vw,42px)] font-medium tracking-[-0.03em]">
                {f.prefix}
                <span data-count={f.value}>{f.value === 2014 ? "2014" : f.value.toLocaleString("ru-RU")}</span>
                {f.suffix}
              </dd>
              <dd className="mt-1 text-[13px] leading-snug text-paper/55 sm:text-[14px]">{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
