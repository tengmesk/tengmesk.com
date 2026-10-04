import type { APIRoute } from 'astro';
import { href } from '../lib/url';

/**
 * Old URL `/ka.html` → `/ka/`. Static hosts have no server redirects, so this
 * is a meta-refresh stub with a canonical pointing at the real page.
 */
export const GET: APIRoute = ({ site }) => {
  const target = href('/ka/');
  const canonical = new URL(target, site ?? 'https://tengmesk.com').toString();
  const html = `<!doctype html>
<html lang="ka">
<meta charset="utf-8">
<title>თენგო მესხი</title>
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${target}">
<link rel="canonical" href="${canonical}">
<p><a href="${target}">თენგო მესხი — ქართული გვერდი</a></p>
</html>
`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
