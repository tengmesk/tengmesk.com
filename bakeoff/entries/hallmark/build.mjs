// Static build for tengmesk.com (Hallmark bake-off entry).
// Reads the whereabouts data at build time, renders the city tracker into the
// template, resizes the photographs, copies fonts and logos, and writes ./out.
import { readFile, writeFile, mkdir, rm, copyFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import sharp from 'sharp';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, 'src');
const out = path.join(root, 'out');
const inputs = path.resolve(root, '../../inputs');

// Whereabouts: ./data/whereabouts.yaml wins if present, else the bake-off inputs,
// else the path in WHEREABOUTS.
const whereaboutsPath = [
  process.env.WHEREABOUTS,
  path.join(root, 'data/whereabouts.yaml'),
  path.join(inputs, 'data/whereabouts.yaml'),
].find((p) => p && existsSync(p));
if (!whereaboutsPath) throw new Error('whereabouts.yaml not found');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const isTbc = (v) => v == null || v === '' || String(v).toLowerCase().startsWith('tbc');
const day = (iso) => {
  if (isTbc(iso)) return null;
  const m = String(iso).match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
  if (!m) return null;
  return m[3] ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]}` : MONTHS_LONG[Number(m[2]) - 1];
};
const longDate = (iso) => {
  const m = String(iso ?? '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${Number(m[3])} ${MONTHS_LONG[Number(m[2]) - 1]} ${m[1]}` : '';
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function renderTracker(data) {
  const now = data.now || {};
  const nowCity = isTbc(now.city) ? data.base : now.city;
  const until = day(now.until);
  const next = (data.next || []).filter((n) => !isTbc(n.city));
  const nextParts = next.map((n) => {
    const from = day(n.from);
    const to = day(n.to);
    let when = '';
    if (from && to) when = ` (${from} to ${to})`;
    else if (from) when = ` (from ${from})`;
    else if (to) when = ` (until ${to})`;
    return `${esc(n.city)}${when}`;
  });
  const comingUp = nextParts.length ? `Coming up: ${nextParts.join(', ')}.` : 'Coming up: nothing booked yet.';
  const base = data.base ? ` Based in ${esc(data.base)}.` : '';
  const untilText = until ? ` until ${until}` : '';
  return `<div class="tracker" data-tracker>
        <button class="tracker__now" type="button" aria-expanded="false" aria-controls="coming-up">Now: <b>${esc(nowCity)}</b><span class="visually-hidden">${untilText}. Show where next.</span><svg class="icon" aria-hidden="true" viewBox="0 0 16 16" width="12" height="12"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>
        <p class="tracker__next" id="coming-up"><span>${comingUp}${base}</span></p>
      </div>`;
}

// Photographs: each becomes a set of WebP sizes. The hero keeps a 2400 for 1920 screens.
const PHOTOS = {
  'stage-speaking': { from: 'images/photos/speaking-sunglasses-mic.webp', widths: [800, 1200, 1600, 2000] },
  'stage-panel': { from: 'images/photos/panel-wide-moderating.webp', widths: [800, 1200, 1600, 2000] },
  'headshot': { from: 'images/headshot/headshot-1129.jpg', widths: [480, 720, 960, 1280], crop: { left: 0.14, top: 0.0, width: 0.76, height: 0.95 } },
  'dolomites': { from: 'images/personal/dolomites.webp', widths: [800, 1200, 1600, 2000] },
};

async function buildPhotos() {
  const dir = path.join(out, 'images');
  await mkdir(dir, { recursive: true });
  const meta = {};
  for (const [name, spec] of Object.entries(PHOTOS)) {
    const file = path.join(inputs, spec.from);
    const base = sharp(file).rotate();
    const info = await base.metadata();
    let pipeline = base;
    let w = info.width, h = info.height;
    if (spec.crop) {
      const left = Math.round(info.width * spec.crop.left), top = Math.round(info.height * spec.crop.top);
      w = Math.round(info.width * spec.crop.width); h = Math.round(info.height * spec.crop.height);
      pipeline = base.extract({ left, top, width: w, height: h });
    }
    const widths = spec.widths.filter((x) => x <= w);
    for (const width of widths) {
      await pipeline.clone().resize({ width }).webp({ quality: 78 }).toFile(path.join(dir, `${name}-${width}.webp`));
    }
    meta[name] = { widths, width: w, height: h };
  }
  // Open Graph card from the stage photograph.
  await sharp(path.join(inputs, PHOTOS['stage-speaking'].from)).resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' }).jpeg({ quality: 82 }).toFile(path.join(dir, 'og.jpg'));
  return meta;
}

function srcset(meta, name) {
  return meta[name].widths.map((w) => `images/${name}-${w}.webp ${w}w`).join(', ');
}

// oklch -> sRGB (0..255), enough for recolouring logo masks into the page's inks.
function oklchToRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.6373624490 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
  return lin.map((v) => { const c = Math.min(1, Math.max(0, v)); const g = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; return Math.round(g * 255); });
}
const INKS = { ink: oklchToRgb(0.33, 0.048, 150), muted: oklchToRgb(0.46, 0.034, 142) };

