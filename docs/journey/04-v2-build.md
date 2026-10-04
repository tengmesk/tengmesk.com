# 04 — Building v2.0

4 Oct 2026 · M1 + M3 + M4 collapsed into one build from the site plan · Status: done (staging; domain cutover pending)

## Goal

Turn `docs/redesign/SITE-PLAN.md` into a site. Two pages in two languages, a 404, the contour hero, every fact from `assets/media.yaml`, every string from an i18n dictionary, and a build that works at the GitHub Pages staging URL now, at the root domain later, and on Cloudflare after that. The bar was the plan's acceptance checklist (§11): no "tbc" in the HTML, budgets met, Lighthouse 95/100/100/100, reduced motion verified, keyboard-complete menu.

## Decisions

- **Astro 7, static output, no adapter, no framework.** Vanilla CSS with the §5 tokens as custom properties; 6.9 KB of hand-written JS in total. The plan's component list became `.astro` files one for one; `Home.astro` and `About.astro` render once per language from four thin pages in `src/pages/`.
- **`media.yaml` stays the only content file.** A typed loader (`src/content/media.ts`, zod via `astro/zod`) parses it at build time and turns every literal `tbc` into `undefined`, so a template physically cannot print it. Photos are matched to YAML entries by file path with `import.meta.glob`, so adding a photo is still a YAML edit. The plan's ordering rules (press order, track-record order, hero chips, the McKinsey hold-back) live next to the loader as named constants with a comment pointing at the plan section.
- **Copy as TypeScript, not JSON.** `ka.ts` is typed as `Record<keyof typeof en, string>`, so a missing Georgian key fails `astro check` instead of rendering English by accident.
- **Placeholders per §10, applied literally.** No venture has a confirmed one-liner, so Now renders as the ruled list; the card variant exists and switches on automatically when a `summary` arrives. No `period` → no date column (the `Timeline` adds it when any row has one). No email → LinkedIn is the primary button. McKinsey is out of "Featured in" until the owner confirms he is named. The Forbes quote is shown in Georgian on both pages with an English gloss labelled as such, because the translation is unconfirmed. The interim portrait is used only where the plan requires an image URL (JSON-LD `image` → `/img/tengo-meskhi.jpg`, a 480 px crop of the DEF-AI card); it is not placed on the About page, which the plan leaves to the owner.
- **Hero: one field, two renderers.** `src/lib/contours-core.ts` holds the seeded value noise and marching squares. At build time `contours-svg.ts` chains segments into polylines and emits the static SVG (13 levels, 53 paths, 12 KB raw, 3.7 KB gzipped) that is inlined in the HTML. The canvas island (`src/scripts/contour-field.ts`, 1.7 KB gzipped) samples the same field in the SVG's reference frame (`scale = max(W/1440, H/820)`, top-left aligned, like `preserveAspectRatio="xMinYMin slice"`), so its first frame at t = 0 is the SVG and the swap is invisible. It loads after `document.fonts.ready` and only when the hero is in view; 30 fps cap, DPR ≤ 1.5, pauses off-screen and on hidden tabs, pointer hill on fine pointers only, and it gives up (keeping the SVG) under reduced motion, `saveData`, ≤ 4 cores, or if the first three frames average more than 12 ms. Measured in headless Chromium with software rendering: 2–4 ms per frame.
- **Fonts: hand-written `@font-face` over the `@fontsource` packages.** The packages ship the subset woff2 files but their CSS has no `unicode-range`, which matters here: without ranges, two same-weight faces (Georgian and Latin subsets of Noto) override each other, and an EN page would download Georgian faces for one footer word. `src/styles/fonts.css` declares eleven faces with Google's ranges, woff2 only. Weights were cut to the budget: Geist 400/500 (600 is served by 500), Geist Mono 400, Instrument Serif 400 (no italic, the only pull-quote is Georgian), Noto Serif Georgian 300/400, Noto Sans Georgian 400/500.
- **Mobile menu is a native `<dialog>`.** `showModal()` gives the focus trap, `Esc` and focus return for free; the script toggles `aria-expanded` and a scroll lock. 0.5 KB.
- **Reveals cannot hide content.** The `js` class that enables the fade-in is added by the same module that performs the reveal, after it marks everything already in view, so blocked scripts, `file://`, or reduced motion all show the final state. Found the hard way: the first version set the class inline in `<head>` and the `file://` preview showed thirteen invisible sections.
- **Inline the stylesheet.** 23 KB raw, 5.5 KB gzipped, four pages. Lighthouse on simulated mobile put the external stylesheet on the critical path at 0.6–1.2 s; inlining it moved FCP from 1.9–2.3 s to 1.7–2.0 s. Caching across the two pages loses a 5 KB fetch; first impressions win.
- **Host-agnostic build.** `site` and `base` come from `SITE_URL` / `BASE_PATH`; all internal links go through one `href()` helper. The GitHub Pages workflow defaults to the project-page staging URL and switches to a custom domain via a repository variable. No `CNAME` yet. `public/_headers` carries security headers and immutable caching for `/_astro/*` for the eventual Cloudflare host; other hosts ignore it.
- **A preview build that works from `file://`.** `npm run build:preview` builds to `dist-preview/` and `scripts/relativize.mjs` rewrites every root-relative URL (attributes, `srcset`, CSS `url()`, the meta refresh in `ka.html`) relative to each file, appends `index.html` to directory links, inlines the hoisted module scripts (Chromium refuses module fetches from `file://`), and embeds the woff2 files as data URIs (Chromium refuses `@font-face` fetches from `file://` too). The contour island's dynamic import still fails under `file://` and the page keeps the static SVG, which is the designed no-JS state. The preview's `index.html` is 348 KB because of the embedded fonts; it is a preview.

