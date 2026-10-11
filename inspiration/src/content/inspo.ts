/**
 * Typed adapter from manifest.json to the site model.
 *
 * Model: three sections. Sites (portfolio | personality | product),
 * Components (categorised by the manifest's `placement` vocabulary) and
 * Resources (libraries | galleries). Anything can carry tags, of which the
 * audience tags B2B / B2C are a controlled pair.
 *
 * Mapping, schema v1 (no section fields):
 *   kind recreation                        → Components, categories = placement
 *   kind external, category component/
 *     template/theme                       → Resources › libraries
 *   kind external, category inspiration    → Resources › galleries
 *   tags  = tone ∪ tech (recreation) | tags (external)
 *   audience derived from tone: consumer → B2C, enterprise | b2b → B2B
 *
 * Schema v2 fields override the derivation entry by entry: `section`,
 * `site_category`, `component_category`, `audience`, `tags`. See
 * docs/inspiration/MANIFEST-V2-PROPOSAL.md. Moving the external entries
 * out of Resources later means changing `sectionOf()` and nothing else.
 *
 * Only entries with publish == "true" (a string) exist in the model.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { resolveInspoDir } from '../../scripts/lib/inspo-dir.mjs';
import {
  AUDIENCE,
  ManifestSchema,
  PLACEMENT,
  SITE_CATEGORY,
  parseEntry,
  type Audience,
  type Entry,
  type ExternalEntry,
  type Placement,
  type Section,
  type SiteCategory,
} from './manifest';

export type { Audience, Placement, Section, SiteCategory };
export { AUDIENCE, PLACEMENT, SITE_CATEGORY };

export const REPO_URL = 'https://github.com/tengmesk/webdesigninspo';
export const REPO_BLOB = `${REPO_URL}/blob/main`;

export interface Image {
  /** Site-relative paths; png is also the OG image. */
  png: string;
  webp: string;
  webp640: string;
  width: number;
  height: number;
  alt: string;
}

interface ItemBase {
  slug: string;
  title: string;
  summary: string;
  /** Free tags, lower-case, without the audience pair. */
  tags: string[];
  audience: Audience[];
  /** ISO date: `captured` for recreations, `added` for externals. */
  date: string;
}

export interface ComponentItem extends ItemBase {
  section: 'components';
  kind: 'recreation' | 'external';
  categories: Placement[];
  /** Internal detail page for recreations, the external URL otherwise. */
  href: string;
  external: boolean;
  image: Image;
  source?: { name: string; url: string };
  tech: string[];
  tone: string[];
  verbatimAssets: boolean;
  /** Recreations only. */
  demo?: { path: string; file: string; notesFile: string; sourceUrl: string; notesUrl: string };
}

export interface SiteItem extends ItemBase {
  section: 'sites';
  category: SiteCategory;
  url: string;
  image: Image;
}

export interface ResourceItem extends ItemBase {
  section: 'resources';
  group: 'libraries' | 'galleries';
  /** Label from the v1 category: component library, templates, themes, gallery. */
  kindLabel: string;
  url: string;
}

export type Item = ComponentItem | SiteItem | ResourceItem;

export const SITE_CATEGORY_META: Record<SiteCategory, { label: string; blurb: string; examples: string }> = {
  portfolio: {
    label: 'Portfolio',
    blurb: 'Personal sites of designers, developers and studios: the work first, the person close behind.',
    examples: 'case-study pages, project grids, playful about pages',
  },
  personality: {
    label: 'Personality',
    blurb: 'Sites that are mostly a voice. Writers, founders, speakers; pages that read like a person, not a brand.',
    examples: 'long-form homes, now pages, big-type manifestos',
  },
  product: {
    label: 'Product',
    blurb: 'Marketing sites for software and services, B2B and B2C: hero, proof, pricing, the whole funnel.',
    examples: 'SaaS landings, launch pages, pricing tables',
  },
};

