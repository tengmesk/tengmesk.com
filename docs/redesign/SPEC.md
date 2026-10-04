# tengmesk.com — Redesign Spec

Status: Draft v0.1 · 2026-09-29 · Owner: Tengiz Meskhi · Author: build journal kickoff

This is the working spec for a ground-up redesign of tengmesk.com. The brief from the owner: *"a very sexy, stand-out personal profile website that could be featured in award shows"* (Awwwards / CSS Design Awards / FWA SOTD quality), and *document the entire journey of how it's built*. Every claim about the current site below is cited to a file or source so nothing is assumed.

---

## 1. Where things stand today (audit)

### 1.1 Two repos, one domain

| | `tengmesk/tengmesk.com` (this repo) | `tengmesk/tengmesk.github.io` (live site) |
|---|---|---|
| State | **Empty.** GitHub shows "This repository is empty"; API `/branches` returns `[]`; local clone has 0 objects. Branch `claude/vigilant-pascal-zxlljd` has no commits. GitHub description: "Personal website". | 11 commits on `master`, last one **Jun 7 2020 "Create CNAME"**. Last content change **Nov 26 2019 "Add Georgian language support"**. |
| Hosting | none yet | **GitHub Pages** with custom domain. `CNAME` file contains `tengmesk.com`. DNS for `tengmesk.com` and `www.tengmesk.com` resolves to `185.199.108–111.153` (GitHub Pages anycast IPs). |
| Deploy config | none | none — no Actions workflow, no `_config.yml`, no `package.json`. Pages serves the raw branch. |

Sources: `git ls-remote origin` (no refs); `https://api.github.com/repos/tengmesk/tengmesk.com/branches`; `https://github.com/tengmesk/tengmesk.github.io/commits/master`; `raw.githubusercontent.com/tengmesk/tengmesk.github.io/master/CNAME`; `getent hosts tengmesk.com`.

**Implication:** the new site will be built in *this* repo, but the domain is currently claimed by the *other* repo. GitHub only lets one repo own a custom domain, so launch requires a deliberate cutover (see §9, M5).

### 1.2 Current live site — file inventory (`tengmesk.github.io@master`)

```
CNAME                      -> "tengmesk.com"
index.html                 -> English one-pager (HTML5 UP "Aerial" template)
ka.html                    -> Georgian one-pager (same template, full translation)
assets/css/main.css        -> Aerial theme; @imports Source Sans Pro 300/900 + FontAwesome
assets/sass/, assets/webfonts/
assets/css/images/bg.jpg   -> 276 KB panoramic background (Aerial's scrolling sky)
images/TMHeadshotrounded.png -> 328 KB, used in <header>
images/TMheadshot.jpg      -> 38 KB, unused by index/ka (square original)
archive/2019indexold.html  -> previous site, HTML5 UP "Identity" template ("Engineering Undergraduate at Cambridge")
archive/2019assets/, archive/2019imagesold/
```

### 1.3 Current content (verbatim from `index.html`)

- `<title>`: *Tengiz Meskhi | Cambridge and McKinsey alum, currently Deputy CIO, Head of Agile @ Bank of Georgia, based in Tbilisi | tengmesk.com*
- H1: **Tengiz Meskhi**
- Tagline: *Deputy CIO, Head of Agile @ Bank of Georgia • Tbilisi, Georgia* / *Cambridge Bioengineering grad and Digital McKinsey alum*
- Links: LinkedIn `https://linkedin.com/in/tmeskhi`, Twitter `https://twitter.com/tengmesk`, CV → OneDrive `https://1drv.ms/b/s!AgUiIbIMgpkByW4hAC6_WkSExASO`
- HTML comment: `<!-- Add blog link here -->` (a blog was intended, never added)
- Footer: `🇬🇪 ქართული` language switch; © year via `document.write`
- `ka.html`: full Georgian mirror — H1 **თენგიზ მესხი**, tagline *ინფორმაციული ტექნოლოგიების დირექტორის მოადგილე, ეჯაილის ხელმძღვანელი @ საქართველოს ბანკი • თბილისი, საქართველო* …