## What got built

- Routes: `/`, `/about/`, `/ka/`, `/ka/about/`, `/404.html` (bilingual), `/ka.html` (meta-refresh stub to `/ka/` with canonical), `/robots.txt`, `/sitemap-index.xml` with `hreflang` pairs, `/og/*`, `/favicon.svg`, `/apple-touch-icon.png`, `/img/tengo-meskhi.jpg`.
- SEO: titles and descriptions from §9, canonical + `hreflang` (`en`, `ka`, `x-default`), OG `profile`/`website`, `og:locale`, Twitter card, JSON-LD `Person` exactly as §9 specifies (Conceptdigital + Boon as `worksFor`).
- OG images generated by `scripts/og.mjs` (Playwright, run locally, PNG/JPG committed so CI needs no browser): name and chips over the static contour field for home, the speaking photo with a label for About.
- Images through `astro:assets`: AVIF with a WebP fallback, 3–5 widths per slot, `sizes` per slot, crops via CSS `aspect-ratio` + `object-position` from `photos[].focal` so mobile uses the native 3:2 without a second image set. The only eager image is the About hero (23.5 KB AVIF at 1200 w on mobile).
- Tooling: `npm run check` (astro check: 0 errors, 0 warnings, 0 hints), `npm run shots` (screenshots plus the acceptance checks below), `npm run weights` (first-view weight per type vs budget), `npm run og`.
- Deploy: `.github/workflows/deploy.yml`, build → `actions/deploy-pages`, with `npm run check` as a gate.

### Numbers

Lighthouse 13.5, mobile preset, simulated throttling, local server:

| Page | Perf | A11y | BP | SEO | FCP | LCP | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 98 | 100 | 100 | 100 | 1.8 s | 2.1 s | 0 |
| `/ka/` | 97 | 100 | 100 | 100 | 2.0 s | 2.1 s | 0 |
| `/about/` | 97 | 100 | 100 | 100 | 2.0 s | 2.1 s | 0 |
| `/ka/about/` | 99 | 100 | 100 | 100 | 1.7 s | 1.8 s | 0.046 |

First view, gzipped, from `npm run weights` (home at 390 px):

