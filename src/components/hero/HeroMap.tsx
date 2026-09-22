"use client";

import { at, cityProjection, comet, keepRight, randomTrip, strokeWays, toPath, useCity, type City, type Path, type Pt } from "./geometry";
import { glowSprite, rng, RGB, useCanvasLoop, type Scene } from "./useCanvasLoop";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// horizon fade + dim behind the centred headline + edges sinking into the page
const OVERLAY = [
  "linear-gradient(to bottom, #0a1a30 0%, rgba(10,26,48,.85) 14%, transparent 42%)",
  "radial-gradient(ellipse 50% 46% at 50% 47%, rgba(10,26,48,.72) 0%, rgba(10,26,48,.38) 60%, rgba(10,26,48,0) 100%)",
  "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(10,26,48,.9) 100%)",
  "linear-gradient(to bottom, rgba(10,26,48,.6), transparent 22%, transparent 70%, #0a1a30)",
].join(", ");

// px to the right of the road centreline: two-way streets get a lane per direction
const LANE = 2;

/** Tashkent street network (OSM), drawn like a night-mode vector map. */
function paintStreets(ctx: CanvasRenderingContext2D, city: City, p: (m: Pt) => Pt, w: number, h: number) {
  const by = [0, 1, 2].map((c) => city.ways.filter((x) => x.cls === c));
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = `rgba(${RGB.paper},0.07)`;
  ctx.lineWidth = 0.6;
  strokeWays(ctx, by[2], p, w, h);
  ctx.strokeStyle = `rgba(${RGB.paper},0.035)`;
  ctx.lineWidth = LANE * 2 + 2;
  strokeWays(ctx, by[1], p, w, h);
  ctx.strokeStyle = `rgba(${RGB.paper},0.11)`;
  ctx.lineWidth = 0.8;
  strokeWays(ctx, by[1], p, w, h);
  ctx.strokeStyle = `rgba(${RGB.cyan},0.075)`;
  ctx.lineWidth = LANE * 2 + 2;
  strokeWays(ctx, by[0], p, w, h);
  ctx.strokeStyle = "rgba(150,200,235,0.25)";
  ctx.lineWidth = 1.1;
  strokeWays(ctx, by[0], p, w, h);
}

type Car = { path: Path; d: number; v: number; trail: number; bright: boolean };

/** Background traffic: vehicles on random drives through the street graph, drawn as light trails. */
function traffic(city: City, p: (m: Pt) => Pt, w: number, h: number, count: number, seed: number) {
  const rand = rng(seed);
  const inView = (m: Pt) => {
    const [x, y] = p(m);
    return x > -60 && y > -60 && x < w + 60 && y < h + 60;
  };
  const spawn = (initial: boolean): Car => {
    const path = toPath(keepRight(randomTrip(city, rand, 2500 + rand() * 3000, inView).map(p), LANE));
    return { path, d: initial ? rand() * path.len : 0, v: 21 + rand() * 39, trail: 50 + rand() * 120, bright: rand() < 0.1 };
  };
  const cars = Array.from({ length: count }, () => spawn(true));
  const glow = glowSprite(48);

  return (ctx: CanvasRenderingContext2D, dt: number) => {
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "butt";
    for (let i = 0; i < cars.length; i++) {
      const c = cars[i];
      c.d += c.v * dt;
      if (c.d - c.trail > c.path.len) {
        cars[i] = spawn(false);
        continue;
      }
      const a = Math.min(1, c.d / 80, c.d > c.path.len ? 1 - (c.d - c.path.len) / c.trail : 1) * 0.8;
      comet(ctx, c.path, c.d, c.trail, c.bright ? RGB.ice : RGB.cyan, (c.bright ? 0.9 : 0.6) * a, c.bright ? 1.8 : 1.3);
      if (c.d <= c.path.len) {
        const hd = at(c.path, c.d);
        const r = c.bright ? 13 : 8;
        ctx.globalAlpha = a;
        ctx.drawImage(glow, hd.x - r, hd.y - r, r * 2, r * 2);
        ctx.globalAlpha = 1;
      }
    }
    ctx.globalCompositeOperation = "source-over";
  };
}

const scene = (city: City) => (w: number, h: number): Scene => {
  const { p } = cityProjection(w, h, 14000);
  const tick = traffic(city, p, w, h, Math.max(80, Math.min(260, Math.round((w * h) / 16000))), 23);
  const rand = rng(4);
  const glow = glowSprite(64);
  const near = (m: Pt) => Math.hypot(m[0] - 9180, m[1] - 6250) < 1800;
  const drive = () => toPath(keepRight(randomTrip(city, rand, 9000, near).map(p), LANE));
  const TRAIL = 260;
  let track = drive();
  let d = track.len * 0.35;

  return {
    base: (ctx) => paintStreets(ctx, city, p, w, h),
    live: ({ ctx, t, dt }) => {
      tick(ctx, dt);

      // tracked unit: brighter, with a long trail that fades behind it (no persistent route line)
      d += 36 * dt;
      if (d - TRAIL > track.len) {
        track = drive();
        d = 0;
      }
      const fade = Math.min(1, d / 120, d > track.len ? 1 - (d - track.len) / TRAIL : 1);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "butt";
      comet(ctx, track, d, TRAIL, RGB.cyan, 0.35 * fade, 6);
      comet(ctx, track, d, TRAIL, RGB.ice, 0.9 * fade, 2);
      if (d > track.len) {
        ctx.globalCompositeOperation = "source-over";
        return;
      }
      const hd = at(track, d);
      ctx.globalAlpha = fade;
      ctx.drawImage(glow, hd.x - 22, hd.y - 22, 44, 44);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      const pulse = (t * 0.4) % 1;
      ctx.strokeStyle = `rgba(${RGB.cyan},${0.7 * (1 - pulse) * fade})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(hd.x, hd.y, 8 + pulse * 46, 0, Math.PI * 2);
      ctx.stroke();
    },
  };
};

function MapPlane({ city }: { city: City }) {
  const ref = useCanvasLoop(scene(city), 1.25);
  return <div ref={ref} className="hero-map-drift absolute inset-0 opacity-0 transition-opacity duration-[1400ms]" />;
}

/** Hero backdrop: night map of Tashkent pitched in 3D and slowly turning, with live traffic and one tracked unit. */
export default function HeroMap() {
  const city = useCity();
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-ink">
        <div className="absolute inset-0" style={{ perspective: "1000px", perspectiveOrigin: "50% 20%" }}>
          <div className="absolute" style={{ left: "-45%", top: "-30%", width: "190%", height: "175%", transform: "rotateX(58deg)" }}>
            {city && <MapPlane city={city} />}
          </div>
        </div>
        <div className="absolute inset-0" style={{ background: OVERLAY }} />
        <div className="absolute inset-0 opacity-[0.09] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      </div>
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-3 right-4 z-10 text-[11px] text-paper/30 transition-colors hover:text-paper/60"
      >
        © OpenStreetMap
      </a>
    </>
  );
}
