// Static build for tengmesk.com homepage.
// - reads data/whereabouts.yaml and renders the city tracker at build time
// - generates the contour-line motif as inline SVG (no image files)
// - resizes photos to responsive WebP with sharp
// - copies self-hosted fonts, logos, CSS and JS into out/
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'out');

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isSet = (v) => v !== undefined && v !== null && (v instanceof Date || (String(v).trim() !== '' && String(v).trim().toLowerCase() !== 'tbc'));

// ---------- whereabouts ----------
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function parseDate(v) {
  // js-yaml turns unquoted YYYY-MM-DD into Date objects; month-only values stay strings.
  if (v instanceof Date && !Number.isNaN(v.getTime())) return { y: v.getUTCFullYear(), mo: v.getUTCMonth() + 1, d: v.getUTCDate() };
  if (!isSet(v)) return null;
  const m = String(v).match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
  if (!m) return null;
  return { y: +m[1], mo: +m[2], d: m[3] ? +m[3] : null };
}
const fmtDay = (p) => (p.d ? `${p.d} ${MONTHS[p.mo - 1]}` : MONTHS[p.mo - 1]);
function fmtRange(from, to) {
  const a = parseDate(from); const b = parseDate(to);
  if (a && b) {
    if (a.mo === b.mo && a.d && b.d) return `${a.d}–${b.d} ${MONTHS[a.mo - 1]}`;
    return `${fmtDay(a)} – ${fmtDay(b)}`;
  }
  if (a) return `from ${fmtDay(a)}`;
  if (b) return `until ${fmtDay(b)}`;
  return '';
}
function fmtUpdated(v) {
  const p = parseDate(v);
  if (!p) return '';
  return p.d ? `${p.d} ${MONTHS[p.mo - 1]} ${p.y}` : `${MONTHS[p.mo - 1]} ${p.y}`;
}

function renderTracker(data, id) {
  const now = data.now || {};
  const nowCity = isSet(now.city) ? now.city : (isSet(data.base) ? data.base : 'London');
  const next = (data.next || []).filter((n) => isSet(n.city));
  const until = isSet(now.until) ? fmtRange('', now.until) : '';
  const items = next.map((n) => {
    const when = fmtRange(n.from, n.to);
    const note = isSet(n.note) ? `<span class="tracker__note">${esc(n.note)}</span>` : '';
    return `<li class="tracker__item"><span class="tracker__place">${esc(n.city)}</span>${when ? `<span class="tracker__when">${esc(when)}</span>` : ''}${note}</li>`;
  }).join('');
  const comingUpText = next.map((n) => n.city).join(', ');
  const list = next.length
    ? `<p class="tracker__title" id="tracker-title-${id}">Coming up</p><ol class="tracker__list" aria-label="Coming up: ${esc(comingUpText)}">${items}</ol>`
    : `<p class="tracker__title" id="tracker-title-${id}">Coming up</p><p class="tracker__empty">Nothing booked yet. Ask him.</p>`;
  const meta = [
    isSet(data.base) ? `Base: ${esc(data.base)}` : '',
    until ? `In ${esc(nowCity)} ${esc(until)}` : '',
    isSet(data.updated) ? `Updated ${esc(fmtUpdated(data.updated))}` : '',
  ].filter(Boolean).join(' · ');
  return `<div class="tracker" data-tracker>
  <button type="button" class="tracker__btn" id="tracker-btn-${id}" aria-expanded="false" aria-controls="tracker-pop-${id}">
    <span class="tracker__dot" aria-hidden="true"></span>
    <span class="tracker__label">Now:</span>
    <span class="tracker__city">${esc(nowCity)}</span>
    <svg class="tracker__chev" aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    <span class="sr-only">. Show where Tengo is heading next</span>
  </button>
  <div class="tracker__pop" id="tracker-pop-${id}" role="region" aria-labelledby="tracker-title-${id}">
    ${list}
    ${meta ? `<p class="tracker__meta">${meta}</p>` : ''}
  </div>
</div>`;
}

// ---------- contour motif (generated, no image files) ----------
function contours({ w = 1400, h = 900, rings = 11, seed = 2, cx = w * 0.62, cy = h * 0.5, aspect = 0.78 } = {}) {
  const paths = [];
  const steps = 96;
  for (let r = 1; r <= rings; r++) {
    const R = (r / rings) * Math.max(w, h) * 0.62;
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const wobble = 1
        + 0.11 * Math.sin(3 * t + seed + r * 0.35)
        + 0.06 * Math.sin(5 * t - seed * 1.7 + r * 0.2)
        + 0.035 * Math.sin(9 * t + r);
      const rad = R * wobble;
      const x = Math.round(cx + rad * Math.cos(t));
      const y = Math.round(cy + rad * aspect * Math.sin(t));
      d += (i === 0 ? 'M' : 'L') + x + ' ' + y;
    }
    paths.push(`<path d="${d}Z"/>`);
  }
  return `<svg class="contours" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round">${paths.join('')}</svg>`;
}

