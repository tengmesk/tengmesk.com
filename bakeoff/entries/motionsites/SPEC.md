# tengmesk.com · "Every side of the table"

Build spec written before code (MotionSites web-builder, step 4). Values are real; the build follows this file.

## 0. Brief
Build a 9-section homepage for **Tengo Meskhi** (founder & CEO of Conceptdigital, London): the page a UK/US mid-market CEO lands on and books a 30-minute strategy call from.
Aesthetic: forest, grounded, sharp, warm. Deep green + paper + bark brown.
Signature idea: a **ghost-type stage**. Tengo's cut-out portrait stands in front of a giant serif ghost word ("Meskhi") on a deep-forest ground, and a living **whereabouts chip** ("Now: Miami") in the hero unfolds "Coming up: …" on hover, focus or tap. Everything else stays quiet.
Fidelity: build exactly this; no extra badges, blobs, gradients or decorations.

## 1. Stack & files
Vanilla HTML/CSS/JS, one page. A tiny Node build (`scripts/build.mjs`) reads `whereabouts.yaml` at build time and writes `out/index.html`; `scripts/prepare-assets.mjs` resizes photos (sharp), knocks out the headshot background, copies logos and self-hosted fonts (`@fontsource`). Icons: inline SVG only. No CDN, no hot-links.

## 2. Fonts
| Role | Family | Weights | Used on |
|---|---|---|---|
| Display | Instrument Serif | 400 normal + italic | H1, H2, ghost word, pull quotes, big numbers, wordmark |
| Body/UI | Inter | 400 / 500 / 600 | body, nav, buttons, labels (labels: 11–12px uppercase, +.18em) |
Self-hosted woff2 from node_modules/@fontsource, `font-display: swap`, preloaded (serif italic + Inter 400).
Fallbacks: `Georgia, 'Times New Roman', serif` · `system-ui, -apple-system, 'Segoe UI', sans-serif`.

## 3. Colour tokens
```css
:root{
  --forest:#0F2318;        /* page bg, hero, dark sections */
  --forest-2:#16302222;    /* (unused) */
  --forest-2:#163024;      /* raised surface on dark */
  --ghost:#1C3A2B;         /* ghost word on forest */
  --moss:#3F6B4F;          /* muted accent, rules */
  --sage:#A9C4B0;          /* muted text on dark (sage/80 body, /60 labels) */
  --paper:#F1ECE1;         /* light sections, text on dark */
  --paper-2:#E6DECD;       /* raised surface on paper */
  --ink:#122018;           /* text on paper */
  --ink-60:rgba(18,32,24,.62);
  --bark:#7A5230;          /* accent: live dot, eyebrow rule, italic accents on paper (≤3 element types) */
}
html,body{background:var(--forest);color:var(--paper)}
```
Hierarchy by opacity: on forest paper 100 (H), 78 (body), 58 (labels); on paper ink 100 / 62 / 48. Borders: `rgba(241,236,225,.14)` on forest, `rgba(18,32,24,.12)` on paper. Selection: `rgba(169,196,176,.35)`.

## 4. Global utilities
- `.frost` (dark tier): `background:rgba(241,236,225,.06); border:1px solid rgba(241,236,225,.14); backdrop-filter:blur(8px)`; radius 999px for chips/nav, 24px for cards.
- `.btn` pill: height 48px, padding 0 22px 0 26px, 15px/500, gap 10px; primary on forest = paper fill / forest text with a 28px forest arrow disc; primary on paper = forest fill / paper text. Secondary = `.frost` ghost. Hover: arrow `translate(2px,-2px)`, 200ms; `:active scale(.98)`. Focus: `outline:2px solid var(--sage); outline-offset:3px`.
- Grain: fixed SVG fractal-noise layer, baseFrequency .9, 4 octaves, 200px tile, opacity .05 (rect .08 × layer .6), z 100, pointer-events none.
- Sheet transitions: paper sections get `border-radius:40px 40px 0 0; margin-top:-40px; position:relative; z-index:2` (28px on mobile).
- Easing tokens: `--ease-out-expo:cubic-bezier(.16,1,.3,1)`; `--ease-reveal:cubic-bezier(.25,.1,.25,1)`; `--ease-std:cubic-bezier(.4,0,.2,1)`.
- Entrance: `.appear` (fill-mode both, 1.05s expo, delay `--d`) with verbs `--soft`(y14) `--mask`(y 110% inside overflow hidden line) `--btn`(y18 scale .94) `--side`(x22) `--fade`; `.is-in` releases transforms after `animationend`; JS forces `.is-in` after 2 rAF if nothing runs; reduced motion → `animation:none`.
- Reveal: `.js [data-reveal]{opacity:0;transform:translateY(28px);transition:.75s var(--ease-reveal) var(--d)}` → `.is-in`; IO threshold .15, rootMargin `0 0 -8%`; stagger groups `data-stagger` base+i×step.

