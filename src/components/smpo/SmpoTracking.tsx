"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createTimer } from "animejs";
import Image from "next/image";
import routesJson from "@/data/routes.json";
import { along, measure, type LngLat } from "@/lib/geo";
import { Btn, Field, ScaledScreen, SCREEN_H, SCREEN_W, T } from "./shared";
import TablerIcon from "./TablerIcon";

/*
 * Replica of the СМПО «Трекинг» screen (smn-web/src/domains/smn/map/pages/tracking):
 * MapSidebar with TrackingFilterPanel, track drawn over the OSM map with S/F endpoints,
 * TrackPlayer islands and the TrackBottomPanel ECharts chart (speed, ignition, fuel sensor, drains/fillings).
 */

const ROUTE = measure(routesJson.r3 as LngLat[]);
const SIDEBAR_RIGHT = 496;
const CHART_H = 290;
const MAP_AREA = { left: SIDEBAR_RIGHT, top: 20, right: SCREEN_W - 70, bottom: SCREEN_H - CHART_H - 110 };

// fit the track into the free map area: highest zoom whose bbox fits
const fit = (() => {
  const merc = (lng: number, lat: number, z: number) => {
    const s = Math.sin((lat * Math.PI) / 180);
    const world = 256 * 2 ** z;
    return { x: ((lng + 180) / 360) * world, y: (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * world };
  };
  const areaW = MAP_AREA.right - MAP_AREA.left;
  const areaH = MAP_AREA.bottom - MAP_AREA.top;
  for (let z = 16; z >= 10; z--) {
    const pts = ROUTE.coords.map(([lng, lat]) => merc(lng, lat, z));
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const w = Math.max(...xs) - minX;
    const h = Math.max(...ys) - minY;
    if (w <= areaW && h <= areaH) {
      const origin = { x: minX + w / 2 - (MAP_AREA.left + areaW / 2), y: minY + h / 2 - (MAP_AREA.top + areaH / 2) };
      return { z, origin, merc: (p: LngLat) => { const m = merc(p[0], p[1], z); return { x: m.x - origin.x, y: m.y - origin.y }; } };
    }
  }
  throw new Error("track does not fit");
})();

const tiles = (() => {
  const out: { x: number; y: number; left: number; top: number }[] = [];
  const { origin, z } = fit;
  for (let tx = Math.floor(origin.x / 256); tx * 256 < origin.x + SCREEN_W; tx++)
    for (let ty = Math.floor(origin.y / 256); ty * 256 < origin.y + SCREEN_H; ty++)
      out.push({ x: tx, y: ty, left: tx * 256 - origin.x, top: ty * 256 - origin.y });
  return { z, list: out };
})();

const trackPath = ROUTE.coords
  .map((p, i) => {
    const s = fit.merc(p);
    return `${i ? "L" : "M"}${s.x.toFixed(1)} ${s.y.toFixed(1)}`;
  })
  .join(" ");
const startPt = fit.merc(ROUTE.coords[0]);
const endPt = fit.merc(ROUTE.coords[ROUTE.coords.length - 1]);
const DRAIN_AT = 0.46;
const FILL_AT = 0.78;
const drainPt = fit.merc(along(ROUTE, ROUTE.length * DRAIN_AT).point);
const fillPt = fit.merc(along(ROUTE, ROUTE.length * FILL_AT).point);

// shift 08:00–18:00 sampled every 10 min
const SAMPLES = 61;
const series = Array.from({ length: SAMPLES }, (_, i) => {
  const t = i / (SAMPLES - 1);
  const parked = (t > 0.28 && t < 0.34) || (t > 0.6 && t < 0.66);
  const speed = parked ? 0 : Math.max(0, 38 + Math.sin(i * 0.9) * 18 + Math.cos(i * 0.37) * 10);
  let fuel = 180 - t * 70;
  if (t >= DRAIN_AT) fuel -= 32;
  if (t >= FILL_AT) fuel += 60;
  return { t, speed, fuel, ign: !parked };
});

const CH = { left: 58, right: 58, top: 16, bottom: 34, w: SCREEN_W - SIDEBAR_RIGHT - 16 - 24, h: CHART_H - 70 };
const plotW = CH.w - CH.left - CH.right;
const plotH = CH.h - CH.top - CH.bottom;
const X = (t: number) => CH.left + t * plotW;
const YS = (v: number) => CH.top + plotH - (v / 80) * plotH;
const YF = (v: number) => CH.top + plotH - (v / 250) * plotH;
const speedLine = series.map((s, i) => `${i ? "L" : "M"}${X(s.t).toFixed(1)} ${YS(s.speed).toFixed(1)}`).join(" ");
const speedArea = `${speedLine} L${X(1)} ${YS(0)} L${X(0)} ${YS(0)} Z`;
const fuelLine = series.map((s, i) => `${i ? "L" : "M"}${X(s.t).toFixed(1)} ${YF(s.fuel).toFixed(1)}`).join(" ");
const ignBands = (() => {
  const bands: [number, number][] = [];
  let start: number | null = null;
  series.forEach((s, i) => {
    if (s.ign && start === null) start = s.t;
    if ((!s.ign || i === series.length - 1) && start !== null) {
      bands.push([start, s.t]);
      start = null;
    }
  });
  return bands;
})();
const hhmm = (t: number) => {
  const mins = 8 * 60 + Math.round(t * 600);
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
};

export default function SmpoTracking() {
  const [progress, setProgress] = useState(0.12);
  const car = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const playingRef = useRef(playing);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = 0;
    let p = 0.12;
    let acc = 0;
    const timer = createTimer({
      loop: true,
      duration: 1_000_000,
      onUpdate: (self) => {
        const dt = Math.min(0.1, Math.max(0, (self.currentTime - last) / 1000));
        last = self.currentTime;
        if (!playingRef.current) return;
        p = (p + dt / 40) % 1;
        const d = ROUTE.length * p;
        const here = fit.merc(along(ROUTE, d).point);
        const ahead = fit.merc(along(ROUTE, Math.min(ROUTE.length, d + 40)).point);
        const deg = (Math.atan2(ahead.x - here.x, -(ahead.y - here.y)) * 180) / Math.PI;
        if (car.current) car.current.style.transform = `translate(${here.x}px, ${here.y}px) translate(-50%, -50%) rotate(${deg}deg)`;
        acc += dt;
        if (acc > 0.2) {
          acc = 0;
          setProgress(p);
        }
      },
    });
    return () => {
      timer.pause();
    };
  }, []);

  const sample = series[Math.round(progress * (SAMPLES - 1))];
  const initialCar = useMemo(() => fit.merc(along(ROUTE, ROUTE.length * 0.12).point), []);

  return (
    <ScaledScreen background="#e5e3df">
      {/* map */}
      <div className="absolute inset-0 overflow-hidden">
        {tiles.list.map((t) => (
          // eslint-disable-next-line @next/next/no-img-element -- raw map tiles
          <img key={`${t.x}-${t.y}`} src={`/tiles/osm/${tiles.z}/${t.x}/${t.y}`} alt="" width={256} height={256} loading="lazy" draggable={false} className="absolute max-w-none" style={{ left: t.left, top: t.top }} />
        ))}
        <svg viewBox={`0 0 ${SCREEN_W} ${SCREEN_H}`} className="absolute inset-0 size-full">
          {/* useTrackLayer: grey halo, white casing, coloured line */}
          <path d={trackPath} fill="none" stroke="rgba(120,120,120,0.55)" strokeWidth="11" strokeLinejoin="round" strokeLinecap="round" />
          <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
          <path d={trackPath} fill="none" stroke="#129ce3" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
          {[
            { p: startPt, fill: "rgba(33,148,20,0.8)", l: "S" },
            { p: endPt, fill: "rgba(171,14,14,0.8)", l: "F" },
          ].map((e) => (
            <g key={e.l}>
              <circle cx={e.p.x} cy={e.p.y} r="13" fill={e.fill} stroke="#fff" strokeWidth="1.5" />
              <text x={e.p.x} y={e.p.y + 4.5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">{e.l}</text>
            </g>
          ))}
          {[
            { p: drainPt, c: "#f44336", label: "Слив −32 л" },
            { p: fillPt, c: "#4caf50", label: "Заправка +60 л" },
          ].map((e) => (
            <g key={e.label}>
              <circle cx={e.p.x} cy={e.p.y} r="11" fill={e.c} stroke="#fff" strokeWidth="2" />
              <rect x={e.p.x + 16} y={e.p.y - 13} width={e.label.length * 7.4 + 14} height="26" rx="4" fill="#fff" stroke={e.c} />
              <text x={e.p.x + 23} y={e.p.y + 4.5} fill={e.c} fontSize="13" fontWeight="600">{e.label}</text>
            </g>
          ))}
        </svg>
        <div ref={car} className="absolute left-0 top-0 h-[44px] w-[22px] will-change-transform" style={{ transform: `translate(${initialCar.x}px, ${initialCar.y}px) translate(-50%, -50%)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- СМПО object icon */}
          <img src="/vehicles/gruzovik.png" alt="" className="size-full object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,.35)]" draggable={false} />
        </div>
      </div>

      {/* MapSidebar: Трекинг */}
      <aside className="absolute bottom-4 left-5 top-4 flex w-[456px] flex-col overflow-hidden rounded-md bg-white" style={{ boxShadow: T.cardShadow }}>
        <div className="flex items-center justify-between bg-[#808390]/[.16] px-4 py-3.5">
          <span className="text-[18px] font-medium">Трекинг</span>
          <TablerIcon name="chevron-up" size={20} />
        </div>
        <div className="flex-1 overflow-hidden px-4 pt-4">
          <Field label="Объект" value="10 C 551 AA · Грузовой автомобиль" icon="chevron-down" className="mb-2" />

          <div className="mb-2 rounded-md border p-4" style={{ borderColor: T.border }}>
            <div className="mb-2 text-[15px]" style={{ color: T.primary }}>ТРЕКИНГ НА СЕГОДНЯ</div>
            <div className="grid grid-cols-12 gap-x-2 gap-y-2">
              <Stat className="col-span-4" label="Пробег" icon="mileage" value="126,3 км" />
              <Stat className="col-span-3" label="Нарушение" icon="speedometer" value="2" tint="smpo-icon-red" />
              <div className="col-span-5 row-span-2 flex items-center justify-center">
                <Image src="/smpo/default_vehicle_side.png" alt="" width={180} height={76} className="h-[76px] w-full rounded object-contain object-center" />
              </div>
              <Stat className="col-span-4" label="Моточасы" icon="engine" value="7,8 ч" tint="smpo-icon-green" />
              <Stat className="col-span-3" label="Стоянки" icon="parking" value="9" />
              <Stat className="col-span-7" label="Заправка/слив" icon="gas-station" value="60/32" tint="smpo-icon-red" />
            </div>
          </div>

          <div className="mb-2 grid grid-cols-2 gap-2">
            <Field label="От" value="16.09.2026 08:00" icon="calendar" />
            <Field label="До" value="16.09.2026 18:00" icon="calendar" />
          </div>

          <div className="mb-2 flex overflow-hidden rounded-md border" style={{ borderColor: T.primary }}>
            {["Сегодня", "Вчера", "Неделя", "Месяц"].map((p, i) => (
              <span
                key={p}
                className={`flex-1 py-2 text-center text-[15px] font-medium ${i ? "border-l" : ""}`}
                style={{ borderColor: T.primary, background: i === 0 ? T.primary : "transparent", color: i === 0 ? "#fff" : T.primary }}
              >
                {p}
              </span>
            ))}
          </div>

          <div className="mb-4 flex h-[48px] items-center justify-between rounded-md border pl-4 pr-3 text-[15px]" style={{ borderColor: T.border }}>
            Настройка трека <TablerIcon name="settings-2" size={20} color={T.secondary} />
          </div>

          <Btn className="w-full">
            <TablerIcon name="road" size={20} /> Построить трек
          </Btn>
        </div>
      </aside>

      {/* TrackPlayer islands */}
      <div className="absolute flex items-center gap-2" style={{ left: SIDEBAR_RIGHT + 12, bottom: CHART_H + 30 }}>
        <span className="grid size-[46px] place-items-center rounded-lg bg-white" style={{ boxShadow: T.cardShadow, color: T.primary }}>
          <TablerIcon name="location" size={22} />
        </span>
        <span className="flex h-[46px] items-center gap-3 rounded-lg bg-white pl-4 pr-2" style={{ boxShadow: T.cardShadow }}>
          <span className="w-[74px] text-[15px] font-semibold tabular-nums">{Math.round(sample.speed)} км/ч</span>
          <TablerIcon name="player-skip-back-filled" size={18} color={T.onSurface} />
          <button type="button" onClick={() => setPlaying((v) => !v)} aria-label={playing ? "Пауза" : "Воспроизвести"} className="grid size-[34px] place-items-center rounded-full text-white" style={{ background: T.primary }}>
            <TablerIcon name={playing ? "player-pause-filled" : "player-play-filled"} size={16} />
          </button>
          <TablerIcon name="player-stop-filled" size={18} color={T.onSurface} />
          <TablerIcon name="focus-2" size={20} color={T.onSurface} />
          <span className="rounded px-2 py-1 text-[14px] font-medium" style={{ background: "rgba(47,43,61,.06)" }}>
            4x
          </span>
          <span className="rounded px-1.5 text-[14px] tabular-nums" style={{ color: T.secondary }}>
            {hhmm(progress)}
          </span>
        </span>
      </div>

      {/* TrackBottomPanel + TrackChart */}
      <div className="absolute rounded-md bg-white p-2" style={{ left: SIDEBAR_RIGHT, right: 16, bottom: 16, height: CHART_H, boxShadow: T.cardShadow }}>
        <span className="absolute right-3 top-3 grid size-[26px] place-items-center rounded-md border" style={{ borderColor: T.border }}>
          <TablerIcon name="chevron-down" size={16} />
        </span>
        <svg width={CH.w} height={CH.h} className="ml-2 block">
          {[0, 20, 40, 60, 80].map((v) => (
            <g key={v}>
              <line x1={CH.left} x2={CH.left + plotW} y1={YS(v)} y2={YS(v)} stroke="rgba(150,150,150,0.12)" />
              <text x={CH.left - 8} y={YS(v) + 4} textAnchor="end" fontSize="12" fill="#129ce3">{v}</text>
              <text x={CH.left + plotW + 8} y={YS(v) + 4} fontSize="12" fill="#ff0000">{Math.round((v / 80) * 250)}</text>
            </g>
          ))}
          {ignBands.map(([a, b]) => (
            <rect key={a} x={X(a)} y={CH.top} width={X(b) - X(a)} height={plotH} fill="rgba(41,190,0,0.1)" />
          ))}
          <defs>
            <linearGradient id="spd" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="rgba(18,156,227,0.28)" />
              <stop offset="1" stopColor="rgba(18,156,227,0.02)" />
            </linearGradient>
          </defs>
          <path d={speedArea} fill="url(#spd)" />
          <path d={speedLine} fill="none" stroke="#129ce3" strokeWidth="2" />
          <path d={fuelLine} fill="none" stroke="#ff0000" strokeWidth="2.25" />
          {[
            { t: DRAIN_AT, c: "#f44336", l: "Слив 32 л" },
            { t: FILL_AT, c: "#4caf50", l: "Заправка 60 л" },
          ].map((e) => (
            <g key={e.l}>
              <line x1={X(e.t)} x2={X(e.t)} y1={CH.top} y2={CH.top + plotH} stroke={e.c} strokeWidth="1.5" strokeDasharray="5 4" />
              <rect x={X(e.t) + 4} y={CH.top + 2} width={e.l.length * 7 + 10} height="20" rx="3" fill={e.c} />
              <text x={X(e.t) + 9} y={CH.top + 16} fontSize="12" fill="#fff">{e.l}</text>
            </g>
          ))}
          <line x1={X(progress)} x2={X(progress)} y1={CH.top} y2={CH.top + plotH} stroke="#ff9800" strokeWidth="2.5" />
          <circle cx={X(progress)} cy={YS(sample.speed)} r="5" fill="#129ce3" stroke="#0C6391" strokeWidth="3" />
          {Array.from({ length: 11 }, (_, i) => i / 10).map((t) => (
            <text key={t} x={X(t)} y={CH.top + plotH + 20} textAnchor="middle" fontSize="12" fill="#999">{hhmm(t)}</text>
          ))}
        </svg>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[13px]">
          <Legend kind="line" color="#129ce3" label="Скорость (км/ч)" value={`${Math.round(sample.speed)}`} />
          <Legend kind="area" color="#29be00" label="Зажигание" />
          <Legend kind="line" color="#ff0000" label="Суммарные показания ДУТ (л)" value={sample.fuel.toFixed(1)} red />
          <Legend kind="dash" color="#4caf50" label="Заправки" />
          <Legend kind="dash" color="#f44336" label="Сливы" />
        </div>
      </div>

      {/* right map tools */}
      <div className="absolute right-[14px] top-[18px] flex flex-col gap-2">
        {(["layers-subtract", "ruler-2"] as const).map((n) => (
          <span key={n} className="grid size-[38px] place-items-center rounded-lg bg-white" style={{ boxShadow: T.cardShadow }}>
            <TablerIcon name={n} size={22} color={T.onSurface} />
          </span>
        ))}
      </div>
    </ScaledScreen>
  );
}

function Stat({ label, icon, value, tint, className = "" }: { label: string; icon: string; value: string; tint?: string; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-1 truncate text-[13px]">{label}</div>
      <div className="flex h-[38px] items-center rounded-lg border px-3" style={{ borderColor: T.border }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- СМПО stat icon */}
        <img src={`/smpo/${icon}.svg`} width={20} height={20} alt="" className={`mr-2 ${tint ?? ""}`} />
        <span className="truncate text-[15px] font-bold">{value}</span>
      </div>
    </div>
  );
}

function Legend({ kind, color, label, value, red }: { kind: "line" | "area" | "dash"; color: string; label: string; value?: string; red?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      {kind === "area" && <span className="h-2.5 w-4 rounded-sm opacity-40" style={{ background: color }} />}
      {kind === "line" && <span className="h-[3px] w-4 rounded" style={{ background: color }} />}
      {kind === "dash" && <span className="w-4 border-t-2 border-dashed" style={{ borderColor: color }} />}
      <span style={red ? { color: "#f44336" } : undefined}>{label}</span>
      {value && <span className="tabular-nums" style={red ? { color: "#f44336" } : undefined}>: {value}</span>}
    </span>
  );
}
