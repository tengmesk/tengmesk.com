# NOTES: tengmesk.com homepage, Hallmark entry

## Concept
A man who ships, shown shipping. The first screen is Tengo on stage at Global Tech Weekend × Forbes
under an oat plate that says the one thing he wants said ("Tech and AI advice that actually ships")
and his own positioning line, third person, with the booking pill. Above the nav runs the live city
line (Now: Miami; hover, focus or tap for Coming up). Below, the page alternates ruled, type-led
sections in Garden's forest material (a $3M old-style figure, results as rows, the career as rows
with employer marks, opinions as rows) with three full photographs: moderating the panel, the
preferred studio headshot, the Dolomites. It closes on the job: "Thirty minutes, no slides", the
booking pill, the email, and an index of his links on the ink-green band.

## How the skill was used
- Pre-flight: empty folder, no signals. Ask-once answered from BRIEF.md (no human available):
  material = the inputs' photos, numbers, quotes, logos; audience = UK/US mid-market CEOs;
  use = book a call; tone = editorial, forest palette (BRIEF §7).
- Genre: editorial (personal/professional profile). Deal: `theme.mjs deal` gave Broadside, Formwork
  and Ink; none can carry deep green, brown and off-white, which are the owner's own words, so the
  theme is **Garden, by request** (oat paper, deep-green ink, one leaf-green signal, a clay tint).
- Draw 4656ca: shape Photographic, hero Corridor, nav banner over a retracting bar, footer index
  columns, leave out Band and Grid, job hire (the enquiry after the work). Taken, with one named
  swap: the hero posture is **Poster** (the editorial genre refuses a centred column, and Photographic
  is built on the Poster hero). In the build the shape became a hybrid, three full pictures between
  ruled rows; the stamp names the fingerprint.
- Scaffold wrote `tokens.css` and `base.css`; the page starts with the stamp, critique line, waivers,
  answers and review records. Hero first, `sloplint --stage hero`, then the sections.
- Reviews ran in-thread (no subagent available): hero review `fix`, 3 findings resolved (plate
  crossing his hand, head size, tracker disclosure); finish review `fix`, 3 resolved.
- Sweep: `sloplint --render` (Chromium via a `--no-sandbox` shim, against the local server):
  **Floor 0 FAIL**, Reflex 1 waived (71, last rows of ruled lists), F4 answered, copy gates as notes
  under `copy: verbatim` (the one-liner is the owner's). The render tier's font warning is a false
  positive from its file:// probe (crossorigin preload); the http shots show the real faces.
- Log entry written to `.hallmark/log.json`.

## Picks (final)
- Shape · Photographic hybrid, draw 4656ca · genre editorial · job hire, the action in the hero,
  the nav and the close
- Theme · Garden (by request: BRIEF §7 forest palette) · Vollkorn 600 over Hanken Grotesk,
  Newsreader captions
- Chrome · nav: banner (city tracker) over a bar that tucks the banner away on scroll · footer:
  index columns under the close
- Hero · Poster: the stage photograph full-bleed, the plate low and left, caption bottom right
- Signature · the stage photograph under the oat plate, with the live city line above the nav
- Sections · Hero · Results ($3M figure, four rows, ten client marks) · Speaking (showcase photo,
  strip of four) · Career (seven rows with marks, three-part record) · About (portrait split, three
  ways, health teaser) · Reviews (one statement quote, two smaller) · Opinions (five rows) · Off the
  clock (Dolomites under a plate) · Footer close and index
- Material · real: every number, quote, logo and photo in the inputs · pictures: the owner's own
  four · absent: newsletter provider, posts, video, CV, speaker kit, Tbilisi guide
- Sweep · Floor 0 FAIL · Reflex 1 (1 waived: 71) · finish-review: in-thread, 3 resolved

## Key decisions
- Tracker: `<button aria-expanded>` plus a sibling paragraph; hover and focus reveal in CSS alone,
  a tap toggles via JS, Escape and outside clicks close it. No JS: the Coming up line shows inline.
- Logos are rasterised at build time into monochrome PNGs in the page's ink (the inputs mix
  white-on-transparent, dark-on-transparent and full-colour files). **The supplied `forbes.svg`
  embeds an unrelated bitmap (a "United States Ammo Exchange" mark), so Forbes is shown with the
  `forbes-georgia.svg` mark.** Bank of Georgia (symbol only) and Cambridge are keyed on darkness.
- Bank of Georgia awards use the brief's framing sentence verbatim; nothing marked ⚠️ is shown
  (no co-founders, no Halocarbon results, the Rex-attributed quote is left out).
- Only inputs' photos; fonts self-hosted from `@fontsource`; no third-party requests at runtime.
- Newsletter: omitted rather than faked (no provider yet). Blog, video, CV, speaker kit and the
  Tbilisi guide are not linked; "What inspires him" goes to inspiration.tengmesk.com.

## With more time
Clean vector logo files (especially Forbes), a dark mode derived from the ink band, the newsletter
form once a provider exists, the speaker kit page behind "Invite him to speak", and a short intro
video in the hero slot (the plate and scrim are ready for it).

## Known gaps
- Word count is 722 against Hallmark's 450 guideline: the brief's eight must-haves and the career
  record earn it; the hero line is the owner's 15-word positioning (stamped `copy: verbatim`).
- One 1440 screen (the career rows) holds ~136 words.
- The hero plate still brushes Tengo's gesturing hand at 1920 wide.
- The render tier's screenshots live in `out/.hallmark/` only during the lint; removed from the build.
