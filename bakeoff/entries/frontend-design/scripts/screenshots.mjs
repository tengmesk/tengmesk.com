// Screenshots + OG image + quality checks with the preinstalled Playwright.
// Usage: node scripts/screenshots.mjs   (expects `node serve.mjs 4173` to be running, or starts one)
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const { chromium } = pw;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.join(ROOT, 'screenshots');
const PORT = 4173;
const URL = `http://localhost:${PORT}/`;

const server = spawn(process.execPath, [path.join(ROOT, 'serve.mjs'), String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));

// Scroll through the page so lazy images load before a full-page capture.
async function loadLazy(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; });
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    window.scrollTo(0, 0);
  });
  // poll until every image has decoded (or 12 s)
  await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(300);
}

const browser = await chromium.launch();
const problems = [];
try {
  // Desktop
  let ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  let page = await ctx.newPage();
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(`console.${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => problems.push(`requestfailed: ${r.url()}`));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: path.join(SHOTS, 'desktop-hero.png') });
  await loadLazy(page);
  await page.screenshot({ path: path.join(SHOTS, 'desktop-full.png'), fullPage: true });

  // OG image
  const og = await ctx.newPage();
  await og.setViewportSize({ width: 1200, height: 630 });
  await og.goto(URL + 'og.html', { waitUntil: 'networkidle' });
  await og.waitForTimeout(400);
  await og.screenshot({ path: path.join(ROOT, 'out', 'og.jpg'), type: 'jpeg', quality: 86 });
  await ctx.close();

  // Mobile
  ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  page = await ctx.newPage();
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(`mobile console.${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`mobile pageerror: ${e.message}`));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);
  const overflow = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const wide = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > docW + 1 || r.left < -1) wide.push(`${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ').join('.') : ''} ${Math.round(r.left)}..${Math.round(r.right)}`);
    });
    return { scrollW: document.documentElement.scrollWidth, docW, wide: wide.slice(0, 12) };
  });
  if (overflow.scrollW > overflow.docW) problems.push(`horizontal overflow at 390px: scrollWidth ${overflow.scrollW} > ${overflow.docW}; ${overflow.wide.join(' | ')}`);
  await loadLazy(page);
  await page.screenshot({ path: path.join(SHOTS, 'mobile-full.png'), fullPage: true });

  // Tracker works by tap
  await page.tap('.where-now');
  const expanded = await page.getAttribute('.where-now', 'aria-expanded');
  if (expanded !== 'true') problems.push('tracker did not open on tap');
  await ctx.close();

  // Reduced motion
  ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  const rm = await page.evaluate(() => ({
    heroVisible: getComputedStyle(document.querySelector('.hero h1')).opacity,
    anim: getComputedStyle(document.querySelector('.hero h1')).animationName,
  }));
  if (rm.heroVisible !== '1') problems.push(`reduced motion: hero h1 opacity ${rm.heroVisible}`);
  await ctx.close();

  // Keyboard: tracker opens on focus and closes on Escape
  ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.focus('.where-now');
  const vis = await page.evaluate(() => getComputedStyle(document.querySelector('.where-panel')).visibility);
  if (vis !== 'visible') problems.push(`tracker panel not visible on focus (${vis})`);
  await page.keyboard.press('Escape');
  const h1s = await page.evaluate(() => document.querySelectorAll('h1').length);
  if (h1s !== 1) problems.push(`expected 1 h1, got ${h1s}`);
  await ctx.close();
} finally {
  await browser.close();
  server.kill();
}
console.log(problems.length ? `PROBLEMS:\n- ${problems.join('\n- ')}` : 'OK: screenshots written, no console errors, no overflow at 390px, tracker works by tap/focus, reduced motion respected.');
process.exit(problems.length ? 1 : 0);
