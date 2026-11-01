# NOTES — frontend-design entry

## Concept
A printed field guide to one person. Tengo's pitch is "every side of the table", so the page is
built as a sequence of plain, numbered-by-nature facts set in a Clarendon-flavoured slab serif
(Besley, 1845, the typeface of Twain-era posters and of US park signage), with Hanken Grotesk
for running text. Forest palette: cool paper `#EEEBE1`, deep ink green `#14291C`, walnut
`#5B3F25`, oak `#B08A5E`. The one bold move is the hero portrait: the studio headshot
(grey seamless, 2018) is re-rendered at build time as an ink-on-paper duotone whose background
is levelled to the page colour, so the print dissolves into the page instead of sitting in a box.
Everything else is kept quiet: rules, one trail line, no cards, no caps labels, no numbers-as-decor.

## How the skill was used
1. Grounded in the subject: read every input, looked at every photo and logo, then wrote a
   token plan (colour, type, layout wireframe, principles) before any code.
2. Reviewed the plan against the generic version of this brief (Inter/Playfair, rounded headshot,
   stats row, logo marquee, shadowed testimonial cards, numbered timeline) and changed each part:
   duotone bleed instead of a photo card; results as sentences led by the number; a tinted static
   logo wall with typographic wordmarks; quotes as plain columns; the career as a drawn trail
   (the only sequence on the page, so the only thing that gets a line and markers).
3. Built, then ran the build → screenshot → fix loop three times. Fixes from looking: portrait
   background didn't match the page (levelled the white point, soft-masked the edges); h1 too big
   (CTA below the fold); masked logos collapsed to zero width in the trail; mobile trail grid
   collided; opaque-white Cambridge PNG masked as a block (alpha now derived from darkness);
   removed the horizontal rules between trail stops (double structure, "remove one accessory").
4. Copy written in the brief's voice: third person, short sentences, concrete numbers, a little wit,
   nothing not in the brief. Opinions section uses his five confirmed lines as pull quotes.

## Key decisions
- Vanilla HTML/CSS/JS with a 200-line build script: SEO-friendly static HTML, trivially editable.
- City tracker is a button + panel: hover and focus-within in CSS, click/tap and Escape in JS,
  closes on focus-out. Data from `content/whereabouts.yaml` at build time; `tbc` values skipped.
- Bank of Georgia framing follows the brief verbatim ("helped lay the agile foundations of a bank
  that went on to be named…"). Forbes 30 Under 30 stated as 2020, Forbes Georgia.
- Jonathan Loesing's quote is credited "CEO" without a company (Rex attribution is ⚠️ in the brief).
- Boon omitted everywhere; Digital Institute shown as a closed past venture in the About copy.
- `logos/forbes.svg` in the inputs actually contains a different company's wordmark, so only
  `forbes-georgia.svg` is used. Google/Tesla logos not used (text only, per LOGOS.md caution).
- One load sequence (headline rise + portrait "develop"), gated on a `js` class so content is
  visible without JS, and disabled under `prefers-reduced-motion`.
- Newsletter form is UI only: submitting shows "not wired up yet, email Tengo". No backend.
- Speaker kit, CV, video, blog, Tbilisi guide: no content exists, so they are not faked; the
  speaker-kit need is routed to a mailto.

## Verification
`npm run screenshots` checks: no console errors/warnings, no failed requests, no horizontal
overflow at 390px, tracker opens on tap and on focus, Escape closes, one h1, hero visible with
reduced motion. Page weight ~450 KB at desktop (portrait 256 KB webp is the LCP element,
preloaded fonts ~100 KB).

## With more time
Real newsletter backend; a proper OG image with the brand typeface rendered server-side instead
of via Playwright; a speaker-kit page once bio/photos are confirmed; finer-grained `sizes` and an
AVIF variant for photos; a dark-mode variant of the palette; a Georgian-language toggle.

## Known gaps
Nav links are hidden below 900px (single page; sections are a scroll away). The duotone treatment
means the hero portrait is not a true-colour photo, which is a deliberate choice but should be
confirmed with Tengo. The LinkedIn icon is small because the supplied SVG has large margins.
