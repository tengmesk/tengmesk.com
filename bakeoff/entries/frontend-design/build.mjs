// Build script for tengmesk.com homepage.
// Reads content/whereabouts.yaml, processes images and logos with sharp,
// copies self-hosted fonts, renders src/index.html → out/index.html.
// Usage: node build.mjs [--watch]

import fs from 'node:fs/promises';
import { existsSync, watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import sharp from 'sharp';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const RAW = path.join(SRC, 'assets', 'raw');
const OUT = path.join(ROOT, 'out');

// Palette (kept in sync with src/styles.css)
const INK = '#14291C';
const PAPER = '#EEEBE1';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- whereabouts ----------
function isTbc(v) {
  return v == null || String(v).trim() === '' || /^tbc$/i.test(String(v).trim());
}
function fmtDate(v) {
  // "2026-11-04" → "4 Nov"; "2026-11" → "Nov"; anything else → ''
  const s = String(v ?? '');
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (m) return `${Number(m[3])} ${months[Number(m[2]) - 1]}`;
  m = s.match(/^(\d{4})-(\d{2})$/);
  if (m) return months[Number(m[2]) - 1];
  return '';
}
async function loadWhereabouts() {
  const text = await fs.readFile(path.join(ROOT, 'content', 'whereabouts.yaml'), 'utf8');
  const data = YAML.parse(text);
  const now = data.now && !isTbc(data.now.city) ? data.now : null;
  const next = (data.next || []).filter((n) => n && !isTbc(n.city));
  const base = !isTbc(data.base) ? String(data.base) : null;
  const updated = data.updated ? String(data.updated) : '';
  return { now, next, base, updated };
}
function renderTracker({ now, next, base, updated }) {
  if (!now) {
    return `<p class="where" data-tracker-empty>Based in ${esc(base || 'London')}.</p>`;
  }
  const upcoming = next.map((n) => {
    const from = fmtDate(n.from);
    const to = fmtDate(n.to);
    let when = '';
    if (from && to) when = `${from} to ${to}`;
    else if (from) when = `from ${from}`;
    else if (to) when = `until ${to}`;
    return `<li><span class="where-city">${esc(n.city)}</span>${when ? `<span class="where-when">${esc(when)}</span>` : ''}</li>`;
  }).join('');
  const comingUpText = next.length ? `Coming up: ${next.map((n) => n.city).join(', ')}` : 'Nothing booked yet';
  const nowUntil = fmtDate(now.until);
  return `
<div class="where" data-tracker>
  <button class="where-now" type="button" aria-expanded="false" aria-controls="where-panel">
    <span class="where-dot" aria-hidden="true"></span>
    <span class="where-label">Now:</span> <span class="where-city">${esc(now.city)}</span>
    <span class="visually-hidden">. ${esc(comingUpText)}</span>
  </button>
  <div class="where-panel" id="where-panel" role="region" aria-label="Coming up">
    <p class="where-heading">Coming up</p>
    ${next.length ? `<ul class="where-list">${upcoming}</ul>` : `<p class="where-none">Nothing booked yet.</p>`}
    <p class="where-foot">${base ? `Base: ${esc(base)}.` : ''}${nowUntil ? ` In ${esc(now.city)} until ${esc(nowUntil)}.` : ''}${updated ? ` Updated ${esc(updated)}.` : ''}</p>
  </div>
</div>`;
}

// ---------- images ----------
const images = {
  // name: { src, widths, crop?, duotone?, quality }
  portrait: { src: 'headshot/headshot-1129.jpg', widths: [560, 900, 1300], crop: { left: 350, top: 60, width: 1300, height: 1733 }, duotone: true, q: 80 },
  portraitOg: { src: 'headshot/headshot-1129.jpg', widths: [900], crop: { left: 350, top: 60, width: 1300, height: 1733 }, duotone: true, q: 82 },
  panel: { src: 'photos/panel-wide-moderating.webp', widths: [720, 1200, 1800], q: 74 },
  speaking: { src: 'photos/speaking-sunglasses-mic.webp', widths: [600, 1000], q: 74 },
  audience: { src: 'photos/audience-stamba-rooftop.webp', widths: [600, 1000], q: 72 },
  tomo: { src: 'photos/panel-with-tomo-moriwaki.webp', widths: [600, 1000], q: 74 },
  dolomites: { src: 'personal/dolomites.webp', widths: [600, 1000, 1400], q: 74 },
  zion: { src: 'personal/zion-angels-landing.webp', widths: [500, 900], q: 74 },
  bungee: { src: 'personal/bloukrans-bridge-bungee.webp', widths: [500, 900], q: 74 },
  lagos: { src: 'personal/lagos-portugal-cliff.webp', widths: [600, 1000], q: 74 },
};

function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

async function duotone(pipeline) {
  // Map greyscale luminance onto a two-colour ramp: shadows → ink, highlights → paper.
  const { data, info } = await pipeline.greyscale().raw().toBuffer({ resolveWithObject: true });
  const dark = hexToRgb(INK), light = hexToRgb(PAPER);
  const out = Buffer.alloc(info.width * info.height * 3);
  const lut = new Array(256);
  for (let v = 0; v < 256; v++) {
    // level the studio seamless (≈ 218–235 in the source) to pure paper, then a gentle
    // S-curve for a printed look; lift blacks slightly so skin isn't muddy
    let t = Math.min(1, Math.max(0, (v - 10) / (204 - 10)));
    t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    t = 0.04 + t * 0.96;
    lut[v] = [0, 1, 2].map((i) => Math.round(dark[i] + (light[i] - dark[i]) * t));
  }
  for (let p = 0, o = 0; p < data.length; p += info.channels, o += 3) {
    const c = lut[data[p]];
    out[o] = c[0]; out[o + 1] = c[1]; out[o + 2] = c[2];
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } });
}