### 1.4 What is known about the owner (for positioning)

- GitHub profile `tengmesk`: display name "Tengo Meskhi", Tbilisi, Georgia, website tengmesk.com, "Arctic Code Vault Contributor". Recent repos: `cowork-jobs` ("Job queue for a browser agent driving Higgsfield generation"), `seomachine` fork ("Claude Code workspace for SEO content") — i.e. actively building with AI agents in 2025–26.
- Web search (snippets only; pages blocked from this sandbox, **treat as unverified**): 2020 under30.ge honoree, Technology category, "Deputy IT Director and Head of Agile at Bank of Georgia"; F6S profile lists co-founder & Head of Product at **Tikit**; described as "restaurant owner" and "Forbes 30u30 honoree".
- The live site's title is from Nov 2019. Six-plus years later the current role is almost certainly different. **This is open question #1.**

### 1.5 Defects in the current site worth noting (so the redesign doesn't repeat them)

- `<span class="label"CV</span>` — missing `>`; the CV label is malformed HTML.
- `<meta name="viewport" ... user-scalable=no>` and `window.ontouchmove = function(){ return false; }` — disables pinch-zoom and touch scrolling. Accessibility fail.
- No `<meta name="description">`, no Open Graph / Twitter card, no favicon, no `lang` attribute on `<html>`, no `hreflang` between `index.html`/`ka.html`, no sitemap/robots.
- 328 KB PNG headshot where a ~30 KB WebP would do; 276 KB JPEG background loaded on every visit.
- CV lives on a OneDrive share link (can expire / change).
- Copyright year via `document.write` (blocked in some browsers, useless for SEO).
- Template is a stock HTML5 UP theme used by thousands of sites — the opposite of "stand-out".

### 1.6 Worth preserving

- **Bilingual EN/KA.** Rare, genuinely distinctive, culturally right. Elevate it from a footer link to a core design element.
- The core facts: name, Tbilisi, Cambridge Bioengineering, McKinsey Digital, Bank of Georgia, LinkedIn/Twitter handles.
- `images/TMheadshot.jpg` as a fallback portrait until a new shoot.
- The domain and GitHub Pages hosting (zero cost, owner already knows the workflow).
- The 2019/2017 archives — useful "before" material for the journey case study.

---

## 2. Goals & success criteria

**Goal.** Replace a stock-template business card with a site that (a) tells a real story about who Tengiz is and what he builds, (b) is technically and visually at a level that award juries take seriously, and (c) is itself a documented case study.

**Success criteria (measurable):**

1. Shipped on `tengmesk.com` via GitHub Pages, EN + KA, by end of M5.
2. Lighthouse mobile: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100 (see §7 budgets).
3. Submitted to at least Awwwards and CSS Design Awards (M6). Stretch: Honorable Mention or better.
4. A "signature interaction" that a visitor would describe to someone else in one sentence.
5. Every milestone has a journal entry with before/after screenshots in `docs/journey/`.
6. Zero regressions vs. today: every existing link/fact carried over or consciously retired.

**Non-goals (v1):** a CMS, a full blog engine, comments, newsletter, backend of any kind.

---

## 3. Audience

Primary (in order):

1. **People who just met Tengiz** — at a conference, in a deal, on LinkedIn — and google him. They need: who is this, what has he done, is he credible, how do I reach him. 20 seconds.
2. **Founders, hiring managers, partners** deciding whether to work with him. Need: track record, what he's building now, a point of view.
3. **Award juries / design & dev community** — arrive via Awwwards etc. Need: craft, originality, performance, and (bonus) the making-of.
4. **Georgian-speaking network** — colleagues, press, local ecosystem. Need: native-language parity, not an afterthought.

