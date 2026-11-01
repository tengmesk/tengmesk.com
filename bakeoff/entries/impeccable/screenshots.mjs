// Captures the deliverable screenshots and runs the quality checks
// (console errors, horizontal overflow at 390px, tracker states, reduced motion).
// Usage: node screenshots.mjs [baseUrl]   (default http://127.0.0.1:8080)
import fs from 'node:fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const base = process.argv[2] || 'http://127.0.0.1:8080';
const outDir = 'screenshots';
const reviewDir = '.impeccable/review';
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(reviewDir, { recursive: true });

const browser = await chromium.launch();
const problems = [];

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  // walk the page so lazy images load, then wait for every image to decode
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    const h = document.documentElement.scrollHeight; const step = Math.max(300, window.innerHeight * 0.8);
    for (let y = 0; y < h; y += step) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
    window.scrollTo(0, h); await new Promise((r) => setTimeout(r, 200));
    window.scrollTo(0, 0);
    const timeout = new Promise((r) => setTimeout(r, 4000));
    await Promise.race([timeout, Promise.all([...document.images].map((img) => (img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; }))))]);
    document.documentElement.style.scrollBehavior = '';
  });
  // settle entrance motion: mark everything revealed and draw the route
  await page.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
    const r = document.querySelector('[data-route]'); if (r) r.style.setProperty('--drawn', '1');
  });
  await page.waitForTimeout(900);
}

async function capture(name, viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: opts.reducedMotion || 'no-preference', hasTouch: !!opts.touch, isMobile: !!opts.touch });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()));
  const external = [];
  page.on('request', (r) => { const u = new URL(r.url()); if (u.origin !== new URL(base).origin && !u.protocol.startsWith('data')) external.push(r.url()); });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await settle(page);
  if (opts.fullPage !== false) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
  } else {
    await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: false });
  }
  const overflow = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const wide = [];
    document.querySelectorAll('body *').forEach((el) => { const r = el.getBoundingClientRect(); if (r.right > docW + 1 && r.width > 0) wide.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '') + ' right=' + Math.round(r.right)); });
    return { scrollW: document.documentElement.scrollWidth, docW, wide: wide.slice(0, 8) };
  });
  const h1s = await page.locator('h1').count();
  console.log(`${name} ${viewport.width}x${viewport.height}: scrollWidth=${overflow.scrollW} clientWidth=${overflow.docW} h1=${h1s} errors=${errors.length} external=${external.length}`);
  if (overflow.scrollW > overflow.docW) problems.push(`${name}: horizontal overflow ${overflow.scrollW}>${overflow.docW} ${overflow.wide.join('; ')}`);
  if (errors.length) problems.push(`${name}: console ${errors.join(' | ')}`);
  if (external.length) problems.push(`${name}: external requests ${external.join(', ')}`);
  if (h1s !== 1) problems.push(`${name}: h1 count ${h1s}`);
  return { page, ctx };
}

// 1. desktop hero (viewport only)
{ const { ctx } = await capture('desktop-hero', { width: 1440, height: 900 }, { fullPage: false }); await ctx.close(); }
// 2. desktop full page
{ const { ctx } = await capture('desktop-full', { width: 1440, height: 900 }); await ctx.close(); }
// 3. mobile full page (touch)
{ const { page, ctx } = await capture('mobile-full', { width: 390, height: 844 }, { touch: true });
  // tap the tracker: should open and stay open
  const btn = page.locator('.post__now');
  await btn.tap();
  await page.waitForTimeout(600);
  const open = await page.locator('[data-tracker]').getAttribute('data-open');
  const vis = await page.locator('.post__finger').first().isVisible();
  console.log('mobile tap tracker: open=' + open + ' fingerVisible=' + vis);
  if (open !== 'true' || !vis) problems.push('mobile: tracker did not open on tap');
  await page.locator('[data-tracker]').screenshot({ path: `${reviewDir}/mobile-tracker-open.png` });
  await ctx.close(); }
// 4. keyboard: tab to the tracker button -> fingers visible via focus-within; hover on desktop
{ const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' }); await settle(page);
  await page.locator('.post__now').focus(); await page.waitForTimeout(500);
  const kv = await page.locator('.post__finger').first().isVisible();
  const kvis = await page.locator('.post__finger').first().evaluate((el) => getComputedStyle(el).visibility + '/' + getComputedStyle(el).opacity);
  console.log('keyboard focus tracker: fingerVisible=' + kv + ' ' + kvis);
  if (!kv) problems.push('desktop: tracker fingers not visible on keyboard focus');
  await page.locator('[data-tracker]').screenshot({ path: `${reviewDir}/desktop-tracker-focus.png` });
  await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab');
  await page.mouse.move(5, 5); await page.locator('h1').focus().catch(() => {}); await page.evaluate(() => document.activeElement.blur());
  await page.waitForTimeout(500);
  const closed = await page.locator('.post__finger').first().isVisible();
  console.log('after blur: fingerVisible=' + closed);
  await page.locator('.post__now').hover(); await page.waitForTimeout(500);
  const hv = await page.locator('.post__finger').first().isVisible();
  console.log('hover tracker: fingerVisible=' + hv);
  if (!hv) problems.push('desktop: tracker fingers not visible on hover');
  // focus ring visibility check on primary button
  await page.keyboard.press('Tab');
  await ctx.close(); }
// 5. reduced motion: route drawn immediately, no hidden reveal elements
{ const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const route = document.querySelector('[data-route]');
    const drawn = getComputedStyle(route, '::after').transform;
    const hidden = [...document.querySelectorAll('[data-reveal]')].filter((el) => getComputedStyle(el).opacity !== '1').length;
    return { drawn, hidden, drawnVar: route.style.getPropertyValue('--drawn') };
  });
  console.log('reduced motion: route transform=' + r.drawn + ' drawnVar=' + r.drawnVar + ' hiddenReveals=' + r.hidden);
  if (r.hidden > 0 || r.drawnVar !== '1') problems.push('reduced motion: content hidden or route not drawn');
  await page.screenshot({ path: `${reviewDir}/reduced-motion-hero.png` });
  await ctx.close(); }
// 6. review captures at 1280 and 1600 first viewport
for (const w of [1280, 1600]) { const ctx = await browser.newContext({ viewport: { width: w, height: 900 } }); const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' }); await settle(page);
  await page.screenshot({ path: `${reviewDir}/hero-${w}.png` }); await ctx.close(); }

fs.copyFileSync(`${outDir}/desktop-full.png`, `${reviewDir}/desktop.png`);
fs.copyFileSync(`${outDir}/mobile-full.png`, `${reviewDir}/mobile.png`);
await browser.close();
if (problems.length) { console.log('\nPROBLEMS:\n- ' + problems.join('\n- ')); process.exitCode = 1; } else console.log('\nAll checks passed.');
