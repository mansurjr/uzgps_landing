export type LngLat = [number, number];

const R = 6371000;

export function haversine(a: LngLat, b: LngLat) {
  const toRad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * toRad;
  const dLng = (b[0] - a[0]) * toRad;
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * toRad) * Math.cos(b[1] * toRad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Precomputes cumulative distances so a route can be sampled by metres travelled. */
export function measure(coords: LngLat[]) {
  const cum = [0];
  for (let i = 1; i < coords.length; i++) cum.push(cum[i - 1] + haversine(coords[i - 1], coords[i]));
  return { coords, cum, length: cum[cum.length - 1] };
}

export type Measured = ReturnType<typeof measure>;

/** Point at distance `d` metres plus the index of the segment it lies on. */
export function along(route: Measured, d: number): { point: LngLat; index: number } {
  const { coords, cum } = route;
  let lo = 0;
  let hi = cum.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= d) lo = mid;
    else hi = mid;
  }
  const seg = cum[hi] - cum[lo] || 1;
  const t = Math.min(1, Math.max(0, (d - cum[lo]) / seg));
  const a = coords[lo];
  const b = coords[hi];
  return { point: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], index: lo };
}

/** Trail of the last `meters` behind distance `d`. */
export function trail(route: Measured, d: number, meters: number): LngLat[] {
  const start = Math.max(0, d - meters);
  const s = along(route, start);
  const e = along(route, d);
  return [s.point, ...route.coords.slice(s.index + 1, e.index + 1), e.point];
}
