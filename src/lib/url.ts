import type { Lang } from '../i18n';

/**
 * URL helpers. `base` comes from astro.config (env-driven) so the site works
 * at the project-page staging URL (/tengmesk.com/) now and at the root
 * domain later. All internal links go through `href()`.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, ''); // '' or '/tengmesk.com'

/** Site-relative path → base-aware path. Keeps trailing slashes and hashes. */
export function href(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${BASE}${path}`;
}

/** Absolute URL for canonicals, OG and JSON-LD. */
export function absolute(path: string, site: URL | undefined): string {
  const origin = site ? site.origin : 'https://tengmesk.com';
  return `${origin}${href(path)}`;
}

/** Routes per language, keyed by a language-neutral page id. */
export type PageId = 'home' | 'about';
export const ROUTES: Record<PageId, Record<Lang, string>> = {
  home: { en: '/', ka: '/ka/' },
  about: { en: '/about/', ka: '/ka/about/' },
};

export function route(page: PageId, lang: Lang): string {
  return ROUTES[page][lang];
}

/** Anchor on the home page: `#help` on home, `/#help` elsewhere. */
export function homeAnchor(id: string, lang: Lang, onHome: boolean): string {
  return onHome ? `#${id}` : `${route('home', lang)}#${id}`;
}
