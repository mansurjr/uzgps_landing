"use client";

import { useRef } from "react";
import { problems } from "@/data/content";
import { useReveal } from "@/lib/useReveal";

export default function Problems() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} aria-labelledby="problems-title" className="bg-white py-24 lg:py-36">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 id="problems-title" data-reveal className="h-section max-w-[620px]">
            Автопарк работает, а расходы растут. Знакомо?
          </h2>
          <p data-reveal className="lead max-w-[520px] lg:justify-self-end">
            Пять вопросов, с которыми к нам чаще всего приходят руководители автопарков, и решение от платформы UZGPS.
          </p>
        </div>

        <div className="mt-16 border-t-2 border-ink">
          <ul>
            {problems.map((p) => (
              <li
                key={p.q}
                data-reveal
                className="group relative grid gap-3 border-b border-rule py-7 md:grid-cols-2 md:gap-10 md:py-8"
              >
                <span className="absolute -left-4 top-0 hidden h-full w-[3px] origin-top scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100 lg:block" />
                <p className="font-display text-[clamp(20px,1.9vw,26px)] leading-snug tracking-[-0.02em] font-medium">{p.q}</p>
                <p className="text-[17px] leading-relaxed text-graphite md:pt-1">{p.a}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
