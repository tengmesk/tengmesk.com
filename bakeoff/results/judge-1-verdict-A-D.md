# tengmesk.com homepage bake-off: judge's verdict

Blind review of entries A–D against `bakeoff/inputs/TASK.md` and `BRIEF.md`. Every entry was loaded live at 1440×900 and 390×844 with Playwright; I took my own captures (first paint, 400 ms, 2 s, scroll stops, full page, tracker hover / keyboard focus / Enter / Escape / touch tap, mobile menu, reduced-motion, no-JS) and read them myself. Captures are in `scratchpad/judge-captures/<X>/` with `report.json` and `tracker.json` holding the measured data.

Calibration: 5 = competent template, 7 = strong professional, 9+ = award-level.

## Scores

| Entry | Aesthetics | Usability | Structure | Average |
|---|---|---|---|---|
| **D** | 8.3 | 8.4 | 8.5 | **8.40** |
| **C** | 8.6 | 7.0 | 8.0 | **7.87** |
| **A** | 7.2 | 7.4 | 8.0 | **7.53** |
| **B** | 6.8 | 6.6 | 7.3 | **6.90** |

## Ranking

1. **D** – the most complete answer to the brief: clear in two seconds, proof front-loaded, every interaction works, polished light editorial look.
2. **C** – the best-looking page and the one most likely to be noticed on Awwwards, held back by a touch bug on the must-have tracker, a blank first paint and small body text.
3. **A** – quiet, correct, fast and readable; the content and proof are all there, but it has no mobile navigation and little visual ambition.
4. **B** – a brave "trail map" concept with real character, but the metaphor gets in the way of scanning, the styling is heavier and less refined, and it also lacks mobile navigation.

## Measured facts common to all four

- Zero console errors or failed requests on desktop or mobile for all entries. No third-party hot-links. One `h1`, `lang="en"`, title/description/OG and Person JSON-LD present everywhere. All images have `alt`. Skip link present on all four. No horizontal scroll at 390 px on any entry (C has marquee children extending past the viewport but the document scroll width stays 390).
- All four respect `prefers-reduced-motion` (0 running animations with the preference on; B keeps one marquee transition but no entrance motion).
- All four include: the exact one-liner, Book a call → cal.com, LinkedIn, public email, Inspiration link, X and Instagram, the health teaser sentence, Forbes 30 Under 30, speaking history, Clutch 5.0/14, the five results numbers, Halocarbon as fractional CMO, Digital Institute as closed. Nobody names a private-list client, nobody mentions Boon, Tikit, Pensight revenue, the phone number or the unconfirmed co-founders.
- Bank of Georgia award framing is correct in all four ("helped lay the agile foundations of a bank that went on to be named..."). No invented facts found; every number traced to the brief or conceptdigital.com figures the brief allows.
- Page weight (desktop, all assets): A 0.85 MB / 32 requests, B 1.29 MB / 35, C 1.22 MB / 30, D 1.11 MB / 31. All have LCP well under a second on the local server.
- Tracker data: all read the whereabouts file (Now: Miami; San Francisco, Los Angeles, Istanbul with dates) rather than hard-coding.

---

## Entry D (light cream, deep green, Bodoni-style display with italic accent, contour-line background)

**Aesthetics 8.3.** Refined and consistent: arch-cropped portrait with a Forbes badge, numbered section eyebrows, a dark "point of view" band and a dark closing band, italic display quotes, four personal photos with real captions. Scroll progress bar in the header. Weak spots: the "Four ways to put him to work" cards with rounded icon tiles read as a SaaS template, and the stats row is plain. Not quite Awwwards-distinctive, but nothing is off.

**Usability 8.4.** The exact one-liner is the h1 with "Founder & CEO, Conceptdigital · Based in London" above it; two CTAs and the tracker are visible before any scroll. Tracker exists twice (nav and hero): hover reveals, Tab focus reveals with `aria-expanded` kept in sync, Enter toggles, Escape closes; touch tap opens the hero instance (its panel opens just under the fold on a 390×844 phone, so you scroll a little). Real mobile menu (`Menu`, `aria-expanded`, Escape closes). Logo marquee has a Pause button. 3 px focus rings. Newsletter form is honest ("opens an email to Tengo until the list is live"). Only real knock: the mobile page is the longest of the four (15,965 px) and the first-tap tracker panel is partially below the fold.

