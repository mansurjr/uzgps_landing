"use client";

import { useRef } from "react";
import DeviceCarousel from "./DeviceCarousel";
import { useReveal } from "@/lib/useReveal";
import { equipmentKit, fuelSensors } from "@/data/content";

export default function Equipment() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="equipment" className="bg-ink py-24 text-paper lg:py-36">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 data-reveal className="h-section">
            Оборудование, монтаж и обслуживание
          </h2>
          <p data-reveal className="max-w-[520px] text-[18px] leading-relaxed text-paper/60 lg:justify-self-end">
            Полный цикл — от подбора и установки до технического обслуживания. Гарантия на оборудование 12 месяцев.
          </p>
        </div>

        <div className="mt-16 grid  md:grid-cols-3">
          {equipmentKit.map((k) => (
            <div key={k.t} data-reveal className="bg-ink pb-2 pr-6 pt-8 md:pb-10">
              <h3 className="font-display text-[24px] leading-tight tracking-[-0.02em]">{k.t}</h3>
              <p className="mt-4 text-[16px] leading-relaxed text-paper/60">{k.d}</p>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-12 flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t border-rule-inv pt-6 text-[15px] text-paper/60">
          <span className="text-paper">Датчики уровня топлива:</span>
          {fuelSensors.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>

        <div data-reveal className="mt-16 border-t border-rule-inv pt-12">
          <DeviceCarousel />
        </div>
      </div>
    </section>
  );
}
