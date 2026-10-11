import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

/**
 * inspiration.tengmesk.com — host-agnostic static build (no adapter).
 * `SITE_URL` overrides the origin used for canonicals, OG and the sitemap.
 * `PREVIEW=1` builds for scripts/preview-fix.mjs: hashed assets go to
 * `assets/` instead of `_astro/`, because the preview host rejects
 * top-level names that start with an underscore.
 */
const SITE_URL = process.env.SITE_URL?.replace(/\/+$/, '') || 'https://inspiration.tengmesk.com';
const PREVIEW = Boolean(process.env.PREVIEW);
const PROJECT_DIR = fileURLToPath(new URL('./', import.meta.url));

export default defineConfig({
  site: SITE_URL,
  base: '/',
  trailingSlash: 'always',
  output: 'static',
  compressHTML: true,
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
    assets: PREVIEW ? 'assets' : '_astro',
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/404\/?$/.test(page),
    }),
  ],
  vite: {
    // The content adapter runs inside a bundled prerender chunk, where
    // import.meta.url no longer points at the source tree; hand it the
    // project directory from here instead.
    define: { __INSPIRATION_DIR__: JSON.stringify(PROJECT_DIR) },
    resolve: {
      // shared/styles/fonts-latin.css lives outside this project and refers
      // to '@fontsource/…'; pin that to this project's node_modules so the
      // build does not depend on the main site's dependencies being installed.
      alias: [{ find: /^@fontsource\//, replacement: fileURLToPath(new URL('./node_modules/@fontsource/', import.meta.url)) }],
    },
    build: {
      assetsInlineLimit: 0,
      modulePreload: false,
    },
  },
});
