# NOTES — impeccable entry

## Concept: the trailhead board

A UK/US CEO landing on this page has to decide in under a minute. A trailhead already solves that problem for walkers: a painted board says where you are and what the trail is, fingerposts point at destinations, a distance chart gives the numbers, blazes mark the route, and a register holds what other walkers wrote. The homepage is that board. Two inks on one paper: deep forest green boards, bone off-white notices, brown timber posts and frames (the brief's forest palette, taken as a two-colour print rather than a "nature" illustration). Besley, a Clarendon revival, is the routed signage lettering; Signika, drawn for wayfinding, is the notice text. Contour lines are generated in code (value noise + marching squares in `build.mjs`) and used as the boards' ground, which keeps the brief's terrain motif without a stock illustration.

Page order: trailhead board (positioning, call, "You are here") → four fingerposts (where he can help) → distance chart (numbers, results table, logos, Forbes 30 Under 30) → the route (career as one continuous trail, Bank of Georgia framed exactly as the brief requires) → trail register (seven cleared testimonials) → talks and teaching with the Stamba photos → trail notes (five opinions as blazes) → off the trail (about, personal photos) → health teaser → the close with the call.

## How the skill was used

`impeccable context` → no PRODUCT.md, so `init` ran; with no question tool in this harness, PRODUCT.md was written from the brief with inferences labelled (the skill requires disclosing that substitution, done in the report). `new-work.md`: seven grounded candidates were derived from the audience's world (OS map sheet, field notebook, annual report, trailhead board, supra table, members' club, ops floor); `concept-seed --scope direction --mode persuade` assigned index 4 (trailhead board) and dealt six catalog challengers, each fused and weighed; all declined or competitive, and each donated a discipline that was written into the contract (two-ink commitment from the risograph worlds, one-pane-one-statement and state-as-light from the glazier wall, one continuous ruled section from the daylight section, graticule-measured numbers from the oscilloscope). The direction contract lives in `.impeccable/surfaces/src-index-html.md` with the seed reference. The build was code-led (no image generation in use). `craft-floor.md` was read before the first UI edit. Two inspection rounds (hero fit and capture validity; a tracker layout gap), then the mechanical detector on the served page, then the finish review and documenter run in-thread from the skill's degraded references (no subagent tool here): one material fix (glyph arrows → drawn chevron), verdict ship, DESIGN.md + `.impeccable/design.json` written from the built code.

## Key decisions

- **City tracker as a fingerpost.** "Now: Miami" is a cream arrow board; hover, keyboard focus or tap grows "Coming up" fingers (San Francisco, Los Angeles, Istanbul with dates). Tap is sticky with `aria-expanded`, Escape and outside-tap close it; reduced motion skips the swing. Data read from `data/whereabouts.yaml` at build time, `tbc` entries skipped.
- **Prove with the world's own forms:** a distance chart instead of a metric strip, a ledger instead of testimonial cards, a continuous route instead of a timeline of cards.
- **Logos:** monochrome cream on the green board. `forbes.svg` in the inputs renders a different company's logo (United States Ammo Exchange), so it was not used; `forbes-georgia.svg` stands for Forbes. The Bank of Georgia symbol was recoloured to the palette; Cambridge's white plate was made transparent. Organisations without a logo are typographic wordmarks.
- **Privacy and framing:** no private-list client, no ⚠️ item shown as fact (Halocarbon remit, co-founder wording, Rex ownership of the Loesing quote: attributed as "CEO" only), Bank of Georgia awards framed as "helped lay the agile foundations of a bank that went on to be named…".
- **Health:** one line, no brand, mailto.
- **Newsletter form is UI only, no backend.** Submitting shows an honest message with a one-line mailto; no address is stored. Blog, video, CV, speaker kit and Tbilisi guide are omitted rather than faked.
- **Detector:** the cream-palette finding is accepted because the brief pins off-white paper.

## Verification

Build clean; `screenshots/` captured with Playwright; no console errors or warnings, no external requests, `scrollWidth == clientWidth` at 390 and 1440, one `h1`, tracker works on tap/focus/hover, reduced motion leaves the route drawn and nothing hidden. Page weight: ~53 KB HTML (CSS inlined), 7 woff2 files, hero image 17 KB (600w) with `fetchpriority=high` and preload.

## With more time

Draw the career route onto the hero's contour map itself (the "you are here" marker on the map, not only on the post); a hand-lettered routed style for the name; an OG image generated from the board; per-section anchors in the mobile rail; a backend for the notes list; the speaker kit and Tbilisi guide as real routes once content exists.

## Known gaps

The h1 sets over seven lines at 1440 (the full mandated one-liner in a 7/12 column), accepted at review; the QUALITY BAR card images for the assigned world were not downloaded, so the ceiling check was done without them; the concept-seed telemetry ping was skipped because no attended user resolved the round.
