#!/usr/bin/env node
/**
 * Generates the Open Graph images (1200×630) into public/og/ with Playwright
 * (SITE-PLAN §9): home = name + chips on paper over the static contour field;
 * about = the speaking photo with a small name label. Run `npm run og` after
 * changing names, chips or fonts; the PNGs are committed so CI needs no browser.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { contourSvg } from '../src/lib/contours-svg.ts';

const pw = await import('playwright').catch(() => import('/opt/node22/lib/node_modules/playwright/index.js'));
const chromium = (pw.default ?? pw).chromium;

const root = resolve(import.meta.dirname, '..');
const font = (p) => pathToFileURL(resolve(root, 'node_modules/@fontsource', p)).href;
const photo = pathToFileURL(resolve(root, 'assets/photos/global-tech-weekend-2025/speaking-sunglasses-mic.webp')).href;

const fonts = `
@font-face{font-family:'Instrument Serif';src:url('${font('instrument-serif/files/instrument-serif-latin-400-normal.woff2')}') format('woff2')}
@font-face{font-family:'Geist Sans';font-weight:400;src:url('${font('geist-sans/files/geist-sans-latin-400-normal.woff2')}') format('woff2')}
@font-face{font-family:'Geist Sans';font-weight:500;src:url('${font('geist-sans/files/geist-sans-latin-500-normal.woff2')}') format('woff2')}
@font-face{font-family:'Geist Mono';src:url('${font('geist-mono/files/geist-mono-latin-400-normal.woff2')}') format('woff2')}
@font-face{font-family:'Noto Serif Georgian';font-weight:300;src:url('${font('noto-serif-georgian/files/noto-serif-georgian-georgian-300-normal.woff2')}') format('woff2')}
@font-face{font-family:'Noto Sans Georgian';font-weight:400;src:url('${font('noto-sans-georgian/files/noto-sans-georgian-georgian-400-normal.woff2')}') format('woff2')}
@font-face{font-family:'Noto Sans Georgian';font-weight:500;src:url('${font('noto-sans-georgian/files/noto-sans-georgian-georgian-500-normal.woff2')}') format('woff2')}
`;

const copy = {
  en: {
    name: 'Tengo Meskhi',
    chips: ['<b>CEO &amp; Founder</b> · Conceptdigital', '<b>CTO</b> · Boon', 'Forbes Georgia 30 Under 30'],
    tag: 'Technology leader and founder, based in Tbilisi.',
    about: 'About',
    display: "'Instrument Serif', serif",
    body: "'Geist Sans', sans-serif",
    size: '150px',
    weight: 400,
    ls: '-0.03em',
  },
  ka: {
    name: 'თენგო მესხი',
    chips: ['<b>CEO და დამფუძნებელი</b> · Conceptdigital', '<b>CTO</b> · Boon', 'Forbes Georgia 30 Under 30'],
    tag: 'ტექნოლოგიური ლიდერი და დამფუძნებელი, თბილისიდან.',
    about: 'ჩემ შესახებ',
    display: "'Noto Serif Georgian', serif",
    body: "'Noto Sans Georgian', 'Geist Sans', sans-serif",
    size: '112px',
    weight: 300,
    ls: '0',
  },
};

const svg = contourSvg().replace('<svg ', '<svg style="position:absolute;inset:0;width:100%;height:100%" ');

function home(c) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
  html,body{margin:0}body{width:1200px;height:630px;position:relative;overflow:hidden;background:#FAFAF8;color:#121316;font-family:${c.body}}
  .wash{position:absolute;inset:0;background:linear-gradient(90deg,rgba(250,250,248,.92) 0%,rgba(250,250,248,.7) 50%,rgba(250,250,248,.1) 85%)}
  .in{position:absolute;left:72px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:28px}
  .chips{display:flex;gap:10px}.chips span{font-size:19px;padding:10px 16px;border-radius:999px;background:rgba(255,255,255,.85);border:1.5px solid #E4E3DF;color:#3C3E44}.chips b{font-weight:500;color:#121316}
  h1{margin:0;font:${c.weight} ${c.size}/1 ${c.display};letter-spacing:${c.ls}}
  p{margin:0;font-size:26px;color:#3C3E44}
  .dot{position:absolute;right:72px;bottom:56px;font:400 22px 'Geist Mono',monospace;letter-spacing:.1em;color:#63656D}.dot b{color:#E2902A}
  </style></head><body>${svg}<div class="wash"></div><div class="in">
  <div class="chips">${c.chips.map((x) => `<span>${x}</span>`).join('')}</div><h1>${c.name}</h1><p>${c.tag}</p></div>
  <div class="dot">tengmesk.com<b>.</b></div></body></html>`;
}

function about(c) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
  html,body{margin:0}body{width:1200px;height:630px;position:relative;overflow:hidden;background:#121316}
  img{width:100%;height:100%;object-fit:cover;object-position:50% 35%;display:block}
  .scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 50%,rgba(0,0,0,.6) 100%)}
  .label{position:absolute;left:64px;bottom:52px;color:#fff;display:flex;align-items:baseline;gap:22px}
  .label b{font:400 64px/1 ${c.display};font-weight:${c.weight === 300 ? 400 : 400};letter-spacing:${c.ls}}
  .label span{font:500 20px ${c.body};opacity:.85}
  .dot{position:absolute;right:64px;bottom:60px;font:400 20px 'Geist Mono',monospace;letter-spacing:.1em;color:rgba(255,255,255,.75)}.dot b{color:#E2902A}
  </style></head><body><img src="${photo}"><div class="scrim"></div>
  <div class="label"><b>${c.name}</b><span>${c.about}</span></div><div class="dot">tengmesk.com<b>.</b></div></body></html>`;
}

mkdirSync(resolve(root, 'public/og'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const lang of ['en', 'ka']) {
  for (const [name, html] of [
    [`home-${lang}`, home(copy[lang])],
    [`about-${lang}`, about(copy[lang])],
  ]) {
    // Load from a file:// URL so file:// fonts and photos are allowed.
    const tmp = resolve(tmpdir(), `og-${name}.html`);
    writeFileSync(tmp, html);
    await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(100);
    // Photographic cards go out as JPEG (a PNG of the photo is ~700 KB).
    const jpeg = name.startsWith('about');
    const buf = await page.screenshot(jpeg ? { type: 'jpeg', quality: 82 } : { type: 'png' });
    const file = `public/og/${name}.${jpeg ? 'jpg' : 'png'}`;
    writeFileSync(resolve(root, file), buf);
    console.log(`og: ${file} (${(buf.length / 1024).toFixed(0)} KB)`);
  }
}
await browser.close();
