# 03 — The plan on paper

4 Oct 2026 · Between M0 and M1 (content and plan) · Status: done

## Goal

Stop designing in mockups and write the thing a builder can implement without asking questions: every page, every section, every string in two languages, the tokens, the hero decision, and what to do about the facts we still don't have. Also tidy the content Tengo sent into one file that can become Astro content collections as-is.

## Decisions

- **Two pages, not five.** v2.0 is `/` and `/about/` in EN and KA, plus a 404. `/speaking` and `/press` were considered and deferred: three events and eleven press items fit comfortably on the home page, and a thin dedicated page would look worse than a full section. Triggers for building them later are written down. (SITE-PLAN §1.)
- **Hero background: contours.** The owner liked them; they carry the Terrain idea from the kickoff; they are ink line-work that stays quiet behind a serif headline; they cost nothing (2D canvas, no library) and fall back to a build-time SVG of the same field. Dot field, flow and aurora each look like someone else's site; the Stamba photo is better used in the On stage section than as a hero that dates the site to one evening. (SITE-PLAN §6.)
- **Omit, don't apologise.** Years, one-liners, email and the CV are unknown. The plan gives every unknown a no-op state that looks deliberate: no date column until dates exist, cards that work with two lines, LinkedIn as the contact until there is an email. No "tbc" ever renders. (SITE-PLAN §10.)
- **Press cards stay in the drawer.** The five event graphics carry other people's branding, older "Tengiz" credits and purple/blue palettes. They are evidence, not decoration. The one exception: the DEF-AI card has a clean studio headshot we can crop as an interim portrait. (SITE-PLAN §8.)
- **Georgian is a page, not a toggle.** `/ka/` is real HTML with `hreflang`; the selector is a pair of links in the footer and the mobile menu. The in-place morph from the kickoff spec is gone with the rest of the theatre.
- **Fewer moving parts than the spec promised.** No Lenis, no ScrollTrigger, no pinning, no custom cursor in v2.0. Reveals on scroll, a magnetic primary button, and the contour field. Credibility first; the budget is 20 KB of JS in total.
- **Content schema.** `assets/media.yaml` is now one key per collection (person, socials, roles, ventures, recognition, talks, teaching, press, interviews, photos, press_cards), stable ids, `featured` flags, `tbc` for unknowns, alt text in both languages. The Forbes article that appeared twice is one entry referenced by id.

## What got built

- `assets/media.yaml` rewritten (11 collections, 39 entries, every original link kept) and `assets/README.md` updated to match.
- `docs/redesign/SITE-PLAN.md`: sitemap, both pages section by section with image slots and mobile behaviour, final EN copy and draft KA copy for every string, design tokens and type scale, the contour spec with a performance budget and fallback rules, component list, image crops and alt text, SEO/OG/JSON-LD, placeholder strategy, acceptance checklist, nine questions for the owner.
- No site code. That is M1.

## Before / after

Before: a 42 KB mockup with a background switcher and a `KA` dictionary inside a `<script>`. After: a plan a second person could build from. No screenshots this time; nothing visual changed.

## Lessons

- Writing the Georgian copy exposed layout risk early: Mkhedruli has no capitals and runs about a quarter longer, so every heading needs its own KA clamp. The mockup already had that; the plan now makes it a rule.
- Alt text forced us to look at the photos properly. "Full room under the roof" became a sentence that says where, when and what the light is doing. Good alt text is also a good caption brief.
- Most of the "design" decisions were really content decisions: which facts we can stand behind decides what the page can show. The owner's nine answers will change more pixels than any token.

## Next

M1 — Foundations: scaffold Astro with the collections from `media.yaml`, the i18n keys from SITE-PLAN §4, tokens from §5, the static contour SVG first and the island second, and get all four pages to 100/100/100/100 on the staging URL. Meanwhile, Tengo answers §12.
