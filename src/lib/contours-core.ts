/**
 * Contour field (SITE-PLAN §6). Layered value noise → marching squares.
 * No DOM, no dependencies: used by the build-time SVG (static fallback) and by
 * the canvas island, so static and animated frames come from one seed.
 */

export const LEVELS = 13;
export const levelValue = (k: number) => 0.18 + k * 0.052; // k = 1..13
export const isMajor = (k: number) => k % 4 === 0;

/** Deterministic permutation table (same constants as the approved mockup). */
const P = new Uint8Array(512);
{
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = ((((Math.sin(i * 91.7) * 43758.5453) % 1) + 1) % 1) * (i + 1) | 0;
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) P[i] = p[i & 255];
}
const fade = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Value noise in [0, 1]. */
export function noise(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  const X = xi & 255, Y = yi & 255;
  const u = fade(x - xi), v = fade(y - yi);
  const h = (i: number, j: number) => P[P[X + i] + Y + j] / 255;
  return lerp(lerp(h(0, 0), h(1, 0), u), lerp(h(0, 1), h(1, 1), u), v);
}

export interface Field {
  cols: number;
  rows: number;
  cs: number;
  f: Float32Array;
}

/** Reference frame of the field: the static SVG's viewBox. */
export const REF_W = 1440;
export const REF_H = 820;

/** Uniform scale that makes the reference frame cover W×H (CSS `slice`). */
export const coverScale = (W: number, H: number) => Math.max(W / REF_W, H / REF_H);

/**
 * Sample the height field for a W×H area at cell size `cs`, time `t` (s), with
 * an optional pointer hill at (mx, my) with strength ms (0..1). `sc` is the
 * scale from reference units to pixels, so a canvas and the SVG fallback show
 * the same field when both are aligned top-left.
 */
export function sampleField(
  W: number,
  H: number,
  cs: number,
  t: number,
  mx = -1e4,
  my = -1e4,
  ms = 0,
  sc = coverScale(W, H),
  out?: Float32Array,
): Field {
  const cols = Math.ceil(W / cs) + 1;
  const rows = Math.ceil(H / cs) + 1;
  const s = 3.2 / (REF_W * sc);
  const f = out && out.length === cols * rows ? out : new Float32Array(cols * rows);
  const hill = ms > 0.001;
  for (let j = 0; j < rows; j++) {
    const y = j * cs;
    for (let i = 0; i < cols; i++) {
      const x = i * cs;
      let v =
        noise(x * s * 0.9 + t * 0.05, y * s * 0.9) * 0.6 +
        noise(x * s * 2.1 - t * 0.03, y * s * 2.1 + 7) * 0.28 +
        noise(x * s * 4.3, y * s * 4.3 - t * 0.04) * 0.12;
      if (hill) {
        const dx = x - mx, dy = y - my;
        v += 0.22 * ms * Math.exp(-(dx * dx + dy * dy) / 24200);
      }
      f[j * cols + i] = v;
    }
  }
  return { cols, rows, cs, f };
}

// Edge pairs per marching-squares case (edges: 0 top, 1 right, 2 bottom, 3 left).
const SEG: Record<number, number[][]> = {
  1: [[2, 3]], 2: [[1, 2]], 3: [[1, 3]], 4: [[0, 1]], 5: [[0, 3], [1, 2]], 6: [[0, 2]], 7: [[0, 3]],
  8: [[0, 3]], 9: [[0, 2]], 10: [[0, 1], [2, 3]], 11: [[0, 1]], 12: [[1, 3]], 13: [[1, 2]], 14: [[2, 3]],
};

/**
 * Walk every line segment of iso-level `lv`. `emit` receives absolute
 * coordinates; no arrays are allocated per segment.
 */
export function eachSegment(
  { cols, rows, cs, f }: Field,
  lv: number,
  emit: (x1: number, y1: number, x2: number, y2: number) => void,
): void {
  const ex = [0, 0, 0, 0], ey = [0, 0, 0, 0];
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = f[j * cols + i], b = f[j * cols + i + 1];
      const c = f[(j + 1) * cols + i + 1], d = f[(j + 1) * cols + i];
      const id = ((a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0));
      if (id === 0 || id === 15) continue;
      const x = i * cs, y = j * cs;
      ex[0] = x + cs * (lv - a) / (b - a); ey[0] = y;
      ex[1] = x + cs; ey[1] = y + cs * (lv - b) / (c - b);
      ex[2] = x + cs * (lv - d) / (c - d); ey[2] = y + cs;
      ex[3] = x; ey[3] = y + cs * (lv - a) / (d - a);
      for (const [p, q] of SEG[id]) emit(ex[p], ey[p], ex[q], ey[q]);
    }
  }
}

export const INK = (k: number) => `rgba(18,19,22,${(0.08 + k * 0.008).toFixed(3)})`;
export const AMBER = 'rgba(226,144,42,.85)';
export const WIDTH = (k: number) => (isMajor(k) ? 1.3 : 0.8);
