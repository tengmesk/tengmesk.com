---
name: tengmesk.com
description: A trailhead board system — two inks (forest green, timber brown) on one bone paper, routed Clarendon lettering, fingerposts and blazes.
colors:
  board-green: "#12301f"
  board-green-lit: "#183b28"
  board-green-deep: "#0b2016"
  finger-green: "#214a33"
  rule-green: "#2e6446"
  timber-brown: "#5a3a1f"
  timber-shadow: "#3d2613"
  timber-dark: "#4b3019"
  timber-mid: "#70492a"
  timber-light: "#8a5d37"
  timber-pale: "#b8946a"
  bone-paper: "#f2ecdf"
  bone-deep: "#e9e1cf"
  bone-rule: "#ddd2ba"
  cream-routed: "#f7f1e4"
  cream-dim: "#d9d2c0"
  ochre-blaze: "#e0b458"
  ink: "#1d1a14"
  ink-soft: "#4a4030"
typography:
  display:
    fontFamily: "Besley, Clarendon, Rockwell, Georgia, serif"
    fontSize: "clamp(2.1rem, 1.1rem + 2.9vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "Besley, Clarendon, Rockwell, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.25rem + 2.1vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.008em"
  title:
    fontFamily: "Besley, Clarendon, Rockwell, Georgia, serif"
    fontSize: "clamp(1.2rem, 1.05rem + 0.6vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.08
  body:
    fontFamily: "Signika, Frutiger, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Besley, Clarendon, Rockwell, Georgia, serif"
    fontSize: "0.85rem"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  none: "0px"
spacing:
  rule: "2px"
  post: "8px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  section: "clamp(56px, 8vw, 112px)"
  gutter: "clamp(16px, 4vw, 56px)"
components:
  button-primary:
    backgroundColor: "{colors.cream-routed}"
    textColor: "{colors.board-green-deep}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "14px 22px"
  button-primary-hover:
    backgroundColor: "#fffaf0"
    textColor: "{colors.board-green-deep}"
  button-rail:
    backgroundColor: "{colors.board-green}"
    textColor: "{colors.cream-routed}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
  button-secondary:
    backgroundColor: "{colors.finger-green}"
    textColor: "{colors.cream-routed}"
    rounded: "{rounded.none}"
    padding: "14px 22px"
  board:
    backgroundColor: "{colors.board-green}"
    textColor: "{colors.cream-routed}"
    rounded: "{rounded.none}"
  paper:
    backgroundColor: "{colors.bone-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  finger:
    backgroundColor: "{colors.board-green}"
    textColor: "{colors.cream-routed}"
    rounded: "{rounded.none}"
    padding: "26px 96px 26px 36px"
  print:
    backgroundColor: "{colors.cream-routed}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px 10px 12px"
  input-text:
    backgroundColor: "{colors.cream-routed}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
---

# Design System: tengmesk.com

## Overview

**Creative North Star: "The Trailhead Board"**

The site is a trailhead: painted timber boards with routed lettering, fingerposts pointing at destinations, a distance chart, blazes on the trail, and a register that other walkers signed. Everything a visitor needs to decide fast already exists in that world, so the page borrows its parts rather than the personal-brand template. Two inks on one paper: deep forest green owns the boards (hero, proof, talks, close), bone off-white is the paper of the notices pinned between them, and brown timber is every post, rule and frame at true thickness. There is no grey anywhere; secondary text is tinted cream on green and brown-black on bone.

Density alternates like a walk: a dense board (the distance chart, the logos), then a quiet paper section (the route, the register). Motion is lit or pinned, never slid: boards backlight on hover, the route draws on once, prints settle in by a few pixels. Under reduced motion the registration locks and nothing is hidden.

