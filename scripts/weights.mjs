#!/usr/bin/env node
/**
 * First-view page weight of dist/ pages vs SITE-PLAN §11 budgets. Loads each
 * page in headless Chromium (mobile + desktop), records every request, and
 * reports raw and gzip sizes per type from the files on disk.
 *
 *   npm run build && node scripts/weights.mjs
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const pw = await import('playwright').catch(() => import('/opt/node22/lib/node_modules/playwright/index.js'));
const chromium = (pw.default ?? pw).chromium;
const dist = resolve(import.meta.dirname, '..', 'dist');
const server = createServer((req, res) => {
  let f = join(dist, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.avif': 'image/avif', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' }[extname(f)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const budgets = { html: 30, css: 40, js: 20, font: 120, image: 0 };
const kind = (p) => (/\.html$|\/$/.test(p) ? 'html' : /\.css$/.test(p) ? 'css' : /\.js$/.test(p) ? 'js' : /\.woff2$/.test(p) ? 'font' : /\.(avif|webp|png|jpe?g|svg)$/.test(p) ? 'image' : 'other');
const browser = await chromium.launch();
for (const [label, path] of [['home-en', '/'], ['home-ka', '/ka/'], ['about-en', '/about/'], ['about-ka', '/ka/about/']]) {
  for (const [vp, viewport] of [['mobile', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: vp === 'mobile' ? 3 : 2 });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setHardwareConcurrencyOverride', { hardwareConcurrency: 8 }).catch(() => {});
    const seen = new Map();
    page.on('request', (r) => { const u = new URL(r.url()); if (u.origin === base) seen.set(u.pathname, true); });
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800); // island loads after fonts.ready
    const totals = {};
    const files = [];
    for (const p of seen.keys()) {
      let f = join(dist, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
      if (!existsSync(f)) continue;
      const buf = readFileSync(f); const k = kind(p); const gz = gzipSync(buf).length;
      totals[k] = totals[k] || { raw: 0, gz: 0, n: 0 }; totals[k].raw += buf.length; totals[k].gz += gz; totals[k].n++;
      files.push(`${k.padEnd(5)} ${(gz / 1024).toFixed(1).padStart(6)} KB gz  ${p}`);
    }
    const all = Object.values(totals).reduce((a, t) => a + t.gz, 0);
    console.log(`\n## ${label} ${vp} — total first view ${(all / 1024).toFixed(1)} KB gz`);
    for (const [k, t] of Object.entries(totals).sort()) {
      const b = budgets[k];
      const kb = t.gz / 1024;
      console.log(`${k.padEnd(6)} ${t.n} files  raw ${(t.raw / 1024).toFixed(1).padStart(6)} KB  gz ${kb.toFixed(1).padStart(6)} KB${b !== undefined ? `  budget ${b} KB ${kb <= b ? 'ok' : 'OVER'}` : ''}`);
    }
    if (process.argv.includes('-v')) console.log(files.sort().join('\n'));
    await ctx.close();
  }
}
await browser.close();
server.close();
