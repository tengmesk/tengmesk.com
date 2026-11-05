// Screenshots and checks with Playwright (node shots.mjs [url]).
// Writes screenshots/desktop-hero.png (1440x900), desktop-full.png, mobile-full.png (390 wide)
// and reports console errors, horizontal overflow at 390 and the reduced-motion render.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pw;
const root = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:4173/';
const dir = path.join(root, 'screenshots');
await mkdir(dir, { recursive: true });

const browser = await chromium.launch();
const errors = [];
async function page(viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, ...opts });
  const p = await ctx.newPage();
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${viewport.width}px ${m.type()}: ${m.text()}`); });
  p.on('pageerror', (e) => errors.push(`${viewport.width}px pageerror: ${e.message}`));
  p.on('requestfailed', (r) => errors.push(`${viewport.width}px requestfailed: ${r.url()}`));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  // Scroll through the page so lazy-loaded images are in the full-page capture, then return to the top.
  await p.evaluate(async () => {
    const step = Math.max(400, window.innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(400);
  return { ctx, p };
}

{
  const { ctx, p } = await page({ width: 1440, height: 900 });
  await p.screenshot({ path: path.join(dir, 'desktop-hero.png') });
  await p.screenshot({ path: path.join(dir, 'desktop-full.png'), fullPage: true });
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  console.log(`desktop page height: ${h}px`);
  await ctx.close();
}
{
  const { ctx, p } = await page({ width: 390, height: 844 }, { isMobile: true, hasTouch: true });
  await p.screenshot({ path: path.join(dir, 'mobile-full.png'), fullPage: true });
  const over = await p.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const wide = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.right > docW + 1 || r.left < -1) wide.push(`${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''} ${Math.round(r.left)}..${Math.round(r.right)}`);
    }
    return { scrollW: document.documentElement.scrollWidth, docW, wide: wide.slice(0, 12) };
  });
  console.log(`390px scrollWidth ${over.scrollW} vs client ${over.docW}; elements past the edge: ${over.wide.length ? over.wide.join(' | ') : 'none'}`);
  // Tap the city tracker: it must reveal on touch.
  await p.tap('[data-tracker] button');
  await p.waitForTimeout(500);
  const revealed = await p.evaluate(() => {
    const el = document.querySelector('.tracker__next');
    const cs = getComputedStyle(el);
    return cs.visibility === 'visible' && Number(cs.opacity) > 0.9 && document.querySelector('[data-tracker] button').getAttribute('aria-expanded') === 'true';
  });
  console.log(`tracker reveals on tap: ${revealed}`);
  await p.screenshot({ path: path.join(dir, 'mobile-tracker-open.png') });
  await ctx.close();
}
{
  const { ctx, p } = await page({ width: 1280, height: 800 }, { reducedMotion: 'reduce' });
  const vis = await p.evaluate(() => {
    const h1 = document.querySelector('h1').getBoundingClientRect();
    const cta = document.querySelector('.hero .btn--primary').getBoundingClientRect();
    const lede = document.querySelector('.hero .lead').getBoundingClientRect();
    const anim = [...document.querySelectorAll('*')].filter((el) => { const cs = getComputedStyle(el); return cs.animationName !== 'none' && cs.animationDuration !== '0.01ms' && cs.animationDuration !== '0s'; }).length;
    return { h1: h1.bottom <= 800, lede: lede.bottom <= 800, cta: cta.bottom <= 800, runningAnimations: anim };
  });
  console.log(`1280x800 fold (reduced motion): h1 ${vis.h1}, lede ${vis.lede}, primary action ${vis.cta}; running animations: ${vis.runningAnimations}`);
  await p.screenshot({ path: path.join(dir, 'fold-1280-reduced-motion.png') });
  // Keyboard: Tab from the top must reach the tracker and reveal it on focus.
  await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
  const focusReveal = await p.evaluate(() => ({ focused: document.activeElement?.className, visible: getComputedStyle(document.querySelector('.tracker__next')).visibility }));
  console.log(`keyboard focus reveal: ${JSON.stringify(focusReveal)}`);
  await ctx.close();
}
{
  const { ctx, p } = await page({ width: 1920, height: 1080 });
  await p.screenshot({ path: path.join(dir, 'desktop-1920-hero.png') });
  await ctx.close();
}
await browser.close();
console.log(errors.length ? `console/network problems:\n${errors.join('\n')}` : 'console: clean (no errors, warnings or failed requests)');
