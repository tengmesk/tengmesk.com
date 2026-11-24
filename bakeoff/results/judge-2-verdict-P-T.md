# tengmesk.com homepage bake-off — Judge 2 verdict

Blind review of entries P, Q, R, S, T against `bakeoff/inputs/TASK.md` and `BRIEF.md`. Every entry was loaded in Chromium (Playwright) at 1440×900 and 390×844; first viewport, full page, four scroll positions, wheel-scroll to the end, tracker (hover, keyboard focus + Enter/Esc, touch tap), mobile menu, console, failed requests, horizontal overflow and `prefers-reduced-motion` were checked. My captures are in `scratchpad/judge2-captures/<X>/` (`d-*` desktop, `m-*` / `ms-*` mobile, `report.json` per entry); I trusted those over the entrants' own screenshots.

Common baseline (all five): zero console errors, zero failed requests, no third-party runtime requests, one `h1`, title/description/OG, JSON-LD, all images have alt, `prefers-reduced-motion` rules present, no horizontal scroll at 390 px, cities read from data (not hard-coded in markup), no Boon, no Tikit, no private/not-cleared client names, no Pensight revenue, health teaser present with no product details. Differences below are therefore about design, usability detail and persuasion, not hygiene.

## Scores

| Entry | Aesthetics | Usability | Structure | Average |
|---|---|---|---|---|
| **R** | 7.5 | 8.5 | 8.5 | **8.17** |
| **S** | 8.5 | 6.5 | 8.0 | **7.67** |
| **P** | 6.5 | 7.5 | 8.0 | **7.33** |
| **Q** | 6.0 | 8.0 | 7.5 | **7.17** |
| **T** | 6.3 | 7.3 | 7.0 | **6.87** |

Calibration: 5 = competent template, 7 = strong professional, 9+ = award-level.

## Ranking

1. **R** — the most complete, best-engineered and most persuasive page; polished rather than daring.
2. **S** — the only entry with a genuinely award-flavoured hero and typography, held back by a tracker that misbehaves on click and touch.
3. **P** — a committed "trail map" concept, brief-perfect content, but heavy-handed visuals.
4. **Q** — calm, honest, highly readable; visually the quietest of the five.
5. **T** — bold photo-led editorial idea, but the thinnest proof and the weakest 10-second read on mobile.

---

## Entry P — "The trail" (contour map, brown bar, slab serif)

Measured: 2.1 MB on disk, 1.26 MB transferred on mobile, doc height 10,421 / 14,898 px, no mobile menu (nav collapses to brand + Book a call). Tracker is a `<button aria-expanded aria-controls>` in the hero ("YOU ARE HERE" sign); hover, focus and tap all reveal San Francisco / Los Angeles / Istanbul with dates and "Updated 30 Oct 2026".

**Strengths**
1. The brief's palette, literally: deep green, brown and off-white are all load-bearing, and the contour/terrain motif the brief hints at is carried through hero, proof, timeline and footer.
2. The proof section is the best-structured of the five: five stats, then a three-column Client / What was done / Result table (Rex €5M, THC $3M, Transiberia 65%, Arte 1,124+/$13M+, Fore Hadley 25→92), then logos, then the Forbes line. An exec can scan it in ten seconds.
3. Four role-specific doors with their own CTAs (strategy call, Conceptdigital, fractional roles, speaking) plus seven testimonials, five opinions, the full career route and the exact health teaser; nothing from the brief is missing.

**Weaknesses**
1. Visual weight: a solid brown nav bar, text-shadowed headlines, a contour pattern behind every section and chevron "trail sign" panels add up to something closer to a national-park brochure than an Awwwards candidate.
2. The hero `h1` is the whole 17-word one-liner in a large slab face; it reads, but it is not a headline, and on mobile the framed portrait pushes it to ~480 px.
3. Mobile page is 14,900 px long with no in-page navigation; the slab typeface and polaroid-style brown frames look a little dated next to R and S.

**Brief violations:** none found. Bank of Georgia framing correct ("helped lay the agile foundations of a bank that went on to be named…"), Digital Institute marked "It has since closed", newsletter is UI-only with an honest "No posts yet" line.

**What would make it a 10:** keep the map concept but strip it to one quiet contour layer, lose the text shadows and the brown bar, set the hero as a short headline over the one-liner, and let the case table be the visual hero of the proof section.

---

## Entry Q — Editorial, light, duotone portrait

