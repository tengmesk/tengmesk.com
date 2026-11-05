# tengmesk.com homepage (Hallmark entry)

Static, hand-written HTML, CSS and a few lines of JavaScript. A Node build script reads the
whereabouts data, resizes the photographs, recolours the logos and writes `out/`.

## Install

```sh
npm install
```

Node 18 or later. The only runtime dependencies are `yaml` (reads the whereabouts file),
`sharp` (images) and the three `@fontsource` packages (self-hosted fonts). `puppeteer-core` is
only there for the Hallmark lint's render tier.

## Build

```sh
npm run build          # writes out/index.html and assets
```

`build.mjs` reads `data/whereabouts.yaml` in this folder if it exists, otherwise
`../../inputs/data/whereabouts.yaml`, or the path in `WHEREABOUTS=...`. The city tracker
("Now: Miami", "Coming up: ...") is rendered from that file at build time; nothing about
cities is written in the markup. Re-run the build whenever Roger updates the file.

Photographs and logos are read from `../../inputs/` (set at the top of `build.mjs`).

## Run

```sh
npm run serve          # serves out/ at http://localhost:4173/
```

Any static server works: `out/` is plain files served from `/`.

## Screenshots and checks

```sh
npm run shots          # Playwright: screenshots/ plus console, 390px overflow, tracker and fold checks
```

## Files

- `src/index.html` the page template (`{{...}}` placeholders are filled by the build)
- `src/styles.css` the page's stylesheet, stamped for Hallmark; imports `tokens.css` and `base.css`
- `src/tokens.css`, `src/base.css` the Hallmark scaffold (Garden theme tokens, the shared scale)
- `src/main.js` the tracker toggle (tap) and the banner that tucks away on scroll
- `build.mjs`, `serve.mjs`, `shots.mjs` build, serve, screenshots
