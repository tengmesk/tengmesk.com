# 05 — Inspiration, a second site

11 Oct 2026 · Inspiration subdomain (SPEC Revision 5) · Status: done (build verified; Cloudflare project not yet created)

## Goal

Give the owner's library of UI recreations and curated resources (`tengmesk/webdesigninspo`) a public home at `inspiration.tengmesk.com`, linked from the main nav, without turning the main site into a bigger site. It had to read as an aggregator of UI libraries, component libraries and design inspiration (closer to Uiverse than Mobbin), look like it belongs to tengmesk.com (same tokens, type, light mode), follow the content repository's consumer contract to the letter, and build on its own in a separate Cloudflare project.

## Decisions

- **A separate Astro project in the same repository** (`inspiration/`, own `package.json`, own `node_modules`), not an npm workspace. The main site's scripts are untouched and neither project needs the other installed; a Cloudflare project with root directory `inspiration/` builds it alone. Root-level `npm run inspiration:build` / `:check` / `:preview` exist for convenience.
- **One source of truth for the design system.** The SITE-PLAN §5 tokens, the reset/nav/menu/section-head/footer/reveal rules and the Latin `@font-face` declarations moved out of `src/styles/` into `shared/styles/` (`tokens.css`, `base.css`, `fonts-latin.css`). Both sites import them. The main site's shipped CSS was diffed rule for rule before and after the move: identical. The Inspiration project resolves the shared file's `@fontsource/…` URLs against its own `node_modules` through a Vite alias, so CI for either project is self-contained.
- **Three sections, per the owner.** Sites (Portfolio | Personality | Product), Components (categorised by the manifest's `placement` vocabulary) and, as our recommendation pending confirmation, a quieter *Resources* area for the external entries (libraries vs galleries), linked from both other sections. The mapping lives in one function so moving them is a one-line change.
- **The manifest is read through a typed adapter.** `inspiration/src/content/manifest.ts` validates schema v1 with zod and also accepts the proposed v2 fields (`section`, `site_category`, `component_category`, `audience`, `tags`); unknown values fail the build naming the slug and the field. `inspo.ts` maps entries to the model: recreations → Components with `placement` as categories and `tone ∪ tech` as tags; externals → Resources by v1 `category`; B2B/B2C derived from `tone` (`consumer` → B2C) until the manifest says so. Only `publish == "true"` (a string, as the contract warns) exists in the model. The proposal for the content repository is `docs/inspiration/MANIFEST-V2-PROPOSAL.md`.
- **Content is staged, not vendored.** `npm run sync` (first step of every build) finds the checkout (`INSPO_DIR`, then `../webdesigninspo`, then a `.cache/` clone that `npm run fetch` makes for CI), copies published demos as-is to `public/demo/<slug>/`, screenshots any demo without a thumbnail with Playwright (1440×900 → 1200×750 PNG for OG, WebP at 1200 and 640 for cards), and prunes anything no longer published. If Playwright cannot launch it draws a neutral placeholder and warns, because the contract says no card ships without an image. The adapter refuses to build if an image is missing, so a stale `public/` cannot slip through.
- **Demos run sandboxed.** `<iframe sandbox="allow-scripts">`, `referrerpolicy="no-referrer"`, `loading="lazy"`; `_headers` drops `X-Frame-Options` for `/demo/*` in favour of `frame-ancestors 'self'` and adds `noindex`; `robots.txt` disallows `/demo/`. The acceptance script evaluates inside the frame and checks `self.origin === "null"`.
- **Filters that work with scripts off.** Every item is in the HTML. Category and tag chips are radio inputs; a build-time `<style>` holds one `:has()` rule per value (`.gallery:has([name=cat][value=hero]:checked) .item:not([data-cat~=hero]) { display:none }`), so the grid filters with no JavaScript at all. 1.3 KB of script adds `?cat=&tag=` URL state (replaceState), a live count and the empty message. Keyboard: Tab to a group, arrows to choose, Enter on Reset.
- **Sites with zero entries is a designed state.** The page states the three categories, what qualifies and what will appear, with a note on how entries arrive, instead of an empty grid; the same component switches to the filterable gallery when the first entry exists.
- **Preview build without underscores.** `npm run build:preview` reuses the main site's `scripts/relativize.mjs` and, because the preview host rejects top-level names starting with `_`, emits hashed assets to `assets/` (not `_astro/`) and removes `_headers`; `scripts/preview-fix.mjs` fails the build if anything underscored remains. Verified over `file://`: fonts, images, the sandboxed iframe and the CSS filters all work.
- **Main nav gains "Inspiration".** The URL comes from `astro:env` (`INSPIRATION_URL`, default `https://inspiration.tengmesk.com/`). On KA pages the label stays English with `lang="en" hreflang="en"`. A seventh item broke the Georgian row at 900–1023 px (957 px needed at 900), and shrinking the row still clipped the CTA, so KA pages now keep the burger menu up to 1023 px and run a tighter row (13 px, 12 px gap, no wrapping) from 1024 to 1179 px. EN keeps the 900 px switch. The acceptance script now checks the burger at 1000 px and a single-line row at 1024, 1100, 1180 and 1240 px.

## What got built

- `inspiration/`: Astro 7 static project. Routes `/`, `/sites/`, `/components/`, `/resources/`, `/c/<slug>/` (two today), `/demo/<slug>/` (raw demos), `/404.html`, `/robots.txt`, `/sitemap-index.xml`, `/og/*.png`.
- Detail pages: sandboxed live demo with a toolbar (open full screen, download `.html`, source on GitHub), "Recreated from <source>" with the capture date and file size, `NOTES.md` rendered with `marked` (frontmatter stripped, headings shifted under the page outline), a `<details>` with the full source, category and tag links back into the filtered gallery, and the licence statement. The footer repeats the MIT licence and design-ownership line on every page.
- Tooling in `inspiration/scripts/`: `sync.mjs`, `fetch-inspo.mjs`, `preview-fix.mjs`, `og.mjs` (four OG cards from the site's own fonts), `shots.mjs` (screenshots and 39 checks), `weights.mjs`.
- `shared/styles/` and the main site importing it; `src/i18n` gained `nav.inspiration`; `astro.config.ts` gained the env schema.
- Docs: SPEC Revision 5, `docs/inspiration/MANIFEST-V2-PROPOSAL.md`, `inspiration/README.md` (run, content source, adapter rules, pages, Cloudflare setup).

### Numbers

`inspiration/scripts/shots.mjs`, all passing: review-status demo `thymos-feature-pillars` absent from the 7 built pages and from `/demo/`; 2 iframes, both `sandbox="allow-scripts"`, both rendering with an opaque origin; 44 external links with `rel="noopener"`; "Recreated from …" on 2/2 detail pages; licence on 7/7 pages; console clean on every page at 1440×900 and 390×844; no horizontal scroll at 390 px; arrow keys select a category and write `?cat=hero`; keyboard Reset clears it and returns focus; `?tag=b2c` pre-selects on load; with JavaScript disabled all items are listed and the `:has()` filter works; reduced motion hides nothing and the hero does not animate; the mobile menu opens with Enter and closes with Escape, focus returning to the burger.

First view, gzipped, from `inspiration/scripts/weights.mjs` (same at 390 and 1440 px; the thumbnails are the only images):

| Page | HTML | JS | Fonts | Images | Total |
|---|---|---|---|---|---|
| `/` | 9.9 KB | 0.6 KB | 96.8 KB | 33.3 KB (2 thumbnails) | 140.6 KB |
| `/sites/` | 7.8 KB | 0.6 KB | 96.8 KB | 0 | 105.3 KB |
| `/components/` | 8.7 KB | 1.3 KB | 96.8 KB | 33.3 KB | 140.0 KB |
| `/resources/` | 8.2 KB | 0.6 KB | 96.8 KB | 0 | 105.6 KB |
| `/c/gifttarot-elements/` | 13.8 KB (source inlined in `<details>`) | 0.6 KB | 96.8 KB | 0 + 4.8 KB demo | 116.1 KB |

Fonts are the four Latin faces only (no Georgian), 97 KB against the 120 KB budget. The stylesheet is inlined, as on the main site.

Main site after the change: `astro check` 0/0/0, all `scripts/shots.mjs` checks pass, `dist-preview/` rebuilt.

## Before / after

Nothing to compare against; this is a new site. In `assets/inspiration/`:

- `home-desktop.png`, `home-mobile.png` — the full home page: hero on the dotted field, the three section tiles with counts, latest components, the Sites trio, resources, how it works.
- `components-desktop.png`, `components-mobile.png`, `components-filtered.png` — the gallery, and the Hero category selected from the keyboard (focus ring on the chip, "1 of 2 components", Reset).
- `sites-desktop.png`, `sites-mobile.png` — the zero-entry state.
- `resources-desktop.png`, `resources-mobile.png` — libraries and galleries as ruled lists.
- `c-thymos-cognitive-graph-*.png`, `c-gifttarot-elements-*.png` — detail pages with the sandboxed demo, notes and facts column.
- `home-reduced-motion.png`, `home-mobile-menu.png`, `404-*.png`.

## Lessons

- A bundled prerender chunk's `import.meta.url` points into `dist/`, so a path helper that worked from `scripts/` found nothing from inside Astro. Passing the project directory in as a Vite `define` from `astro.config` fixed it in one line.
- `location.origin` inside a sandboxed frame reports the URL's origin, not the document's. `self.origin` is the one that says `"null"`. Our first "is it really sandboxed" check was checking the wrong thing.
- A rule that re-declares a grid after a shared mobile override silently wins over it. The Inspiration footer sat in three 92 px columns at 390 px because `site.css` repeated a rule that `base.css` already had. Rule-set diffing caught the main site; a horizontal-scroll check caught this one.
- Chrome hands the preview's `file://` iframe a real opaque origin and still runs the demo, so the preview is a faithful test of the sandbox, not just of the layout.
- Seven nav items is one more than Mkhedruli can afford at 900 px. Measuring with real fonts mattered: the first "fits" result was two labels quietly wrapping to a second line.

## Known gaps

- Resources placement is a recommendation; the owner may prefer libraries under Components and galleries under Sites (one function to change, plus `section` in the manifest).
- Sites has no entries and no taxonomy in the manifest yet; the v2 proposal has to be adopted in `webdesigninspo` before the first site appears.
- Build-time screenshots need Chromium in CI; the placeholder path covers its absence, and committing `thumb.png` per demo in the content repo removes the dependency.
- No Cloudflare project yet; the settings are in `inspiration/README.md`. No deploy workflow, by decision.
- No Lighthouse run on the new site yet; weights and the acceptance checks are the current evidence.

## Next

Owner confirms the Resources placement and the v2 fields; the content repository adopts them and adds the first Sites entries. Then the Cloudflare project for `inspiration/`, the subdomain, and a deploy hook so a content change rebuilds the gallery.
