import { en, type Key } from './en';
import { ka } from './ka';

export type Lang = 'en' | 'ka';
export const LANGS: Lang[] = ['en', 'ka'];
export const DEFAULT_LANG: Lang = 'en';

const dict: Record<Lang, Record<Key, string>> = { en, ka };

/** Translator bound to a language. Throws at build time on a missing key. */
export function useT(lang: Lang) {
  const d = dict[lang];
  return (key: Key): string => {
    const v = d[key];
    if (v === undefined) throw new Error(`i18n: missing key "${key}" for ${lang}`);
    return v;
  };
}

/** Pick a bilingual field from media.yaml-shaped data. */
export function pick<T>(lang: Lang, en: T, ka: T | undefined): T {
  return lang === 'ka' && ka !== undefined ? ka : en;
}

export const OG_LOCALE: Record<Lang, string> = { en: 'en_GB', ka: 'ka_GE' };
export const HTML_LANG: Record<Lang, string> = { en: 'en', ka: 'ka' };

export type { Key };
