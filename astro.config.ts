import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Host-agnostic static build. `site` and `base` come from the environment so
 * the same code serves the GitHub Pages project-page staging URL now
 * (SITE_URL=https://tengmesk.github.io BASE_PATH=/tengmesk.com) and the root
 * domain later (defaults). `PREVIEW=1` builds for scripts/relativize.mjs.
 */
const SITE_URL = process.env.SITE_URL?.replace(/\/+$/, '') || 'https://tengmesk.com';
const BASE_PATH = process.env.PREVIEW ? '/' : process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'always',
  output: 'static',
  compressHTML: true,
  build: {
    format: 'directory',
    // One stylesheet (~5.5 KB gz) inlined per page: removes a render-blocking
    // round trip on the LCP path for a four-page site.
    inlineStylesheets: 'always',
    assets: '_astro',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ka'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/404\/?$|\/ka\.html$/.test(page),
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ka: 'ka' },
      },
    }),
  ],
  vite: {
    build: {
      assetsInlineLimit: 0,
      // The contour island is one dependency-free chunk; the preload helper
      // would only add an absolute-path shim that breaks subfolder previews.
      modulePreload: false,
    },
  },
});