**Structure 8.5.** Hero → stats → "rooms he has worked in" logos → six-seat story grid → results cards with a mid-page CTA ("Want a number like these next to your name?") → client logos → four ways → point of view → testimonials with Clutch chip → speaking, lectures and press → about → health band → CTA + newsletter → footer. This is the persuasion order a mid-market CEO needs: proof before offer, offer before opinions, personal last. Board and advisory seats are explicitly invited.

**Brief violations:** none hard. One public-copy slip: the client logo wall is headed **"Clients that can be named"**, which leaks the brief's internal wording and invites the question "which ones can't be?". Should read "Selected clients".

**Three strengths:** fastest comprehension of any entry; most complete and correctly ordered proof stack; every interactive element is accessible and tested.
**Three weaknesses:** "Clients that can be named" heading; template-ish service cards; very long mobile page.
**What would make it a 10:** one genuinely memorable visual idea in the hero (motion or composition) and a tighter mobile edit, with the "can be named" heading replaced.

---

## Entry C (dark forest, cut-out portrait over a giant "Meskhi" watermark, display serif with sage italic, rounded section bands)

**Aesthetics 8.6.** The strongest first impression: cinematic dark hero, frosted pill nav, tagline "Faster growth. Leaner operations. Tech & AI that ships." in a big serif with an italic sage line, portrait cut out against the wordmark, logo strip "Studied at · Worked at · Shipped for" at the fold. Sections alternate dark/cream with large rounded corners; the "Off the clock" headline ("Born in Manchester… Sold sweets in the playground to fund an expedition to Argentina") is the best use of the brief's personal story. Reveal animations are tasteful. This is the one that would get a Site of the Day nomination.

**Usability 7.0.** The tracker fails on first touch tap: a fresh page, one tap on "Now: Miami", panel stays hidden (`aria-expanded="false"`); the second tap opens it. Keyboard and hover are correct (focus opens with aria in sync, Enter toggles, Escape closes). First paint is a fully blank green screen until the entrance animation runs (hero text is masked at 0 ms, mid-reveal at 400 ms); the no-JS fallback is fine, but on a slow device the page looks empty for a beat. Count-up stats pass through wrong values ("46+", "70%", "3.2/5") before landing on the true ones, which is a bad habit for a proof section. Body copy is the smallest of the four (median 15 px, minimum 11 px on labels; muted grey-on-green captions). On the plus side: real full-screen mobile menu, fixed header with CTA, 2 px focus ring, mid-page "Book a 30-minute strategy call" after the offers.

**Structure 8.0.** Hero → logo strip → arc (six seats) → proof (stats, five results with logos, client marquee) → Advise/Build/Grow → five takes → speaking with interviews list → Clutch testimonials → off the clock → health teaser → contact with newsletter and socials. Good order; testimonials sit a little late. The h1 is a tagline rather than the exact one-liner, but the exact line is the first paragraph, which the brief allows. Mentions the 20,000+ / 13-country talent network (from conceptdigital.com, permitted).

**Brief violations:** none. Note "gets by in French" is a fair reading of "intermediate".

**Three strengths:** best visual identity and hero; best copywriting in the About section; good speaking section with interviews and an "Invite him to speak" CTA.
**Three weaknesses:** tracker needs two taps on touch; blank first frame plus count-up showing false numbers; small, low-contrast secondary text.
**What would make it a 10:** fix the touch toggle (one `pointerdown`/`click` path, not both), render the hero visible by default and animate from a visible state, drop the count-up, and lift body text to 16–17 px with higher contrast.

---

## Entry A (cream, deep green, brown accent, duotone portrait, serif display)

**Aesthetics 7.2.** Calm editorial: a green-duotone portrait in the hero, generous whitespace, a brown timeline rail, a dark "Proof, with numbers." band with big serif figures, photo captions. Everything is tidy, nothing is memorable. The logo wall mixes real logos with heavy bold-serif wordmarks and looks uneven; the opinions section is a plain two-column list. Almost no motion beyond a 450 ms fade.

