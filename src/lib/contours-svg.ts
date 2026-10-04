/**
 * Build-time static contour SVG (SITE-PLAN §6): the same field as the canvas
 * at t = 0, chained into polylines so it stays small enough to inline.
 */
import { AMBER, INK, LEVELS, REF_H, REF_W, WIDTH, eachSegment, isMajor, levelValue, sampleField } from './contours-core.ts';

export const SVG_W = REF_W;
export const SVG_H = REF_H;
export const SVG_CELL = 16;

type Seg = [number, number, number, number];

function key(x: number, y: number): string {
  return `${Math.round(x * 100)},${Math.round(y * 100)}`;
}

/** Chain segments sharing endpoints into polylines; returns compact path data. */
function chain(segs: Seg[], precision = 1): string {
  const used = new Uint8Array(segs.length);
  const at = new Map<string, number[]>();
  segs.forEach((s, i) => {
    for (const k of [key(s[0], s[1]), key(s[2], s[3])]) {
      const list = at.get(k);
      if (list) list.push(i); else at.set(k, [i]);
    }
  });
  const takeFrom = (x: number, y: number): [number, number] | null => {
    const list = at.get(key(x, y));
    if (!list) return null;
    for (const i of list) {
      if (used[i]) continue;
      used[i] = 1;
      const s = segs[i];
      return key(s[0], s[1]) === key(x, y) ? [s[2], s[3]] : [s[0], s[1]];
    }
    return null;
  };
  const m = 10 ** precision;
  const r = (n: number) => Math.round(n * m) / m;
  let d = '';
  for (let i = 0; i < segs.length; i++) {
    if (used[i]) continue;
    used[i] = 1;
    const s = segs[i];
    const back: number[][] = [];
    let p: [number, number] | null = [s[0], s[1]];
    while ((p = takeFrom(p[0], p[1]))) back.push(p);
    const fwd: number[][] = [];
    p = [s[2], s[3]];
    while ((p = takeFrom(p[0], p[1]))) fwd.push(p);
    const pts = [...back.reverse(), [s[0], s[1]], [s[2], s[3]], ...fwd];
    let px = r(pts[0][0]), py = r(pts[0][1]);
    d += `M${px} ${py}`;
    for (let k = 1; k < pts.length; k++) {
      const x = r(pts[k][0]), y = r(pts[k][1]);
      d += `l${r(x - px)} ${r(y - py)}`;
      px = x; py = y;
    }
  }
  return d;
}

/** Full SVG markup for the hero fallback (also used by the OG image). */
export function contourSvg(opts: { id?: string; className?: string; cell?: number; precision?: number } = {}): string {
  const field = sampleField(SVG_W, SVG_H, opts.cell ?? SVG_CELL, 0, -1e4, -1e4, 0, 1);
  const prec = opts.precision ?? 0;
  let ink = '', amber = '';
  for (let k = 1; k <= LEVELS; k++) {
    const segs: Seg[] = [];
    eachSegment(field, levelValue(k), (x1, y1, x2, y2) => segs.push([x1, y1, x2, y2]));
    const d = chain(segs, prec);
    if (isMajor(k)) amber += `<path d="${d}"/>`;
    else ink += `<path stroke="${INK(k)}" d="${d}"/>`;
  }
  const attrs = [
    `xmlns="http://www.w3.org/2000/svg"`,
    `viewBox="0 0 ${SVG_W} ${SVG_H}"`,
    `preserveAspectRatio="xMinYMin slice"`,
    `aria-hidden="true"`,
    `focusable="false"`,
    opts.id ? `id="${opts.id}"` : '',
    opts.className ? `class="${opts.className}"` : '',
  ].filter(Boolean).join(' ');
  return (
    `<svg ${attrs}>` +
    `<g fill="none" stroke-width="${WIDTH(1)}" stroke-linejoin="round" stroke-linecap="round">${ink}</g>` +
    `<g fill="none" stroke="${AMBER}" stroke-width="${WIDTH(4)}" stroke-linejoin="round" stroke-linecap="round">${amber}</g>` +
    `</svg>`
  );
}
