// Screenshots + checks for the built site in out/.
// Usage: node scripts/screenshots.mjs  (serves out/ on a random port, writes screenshots/, prints checks)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';

const { chromium } = pw;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
const SHOTS = path.join(ROOT, 'screenshots');
fs.mkdirSync(SHOTS, { recursive: true });

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(OUT, p);
  if (!file.startsWith(OUT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch();
const results = { console: [], failedRequests: [] };

async function page(opts) {
  const ctx = await browser.newContext({ viewport: opts.viewport, deviceScaleFactor: 1, reducedMotion: opts.reducedMotion || 'no-preference', hasTouch: !!opts.touch, isMobile: !!opts.touch });
  const pg = await ctx.newPage();
  pg.on('console', (m) => { if (['error', 'warning'].includes(m.type())) results.console.push(`[${opts.name}] ${m.type()}: ${m.text()}`); });
  pg.on('pageerror', (e) => results.console.push(`[${opts.name}] pageerror: ${e.message}`));
  pg.on('requestfailed', (r) => results.failedRequests.push(`[${opts.name}] ${r.url()} ${r.failure()?.errorText}`));
  pg.on('response', (r) => { if (r.status() >= 400) results.failedRequests.push(`[${opts.name}] ${r.status()} ${r.url()}`); });
  await pg.goto(base, { waitUntil: 'networkidle' });
  return { ctx, pg };
}

async function scrollThrough(pg) {
  await pg.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
}

// Desktop
{
  const { ctx, pg } = await page({ name: 'desktop', viewport: { width: 1440, height: 900 } });
  await pg.waitForTimeout(600);
  await pg.screenshot({ path: path.join(SHOTS, 'desktop-hero.png') });
  await scrollThrough(pg);
  await pg.screenshot({ path: path.join(SHOTS, 'desktop-full.png'), fullPage: true });
  // tracker: hover + keyboard
  const hover = await pg.evaluate(async () => {
    const root = document.querySelector('.hero__tracker [data-tracker]');
    const btn = root.querySelector('.tracker__btn');
    const before = btn.getAttribute('aria-expanded');
    btn.focus();
    await new Promise((r) => setTimeout(r, 50));
    const afterFocus = btn.getAttribute('aria-expanded');
    const popVisible = getComputedStyle(root.querySelector('.tracker__pop')).visibility;
    return { before, afterFocus, popVisible, text: root.querySelector('.tracker__pop').textContent.replace(/\s+/g, ' ').trim() };
  });
  results.trackerKeyboard = hover;
  await pg.keyboard.press('Escape');
  results.trackerEscape = await pg.evaluate(() => document.querySelector('.hero__tracker .tracker__btn').getAttribute('aria-expanded'));
  await pg.hover('.hero__tracker .tracker__btn');
  await pg.waitForTimeout(300);
  results.trackerHover = await pg.evaluate(() => document.querySelector('.hero__tracker .tracker__btn').getAttribute('aria-expanded'));
  await pg.screenshot({ path: path.join(SHOTS, 'desktop-tracker-open.png'), clip: { x: 0, y: 0, width: 900, height: 820 } });
  results.h1Count = await pg.evaluate(() => document.querySelectorAll('h1').length);
  results.landmarks = await pg.evaluate(() => ['header', 'nav', 'main', 'footer'].map((t) => `${t}:${document.querySelectorAll(t).length}`).join(' '));
  results.imgsWithoutAlt = await pg.evaluate(() => [...document.images].filter((i) => !i.hasAttribute('alt')).length);
  results.lcp = await pg.evaluate(() => new Promise((resolve) => {
    let v = null; const po = new PerformanceObserver((l) => { for (const e of l.getEntries()) v = e.startTime; });
    po.observe({ type: 'largest-contentful-paint', buffered: true });
    setTimeout(() => { po.disconnect(); resolve(v); }, 500);
  }));
  await ctx.close();
}

// Mobile (touch)
{
  const { ctx, pg } = await page({ name: 'mobile', viewport: { width: 390, height: 844 }, touch: true });
  await pg.waitForTimeout(400);
  results.mobileOverflow = await pg.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const offenders = [...document.querySelectorAll('body *')].filter((el) => { if (el.closest('svg')) return false; const r = el.getBoundingClientRect(); return r.right > docW + 1 && r.width > 0 && getComputedStyle(el).position !== 'fixed'; }).slice(0, 8).map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(el.getBoundingClientRect().right)}`);
    return { docW, scrollWidth: sw, offenders };
  });
  await scrollThrough(pg);
  await pg.screenshot({ path: path.join(SHOTS, 'mobile-full.png'), fullPage: true });
  // tap toggles tracker
  await pg.tap('.hero__tracker .tracker__btn');
  await pg.waitForTimeout(300);
  results.trackerTapOpen = await pg.evaluate(() => document.querySelector('.hero__tracker .tracker__btn').getAttribute('aria-expanded'));
  await pg.tap('.hero__tracker .tracker__btn');
  await pg.waitForTimeout(300);
  results.trackerTapClose = await pg.evaluate(() => document.querySelector('.hero__tracker .tracker__btn').getAttribute('aria-expanded'));
  // menu
  await pg.tap('[data-menu-toggle]');
  await pg.waitForTimeout(200);
  results.menuOpen = await pg.evaluate(() => document.body.classList.contains('menu-open'));
  await pg.screenshot({ path: path.join(SHOTS, 'mobile-menu.png') });
  await ctx.close();
}

// Reduced motion
{
  const { ctx, pg } = await page({ name: 'reduced', viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await pg.waitForTimeout(300);
  results.reducedMotion = await pg.evaluate(() => ({
    allRevealsVisible: [...document.querySelectorAll('.reveal')].every((el) => getComputedStyle(el).opacity === '1'),
    marqueeAnimated: document.querySelector('[data-marquee]').classList.contains('is-animated'),
    marqueeAnimName: getComputedStyle(document.querySelector('[data-marquee-list]')).animationName,
    pingDisplay: getComputedStyle(document.querySelector('.tracker__dot'), '::after').display,
  }));
  await ctx.close();
}

await browser.close();
server.close();
console.log(JSON.stringify(results, null, 2));
