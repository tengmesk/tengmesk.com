// Screenshot + QA (Node port of the MotionSites skill's scripts/shoot.py, using the preinstalled Playwright).
// Serves out/ on a local port, then writes:
//   screenshots/desktop-hero.png (1440×900), screenshots/desktop-full.png, screenshots/mobile-full.png (390),
//   screenshots/desktop-early.png (first paint at 350ms), screenshots/mobile-hero.png,
//   screenshots/tracker-open.png, screenshots/reduced-motion.png
// and prints a QA report: console errors, failed requests, overflow, fonts, broken images, h1.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pw;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
const SHOTS = path.join(ROOT, 'screenshots');
await mkdir(SHOTS, { recursive: true });
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml' };
const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  try {
    const body = await readFile(path.join(OUT, p));
    res.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('not found'); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;

const QA = () => {
  const vw = document.documentElement.clientWidth;
  const wide = [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.right > vw + 1 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 8).map((e) => e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className ? '.' + e.className.split(' ')[0] : ''));
  const imgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src.slice(-60));
  const fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, ''));
  const h1 = document.querySelector('h1');
  return { title: document.title, h1Count: document.querySelectorAll('h1').length, viewport: vw, scrollWidth: document.documentElement.scrollWidth, horizontalOverflow: document.documentElement.scrollWidth > vw + 1, overflowingElements: wide, pageHeight: document.documentElement.scrollHeight, brokenImages: imgs, fontsLoaded: [...new Set(fonts)], h1: h1 ? { text: h1.innerText.slice(0, 80), fontSize: getComputedStyle(h1).fontSize, font: getComputedStyle(h1).fontFamily.slice(0, 40) } : null };
};

const browser = await chromium.launch();
const report = {};
async function run(name, { width, height, mobile = false, reduced = false, full = false, early = false, after }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const errors = [], failed = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text().slice(0, 200)}`); });
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  page.on('requestfailed', (r) => failed.push(`${r.url().slice(-80)} (${r.failure()?.errorText})`));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.url().slice(-80)} (HTTP ${r.status()})`); });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  if (early) { await page.waitForTimeout(350); await page.screenshot({ path: path.join(SHOTS, 'desktop-early.png') }); }
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(2200);
  if (after) await after(page);
  await page.screenshot({ path: path.join(SHOTS, `${name}.png`), fullPage: full });
  const qa = await page.evaluate(QA);
  qa.consoleErrors = errors.slice(0, 10); qa.failedRequests = failed.slice(0, 10);
  report[name] = qa;
  await ctx.close();
}
await run('desktop-hero', { width: 1440, height: 900, early: true });
await run('desktop-full', { width: 1440, height: 900, full: true, after: async (p) => { // scroll through so reveals fire
  await p.evaluate(async () => { document.documentElement.style.scrollBehavior = 'auto'; for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo({ top: 0, behavior: 'instant' }); });
  await p.waitForTimeout(1500);
} });
await run('mobile-hero', { width: 390, height: 844, mobile: true });
await run('mobile-full', { width: 390, height: 844, mobile: true, full: true, after: async (p) => {
  await p.evaluate(async () => { document.documentElement.style.scrollBehavior = 'auto'; for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 100)); } window.scrollTo({ top: 0, behavior: 'instant' }); });
  await p.waitForTimeout(1500);
} });
await run('tracker-open', { width: 1440, height: 900, after: async (p) => { await p.keyboard.press('Tab'); await p.focus('.wb__btn'); await p.waitForTimeout(500); } });
await run('reduced-motion', { width: 1440, height: 900, reduced: true, after: async (p) => { await p.waitForTimeout(100); } });
await browser.close();
server.close();
console.log(JSON.stringify(report, null, 1));
console.log('\nScreenshots in', SHOTS, '- now LOOK at them and score against references/review.md');
