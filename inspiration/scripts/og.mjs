#!/usr/bin/env node
/**
 * Open Graph images for the section pages (1200×630), rendered with
 * Playwright from an inline template that uses the site's own fonts.
 * Detail pages use their demo thumbnail instead. Output is committed so
 * CI needs no browser.
 *
 *   node scripts/og.mjs
 */
import { mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

const pw = await import('playwright').catch(() => import('/opt/node22/lib/node_modules/playwright/index.js'));
const chromium = (pw.default ?? pw).chromium;
const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, '..');
const out = join(root, 'public/og');
mkdirSync(out, { recursive: true });

const font = (pkg, file) => `data:font/woff2;base64,${readFileSync(require.resolve(`${pkg}/files/${file}`)).toString('base64')}`;
const serif = font('@fontsource/instrument-serif', 'instrument-serif-latin-400-normal.woff2');
const sans = font('@fontsource/geist-sans', 'geist-sans-latin-400-normal.woff2');
const mono = font('@fontsource/geist-mono', 'geist-mono-latin-400-normal.woff2');

const cards = [
  ['inspiration', 'Inspiration', 'UI recreations, component libraries and design resources', 'inspiration.tengmesk.com'],
  ['sites', 'Sites', 'Portfolio · Personality · Product', 'inspiration.tengmesk.com/sites'],
  ['components', 'Components', 'Effects and sections recreated by hand, one file each', 'inspiration.tengmesk.com/components'],
  ['resources', 'Resources', 'Libraries to build with, galleries to browse', 'inspiration.tengmesk.com/resources'],
];

const html = (title, sub, url) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:IS;src:url(${serif})}
@font-face{font-family:GS;src:url(${sans})}
@font-face{font-family:GM;src:url(${mono})}
html,body{margin:0;width:1200px;height:630px;background:#fafaf8;color:#121316;font-family:GS,system-ui}
.bg{position:absolute;inset:0;background-image:radial-gradient(#d8d6d0 1.6px,transparent 1.9px);background-size:26px 26px;
 -webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,.9),rgba(0,0,0,.15) 70%,transparent)}
.in{position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column;justify-content:flex-end;gap:18px}
.eyebrow{font-family:GM;font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:#9a5a0c}
h1{margin:0;font:400 150px/.95 IS;letter-spacing:-.03em}
h1 b{font-weight:400;color:#e2902a}
p{margin:0;font-size:34px;line-height:1.3;color:#3c3e44;max-width:28ch}
.url{position:absolute;right:80px;bottom:72px;font-family:GM;font-size:20px;color:#63656d}
</style></head><body><div class="bg"></div><div class="in">
<span class="eyebrow">Tengo Meskhi</span><h1>${title}<b>.</b></h1><p>${sub}</p></div><span class="url">${url}</span></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const [name, title, sub, url] of cards) {
  await page.setContent(html(title, sub, url), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(out, `${name}.png`), type: 'png' });
  console.log(`og: ${name}.png`);
}
await browser.close();
