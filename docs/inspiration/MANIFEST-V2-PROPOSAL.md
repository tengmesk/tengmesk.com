# webdesigninspo manifest — proposal for schema v2

For the maintainer of `tengmesk/webdesigninspo`. Written from the consumer side (the Inspiration site in `tengmesk.com/inspiration/`), which already reads these fields when they appear and falls back to the v1 rules when they do not. Nothing here is required for the current site to build; it is what the site needs to grow past the v1 taxonomy.

Status: proposal · 2026-10-11 · schema_version 1 → 2

## Why

The Inspiration site has three top-level sections, decided by the owner:

| Section | Categories | Today's source in v1 |
|---|---|---|
| **Sites** — whole sites, linked out, with a screenshot | `portfolio` · `personality` · `product` | nothing; v1 has no site entries and no site taxonomy |
| **Components** — recreations, framed live | the `placement` vocabulary (`hero`, `features`, `cta`, `trust`, `nav`, `footer`, `background`, `card`, `button`, `gallery`, `form`, `page`) | `kind: recreation`, `placement` |
| **Resources** — curated external libraries and galleries | `libraries` · `galleries` | `kind: external`, `category` |

Plus tags on anything, with an audience pair (`B2B`, `B2C`) that filters like a tag but is controlled.

v1 carries the right data for Components and Resources, and nothing for Sites. Rather than infer forever, add five optional fields so the content repository states the section, the category and the audience itself.

## The fields

All optional on every entry, so an unchanged v1 manifest keeps validating under v2.

| Field | Type | Allowed values | Applies to |
|---|---|---|---|
| `section` | string | `sites` · `components` · `resources` | any entry; overrides the v1 inference |
| `site_category` | string | `portfolio` · `personality` · `product` | required when `section: sites` |
| `component_category` | string or string[] | the `placement` vocabulary | `section: components`; defaults to `placement` on recreations |
| `audience` | string[] | `B2B` · `B2C` | any entry |
| `resource_type` | string | `library` · `gallery` | `section: resources`; overrides the v1 inference from `category` |
| `tags` | string[] | free text, lower-case, no spaces (use hyphens) | any entry; on recreations it replaces `tone ∪ tech` as the displayed tags when present |
| `thumbnail` | string or null | path inside the repo, e.g. `links/<slug>.png` | now also valid on `kind: external` entries; **required** for `section: sites` and for external entries in `section: components` (every card needs an image) |

`schema_version` becomes `2` and `vocab` gains `section`, `site_category` and `audience` so `build_manifest.py --check` can validate them.

## Inference the consumer applies when the fields are absent (v1 behaviour)

Keep these in mind, because they are what v2 is replacing:

- `kind: recreation` → `section: components`, `component_category: placement`, tags `tone ∪ tech`.
- `kind: external` with `category` `component` / `template` / `theme` → `section: resources` (group *libraries*); `category: inspiration` → `section: resources` (group *galleries*).
- `audience` is derived from `tone` (recreations) or `tags` (externals): `consumer` → `B2C`; `enterprise` or `b2b` → `B2B`. The derivation drops those words from the free tags.

Unknown values for `section`, `site_category`, `component_category` or `audience` fail the consumer's build with the slug and the field, exactly like an unknown `placement` fails `build_manifest.py`.

## Frontmatter examples

A site entry (new; lives in `links/` because it is an external link, with a screenshot next to it):

```yaml
---
title: Linear
slug: linear
kind: external
category: inspiration          # v1 field, still required
section: sites
site_category: product
url: https://linear.app/
thumbnail: links/linear.png    # 1200×750 or larger, 16:10, your own screenshot
audience: [B2B]
tags: [saas, dark, motion, pricing]
summary: The reference B2B product site of the decade; restraint, type and a hero that explains itself.
added: 2026-10-11
publish: true
---
```

A recreation with explicit v2 fields (everything else unchanged):

```yaml
---
title: Tarot ornamental elements bundle
slug: gifttarot-elements
kind: recreation
category: component
placement: [hero, background, card, button]
section: components            # optional; this is the default for recreations
component_category: [hero, background, card, button]
audience: [B2C]
tags: [ornate, dark, css, js]
tone: [ornate, dark, consumer]
tech: [css, js]
# … source_name, source_url, captured, verbatim_assets, publish as today
---
```

An external library, pinned to Resources explicitly:

```yaml
section: resources
audience: [B2B, B2C]
```

## Two decisions still with the owner

1. **Where the external entries live.** The site puts them in a third, quieter *Resources* area (libraries vs galleries), linked from both Sites and Components. If the owner prefers libraries under Components and galleries under Sites, the consumer changes one function (`sectionOf()` in `inspiration/src/content/inspo.ts`); the manifest can then say `section: components` on shadcn/ui and `section: sites` on Mobbin, with a `thumbnail` each.
2. **Thumbnails as part of the repo.** The consumer screenshots recreations at build time when `thumbnail` is null. Committing `thumb.png` per demo (the `build_manifest.py` script already picks it up) makes builds deterministic and removes the need for a browser in CI.

## Manifest JSON after the change

```json
{
  "schema_version": 2,
  "vocab": {
    "kind": ["recreation", "external"],
    "category": ["component", "template", "theme", "inspiration"],
    "placement": ["hero", "features", "cta", "trust", "nav", "footer", "background", "card", "button", "gallery", "form", "page"],
    "section": ["sites", "components", "resources"],
    "site_category": ["portfolio", "personality", "product"],
    "audience": ["B2B", "B2C"],
    "publish": ["true", "review", "false"]
  },
  "entries": [ "… as today, each entry carrying the optional fields above …" ]
}
```

`publish` stays a string; public consumers render only `"true"`.
