import type { Lang } from '../i18n';

/** "June 2025" / "ივნისი 2025" (standalone month name + year). */
export function monthYear(date: Date, lang: Lang): string {
  const month = new Intl.DateTimeFormat(lang === 'ka' ? 'ka' : 'en-GB', {
    month: 'long',
    timeZone: 'UTC',
  }).format(date);
  return `${month} ${date.getUTCFullYear()}`;
}

/** Join non-empty parts with the site's middle dot. */
export function dots(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' · ');
}