Design implication: the site must satisfy audience 1 in the first viewport *without* motion (reduced-motion users, slow phones), and reward audience 3 with depth if they scroll.

---

## 4. Creative direction

### 4.1 Concept

**"Layers."** Bioengineer → consultant → bank technologist → builder of agents. A person made of strata, in a city (Tbilisi) literally built on layered terrain and hot-spring rock. Georgian script alongside Latin as *two surfaces of one identity*, not a translation dropdown. The site reads as a cross-section: each scroll reveals a deeper layer.

### 4.2 Three direction options

**A — "The Ledger" (editorial / Swiss-brutalist).**
Oversized type, hard grid, monochrome + one accent, hairline rules, a running marquee of the KA name, a dense timeline. Motion is restrained: split-text reveals, sticky section headers, magnetic links.
*Pros:* lowest risk, fastest, ages well, very readable on mobile. *Cons:* the category is crowded on Awwwards; needs exceptional typography and copy to stand out.

**B — "Terrain" (recommended).**
A full-viewport hero of *living contour lines* — a lightweight WebGL/2D-canvas topography that breathes and bends toward the cursor, hinting at both Caucasus terrain and circuit traces. As you scroll, the contours flatten into a horizontal *strata* layout where each career layer is a band you scroll through (pinned, ScrollTrigger). Typography is editorial (large serif display + clean sans body). The KA/EN switch is the signature interaction (below).
*Pros:* a real concept tied to the person and place; the hero is memorable and unusual; degrades gracefully to a static SVG contour on reduced-motion/low-end. *Cons:* shader work costs time; must be tuned hard for mobile.

**C — "The Operating System" (playful / systemic).**
The site as a tiny OS or terminal: windows, a command palette (`⌘K` → "go to work", "switch to ქართული"), a status bar, nods to agile boards and AI agents. Very "builder".
*Pros:* fun, on-brand for the AI-agent work, high shareability. *Cons:* gimmick risk; harder to read as a senior-executive profile; accessibility of window metaphors is fiddly.

**Recommendation: B, with A's typographic discipline.** Terrain gives a hero worth a screenshot; the Ledger rules keep the rest honest and fast. Reserve one C idea — the `⌘K` command palette — as an easter egg for audience 3.

### 4.3 Signature "wow" interaction

**The bilingual morph.** In the hero the name is set in Latin. Hovering/tapping the language toggle (or pressing `K`) makes the letters of *Tengiz Meskhi* physically morph into *თენგიზ მესხი*: split into glyphs, each Latin glyph crossfades/scales into its Georgian counterpart in a staggered wave, the contour terrain behind shifts palette, and *the entire page* switches language in place with no reload (`/` ↔ `/ka/` URL updates via `history`). Reverse on toggle back. It is fast (≤ 600 ms), keyboard-accessible, and under `prefers-reduced-motion` becomes an instant swap with a soft fade.

Secondary signatures: terrain follows cursor/gyroscope; timeline bands "settle" like sediment as you scroll; magnetic contact button.

### 4.4 Typography

- **Display:** a high-contrast editorial serif with real Georgian coverage. Candidates: *Noto Serif Georgian* paired with *Instrument Serif* / *Fraunces* for Latin; or a single family with both scripts (commercial options exist — needs owner budget decision, see §11). Georgian *Mkhedruli* letterforms are round and calligraphic; they should look like a feature, not a fallback.
- **Body/UI:** *Inter* (v4+ includes Georgian) — one variable file covers both scripts, good at small sizes.
- **Mono (accents, timeline dates, `⌘K`):** *JetBrains Mono* or *Geist Mono*, subset.
- Scale: fluid `clamp()` type; hero name 12–18 vw; body 17–19 px; measure ≤ 70 ch. Everything subset with `pyftsubset`/`glyphhanger`; total font payload ≤ 120 KB.

### 4.5 Color