**Usability 7.4.** Exact one-liner as h1, two CTAs, tracker pill in the header on both desktop and mobile; hover, focus and tap all reveal the panel and tapping outside closes it (Escape does not close it while focused). Readable 17 px body. Lightest page. Sticky header keeps "Book a call" on screen. But there is **no mobile navigation**: the five section links are hidden under 900 px and no menu button replaces them, so a phone visitor can only scroll. No pause on anything because nothing moves.

**Structure 8.0.** Hero → "Every side of the table" timeline (with employer logos) → "Where he can help" (three columns, then CTA "Thirty minutes. No slides.") → proof band (numbers, logos, six testimonials, Forbes line) → five things he will say → on stage (photos, recent talks, in print) → short bio → closing CTA → footer with registered address. Offers come before proof, which is defensible. "Also: speaking and moderating, board and advisory seats" covers goal 4. Health teaser present. The hero paragraph is the clearest "why him" of the four.

**Brief violations:** none.

**Three strengths:** clearest, plainest copy in the Twain/Hormozi register; correct and complete proof section; fastest and lightest build.
**Three weaknesses:** no mobile menu; visually conservative, little that an Awwwards jury would notice; uneven logo wall.
**What would make it a 10:** keep the typography, add a mobile menu, replace bold-text wordmarks with consistently weighted marks, and give the hero one strong visual move (the duotone portrait wants a bigger, braver crop).

---

## Entry B (forest green with brown header rail, cream slab-serif, topographic contours, "trail" metaphor)

**Aesthetics 6.8.** The most original concept: "You are here" tracker styled as trail signposts, arrow-shaped offer cards, polaroid-framed photos, a brown rail header, contour lines everywhere. It has personality, but execution is heavy: the hero h1 wraps to six lines beside a framed photo, the slab serif is set bold almost everywhere, buttons use bevelled double borders, and the brown/green/cream mix reads more "national park signage" than "sharp, credible builder". Reduced-motion still leaves the marquee moving.

**Usability 6.6.** Exact one-liner as h1 with a strong subtitle; CTA and LinkedIn above the fold. Tracker is in the hero bottom-left (y≈790 on desktop, inside the fold but easy to miss) and expands inline, which works well on mobile; hover, focus, Enter and tap all work, Escape does not close. **No mobile navigation** (links hidden, no toggle). On mobile the framed photo comes before the headline, pushing the message to the second screen. Dense all-bold headings slow scanning. Metaphor labels in the nav ("Route", "Talks") are fine, but section titles like "Distances measured, not estimated." and "The trail register." do not say "results" or "testimonials" to a hurried exec.

**Structure 7.3.** Hero + tracker → "Four ways in" (offers first, each with its own CTA) → stats + results table + logo wall → Forbes banner → route timeline → testimonials → speaking (dark, with three captioned photos) → opinions → off the trail → CTA. All brief content present and correct, including "Fractional CMO, alongside Conceptdigital". Offers before any proof is the riskiest ordering of the four; the results table itself is the clearest tabulation of client/what/result anywhere.

**Brief violations:** none.

**Three strengths:** distinctive, coherent concept; the client/what-was-done/result table; the inline tracker that lists dates and "Base: London, often in Tbilisi".
**Three weaknesses:** heavy, dated styling and cramped hero; metaphor headings hurt scannability; no mobile menu, photo-before-headline on mobile.
**What would make it a 10:** keep the signpost tracker and results table, lighten the type (regular weights, fewer bevels), rename sections in plain words, and move proof above the offers.

---

## What I would ship, and what to steal

**Ship D.** It is the only entry a UK/US mid-market CEO can land on, understand, trust and act on without friction on any device, and it is polished enough to be proud of. Change the "Clients that can be named" heading before launch and consider trimming the mobile length.

**Steal from the others:**
- From **C**: the hero composition (cut-out portrait over the watermark wordmark, italic accent line) and the About headline treatment; the dark/cream alternation with big radii; the "Invite him to speak" button and the interviews list.
- From **A**: the hero paragraph ("He speaks business and he speaks engineer. He will tell you what can actually be built, what it will cost, and where it will hurt.") and the overall plainness of copy; the duotone portrait idea.
- From **B**: the Client / What was done / Result table for the proof section, and the inline tracker that shows base, current city with "until", and dated next stops without a popover.
