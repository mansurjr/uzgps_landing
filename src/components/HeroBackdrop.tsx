"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger, svg } from "animejs";
import routesJson from "@/data/routes.json";
import type { LngLat } from "@/lib/geo";

/*
 * Decorative hero background: a darkened UZGPS map of Tashkent with real street routes drawing themselves.
 * Not interactive — the live system demo lives in the Platform section.
 * Drawn on a fixed 960×540 canvas at zoom 12 and scaled to cover the section.
 */

const W = 960;
const H = 540;
const Z = 12;
const CENTER: LngLat = [69.262, 41.305];
const WORLD = 256 * 2 ** Z;

function toWorld([lng, lat]: LngLat) {
  const s = Math.sin((lat * Math.PI) / 180);
  return { x: ((lng + 180) / 360) * WORLD, y: (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * WORLD };
}
const c = toWorld(CENTER);
const origin = { x: c.x - W / 2, y: c.y - H / 2 };

const tiles: { x: number; y: number; left: number; top: number }[] = [];
for (let tx = Math.floor(origin.x / 256); tx * 256 < origin.x + W; tx++)
  for (let ty = Math.floor(origin.y / 256); ty * 256 < origin.y + H; ty++)
    tiles.push({ x: tx, y: ty, left: tx * 256 - origin.x, top: ty * 256 - origin.y });

const paths = Object.values(routesJson).map((coords) =>
  (coords as LngLat[])
    .filter((_, i, a) => i % 3 === 0 || i === a.length - 1)
    .map((p, i) => {
      const w = toWorld(p);
      return `${i ? "L" : "M"}${(w.x - origin.x).toFixed(1)} ${(w.y - origin.y).toFixed(1)}`;
    })
    .join(" "),
);

export default function HeroBackdrop() {
  const box = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(2);

  // cover the section like background-size: cover
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.max(el.clientWidth / W, el.clientHeight / H));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const s = svgRef.current;
    if (!s || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lines = s.querySelectorAll<SVGPathElement>("[data-route]");
    const running = [
      animate(svg.createDrawable(lines), {
        draw: ["0 0", "0 1", "1 1"],
        duration: 7000,
        delay: stagger(900),
        loop: true,
        ease: "inOutSine",
      }),
      animate(s.querySelectorAll("[data-car]"), { opacity: 1, duration: 600, delay: stagger(300, { start: 800 }) }),
      ...Array.from(s.querySelectorAll("[data-car]")).map((dot, i) =>
        animate(dot, {
          ...svg.createMotionPath(lines[i]),
          duration: 14000 + i * 1800,
          loop: true,
          alternate: true,
          ease: "linear",
        }),
      ),
    ];
    return () => running.forEach((r) => r.pause());
  }, []);

  return (
    <div ref={box} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2"
        style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <div className="absolute inset-0 opacity-[.32] [filter:grayscale(1)_invert(1)_contrast(1.15)_brightness(.85)]">
          {tiles.map((t) => (
            // eslint-disable-next-line @next/next/no-img-element -- raw map tiles
            <img
              key={`${t.x}-${t.y}`}
              src={`/tiles/osm/${Z}/${t.x}/${t.y}`}
              alt=""
              width={256}
              height={256}
              fetchPriority="low"
              className="absolute max-w-none"
              style={{ left: t.left, top: t.top }}
            />
          ))}
        </div>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible">
          {paths.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="rgba(0,173,236,.16)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          ))}
          {paths.map((d, i) => (
            <path key={`r${i}`} data-route d={d} fill="none" stroke="#00adec" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          ))}
          {paths.map((_, i) => (
            <circle key={`c${i}`} data-car r="2.2" cx="0" cy="0" opacity="0" fill="#ffffff" stroke="#00adec" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      </div>
      {/* tint + readability gradient */}
      <div className="absolute inset-0 bg-navy mix-blend-multiply" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgba(6,26,54,.94)_0%,rgba(6,26,54,.72)_55%,rgba(6,26,54,.35)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#061a36] to-transparent" />
    </div>
  );
}