## 5. Assets (all local; prepared by scripts/prepare-assets.mjs into out/assets/)
| Slot | Source | Output | Fit / focal | Behaviour |
|---|---|---|---|---|
| hero-portrait | headshot-1129.jpg | `portrait-cutout.webp` (alpha, 1000×1200) + png fallback none | `position:absolute; bottom:0; right:clamp(0px,6vw,120px); height:min(86vh, 920px); object-fit:contain; object-position:bottom` | rises 40px + fade 1.2s at .35s; pointer parallax ±8px desktop only |
| ghost-word | text "Meskhi" | n/a | `clamp(140px,27vw,420px)`, Instrument Serif, lh 1, colour --ghost, `left:-.02em; bottom:12vh`, nowrap, aria-hidden | fade .1→1 + scale .985→1, 1.4s at .1s |
| stage-large | panel-wide-moderating.webp | 1600w + 900w webp | 16/10, `object-position:55% 50%` | hover zoom 1.04 / 700ms |
| stage-small-1 | speaking-sunglasses-mic.webp | 1000w webp | 4/5, `object-position:50% 30%` | same |
| stage-small-2 | audience-stamba-rooftop.webp | 1000w webp | 4/3, `object-position:50% 45%` | same |
| about-1..4 | dolomites, zion-angels-landing, lagos-portugal-cliff, bloukrans-bridge-bungee | 1200w / 900w webp | 3/2, 4/5, 3/2, 1/1 | single-element parallax ±40px (desktop) |
| og | speaking-sunglasses-mic → 1200×630 jpg | | | meta og:image |
| logos | all /logos files | copied verbatim | height 22–30px, `filter` to paper/ink monochrome | strip 55% opacity, marquee 60% |
Art direction: the cut-out has the subject centred; its empty zone is the whole left two-thirds of the stage, so the headline lives left. Edge colour = forest (alpha), so no overlay.

## 6. Layers & root
`.hero{position:relative;min-height:100vh;min-height:100dvh;overflow:hidden;display:grid;grid-template-rows:auto 1fr auto}`.
z-ladder: ghost word 1 → portrait 2 → copy 3 → bottom strip 3 → nav 20 → mobile menu 50 → grain 100.
Desktop grid: copy column `max-width:620px` at left gutter; portrait anchored bottom-right; bottom strip full width.

## 7. Navbar
Fixed, `top:16px`, grid `1fr auto 1fr`, padding `0 clamp(16px,4vw,56px)`.
Left: wordmark "Tengo Meskhi" Instrument Serif 22px, paper. Centre: `.frost` pill padding 6px; links Arc · Proof · Help · Speaking · About, 14px/500 paper/85, padding 8px 12px, hover paper/100 + `rgba(241,236,225,.08)` fill. Right: "Book a call" paper pill 40px (14px/500, forest text) with ↗.
After `scrollY>80`: nav gains `background:rgba(15,35,24,.72); backdrop-filter:blur(12px)` as a full bar (top 0, 64px) so it survives paper sections; wordmark + CTA stay.
Mobile (<900px): links hidden; 44px frost burger (3 bars 18×2, gap 5) → full-screen overlay `rgba(15,35,24,.96)` + blur 16px, links 36px serif, stagger 100+i×70ms, Esc/link/resize closes, body scroll locked, `inert` when closed.

