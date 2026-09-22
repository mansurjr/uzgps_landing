"use client";

import { useEffect, useState } from "react";

export type Pt = [number, number];
export type Path = { pts: Pt[]; cum: number[]; len: number };

export function toPath(pts: Pt[]): Path {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, cum, len: cum[cum.length - 1] || 1 };
}

/** Point, heading and segment index at distance d along the path (clamped). */
export function at(p: Path, d: number) {
  d = Math.max(0, Math.min(p.len, d));
  let lo = 0;
  let hi = p.cum.length - 1;
  while (lo < hi - 1) {
    const m = (lo + hi) >> 1;
    if (p.cum[m] <= d) lo = m;
    else hi = m;
  }
  const a = p.pts[lo];
  const b = p.pts[hi];
  const k = (d - p.cum[lo]) / (p.cum[hi] - p.cum[lo] || 1);
  return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, a: Math.atan2(b[1] - a[1], b[0] - a[0]), i: lo };
}

/**
 * Comet trail: the `len` px behind distance d, drawn as short segments whose alpha ramps up
 * towards the head — reads as a long-exposure light streak and follows curves exactly.
 */
export function comet(ctx: CanvasRenderingContext2D, p: Path, d: number, len: number, rgb: string, alpha: number, width: number) {
  const n = Math.max(4, Math.round(len / 10));
  const step = len / n;
  let prev = at(p, d - len);
  ctx.lineWidth = width;
  for (let i = 1; i <= n; i++) {
    const s = d - len + i * step;
    if (s <= 0) {
      prev = at(p, s);
      continue;
    }
    const cur = at(p, s);
    const k = i / n;
    ctx.strokeStyle = `rgba(${rgb},${alpha * k * k})`;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    // include interior vertices so tight corners stay on the road
    for (let j = prev.i + 1; j <= cur.i; j++) ctx.lineTo(p.pts[j][0], p.pts[j][1]);
    ctx.lineTo(cur.x, cur.y);
    ctx.stroke();
    prev = cur;
  }
}

/* ───────────── Tashkent street network (OSM, loaded lazily from /public) ───────────── */

/** `oneway`: drivable only in point order (OSM oneway / roundabout, already normalised at build time). */
export type Way = { cls: 0 | 1 | 2; pts: Pt[]; oneway: boolean };
export type City = { ways: Way[]; nodes: Map<string, number[]>; weighted: number[] };

let cache: City | null = null;
let pending: Promise<City> | null = null;

const key = (p: Pt) => `${p[0]},${p[1]}`;

function loadCity(): Promise<City> {
  pending ??= fetch("/hero/tashkent.json")
    .then((r) => r.json() as Promise<{ ways: number[][][]; oneway: number[][] }>)
    .then(({ ways: classes, oneway }) => {
      const ways: Way[] = [];
      classes.forEach((list, cls) => {
        const ow = new Set(oneway[cls]);
        list.forEach((flat, wi) => {
          const pts: Pt[] = [];
          let x = 0;
          let y = 0;
          for (let i = 0; i < flat.length; i += 2) {
            x += flat[i];
            y += flat[i + 1];
            pts.push([x, y]);
          }
          ways.push({ cls: cls as Way["cls"], pts, oneway: ow.has(wi) });
        });
      });
      // endpoint graph over major + mid roads, for plausible multi-street trips
      const nodes = new Map<string, number[]>();
      const weighted: number[] = [];
      ways.forEach((w, i) => {
        if (w.cls === 2) return;
        for (const p of [w.pts[0], w.pts[w.pts.length - 1]]) {
          const k = key(p);
          const list = nodes.get(k);
          if (list) list.push(i);
          else nodes.set(k, [i]);
        }
        for (let n = w.cls === 0 ? 3 : 1; n > 0; n--) weighted.push(i);
      });
      cache = { ways, nodes, weighted };
      return cache;
    });
  return pending;
}

export function useCity() {
  const [city, setCity] = useState(cache);
  useEffect(() => {
    if (!city) loadCity().then(setCity, () => {});
  }, [city]);
  return city;
}

/**
 * Random drive through the street graph (metres): obeys one-way streets, prefers going straight at junctions.
 * Walks that dead-end early (one-way into a junction with no legal exit) are retried.
 */
