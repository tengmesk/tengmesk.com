# inspiration.tengmesk.com

"Inspiration": a gallery of web UI worth learning from, published from the content repository [`tengmesk/webdesigninspo`](https://github.com/tengmesk/webdesigninspo). Three sections: **Sites** (Portfolio · Personality · Product), **Components** (recreations, categorised by the manifest's `placement` vocabulary) and **Resources** (external libraries and galleries). English only. Same design tokens, fonts and base styles as the main site, imported from [`../shared/styles/`](../shared/styles/).

Its own Astro project with its own `package.json`; nothing here is needed to build the main site, and the main site is not needed to build this one.

## Run

```sh
cd inspiration
npm install
npm run dev            # http://localhost:4321 (runs sync first)
npm run build          # sync + static site in dist/
npm run build:preview  # dist-preview/ with relative URLs; works over file://, no "_" names at the top level
npm run check          # astro check
npm run sync           # stage demos + thumbnails from the content repo (part of build)
npm run fetch          # clone/update the CI cache of the content repo (only when no checkout is found)
npm run og             # regenerate public/og/*.png (needs Playwright)
npm run shots          # screenshots + acceptance checks from dist/ (needs Playwright)
npm run weights        # first-view page weight per type
```

Node 22 or newer.

## Content source

The site reads **only** `manifest.json` from a webdesigninspo checkout, following [`docs/CONSUMERS.md`](https://github.com/tengmesk/webdesigninspo/blob/main/docs/CONSUMERS.md) in that repository. The checkout is found in this order (`scripts/lib/inspo-dir.mjs`):

1. `INSPO_DIR` (absolute or relative path; must contain `manifest.json`),
2. the sibling checkout `../webdesigninspo` next to this repository (the default),
3. `inspiration/.cache/webdesigninspo`, which `npm run fetch` (and `npm run sync`, when nothing else is found) clones from `INSPO_REPO` (default `https://github.com/tengmesk/webdesigninspo`) at `INSPO_REF` (default `main`).

Nothing is ever written into the checkout.

`npm run sync` (first step of every build) stages, for every entry with `publish == "true"`:

| From the checkout | To | Notes |
|---|---|---|
| `demos/<slug>/index.html` | `public/demo/<slug>/index.html` | Copied as-is; served at `/demo/<slug>/`, framed with `sandbox="allow-scripts"`. |
| `thumbnail` if set, else a Playwright screenshot of the demo | `public/demo/<slug>/thumb.png` (1200×750, also the OG image), `thumb.webp`, `thumb-640.webp` | If Playwright cannot launch, a neutral placeholder is drawn and the build warns. No card ever ships without an image. |
| `thumbnail` of a v2 Sites entry | `public/sites/<slug>.png` + webp | Placeholder when missing. |

Anything under `public/demo/` or `public/sites/` that is no longer published is deleted. Both folders are git-ignored.

### The adapter

`src/content/inspo.ts` validates the manifest with zod (`src/content/manifest.ts`) and maps it to the site model. Schema v1 has no section fields, so:

- `kind: recreation` → **Components**; categories = `placement`; tags = `tone` ∪ `tech`.
- `kind: external`, category `component` / `template` / `theme` → **Resources › Libraries**; category `inspiration` → **Resources › Galleries**.
- Audience tags (`B2B` / `B2C`) are derived from `tone` (`consumer` → B2C, `enterprise`/`b2b` → B2B) until the manifest carries `audience`.

The proposed v2 fields (`section`, `site_category`, `component_category`, `audience`, `tags`) override those rules entry by entry; see [`../docs/inspiration/MANIFEST-V2-PROPOSAL.md`](../docs/inspiration/MANIFEST-V2-PROPOSAL.md). Unknown values for any controlled vocabulary fail the build with the slug and the field. `publish` is a string; only `"true"` is rendered.

Where the external entries live is a recommendation pending the owner's confirmation. To move them (say, libraries under Components and galleries under Sites), change `sectionOf()` in `src/content/inspo.ts`; the pages take the result from the model.

## Pages

| Route | What |
|---|---|
| `/` | Intro, the three sections in brief, how it works. |
| `/sites/` | Sites gallery with category + tag filters; with no entries it explains the three categories instead of showing an empty grid. |
| `/components/` | Components gallery with category + tag filters. |
| `/resources/` | Libraries and galleries, as a ruled list. |
| `/c/<slug>/` | Recreation detail: sandboxed live demo, "Recreated from …" credit, rendered `NOTES.md`, view source / download / GitHub link, tags, licence. |
| `/demo/<slug>/` | The raw demo (framed by the detail page; `noindex`, `Disallow` in robots.txt). |
| `/404.html`, `/robots.txt`, `/sitemap-index.xml`, `/og/*.png` | Build outputs. |

Filtering works without JavaScript: every item is in the HTML and radio chips filter through CSS `:has()`. The small script adds `?cat=&tag=` URL state, a live count and the empty message. Reduced motion is honoured on the pages and inside the demos.

## Deploy (Cloudflare)

Host-agnostic static output: no adapter, no deploy workflow in this repository. Set it up as a **separate Cloudflare project** from the main site:

| Setting | Value |
|---|---|
| Repository | `tengmesk/tengmesk.com` |
| Root directory | `inspiration` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 22 (`NODE_VERSION=22`) |
| Environment variables | `SITE_URL=https://inspiration.tengmesk.com` (default already), optional `INSPO_REF` to pin a branch/tag of the content repo |
| Custom domain | `inspiration.tengmesk.com` (CNAME to the project; the apex `tengmesk.com` is the main site's project) |

In CI there is no sibling checkout, so `npm run sync` clones the content repo into `.cache/` over HTTPS (public repo, no token). Thumbnails are screenshotted with Playwright when the manifest has none; if the build image cannot launch Chromium, the placeholder path kicks in and the log says so. To avoid that entirely, commit a `thumb.png` per demo in webdesigninspo (the manifest then carries `thumbnail`). A content change in webdesigninspo needs a rebuild here (deploy hook or a manual redeploy).

`public/_headers` carries security headers, long caching for `/_astro/*`, and for `/demo/*` drops `X-Frame-Options` in favour of `frame-ancestors 'self'` plus `X-Robots-Tag: noindex`. Cloudflare honours the file; other hosts ignore it.

The main site links here from its nav; the URL is the main site's `INSPIRATION_URL` env (default `https://inspiration.tengmesk.com/`).