async function buildImages() {
  const dir = path.join(OUT, 'img');
  await fs.mkdir(dir, { recursive: true });
  const manifest = {};
  for (const [name, spec] of Object.entries(images)) {
    const srcPath = path.join(RAW, spec.src);
    const base = sharp(srcPath);
    const meta = await base.metadata();
    let w = meta.width, h = meta.height;
    if (spec.crop) { w = spec.crop.width; h = spec.crop.height; }
    const outs = [];
    for (const width of spec.widths) {
      const file = `${name}-${width}.webp`;
      const target = path.join(dir, file);
      if (!existsSync(target)) {
        let p = sharp(srcPath);
        if (spec.crop) p = p.extract(spec.crop);
        p = p.resize({ width, withoutEnlargement: true });
        if (spec.duotone) p = await duotone(p);
        await p.webp({ quality: spec.q, effort: 5 }).toFile(target);
      }
      outs.push({ width, file });
    }
    manifest[name] = { width: w, height: h, outs };
  }
  return manifest;
}

function picture(manifest, name, { alt, sizes, cls = '', eager = false, style = '' }) {
  const m = manifest[name];
  const srcset = m.outs.map((o) => `img/${o.file} ${o.width}w`).join(', ');
  const largest = m.outs[m.outs.length - 1];
  return `<img class="${cls}" src="img/${largest.file}" srcset="${srcset}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="${esc(alt)}"${eager ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"'}${style ? ` style="${style}"` : ''}>`;
}

// ---------- logos ----------
// Logos are shown as single-colour marks via CSS mask-image, so each one takes the
// palette colour of its section. Bank of Georgia is the exception (a lion inside a
// filled box): two recoloured SVG variants are written instead.
const logoFiles = ['arte-development.png', 'atlas-metrics.svg', 'bank-of-georgia.svg', 'bbc-iplayer.svg', 'boxlock.svg', 'conceptdigital.svg', 'forbes-georgia.svg', 'fore-hadley.png', 'halocarbon.png', 'mckinsey.svg', 'rex.svg', 'tbilisi-holding-company.svg', 'theneo.svg', 'university-of-cambridge.png', 'linkedin.svg', 'x.svg', 'instagram.svg'];

