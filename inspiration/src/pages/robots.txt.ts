import type { APIRoute } from 'astro';
import { absolute } from '../lib/site';

/** Raw demos under /demo/ are for the sandboxed frames, not for search. */
export const GET: APIRoute = ({ site }) => {
  const sitemap = absolute('/sitemap-index.xml', site);
  return new Response(`User-agent: *\nAllow: /\nDisallow: /demo/\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
