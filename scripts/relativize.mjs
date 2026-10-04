#!/usr/bin/env node
/**
 * Post-process a build so every internal URL is relative to the file that
 * references it. The result works when opened via file:// or served from any
 * subfolder (used to preview the site as a hosted artifact).
 *
 *   npm run build:preview   →  PREVIEW=1 astro build --outDir dist-preview
 *                              node scripts/relativize.mjs dist-preview
 *
 * Rules: root-relative URLs (`/x`) become `../x` relative to the current
 * file; directory URLs (`/about/`) gain `index.html`; hashes and external
 * URLs are left alone. Applied to HTML attributes, CSS url(), inline styles
 * and the sitemap/robots text files.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, relative } from 'node:path';

const root = process.argv[2] || 'dist-preview';

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Turn a site-absolute URL into one relative to `fromFile` (a path under root). */
function rel(url, fromFile) {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  let [path, hash] = url.split('#');
  let query = '';
  const q = path.indexOf('?');
  if (q >= 0) {
    query = path.slice(q);
    path = path.slice(0, q);
  }
  if (path === '/' || path.endsWith('/')) path += 'index.html';
  const fromDir = dirname(fromFile);
  let r = relative(fromDir, join(root, path)).split('\\').join('/');
  if (!r.startsWith('.')) r = './' + r;
  return r + query + (hash !== undefined ? '#' + hash : '');
}

function relativizeHtml(html, file) {
  // Inline hoisted module scripts: file:// blocks module fetches, so the
  // preview carries them in the page. A dynamic import() inside is rewritten
  // to the chunk's relative path; under file:// it still fails (CORS) and the
  // island falls back to the static SVG, which is the designed no-JS state.
  html = html.replace(/<script type="module" src="(\/[^"]+\.js)"><\/script>/g, (_m, src) => {
    const chunkDir = rel(posix.dirname(src) + '/', file).replace(/index\.html$/, '');
    let js = readFileSync(join(root, src), 'utf8').replace(/import\(\s*(["'])\.\//g, (_i, qq) => `import(${qq}${chunkDir}`);
    return `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`;
  });
  // Font preload hints point at files the browser cannot CORS-fetch from
  // file://; the faces are embedded as data URIs below, so drop the hints.
  html = html.replace(/<link rel="preload" [^>]*as="font"[^>]*>/g, '');
  // Attributes with a single URL.
  html = html.replace(/\b(href|src|poster|action|content)=("|')(\/[^"']*)\2/g, (m, attr, qq, url) => {
    if (attr === 'content' && !/^\/[\w./-]*$/.test(url)) return m; // only path-like content (meta refresh handled below)
    return `${attr}=${qq}${rel(url, file)}${qq}`;
  });
  // meta http-equiv refresh: content="0; url=/ka/"
  html = html.replace(/(content=")(\d+;\s*url=)(\/[^"]*)(")/g, (_m, a, b, url, d) => `${a}${b}${rel(url, file)}${d}`);
  // srcset lists.
  html = html.replace(/\bsrcset=("|')([^"']+)\1/g, (_m, qq, list) => {
    const fixed = list
      .split(',')
      .map((part) => {
        const [u, ...rest] = part.trim().split(/\s+/);
        return [rel(u, file), ...rest].join(' ');
      })
      .join(', ');
    return `srcset=${qq}${fixed}${qq}`;
  });
  // CSS url(/...) inside <style> and style attributes (fonts become data URIs).
  return relativizeCss(html, file);
}

function relativizeCss(css, file) {
  return css.replace(/url\((['"]?)(\/[^'")]+)\1\)/g, (_m, qq, url) => {
    // Chromium refuses @font-face fetches from a file:// origin, so the
    // preview embeds the (small, subset) woff2 files as data URIs instead.
    if (url.endsWith('.woff2') && existsSync(join(root, url))) {
      return `url(data:font/woff2;base64,${readFileSync(join(root, url)).toString('base64')})`;
    }
    return `url(${qq}${rel(url, file)}${qq})`;
  });
}

let count = 0;
for (const file of walk(root)) {
  const ext = posix.extname(file);
  if (ext === '.html') {
    writeFileSync(file, relativizeHtml(readFileSync(file, 'utf8'), file));
    count++;
  } else if (ext === '.css') {
    writeFileSync(file, relativizeCss(readFileSync(file, 'utf8'), file));
    count++;
  } else if (ext === '.js') {
    // Hoisted scripts only import relative chunks; nothing root-relative expected.
    const src = readFileSync(file, 'utf8');
    if (/["'`]\/_astro\//.test(src)) {
      writeFileSync(file, src.replace(/(["'`])\/_astro\//g, (_m, qq) => `${qq}${rel('/_astro/', file).replace(/index\.html$/, '')}`));
      count++;
    }
  }
}
console.log(`relativize: rewrote ${count} files under ${root}/`);