async function buildLogos() {
  const dir = path.join(OUT, 'logos');
  await fs.mkdir(dir, { recursive: true });
  const ratios = {};
  for (const f of logoFiles) {
    const src = path.join(RAW, 'logos', f);
    let buf = await fs.readFile(src);
    if (f === 'conceptdigital.svg') buf = Buffer.from(buf.toString('utf8').replace(/\sfilter="url\(#[^"]+\)"/g, ''));
    // LinkedIn ships with a filled square behind the glyph; drop it so the mask shows only the "in".
    if (f === 'linkedin.svg') buf = Buffer.from(buf.toString('utf8').replace(/<path\s+d="m0 0H512V512H0"\s+fill="#0077b5"\/>/, ''));
    const meta = await sharp(buf).metadata();
    ratios[f] = `${meta.width}/${meta.height}`;
    if (f.endsWith('.png')) buf = await knockoutWhite(buf);
    await fs.writeFile(path.join(dir, f), buf);
    if (f === 'bank-of-georgia.svg') {
      const s = buf.toString('utf8');
      await fs.writeFile(path.join(dir, 'bank-of-georgia-ink.svg'), s.replace(/fill="white"/g, `fill="${INK}"`).replace(/#FF6022/g, PAPER));
      await fs.writeFile(path.join(dir, 'bank-of-georgia-paper.svg'), s.replace(/fill="white"/g, `fill="${PAPER}"`).replace(/#FF6022/g, INK));
    }
  }
  return ratios;
}

// A raster logo on an opaque white ground (the Cambridge PNG) would mask as a solid
// block. Derive alpha from darkness instead: dark pixels opaque, white transparent.
async function knockoutWhite(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let opaqueWhite = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 200 && data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235) opaqueWhite++;
  }
  if (opaqueWhite / (info.width * info.height) < 0.25) return buf;
  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = data[i + 1] = data[i + 2] = 0;
    data[i + 3] = Math.round(Math.max(0, Math.min(255, (255 - lum) * 1.15)));
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

function logo(ratios, file, name, extra = '') {
  // A masked block coloured by CSS (currentColor via background). role=img keeps it accessible.
  const r = ratios[file];
  return `<span class="logo${extra ? ' ' + extra : ''}" role="img" aria-label="${esc(name)}" style="--mask:url(logos/${file});aspect-ratio:${r}"></span>`;
}
function logoBoG(ratios, variant, name = 'Bank of Georgia') {
  return `<img class="logo logo-img" src="logos/bank-of-georgia-${variant}.svg" alt="${esc(name)}" style="aspect-ratio:${ratios['bank-of-georgia.svg']}" loading="lazy">`;
}
function wordmark(name) {
  return `<span class="logo logo-word">${esc(name)}</span>`;
}

// ---------- fonts ----------
async function buildFonts() {
  const dir = path.join(OUT, 'fonts');
  await fs.mkdir(dir, { recursive: true });
  const files = [
    ['@fontsource-variable/besley/files/besley-latin-wght-normal.woff2', 'besley-latin-wght-normal.woff2'],
    ['@fontsource-variable/besley/files/besley-latin-wght-italic.woff2', 'besley-latin-wght-italic.woff2'],
    ['@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2', 'hanken-grotesk-latin-wght-normal.woff2'],
    ['@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-italic.woff2', 'hanken-grotesk-latin-wght-italic.woff2'],
  ];
  for (const [from, to] of files) {
    await fs.copyFile(path.join(ROOT, 'node_modules', from), path.join(dir, to));
  }
}

// ---------- page ----------
async function build() {
  const t0 = Date.now();
  await fs.mkdir(OUT, { recursive: true });
  const where = await loadWhereabouts();
  const [manifest, ratios] = await Promise.all([buildImages(), buildLogos(), buildFonts()]);

  const tpl = await fs.readFile(path.join(SRC, 'index.html'), 'utf8');
  const nowCity = where.now ? where.now.city : (where.base || 'London');
  const vars = {
    TRACKER: renderTracker(where),
    NOW_CITY: esc(nowCity),
    BASE_CITY: esc(where.base || 'London'),
    UPDATED: esc(where.updated),
    PORTRAIT: picture(manifest, 'portrait', {
      alt: 'Tengo Meskhi, three-quarter length studio portrait, hands in pockets, smiling, in glasses and a grey shirt. Rendered in deep green ink on paper.',
      sizes: '(max-width: 720px) 86vw, (max-width: 1100px) 44vw, 520px', cls: 'portrait-img', eager: true,
    }),
    PHOTO_PANEL: picture(manifest, 'panel', { alt: 'Tengo Meskhi, microphone in hand, moderating the Superstar Panel on innovation and technology at Global Tech Weekend 2025, with three panelists and the session screen under the timber roof of the Stamba rooftop.', sizes: '(max-width: 720px) 92vw, 62vw', cls: 'ph' }),
    PHOTO_SPEAKING: picture(manifest, 'speaking', { alt: 'Tengo Meskhi speaking into a handheld microphone, gesturing with one hand, in a white shirt and sunglasses, in front of the timber columns of the Stamba rooftop.', sizes: '(max-width: 720px) 46vw, 30vw', cls: 'ph' }),
    PHOTO_AUDIENCE: picture(manifest, 'audience', { alt: 'A full audience seated under the warm, amber-lit timber roof of the Stamba Hotel rooftop in Tbilisi, facing the panel screen.', sizes: '(max-width: 720px) 46vw, 30vw', cls: 'ph' }),
    PHOTO_TOMO: picture(manifest, 'tomo', { alt: 'Tengo Meskhi listening on stage beside panelist Tomo Moriwaki, both seated in tan leather chairs with a small table between them.', sizes: '(max-width: 720px) 92vw, 30vw', cls: 'ph' }),
    PHOTO_DOLOMITES: picture(manifest, 'dolomites', { alt: 'Tengo standing on a grassy ridge in the Dolomites, Italy, in a black T-shirt, cap and sunglasses, with jagged peaks and cloud behind him.', sizes: '(max-width: 720px) 92vw, 46vw', cls: 'ph' }),
    PHOTO_ZION: picture(manifest, 'zion', { alt: "Tengo at the top of a chained sandstone scramble on Angel's Landing, Zion National Park, Utah, under a clear blue sky.", sizes: '(max-width: 720px) 46vw, 22vw', cls: 'ph' }),
    PHOTO_BUNGEE: picture(manifest, 'bungee', { alt: 'Tengo in a harness on the platform of Bloukrans Bridge, South Africa, moments before a bungee jump, forested hills in the mist behind.', sizes: '(max-width: 720px) 46vw, 22vw', cls: 'ph' }),
    PHOTO_LAGOS: picture(manifest, 'lagos', { alt: 'Tengo standing on a clifftop above a deep blue Atlantic in Lagos, Portugal, in a striped shirt and white trousers.', sizes: '(max-width: 720px) 92vw, 46vw', cls: 'ph' }),

    LOGO_MCKINSEY: logo(ratios, 'mckinsey.svg', 'McKinsey & Company'),
    LOGO_BOG_INK: logoBoG(ratios, 'ink'),
    LOGO_BOG_PAPER: logoBoG(ratios, 'paper'),
    LOGO_CAMBRIDGE: logo(ratios, 'university-of-cambridge.png', 'University of Cambridge'),
    LOGO_IPLAYER: logo(ratios, 'bbc-iplayer.svg', 'BBC iPlayer'),
    LOGO_CONCEPTDIGITAL: logo(ratios, 'conceptdigital.svg', 'Conceptdigital'),
    LOGO_HALOCARBON: logo(ratios, 'halocarbon.png', 'Halocarbon'),
    LOGO_WALL: [
      logo(ratios, 'forbes-georgia.svg', 'Forbes Georgia'),
      wordmark('National Bank of Georgia'),
      logoBoG(ratios, 'paper'),
      wordmark('Credo Bank'),
      wordmark('ProCredit Bank'),
      logo(ratios, 'halocarbon.png', 'Halocarbon'),
      logo(ratios, 'rex.svg', 'Rex'),
      logo(ratios, 'theneo.svg', 'Theneo'),
      logo(ratios, 'tbilisi-holding-company.svg', 'Tbilisi Holding Company'),
      logo(ratios, 'arte-development.png', 'Arte Development'),
      wordmark('Transiberia'),
      wordmark('Aversi'),
      wordmark('Schirnhofer'),
      wordmark('GPI Holding'),
      wordmark('SEU University'),
      wordmark("Children's Hospital Colorado"),
      wordmark('Todd Bartos Group'),
      logo(ratios, 'atlas-metrics.svg', 'Atlas Metrics'),
      logo(ratios, 'boxlock.svg', 'BoxLock'),
      logo(ratios, 'fore-hadley.png', 'Fore Hadley Foundation'),
    ].map((l) => `<li>${l}</li>`).join('\n      '),
    ICON_LINKEDIN: `<span class="icon" aria-hidden="true" style="--mask:url(logos/linkedin.svg)"></span>`,
    ICON_X: `<span class="icon" aria-hidden="true" style="--mask:url(logos/x.svg)"></span>`,
    ICON_INSTAGRAM: `<span class="icon" aria-hidden="true" style="--mask:url(logos/instagram.svg)"></span>`,
    YEAR: String(new Date().getFullYear()),
  };
  let html = tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => {
    if (!(k in vars)) throw new Error(`Unknown template variable ${k}`);
    return vars[k];
  });
  await fs.writeFile(path.join(OUT, 'index.html'), html);
  await fs.copyFile(path.join(SRC, 'styles.css'), path.join(OUT, 'styles.css'));
  await fs.copyFile(path.join(SRC, 'main.js'), path.join(OUT, 'main.js'));
  for (const f of ['favicon.svg', 'robots.txt']) {
    if (existsSync(path.join(SRC, f))) await fs.copyFile(path.join(SRC, f), path.join(OUT, f));
  }
  // Open Graph page: rendered to out/og.jpg by scripts/screenshots.mjs
  if (existsSync(path.join(SRC, 'og.html'))) {
    const og = (await fs.readFile(path.join(SRC, 'og.html'), 'utf8')).replace(/\{\{(\w+)\}\}/g, (m, k) => vars[k] ?? '');
    await fs.writeFile(path.join(OUT, 'og.html'), og);
  }
  console.log(`built out/ in ${Date.now() - t0} ms (now: ${nowCity})`);
}

await build();
if (process.argv.includes('--watch')) {
  let timer;
  for (const d of [SRC, path.join(ROOT, 'content')]) {
    watch(d, { recursive: true }, () => { clearTimeout(timer); timer = setTimeout(() => build().catch(console.error), 120); });
  }
  console.log('watching src/ and content/ …');
}
