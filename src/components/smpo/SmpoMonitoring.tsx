"use client";

import { useEffect, useRef, useState } from "react";
import { createTimer } from "animejs";
import routesJson from "@/data/routes.json";
import { along, measure, type LngLat } from "@/lib/geo";
import PlateNumber, { type Plate } from "./PlateNumber";
import TablerIcon, { type TablerName } from "./TablerIcon";
import { Checkbox, T } from "./shared";

/*
 * Replica of the СМПО «Мониторинг» screen (smn-web/src/domains/smn/map/pages/monitoring):
 * full-screen map, 456px floating object list (MapSidebar + MonitoringSidebarHeader + MonitoringListView),
 * VehiclePopup over the selected object. Drawn at the real 1440×900 size and scaled to fit.
 */


type StatusCode = "MOVING" | "STOP" | "PARKING" | "CONNECTION_LOST";
// iconOptionsStatus from smn-web/src/domains/smn/map/shared/data/mockData.ts
const STATUS: Record<StatusCode, { icon: TablerName; label: string; color: string }> = {
  MOVING: { icon: "gps", label: "В движении", color: T.success },
  STOP: { icon: "player-pause-filled", label: "Остановка", color: "#FFEA00" },
  PARKING: { icon: "parking-circle", label: "Стоянка", color: T.info },
  CONNECTION_LOST: { icon: "alert-triangle", label: "Потеря связи", color: T.warning },
};

type Obj = {
  id: number;
  name: string;
  model: string;
  plate: Plate;
  icon: string;
  status: StatusCode;
  kmh: number;
  engine: boolean;
  sats: number;
  route: keyof typeof routesJson;
  offset: number;
  stats: { distance: string; violations: string; engineHours: string; fuel: string; parkings: string };
};

const OBJECTS: Obj[] = [
  {
    id: 1, name: "Фургон", model: "Фургон", icon: "truck", status: "MOVING", kmh: 58, engine: true, sats: 14, route: "r1", offset: 0.55,
    plate: { type: 1, region: "01", numbers: "714", symbols: "UZA" },
    stats: { distance: "84,6", violations: "0", engineHours: "6,2", fuel: "40/0", parkings: "5" },
  },
  {
    id: 2, name: "Грузовой автомобиль", model: "Грузовой автомобиль", icon: "gruzovik", status: "MOVING", kmh: 41, engine: true, sats: 12, route: "r3", offset: 0.45,
    plate: { type: 3, region: "10", letter: "C", numbers: "551", symbols: "AA" },
    stats: { distance: "126,3", violations: "2", engineHours: "7,8", fuel: "60/32", parkings: "9" },
  },
  {
    id: 3, name: "Легковой автомобиль", model: "Легковой автомобиль", icon: "taxi", status: "MOVING", kmh: 52, engine: true, sats: 11, route: "r2", offset: 0.35,
    plate: { type: 3, region: "01", letter: "B", numbers: "208", symbols: "GP" },
    stats: { distance: "211,0", violations: "1", engineHours: "9,4", fuel: "35/0", parkings: "14" },
  },
  {
    id: 4, name: "Пикап", model: "Пикап", icon: "pickup2", status: "PARKING", kmh: 0, engine: false, sats: 10, route: "r4", offset: 0.82,
    plate: { type: 1, region: "01", numbers: "390", symbols: "KBA" },
    stats: { distance: "32,8", violations: "0", engineHours: "2,1", fuel: "0/0", parkings: "3" },
  },
  {
    id: 5, name: "Автобус", model: "Автобус", icon: "bus", status: "STOP", kmh: 0, engine: true, sats: 13, route: "r5", offset: 0.3,
    plate: { type: 1, region: "01", numbers: "067", symbols: "MAA" },
    stats: { distance: "148,5", violations: "0", engineHours: "10,0", fuel: "80/0", parkings: "21" },
  },
  {
    id: 6, name: "Экскаватор", model: "Экскаватор", icon: "excavator", status: "CONNECTION_LOST", kmh: 0, engine: false, sats: 4, route: "r6", offset: 0.2,
    plate: { type: 1, region: "01", numbers: "925", symbols: "TTA" },
    stats: { distance: "12,4", violations: "0", engineHours: "4,5", fuel: "0/0", parkings: "1" },
  },
  {
    id: 7, name: "Курьерский фургон", model: "Курьерский фургон", icon: "truck", status: "MOVING", kmh: 36, engine: true, sats: 13, route: "r3", offset: 0.35,
    plate: { type: 1, region: "01", numbers: "482", symbols: "ABA" },
    stats: { distance: "96,2", violations: "0", engineHours: "5,7", fuel: "24/0", parkings: "7" },
  },
  {
    id: 8, name: "Сервисный автомобиль", model: "Сервисный автомобиль", icon: "taxi", status: "PARKING", kmh: 0, engine: false, sats: 11, route: "r2", offset: 0.72,
    plate: { type: 1, region: "01", numbers: "316", symbols: "BBA" },
    stats: { distance: "73,8", violations: "0", engineHours: "4,1", fuel: "18/0", parkings: "4" },
  },
];

