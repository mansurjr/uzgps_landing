"use client";

import { useEffect, useRef, useState } from "react";
import TablerIcon, { type TablerName } from "./TablerIcon";

/** Vuetify light theme of smn-web (src/plugins/vuetify/theme.ts) */
export const T = {
  primary: "#23487d",
  secondary: "#808390",
  success: "#28C76F",
  info: "#0097e8",
  warning: "#FF9F43",
  error: "#FF4C51",
  onSurface: "#2F2B3D",
  background: "#f1f1f1",
  border: "rgba(47,43,61,.16)",
  cardShadow: "0 3px 12px rgba(47,43,61,.14)",
};

export const SCREEN_W = 1440;
export const SCREEN_H = 900;

/** Renders children on a fixed 1440×900 "screen" scaled to the container width, like a real screenshot. */
export function ScaledScreen({ children, background = T.background }: { children: React.ReactNode; background?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    setScale(el.clientWidth / SCREEN_W);
    const ro = new ResizeObserver(() => setScale(el.clientWidth / SCREEN_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={frame}
      className="relative w-full overflow-hidden rounded-md shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)]"
      style={{ aspectRatio: `${SCREEN_W} / ${SCREEN_H}`, background }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left select-none"
        style={{ width: SCREEN_W, height: SCREEN_H, transform: `scale(${scale})`, fontFamily: "var(--font-smpo), Inter, sans-serif", color: T.onSurface }}
      >
        {children}
      </div>
    </div>
  );
}

export function Checkbox({ checked, indeterminate }: { checked: boolean; indeterminate?: boolean }) {
  return (
    <span
      className="grid size-5 shrink-0 place-items-center rounded text-white"
      style={{ background: checked || indeterminate ? T.primary : "transparent", border: checked || indeterminate ? "none" : `2px solid ${T.secondary}` }}
    >
      {(checked || indeterminate) && <TablerIcon name={indeterminate ? "minusBold" : "check"} size={14} />}
    </span>
  );
}

/** Vuetify outlined text field with a floating label on the border */
export function Field({ label, value, icon, suffix, className = "" }: { label?: string; value: string; icon?: TablerName; suffix?: string; className?: string }) {
  return (
    <div className={className}>
      {label && <div className="mb-1 text-[13px]" style={{ color: T.onSurface }}>{label}</div>}
      <div className="flex h-[38px] items-center justify-between gap-2 rounded-md border bg-white px-3 text-[15px]" style={{ borderColor: T.border }}>
        <span className="truncate">{value}</span>
        {suffix && <span className="text-[14px]" style={{ color: T.secondary }}>{suffix}</span>}
        {icon && <TablerIcon name={icon} size={20} color={T.secondary} />}
      </div>
    </div>
  );
}

export function Btn({ children, variant = "flat", color = T.primary, className = "" }: { children: React.ReactNode; variant?: "flat" | "tonal" | "outlined"; color?: string; className?: string }) {
  const style =
    variant === "flat"
      ? { background: color, color: "#fff", boxShadow: "0 2px 4px rgba(47,43,61,.2)" }
      : variant === "tonal"
        ? { background: `${color}29`, color }
        : { border: `1px solid ${color}`, color };
  return (
    <span className={`inline-flex h-[38px] items-center justify-center gap-2 rounded-md px-5 text-[15px] font-medium ${className}`} style={style}>
      {children}
    </span>
  );
}

const navItems: { icon: TablerName; title: string; children?: string[]; key: string }[] = [
  { key: "map", icon: "map", title: "Карта", children: ["Мониторинг", "Трекинг", "PoI", "ZoI"] },
  { key: "messages", icon: "message", title: "Сообщения" },
  { key: "reports", icon: "report-analytics", title: "Отчеты" },
  { key: "settings", icon: "settings", title: "Настройки", children: ["Настройки Карт", "Настройки Мониторинга", "Настройки Объектов"] },
];

/** Vuexy vertical navigation + navbar used by non-map pages of the client */
export function AppShell({ active, activeChild, title, children }: { active: string; activeChild?: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex size-full">
      <aside className="flex w-[260px] shrink-0 flex-col bg-white shadow-[0_2px_8px_rgba(47,43,61,.12)]">
        <div className="flex h-[64px] items-center gap-2.5 px-6">
          {/* eslint-disable-next-line @next/next/no-img-element -- brand pin */}
          <img src="/brand/pin.svg" alt="" width={18} height={28} />
          <span className="text-[22px] font-bold tracking-tight" style={{ color: T.primary }}>UZGPS</span>
        </div>
        <nav className="flex-1 px-3.5 pt-2">
          {navItems.map((n) => {
            const on = n.key === active;
            return (
              <div key={n.key} className="mb-1">
                <div
                  className="flex h-[38px] items-center gap-2.5 rounded-md px-3 text-[15px]"
                  style={on && !n.children ? { background: `linear-gradient(72deg, ${T.primary}, ${T.primary}b3)`, color: "#fff", boxShadow: "0 2px 6px rgba(35,72,125,.3)" } : on ? { background: "rgba(47,43,61,.06)" } : undefined}
                >
                  <TablerIcon name={n.icon} size={22} />
                  <span className="flex-1">{n.title}</span>
                  {n.children && <TablerIcon name={on ? "chevron-down" : "chevron-right"} size={16} color={T.secondary} />}
                </div>
                {on &&
                  n.children?.map((c) => (
                    <div
                      key={c}
                      className="my-0.5 flex h-[38px] items-center gap-3 rounded-md pl-6 pr-3 text-[15px]"
                      style={c === activeChild ? { background: `linear-gradient(72deg, ${T.primary}, ${T.primary}b3)`, color: "#fff", boxShadow: "0 2px 6px rgba(35,72,125,.3)" } : undefined}
                    >
                      <span className="size-2 rounded-full border-2" style={{ borderColor: c === activeChild ? "#fff" : T.secondary }} />
                      {c}
                    </div>
                  ))}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col px-6">
        <header className="mt-4 flex h-[56px] shrink-0 items-center justify-between rounded-md bg-white px-5 shadow-[0_2px_8px_rgba(47,43,61,.12)]">
          <span className="flex items-center gap-2 text-[15px]" style={{ color: T.secondary }}>
            <TablerIcon name="search" size={22} /> Поиск
          </span>
          <span className="flex items-center gap-5" style={{ color: T.onSurface }}>
            <span className="text-[14px] font-medium">RU</span>
            <TablerIcon name="bell" size={22} />
            <span className="grid size-[38px] place-items-center rounded-full text-white" style={{ background: T.primary }}>
              <TablerIcon name="user" size={20} />
            </span>
          </span>
        </header>
        <div className="mt-5 flex items-center gap-2 text-[15px]" style={{ color: T.secondary }}>
          SMN <TablerIcon name="chevron-right" size={14} /> <span style={{ color: T.onSurface }}>{title}</span>
        </div>
        <div className="mt-4 min-h-0 flex-1 pb-6">{children}</div>
      </div>
    </div>
  );
}
