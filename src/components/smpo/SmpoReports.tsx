"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { AppShell, ScaledScreen, T } from "./shared";
import TablerIcon from "./TablerIcon";

/*
 * «Отчеты» in the СМПО client embed Apache Superset dashboards (@superset-ui/embedded-sdk, superset.uzgps.uz).
 * This reproduces a fleet dashboard the way it sits inside the client shell.
 */

const kpis = [
  { label: "Пробег, км", value: "18 240", delta: "+6,2%" },
  { label: "Моточасы, ч", value: "1 126", delta: "+2,1%" },
  { label: "Нарушения скорости", value: "14", delta: "−18%" },
  { label: "Сливы топлива, л", value: "96", delta: "−41%" },
];

const mileage = [620, 710, 580, 820, 760, 540, 310, 640, 730, 690, 810, 770, 560, 330];
const fuel = [38, 36, 41, 34, 33, 37, 39, 35, 32, 34, 31, 30, 33, 32];

const violations = [
  { obj: "10 C 551 AA", time: "16.09 09:14", speed: 94, limit: 70, place: "Кольцевая автодорога" },
  { obj: "01 B 208 GP", time: "16.09 11:02", speed: 81, limit: 60, place: "пр. Амира Темура" },
  { obj: "01 E 067 MA", time: "15.09 17:45", speed: 72, limit: 60, place: "ул. Мукими" },
  { obj: "01 714 UZA", time: "15.09 08:31", speed: 88, limit: 70, place: "ул. Бунёдкор" },
];

export default function SmpoReports() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = animate(el.querySelectorAll("[data-bar]"), { scaleY: [0, 1], duration: 900, delay: stagger(35), ease: "outQuart" });
    return () => {
      a.pause();
    };
  }, []);

  const max = Math.max(...mileage);

  return (
    <ScaledScreen>
      <AppShell active="reports" title="Отчеты">
        <div ref={root} className="flex h-full flex-col overflow-hidden rounded-md bg-white" style={{ boxShadow: T.cardShadow, fontFamily: "Inter, sans-serif" }}>
          {/* Superset dashboard header */}
          <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "#e0e0e0" }}>
            <div>
              <div className="text-[20px] font-semibold text-[#1f1f1f]">Отчёт по автопарку</div>
              <div className="mt-0.5 text-[13px] text-[#8c8c8c]">Обновлено 5 минут назад · Все объекты (6)</div>
            </div>
            <div className="flex items-center gap-3 text-[#666]">
              <span className="flex h-[34px] items-center gap-2 rounded border px-3 text-[14px]" style={{ borderColor: "#d9d9d9" }}>
                <TablerIcon name="calendar" size={16} /> 03.09 — 16.09.2026
              </span>
              <span className="flex h-[34px] items-center gap-2 rounded border px-3 text-[14px]" style={{ borderColor: "#d9d9d9" }}>
                <TablerIcon name="filter" size={16} /> Фильтры
              </span>
              <span className="grid size-[34px] place-items-center rounded border" style={{ borderColor: "#d9d9d9" }}>
                <TablerIcon name="download" size={16} />
              </span>
              <span className="grid size-[34px] place-items-center rounded border" style={{ borderColor: "#d9d9d9" }}>
                <TablerIcon name="dots-vertical" size={16} />
              </span>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-4 grid-rows-[auto_1fr_1fr] gap-4 bg-[#f7f7f7] p-4">
            {kpis.map((k) => (
              <div key={k.label} className="rounded border bg-white px-5 py-4" style={{ borderColor: "#e0e0e0" }}>
                <div className="text-[14px] font-medium text-[#484848]">{k.label}</div>
                <div className="mt-2 text-[40px] font-semibold leading-none tabular-nums text-[#1f1f1f]">{k.value}</div>
                <div className={`mt-2 text-[13px] ${k.delta.startsWith("−") ? "text-[#20a7c9]" : "text-[#666]"}`}>{k.delta} к прошлому периоду</div>
              </div>
            ))}

            <ChartCard title="Пробег по дням, км" className="col-span-2">
              <div className="flex h-full items-end gap-2 border-b border-l px-2 pt-2" style={{ borderColor: "#e0e0e0" }}>
                {mileage.map((m, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
                    <div data-bar className="w-full origin-bottom rounded-t-sm" style={{ height: `${(m / max) * 100}%`, background: i === 10 ? T.primary : "#1FA8C9" }} />
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Средний расход, л/100 км" className="col-span-2">
              <svg viewBox="0 0 520 170" className="size-full" preserveAspectRatio="none">
                {[0, 1, 2, 3].map((i) => (
                  <line key={i} x1="0" x2="520" y1={10 + i * 50} y2={10 + i * 50} stroke="#eee" />
                ))}
                <path
                  d={fuel.map((v, i) => `${i ? "L" : "M"}${(i / (fuel.length - 1)) * 510 + 5} ${160 - ((v - 25) / 20) * 150}`).join(" ")}
                  fill="none"
                  stroke="#FF7F44"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
                {fuel.map((v, i) => (
                  <circle key={i} cx={(i / (fuel.length - 1)) * 510 + 5} cy={160 - ((v - 25) / 20) * 150} r="3" fill="#FF7F44" />
                ))}
              </svg>
            </ChartCard>

            <ChartCard title="Нарушения скоростного режима" className="col-span-4">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b text-[13px] text-[#8c8c8c]" style={{ borderColor: "#e0e0e0" }}>
                    <th className="py-2 font-medium">Объект</th>
                    <th className="py-2 font-medium">Время</th>
                    <th className="py-2 font-medium">Скорость, км/ч</th>
                    <th className="py-2 font-medium">Лимит, км/ч</th>
                    <th className="py-2 font-medium">Место</th>
                  </tr>
                </thead>
                <tbody>
                  {violations.map((v) => (
                    <tr key={v.time} className="border-b text-[#1f1f1f]" style={{ borderColor: "#f0f0f0" }}>
                      <td className="py-2.5 font-medium">{v.obj}</td>
                      <td className="py-2.5 tabular-nums">{v.time}</td>
                      <td className="py-2.5 font-semibold tabular-nums" style={{ color: T.error }}>{v.speed}</td>
                      <td className="py-2.5 tabular-nums">{v.limit}</td>
                      <td className="py-2.5 text-[#484848]">{v.place}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ChartCard>
          </div>
        </div>
      </AppShell>
    </ScaledScreen>
  );
}

function ChartCard({ title, className = "", children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex min-h-0 flex-col rounded border bg-white px-5 py-4 ${className}`} style={{ borderColor: "#e0e0e0" }}>
      <div className="mb-3 flex items-center justify-between text-[14px] font-medium text-[#484848]">
        {title}
        <TablerIcon name="dots-vertical" size={16} color="#8c8c8c" />
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
