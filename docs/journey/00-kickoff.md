# 00 — Kickoff

29 Sep 2026 · Milestone M0 · Status: done

## Goal

Before touching a pixel: understand what tengmesk.com is today, why it deserves a rebuild, and agree on a plan that can realistically land a site of award-show quality on the same free hosting it already uses. Output of this milestone is the spec (`../redesign/SPEC.md`), this entry, and a list of questions for Tengiz.

## What exists today

The first surprise: **this repository is empty.** `tengmesk/tengmesk.com` exists on GitHub with the description "Personal website", but has no branches and no commits — the local clone has zero git objects. So where does the site come from?

DNS answered that. `tengmesk.com` and `www.tengmesk.com` resolve to `185.199.108–111.153`, which are GitHub Pages' addresses. The site is actually served from an older repo, **`tengmesk/tengmesk.github.io`**, whose `master` branch holds a `CNAME` file reading `tengmesk.com`. Its commit log tells the whole history in eleven lines: a Codecademy "Save my work" in July 2016, "Start from scratch" plus a template in March 2017, a template swap and the Georgian page in November 2019, and "Create CNAME" in June 2020. Nothing since.

What's in it:

- `index.html` — a one-screen page on HTML5 UP's free **"Aerial"** template: a slowly panning sky background, a rounded headshot, the name, two lines of bio, three icon links (LinkedIn, Twitter, CV on OneDrive).
- `ka.html` — the same page fully translated into Georgian. Honestly the best thing about the site.
- `archive/2019indexold.html` — the 2017 version, on HTML5 UP's "Identity" template, when the tagline was "Engineering Undergraduate at Cambridge".
- Two portraits (a 328 KB PNG in use, a 38 KB JPEG not in use), the template's CSS/Sass/webfonts, and a 276 KB background image.

The copy, verbatim: *"Deputy CIO, Head of Agile @ Bank of Georgia • Tbilisi, Georgia — Cambridge Bioengineering grad and Digital McKinsey alum."* That's from 2019. There's even an HTML comment, `<!-- Add blog link here -->`, that never got its link.

Around the web (search snippets only — the sandbox couldn't open the pages, so these are unverified until Tengiz confirms): a 2020 under30.ge Technology honoree, co-founder and Head of Product at a startup called Tikit, a restaurant owner, a Forbes 30u30 mention. His GitHub shows recent work on AI-agent job queues and a Claude Code workspace. In other words: a lot more story than two lines.

## Why redesign

1. **It's a stock template.** Aerial is used on thousands of sites. It's pleasant and it's anonymous — the exact opposite of "stand-out".
2. **It's stale.** Title from 2019, CV on a OneDrive link, no mention of anything after Bank of Georgia.
3. **It has real defects.** Pinch-zoom disabled (`user-scalable=no`), touch scrolling blocked (`window.ontouchmove = () => false`), no meta description, no social preview image, no `lang`/`hreflang`, a malformed tag on the CV link, a 328 KB PNG where 30 KB would do.
4. **It doesn't say anything.** One screen, no work, no point of view. Award juries — and, more importantly, the people who google him after a meeting — get nothing to hold on to.

What we're keeping: the domain and GitHub Pages hosting (free, already wired), the bilingual EN/KA idea (promoted from a footer link to the heart of the design), the core facts, the old versions as "before" material.

## Decisions

- **Build in this repo, deploy to GitHub Pages.** Same host as today, so no migration cost; the only tricky bit is that the custom domain is currently claimed by the old repo, so launch is a planned cutover rather than a push. (Spec §1.1, §9 M5.)
- **Astro + GSAP + Lenis + a small canvas/WebGL hero.** Static output for Pages, zero JS by default, built-in i18n for `/` and `/ka/`, content collections so this very journal can render on the site. (Spec §7.)
- **Concept: "Layers".** A person built in strata — bioengineer, consultant, bank technologist, builder — in a city built on layered rock. Three directions were sketched (Ledger / Terrain / Operating System); **Terrain** is recommended, with the Ledger's typographic discipline. (Spec §4.)
- **Signature interaction: the bilingual morph.** The name *Tengiz Meskhi* morphs glyph-by-glyph into *თენგიზ მესხი* and the whole page follows, in place, no reload. It's the one thing a visitor should be able to describe afterwards. (Spec §4.3.)
- **Budgets before beauty.** Lighthouse ≥ 95 / 100 / 100 / 100 on mobile, LCP ≤ 2 s, fonts ≤ 120 KB, reduced-motion as a first-class mode. Enforced in CI so the hero can't quietly get heavy. (Spec §8.)
- **Parity first.** M1 ships a plain, correct, fast version of what exists today on a staging URL before any of the fancy work starts. If everything else slips, the site is still better than it is now.

## What got built

Nothing on the site yet — by design. Three documents:

- `docs/redesign/SPEC.md` — the full plan: audit, goals, audience, creative direction, IA, content inventory, stack, budgets, milestones, risks, questions.
- `docs/journey/README.md` — how this journal works.
- `docs/journey/00-kickoff.md` — this entry.

## Before / after

*Before* (to be captured at 1440×900 and 390×844 in M1, from the live site): the Aerial template with the panning sky, headshot, two lines, three icons. Add to `docs/journey/assets/00-before-desktop.png` and `00-before-mobile.png`.

*After*: n/a for this milestone.

## Lessons

- **Check DNS before assuming where a site lives.** An empty repo with a live domain is a clue, not a dead end.
- **The archives are gold.** The 2017 and 2019 versions give the case study a real arc: student → consultant → executive → whatever comes next.
- **The bilingual page is the idea hiding in plain sight.** It was there all along as a footer link; the redesign is mostly about taking it seriously.

## Next

M1 — Foundations: scaffold Astro, wire GitHub Actions to Pages on a staging URL, port every fact from the old site, fix the defects, host the CV, and hit 100s on Lighthouse with a deliberately plain design. Meanwhile, Tengiz answers the fifteen questions at the end of the spec — especially the first one: what's the job title in 2026?