| | EN | KA | Budget |
|---|---|---|---|
| HTML (stylesheet inlined) | 14.7 KB | 15.6 KB | 30 KB |
| CSS (inside the HTML) | 5.5 KB | 5.5 KB | 40 KB |
| JS (5 files, island included) | 3.7 KB | 3.7 KB | 20 KB (island 1.7 of 8) |
| Fonts | 113.5 KB | 111.9 KB | 120 KB |
| Images above the fold | 0 | 0 | 0 |
| Total first view (desktop) | 323 KB | 322 KB | 600 KB |

The desktop totals include 190 KB of On-stage photos that Chromium's lazy-load lookahead fetches ahead of the viewport; nothing is above the fold. The About pages exceed the font budget on purpose: 143 KB (EN) and 132 KB (KA), because the name is set in both display faces side by side, as the plan asks.

Acceptance checks from `scripts/shots.mjs`, all passing: no console errors on any page at 1440×900 and 390×844; no horizontal scroll at 390 px; no "tbc" in the DOM; reduced motion shows the static SVG with the canvas hidden and nothing faded out; the KA nav fits at 900, 1024 and 1180 px; the mobile menu opens with Enter, keeps Tab inside, closes with Esc and returns focus to the burger; the island mounts and reports its frame cost.

## Before / after

Before: the 2019 HTML5 UP template (see `00-kickoff.md`). After, in `assets/v2.0/`:

- `home-en-desktop.png`, `home-ka-desktop.png` — full page at 1440×900. The KA h2s hold their line counts at every breakpoint with the smaller clamps.
- `home-en-mobile.png`, `home-ka-mobile.png` — full page at 390×844; captions sit under the photos, press rows stack outlet over title.
- `home-en-desktop-hero-live.png`, `home-ka-desktop-hero-live.png` — the canvas island running (first frames 2–4 ms).
- `home-en-reduced-motion.png` — the static SVG fallback, byte-identical field.
- `home-en-mobile-menu.png` — the dialog menu with the language selector.
- `about-en-desktop.png`, `about-ka-desktop.png`, `about-en-mobile.png`, `about-ka-mobile.png`, `404-desktop.png`, `404-mobile.png`.

Full-page desktop captures are 690–770 KB as palette PNGs, a little over the journal's 500 KB guideline; they are 7,000 px tall.

## Lessons

- Fontsource's per-subset CSS is not safe to use as-is for a multi-script site. The missing `unicode-range` is the whole problem; the files are fine.
- Chrome matches a font face by weight before it consults `unicode-range`. The KA hero at weight 300 fetched Instrument Serif for the space between the two words. Declaring the Latin 400 file a second time as a 300 face fixed it at no cost; `CSS.getPlatformFontsForNode` over CDP found it in a minute where guessing would have taken an hour.
- Mkhedruli needs its own type scale, as the plan said, and also its own nav gap: the Georgian labels overflowed the 900 px breakpoint by five pixels until the gap became fluid.
- A static SVG hero and a canvas hero only match if they share a coordinate frame, not just a seed. Defining the field in the SVG's viewBox units and scaling like `slice` was the fix.
- `file://` is stricter than any host: no module scripts, no font fetches. Designing the no-JS state properly made the preview trivial.

## Known gaps

- Georgian copy is the plan's draft; a native review is still open (§11, §12.9).
- Owner answers from SITE-PLAN §12 are still pending: one-liners, years, email, CV, portrait, the 10go story in his own words, the McKinsey confirmation. Each has its no-op state in place.
- Fonts on the About pages are 12–23 KB over the 120 KB line (the two-script name pair).
- LCP on `/` and the About pages sits at 2.1 s on Lighthouse's simulated slow 4G; the target is 2.0 s. The remaining cost is the display font swap on the h1.
- No Playwright in CI: screenshots, OG images and the acceptance script run locally. Lighthouse CI is not wired.
- `/journey/` is not rendered yet (v2.1), so the footer's "Built in the open" line is omitted as the plan says.
- No `CNAME`; the staging URL is `https://tengmesk.github.io/tengmesk.com/` once the workflow runs on the default branch. Cloudflare is the long-term host; the same `dist/` deploys there.

## Next

M5 — Georgian review, the owner's answers folded into `media.yaml`, Lighthouse CI on pull requests, the domain cutover. Then v2.1: render this journal at `/journey/`.
