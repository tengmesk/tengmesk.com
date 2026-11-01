# tengmesk.com — homepage (bake-off entry: ui-ux-pro-max)

Static homepage for Tengo Meskhi. Vanilla HTML/CSS/JS with a small Node build step that reads the
whereabouts data, generates the contour-line motif, resizes photos and copies self-hosted fonts.
No framework, no runtime dependencies, nothing hot-linked.

## Requirements

- Node 20+ (tested on Node 22)

## Install

```bash
npm install
```

Installs the build-time dependencies only: `sharp` (images), `js-yaml` (data) and the two
`@fontsource-variable/*` packages whose `.woff2` files are copied into `out/fonts/`.

## Build

```bash
npm run build          # → out/
```

## Run locally

```bash
npm run dev            # build, then serve out/ at http://localhost:8080
# or, for an existing build:
npm run serve
```

Any static server works; the page is served from `/` and uses relative URLs only.

## Screenshots and checks

```bash
npm run shots          # writes screenshots/*.png and prints the check results as JSON
```

`scripts/screenshots.mjs` starts a throwaway static server, captures `desktop-hero.png` (1440×900),
`desktop-full.png` (1440 wide) and `mobile-full.png` (390 wide), and reports console errors,
failed requests, the single-h1 check, missing alt text, 390px horizontal overflow, the city tracker's
keyboard/hover/tap behaviour and the reduced-motion state. Playwright is expected at
`/opt/node22/lib/node_modules/playwright` (as preinstalled in the bake-off environment); change the
import path at the top of the script if yours lives elsewhere.

## Editing

| What | Where |
|---|---|
| Copy, sections, links, metadata | `src/index.html` |
| Styles and design tokens | `src/styles.css` (tokens at the top of the file) |
| Behaviour (tracker, menu, reveal, marquee, newsletter) | `src/main.js` |
| Where Tengo is now / next | `data/whereabouts.yaml` (same format as `bakeoff/inputs/data/whereabouts.yaml`; rebuild after editing) |
| Photos and logos (originals) | `src/assets/photos/`, `src/assets/logos/` |
| Image sizes / crops / OG image | `PHOTOS` table in `scripts/build.mjs` |
| Design system (ui-ux-pro-max output + page overrides) | `design-system/tengmesk-com/MASTER.md`, `design-system/tengmesk-com/pages/home.md` |

The tracker markup is injected at build time where the HTML has `<!-- @tracker:nav -->` and
`<!-- @tracker:hero -->`; the contour SVGs at `<!-- @contours:hero -->` / `<!-- @contours:band -->`;
`{{base}}` and `{{year}}` are simple placeholders. Values of `tbc` or empty strings in the YAML are never rendered.

## Output

`out/` contains `index.html`, `styles.css`, `main.js`, `fonts/`, `assets/img/` (responsive WebP +
`og.jpg`), `assets/logos/`, `robots.txt` and `sitemap.xml`. Total build is about 3 MB on disk; a
first desktop view transfers roughly 250 KB.