// ---------- images ----------
const PHOTOS = [
  { src: 'headshot-1129.jpg', out: 'headshot', widths: [480, 720, 1000, 1400], quality: 80, crop: { aspect: 4 / 5, focus: 'top' } },
  { src: 'panel-wide-moderating.webp', out: 'panel-wide', widths: [640, 960, 1400, 2000], quality: 76 },
  { src: 'speaking-sunglasses-mic.webp', out: 'speaking', widths: [480, 800, 1200], quality: 76 },
  { src: 'audience-stamba-rooftop.webp', out: 'audience', widths: [480, 800, 1200], quality: 74 },
  { src: 'panel-with-tomo-moriwaki.webp', out: 'with-tomo', widths: [480, 800, 1200], quality: 76 },
  { src: 'speaking-globalize.webp', out: 'globalize', widths: [480, 800, 1200], quality: 76 },
  { src: 'bloukrans-bridge-bungee.webp', out: 'bungee', widths: [480, 800, 1200], quality: 76 },
  { src: 'zion-angels-landing.webp', out: 'zion', widths: [480, 800, 1200], quality: 76 },
  { src: 'dolomites.webp', out: 'dolomites', widths: [480, 800, 1200], quality: 76 },
  { src: 'lagos-portugal-cliff.webp', out: 'lagos', widths: [480, 800, 1200], quality: 76 },
];

async function buildImages() {
  const dir = path.join(OUT, 'assets', 'img');
  await fs.mkdir(dir, { recursive: true });
  for (const p of PHOTOS) {
    const input = path.join(SRC, 'assets', 'photos', p.src);
    let base = sharp(input).rotate();
    const meta = await base.metadata();
    if (p.crop) {
      const targetAspect = p.crop.aspect;
      let cw = meta.width; let ch = Math.round(cw / targetAspect);
      if (ch > meta.height) { ch = meta.height; cw = Math.round(ch * targetAspect); }
      const left = Math.round((meta.width - cw) / 2);
      const top = p.crop.focus === 'top' ? 0 : Math.round((meta.height - ch) / 2);
      base = base.extract({ left, top, width: cw, height: ch });
    }
    for (const w of p.widths) {
      if (w > meta.width) continue;
      await base.clone().resize({ width: w, withoutEnlargement: true }).webp({ quality: p.quality, effort: 4 })
        .toFile(path.join(dir, `${p.out}-${w}.webp`));
    }
  }
  // Open Graph image: 1200x630 from the preferred headshot.
  await sharp(path.join(SRC, 'assets', 'photos', 'headshot-1129.jpg')).rotate()
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'top' })
    .jpeg({ quality: 82 }).toFile(path.join(dir, 'og.jpg'));
}

// ---------- main ----------
async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const e of await fs.readdir(from, { withFileTypes: true })) {
    const a = path.join(from, e.name); const b = path.join(to, e.name);
    if (e.isDirectory()) await copyDir(a, b); else await fs.copyFile(a, b);
  }
}

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  const where = yaml.load(await fs.readFile(path.join(ROOT, 'data', 'whereabouts.yaml'), 'utf8')) || {};
  let html = await fs.readFile(path.join(SRC, 'index.html'), 'utf8');
  html = html
    .replaceAll('<!-- @tracker:nav -->', renderTracker(where, 'nav'))
    .replaceAll('<!-- @tracker:hero -->', renderTracker(where, 'hero'))
    .replaceAll('<!-- @contours:hero -->', contours({ seed: 2 }))
    .replaceAll('<!-- @contours:band -->', contours({ seed: 5, cx: 1400 * 0.2, cy: 900 * 0.7, rings: 9 }))
    .replaceAll('{{base}}', esc(isSet(where.base) ? where.base : 'London'))
    .replaceAll('{{year}}', String(new Date().getFullYear()));
  await fs.writeFile(path.join(OUT, 'index.html'), html);

  await fs.copyFile(path.join(SRC, 'styles.css'), path.join(OUT, 'styles.css'));
  await fs.copyFile(path.join(SRC, 'main.js'), path.join(OUT, 'main.js'));
  await fs.writeFile(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://tengmesk.com/sitemap.xml\n');
  await fs.writeFile(path.join(OUT, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://tengmesk.com/</loc></url></urlset>\n');

  // fonts (self-hosted from @fontsource-variable)
  const fontsOut = path.join(OUT, 'fonts');
  await fs.mkdir(fontsOut, { recursive: true });
  const nm = path.join(ROOT, 'node_modules', '@fontsource-variable');
  await fs.copyFile(path.join(nm, 'fraunces', 'files', 'fraunces-latin-opsz-normal.woff2'), path.join(fontsOut, 'fraunces-opsz-normal.woff2'));
  await fs.copyFile(path.join(nm, 'fraunces', 'files', 'fraunces-latin-opsz-italic.woff2'), path.join(fontsOut, 'fraunces-opsz-italic.woff2'));
  await fs.copyFile(path.join(nm, 'instrument-sans', 'files', 'instrument-sans-latin-wght-normal.woff2'), path.join(fontsOut, 'instrument-sans-wght-normal.woff2'));

  await copyDir(path.join(SRC, 'assets', 'logos'), path.join(OUT, 'assets', 'logos'));
  await buildImages();

  const files = await fs.readdir(path.join(OUT, 'assets', 'img'));
  console.log(`Built out/ with ${files.length} images. Now: ${where?.now?.city ?? '?'}; next: ${(where.next || []).map((n) => n.city).join(', ')}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