**Key Characteristics:**
- Two inks (green #12301f, brown #5a3a1f) on one paper (#f2ecdf); one ochre accent for the blaze that marks "now".
- Square corners everywhere; depth comes from posts, rules and frames, not shadows.
- Besley (Clarendon revival) for every heading and number, Signika for reading text.
- Contour lines drawn in code as the boards' ground, never as an illustration.
- The fingerpost: an arrow-ended board on a post, used for the city tracker and the "ways in".

## Colors

A forest palette with the discipline of a two-colour print: green and brown do all the work, the paper shows through.

### Primary
- **Board Green** (#12301f): the painted board; owns the hero, proof, talks, health teaser and close. Hover lightens one step to Board Green Lit (#183b28).
- **Finger Green** (#214a33): fingers of the tracker, secondary buttons, inset rules on fingers. Rule Green (#2e6446) draws table rules and tally borders on boards.

### Secondary
- **Timber Brown** (#5a3a1f): header and footer rails, every post (8px), print frames (6px), blaze borders (2px), route line. Timber Shadow (#3d2613) is the inset edge under each rail and post; Timber Light (#8a5d37) is the inner routed line of the primary button; Timber Pale (#b8946a) rules the register rows.

### Tertiary
- **Ochre Blaze** (#e0b458): the single accent. Marks "now" on the route, column heads on the distance chart, the tracker's title, the health-teaser link, focus rings and text selection.

### Neutral
- **Bone Paper** (#f2ecdf): page and notice ground. Bone Deep (#e9e1cf) is the About section; Bone Rule (#ddd2ba) is the undrawn part of the route line.
- **Cream Routed** (#f7f1e4): lettering on boards, primary button, print mats. Cream Dim (#d9d2c0) is secondary text on boards.
- **Ink** (#1d1a14) for headings on paper; **Ink Soft** (#4a4030) for body copy on paper.

### Named Rules
**The Two-Ink Rule.** Only green and brown carry colour. No grey, no gradients; secondary text is a tint of the ink it sits on.
**The One Blaze Rule.** Ochre appears on at most one element per screen region, and always means "here" or "look here".

## Typography

**Display Font:** Besley (with Clarendon, Rockwell, Georgia fallbacks), self-hosted woff2 at 600, 700, 800 and 600 italic.
**Body Font:** Signika (with Frutiger, Segoe UI, system-ui fallbacks), self-hosted woff2 at 400, 500, 600.

**Character:** Besley is a Clarendon revival, the slab the US park signs and routed timber boards use; Signika was drawn for wayfinding signage. Together they read as lettering cut into a board and a notice set beside it.

### Hierarchy
- **Display** (700, clamp(2.1rem, 1.1rem + 2.9vw, 3.6rem), 1.04): the h1 on the trailhead board, routed (cream with a 1px dark text-shadow below).
- **Headline** (700, clamp(1.75rem, 1.25rem + 2.1vw, 2.75rem), 1.08): section headings; the close goes up to clamp(2rem, 1.3rem + 3vw, 3.6rem).
- **Title** (700, clamp(1.2rem, 1.05rem + 0.6vw, 1.5rem), 1.08): finger and stop headings, buttons.
- **Body** (400, clamp(1rem, 0.95rem + 0.25vw, 1.125rem), 1.55, max 66ch, `text-wrap: pretty`): all reading copy; ledes at clamp(1.1rem, 1rem + 0.5vw, 1.35rem).
- **Label** (Besley 700, 0.78–0.85rem, 0.06–0.08em tracking, uppercase): tracker labels, chart column heads, logo-group heading.
- **Numbers**: Besley 700, tabular figures everywhere (`font-variant-numeric: tabular-nums` on body).

### Named Rules
**The Routed Rule.** Headings on a board are cream with `text-shadow: 0 1px 0 rgba(0,0,0,.45)`; on paper they are plain ink. Nothing else gets a text-shadow.

## Layout

A 1180px container with a fluid gutter of clamp(16px, 4vw, 56px). Sections are stacked boards and papers separated by an 8px timber post; vertical padding is clamp(56px, 8vw, 112px). Hero: a 7/5 grid, copy left and the framed print right, min-height of the viewport minus the 60px rail. Fingerposts hang off a vertical 8px post with stepped widths (100/92/84/76%). The route is a three-column grid (year, blaze, body) that collapses to two under 640px. Blazes use `repeat(auto-fit, minmax(300px, 1fr))` with the first spanning two columns above 1000px. Talks and About are 5/6 and 6/5 grids that stack under 900px. The rail hides its section links under 760px and keeps the name and the call button.

## Elevation & Depth

Flat by material. Depth is structural: posts and rails carry an inset 2–3px darker edge (`inset -2px 0 0 #3d2613`), boards carry a 2px inset rule in the next green, prints carry a 1px inset pale line inside a 6px brown frame. The only soft shadows are under prints and the primary button, offset and blurred (`0 18px 40px -22px rgba(0,0,0,.75)`, `0 6px 16px -8px rgba(0,0,0,.6)`), standing in for a notice pinned proud of the board.

### Named Rules
**The Pinned Rule.** A shadow means something physical sits on the board (a print, a button). Containers never cast one.

## Shapes

Square corners throughout (0px). Fingers and the tracker's boards are arrow-ended with a 5-vertex `clip-path` (18px arrow on the tracker, 34px on the ways-in fingers). Blazes are 16×24 painted rectangles. Posts are vertical 8px bars, rules are 2px, hairlines 1px. Link arrows are 10px stroked chevrons drawn with borders, never glyphs.

## Components

### Buttons
- **Shape:** square (0px), 2px border, Besley 700 at 1.05rem.
- **Primary:** cream (#f7f1e4) on a 2px brown border with a 3px cream + 1px timber-light inset routed line, green-deep text; padding 14px 22px; `btn--big` 18px 30px at 1.3rem.
- **Hover / Focus:** background to #fffaf0, 1px lift, shadow deepens; focus ring 3px ochre, 3px offset.
- **Rail:** board green on the brown rail, green-700 border; hover lightens to finger green. **Secondary:** finger green, rule-green border.

### Links
- Arrow links: 600 weight, 2px underline in currentColor, a stroked chevron that nudges 2px on hover.

### Boards / Paper
- **Board:** green ground with the contour SVG at 16–22% cream stroke; children positioned above it. **Paper:** bone ground; the route section adds a brown contour ground.
- **Finger:** green board, arrow end, 2px inset rule, hover backlights to green-lit; title, copy at 62ch, arrow link.
- **Print:** cream mat 10px, 6px brown frame, caption 0.86rem ink-soft.

### Inputs / Fields
- **Style:** cream field, 2px timber-light border, square; placeholder #6e6450; caret finger green.
- **Focus:** 3px ochre ring. **Error:** message in the live region names the problem and keeps focus in the field.

### Navigation
- A 60px brown rail, sticky; routed name left, Signika 500 links with a darker brown hover block, green call button right. Footer repeats the rail with masked social icons in currentColor.

### Fingerpost tracker (signature)
- An 8px post with a cream NOW board (arrow end) and a green BASE board; hover, focus-within or a tap (sticky, `aria-expanded`) grows three COMING UP fingers that swing out from the post (rotate −6° → 0, 320ms, 60ms stagger) over a `grid-template-rows: 0fr → 1fr` reveal. Data comes from `data/whereabouts.yaml` at build time.

### Distance chart / Register / Route / Blazes
- Chart: tally cells with 2px rule-green borders, then a ruled table with ochre uppercase column heads and Besley row heads; collapses to stacked rows under 640px.
- Register: 2px brown top rule, 1px pale rules between entries, Besley 600 italic quotes beside a 260px brown attribution column.
- Route: 4px timber line drawn on scroll (`scaleY`), cream blazes with 3px brown borders, ochre blaze for "now".
- Blazes: bone boxes with a 2px brown border and a green blaze at the left; hover lightens to cream.

## Do's and Don'ts

### Do:
- **Do** put colour in fields that own regions: a whole board green, a whole notice bone.
- **Do** separate stacked sections with the 8px timber post.
- **Do** set every number in Besley with tabular figures.
- **Do** light things on hover (one shade step) rather than move them.
- **Do** keep the first viewport's action a cream board and the tracker visible beside it.

### Don't:
- **Don't** introduce grey, gradients, rounded corners or glass.
- **Don't** fake material: no wood grain, bevels or embossing; posts and boards are flat paint.
- **Don't** add a kicker above a heading; labels exist only on the tracker, the chart's column heads and the logo group.
- **Don't** use glyphs or emoji as icons; draw chevrons with borders or ship SVG.
- **Don't** hot-link fonts, images or scripts; everything ships from the page's own origin.
