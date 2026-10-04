# Assets

Raw material supplied by Tengo. **Not used on the site yet.** When the site is built, images are optimised (AVIF/WebP, resized) by `astro:assets`; the originals stay here as the source.

- `media.yaml` — **the content source of truth**: person, socials, roles, ventures, recognition, talks, teaching, press, interviews, photos, press cards. One top-level key per future Astro content collection; every entry has a stable `id`, and unknowns are the literal `tbc`. `featured: true` marks what the homepage shows. The site plan (`../docs/redesign/SITE-PLAN.md`) refers to these ids.
- `press/` — event and press graphics as received (source only in v2.0).
- `photos/<event>/` — event photography as received.

## Press cards (`press/`)

| File | Size | What it is | v2.0 use |
|---|---|---|---|
| `forbes-georgia-quote-ka.webp` | 1080×1350 | Forbes Georgia quote card (Georgian), credited "co-founder, Conceptdigital". Clean studio headshot on pale blue. | source only; quote may be used on About (translation tbc) |
| `global-tech-weekend-2025-forbes-moderator.png` | 768×960 | Global Tech Weekend Tbilisi 2025 × Forbes, moderator, 20 June, Stamba rooftop | source only |
| `def-ai-2025-speaker.webp` | 1280×1600 | DEF-AI 2025, Tbilisi, 19 Sep, "CEO and Founder of Conceptdigital and CTO of Boon" | **interim portrait**: crop the headshot square (see SITE-PLAN §8) until the original arrives |
| `globalize-uk-2022-speaker.webp` | 1080×1080 | Globalize UK Conference, London, 18 Nov 2022, "Head of Growth, Pensight" | source only |
| `tevent-talks-guest.webp` | 1280×1280 | Tevent Talks, special guest | source only |

The cards carry third-party branding, older "Tengiz" credits and clashing palettes, so the homepage does not render them. They remain the evidence for the facts in `media.yaml`.

**Facts the cards add (confirm before use):** CEO & Founder of Conceptdigital (one card says co-founder) · CTO of Boon · Digital Institute · earlier Head of Growth at Pensight, London · Forbes Georgia 30 Under 30 (2020).

**Still needed from the owner:** the original studio headshot (grey shirt, plain background) at full resolution; a CV PDF; an email address; one-liners for Conceptdigital, Boon and Digital Institute; years per role.

## Photos (`photos/global-tech-weekend-2025/`)

All four are from the Forbes stage at Global Tech Weekend Tbilisi, 20 June 2025, Stamba Hotel rooftop. Alt text in both languages lives in `media.yaml` under `photos`.

| File | Size | What it is | v2.0 slot |
|---|---|---|---|
| `panel-wide-moderating.webp` | 2000×1330 | Moderating the Superstar Panel, with the screen and all panelists. The credibility shot. | Home › On stage, large (4:3 crop, focal 55% 50%) |
| `speaking-sunglasses-mic.webp` | 2000×1333 | Speaking with a mic, sunglasses, white shirt. Most personality. | Home › On stage, small; About hero; About OG image |
| `audience-stamba-rooftop.webp` | 2000×1085 | Full room under the amber-lit timber roof. The light matches the site accent. | Home › On stage, small (4:3 centre crop) |
| `panel-with-tomo-moriwaki.webp` | 2000×1333 | In conversation with Tomo Moriwaki. | Home › About teaser (4:3 crop, focal 75% 50%) |
