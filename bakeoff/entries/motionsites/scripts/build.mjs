// Builds out/index.html from src/ and the whereabouts data. The city tracker is rendered
// here, at build time, so no city is hard-coded in the markup.
//   node scripts/build.mjs            (reads ../../inputs/data/whereabouts.yaml, falls back to data/whereabouts.yaml)
//   WHEREABOUTS=/path/to.yaml node scripts/build.mjs
import yaml from 'js-yaml';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const candidates = [process.env.WHEREABOUTS, path.resolve(ROOT, '../../inputs/data/whereabouts.yaml'), path.join(ROOT, 'data/whereabouts.yaml')].filter(Boolean);
const dataPath = candidates.find((p) => existsSync(p));
if (!dataPath) throw new Error('whereabouts.yaml not found');
const data = yaml.load(await readFile(dataPath, 'utf8'));
await mkdir(path.join(ROOT, 'data'), { recursive: true });
if (path.resolve(dataPath) !== path.join(ROOT, 'data/whereabouts.yaml')) await copyFile(dataPath, path.join(ROOT, 'data/whereabouts.yaml'));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const known = (v) => v !== undefined && v !== null && String(v).trim() !== '' && !/tbc/i.test(String(v));
// js-yaml turns full dates into Date objects; partial ones ("2026-11") stay strings
const parse = (v) => {
  if (v instanceof Date) return { y: v.getUTCFullYear(), m: v.getUTCMonth() + 1, d: v.getUTCDate() };
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(String(v)); return m ? { y: +m[1], m: +m[2], d: m[3] ? +m[3] : null } : null;
};
const fmt = (p) => (p.d ? `${p.d} ${MONTHS[p.m - 1]}` : MONTHS[p.m - 1]);
function range(from, to) {
  const a = known(from) ? parse(from) : null, b = known(to) ? parse(to) : null;
  if (a && b) return a.m === b.m && a.d && b.d ? `${a.d}–${b.d} ${MONTHS[a.m - 1]}` : `${fmt(a)} – ${fmt(b)}`;
  if (a) return `from ${fmt(a)}`;
  if (b) return `until ${fmt(b)}`;
  return '';
}

const now = data.now || {};
const nowCity = known(now.city) ? now.city : (known(data.base) ? data.base : 'London');
const nowUntil = known(now.until) ? range(null, now.until) : '';
const next = (data.next || []).filter((n) => known(n.city));
const comingUp = next.map((n) => `<li><span class="wb__city">${esc(n.city)}</span>${range(n.from, n.to) ? `<span class="wb__when">${esc(range(n.from, n.to))}</span>` : ''}</li>`).join('');
const comingText = next.map((n) => n.city).join(', ');
const updated = known(data.updated) ? parse(data.updated) : null;

const trackerHtml = `
<div class="wb" id="whereabouts">
  <button class="wb__btn frost" type="button" aria-expanded="false" aria-controls="wb-panel">
    <span class="wb__dot" aria-hidden="true"></span>
    <span class="wb__label">Now:</span> <span class="wb__now">${esc(nowCity)}</span>
    <svg class="wb__chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
  </button>
  <div class="wb__panel frost" id="wb-panel" role="region" aria-label="Where Tengo is next">
    <p class="wb__eyebrow">Coming up${next.length ? '' : ': to be confirmed'}</p>
    ${next.length ? `<ul class="wb__list">${comingUp}</ul>` : ''}
    <p class="wb__meta">Based in ${esc(known(data.base) ? data.base : 'London')}${nowUntil ? ` · in ${esc(nowCity)} ${esc(nowUntil)}` : ''}${updated ? ` · updated ${esc(fmt(updated))} ${updated.y}` : ''}</p>
  </div>
</div>`.trim();

let html = await readFile(path.join(ROOT, 'src/index.html'), 'utf8');
const css = await readFile(path.join(ROOT, 'src/styles.css'), 'utf8');
const js = await readFile(path.join(ROOT, 'src/main.js'), 'utf8');
html = html
  .replace('<!-- TRACKER -->', trackerHtml)
  .replaceAll('{{NOW_CITY}}', esc(nowCity))
  .replaceAll('{{COMING_UP_TEXT}}', esc(comingText || 'to be confirmed'))
  .replaceAll('{{BASE_CITY}}', esc(known(data.base) ? data.base : 'London'))
  .replace('/* INLINE_CSS */', () => css)
  .replace('/* INLINE_JS */', () => js);

await mkdir(path.join(ROOT, 'out'), { recursive: true });
await writeFile(path.join(ROOT, 'out/index.html'), html);
console.log(`built out/index.html · now: ${nowCity} · coming up: ${comingText || '(none)'} · data: ${path.relative(ROOT, dataPath)}`);
