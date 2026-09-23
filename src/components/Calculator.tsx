"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate } from "animejs";
import { fill } from "@/i18n";
import { useDict } from "@/i18n/DictProvider";
import { useReveal } from "@/lib/useReveal";


const l100 = [10, 22, 32, 28];

const WORK_DAYS = 22;

const SAVE_SHARE = 0.2;

const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU");
const roundApprox = (n: number) => {
  if (n === 0) return 0;
  const step = 10 ** Math.max(0, Math.floor(Math.log10(Math.abs(n))) - 1);
  return Math.round(n / step) * step;
};

export default function Calculator() {
  const { t } = useDict();
  const kinds = t.calculator.kinds.map((label, i) => ({ key: String(i), label, l100: l100[i] }));
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const [kind, setKind] = useState("1");
  const [count, setCount] = useState(25);
  const [km, setKm] = useState(180);
  const [price, setPrice] = useState(11000);

  const r = useMemo(() => {
    const litresPer100 = l100[Number(kind)];
    const litres = count * km * WORK_DAYS * (litresPer100 / 100);
    const cost = litres * price;
    return { litresSaved: litres * SAVE_SHARE, month: cost * SAVE_SHARE, year: cost * SAVE_SHARE * 12, cost };
  }, [kind, count, km, price]);

  return (
    <section ref={root} id="calculator" className="bg-ink py-16 text-paper sm:py-24 lg:py-36">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 data-reveal className="h-section">
            {t.calculator.title}
          </h2>
          <p data-reveal className="max-w-130 text-[18px] leading-relaxed text-paper/60 lg:justify-self-end">
            {t.calculator.lead}
          </p>
        </div>

        <div className="mt-10 sm:mt-16 grid border border-rule-inv bg-ink-2 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div data-reveal className="space-y-8 p-5 sm:space-y-10 sm:p-8 md:p-10">
            <fieldset>
              <legend className="text-[14px] font-medium sm:text-[15px]">{t.calculator.kindLegend}</legend>
              <div className="mt-3 grid grid-cols-2 gap-px border border-rule-inv bg-rule-inv sm:mt-4 md:grid-cols-4">
                {kinds.map((k) => (
                  <button
                    key={k.key}
                    type="button"
                    onClick={() => setKind(k.key)}
                    aria-pressed={kind === k.key}
                    className={`px-3 py-3 text-left text-[13px] transition-colors sm:px-4 sm:py-3.5 sm:text-[15px] ${kind === k.key ? "bg-primary text-ink" : "bg-ink-2 hover:bg-ink-3"}`}
                  >
                    <span className="block truncate font-medium">{k.label}</span>
                    <span className={`num mt-0.5 block text-[12px] sm:text-[13px] ${kind === k.key ? "text-ink/65" : "text-paper/50"}`}>
                        {k.l100} {t.calculator.per100}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <Slider label={t.calculator.countLabel} value={count} min={1} max={500} onChange={setCount} suffix={t.calculator.units.pcs} />
            <Slider label={t.calculator.kmLabel} value={km} min={10} max={600} step={10} onChange={setKm} suffix={t.calculator.units.km} />
            <Slider label={t.calculator.priceLabel} value={price} min={6000} max={16000} step={100} onChange={setPrice} suffix={t.calculator.units.sumPerL} />
          </div>

          <div data-reveal className="flex flex-col justify-between bg-navy p-5 text-paper sm:p-8 md:p-10">
            <div>
              <p className="text-[14px] text-paper/60 sm:text-[15px]">{t.calculator.resultTitle}</p>
              <p className="num mt-2 font-display text-[clamp(32px,7.5vw,68px)] font-medium leading-none tracking-[-0.04em] text-primary sm:mt-3">
                <Counter value={r.year} />
              </p>
              <p className="mt-2 text-[20px] text-paper/60 sm:text-[25px]">{t.calculator.units.sum}</p>

              <dl className="mt-8 border-t border-rule-inv sm:mt-10">
                <Row label={t.calculator.perMonth} value={<>≈ <Counter value={r.month} /> {t.calculator.units.sum}</>} />
                <Row label={t.calculator.fuelPerMonth} value={<>≈ <Counter value={r.litresSaved} /> {t.calculator.units.litres}</>} />
                <Row label={t.calculator.currentCost} value={<>≈ {fmt(roundApprox(r.cost))} {t.calculator.perMonthSuffix}</>} />
              </dl>
            </div>

            <div className="mt-8 sm:mt-10">
              <a href="#contact" className="btn-primary w-full justify-center text-center">{t.calculator.cta}</a>
              <p className="mt-4 text-[12px] leading-relaxed text-paper/45 sm:text-[13px]">
                {fill(t.calculator.note, { days: WORK_DAYS, share: SAVE_SHARE * 100 })}
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
  const rounded = roundApprox(value);
  const current = useRef({ v: rounded });

  useEffect(() => {
    const anim = animate(current.current, {
      v: rounded,
      duration: 700,
      ease: "outQuart",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = fmt(roundApprox(current.current.v));
      },
    });
    return () => {
      anim.pause();
    };
  }, [rounded]);

  return <span ref={ref}>{fmt(rounded)}</span>;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-rule-inv py-3 text-[14px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:py-3.5 sm:text-[15px]">
      <dt className="text-paper/60">{label}</dt>
      <dd className="num font-medium text-paper sm:text-right">{value}</dd>
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
      <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-[14px] font-medium sm:text-[15px]">{label}</span>
        <span className="num shrink-0 text-[17px] font-semibold sm:text-[20px]">
          {fmt(value)} <span className="text-[13px] font-normal text-paper/50 sm:text-[14px]">{suffix}</span>
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 sm:mt-5 w-full cursor-pointer h-2"
        style={{ background: `linear-gradient(90deg, var(--primary) ${pct}%, var(--rule-inv) ${pct}%)` }}
      />
      <span className="num mt-2 flex justify-between text-[11px] text-paper/45 sm:text-[12px]">
        <span>{fmt(min)}</span>
        <span>{fmt(max)}</span>
      </span>
    </label>
  );
}
