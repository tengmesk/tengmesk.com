/**
 * Typed loader for assets/media.yaml — the content source of truth.
 *
 * Runs at build time only. The YAML is parsed once, validated with zod, and
 * exported as plain typed objects. Unknown values are the literal `tbc` in the
 * file; `known()` turns them into `undefined` so templates can never render
 * the string (SITE-PLAN §10: omit, don't apologise).
 */
import { z } from 'astro/zod';
import { parse } from 'yaml';
import yamlSource from '../../assets/media.yaml?raw';

const TBC = 'tbc';
/** A string that may be the literal `tbc`. Normalised to `undefined`. */
const maybe = z
  .union([z.string(), z.number(), z.null()])
  .optional()
  .transform((v) => (v === undefined || v === null || v === TBC ? undefined : String(v)));
const bool = z.boolean().optional().default(false);
const bi = z.object({ en: z.string(), ka: z.string() });
const biMaybe = z.object({ en: maybe, ka: maybe });

const Person = z.object({
  id: z.string(),
  name: bi,
  former_name: bi,
  headline: bi,
  location: z.object({ city: z.string(), country: z.string(), timezone: z.string() }),
  email: maybe,
  cv_pdf: maybe,
  portrait: maybe,
  portrait_interim: maybe,
});

const Social = z.object({
  id: z.string(),
  label: z.string(),
  url: z.url(),
  handle: z.string(),
  featured: bool,
  primary_contact: bool,
});

const Role = z.object({
  id: z.string(),
  org: z.string(),
  org_ka: z.string(),
  title: z.string(),
  title_ka: z.string(),
  kind: z.string().optional(),
  status: z.enum(['current', 'past']),
  period: maybe,
  location: maybe,
  venture: z.string().optional(),
  sources: z.array(z.string()).optional().default([]),
  note: z.string().optional(),
  featured: bool,
});

const Venture = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  role_ka: z.string(),
  url: maybe,
  summary: biMaybe,
  mentions: z.array(z.string()).optional().default([]),
  featured: bool,
  order: z.number(),
});

const Recognition = z.object({
  id: z.string(),
  title: z.string(),
  title_ka: z.string(),
  by: z.string(),
  year: z.number(),
  category: z.string().optional(),
  source: z.string().optional(),
  featured: bool,
});

const Talk = z.object({
  id: z.string(),
  kind: z.string(),
  event: z.string(),
  event_short: z.string(),
  event_ka: z.string(),
  role: z.string(),
  role_ka: z.string(),
  session: z.string().optional(),
  panel: z.string().optional(),
  date: z.coerce.date(),
  city: z.string(),
  city_ka: z.string(),
  venue: maybe,
  url: maybe,
  credited_as: z.string().optional(),
  photos: z.array(z.string()).optional().default([]),
  featured: bool,
});

const Teaching = z.object({
  id: z.string(),
  institution: z.string(),
  institution_short: z.string(),
  institution_ka: z.string(),
  role: z.string(),
  role_ka: z.string(),
  topics: z.array(z.string()),
  topics_ka: z.array(z.string()),
  url: maybe,
  period: maybe,
  featured: bool,
});

const Press = z.object({
  id: z.string(),
  kind: z.string(),
  outlet: z.string(),
  outlet_short: z.string().optional(),
  title: z.string(),
  title_ka: maybe,
  url: z.url(),
  lang: z.enum(['en', 'ka']),
  date: maybe,
  about: z.array(z.string()).optional().default([]),
  quote_ka: z.string().optional(),
  quote_en: z.string().optional(),
  note: z.string().optional(),
  featured: bool,
});

const Interview = z.object({
  id: z.string(),
  kind: z.string(),
  outlet: z.string(),
  title: z.string(),
  title_ka: maybe,
  url: z.url(),
  lang: z.enum(['en', 'ka']),
  date: maybe,
  note: z.string().optional(),
  featured: bool,
});

const Photo = z.object({
  id: z.string(),
  file: z.string(),
  talk: z.string().optional(),
  width: z.number(),
  height: z.number(),
  focal: z.string(),
  alt: bi,
  slots: z.array(z.string()).optional().default([]),
  featured: bool,
});

const Media = z.object({
  person: Person,
  socials: z.array(Social),
  roles: z.array(Role),
  ventures: z.array(Venture),
  recognition: z.array(Recognition),
  talks: z.array(Talk),
  teaching: z.array(Teaching),
  press: z.array(Press),
  interviews: z.array(Interview),
  photos: z.array(Photo),
  // press_cards are source material only (SITE-PLAN §8); not loaded.
});

export type Media = z.infer<typeof Media>;
export type Role = z.infer<typeof Role>;
export type Venture = z.infer<typeof Venture>;
export type Talk = z.infer<typeof Talk>;
export type Teaching = z.infer<typeof Teaching>;
export type Press = z.infer<typeof Press>;
export type Interview = z.infer<typeof Interview>;
export type Photo = z.infer<typeof Photo>;

const raw = parse(yamlSource);
const result = Media.safeParse(raw);
if (!result.success) {
  throw new Error(`assets/media.yaml failed validation:\n${result.error.message}`);
}
export const media: Media = result.data;

/** Lookup helpers keyed by stable id. */
function byId<T extends { id: string }>(list: T[]): (id: string) => T {
  const map = new Map(list.map((x) => [x.id, x]));
  return (id) => {
    const hit = map.get(id);
    if (!hit) throw new Error(`media.yaml: unknown id "${id}"`);
    return hit;
  };
}
export const role = byId(media.roles);
export const venture = byId(media.ventures);
export const talk = byId(media.talks);
export const teaching = byId(media.teaching);
export const press = byId(media.press);
export const interview = byId(media.interviews);
export const photo = byId(media.photos);
export const recognition = byId(media.recognition);
export const social = byId(media.socials);

/**
 * Outlets the proof strip may name. McKinsey is held back until the owner
 * confirms he is named in the piece (SITE-PLAN §2.3 and §10); the Track record
 * link to the case remains, since that is a fact about the bank.
 */
export const PROOF_PRESS_EXCLUDE = new Set(['press-mckinsey-agile-bank']);

/** Press list order on the home page, per SITE-PLAN §2.8. */
export const PRESS_ORDER = [
  'press-forbes-strategic-code',
  'press-mckinsey-agile-bank',
  'press-georgian-journal-30u30',
  'press-bmg-pensight-london',
  'press-bmg-digital-institute',
];
export const INTERVIEW_ORDER = [
  'int-ai-interconnect',
  'int-tevent-talks',
  'int-alexander-mihalcea',
  'int-bmg',
  'int-lk-podcast',
  'int-globalize',
];

/** Track record rows, oldest to newest, per SITE-PLAN §2.5. */
export const TRACK_ORDER = [
  'cambridge-bioengineering',
  'mckinsey-digital',
  'bank-of-georgia',
  'pensight-growth',
];
export const OWN_COMPANY_ROLES = ['conceptdigital-ceo', 'boon-cto', 'digital-institute-founder'];

/** Hero chips: featured current roles in this order + the award. */
export const HERO_ROLES = ['conceptdigital-ceo', 'boon-cto'];

/** Any venture with a confirmed one-liner? Decides cards vs ruled list (§10). */
export const venturesHaveSummaries = media.ventures.some(
  (v) => v.featured && (v.summary.en || v.summary.ka),
);

/** Deduped list, order preserved. */
export function unique<T>(xs: T[]): T[] {
  return [...new Set(xs)];
}