export const PLACEMENT_LABEL: Record<Placement, string> = {
  hero: 'Hero',
  features: 'Features',
  cta: 'CTA',
  trust: 'Trust',
  nav: 'Nav',
  footer: 'Footer',
  background: 'Background',
  card: 'Card',
  button: 'Button',
  gallery: 'Gallery',
  form: 'Form',
  page: 'Page',
};

const V1_KIND_LABEL: Record<ExternalEntry['category'], string> = {
  component: 'Component library',
  template: 'Templates',
  theme: 'Themes',
  inspiration: 'Gallery',
};

const AUDIENCE_FROM_TONE: Record<string, Audience> = { consumer: 'B2C', b2c: 'B2C', enterprise: 'B2B', b2b: 'B2B' };

const unique = <T>(xs: T[]) => [...new Set(xs)];
const lower = (xs: string[]) => unique(xs.map((x) => x.trim().toLowerCase()).filter(Boolean));

/** Which section an entry belongs to. The one place the v1 → model rule lives. */
function sectionOf(e: Entry): Section {
  if (e.section) return e.section;
  if (e.kind === 'recreation') return 'components';
  return 'resources';
}

function audienceOf(e: Entry): Audience[] {
  if (e.audience) return unique(e.audience);
  const tone = e.kind === 'recreation' ? e.tone : e.tags;
  return unique(tone.map((t) => AUDIENCE_FROM_TONE[t.toLowerCase()]).filter((a): a is Audience => Boolean(a)));
}

function tagsOf(e: Entry): string[] {
  const raw = e.tags ?? (e.kind === 'recreation' ? [...e.tone, ...e.tech] : e.tags);
  // Audience words become the controlled pair; the pair itself is not a free tag.
  return lower(raw).filter((t) => !(t in AUDIENCE_FROM_TONE) && !AUDIENCE.map((a) => a.toLowerCase()).includes(t));
}

function image(pngPath: string, publicDir: string, alt: string): Image {
  const base = pngPath.replace(/\.png$/, '');
  for (const p of [pngPath, `${base}.webp`, `${base}-640.webp`]) {
    if (!existsSync(join(publicDir, p))) {
      throw new Error(`Image ${p} is missing. Run \`npm run sync\` (it stages demos and thumbnails before a build).`);
    }
  }
  return { png: pngPath, webp: `${base}.webp`, webp640: `${base}-640.webp`, width: 1200, height: 750, alt };
}

function fail(e: Entry, msg: string): never {
  throw new Error(`manifest.json entry "${e.slug}": ${msg}`);
}

function toComponent(e: Entry, inspo: string, publicDir: string): ComponentItem {
  const categories = e.component_category ?? (e.kind === 'recreation' ? e.placement : undefined);
  if (!categories || categories.length === 0) fail(e, 'a Components entry needs `component_category` (or v1 `placement`)');
  const common = {
    section: 'components' as const,
    slug: e.slug,
    title: e.title,
    summary: e.summary,
    tags: tagsOf(e),
    audience: audienceOf(e),
    categories: unique(categories),
  };
  if (e.kind === 'recreation') {
    const demoPath = `/demo/${e.slug}/`;
    return {
      ...common,
      kind: 'recreation',
      date: e.captured,
      href: `/c/${e.slug}/`,
      external: false,
      image: image(`${demoPath}thumb.png`, publicDir, `Screenshot of the “${e.title}” demo`),
      source: { name: e.source_name, url: e.source_url },
      tech: lower(e.tech),
      tone: lower(e.tone),
      verbatimAssets: e.verbatim_assets,
      demo: {
        path: demoPath,
        file: join(inspo, e.demo),
        notesFile: join(inspo, e.notes),
        sourceUrl: `${REPO_BLOB}/${e.demo}`,
        notesUrl: `${REPO_BLOB}/${e.notes}`,
      },
    };
  }
  if (!e.thumbnail) fail(e, 'an external Components entry needs a `thumbnail` so its card has an image');
  return {
    ...common,
    kind: 'external',
    date: e.added,
    href: e.url,
    external: true,
    image: image(`/sites/${e.slug}.png`, publicDir, `Screenshot of ${e.title}`),
    tech: [],
    tone: [],
    verbatimAssets: false,
  };
}

