// Prepares every runtime asset into out/assets: the headshot cut-out, resized photos,
// an OG image, logos and self-hosted fonts. Run once (or whenever inputs change):
//   node scripts/prepare-assets.mjs
import sharp from 'sharp';
import { mkdir, copyFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INPUTS = process.env.INPUTS || path.resolve(ROOT, '../../inputs');
const OUT = path.join(ROOT, 'out', 'assets');
await mkdir(path.join(OUT, 'img'), { recursive: true });
await mkdir(path.join(OUT, 'logos'), { recursive: true });
await mkdir(path.join(OUT, 'fonts'), { recursive: true });

// ---------- 1. Headshot cut-out (seamless light-grey studio background → alpha) ----------
async function cutout(src, dest) {
  const img = sharp(src).rotate();
  const meta = await img.metadata();
  const W = meta.width, H = meta.height;
  const { data } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const N = W * H;
  const LUM = 202;
  // score ≥ 1: certainly background (bright, neutral, slightly cool); ≤ 0: certainly subject
  const score = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    score[i] = Math.min((lum - LUM) / 7, (26 - (mx - mn)) / 8, (b - r + 6) / 6);
  }
  // flood fill from the frame edges plus confident seeds (enclosed pockets, e.g. inside an elbow)
  const mask = new Uint8Array(N); const q = new Int32Array(N); let qh = 0, qt = 0;
  const push = (i) => { if (!mask[i] && score[i] > 0.5) { mask[i] = 1; q[qt++] = i; } };
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
  const grow = () => { while (qh < qt) { const i = q[qh++]; const x = i % W, y = (i - x) / W; if (x > 0) push(i - 1); if (x < W - 1) push(i + 1); if (y > 0) push(i - W); if (y < H - 1) push(i + W); } };
  grow();
  // enclosed pockets of background (e.g. inside an elbow): connected components of background-like
  // pixels that the edge fill could not reach. Keep only large, confident ones so bright fabric specks stay.
  const seen = new Uint8Array(N); const comp = new Int32Array(N);
  for (let s = 0; s < N; s++) {
    if (mask[s] || seen[s] || score[s] <= 0.5) continue;
    let ch = 0, ct = 0, sum = 0; comp[ct++] = s; seen[s] = 1;
    while (ch < ct) { const i = comp[ch++]; sum += score[i]; const x = i % W, y = (i - x) / W;
      for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) if (j >= 0 && !seen[j] && !mask[j] && score[j] > 0.5) { seen[j] = 1; comp[ct++] = j; } }
    if (ct >= 1500 && sum / ct >= 1.0) { for (let k = 0; k < ct; k++) push(comp[k]); grow(); }
  }
  const a0 = new Float32Array(N); for (let i = 0; i < N; i++) a0[i] = mask[i] ? 0 : 1;
  const a1 = Float32Array.from(a0);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const i = y * W + x;
    if (a0[i] === 1 && (a0[i - 1] === 0 || a0[i + 1] === 0 || a0[i - W] === 0 || a0[i + W] === 0 || a0[i - W - 1] === 0 || a0[i - W + 1] === 0 || a0[i + W - 1] === 0 || a0[i + W + 1] === 0)) a1[i] = Math.max(0, Math.min(1, 1 - score[i]));
  }
  const a2 = Float32Array.from(a1);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; let s = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) s += a1[i + dy * W + dx]; a2[i] = s / 9; }
  const rgba = Buffer.alloc(N * 4);
  for (let i = 0; i < N; i++) { rgba[i * 4] = data[i * 3]; rgba[i * 4 + 1] = data[i * 3 + 1]; rgba[i * 4 + 2] = data[i * 3 + 2]; rgba[i * 4 + 3] = Math.round(a2[i] * 255); }
  // drop the top 40 rows (a stray dark fleck sits on the frame edge), then trim transparent margins
  const cropped = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).extract({ left: 0, top: 40, width: W, height: H - 40 }).png().toBuffer();
  const buf = await sharp(cropped).trim({ threshold: 8 }).png().toBuffer();
  const m = await sharp(buf).metadata();
  await sharp(buf).resize({ height: 1400, withoutEnlargement: true }).webp({ quality: 86, alphaQuality: 90 }).toFile(dest + '.webp');
  await sharp(buf).resize({ height: 800, withoutEnlargement: true }).webp({ quality: 84, alphaQuality: 90 }).toFile(dest + '-800.webp');
  console.log('cut-out', m.width, 'x', m.height);
}
await cutout(path.join(INPUTS, 'images/headshot/headshot-1129.jpg'), path.join(OUT, 'img', 'tengo-portrait'));

// ---------- 2. Photos ----------
const photos = [
  ['images/photos/panel-wide-moderating.webp', 'stage-panel', [1600, 900]],
  ['images/photos/speaking-sunglasses-mic.webp', 'stage-speaking', [1100, 700]],
  ['images/photos/audience-stamba-rooftop.webp', 'stage-audience', [1100, 700]],
  ['images/personal/dolomites.webp', 'about-dolomites', [1200, 800]],
  ['images/personal/zion-angels-landing.webp', 'about-zion', [900, 600]],
  ['images/personal/lagos-portugal-cliff.webp', 'about-lagos', [1200, 800]],
  ['images/personal/bloukrans-bridge-bungee.webp', 'about-bungee', [900, 600]],
];
for (const [src, name, widths] of photos) {
  for (const w of widths) {
    await sharp(path.join(INPUTS, src)).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(OUT, 'img', `${name}-${w}.webp`));
  }
}
// OG image 1200×630 from the speaking photo
await sharp(path.join(INPUTS, 'images/photos/speaking-sunglasses-mic.webp')).resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 82 }).toFile(path.join(OUT, 'img', 'og.jpg'));

// ---------- 3. Logos (verbatim) ----------
for (const f of await readdir(path.join(INPUTS, 'logos'))) {
  if (/\.(svg|png)$/.test(f)) await copyFile(path.join(INPUTS, 'logos', f), path.join(OUT, 'logos', f));
}
// The Cambridge PNG sits on an opaque near-white field; key it out so the logo can be recoloured like the others.
{
  const src = path.join(INPUTS, 'logos', 'university-of-cambridge.png');
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum > 215) data[i * 4 + 3] = Math.round(Math.max(0, (245 - lum) / 30) * data[i * 4 + 3]);
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).trim({ threshold: 10 }).png().toFile(path.join(OUT, 'logos', 'university-of-cambridge.png'));
}

// ---------- 4. Fonts (self-hosted from @fontsource) ----------
const fonts = [
  ['@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2', 'instrument-serif-400.woff2'],
  ['@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2', 'instrument-serif-400-italic.woff2'],
  ['@fontsource/inter/files/inter-latin-400-normal.woff2', 'inter-400.woff2'],
  ['@fontsource/inter/files/inter-latin-500-normal.woff2', 'inter-500.woff2'],
  ['@fontsource/inter/files/inter-latin-600-normal.woff2', 'inter-600.woff2'],
];
for (const [src, dest] of fonts) await copyFile(path.join(ROOT, 'node_modules', src), path.join(OUT, 'fonts', dest));

// favicon: a small inline SVG monogram
await writeFile(path.join(OUT, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0F2318"/><text x="32" y="44" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="38" fill="#F1ECE1">T</text></svg>`);
console.log('assets ready in', OUT, existsSync(OUT));
