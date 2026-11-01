# tengmesk.com — homepage (MotionSites entry)

Static, hand-written HTML/CSS/JS with a two-step Node build. No framework, no CDN, no third-party requests at runtime: fonts, images and logos are self-hosted under `out/assets/`.

## Install
```bash
npm install            # js-yaml, sharp, @fontsource/instrument-serif, @fontsource/inter
```
Node 18+ (built on Node 22).

## Build
```bash
npm run assets         # one-off: cut-out portrait, resized photos, OG image, logos, fonts → out/assets/
npm run build          # src/ + whereabouts.yaml → out/index.html
```
`scripts/build.mjs` reads `../../inputs/data/whereabouts.yaml` (override with `WHEREABOUTS=/path/file.yaml`; it also keeps a snapshot at `data/whereabouts.yaml` and falls back to it). The city tracker ("Now: … / Coming up: …") is rendered from that file at build time; no city is hard-coded in the markup. Re-run `npm run build` whenever the YAML changes.

`scripts/prepare-assets.mjs` reads the bake-off inputs (`../../inputs/images`, `../../inputs/logos`; override with `INPUTS=`).

## Run
```bash
npm run dev            # builds, then serves out/ at http://localhost:8080
```
Or any static server pointed at `out/` (all asset paths are relative, so `/` or a sub-path both work).

## Screenshots + QA
```bash
npm run shoot          # Playwright (preinstalled at /opt/node22): screenshots/*.png + a QA report (console, requests, overflow, fonts)
```

## Layout of the source
- `src/index.html` — the page; `<!-- TRACKER -->`, `{{NOW_CITY}}`, `{{BASE_CITY}}` are filled by the build; CSS/JS are inlined from
- `src/styles.css`, `src/main.js`
- `scripts/` — `prepare-assets.mjs`, `build.mjs`, `shoot.mjs`
- `SPEC.md` — the design spec written before the build (MotionSites web-builder workflow)
- `NOTES.md` — concept, decisions, gaps
