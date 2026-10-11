#!/usr/bin/env node
/**
 * Stage the content repository for a build (runs before `astro build`).
 *
 *   npm run sync             # copy demos + make missing thumbnails
 *   npm run sync -- --force  # re-screenshot everything
 *
 * Reads only manifest.json (docs/CONSUMERS.md) and stages, for every entry
 * with publish == "true":
 *
 *   demos/<slug>/index.html  →  public/demo/<slug>/index.html   (as-is)
 *   thumbnail or screenshot  →  public/demo/<slug>/thumb.png     1200×750, also the OG image
 *                               public/demo/<slug>/thumb.webp    1200 w, card image
 *                               public/demo/<slug>/thumb-640.webp
 *   (v2 sites)               →  public/sites/<slug>.png / .webp / -640.webp
 *
 * Thumbnails: a `thumbnail` path from the manifest is used when present;
 * otherwise the demo is screenshotted with Playwright. When Playwright
 * cannot launch, a neutral placeholder is drawn so no card ever ships
 * without an image (the build then warns). Anything under public/demo/ and
 * public/sites/ that is not published is deleted, so a "review" or "false"
 * entry can never linger from an earlier run.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { ensureInspoDir } from './fetch-inspo.mjs';
import { INSPIRATION_DIR } from './lib/inspo-dir.mjs';

const force = process.argv.includes('--force');
const inspo = ensureInspoDir();
const manifest = JSON.parse(readFileSync(join(inspo, 'manifest.json'), 'utf8'));
const published = manifest.entries.filter((e) => e.publish === 'true');

const PUBLIC = resolve(INSPIRATION_DIR, 'public');
const DEMO_DIR = join(PUBLIC, 'demo');
const SITES_DIR = join(PUBLIC, 'sites');
mkdirSync(DEMO_DIR, { recursive: true });
mkdirSync(SITES_DIR, { recursive: true });

const W = 1200;
const H = 750;
const newer = (a, b) => existsSync(a) && existsSync(b) && statSync(a).mtimeMs >= statSync(b).mtimeMs;

/** Derived sizes next to a 1200×750 PNG. */
async function derive(png, base) {
  await sharp(png).webp({ quality: 82 }).toFile(`${base}.webp`);
  await sharp(png).resize(640).webp({ quality: 80 }).toFile(`${base}-640.webp`);
}

/** Neutral placeholder: paper, an amber mark, the title in the display face. */
async function placeholder(pngPath, title, sub) {
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#fafaf8"/>
  <g fill="none" stroke="#e4e3df" stroke-width="2">${Array.from({ length: 11 }, (_, i) => `<line x1="${i * 120}" y1="0" x2="${i * 120}" y2="${H}"/>`).join('')}
  ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 125}" x2="${W}" y2="${i * 125}"/>`).join('')}</g>
  <circle cx="110" cy="110" r="22" fill="#e2902a"/>
  <text x="100" y="420" font-family="Georgia, 'Times New Roman', serif" font-size="72" fill="#121316">${esc(title).slice(0, 34)}</text>
  <text x="104" y="480" font-family="Menlo, 'DejaVu Sans Mono', monospace" font-size="22" letter-spacing="3" fill="#9a5a0c">${esc(sub.toUpperCase())}</text>
</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(pngPath);
}

let browserPromise;
async function browser() {
  if (!browserPromise) {
    browserPromise = (async () => {
      const pw = await import('playwright').catch(() => import('/opt/node22/lib/node_modules/playwright/index.js'));
      return (pw.default ?? pw).chromium.launch();
    })();
  }
  return browserPromise;
}

/** Screenshot a self-contained demo at 1440×900 and fit it to 1200×750. */
async function screenshot(htmlFile, pngPath) {
  const b = await browser();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  // A scroll-driven demo often opens on a spacer that says "scroll"; walk
  // ~0.9 viewports in so pinned scenes have engaged, then let it settle.
  const tall = await page.evaluate(() => document.documentElement.scrollHeight > innerHeight * 2);
  if (tall) {
    await page.evaluate(() => scrollTo(0, innerHeight * 0.9));
    await page.waitForTimeout(900);
  }
  const buf = await page.screenshot({ type: 'png' });
  await ctx.close();
  await sharp(buf).resize(W, H, { fit: 'cover', position: 'top' }).png({ compressionLevel: 9 }).toFile(pngPath);
}

const warnings = [];
const keep = { demo: new Set(), sites: new Set() };

for (const e of published) {
  const isSite = e.section === 'sites';
  if (e.kind === 'recreation') {
    const src = join(inspo, e.demo);
    if (!existsSync(src)) throw new Error(`sync: ${e.slug}: demo file missing (${e.demo})`);
    const dir = join(DEMO_DIR, e.slug);
    mkdirSync(dir, { recursive: true });
    const dest = join(dir, 'index.html');
    copyFileSync(src, dest);
    keep.demo.add(e.slug);
    const png = join(dir, 'thumb.png');
    const fresh = !force && newer(png, src) && existsSync(`${dir}/thumb.webp`) && existsSync(`${dir}/thumb-640.webp`);
    if (fresh) continue;
    if (e.thumbnail) {
      const t = join(inspo, e.thumbnail);
      if (!existsSync(t)) throw new Error(`sync: ${e.slug}: thumbnail missing (${e.thumbnail})`);
      await sharp(t).resize(W, H, { fit: 'cover', position: 'top' }).png().toFile(png);
      console.log(`sync: ${e.slug}: thumbnail from manifest`);
    } else {
      try {
        await screenshot(dest, png);
        console.log(`sync: ${e.slug}: screenshot`);
      } catch (err) {
        warnings.push(`${e.slug}: Playwright screenshot failed (${String(err.message || err).split('\n')[0]}); placeholder used`);
        await placeholder(png, e.title, `Recreated from ${e.source_name}`);
      }
    }
    await derive(png, join(dir, 'thumb'));
  } else if (isSite) {
    // Proposed v2: external entries in the Sites section carry a thumbnail path.
    keep.sites.add(e.slug);
    const png = join(SITES_DIR, `${e.slug}.png`);
    const src = e.thumbnail ? join(inspo, e.thumbnail) : null;
    if (!force && src && newer(png, src) && existsSync(join(SITES_DIR, `${e.slug}.webp`))) continue;
    if (!force && !src && existsSync(png) && existsSync(join(SITES_DIR, `${e.slug}.webp`))) continue;
    if (src) {
      if (!existsSync(src)) throw new Error(`sync: ${e.slug}: thumbnail missing (${e.thumbnail})`);
      await sharp(src).resize(W, H, { fit: 'cover', position: 'top' }).png().toFile(png);
    } else {
      warnings.push(`${e.slug}: site entry has no thumbnail; placeholder used`);
      await placeholder(png, e.title, e.site_category || 'site');
    }
    await derive(png, join(SITES_DIR, e.slug));
  }
}

// Prune anything not published any more.
for (const name of readdirSync(DEMO_DIR)) {
  if (!keep.demo.has(name)) {
    rmSync(join(DEMO_DIR, name), { recursive: true, force: true });
    console.log(`sync: pruned demo/${name}`);
  }
}
for (const name of readdirSync(SITES_DIR)) {
  const slug = name.replace(/(-640)?\.(png|webp)$/, '');
  if (!keep.sites.has(slug)) rmSync(join(SITES_DIR, name), { force: true });
}
if (browserPromise) (await browserPromise).close();
console.log(`sync: ${keep.demo.size} demo(s), ${keep.sites.size} site image(s) from ${inspo}`);
for (const w of warnings) console.warn(`sync: warning: ${w}`);
