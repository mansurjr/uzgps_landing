"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, svg } from "animejs";
import { useReveal } from "@/lib/useReveal";

const steps = [
  { t: "Монтаж оборудования", d: "Устанавливаем GPS-трекер и датчики топлива. Гарантия на оборудование — 12 месяцев." },
  { t: "Передача данных", d: "Координаты, скорость и уровень топлива уходят на сервер по сотовой сети каждые несколько секунд." },
  { t: "Обработка на сервере", d: "Облако UZGPS или ваш собственный сервер фиксирует события и хранит всю историю." },
  { t: "Результат у вас", d: "Карта, отчёты и уведомления в браузере и в мобильном приложении." },
];

export default function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<SVGSVGElement>(null);
  useReveal(root);

  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const running: { pause: () => unknown }[] = [];

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const line = el.querySelector<SVGPathElement>("[data-line]")!;
      running.push(animate(svg.createDrawable(line), { draw: ["0 0", "0 1"], duration: 1800, ease: "inOutQuart" }));
      running.push(
        animate(el.querySelectorAll("[data-node]"), {
          fill: ["#f4f6f9", "#00adec"],
          duration: 300,
          delay: stagger(1800 / 3.2, { start: 50 }),
          ease: "linear",
        }),
      );
      running.push(
        animate(el.querySelector("[data-packet]")!, {
          ...svg.createMotionPath(line),
          duration: 4200,
          delay: 1900,
          loop: true,
          ease: "inOutSine",
        }),
      );
    });
    io.observe(el);
    return () => {
      io.disconnect();
      running.forEach((r) => r.pause());
    };
  }, []);

  return (
    <section ref={root} aria-labelledby="how-title" className="border-t border-rule bg-white py-24 lg:py-32">
      <div className="wrap">
        <h2 id="how-title" data-reveal className="h-section max-w-[720px]">
          От установки до первого отчёта
        </h2>

        <div className="mt-16 hidden lg:block">
          <svg ref={track} viewBox="0 0 1000 24" className="w-full overflow-visible" preserveAspectRatio="none">
            <line x1="12" x2="988" y1="12" y2="12" stroke="rgba(17,19,21,.2)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path data-line d="M12 12 L988 12" stroke="#0a1a30" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
            {[12, 337, 662, 988].map((cx) => (
              <rect key={cx} data-node x={cx - 8} y="4" width="16" height="16" fill="#f4f6f9" stroke="#0a1a30" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            ))}
            <rect data-packet x="-4" y="-4" width="8" height="8" fill="#0a1a30" />
          </svg>
        </div>

        <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-10">
          {steps.map((s, i) => (
            <li key={s.t} data-reveal className="border-t-2 border-ink pt-5 lg:border-0 lg:pt-0">
              <p className="num text-[15px] text-graphite">Шаг {i + 1}</p>
              <h3 className="mt-2 font-display text-[22px] leading-tight tracking-[-0.02em]">{s.t}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-graphite">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
