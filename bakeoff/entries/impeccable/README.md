# tengmesk.com — homepage (bake-off entry: impeccable)

Static homepage for Tengo Meskhi. Vanilla HTML/CSS/JS assembled by a small Node build script that reads the whereabouts data at build time, inlines the stylesheet, copies self-hosted fonts and images, and generates the contour-line ground as SVG. No framework, no runtime dependencies, nothing hot-linked.

## Install

```sh
npm install
```

Requires Node 22. Dependencies: `js-yaml` (build-time YAML), `@fontsource/besley` and `@fontsource/signika` (the self-hosted fonts copied into `out/fonts/`).

## Build

```sh
npm run build        # node build.mjs → writes ./out
```

`out/` is the deployable static site (`index.html`, `main.js`, `assets/`, `fonts/`). It expects to be served from `/`.

## Run locally

```sh
npm run serve        # http-server out -p 8080
```

Then open http://127.0.0.1:8080/.

## Screenshots and checks

```sh
npm run screenshots  # needs the local server running; uses the preinstalled Playwright
```

Writes `screenshots/desktop-hero.png` (1440×900), `desktop-full.png` (1440, full page), `mobile-full.png` (390, full page), and runs the checks: console errors, external requests, horizontal overflow, one `h1`, the city tracker on tap / keyboard focus / hover, and `prefers-reduced-motion`.

## Editing

- **Copy and structure:** `src/index.html` (a template; `{{PLACEHOLDERS}}` are filled from the data at build time).
- **Styles:** `src/styles.css` (inlined into the page on build). Tokens are documented in `DESIGN.md`.
- **Behaviour:** `src/main.js` (tracker toggle, route draw-on, entrance, newsletter form message).
- **Whereabouts:** `data/whereabouts.yaml`. Rebuild after editing; the hero's "Now / Coming up" post and the footer date come from it. Entries with `tbc` cities are skipped; dates may be `YYYY-MM-DD`, `YYYY-MM`, empty or `tbc`.
- **Images:** `src/assets/img/` (resized WebP/JPEG derived from `bakeoff/inputs/images`; each carries a provenance sidecar `*.json`). Logos: `src/assets/logos/`.

## Files

- `PRODUCT.md`, `DESIGN.md`, `.impeccable/` — product and design-system records from the impeccable skill process (surface brief with the direction contract, review captures, finish review).
- `NOTES.md` — concept, decisions, gaps.
