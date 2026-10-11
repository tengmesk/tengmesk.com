#!/usr/bin/env node
/**
 * Screenshots + acceptance checks for inspiration.tengmesk.com.
 *
 *   npm run build && node scripts/shots.mjs [outDir]
 *
 * Serves dist/ locally, screenshots every page at 1440×900 and 390×844
 * (full page), and checks: no console errors; no horizontal scroll at
 * 390 px; the review-status demo is absent from the built HTML; every
 * demo iframe is sandboxed with allow-scripts only; filters work from the
 * keyboard and write the URL query; the query pre-selects a filter; the
 * mobile menu opens/closes with the keyboard; reduced motion hides nothing.
 * Exit code 1 on any failure. Default output: ../docs/journey/assets/inspiration/.
 */
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import sharp from 'sharp';

const pw = await import('playwright').catch(() => import('/opt/node22/lib/node_modules/playwright/index.js'));
const chromium = (pw.default ?? pw).chromium;

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const out = resolve(root, process.argv[2] || '../docs/journey/assets/inspiration');
mkdirSync(out, { recursive: true });

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
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

const detailSlugs = existsSync(join(dist, 'c')) ? readdirSync(join(dist, 'c')) : [];
const pages = [
  ['home', '/'],
  ['sites', '/sites/'],
  ['components', '/components/'],
  ['resources', '/resources/'],
  ...detailSlugs.map((s) => [`c-${s}`, `/c/${s}/`]),
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

/** Full-page PNGs run to megabytes; a palette PNG keeps each small. */
async function shot(page, file, opts = {}) {
  const buf = await page.screenshot(opts);
  await sharp(buf).png({ palette: true, quality: 85, compressionLevel: 9 }).toFile(file);
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
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

// Static checks on the built HTML.
{
  const walk = (d, acc = []) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      statSync(p).isDirectory() ? walk(p, acc) : p.endsWith('.html') && acc.push(p);
    }
    return acc;
  };
  const html = walk(dist).filter((p) => !p.includes(`${join(dist, 'demo')}/`));
  const leaks = html.filter((p) => readFileSync(p, 'utf8').includes('thymos-feature-pillars'));
  note(leaks.length === 0, `review-status demo "thymos-feature-pillars" absent from ${html.length} built pages${leaks.length ? ' — found in ' + leaks.join(', ') : ''}`);
  note(!existsSync(join(dist, 'demo/thymos-feature-pillars')), 'review-status demo not copied to /demo/');
  const iframes = html.flatMap((p) => [...readFileSync(p, 'utf8').matchAll(/<iframe[^>]*>/g)].map((m) => m[0]));
  const bad = iframes.filter((t) => !/sandbox="allow-scripts"/.test(t));
  note(iframes.length > 0 && bad.length === 0, `${iframes.length} demo iframe(s), all sandbox="allow-scripts"${bad.length ? ' — ' + bad.join(' | ') : ''}`);
  const ext = html.flatMap((p) => [...readFileSync(p, 'utf8').matchAll(/<a [^>]*href="https?:[^>]*>/g)].map((m) => m[0])).filter((a) => !a.includes('tengmesk.com/"'));
  const noNoopener = ext.filter((a) => !/rel="[^"]*noopener/.test(a));
  note(noNoopener.length === 0, `${ext.length} external link(s) carry rel="noopener"${noNoopener.length ? ' — ' + noNoopener.slice(0, 3).join(' | ') : ''}`);
  const credits = detailSlugs.filter((s) => /Recreated from/.test(readFileSync(join(dist, 'c', s, 'index.html'), 'utf8')));
  note(credits.length === detailSlugs.length, `every detail page says "Recreated from …" (${credits.length}/${detailSlugs.length})`);
  const licence = html.filter((p) => /MIT licen[cs]e/.test(readFileSync(p, 'utf8')));
  note(licence.length === html.length, `MIT licence + design ownership stated on every page (${licence.length}/${html.length})`);
}

const browser = await chromium.launch();

for (const [name, path] of pages) {
  for (const [vp, viewport] of viewports) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      if (name === '404' && /404/.test(m.text())) return;
      errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await settle(page);
    await shot(page, join(out, `${name}-${vp}.png`), { fullPage: true });
    note(errors.length === 0, `${name} ${vp}: console clean${errors.length ? ' — ' + errors.join(' | ') : ''}`);
    if (vp === 'mobile') {
      const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      note(sw[0] <= sw[1], `${name} mobile: no horizontal scroll (${sw[0]} ≤ ${sw[1]})`);
    }
    if (name.startsWith('c-') && vp === 'desktop') {
      const r = await page.evaluate(() => {
        const f = document.querySelector('iframe');
        return { sandbox: f?.getAttribute('sandbox'), src: f?.getAttribute('src'), h: f?.getBoundingClientRect().height };
      });
      note(r.sandbox === 'allow-scripts' && r.h > 400, `${name}: iframe sandboxed (${r.sandbox}), ${Math.round(r.h)} px tall`);
      await page.evaluate(() => document.querySelector('iframe')?.scrollIntoView());
      await page.waitForTimeout(1200);
      const frame = page.frames().find((f) => f !== page.mainFrame());
      const inner = frame ? await frame.evaluate(() => ({ origin: self.origin, nodes: document.body.querySelectorAll('*').length })).catch(() => null) : null;
      note(Boolean(inner && inner.nodes > 0 && inner.origin === 'null'), `${name}: demo renders inside the frame with an opaque origin (${inner?.nodes ?? 0} nodes, origin ${inner?.origin})`);
    }
    await ctx.close();
  }
}

// Filters from the keyboard: Tab to the category group, arrow to a category,
// the grid and the URL follow; Tab to Reset, Enter restores everything.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + '/components/', { waitUntil: 'networkidle' });
  const total = await page.evaluate(() => document.querySelectorAll('.item').length);
  await page.focus('input[name="cat"][value=""]');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(100);
  const r1 = await page.evaluate(() => ({
    cat: document.querySelector('input[name="cat"]:checked')?.value,
    shown: [...document.querySelectorAll('.item')].filter((el) => getComputedStyle(el).display !== 'none').length,
    q: location.search,
    count: document.querySelector('[data-count]')?.textContent,
  }));
  note(r1.cat && r1.q === `?cat=${r1.cat}` && r1.shown < total + 1, `filters: ArrowRight selects "${r1.cat}", URL ${r1.q}, ${r1.shown} of ${total} shown ("${r1.count}")`);
  await shot(page, join(out, 'components-filtered.png'), { clip: { x: 0, y: 0, width: 1440, height: 900 } });
  await page.focus('[data-status] [data-reset]');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);
  const r2 = await page.evaluate(() => ({ q: location.search, cat: document.querySelector('input[name="cat"]:checked')?.value, focus: document.activeElement?.name }));
  note(r2.q === '' && r2.cat === '' && r2.focus === 'cat', `filters: Reset via keyboard clears the query and returns focus to the group`);
  // Query state on load.
  const tag = await page.evaluate(() => document.querySelector('input[name="tag"]:not([value=""])')?.value);
  await page.goto(`${base}/components/?tag=${tag}`, { waitUntil: 'networkidle' });
  const r3 = await page.evaluate(() => ({
    tag: document.querySelector('input[name="tag"]:checked')?.value,
    hiddenAny: [...document.querySelectorAll('.item')].some((el) => el.hidden),
    shown: [...document.querySelectorAll('.item')].filter((el) => getComputedStyle(el).display !== 'none').length,
  }));
  note(r3.tag === tag, `filters: ?tag=${tag} pre-selects the chip (${r3.shown} shown)`);
  // No JavaScript: every item is in the DOM and visible; chips still filter via :has().
  const noJs = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p2 = await noJs.newPage();
  await p2.goto(base + '/components/', { waitUntil: 'networkidle' });
  const r4 = await p2.evaluate(() => [...document.querySelectorAll('.item')].filter((el) => getComputedStyle(el).display !== 'none' && getComputedStyle(el).opacity === '1').length);
  note(r4 === total, `no-JS: all ${total} items listed and visible`);
  await p2.check('input[name="cat"]:not([value=""])');
  const r5 = await p2.evaluate(() => {
    const v = document.querySelector('input[name="cat"]:checked').value;
    const items = [...document.querySelectorAll('.item')];
    const shown = items.filter((el) => getComputedStyle(el).display !== 'none');
    return { v, ok: shown.every((el) => el.dataset.cat.split(' ').includes(v)) && shown.length > 0 && shown.length === items.filter((el) => el.dataset.cat.split(' ').includes(v)).length };
  });
  note(r5.ok, `no-JS: CSS :has() filtering works for "${r5.v}"`);
  await noJs.close();
  await ctx.close();
}

// Reduced motion: nothing hidden by reveals, no hero animation.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => ({
    js: document.documentElement.classList.contains('js'),
    hidden: [...document.querySelectorAll('[data-reveal], .hero-i__in > *')].filter((el) => getComputedStyle(el).opacity !== '1').length,
    anim: getComputedStyle(document.querySelector('.hero-i h1')).animationName,
  }));
  note(!r.js && r.hidden === 0 && r.anim === 'none', `reduced motion: no reveal hiding (${r.hidden} hidden), hero animation ${r.anim}`);
  await shot(page, join(out, 'home-reduced-motion.png'), { clip: { x: 0, y: 0, width: 1440, height: 900 } });
  await ctx.close();
}

// Mobile menu via keyboard.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.focus('#burger');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(150);
  const open = await page.evaluate(() => document.getElementById('menu').open && document.getElementById('burger').getAttribute('aria-expanded') === 'true');
  note(open, 'mobile menu: Enter on burger opens the dialog');
  await shot(page, join(out, 'home-mobile-menu.png'));
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
