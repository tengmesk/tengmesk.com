# tengmesk.com homepage (bake-off entry: frontend-design)

Static, hand-written HTML/CSS/JS. A small Node build script renders the page, reads the
city tracker data at build time, processes images with sharp and copies self-hosted fonts.
No framework, no runtime dependencies, nothing hot-linked.

## Requirements
Node 20+ (tested on Node 22). Playwright is only needed for screenshots and the OG image.

## Install, run, build
```bash
npm install          # sharp, yaml and the two @fontsource-variable font packages
npm run build        # → out/ (index.html + assets); reads content/whereabouts.yaml
npm run serve        # serves out/ at http://localhost:4173/
npm run dev          # rebuilds on changes to src/ and content/
npm run screenshots  # screenshots/*.png, out/og.jpg, plus console / overflow / tracker /
                     # reduced-motion checks (uses the preinstalled Playwright at /opt/node22)
```
`out/` is committed as the static build. Serve it from `/` with any static server.

## Where things live
- `content/whereabouts.yaml` — the city tracker. Roger updates this weekly; rebuild to publish.
  `tbc` or empty values are skipped, dates render as "4 Nov", "from 4 Dec".
- `src/index.html` — the page. `{{PLACEHOLDERS}}` are filled by `build.mjs` (tracker, pictures, logos).
- `src/styles.css`, `src/main.js` — styles and the small script (tracker, newsletter stub, load sequence).
- `src/og.html` — the Open Graph card; `npm run screenshots` renders it to `out/og.jpg`.
- `src/assets/raw/` — source photos and logos copied from the bake-off inputs.
- `build.mjs` — image pipeline (responsive webp, the duotone portrait), logo preparation, template render.

## Editing notes
- Palette tokens are in `:root` in `styles.css` and mirrored as `INK` / `PAPER` in `build.mjs`
  (used for the portrait duotone and the Bank of Georgia logo variants).
- Logos are single-colour CSS masks (`.logo` with `--mask`), so they take the colour of their
  section. Add a logo by dropping the file in `src/assets/raw/logos/`, listing it in `logoFiles`
  in `build.mjs`, and calling `logo(ratios, file, name)`.
- Images: add an entry to `images` in `build.mjs` and use `picture(manifest, name, {...})`.
  Processed files are cached in `out/img/`; delete them to regenerate.
