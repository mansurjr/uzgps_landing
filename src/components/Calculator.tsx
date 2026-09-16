"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate } from "animejs";
import { useReveal } from "@/lib/useReveal";

// litres per 100 km — typical averages used for the estimate
const kinds = [
  { key: "car", label: "Легковые", l100: 10 },
  { key: "truck", label: "Грузовые до 10 т", l100: 22 },
  { key: "heavy", label: "Грузовые от 10 т", l100: 32 },
  { key: "special", label: "Спецтехника", l100: 28 },
];

const WORK_DAYS = 22;
// conservative share of fuel cost recovered: drains, personal trips, idling, route padding
const SAVE_SHARE = 0.2;

const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU");

export default function Calculator() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const [kind, setKind] = useState(kinds[1].key);
  const [count, setCount] = useState(25);
  const [km, setKm] = useState(180);
  const [price, setPrice] = useState(11000);

  const r = useMemo(() => {
    const l100 = kinds.find((k) => k.key === kind)!.l100;
    const litres = count * km * WORK_DAYS * (l100 / 100);
    const cost = litres * price;
    return { litresSaved: litres * SAVE_SHARE, month: cost * SAVE_SHARE, year: cost * SAVE_SHARE * 12, cost };
  }, [kind, count, km, price]);

  return (
    <section ref={root} id="calculator" className="border-t border-rule bg-white py-24 lg:py-36">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 data-reveal className="h-section">
            Посчитайте, сколько теряет ваш автопарк
          </h2>
          <p data-reveal className="lead max-w-[520px] lg:justify-self-end">
            Укажите параметры парка — калькулятор покажет, сколько можно вернуть за счёт контроля сливов, личных поездок и
            простоя.
          </p>
        </div>

        <div className="mt-16 grid border-2 border-ink lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div data-reveal className="space-y-10 p-6 md:p-10">
            <fieldset>
              <legend className="text-[15px] font-medium">Тип техники</legend>
              <div className="mt-4 grid grid-cols-2 gap-px border border-ink bg-ink md:grid-cols-4">
                {kinds.map((k) => (
                  <button
                    key={k.key}
                    type="button"
                    onClick={() => setKind(k.key)}
                    aria-pressed={kind === k.key}
                    className={`px-4 py-3.5 text-left text-[15px] transition-colors ${kind === k.key ? "bg-ink text-paper" : "bg-paper hover:bg-paper-2"}`}
                  >
                    {k.label}
                    <span className={`num mt-0.5 block text-[13px] ${kind === k.key ? "text-paper/60" : "text-graphite"}`}>
                      ~{k.l100} л/100 км
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <Slider label="Количество машин" value={count} min={1} max={500} onChange={setCount} suffix="шт." />
            <Slider label="Средний пробег одной машины в день" value={km} min={10} max={600} step={10} onChange={setKm} suffix="км" />
            <Slider label="Цена топлива" value={price} min={6000} max={16000} step={100} onChange={setPrice} suffix="сум/л" />
          </div>

          <div data-reveal className="flex flex-col justify-between bg-ink p-6 text-paper md:p-10">
            <div>
              <p className="text-[15px] text-paper/60">Можно сэкономить за год</p>
              <p className="num mt-3 font-display text-[clamp(40px,5vw,68px)] font-medium leading-none tracking-[-0.04em] text-primary">
                <Counter value={r.year} />
              </p>
              <p className="mt-2 text-[15px] text-paper/60">сум</p>

              <dl className="mt-10 border-t border-rule-inv">
                <Row label="В месяц" value={<><Counter value={r.month} /> сум</>} />
                <Row label="Топлива в месяц" value={<><Counter value={r.litresSaved} /> л</>} />
                <Row label="Текущие затраты на топливо" value={<>{fmt(r.cost)} сум/мес</>} />
              </dl>
            </div>

            <div className="mt-10">
              <a href="#contact" className="btn-primary w-full">
                Получить точный расчёт
              </a>
              <p className="mt-4 text-[13px] leading-relaxed text-paper/45">
                Оценка при {WORK_DAYS} рабочих днях и возврате {SAVE_SHARE * 100}% затрат на топливо. Клиенты UZGPS
                фиксируют до 30%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef({ v: value });

  useEffect(() => {
    const anim = animate(current.current, {
      v: value,
      duration: 700,
      ease: "outQuart",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = fmt(current.current.v);
      },
    });
    return () => {
      anim.pause();
    };
  }, [value]);

  return <span ref={ref}>{fmt(value)}</span>;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule-inv py-3.5 text-[15px]">
      <dt className="text-paper/60">{label}</dt>
      <dd className="num text-right font-medium">{value}</dd>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-[15px] font-medium">{label}</span>
        <span className="num shrink-0 text-[20px] font-semibold">
          {fmt(value)} <span className="text-[14px] font-normal text-graphite">{suffix}</span>
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-5 w-full cursor-pointer"
        style={{ background: `linear-gradient(90deg, var(--ink) ${pct}%, var(--rule-strong) ${pct}%)` }}
      />
      <span className="num mt-2 flex justify-between text-[12px] text-graphite">
        <span>{fmt(min)}</span>
        <span>{fmt(max)}</span>
      </span>
    </label>
  );
}