const W = 1440;
const H = 900;
const Z = 14;
const POPUP_W = 419;
const CENTER: LngLat = [69.228, 41.302];
const WORLD = 256 * 2 ** Z;

function toWorld([lng, lat]: LngLat) {
  const s = Math.sin((lat * Math.PI) / 180);
  return { x: ((lng + 180) / 360) * WORLD, y: (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * WORLD };
}
const origin = (() => {
  const c = toWorld(CENTER);
  return { x: c.x - W / 2, y: c.y - H / 2 };
})();
const toScreen = (p: LngLat) => {
  const w = toWorld(p);
  return { x: w.x - origin.x, y: w.y - origin.y };
};

function positionPopup(element: HTMLDivElement, point: { x: number; y: number }) {
  const height = element.offsetHeight || 290;
  const x = Math.min(W - POPUP_W - 16, Math.max(492, point.x - POPUP_W / 2));
  const above = point.y - height - 20;
  const y = above < 16 ? point.y + 32 : above;
  element.style.transform = `translate(${x}px, ${Math.max(16, Math.min(H - height - 16, y))}px)`;
}

const satColor = (n: number) => (n > 6 ? T.success : n > 3 ? T.error : n > 0 ? T.warning : T.secondary);

const DEFAULT_OBJECT_ID = OBJECTS.find((o) => o.name === "Экскаватор")?.id ?? 6;

export default function SmpoMonitoring() {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [selected, setSelected] = useState<number | null>(DEFAULT_OBJECT_ID);
  const [showMore, setShowMore] = useState(false);
  const [speeds, setSpeeds] = useState<Record<number, number>>(() => Object.fromEntries(OBJECTS.map((o) => [o.id, o.kmh])));
  const markers = useRef<Record<number, HTMLDivElement | null>>({});
  const positions = useRef<Record<number, { x: number; y: number }>>({});
  const popup = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(selected);
  const selectVehicle = (id: number) => {
    setSelected(id);
    setShowMore(false);
  };
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (selected !== null && popup.current && positions.current[selected]) {
        positionPopup(popup.current, positions.current[selected]);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [selected, showMore]);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    setScale(el.clientWidth / W);
    const ro = new ResizeObserver(() => setScale(el.clientWidth / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // objects drive along the same OSRM street routes as the hero map
  useEffect(() => {
    const routes = Object.fromEntries(Object.entries(routesJson).map(([k, c]) => [k, measure(c as LngLat[])]));
    const state = OBJECTS.map((o) => ({ o, d: routes[o.route].length * o.offset, dir: 1, heading: 0 }));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = 0;
    let acc = 0;

    const place = (dt: number, now: number) => {
      const nextSpeeds: Record<number, number> = {};
      for (const s of state) {
        const r = routes[s.o.route];
        const kmh = s.o.status === "MOVING" ? s.o.kmh + Math.sin(now / 1500 + s.o.id) * 6 : 0;
        nextSpeeds[s.o.id] = Math.round(kmh);
        s.d += (kmh / 3.6) * dt * 6 * s.dir;
        if (s.d >= r.length || s.d <= 0) {
          s.dir *= -1;
          s.d = Math.min(r.length, Math.max(0, s.d));
        }
        const here = along(r, s.d).point;
        const ahead = along(r, Math.min(r.length, Math.max(0, s.d + 30 * s.dir))).point;
        const a = toScreen(here);
        const b = toScreen(ahead);
        positions.current[s.o.id] = a;
        if (s.o.status === "MOVING" || s.heading === 0) {
          const target = (Math.atan2(b.x - a.x, -(b.y - a.y)) * 180) / Math.PI;
          const diff = ((target - s.heading + 540) % 360) - 180;
          s.heading += diff * Math.min(1, dt * 8 || 1);
        }
        const m = markers.current[s.o.id];
        if (m) m.style.transform = `translate(${a.x}px, ${a.y}px)`;
        const icon = m?.querySelector<HTMLElement>("[data-vehicle-icon]");
        if (icon) icon.style.transform = `rotate(${s.heading}deg)`;
        if (popup.current && s.o.id === selectedRef.current) {
          // keep the popup on screen and clear of the object list
          positionPopup(popup.current, a);
        }
      }
      return nextSpeeds;
    };

    place(0.016, 0);
    if (reduce) return;
    const timer = createTimer({
      loop: true,
      duration: 1_000_000,
      onUpdate: (self) => {
        const now = self.currentTime;
        const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
        last = now;
        const sp = place(dt, now);
        acc += dt;
        if (acc > 0.5) {
          acc = 0;
          setSpeeds(sp);
        }
      },
    });
    return () => {
      timer.pause();
    };
  }, []);

  const sel = OBJECTS.find((o) => o.id === selected);
  const drain = sel ? Number(sel.stats.fuel.split("/")[1]) > 0 : false;

  return (
    <div ref={frame} className="relative w-full overflow-hidden rounded-md bg-[#e7edf3] shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)]" style={{ aspectRatio: `${W} / ${H}` }}>
      <div
        className="absolute left-0 top-0 origin-top-left select-none"
        style={{ width: W, height: H, transform: `scale(${scale})`, fontFamily: "var(--font-smpo), Inter, sans-serif", color: T.onSurface }}
      >
        {/* Yandex map widget under the demo vehicle overlay. Keep the map fixed so projected marker positions stay aligned. */}
        <div className="absolute inset-0 overflow-hidden" onClick={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}>
          <iframe
            title="Карта Ташкента"
            src={`https://yandex.uz/map-widget/v1/?ll=${CENTER[0]}%2C${CENTER[1]}&z=${Z}&lang=ru_RU`}
            width={W}
            height={H}
            loading="lazy"
            tabIndex={-1}
            className="pointer-events-none absolute inset-0 border-0"
            aria-hidden="true"
          />

          {OBJECTS.map((o) => (
            <div key={o.id} ref={(n) => { markers.current[o.id] = n; }} className="absolute left-0 top-0 will-change-transform">
              {/* eslint-disable-next-line @next/next/no-img-element -- status artwork from the СМПО client */}
              <img
                src={`/smpo/status-${o.status === "CONNECTION_LOST" ? "offline-short" : o.status.toLowerCase()}.svg`}
                alt=""
                width={90}
                height={90}
                draggable={false}
                className="pointer-events-none absolute left-0 top-0 max-w-none -translate-x-1/2 -translate-y-1/2"
              />
              <button type="button" onClick={() => selectVehicle(o.id)} aria-label={o.name} className="absolute left-0 top-0 z-10 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full">
                {/* eslint-disable-next-line @next/next/no-img-element -- СМПО object icon */}
                <img data-vehicle-icon src={`/vehicles/${o.icon}.png`} alt="" className="h-11 w-[22px] object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,.35)]" draggable={false} />
              </button>
              <span className="pointer-events-none absolute left-4 top-3 whitespace-nowrap rounded bg-white/90 px-1.5 py-px text-[10px] font-medium shadow-sm">{o.name}</span>
            </div>
          ))}

          {/* VehiclePopup — same compact layout and expandable details as the СМПО monitoring view. */}
          {sel && (
            <div ref={popup} className="absolute left-0 top-0 max-h-[540px] w-[419px] overflow-y-auto rounded-[10px] border border-black/10 bg-white px-4 pb-3 pt-3.5 shadow-[0_8px_28px_rgba(0,0,0,0.22)] will-change-transform" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
              <div className="flex justify-between gap-3">
                <div className="w-[264px]">
                  <div className="text-[16px] font-bold">{sel.model}</div>
                  <div className="text-[14px] leading-[19px] tracking-[.05em] text-[#2F2B3D]/70">{sel.name}</div>
                  <ul className="my-[15px] grid grid-cols-3 gap-x-[5px] gap-y-2">
                    {[
                      { label: "Пробег", v: sel.stats.distance, unit: "км", icon: "mileage", filter: "" },
                      { label: "Нарушение", v: sel.stats.violations, unit: "", icon: "speedometer", filter: Number(sel.stats.violations) > 0 ? "red" : "blue" },
                      { label: "Моточасы", v: sel.stats.engineHours, unit: "ч", icon: "engine", filter: "green" },
                      { label: "Заправка/слив", v: sel.stats.fuel, unit: "", icon: "gas-station", filter: drain ? "red" : "blue" },
                      { label: "Стоянки", v: sel.stats.parkings, unit: "", icon: "parking", filter: "" },
                    ].map((stat) => (
                      <li key={stat.label}>
                        <span className="mb-1 block text-[12px] text-[#2F2B3D]/70">{stat.label}</span>
                        <div className="flex h-[34px] items-center justify-evenly rounded-[5px] border border-black/10 bg-[#2F2B3D]/[.04] px-1">
                          {/* eslint-disable-next-line @next/next/no-img-element -- СМПО stat icon */}
                          <img src={`/smpo/${stat.icon}.svg`} alt="" width={16} height={16} className={stat.filter === "red" ? "smpo-icon-red" : stat.filter === "blue" ? "smpo-icon-blue" : stat.filter === "green" ? "smpo-icon-green" : ""} />
                          <span className="text-[14px] font-bold text-[#2F2B3D]/70">{stat.v} {stat.unit}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => setShowMore((current) => !current)} className="flex items-center gap-1 text-[12px] uppercase hover:underline" style={{ color: T.primary }} aria-expanded={showMore}>
                    {showMore ? "Показать меньше информации" : "Показать больше информации"}
                    <TablerIcon name={showMore ? "chevron-up" : "chevron-right"} size={16} color="#5A9FE0" />
                  </button>
                </div>
                <div className="flex w-[107px] flex-col">
                  {/* eslint-disable-next-line @next/next/no-img-element -- default staff avatar from the client */}
                  <img src="/smpo/default-avatar.png" alt="" className="mb-2 h-[132px] w-[107px] rounded object-cover" />
                  <span className="flex h-[30px] items-center justify-center gap-1.5 rounded-md bg-[#1D3964] text-[12px] font-medium text-white">
                    {/* eslint-disable-next-line @next/next/no-img-element -- СМПО icon */}
                    <img src="/smpo/check-list.svg" alt="" width={14} />
                    Задания
                  </span>
                </div>
              </div>
              {showMore && (
                <div className="mt-3 border-t border-black/10 pt-2 text-[13px]">
                  <div className="mb-2 flex items-center gap-5">
                    <span>Пробег: {sel.stats.distance} км</span>
                    <span>Скорость: {speeds[sel.id]} км/ч</span>
                  </div>
                  {[
                    ["Госномер", `${sel.plate.region} ${sel.plate.type === 3 ? `${sel.plate.letter} ` : ""}${sel.plate.numbers} ${sel.plate.symbols}`],
                    ["Статус", STATUS[sel.status].label],
                    ["Двигатель", sel.engine ? "Включён" : "Выключен"],
                    ["Количество спутников", String(sel.sats)],
                    ["Заправка/слив", sel.stats.fuel],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3 border-b border-black/10 py-1.5">
                      <span className="text-[#2F2B3D]/60">{label}</span>
                      <span className="text-right font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* MapSidebar with the object list */}
        <aside className="absolute bottom-4 left-5 top-4 flex w-[456px] flex-col overflow-hidden rounded-md bg-white shadow-[0_3px_12px_rgba(47,43,61,.14)]">
          {/* MonitoringSidebarHeader */}
          <div className="flex items-center gap-3 bg-[#808390]/[.16] py-3 pl-2 pr-4">
            <Checkbox checked indeterminate={false} />
            <div className="flex flex-1">
              <span className="flex h-[38px] flex-1 items-center justify-between rounded-l-md border border-black/20 bg-white px-3 text-[15px]">
                Список <TablerIcon name="chevron-down" size={20} color={T.secondary} />
              </span>
              <span className="grid h-[38px] w-[42px] place-items-center rounded-r-md text-white shadow-[0_2px_4px_rgba(47,43,61,.2)]" style={{ background: T.primary }}>
                <TablerIcon name="search" size={20} />
              </span>
            </div>
            <span className="grid size-[38px] place-items-center rounded-md text-white" style={{ background: T.primary }}>
              <TablerIcon name="filter-2-x" size={20} />
            </span>
            <span className="grid size-[38px] place-items-center rounded-md text-white" style={{ background: T.success }}>
              <TablerIcon name="file-spreadsheet" size={20} />
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3" style={{ background: T.background }}>
            <span className="flex gap-1 rounded border border-black/15 px-2 py-1 text-[15px]">
              <b className="font-black" style={{ color: T.primary }}>{OBJECTS.length}</b> из <b className="font-black">{OBJECTS.length}</b>
            </span>
            <span className="mr-1 flex items-center gap-3">
              {(["gps", "engine", "satellite", "gas-station"] as const).map((n) => (
                <TablerIcon key={n} name={n} size={24} color={T.secondary} />
              ))}
            </span>
          </div>
          <div className="h-px bg-black/10" />

          {/* MonitoringListView */}
          <ul className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:#bec8d5_#fff] [scrollbar-width:thin]">
            {OBJECTS.map((o, i) => {
              const st = STATUS[o.status];
              const active = o.id === selected;
              return (
                <li key={o.id} className="flex">
                  <button
                    type="button"
                    onClick={() => selectVehicle(o.id)}
                    className="w-full text-left transition-colors"
                    style={{ background: active ? "rgba(35,72,125,.08)" : undefined }}
                  >
                    <div className="flex items-center px-2 pt-2">
                      <span className="mr-3"><Checkbox checked /></span>
                      <span className="flex-1 truncate text-[16px]">
                        {i + 1}.&nbsp; {o.name}
                      </span>
                      <span className="mr-2 flex items-center gap-2 text-[14px] text-[#2F2B3D]/70">
                        16 Sep.
                        {(["pencil", "message-dots", "road"] as const).map((n) => (
                          <span key={n} className="grid size-[30px] place-items-center rounded-md bg-[#808390]/[.16]">
                            <TablerIcon name={n} size={n === "road" ? 22 : 18} color={T.secondary} />
                          </span>
                        ))}
                      </span>
                    </div>
                    <div className="flex items-center px-3 pb-2.5 pt-1">
                      <span className="ml-9 flex flex-1 items-center gap-1 pl-2">
                        <PlateNumber plate={o.plate} />
                        <span className="ml-2 text-[18px] font-medium tabular-nums">
                          {speeds[o.id]} <span className="font-normal">км/ч</span>
                        </span>
                      </span>
                      <span className="mr-1 flex gap-4">
                        <TablerIcon name={st.icon} size={24} color={st.color} />
                        <TablerIcon name="engine" size={24} color={o.engine ? T.success : T.error} />
                        <TablerIcon name="satellite" size={24} color={satColor(o.sats)} />
                        <TablerIcon name="gas-station" size={24} color={T.secondary} />
                      </span>
                    </div>
                    <div className="h-px bg-black/10" />
                  </button>
                  <span className="w-[5px] shrink-0 rounded-r-[10px]" style={{ background: st.color }} title={st.label} />
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
