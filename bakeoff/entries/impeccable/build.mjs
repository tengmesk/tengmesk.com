// Build script for tengmesk.com homepage.
// Reads data/whereabouts.yaml at build time, inlines CSS, copies self-hosted
// fonts and assets, generates the contour-line ground (SVG) and writes ./out.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, 'src');
const out = path.join(root, 'out');

const read = (p) => fs.readFileSync(p, 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- whereabouts ----------
const where = yaml.load(read(path.join(root, 'data', 'whereabouts.yaml')));
// js-yaml parses unquoted YYYY-MM-DD as a Date; normalise everything to a string first.
const norm = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v === undefined || v === null ? '' : String(v).trim());
const isSet = (v) => norm(v) !== '' && norm(v).toLowerCase() !== 'tbc';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtDate(v) {
  if (!isSet(v)) return '';
  const m = norm(v).match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
  if (!m) return '';
  const mon = MONTHS[Number(m[2]) - 1];
  return m[3] ? `${Number(m[3])} ${mon}` : mon;
}
function range(from, to) {
  const a = fmtDate(from), b = fmtDate(to);
  if (a && b) {
    const [ad, am] = a.split(' '), [bd, bm] = b.split(' ');
    return am === bm && ad && bd ? `${ad}–${bd} ${am}` : `${a} – ${b}`;
  }
  if (a) return `from ${a}`;
  if (b) return `until ${b}`;
  return '';
}
const nowCity = isSet(where.now?.city) ? where.now.city : where.base;
const nowUntil = fmtDate(where.now?.until);
const next = (where.next || []).filter((n) => isSet(n.city));
const comingUpItems = next.map((n) => {
  const when = range(n.from, n.to);
  return `<li class="post__finger"><span class="post__city">${esc(n.city)}</span>${when ? `<span class="post__when">${esc(when)}</span>` : ''}</li>`;
}).join('\n');
const comingUpText = next.map((n) => n.city).join(', ');
const updated = isSet(where.updated) ? norm(where.updated) : '';
const updatedLong = updated ? (() => { const d = new Date(updated + 'T00:00:00Z'); return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`; })() : '';

// ---------- contour ground (value noise + marching squares) ----------
function contourSVG({ w = 1600, h = 900, cell = 10, levels = 7, seed = 7 } = {}) {
  let s = seed >>> 0;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const gw = 12, gh = 8; // lattice
  const lattice = [];
  for (let o = 0; o < 3; o++) {
    const n = []; const f = 1 << o;
    for (let y = 0; y <= gh * f; y++) { const row = []; for (let x = 0; x <= gw * f; x++) row.push(rnd()); n.push(row); }
    lattice.push(n);
  }
  const smooth = (t) => t * t * (3 - 2 * t);
  const sample = (u, v) => {
    let val = 0, amp = 1, norm = 0;
    for (let o = 0; o < 3; o++) {
      const f = 1 << o; const n = lattice[o];
      const x = u * gw * f, y = v * gh * f;
      const x0 = Math.floor(x), y0 = Math.floor(y);
      const tx = smooth(x - x0), ty = smooth(y - y0);
      const a = n[y0][x0], b = n[y0][x0 + 1], c = n[y0 + 1][x0], d = n[y0 + 1][x0 + 1];
      val += amp * ((a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty);
      norm += amp; amp *= 0.5;
    }
    return val / norm;
  };
  const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
  const field = [];
  for (let j = 0; j <= rows; j++) { const r = []; for (let i = 0; i <= cols; i++) r.push(sample(i / cols * 0.999, j / rows * 0.999)); field.push(r); }
  let min = 1, max = 0; for (const r of field) for (const v of r) { if (v < min) min = v; if (v > max) max = v; }
  const paths = [];
  for (let L = 1; L <= levels; L++) {
    const iso = min + (max - min) * (L / (levels + 1));
    const segs = new Map(); // key -> [points]
    const key = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
    const lerp = (p1, v1, p2, v2) => { const t = (iso - v1) / (v2 - v1); return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t]; };
    const rawSegs = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const v = [field[j][i], field[j][i + 1], field[j + 1][i + 1], field[j + 1][i]];
      const p = [[i * cell, j * cell], [(i + 1) * cell, j * cell], [(i + 1) * cell, (j + 1) * cell], [i * cell, (j + 1) * cell]];
      const idx = (v[0] > iso ? 8 : 0) | (v[1] > iso ? 4 : 0) | (v[2] > iso ? 2 : 0) | (v[3] > iso ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const e = [lerp(p[0], v[0], p[1], v[1]), lerp(p[1], v[1], p[2], v[2]), lerp(p[2], v[2], p[3], v[3]), lerp(p[3], v[3], p[0], v[0])];
      const table = { 1: [[3, 2]], 2: [[2, 1]], 3: [[3, 1]], 4: [[1, 0]], 5: [[3, 0], [1, 2]], 6: [[2, 0]], 7: [[3, 0]], 8: [[0, 3]], 9: [[0, 2]], 10: [[0, 1], [2, 3]], 11: [[0, 1]], 12: [[1, 3]], 13: [[1, 2]], 14: [[2, 3]] };
      for (const [a, b] of table[idx]) rawSegs.push([e[a], e[b]]);
    }
    // join segments into polylines
    const adj = new Map();
    const add = (k, seg) => { if (!adj.has(k)) adj.set(k, []); adj.get(k).push(seg); };
    rawSegs.forEach((sg, n) => { add(key(sg[0]), n); add(key(sg[1]), n); });
    const used = new Array(rawSegs.length).fill(false);
    for (let n = 0; n < rawSegs.length; n++) {
      if (used[n]) continue;
      used[n] = true;
      const line = [rawSegs[n][0], rawSegs[n][1]];
      for (const dir of [1, -1]) {
        let cur = dir === 1 ? line[line.length - 1] : line[0];
        for (;;) {
          const cands = (adj.get(key(cur)) || []).filter((m) => !used[m]);
          if (!cands.length) break;
          const m = cands[0]; used[m] = true;
          const sg = rawSegs[m];
          const nxt = key(sg[0]) === key(cur) ? sg[1] : sg[0];
          if (dir === 1) line.push(nxt); else line.unshift(nxt);
          cur = nxt;
        }
      }
      if (line.length > 3) paths.push({ L, line });
    }
    void segs;
  }
  const d = (line) => line.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(0)} ${p[1].toFixed(0)}`).join('');
  const body = paths.map((p) => `<path d="${d(p.line)}"${p.L % 3 === 0 ? ' class="i"' : ''}/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice"><style>path{fill:none;stroke:#f5efe2;stroke-width:1;stroke-opacity:.16}path.i{stroke-width:1.6;stroke-opacity:.22}</style>${body}</svg>`;
}

// ---------- assemble ----------
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'fonts'), { recursive: true });
// provenance sidecars (*.json next to rasters) stay in src; they are not served
fs.cpSync(path.join(src, 'assets'), path.join(out, 'assets'), { recursive: true, filter: (p) => !p.endsWith('.json') });
fs.writeFileSync(path.join(out, 'assets', 'contours.svg'), contourSVG());
fs.writeFileSync(path.join(out, 'assets', 'contours-ink.svg'), contourSVG({ seed: 11 }).replace('#f5efe2', '#5a3a1f').replace('stroke-opacity:.16', 'stroke-opacity:.14').replace('stroke-opacity:.22', 'stroke-opacity:.2'));

