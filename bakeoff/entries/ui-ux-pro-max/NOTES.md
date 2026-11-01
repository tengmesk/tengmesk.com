# NOTES — ui-ux-pro-max entry

## Concept

**"Every side of the table."** The page is built as a scroll-told argument rather than a brochure:
hook (positioning + portrait + live city tracker + one CTA) → proof strip → the career arc as six
numbered chapters → results as big numbers → four ways to work with him → his opinions, in a dark
forest band → client quotes → stage photos → character photos → health teaser → "Thirty minutes. No
slides." Every chapter ends in a number or a quote, never an adjective, which is the Twain/Hormozi
brief translated into layout. The look is editorial-minimal on warm paper with deep forest and bark
brown bands; the only decoration is a contour-line motif generated in code (BRIEF §7 said terrain
motifs still fit). Fraunces at optical size 144 carries the voice; Instrument Sans does the reading.

## How the skill was used

1. **Step 1–2:** ran `search.py "... --design-system --persist --variance 6 --motion 5 --density 3"`
   into `design-system/tengmesk-com/MASTER.md`. The database matched *Luxury/Premium Brand*
   (black + gold), *Liquid Glass* and *Scroll-Triggered Storytelling*. BRIEF §7 wins on palette, so
   the `--page home` override (`pages/home.md`) replaces colours (forest tokens, all AA-checked),
   style (editorial minimal, no glass) and fonts, and keeps the pattern, density, motion tier,
   anti-patterns and checklist.
2. **Step 3 searches** that shaped decisions: `--domain landing` (merged *Trust & Authority* and
   *Hero + Testimonials + CTA*: proof before CTA, marquee must pause on hover/focus/reduced motion
   and have a control), `--domain typography` and `--domain google-fonts` (Fraunces and Instrument
   Sans verified), `--domain ux` ("hover vs tap", "reduced motion/parallax", "excessive motion":
   one or two animated elements per view), `--domain gsap` (subtle scroll reveal: 12px, ~350ms,
   power1.out; implemented with IntersectionObserver instead of GSAP since nothing heavier was needed),
   `--domain style` (Minimalism & Swiss), `--stack html-tailwind` (reserve image space, object-fit).
3. **Review loop:** `references/quick-reference.md` §1–§5 as the pass list: contrast tokens ≥4.5:1,
   visible 3px focus rings (lichen on dark bands), skip link, one h1 / sequential headings, alt text,
   44px+ targets, `touch-action: manipulation`, width/height on every image, `font-display: swap`,
   preloaded LCP assets, no horizontal scroll at 390, `prefers-reduced-motion` renders every final
   state. Then build → Playwright screenshots → fix → repeat (three passes).

## Key design decisions

- **City tracker** is a real `<button aria-expanded>` + region. Opens on hover (pointer devices),
  on focus, on tap/click, Enter/Space; Esc and outside-tap close it. Rendered at build time from
  `data/whereabouts.yaml` (js-yaml dates handled; `tbc`/empty never shown). It appears twice: nav
  pill (hidden under 720px) and hero pill.
- **Portrait** uses the preferred headshot with `mix-blend-mode: multiply` inside an arch, so the
  studio grey melts into the paper without cutting him out.
- **Logos** are grayscaled to one tone; white-on-transparent files are inverted via CSS. Organisations
  without a logo are Fraunces wordmarks, as LOGOS.md asks.
- **Facts discipline:** no Boon anywhere; Digital Institute as a closed past venture; Bank of Georgia
  awards use the exact "helped lay the agile foundations…" framing; Jonathan Loesing's quote carries
  no company (⚠️ in brief); Forbes 30 Under 30 shows no category; no Pensight revenue; private
  clients absent; co-founder wording avoided ("founder & CEO").
- **Newsletter** is UI only: submit opens a pre-filled `mailto:` and says so in the helper text.
  No fake posts, video, CV or speaker kit; speaking invites and the health teaser use `mailto:` links.

## Verification

Build OK (`npm run build`, 33 images). Playwright: no console errors or warnings, no failed
requests, 1 h1, header/nav/main/footer landmarks, 0 images without alt, scrollWidth 390 at 390px
viewport, tracker keyboard/hover/tap/Esc all correct, mobile menu works, reduced motion: all reveals
visible, marquee static, ping disabled. LCP on a local server: 208 ms desktop / 164 ms mobile
(element: the h1; the hero image is preloaded with `imagesrcset`). The larger LCP number printed by
`npm run shots` is an artefact of the full-page screenshot resizing the viewport after load.

## With more time

Real newsletter backend; a short intro video slot; CV and speaker kit once content exists; an
`/inspiration`-style Tbilisi gems page; a tiny Georgian-language toggle; Lighthouse/axe runs in CI;
AVIF alongside WebP; an OG image composited with the headline.

## Known gaps

- **Input issue:** `logos/forbes.svg` in the inputs is mislabelled; its embedded raster is a
  "United States AmmoExchange" mark, not Forbes. It is excluded. Forbes is represented by the
  genuine `forbes-georgia.svg` vector (the 30 Under 30 and the testimonial are both Forbes Georgia).
- Newsletter has no backend (mailto hand-off only).
- Logo marquee duplicates the list once per loop; on very wide screens (>2000px) the loop gap may be visible.
- Light mode only (BRIEF allowed either); dark bands provide the contrast rhythm.
- No favicon file (inline SVG data URI used).