// Logos: every client and employer mark becomes a monochrome PNG in the page's ink
// (the files are white-on-transparent, dark-on-transparent and full-colour; only their alpha is kept).
// 'alpha': the mark is whatever is opaque (white-on-transparent and dark-on-transparent files).
// 'dark': the mark is whatever is not white, for files drawn on an opaque white tile.
// forbes.svg in the inputs embeds an unrelated bitmap, so Forbes is shown with the Forbes Georgia mark.
const LOGOS = { 'forbes-georgia': 'alpha', 'bank-of-georgia': 'dark', rex: 'alpha', 'tbilisi-holding-company': 'alpha', 'arte-development': 'alpha', theneo: 'alpha', 'atlas-metrics': 'alpha', boxlock: 'alpha', halocarbon: 'alpha', 'fore-hadley': 'alpha', conceptdigital: 'alpha', mckinsey: 'alpha', 'bbc-iplayer': 'alpha', 'university-of-cambridge': 'dark' };
async function buildLogos() {
  const dir = path.join(out, 'logos');
  await mkdir(dir, { recursive: true });
  const files = await readdir(path.join(inputs, 'logos'));
  const meta = {};
  for (const [name, mode] of Object.entries(LOGOS)) {
    const f = files.find((x) => x.startsWith(name + '.'));
    if (!f) throw new Error(`logo missing: ${name}`);
    const file = path.join(inputs, 'logos', f);
    const isSvg = f.endsWith('.svg');
    const { data, info } = await sharp(file, isSvg ? { density: 600 } : {}).resize({ height: 160, fit: 'inside', withoutEnlargement: !isSvg }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (const [tone, rgb] of Object.entries(INKS)) {
      const px = Buffer.alloc(info.width * info.height * 4);
      for (let i = 0; i < info.width * info.height; i++) {
        const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
        let cover = a;
        if (mode === 'dark') { const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; cover = Math.round(a * Math.min(1, Math.max(0, (1 - lum) * 1.5))); }
        px[i * 4] = rgb[0]; px[i * 4 + 1] = rgb[1]; px[i * 4 + 2] = rgb[2]; px[i * 4 + 3] = cover;
      }
      await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(path.join(dir, `${name}${tone === 'ink' ? '' : '-' + tone}.png`));
    }
    meta[name] = { width: info.width, height: info.height };
  }
  return meta;
}

async function copyFonts() {
  const dir = path.join(out, 'fonts');
  await mkdir(dir, { recursive: true });
  const fonts = [
    '@fontsource/vollkorn/files/vollkorn-latin-600-normal.woff2',
    '@fontsource/hanken-grotesk/files/hanken-grotesk-latin-400-normal.woff2',
    '@fontsource/hanken-grotesk/files/hanken-grotesk-latin-500-normal.woff2',
    '@fontsource/newsreader/files/newsreader-latin-400-normal.woff2',
  ];
  for (const f of fonts) await copyFile(path.join(root, 'node_modules', f), path.join(dir, path.basename(f)));
}

async function main() {
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  const data = YAML.parse(await readFile(whereaboutsPath, 'utf8'));
  const [meta, logos] = await Promise.all([buildPhotos(), buildLogos(), copyFonts()]);

  let html = await readFile(path.join(src, 'index.html'), 'utf8');
  const fills = {
    TRACKER: renderTracker(data),
    TRACKER_UPDATED: longDate(data.updated),
    NOW_CITY: esc(isTbc(data.now?.city) ? data.base : data.now.city),
    BASE_CITY: esc(data.base || ''),
    YEAR: String(new Date().getFullYear()),
  };
  for (const [name] of Object.entries(PHOTOS)) {
    const key = name.toUpperCase().replace(/-/g, '_');
    fills[`SRCSET_${key}`] = srcset(meta, name);
    fills[`W_${key}`] = String(meta[name].width);
    fills[`H_${key}`] = String(meta[name].height);
  }
  for (const [name, m] of Object.entries(logos)) {
    const key = name.toUpperCase().replace(/-/g, '_');
    // displayed at 40px tall (26px for the career marks); the file is 160px tall for sharp screens
    fills[`LOGO_${key}`] = `src="logos/${name}.png" width="${m.width}" height="${m.height}"`;
    fills[`LOGOM_${key}`] = `src="logos/${name}-muted.png" width="${m.width}" height="${m.height}"`;
  }
  html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in fills ? fills[k] : m));
  const left = html.match(/\{\{\w+\}\}/g);
  if (left) throw new Error(`unfilled placeholders: ${left.join(', ')}`);
  await writeFile(path.join(out, 'index.html'), html);

  for (const f of ['styles.css', 'tokens.css', 'base.css', 'main.js']) await copyFile(path.join(src, f), path.join(out, f));
  console.log(`built out/ from ${path.relative(root, whereaboutsPath)} (now: ${fills.NOW_CITY})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