const fonts = [
  ['besley', 'besley-latin-600-normal.woff2'], ['besley', 'besley-latin-700-normal.woff2'], ['besley', 'besley-latin-800-normal.woff2'], ['besley', 'besley-latin-600-italic.woff2'],
  ['signika', 'signika-latin-400-normal.woff2'], ['signika', 'signika-latin-500-normal.woff2'], ['signika', 'signika-latin-600-normal.woff2'],
];
for (const [pkg, file] of fonts) fs.copyFileSync(path.join(root, 'node_modules', '@fontsource', pkg, 'files', file), path.join(out, 'fonts', file));

const css = read(path.join(src, 'styles.css'));
const js = read(path.join(src, 'main.js'));
fs.writeFileSync(path.join(out, 'main.js'), js);

let html = read(path.join(src, 'index.html'));
const fill = {
  CSS: css,
  NOW_CITY: esc(nowCity),
  NOW_UNTIL: esc(nowUntil),
  BASE_CITY: esc(where.base || ''),
  COMING_UP_ITEMS: comingUpItems,
  COMING_UP_TEXT: esc(comingUpText),
  COMING_UP_COUNT: String(next.length),
  UPDATED: esc(updated),
  UPDATED_LONG: esc(updatedLong),
  YEAR: String(new Date().getUTCFullYear()),
};
html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in fill ? fill[k] : m));
const leftover = html.match(/\{\{\w+\}\}/g);
if (leftover) throw new Error('Unfilled placeholders: ' + leftover.join(', '));
fs.writeFileSync(path.join(out, 'index.html'), html);

console.log(`built out/ — now: ${nowCity}${nowUntil ? ' (until ' + nowUntil + ')' : ''}; coming up: ${comingUpText || 'none'}; updated ${updated}`);
