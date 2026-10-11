/**
 * manifest.json schema: webdesigninspo schema v1 (docs/CONSUMERS.md) plus
 * the optional v2 fields proposed in docs/inspiration/MANIFEST-V2-PROPOSAL.md.
 * Unknown *keys* pass through (forward compatible); unknown *values* for any
 * controlled vocabulary fail the build with the entry's slug and the field.
 */
import { z } from 'astro/zod';

export const PLACEMENT = ['hero', 'features', 'cta', 'trust', 'nav', 'footer', 'background', 'card', 'button', 'gallery', 'form', 'page'] as const;
export const V1_CATEGORY = ['component', 'template', 'theme', 'inspiration'] as const;
export const PUBLISH = ['true', 'review', 'false'] as const;
export const SECTION = ['sites', 'components', 'resources'] as const;
export const SITE_CATEGORY = ['portfolio', 'personality', 'product'] as const;
export const AUDIENCE = ['B2B', 'B2C'] as const;
export const RESOURCE_TYPE = ['library', 'gallery'] as const;

export type Placement = (typeof PLACEMENT)[number];
export type Section = (typeof SECTION)[number];
export type SiteCategory = (typeof SITE_CATEGORY)[number];
export type Audience = (typeof AUDIENCE)[number];
export type V1Category = (typeof V1_CATEGORY)[number];

const oneOrMany = <T extends z.ZodType>(s: T) => z.union([s, z.array(s)]).transform((v) => (Array.isArray(v) ? v : [v]));

/** Fields every entry may carry in schema v2 (all optional so v1 validates). */
const v2 = {
  section: z.enum(SECTION).optional(),
  site_category: z.enum(SITE_CATEGORY).optional(),
  component_category: oneOrMany(z.enum(PLACEMENT)).optional(),
  audience: z.array(z.enum(AUDIENCE)).optional(),
  resource_type: z.enum(RESOURCE_TYPE).optional(),
  tags: z.array(z.string().min(1)).optional(),
};

const base = {
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'slug must be lowercase a-z, 0-9 and hyphens'),
  summary: z.string().min(1),
  publish: z.enum(PUBLISH),
  notes: z.string().min(1),
  ...v2,
};

export const RecreationSchema = z.looseObject({
  ...base,
  kind: z.literal('recreation'),
  category: z.enum(V1_CATEGORY),
  placement: z.array(z.enum(PLACEMENT)).min(1),
  tone: z.array(z.string()).default([]),
  tech: z.array(z.string()).default([]),
  source_name: z.string().min(1),
  source_url: z.url(),
  captured: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'captured must be YYYY-MM-DD'),
  verbatim_assets: z.boolean(),
  demo: z.string().min(1),
  thumbnail: z.string().nullable(),
});

export const ExternalSchema = z.looseObject({
  ...base,
  kind: z.literal('external'),
  category: z.enum(V1_CATEGORY),
  url: z.url(),
  tags: z.array(z.string()).default([]),
  added: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'added must be YYYY-MM-DD'),
  thumbnail: z.string().nullable().optional(),
});

export const EntrySchema = z.discriminatedUnion('kind', [RecreationSchema, ExternalSchema]);

export const ManifestSchema = z.looseObject({
  schema_version: z.union([z.literal(1), z.literal(2)]),
  generated: z.string(),
  vocab: z.record(z.string(), z.array(z.string())).optional(),
  entries: z.array(z.unknown()),
});

export type RecreationEntry = z.infer<typeof RecreationSchema>;
export type ExternalEntry = z.infer<typeof ExternalSchema>;
export type Entry = RecreationEntry | ExternalEntry;

/** Validate one entry; the error names the slug, the field and the allowed values. */
export function parseEntry(raw: unknown, index: number): Entry {
  const r = EntrySchema.safeParse(raw);
  if (r.success) return r.data;
  const slug = typeof raw === 'object' && raw && 'slug' in raw ? String((raw as { slug: unknown }).slug) : `#${index}`;
  const lines = r.error.issues.map((i) => {
    const path = i.path.join('.') || '(entry)';
    const got = 'received' in i ? ` (got ${JSON.stringify((i as { received: unknown }).received)})` : '';
    return `  - ${path}: ${i.message}${got}`;
  });
  throw new Error(`manifest.json entry "${slug}" is not valid:\n${lines.join('\n')}`);
}