Measured: 844 KB transferred (lightest after T), LCP ~76 ms local, doc height 9,894 / 14,300 px, no mobile menu (tracker stays visible in the mobile header). Tracker is a nav `<button>` with a popover; works with mouse, keyboard and tap; Escape closes.

**Strengths**
1. The duotone green portrait on cream is the single best photo treatment in the field: it makes a stock-ish headshot feel designed and sits perfectly inside the forest palette.
2. Readability and honesty: generous measure, clear hierarchy, plain-English copy that respects the third-person / Twain-Hormozi voice ("Thirty minutes. No slides."; "Most advisers have seen one seat. Tengo has sat in six.").
3. Fast and clean: smallest payload, good tracker a11y, honest newsletter ("UI only, no backend yet"), Conceptdigital registered address in the footer, no overflow.

**Weaknesses**
1. Visually flat: almost the entire page is cream with hairlines; only the final CTA block goes dark. There is no motion, no imagery between the hero and the speaking section, and the logo row is mostly plain wordmarks.
2. The slab serif (Roboto-Slab-like) for display plus a generic sans gives a "well-set document" feel rather than a personal brand; headings lack contrast of scale.
3. Proof arrives late: an exec scrolls past a six-stop timeline and three service columns before reaching numbers, logos and testimonials.

**Brief violations:** none found. BoG framing correct, Digital Institute shown as closed, Boon absent, teaser exact.

**What would make it a 10:** move "Proof, with numbers" directly under the hero, give the page two or three dark-green bands with the panel photos as full-bleed moments, swap the slab for a high-contrast display serif, and add one restrained reveal animation.

---

## Entry R — Cream, display serif, arch portrait, cards

Measured: 1.08 MB transferred, doc height 10,397 / 15,965 px (longest mobile page). Tracker: nav button on desktop, hero pill on mobile, both `aria-expanded`/`aria-controls`, open on hover, focus and tap, close on Escape. Mobile menu is a real panel (Story / Results / How he helps / Speaking / Contact). Logo marquee has a visible Pause button.

**Strengths**
1. Best overall usability: tracker that works everywhere, a proper mobile menu, a marquee with a pause control, visible focus rings, generous touch targets, and a "Want a number like these next to your name? Book a call" card placed exactly where an exec would be convinced.
2. Persuasion order is right for the target visitor: one-liner + credentials strap + Forbes badge → five stats → logos → six-stop story → five result cards with client logos → named clients → four ways to use him → point of view → six testimonials with Clutch 5.0/14 → speaking and press → about → health teaser → contact.
3. Craft and consistency: arch-cropped portrait with a Forbes badge, display serif with an italic "tech & AI" accent, numbered section eyebrows, dark bands for POV and contact, the newsletter honestly described as "Opens an email to Tengo until the list is live".

**Weaknesses**
1. It is polished rather than original: rounded cards with icon tiles, three-up grids and a stats row are the vocabulary of a good SaaS marketing site; nothing here would stop an Awwwards juror.
2. Brown is barely present; the palette is cream + one green, so it meets the brief less literally than P or S.
3. Reveal-on-scroll keeps late sections at opacity 0 until they intersect (my full-page capture shows blank space at the bottom; real scrolling is fine), and the mobile page is the longest in the field at ~16,000 px.

**Brief violations:** none found. BoG framing correct (also mentions 2026 AI Bank award with the same "went on to" framing), Digital Institute "has since closed", teaser exact, Pensight as typographic wordmark.

**What would make it a 10:** one signature move in the hero (a cut-out portrait or a large typographic moment), fewer cards and more editorial whitespace, warmer browns in the dark bands, and a 20% shorter mobile page.

---

## Entry S — Dark forest hero, cut-out portrait, ghost word

Measured: 1.18 MB transferred, mobile LCP ~1.27 s locally (portrait webp 836×1400, fetchpriority high), doc height 10,873 / 13,929 px. Mobile menu is a full-screen overlay. Tracker is `.wb__btn` with `aria-expanded`.

**Strengths**
1. The hero is the only one in the field that looks like a site someone would screenshot: cut-out portrait over a giant ghost "Meskhi", three-line serif headline with an italic sage accent ("Tech & AI that ships."), grain, and a credentials strip (Cambridge, McKinsey, Bank of Georgia, iPlayer, Forbes, Halocarbon) pinned to the fold.
2. Typography is the most sophisticated: a condensed display serif used at scale, italics for emphasis in sage and brown, numbered results in italic numerals, rounded section transitions between cream and forest.
3. Content is complete and well paced: six-cell arc, five numbered results with client logos, three service cards with real bullet lists (including National Bank of Georgia and the 20,000+ talent network), five takes, speaking with dates, six Clutch testimonials, a photo collage, exact health teaser.