function toSite(e: Entry, publicDir: string): SiteItem {
  if (e.kind !== 'external') fail(e, 'a Sites entry must be kind "external" (it links to the site)');
  if (!e.site_category) fail(e, `a Sites entry needs \`site_category\` (one of ${SITE_CATEGORY.join(', ')})`);
  return {
    section: 'sites',
    slug: e.slug,
    title: e.title,
    summary: e.summary,
    tags: tagsOf(e),
    audience: audienceOf(e),
    date: e.added,
    category: e.site_category,
    url: e.url,
    image: image(`/sites/${e.slug}.png`, publicDir, `Screenshot of ${e.title}`),
  };
}

function toResource(e: Entry): ResourceItem {
  if (e.kind !== 'external') fail(e, 'a Resources entry must be kind "external"');
  return {
    section: 'resources',
    slug: e.slug,
    title: e.title,
    summary: e.summary,
    tags: tagsOf(e),
    audience: audienceOf(e),
    date: e.added,
    group: e.resource_type ? (e.resource_type === 'gallery' ? 'galleries' : 'libraries') : e.category === 'inspiration' ? 'galleries' : 'libraries',
    kindLabel: V1_KIND_LABEL[e.category],
    url: e.url,
  };
}

export interface Library {
  dir: string;
  generated: string;
  schemaVersion: 1 | 2;
  items: Item[];
  sites: SiteItem[];
  components: ComponentItem[];
  resources: ResourceItem[];
}

let cache: Library | undefined;

/** Load, validate and map the manifest once per build. */
export function library(): Library {
  if (cache) return cache;
  const dir = resolveInspoDir(__INSPIRATION_DIR__);
  const publicDir = join(__INSPIRATION_DIR__, 'public');
  const raw: unknown = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  const m = ManifestSchema.safeParse(raw);
  if (!m.success) throw new Error(`manifest.json: ${m.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  const entries = m.data.entries.map(parseEntry).filter((e) => e.publish === 'true');

  const seen = new Set<string>();
  const items: Item[] = entries.map((e) => {
    if (seen.has(e.slug)) fail(e, 'duplicate slug');
    seen.add(e.slug);
    switch (sectionOf(e)) {
      case 'components':
        return toComponent(e, dir, publicDir);
      case 'sites':
        return toSite(e, publicDir);
      case 'resources':
        return toResource(e);
    }
  });
  // Newest first, then by title for a stable order.
  items.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

  cache = {
    dir,
    generated: m.data.generated,
    schemaVersion: m.data.schema_version,
    items,
    sites: items.filter((i): i is SiteItem => i.section === 'sites'),
    components: items.filter((i): i is ComponentItem => i.section === 'components'),
    resources: items.filter((i): i is ResourceItem => i.section === 'resources'),
  };
  return cache;
}

/** Tag counts across a list (audience first, then free tags by count then name). */
export function tagIndex(items: ItemBase[]): { tag: string; count: number; audience: boolean }[] {
  const counts = new Map<string, number>();
  for (const i of items) for (const t of [...i.audience, ...i.tags]) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts]
    .map(([tag, count]) => ({ tag, count, audience: (AUDIENCE as readonly string[]).includes(tag) }))
    .sort((a, b) => Number(b.audience) - Number(a.audience) || b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Raw files for a recreation's detail page. */
export function demoSource(item: ComponentItem): { html: string; notes: string } {
  if (!item.demo) throw new Error(`${item.slug} has no demo`);
  return { html: readFileSync(item.demo.file, 'utf8'), notes: readFileSync(item.demo.notesFile, 'utf8') };
}
