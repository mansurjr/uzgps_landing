"use client";

import { useEffect, useRef } from "react";

export type Frame = { ctx: CanvasRenderingContext2D; w: number; h: number; t: number; dt: number };
export type Scene = {
  /** painted once per resize on the lower canvas (streets, dots, contours) */
  base?: (ctx: CanvasRenderingContext2D) => void;
  /** painted every frame on a cleared upper canvas (vehicles, trails) */
  live: (f: Frame) => void;
};

/**
 * Two-layer canvas loop for the hero backdrops: static base + animated live layer (screen-blended),
 * DPR-aware, 30fps cap, paused off-screen / in hidden tabs, single still frame under reduced motion.
 * Sizes from layout (clientWidth), so it works inside CSS 3D transforms.
 */
export function useCanvasLoop(setup: (w: number, h: number) => Scene, maxDpr = 1.75) {
  const ref = useRef<HTMLDivElement>(null);
  const setupRef = useRef(setup);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const make = (blend?: string) => {
      const c = document.createElement("canvas");
      c.style.cssText = `position:absolute;inset:0;width:100%;height:100%;display:block${blend ? `;mix-blend-mode:${blend}` : ""}`;
      box.appendChild(c);
      return c;
    };
    const baseCanvas = make();
    const liveCanvas = make("screen");
    const base = baseCanvas.getContext("2d")!;
    const live = liveCanvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let scene: Scene = { live: () => {} };
    let w = 1;
    let h = 1;
    let dpr = 1;
    let frame = 0;
    let visible = true;
    let last = 0;
    let t = 0;

    const paint = (dt: number) => {
      live.setTransform(dpr, 0, 0, dpr, 0, 0);
      live.clearRect(0, 0, w, h);
      scene.live({ ctx: live, w, h, t, dt });
    };
    const canAnimate = () => visible && !document.hidden && !reduced.matches;
    const tick = (now: number) => {
      frame = 0;
      if (!canAnimate()) return;
      if (now - last >= 1000 / 30) {
        const dt = Math.min((now - last) / 1000, 0.1);
        t += dt;
        paint(dt);
        last = now;
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      if (canAnimate() && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      } else if (!canAnimate() && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    const resize = () => {
      const nw = Math.max(1, box.clientWidth);
      const nh = Math.max(1, box.clientHeight);
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      for (const c of [baseCanvas, liveCanvas]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      scene = setupRef.current(w, h);
      base.setTransform(dpr, 0, 0, dpr, 0, 0);
      base.clearRect(0, 0, w, h);
      scene.base?.(base);
      paint(0);
      box.style.opacity = "1";
    };

    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    ro.observe(box);
    io.observe(box);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    resize();
    sync();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      baseCanvas.remove();
      liveCanvas.remove();
    };
  }, [maxDpr]);

  return ref;
}

/** Deterministic PRNG so every render of a variant looks the same. */
export function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export const RGB = { cyan: "0,173,236", ice: "190,236,255", paper: "244,246,249" };

/** Soft additive glow sprite for vehicle heads. */
export function glowSprite(size = 48, rgb = RGB.cyan) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.12, `rgba(${RGB.ice},0.9)`);
  grad.addColorStop(0.35, `rgba(${rgb},0.28)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}