- **Ink** `#0B0B0C` · **Paper** `#F3EFE6` (warm, not pure white) · **Accent** one only: *Saperavi* deep wine `#7A1E2B` (Georgian, sober, works on light and dark) — alternative accent: sulfur-bath amber `#C98F2A`. Choose one; test both in M2.
- Full dark mode (default follows `prefers-color-scheme`, manual toggle persisted). Terrain lines are accent-on-ink in dark, ink-on-paper in light.
- Contrast AA minimum everywhere, AAA for body copy.

### 4.6 Motion language

- Smooth scroll (Lenis) + GSAP ScrollTrigger for pinned/choreographed sections; easing family: `expo.out` for entrances, `power2.inOut` for morphs; durations 0.4–0.9 s; stagger 20–40 ms.
- Rule: *motion explains structure* (a layer settling, a glyph becoming its twin). No motion for decoration alone. No scroll-jacking outside the pinned hero/strata.
- Everything behind `prefers-reduced-motion: reduce` → static contour SVG, instant transitions, native scroll. Tested, not assumed.
- Custom cursor: optional, desktop only, never hides the native cursor for interactive elements.

---

## 5. Information architecture

Single long-scroll home with anchored sections, plus a few real pages. Both locales.

```
/            (en)        /ka/           (ka)
├─ #hero      Name morph, one-line "what I do now", terrain
├─ #now       3–5 bullets: current role, what he's building, where
├─ #layers    Career strata timeline (Cambridge → McKinsey → BoG → Tikit → now)
├─ #work      3–6 selected things (products, teams, experiments) — cards → detail
├─ #writing   (optional, only if owner wants a blog; else omit)
├─ #contact   Email, LinkedIn, X/Twitter, CV, location/timezone
└─ footer     Language switch, colophon ("built with…", link to /journey)

/work/<slug>/     Case-study page per selected item (en + ka)
/journey/         "Making of" — rendered from docs/journey/*.md
/cv.pdf           Hosted in repo (replaces OneDrive link)
/404              On-concept (a layer that doesn't exist)
```

Navigation: minimal top bar (name/mark, section links, KA/EN, theme). `⌘K` palette as easter egg (M4, if time).

---

## 6. Content inventory

| Item | Exists today? | Source / status | Needed from owner |
|---|---|---|---|
| Name (EN/KA) | ✅ | `index.html`, `ka.html` | confirm "Tengiz" vs "Tengo" usage |
| Current title/company | ⚠️ stale (2019) | `index.html` `<title>` | **current role, org, one-line "now"** |
| Location | ✅ Tbilisi | `index.html` | confirm; timezone |
| Education | ✅ Cambridge Bioengineering | `index.html`, `archive/2019indexold.html` | years, college, anything notable |
| McKinsey Digital | ✅ mention only | `index.html` | years, what kind of work, 1–2 anonymised stories |
| Bank of Georgia | ✅ title only | `index.html` | years, scope (team size, what "Head of Agile" delivered), outcomes |
| Tikit (co-founder / Head of Product) | ❌ | web snippet, unverified | confirm; description, dates, link, imagery |
| Restaurant | ❌ | web snippet, unverified | confirm; name, link, whether to feature |
| Forbes 30u30 / under30.ge 2020 | ❌ | web snippet | confirm; year/category; badge asset |
| AI-agent / Claude Code experiments | ❌ | GitHub `cowork-jobs`, `seomachine` | which to show; 1-paragraph each |
| Portrait | ⚠️ | `images/TMheadshot.jpg` (38 KB) | **new photography** (2–4 shots, incl. one wide/environmental) |
| CV PDF | ⚠️ OneDrive link | `index.html` | updated PDF to host in repo |
| LinkedIn / Twitter | ✅ | `index.html` | confirm; add X handle, email, GitHub? |
| Georgian copy | ✅ tagline only | `ka.html` | translation of all new copy (owner or trusted translator) |
| Bio (long-form, 150–250 words) | ❌ | — | draft interview → I write, owner edits |
| OG image, favicon | ❌ | — | none (we design) |
| Selected work (3–6) | ❌ | — | pick list + any screenshots/press |

