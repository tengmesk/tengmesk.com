#!/usr/bin/env node
/**
 * Screenshots + checks for the journal and the acceptance list (SITE-PLAN §11).
 *
 *   npm run build && node scripts/shots.mjs [outDir]
 *
 * Serves dist/ on a local port, screenshots every page at 1440×900 and
 * 390×844 (full page, reveals triggered), and checks: console errors, no
 * horizontal scroll at 390 px, reduced-motion renders the static SVG,
 * mobile menu opens/closes with the keyboard and returns focus, and no "tbc"
 * text in the DOM. Exit code 1 on any failure.
 */
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import sharp from 'sharp';

const pw = await import('playwright').catch(() => import('/opt/node22/lib/node_modules/playwright/index.js'));
const chromium = (pw.default ?? pw).chromium;

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const out = resolve(root, process.argv[2] || 'docs/journey/assets/v2.0');
mkdirSync(out, { recursive: true });

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = join(dist, p);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(readFileSync(join(dist, '404.html')));
    return;
  }
  res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const pages = [
  ['home-en', '/'],
  ['home-ka', '/ka/'],
  ['about-en', '/about/'],
  ['about-ka', '/ka/about/'],
  ['404', '/does-not-exist/'],
];
const viewports = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
];
const failures = [];
const note = (ok, msg) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
  if (!ok) failures.push(msg);
};

const browser = await chromium.launch();

/** Full-page PNGs run to megabytes; a palette PNG keeps each under ~500 KB. */
async function shot(page, file, opts = {}) {
  const buf = await page.screenshot(opts);
  await sharp(buf).png({ palette: true, quality: 85, compressionLevel: 9 }).toFile(file);
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  // Walk the page so IntersectionObserver reveals fire, then return to top.
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 400) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}

for (const [name, path] of pages) {
  for (const [vp, viewport] of viewports) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    // Pretend to be a capable device so the contour island's core-count
    // fallback (hardwareConcurrency ≤ 4) does not hide it on small CI boxes.
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setHardwareConcurrencyOverride', { hardwareConcurrency: 8 }).catch(() => {});
    const errors = [];
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      if (name === '404' && /404/.test(m.text())) return; // the page's own status
      errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await settle(page);
    const file = join(out, `${name}-${vp}.png`);
    await shot(page, file, { fullPage: true });
    note(errors.length === 0, `${name} ${vp}: console clean${errors.length ? ' — ' + errors.join(' | ') : ''}`);
    const tbc = await page.evaluate(() => /\btbc\b/i.test(document.body.innerText));
    note(!tbc, `${name} ${vp}: no "tbc" text`);
    if (vp === 'mobile') {
      const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      note(sw[0] <= sw[1], `${name} mobile: no horizontal scroll (${sw[0]} ≤ ${sw[1]})`);
    }
    if (name.startsWith('home') && vp === 'desktop') {
      await page.waitForTimeout(400);
      const r = await page.evaluate(() => ({ live: document.getElementById('hero')?.classList.contains('is-live'), ms: document.getElementById('hero')?.dataset.contourMs }));
      note(r.live === true, `${name} desktop: contour canvas is live (island mounted, first frames avg ${r.ms ?? '?'} ms)`);
      await shot(page, join(out, `${name}-desktop-hero-live.png`), { clip: { x: 0, y: 0, width: 1440, height: 900 } });
    }
    await ctx.close();
  }
}

// KA nav must fit between the breakpoint and the container width.
for (const width of [900, 1024, 1180]) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(base + '/ka/', { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => {
    const n = document.querySelector('.nav__in');
    const links = document.querySelector('.nav__links');
    return { fits: n.scrollWidth <= n.clientWidth && links.getBoundingClientRect().right <= innerWidth, w: n.scrollWidth, c: n.clientWidth };
  });
  note(r.fits, `home-ka nav fits at ${width}px (${r.w} ≤ ${r.c})`);
  await ctx.close();
}

// Reduced motion: static SVG, canvas hidden, no is-live, reveals visible.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => ({
    live: document.getElementById('hero').classList.contains('is-live'),
    canvas: getComputedStyle(document.querySelector('.hero__canvas')).display,
    svg: !!document.querySelector('.hero__svg'),
    js: document.documentElement.classList.contains('js'),
    hiddenReveals: [...document.querySelectorAll('[data-reveal]')].filter((el) => getComputedStyle(el).opacity !== '1').length,
  }));
  note(!r.live && r.canvas === 'none' && r.svg, `reduced motion: static SVG shown, canvas off (live=${r.live}, canvas=${r.canvas})`);
  note(!r.js && r.hiddenReveals === 0, `reduced motion: no reveal hiding (${r.hiddenReveals} hidden)`);
  await shot(page, join(out, 'home-en-reduced-motion.png'));
  await ctx.close();
}

// Mobile menu via keyboard: Enter opens, Escape closes, focus returns to the burger.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.focus('#burger');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(150);
  const open = await page.evaluate(() => document.getElementById('menu').open && document.getElementById('burger').getAttribute('aria-expanded') === 'true');
  note(open, 'mobile menu: Enter on burger opens the dialog');
  await shot(page, join(out, 'home-en-mobile-menu.png'));
  await page.keyboard.press('Tab');
  const inside = await page.evaluate(() => document.getElementById('menu').contains(document.activeElement));
  note(inside, 'mobile menu: Tab keeps focus inside the dialog');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  const closed = await page.evaluate(() => !document.getElementById('menu').open && document.activeElement?.id === 'burger');
  note(closed, 'mobile menu: Escape closes and returns focus to the burger');
  await ctx.close();
}

await browser.close();
server.close();
console.log(`\nscreenshots in ${out}`);
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