## 8. Hero content (reading order)
| Element | Copy | Style |
|---|---|---|
| Eyebrow | "Founder & CEO, Conceptdigital · London" | 12px/500 uppercase +.18em sage/70, led by a 28×1px bark rule |
| Tracker chip | `● Now: Miami` → panel "Coming up: San Francisco (4–13 Nov) · Los Angeles (13 Nov–3 Dec) · Istanbul (from 4 Dec)" | `.frost` pill 36px, 13px/500; bark dot 8px with a 2.4s soft pulse (not under reduced motion); `<button aria-expanded>` + panel; opens on :hover, :focus-visible, click/tap; closes on Esc/outside |
| H1 | "Faster growth. / Leaner operations. / *Tech & AI that ships.*" | Instrument Serif `clamp(44px,6.2vw,92px)`, lh .98, tracking −.015em; line 3 italic sage; masked pull-up .45/.6/.75s |
| Sub | "Tengo Meskhi helps companies use tech & AI to accelerate their growth and streamline their operations. Engineer, ex-McKinsey, ex-bank Deputy CIO, now founder. He has sat on every side of the table." | 17px/1.55 paper/78, max-width 34rem, .9s |
| CTAs | "Book a call" (primary) · "LinkedIn" (secondary) | 1.05s / 1.15s |
| Bottom strip | "Studied, worked and shipped at" + logos Cambridge · McKinsey · Bank of Georgia · BBC iPlayer · Forbes · Halocarbon | 11px label; logos 24px tall, paper monochrome, opacity .55; 1.3s fade |
Mobile: copy first (padding-top 96px), H1 `clamp(40px,11vw,56px)`, portrait moves into a 62vh stage below the copy (ghost word behind, `clamp(120px,36vw,200px)`), strip becomes a wrapping row under the hero.

## 9. Sections
1. **Arc** (paper sheet) · eyebrow "01 — The arc" · H2 "He has sat on every side of the table." (serif `clamp(36px,4.6vw,64px)`, lh 1.02) · lede 18px ink-60 · 6 stops in a `grid-template-columns:repeat(6,1fr)` (3 cols ≤1100, 2 cols ≤700, 1 col ≤480), each: year label (12px bark), org (16px/600 ink), role (14px ink-60), one-line proof. Top hairline per stop with a bark square 6px at the left. Bank of Georgia stop carries the exact awards framing sentence.
2. **Proof** (forest) · eyebrow "02 — Proof" · stat row 4+2: 50+ projects · 15+ industries · 4 continents · 97% client satisfaction · 5.0/5 Clutch (14 reviews) · Forbes 30 Under 30 (2020); numbers `clamp(44px,6vw,84px)` serif, weight 400, tabular; count-up 1.5s + i×80ms. Then **results** list: 5 numbered rows (index 11px, org 18px/500, result serif italic 30px, one-line what) with the client logo right (Rex, THC, Transiberia wordmark, Arte, Fore Hadley). Then a client-logo marquee (16 names: logos where available, typographic wordmarks otherwise), 50px/s, edge mask, paused on hover.
3. **Help** (paper sheet) · eyebrow "03 — Where he can help" · H2 "Advise. Build. Grow." · 3 cards (grid 3 → 1), paper-2, radius 24px, padding 32px, serif title 34px, body 15px, 4 bullet lines 14px, each with a text-link; a bar under the cards: "Fractional CMO at Halocarbon (US fluorochemicals, 75+ years) shows the range: the same person can run your go-to-market and your delivery." CTA "Book a 30-minute strategy call".
4. **Takes** (forest) · eyebrow "04 — Takes" · H2 "Five things Tengo will say in the first ten minutes." · 5 rows: serif 28–40px statement + 15px sage explanation; hairlines; reveal stagger 120ms.
5. **Speaking** (paper sheet) · eyebrow "05 — Speaking & teaching" · H2 "Bilingual on stage: business and tech, English and Georgian." · collage grid 8/4 + 4/4 (large panel photo spanning 2 rows) · list of 4 engagements + topics chips · "Invite him to speak" mailto.
6. **Testimonials** (forest-2 band) · "Clutch 5.0 / 5 from 14 reviews" header with 5 star glyphs · 5 quotes in a 3+2 grid, serif 22px, attribution 13px sage.
7. **About** (paper sheet) · eyebrow "06 — Off the clock" · H2 "Born in Manchester to a Georgian family. Sold sweets in the playground to fund an expedition to Argentina." · 2-column: story (3 short paragraphs) + values trio (Curiosity · Adventure · Excellence) + hidden-gems list; photo stack of 4 with parallax.
8. **Health teaser** (forest, one line band) · serif 28px: "Building something new in health. Investors and partners: get in touch." → mailto.
9. **Contact + footer** (forest) · H2 "Book a 30-minute strategy call." · primary CTA + email + socials (LinkedIn, X, Instagram) + Inspiration link · newsletter pill (UI only; marked "coming soon", no backend) · footer line "Tengo Meskhi · Based in London, often in Tbilisi · Works in English and Georgian" · © 2026.

