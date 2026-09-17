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
 * full-screen OSM map, 456px floating object list (MapSidebar + MonitoringSidebarHeader + MonitoringListView),
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
    id: 7, name: "Курьерский фургон", model: "Курьерский фургон", icon: "truck", status: "MOVING", kmh: 48, engine: true, sats: 15, route: "r1", offset: 0.15,
    plate: { type: 1, region: "01", numbers: "482", symbols: "ABA" },
    stats: { distance: "95,2", violations: "0", engineHours: "7,1", fuel: "45/0", parkings: "8" },
  },
  {
    id: 8, name: "Сервисный автомобиль", model: "Сервисный автомобиль", icon: "taxi", status: "PARKING", kmh: 0, engine: false, sats: 12, route: "r2", offset: 0.78,
    plate: { type: 1, region: "01", numbers: "316", symbols: "BBA" },
    stats: { distance: "64,1", violations: "0", engineHours: "3,8", fuel: "0/0", parkings: "4" },
  },
  {
    id: 9, name: "Тягач MAN", model: "Седельный тягач", icon: "gruzovik", status: "MOVING", kmh: 62, engine: true, sats: 16, route: "r3", offset: 0.85,
    plate: { type: 3, region: "01", letter: "A", numbers: "888", symbols: "FA" },
    stats: { distance: "340,5", violations: "1", engineHours: "12,5", fuel: "120/0", parkings: "6" },
  },
  {
    id: 10, name: "Пассажирский бус", model: "Микроавтобус", icon: "bus", status: "MOVING", kmh: 44, engine: true, sats: 13, route: "r4", offset: 0.28,
    plate: { type: 1, region: "01", numbers: "512", symbols: "VAA" },
    stats: { distance: "178,0", violations: "0", engineHours: "8,9", fuel: "55/0", parkings: "11" },
  },
  {
    id: 11, name: "Самосвал ISUZU", model: "Самосвал", icon: "gruzovik", status: "STOP", kmh: 0, engine: true, sats: 9, route: "r5", offset: 0.72,
    plate: { type: 1, region: "10", numbers: "707", symbols: "OZA" },
    stats: { distance: "110,4", violations: "0", engineHours: "6,7", fuel: "70/0", parkings: "7" },
  },
];

const W = 1440;
const H = 900;
const Z = 14;
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

const tiles = (() => {
  const out: { x: number; y: number; left: number; top: number }[] = [];
  for (let tx = Math.floor(origin.x / 256); tx * 256 < origin.x + W; tx++)
    for (let ty = Math.floor(origin.y / 256); ty * 256 < origin.y + H; ty++)
      out.push({ x: tx, y: ty, left: tx * 256 - origin.x, top: ty * 256 - origin.y });
  return out;
})();

const satColor = (n: number) => (n > 6 ? T.success : n > 3 ? T.error : n > 0 ? T.warning : T.secondary);