---

## 7. Tech stack recommendation

**Astro (static output) + GSAP + Lenis + a tiny canvas/WebGL hero, deployed by GitHub Actions to GitHub Pages.**

Why:

- **Deploy-compatible.** Output is plain static files → GitHub Pages, which is what serves tengmesk.com today. No hosting migration, no bill. `actions/deploy-pages` is the official path.
- **Zero-JS by default.** Astro ships no framework runtime; only islands (hero, morph, palette) hydrate. This is how we hit the perf budget while still doing award-grade motion.
- **Built-in i18n routing** (`/` and `/ka/`), content collections for work items and journal entries (`docs/journey/*.md` can be rendered directly to `/journey/`), image pipeline (`astro:assets` → AVIF/WebP, sized).
- **GSAP** (ScrollTrigger, SplitText — all free since 2025) is the industry standard for this style of site; **Lenis** for smooth scroll. **OGL** (≈ 10 KB) or plain 2D canvas for the contour terrain; avoid full three.js unless the hero grows.
- **TypeScript**, **Tailwind v4 or vanilla CSS with tokens** (recommend vanilla CSS + custom properties — fewer abstractions, design tokens map 1:1 to the spec), **Playwright** for visual regression + reduced-motion tests, **Lighthouse CI** in Actions.
- Alternatives considered: *Next.js static export* (heavier runtime, i18n static export is clunkier), *SvelteKit* (fine, but Astro's content model fits a mostly-static site better), *plain HTML/Vite* (fastest to start, painful for i18n + collections).

Repo layout (target):

```
src/{pages,layouts,components,content,styles,scripts}
public/{cv.pdf,fonts,og}
docs/{redesign,journey}
.github/workflows/deploy.yml   (build → deploy-pages; Lighthouse CI on PR)
CNAME                           (added at cutover, M5)
```

---

## 8. Performance, accessibility, SEO budgets

**Lighthouse (mobile, throttled):** Perf ≥ 95 · A11y 100 · Best Practices 100 · SEO 100. Enforced in CI on every PR (LHCI, assert ≥ 90 perf on PR, ≥ 95 on main).

**Core Web Vitals targets:** LCP ≤ 2.0 s · CLS ≤ 0.05 · INP ≤ 200 ms (mid-range Android).

**Weight budgets (first view, gzip/brotli):** HTML ≤ 30 KB · CSS ≤ 40 KB · JS initial ≤ 60 KB, hero island ≤ 90 KB lazy · fonts ≤ 120 KB total (subset, `font-display: swap`, preload display face) · images above the fold ≤ 150 KB · total ≤ 700 KB. Terrain must hold 60 fps on a 2022 mid-range phone or fall back to static.

**Accessibility:** WCAG 2.2 AA; full keyboard operation incl. language toggle and palette; visible focus; semantic landmarks; `lang` and `hreflang` correct on both locales; motion fully gated by `prefers-reduced-motion`; no `user-scalable=no`; text never in canvas only (the morphing name has a real `<h1>` underneath); colour never the sole signal; axe clean in Playwright.

**Mobile:** designed mobile-first; terrain responds to touch/gyro or stays calm; pinned sections have a non-pinned mobile variant; 16 px gutters; no horizontal scroll.

**SEO/meta:** unique title + description per page and locale; OG/Twitter images (generated per page at build); JSON-LD `Person`; `sitemap.xml`, `robots.txt`; canonical + `hreflang` pairs; 301 map for old URLs (`/ka.html` → `/ka/`).

---

## 9. Phased milestones

Each milestone = one PR set + one journal entry (`docs/journey/NN-*.md`) with before/after screenshots.

| # | Milestone | Deliverables | Exit criteria |
|---|---|---|---|
| **M0** | Kickoff (this doc) | `docs/redesign/SPEC.md`, `docs/journey/00-kickoff.md`, `docs/journey/README.md` | owner answers §11 |
| **M1** | Foundations & parity | Astro scaffold, CI deploy to Pages (project URL `tengmesk.github.io/tengmesk.com` as staging), EN/KA routing, content collections, design tokens, a plain but complete parity site (all current facts, fixed defects from §1.5), CV hosted, OG/favicon, sitemap | Lighthouse 100/100/100/100 on the parity site; staging URL live |
| **M2** | Design system & direction | Moodboard, type + colour exploration, three direction mock-ups (A/B/C) as coded prototypes on staging, choose one; component library (nav, section, card, timeline band, buttons, toggle) | owner picks direction; tokens frozen |
| **M3** | Signature hero | Terrain canvas/WebGL, bilingual name morph, theme toggle, reduced-motion + low-end fallbacks, perf tuning | 60 fps on test devices; hero island ≤ 90 KB; a11y checks pass |
| **M4** | Story & sections | Now, Layers timeline, Work cards + detail pages, Contact, 404, `⌘K` palette (stretch); real copy EN + KA; new portraits | all content in; visual regression suite green |
| **M5** | Polish & launch | Full a11y audit, LHCI gates, cross-browser, analytics decision, **cutover**: remove `CNAME` from `tengmesk.github.io` (or archive it), add `CNAME` here, enable Pages custom domain + HTTPS, 301s | tengmesk.com serves the new site; old URLs redirect |
| **M6** | Case study & awards | `/journey/` page rendered from journal; a11y/perf statement; submission assets (video, screenshots); submit to Awwwards, CSSDA, (FWA if eligible) | submissions filed; journal closed with retrospective |

Rough effort: M1 1 wk · M2 1–2 wk · M3 2 wk · M4 2 wk · M5 1 wk · M6 1 wk. Calendar depends on owner content turnaround.

---

## 10. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Domain conflict: `tengmesk.github.io` holds the `CNAME` | launch blocked / downtime | Build on project-site staging URL; scripted cutover in M5 with DNS unchanged (same GitHub Pages IPs); keep old repo as archive |
| Thin content — a one-screen bio can't win awards | jury sees polish, no substance | M4 is content-heavy; owner interview early (M1) |
| WebGL/canvas hero tanks mobile perf | fails budget, kills LCP | budget-first: lazy island, DPR cap, static SVG fallback, real-device tests |
| Over-animation / scroll-jacking | annoys users, hurts a11y | motion rules §4.6; reduced-motion parity is a *feature*, tested in CI |
| Georgian typography looks like a fallback | undermines the concept | pick display face for KA coverage first; test KA copy at hero scale in M2 |
| Stale facts (role from 2019) | credibility | open question #1; nothing ships without owner sign-off |
| Owner time for copy/photos/translations | schedule slip | parity site (M1) ships regardless; content gated items are M4 |
| Font licensing for a commercial Georgian display face | cost/legal | default to open fonts (Noto, Inter); commercial only if owner opts in |
| Awards are subjective; fees apply | no guarantee | treat the case study + Lighthouse scores as the durable win |

---

## 11. Open questions for the owner

1. **What is your current title/role and org (2026)?** The live site still says "Deputy CIO, Head of Agile @ Bank of Georgia" from 2019.
2. **One sentence: what do you want a stranger to know about you?** (Executive? Builder? Both, in which order?)
3. Which of these to feature, and how prominently: Bank of Georgia · McKinsey · Cambridge · **Tikit** · the **restaurant** · Forbes/under30 honours · your **AI-agent / Claude Code experiments**? Anything to leave out?
4. Do you want a blog/writing section (there's a 2019 `<!-- Add blog link here -->`), or keep it link-out?
5. Name usage: "Tengiz" everywhere, or "Tengo" (as on GitHub) in the friendly places?
6. Georgian: full parity (every page) or hero + bio only? Who translates?
7. Photography: are you up for a new portrait shoot (2–4 images, one wide)? Any existing high-res photos?
8. Direction preference from §4.2 (A / B / C) — or gut reaction to "Terrain + bilingual morph"?
9. Accent colour: Saperavi wine or sulfur amber? Dark-first or light-first?
10. Analytics: none / privacy-friendly (Plausible-style) / other?
11. Contact: publish an email address? Which X/Twitter handle is current? Add GitHub?
12. CV: OK to host the PDF in this repo (public)? Send the current version.
13. Domain ops: you control DNS and both repos, yes? OK to archive `tengmesk.github.io` after cutover?
14. Budget: any for a commercial display font or award entry fees?
15. Deadline or event you want this live for?

---

## Revision 1 · 2026-09-30 · Rebrand to Tengo / 10go

Owner feedback after seeing the A/B mockups:

- **Name:** Tengo Meskhi / თენგო მესხი (replaces Tengiz / თენგიზ everywhere).
- **Motif:** Tengo reads as **10go**. Wordmark = `10go`, with **eyes inside the 0 and the o** that follow the cursor and blink (inspired by colin-moy.webflow.io). Alternative to test: eyes in the e's of "Tengo Meskhi".
- **Intro:** counter 1 → 10, then "go" slides in, the eyes open, and the visitor chooses: **At work** (professional) or **The person** (personal). Skippable, remembered on return visits, instant under reduced motion.
- **Two paths:**
  - **Homepage = business** (inspired by jaybaer.com): clear offer, proof strip, ways to work together, testimonials, strong CTA. Keeps the Terrain contour hero + EN/KA name morph.
  - **"Get to know me" page = personal and playful** (inspired by abdussalam.pk and nickvelten.nl): big fun type, sticker cards, stories, photos.
- Direction is now **B "Terrain" for work + a playful personal layer**, tied together by the 10go eyes.
- References could not be viewed from the build sandbox (network policy); mockup is based on the owner's description. Owner to confirm the look matches the references.

Mockup: `docs/redesign/mockups/10go-intro.html`.

## Revision 2 · 2026-10-01 · Professional, light, no eyes

- **Eyes dropped:** too playful. 10go stays as a story on the About page, not a UI device.
- **Intro chooser dropped.** The homepage is the professional page. The personal side lives at **/about**.
- **Light mode** is the default and only theme for now.
- **Homepage order:** hero (roles, name, one-line pitch, CTAs) → featured-in / on-stage proof strip → Now (Conceptdigital, Digital Institute, Boon) → Track record (Cambridge → McKinsey → Bank of Georgia → Pensight → own companies, Forbes 30U30) → Where I can help (transformation & agile · AI & digital products · speaking & moderating) → On stage (event photos) → Press & interviews → About teaser → Contact → footer.
- **Language:** EN/ქართული selector in the footer, and in the hamburger menu on mobile.
- **Hero background:** still open. Mockup compares Contours, Dot field, Flow, Aurora and a photo (Stamba rooftop).
- Type: Instrument Serif display + Geist body/mono; Noto Georgian faces for KA. Accent: Tbilisi amber on near-white.

Mockup: `docs/redesign/mockups/home-professional.html` (images resolve from `img/` when published; sources in `assets/photos/`).

## Revision 3 · 2026-10-04 · Site plan written

The definitive v2.0 plan now lives in `docs/redesign/SITE-PLAN.md` and governs over §4–§6 of this document where they differ. Summary: two pages (`/`, `/about/`) in EN and KA plus a 404; hero background = contours with a build-time SVG fallback; no Lenis/ScrollTrigger/custom cursor in v2.0; press cards kept as source only; unknown facts are omitted rather than shown as placeholders. Content source of truth: `assets/media.yaml`. Journal: `docs/journey/03-site-plan.md`.
