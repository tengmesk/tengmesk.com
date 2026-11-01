# Bake-off task: the tengmesk.com homepage

You are one of several independent entrants. Every entrant gets exactly this task, these inputs and the same model; the only difference is the design skill you are told to use. Your entry is judged side by side with the others.

## The job
Design and build the **homepage** of **tengmesk.com**, the personal/professional site of **Tengo Meskhi**. Homepage only, English only. Make it the best personal profile homepage you can: something a UK/US mid-market CEO lands on and books a call from, and that could be featured on Awwwards.

## Inputs (read all of them; they are the only source of truth)
Everything is in `bakeoff/inputs/` (read-only):
- `BRIEF.md`: the content brief from interviews with Tengo. **It wins over everything else.** Respect its framing rules and privacy rules exactly.
- `data/whereabouts.yaml`: where Tengo is now and next (for the city tracker).
- `data/media.yaml`: press, talks, teaching, interviews, socials, photo alt text. Older file: where it conflicts with BRIEF.md (e.g. Boon and Digital Institute are closed, base is London not Tbilisi), BRIEF.md wins.
- `images/photos/`: event photos (Global Tech Weekend × Forbes 2025, Tbilisi).
- `images/headshot/`, `images/personal/`: portraits and personal photos of Tengo, described in `images/PHOTOS.md` (headshot-1129 is his preferred headshot).
- `images/press-cards-source-only/`: third-party event cards. Source material only (you may crop a portrait from them if useful); do not show the cards themselves.
- `logos/`: client, employer and brand logos (see `logos/LOGOS.md`). Use only these; any organisation without a logo here (e.g. Pensight) is set as a clean typographic wordmark. Don't fetch other logos.

## Must-haves on the homepage
1. Who Tengo is and what he does, in his own positioning: *"I help companies use tech & AI to accelerate their growth and streamline their operations."* Talk about him in the third person (BRIEF §7), in a Mark Twain / Alex Hormozi tone: plain, punchy, witty, concrete numbers, no jargon.
2. Primary call to action: **Book a call** → https://cal.com/tengmesk/strategy . Secondary: LinkedIn → https://www.linkedin.com/in/tmeskhi . Public email: tmmeskhi@gmail.com.
3. **City tracker**: "Now: <city>" from `whereabouts.yaml`; on hover/focus/tap reveals "Coming up: …". Must work with mouse, keyboard and touch. Read the data at build time; don't hard-code cities in markup.
4. Proof: track record, numbers, logos, testimonials (BRIEF §5), Forbes 30 Under 30, speaking & teaching.
5. Where he can help (Conceptdigital consulting / building; Halocarbon fractional CMO shows range).
6. One-line health teaser, exactly in spirit: *"Building something new in health. Investors and partners: get in touch."* No product details.
7. Links: Inspiration (https://inspiration.tengmesk.com), socials (LinkedIn, X https://x.com/tengmesk, Instagram https://instagram.com/tengo.ai).
8. Features Tengo wants that have no content yet (newsletter, blog, intro video, CV download, speaker kit, Tbilisi guide): don't fake content. A newsletter sign-up form may be present as UI with no backend (say so in NOTES.md). Otherwise omit or link to clearly sensible future routes; never invent posts, videos or files.

## Hard rules
- **No invented facts, numbers, quotes, clients or awards.** Use only what the inputs say. Never show anything marked ⚠️ as fact; omit it. Never name clients on the BRIEF's private / not-cleared lists. Follow the Bank of Georgia awards framing rule exactly.
- **Palette direction:** forest-y: deep rich green, brown, off-whites (BRIEF §7). Light or dark is your call.
- **Tech:** custom code only, SEO-friendly, editable in Claude Code. Allowed: vanilla HTML/CSS/JS, **Next.js** (App Router, statically exported), or WordPress. Not allowed: a client-only React SPA (Vite/CRA), Webflow, Framer or any site builder. npm libraries are fine (GSAP, Lenis, Three.js, Tailwind, etc.).
- **Network & media:** internet access is available. Self-host everything the page uses at runtime (fonts via `@fontsource/*` / `next/font` or downloaded files; images and video downloaded into your project) so the page never hot-links a third-party server. You may source extra imagery or video (e.g. stock or your skill's own media library) if it genuinely serves the brief, but photos of Tengo and logos come only from the inputs. Imagery may also be generated in code (SVG, canvas, WebGL, CSS).
- **SEO & quality:** server-rendered/static HTML with real text, one h1, semantic landmarks, title/description/OG tags, alt text, visible focus, keyboard-operable, `prefers-reduced-motion` respected, no horizontal scroll at 390 px, no console errors, fast (aim LCP < 2.5 s).
- **Isolation:** read only `bakeoff/inputs/`, your assigned skill folder, and your own entry folder. Do **not** open any other folder under `bakeoff/` (other entries), or the rest of the repository (`src/`, `docs/`, `inspiration/`, `assets/`, git history or branches). Do not run git commands. Do not commit.

## Deliverables (all inside your entry folder)
- Source code, with a `README.md`: how to install, run, build.
- A static build at `<entry>/out/` (`index.html` + assets) that works when served from a local static server at `/`.
- `<entry>/screenshots/`: `desktop-hero.png` (1440×900 viewport), `desktop-full.png` (1440 wide, full page), `mobile-full.png` (390 wide, full page). Playwright is preinstalled: `import pw from '/opt/node22/lib/node_modules/playwright/index.js'; const { chromium } = pw;` (Chromium at /opt/pw-browsers). Python Playwright may also work.
- `<entry>/NOTES.md` (max ~1 page): concept, how you used the skill, key design decisions, what you'd do with more time, known gaps.

## Process
Follow your assigned skill's process faithfully (its setup, references and review loop). Look at your rendered result at desktop and mobile sizes and fix what you see before finishing; at least one full build → screenshot → fix pass. Aim to finish in a focused session.
