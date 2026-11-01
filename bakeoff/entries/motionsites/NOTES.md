# NOTES — motionsites entry

## Concept
"Every side of the table." A forest-green ghost-type stage: Tengo's cut-out portrait stands in front of a giant serif "Meskhi", a three-line serif headline sets the positioning in his own words (faster growth, leaner operations, tech & AI that ships), and the whereabouts chip ("Now: Miami") is a living detail that unfolds "Coming up: San Francisco · Los Angeles · Istanbul" on hover, focus, keyboard or tap. Below, the page alternates paper and forest "sheets": the career arc (the proof that he has sat on every side), numbers and client results, where he can help (Advise / Build / Grow, with the Halocarbon fractional-CMO role showing range), his five takes, speaking & teaching, Clutch testimonials, the personal story with adventure photos, the one-line health teaser, and the contact block.

## How the skill was used
Followed the MotionSites web-builder workflow end to end: (1) brief → five decisions (mood "forest, grounded, sharp, warm"; signature = ghost-type stage + living tracker chip); (2) read the three closest examples (3D Jack Portfolio for name-as-hero + portrait, Portfolio Cosmic for the serif/Inter system and sheet sections, Mostar Guide for vanilla precision), plus craft.md and the type/scroll/layout/surfaces technique files; (3) media: Tengo's own assets only — the shelf was reviewed (sheet-1) but nothing there fits a personal profile, so no stand-in media was used; the headshot was knocked out in code (flood fill on the seamless studio background, in `scripts/prepare-assets.mjs`); (4) wrote `SPEC.md` with real values before coding; (5) built from the skill's recipes (fail-safe entrance system, masked line pull-up, serif-italic accents, viewport reveals, count-ups, seamless marquee, mobile overlay menu, sheet transitions, grain); (6) three look-and-fix rounds with a Node port of `shoot.py` (`scripts/shoot.mjs`, since Python Playwright is not installed). Round 1 found reveals not firing in the capture (smooth-scroll vs the script), a mottled cut-out, a block-rendering Cambridge PNG, missing tracker dates (js-yaml Date objects) and unreplaced placeholders; round 2 fixed a 66px mobile layout overflow from the contact grid and the mobile ghost word; round 3 tightened the mobile hero.

## Key design decisions
- Palette: forest `#0F2318` / paper `#F1ECE1` / bark `#7A5230` (accent on three element types only: live dot, eyebrow rules, italic accents on paper). Instrument Serif + Inter, self-hosted.
- Third person, Twain/Hormozi tone, numbers first; Bank of Georgia awards use the brief's exact framing ("helped lay the agile foundations of a bank that went on to be named…"); Boon is never mentioned; private/not-cleared clients are absent; the Rex testimonial is attributed to "Jonathan Loesing, CEO" without the company because that link is marked ⚠️.
- The supplied `forbes.svg` embeds a wrong image (a "United States Ammoexchange" bitmap), so the page uses `forbes-georgia.svg`, which is also the relevant relationship (30 Under 30, client).
- Tracker data is built from `whereabouts.yaml` (`npm run build`); date ranges are formatted ("4–13 Nov", "from 4 Dec").
- Newsletter: UI only, no backend. Submitting shows an honest message pointing to the public email. Blog, intro video, CV download, speaker kit and Tbilisi guide are omitted rather than faked ("Invite him to speak" and the health line go to mailto).
- Reduced motion: every animation/transition off, count-ups print final values, marquee becomes a scrollable row, parallax and pulse off. Rest state is always visible (no JS → no hidden content).

## Verification
Build OK; Playwright QA at 1440×900 and 390×844: 0 console errors/warnings, 0 failed requests, 0 broken images, 1 h1, fonts loaded, `scrollWidth == viewport` at 390 (no horizontal scroll), reduced-motion capture shows the full page at rest. Screenshots in `screenshots/`.

## With more time
Lighthouse pass on a real server; a short-viewport laptop pass (900px wide × 700px tall); an `inspiration.tengmesk.com`-style journal section once posts exist; a proper speaker-kit route; OG image composed from the cut-out on forest instead of the stage photo; tune the cut-out edge with a real matting tool.

## Known gaps
- Newsletter form has no backend (by design, see above).
- No nav active-section state; no blog/video/CV/speaker-kit content (not provided).
- The cut-out is algorithmic (flood fill): fine at display size, slight hair-edge softness at 2×.
- `out/` includes the full logos folder, including unused files.