**Weaknesses**
1. The tracker does not meet "must work with mouse, keyboard and touch". Measured: on desktop, hover opens it but a click while hovered closes it (the pinned/hover logic fights itself); on touch, the first tap does nothing and a second tap opens it; a raw `touchscreen.tap` never opens it. Keyboard (Enter/Escape) works.
2. Mobile hero is crowded: the Book a call / LinkedIn pills sit directly on the top of the portrait's head, and the ghost word is clipped awkwardly; some secondary text is set at 11–11.5 px.
3. The client logo marquee has no pause control (hover-pause only), and the "Off the clock" H2 is a 15-word sentence that reads as body copy.

**Brief violations:** none found. BoG framing correct, Digital Institute omitted (allowed), Boon absent, teaser exact ("Building something new in health. Investors and partners: get in touch").

**What would make it a 10:** fix the tracker (one state machine: hover shows, click/tap toggles, no hover-close while pinned), give the mobile hero breathing room between the buttons and the portrait, add a pause button to the marquee, and bump the smallest text to 12 px+.

---

## Entry T — Full-bleed stage photo hero, cream editorial

Measured: 575 KB transferred (lightest), doc height 9,330 / 10,971 px (shortest). Tracker is a utility bar above the nav: "Now: Miami ▾" expands inline to "Coming up: San Francisco (4 Nov to 13 Nov), Los Angeles (13 Nov to 3 Dec), Istanbul (from 4 Dec). Based in London." on hover, focus and tap. No mobile menu (three links only). No newsletter form.

**Strengths**
1. A confident editorial idea: the Global Tech Weekend stage photo full-bleed with a cream card carrying "Tech and AI advice that actually ships." is the most "builder, not consultant" hero of the five, and the Dolomites band for the values line is a lovely beat.
2. Lightest and fastest page, with the simplest, most honest tracker and the fewest moving parts; good serif (Fraunces-like) at display sizes.
3. The results section leads with one huge "$3M" and four clean rows, a Hormozi-style "numbers first" opening.

**Weaknesses**
1. Thin proof: only three testimonials, the Bank of Georgia "World's Best Digital Bank" framing is dropped entirely, the stats (50+ / 15+ / 4 / 97%) are buried in a timeline row, and Forbes 30 Under 30 is a small card with no date context.
2. The 10-second read on mobile fails: the hero photo fills the first screen, the `h1` starts at ~660 px, so a phone visitor sees a man in sunglasses with a microphone and a "Book a call" pill before learning what he does.
3. Execution is uneven: plain two-row logo grid, hairline tables, "Invite him to speak" as a bare text link, and the full-bleed panel photo crops the slide title mid-word; brown is absent from the palette.

**Brief violations:** none hard. Soft misses: Bank of Georgia recognition omitted (allowed but loses proof); "Three ways" names the health teaser inline rather than as its own line (still the exact wording).

**What would make it a 10:** keep the photo hero but overlay the one-liner above the fold on mobile, add the stats row and BoG framing under the hero, bring all seven testimonials and the five result numbers up, and give logos and speaking the same editorial care as the hero.

---

## What I would ship, and what to steal

**Ship R.** It is the only entry a UK/US mid-market CEO could land on today without a single thing getting in the way of booking a call: fastest route to proof, every brief element present and correctly framed, tracker and mobile menu that behave, and no bugs to fix first. It will not win an Awwwards SOTD as-is, but it will win calls.

**Steal into R:**
- From **S**: the hero. Cut-out portrait, ghost surname, italic sage accent on the headline, grain, and the credential logo strip pinned to the fold. Also S's italic numerals in the results list and the rounded cream/forest section transitions.
- From **P**: the Client / What was done / Result table (far more scannable than cards), the four role-specific doors with their own CTAs, and the "YOU ARE HERE" sign-post treatment of the tracker with base city + "often in Tbilisi".
- From **Q**: the duotone green portrait treatment for secondary photos, and the honest newsletter copy ("UI only, no backend yet").
- From **T**: one full-bleed photo band (Dolomites or the Stamba room) as a breathing moment, and the top utility-bar tracker that expands inline with dates in plain English.

If the owner wants the most beautiful page rather than the safest, ship **S** after fixing the tracker (a half-day), re-spacing the mobile hero and adding a marquee pause; it is the only entry with award-level ambition.