## 10. Motion table
Default easing expo-out. Nav down 0s (.7s); ghost word .1s (1.4s); eyebrow .3s; tracker .38s; H1 lines .45/.6/.75s (.9s each); sub .9s (1.1s); CTAs 1.05/1.15s; portrait .35s (1.2s); strip 1.3s (fade 1s). Done by ~1.6s.
Hovers: buttons 200ms; cards lift −4px 300ms; photos zoom 1.04 700ms; nav link fill 150ms.
NOT animated: backgrounds, grain, rules. No shimmer, no floating.
Reduced motion: every animation/transition removed, final state; count-ups print final values; marquee becomes a static scrollable row; tracker pulse off; parallax off.

## 11. Interaction & state
- Tracker: `btn[aria-expanded]` + `#whereabouts-panel[role=region]`; open on pointerenter (hover-capable only), focus-visible, click toggle; close on pointerleave (if not pinned by click), Escape, outside click. Data rendered at build time from `whereabouts.yaml` (now + next list, dates formatted "4–13 Nov").
- Count-up: IO .25, easeOutCubic, final value in HTML.
- Marquee: track with two identical groups, duration = groupWidth / 50 px/s.
- Reveal: IO once; `.js` class gate so no-JS never hides content.
- Menu: as §7. Nav scrolled state via `scroll` passive + rAF.
- Parallax: pointer ±8px on portrait, ∓4px ghost word, lerp .1, desktop + fine pointer only.

## 12. Responsive
| Element | <640 | ≥768 | ≥1024 |
|---|---|---|---|
| H1 | clamp(40px,11vw,56px) | 6.2vw | up to 92px |
| Hero | copy then 62vh stage | same as mobile | side-by-side ghost stage |
| Stats | 2×3 | 3×2 | 6 in a row |
| Help cards | 1 col | 3 col | 3 col |
| Collage | stacked | 2 col | 8/4 grid |
Gutters 20px / 32px / 56px. `overflow-x:clip` on html/body. `100dvh` + safe-area padding on the hero bottom. No horizontal scroll at 390px.

## 13. Constraints & acceptance
Do not: invent facts; name private clients; imply Tengo won the bank's awards; mention Boon on the page; show press cards; use emoji icons; hot-link anything.
Must: one h1; semantic landmarks; title/description/OG/JSON-LD; alt text; visible focus; keyboard tracker; reduced-motion branch; no console errors.
Acceptance (first viewport, 1440×900): forest ground, nav pill top; left: eyebrow, tracker chip, three-line serif headline (third line italic sage), one paragraph, two pills; right: Tengo's cut-out portrait standing in front of a huge ghost "Meskhi"; bottom: a quiet paper-toned logo strip. Nothing else.
