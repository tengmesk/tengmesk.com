/** Site-wide constants and small helpers. */

export const SITE_NAME = 'Inspiration';
export const OWNER = 'Tengo Meskhi';
export const MAIN_SITE = 'https://tengmesk.com/';
export const DEFAULT_SITE = 'https://inspiration.tengmesk.com';

/** Absolute URL for canonicals and OG. */
export function absolute(path: string, site: URL | undefined): string {
  return new URL(path, site ?? DEFAULT_SITE).toString();
}

export function pageTitle(title?: string): string {
  return title ? `${title} — ${SITE_NAME} · ${OWNER}` : `${SITE_NAME} — UI recreations, component libraries and design resources · ${OWNER}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-07-24" → "24 Jul 2026". */
export function date(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`;
}

/** Tag → token safe for a data attribute and a URL query (no spaces). */
export function token(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