export function randomTrip(city: City, rand: () => number, minLen = 3000, near?: (p: Pt) => boolean): Pt[] {
  let best: { pts: Pt[]; len: number } = { pts: [], len: -1 };
  for (let attempt = 0; attempt < 10 && best.len < minLen * 0.5; attempt++) {
    const trip = walk(city, rand, minLen, near);
    if (trip.len > best.len) best = trip;
  }
  return best.pts;
}

function walk(city: City, rand: () => number, minLen: number, near?: (p: Pt) => boolean) {
  let wi = city.weighted[Math.floor(rand() * city.weighted.length)];
  for (let tries = 0; near && tries < 40 && !near(city.ways[wi].pts[0]); tries++) wi = city.weighted[Math.floor(rand() * city.weighted.length)];
  let pts = city.ways[wi].pts;
  if (!city.ways[wi].oneway && rand() < 0.5) pts = [...pts].reverse();
  const out: Pt[] = [...pts];
  let len = 0;
  for (let i = 1; i < out.length; i++) len += Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]);
  const used = new Set([wi]);

  for (let step = 0; step < 80 && len < minLen; step++) {
    const end = out[out.length - 1];
    const prev = out[out.length - 2];
    const inA = Math.atan2(end[1] - prev[1], end[0] - prev[0]);
    const cands = (city.nodes.get(key(end)) ?? []).filter((i) => !used.has(i));
    if (!cands.length) break;
    let best: Pt[] | null = null;
    let bestScore = -Infinity;
    let bestI = -1;
    for (const i of cands) {
      const w = city.ways[i].pts;
      const fwd = key(w[0]) === key(end);
      if (city.ways[i].oneway && !fwd) continue; // no entering a one-way street against traffic
      const seq = fwd ? w : [...w].reverse();
      const outA = Math.atan2(seq[1][1] - seq[0][1], seq[1][0] - seq[0][0]);
      const score = Math.cos(outA - inA) * 3 + rand() * 1.5;
      if (score > bestScore) {
        bestScore = score;
        best = seq;
        bestI = i;
      }
    }
    if (!best || bestScore < -1.5) break;
    used.add(bestI);
    for (let i = 1; i < best.length; i++) {
      len += Math.hypot(best[i][0] - best[i - 1][0], best[i][1] - best[i - 1][1]);
      out.push(best[i]);
    }
  }
  return { pts: out, len };
}

/**
 * Shifts a screen-space path (y down) to the right of the direction of travel — right-hand traffic,
 * so opposite directions on a two-way street run in separate lanes. Mitred joins, capped on sharp turns.
 */
export function keepRight(pts: Pt[], off: number): Pt[] {
  const q = pts.filter((p, i) => i === 0 || p[0] !== pts[i - 1][0] || p[1] !== pts[i - 1][1]);
  if (q.length < 2) return q;
  const normal = (a: Pt, b: Pt): Pt => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
  };
  return q.map((p, i) => {
    const n1 = normal(q[Math.max(0, i - 1)], q[Math.max(1, i)]);
    const n2 = normal(q[Math.min(q.length - 2, i)], q[Math.min(q.length - 1, i + 1)]);
    let mx = n1[0] + n2[0];
    let my = n1[1] + n2[1];
    const ml = Math.hypot(mx, my) || 1;
    mx /= ml;
    my /= ml;
    const k = off / Math.max(0.5, mx * n1[0] + my * n1[1]);
    return [p[0] + mx * k, p[1] + my * k];
  });
}

/** Metres → pixels, centred on a point of the city (Amir Temur square by default). */
export function cityProjection(w: number, h: number, metresAcross: number, center: Pt = [9180, 6250]) {
  const s = Math.max(w, h * 1.3) / metresAcross;
  return { s, p: (m: Pt): Pt => [w / 2 + (m[0] - center[0]) * s, h / 2 - (m[1] - center[1]) * s] };
}

export function strokeWays(ctx: CanvasRenderingContext2D, ways: Way[], p: (m: Pt) => Pt, w: number, h: number) {
  ctx.beginPath();
  for (const way of ways) {
    let first = true;
    let inside = false;
    const pts = way.pts.map(p);
    for (const [x, y] of pts) if (x > -50 && y > -50 && x < w + 50 && y < h + 50) inside = true;
    if (!inside) continue;
    for (const [x, y] of pts) {
      if (first) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      first = false;
    }
  }
  ctx.stroke();
}