export default function SmpoMonitoring() {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [selected, setSelected] = useState(1);
  const [, setSpeeds] = useState<Record<number, number>>(() => Object.fromEntries(OBJECTS.map((o) => [o.id, o.kmh])));
  const markers = useRef<Record<number, HTMLDivElement | null>>({});
  const popup = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(selected);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

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
        if (s.o.status === "MOVING" || s.heading === 0) {
          const target = (Math.atan2(b.x - a.x, -(b.y - a.y)) * 180) / Math.PI;
          const diff = ((target - s.heading + 540) % 360) - 180;
          s.heading += diff * Math.min(1, dt * 8 || 1);
        }
        const m = markers.current[s.o.id];
        if (m) m.style.transform = `translate(${a.x}px, ${a.y}px)`;
        const icon = m?.firstElementChild as HTMLElement | null;
        if (icon) icon.style.transform = `translate(-50%, -50%) rotate(${s.heading}deg)`;
        if (popup.current && s.o.id === selectedRef.current) {
          const px = Math.min(W - 440, Math.max(30, a.x - 210));
          const py = a.y - 290 < 16 ? a.y + 40 : a.y - 290;
          popup.current.style.transform = `translate(${px}px, ${Math.min(H - 300, py)}px)`;
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

  const sel = OBJECTS.find((o) => o.id === selected)!;
  const drain = Number(sel.stats.fuel.split("/")[1]) > 0;

  return (
    <div ref={frame} className="relative w-full overflow-hidden rounded-md bg-[#e5e3df] shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)]" style={{ aspectRatio: `${W} / ${H}` }}>
      <div
        className="absolute left-0 top-0 origin-top-left select-none"
        style={{ width: W, height: H, transform: `scale(${scale})`, fontFamily: "var(--font-smpo), Inter, sans-serif", color: T.onSurface }}
      >
        {/* map layer — UZGPS tile server, same as the client's default OSM layer */}
        <div className="absolute inset-0 overflow-hidden">
          {tiles.map((t) => (
            // eslint-disable-next-line @next/next/no-img-element -- raw map tiles
            <img key={`${t.x}-${t.y}`} src={`/tiles/osm/${Z}/${t.x}/${t.y}`} alt="" width={256} height={256} loading="lazy" draggable={false} className="absolute max-w-none" style={{ left: t.left, top: t.top }} />
          ))}

          {OBJECTS.map((o) => (
            <div key={o.id} ref={(n) => { markers.current[o.id] = n; }} className="absolute left-0 top-0 will-change-transform">
              <button type="button" onClick={() => setSelected(o.id)} aria-label={o.name} className="absolute block" style={{ width: 22, height: 44 }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- СМПО object icon */}
                <img src={`/vehicles/${o.icon}.png`} alt="" className="size-full object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,.35)]" draggable={false} />
              </button>
              <span className="pointer-events-none absolute left-4 top-3 whitespace-nowrap rounded bg-white/90 px-1.5 py-px text-[10px] font-medium shadow-sm">{o.name}</span>
            </div>
          ))}

          {/* VehiclePopup */}
          <div ref={popup} className="absolute left-0 top-0 w-[419px] rounded-[10px] border border-black/10 bg-white px-4 pb-3 pt-3.5 shadow-[0_8px_28px_rgba(0,0,0,0.22)] will-change-transform" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
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
                  ].map((s) => (
                    <li key={s.label}>
                      <span className="mb-1 block text-[12px] text-[#2F2B3D]/70">{s.label}</span>
                      <div className="flex h-[34px] items-center justify-evenly rounded-[5px] border border-black/10 bg-[#2F2B3D]/[.04] px-1">
                        {/* eslint-disable-next-line @next/next/no-img-element -- СМПО stat icon */}
                        <img src={`/smpo/${s.icon}.svg`} alt="" width={16} height={16} className={s.filter === "red" ? "smpo-icon-red" : s.filter === "blue" ? "smpo-icon-blue" : s.filter === "green" ? "smpo-icon-green" : ""} />
                        <span className="text-[14px] font-bold text-[#2F2B3D]/70">
                          {s.v} {s.unit}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <span className="flex items-center gap-1 text-[12px] uppercase" style={{ color: T.primary }}>
                  Показать больше информации <TablerIcon name="chevron-right" size={16} color="#5A9FE0" />
                </span>
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
          </div>
        </div>

        {/* map tools, right edge */}
        <div className="absolute right-[14px] top-[18px] flex flex-col gap-2">
          {(["layers-subtract", "ruler-2"] as const).map((n) => (
            <span key={n} className="grid size-[38px] place-items-center rounded-lg bg-white shadow-[0_2px_8px_rgba(47,43,61,.16)]">
              <TablerIcon name={n} size={22} color={T.onSurface} />
            </span>
          ))}
        </div>
        <div className="absolute right-[14px] top-1/2 flex -translate-y-1/2 flex-col gap-2">
          <span className="flex flex-col overflow-hidden rounded-lg bg-white shadow-[0_2px_8px_rgba(47,43,61,.16)]">
            <span className="grid size-[38px] place-items-center border-b border-black/10"><TablerIcon name="plus" size={22} color={T.onSurface} /></span>
            <span className="grid size-[38px] place-items-center"><TablerIcon name="minus" size={22} color={T.onSurface} /></span>
          </span>
          <span className="grid size-[38px] place-items-center rounded-lg bg-white shadow-[0_2px_8px_rgba(47,43,61,.16)]">
            <TablerIcon name="current-location" size={22} color={T.onSurface} />
          </span>
        </div>
        <span className="absolute bottom-[10px] right-[70px] border-x-2 border-b-2 border-[#2F2B3D]/70 bg-white/70 px-2 text-[11px]">1 km</span>
      </div>
    </div>
  );
}

