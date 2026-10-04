# tengmesk.com v2.0 — Site plan

Status: ready for build · 2026-10-04 · Supersedes SPEC.md §4–§6 where they differ (SPEC Revision 2 is the governing brief). Content ids in this document point at `assets/media.yaml`.

**One-line brief.** A light, editorial, bilingual (EN + ქართული) professional site for Tengo Meskhi that answers in 20 seconds: who he is, what he has done, where he can help — and holds up to a careful look. Credibility first, craft close behind.

**Rules that shape everything below**

- Nothing on the site states a fact we do not have. Dates, one-liners, email and the CV are unknown today; v2.0 is designed to look complete without them (§10).
- Name is **Tengo Meskhi / თენგო მესხი**. Press titles stay as published ("Tengiz" in older pieces).
- Light mode only. No eyes, no intro, no 10go wordmark on the home page. The 10go story lives on About.
- Georgian is a real page at `/ka/…`, not a JS toggle. The selector is in the footer and in the mobile menu.

---

## 1. Sitemap

### v2.0 (ship this)

| EN | KA | Purpose |
|---|---|---|
| `/` | `/ka/` | Professional home: hero → proof → now → track record → help → on stage → press → about teaser → contact |
| `/about/` | `/ka/about/` | The person: the name (10go), the path, London, Tbilisi, teaching, elsewhere |
| `/404.html` | (same page, bilingual) | On-brand not-found with links home in both languages |
| `/sitemap-index.xml`, `/robots.txt`, `/og/*.png`, `/favicon.svg` | — | Build outputs |

Two content pages, both finished, both in two languages. That is the whole site. A small site that is complete beats a bigger one with thin pages.

### Later (not v2.0) and why

| Page | Trigger to build it |
|---|---|
| `/speaking/` | When there is a speaker one-sheet (topics, formats, past events with photos, a booking form) or more than ~6 events. Today the three events, two universities and three photos fit the home page's On stage section, and the hero's "Book me to speak" can point there. |
| `/press/` | When press + interviews exceed ~15 items or titled Digital Institute videos arrive. Today 11 items fit one list. |
| `/journey/` | v2.1, rendered from `docs/journey/*.md`; the case study for award submissions. |
| `/cv.pdf` | The moment the owner sends a PDF (`person.cv_pdf`). Add a "CV" link in Contact and footer; nothing else changes. |
| Dark mode | Not planned. Light only is a decision, not a gap. |

### URL and language rules

- Trailing slashes on, `index.html` per route (GitHub Pages).
- `<html lang="en">` / `<html lang="ka">`; every page carries `hreflang` pairs (`en`, `ka`, `x-default` → EN) and a canonical.
- Old URL `/ka.html` → `/ka/` via a meta-refresh stub page (Pages has no server redirects) plus `<link rel="canonical">`.
- The footer selector links to the *same page* in the other language (`/about/` ↔ `/ka/about/`). No cookie, no auto-redirect by browser language (it hurts shared links); remember the last choice in `localStorage` only to pre-highlight the selector.

---

## 2. Home page, section by section

Order is fixed by Revision 2. Section ids are also the nav anchors.

### 2.1 Nav (`<header>`)

- Left: brand "Tengo Meskhi**.**" (display serif, amber full stop). Links to `/` (or `/ka/`).
- Right (≥ 900 px): How I help · Track record · Speaking · Press · About · **Get in touch** (pill, ink). Anchors on the home page; on `/about/` they become `/#help` etc.
- < 900 px: hamburger → full-screen menu (display-size links, language selector at the bottom, close button). Body scroll locked while open; `Esc` closes; focus trapped; returns focus to the burger.
- Sticky, translucent paper with blur (the one place blur is allowed); hairline border appears after 10 px of scroll.
- Height 64 px desktop / 60 px mobile, respects `safe-area-inset-top`.

### 2.2 Hero `#hero`

**Purpose.** Who, what, and two things to do next. The LCP element is the `<h1>` text.

**Content.** `roles` featured current (`conceptdigital-ceo`, `boon-cto`) + `recognition.forbes-30u30-2020` as three chips · `<h1>` name · lead · two CTAs.

**Layout.** Full-bleed, min-height `min(88svh, 900px)`, content left-aligned on a 1240 px container, padding-top `clamp(72px, 11vw, 150px)`. Background: contour canvas (§6) behind a left-to-right paper wash so the text zone is always calm. Stack: chips → h1 → lead (max 34ch) → CTAs. Bottom hairline.

**Motion.** On load: chips, h1, lead, CTAs rise 8 px and fade in, 60 ms stagger, 500 ms, once. Contours drift slowly and lean gently toward the pointer. Under reduced motion: static SVG contours, no entrance animation.

**Mobile.** h1 `clamp(56px, 15vw, 168px)` (KA: `clamp(40px, 10.5vw, 124px)` at weight 300, line-height 1.05). Chips wrap to two lines. CTAs stack full-width under 420 px. Canvas cell size grows (fewer lines) and pointer influence is off; a device-orientation tilt is **not** used in v2.0 (permission prompt on iOS, no payoff).

### 2.3 Proof strip `#proof`

**Purpose.** Third-party credibility in one glance. Text only, no logos (we have no logo licences and logo rows look like every SaaS site).

**Content.** Three labelled rows from `press` (outlets, deduped), `talks` (`event_short`) and `teaching` (institutions).

- Featured in · McKinsey & Company · Forbes Georgia · Georgian Journal · BMG [tbc: confirm Tengo is named in the McKinsey piece; if not, drop McKinsey from this row and keep it in Track record]
- On stage at · Global Tech Weekend × Forbes · DEF-AI 2025 · Globalize UK
- Guest lecturer at · Kutaisi International University · Grigol Robakidze University

**Layout.** Label column (mono eyebrow) + wrapping row; hairline above and below; sits inside the container directly under the hero. Items are plain text, `ink-2`, 15–18 px. On mobile the label sits above its row.

### 2.4 Now `#now`

**Purpose.** What he is building today.

**Content.** `ventures` featured, in `order`: Conceptdigital (Founder & CEO) · Digital Institute (Founder) · Boon (CTO). One line each from `ventures[].summary.en` once confirmed.

**Layout.** Section header (eyebrow "Now" + h2) then three cards, `repeat(auto-fit, minmax(260px, 1fr))`. Card: role (mono eyebrow, amber-ink) → name (display 34 px) → one line (ink-2) → optional "Visit ↗" when `url` is known. Card hover: translateY(-3px) + soft shadow, 300 ms. Cards without a summary show role + name only and still look intentional (fixed min-height, consistent padding). See §10.

**Mobile.** Single column, cards full width.

### 2.5 Track record `#track`

**Purpose.** The path, oldest to newest, with one proof link.

**Content.** `roles` featured, rendered oldest → newest: `cambridge-bioengineering` · `mckinsey-digital` · `bank-of-georgia` (link → `press-mckinsey-agile-bank`) · `pensight-growth` · own companies (`conceptdigital-ceo`, `boon-cto`, `digital-institute-founder` as one row). Then the award band from `recognition.forbes-30u30-2020` linking to `press-georgian-journal-30u30`.

**Layout.** A ruled list (ink top rule, hairline between rows), three columns: org (display 26–38 px) · role (500) · what (ink-2, 1–2 lines). No year column in v2.0; when `period` arrives it becomes a fourth, mono, leading column without re-layout. Award band: amber wash background, 2020 (mono) · "Forbes Georgia 30 Under 30" (display) · source link.

**Motion.** Rows fade/rise in on scroll, 40 ms stagger, once.

**Mobile.** Each row stacks org / role / what.

### 2.6 Where I can help `#help`

**Purpose.** The offer. This is the section a founder or board member is looking for.

**Content.** Three numbered columns (copy in §4). Intro line under the h2 states who it is for.

**Layout.** Section header on a 1fr/2fr grid (eyebrow + h2 left, intro right); then three columns separated by hairlines, each: `01` (mono amber) → h3 (sans 600 22 px) → paragraph. No icons.

**Mobile.** Columns stack with hairlines between.

### 2.7 On stage `#stage`

**Purpose.** Show, don't tell: real photos, real events.

**Content.** Photos `photo-gtw-panel-wide` (large), `photo-gtw-speaking` (small 1), `photo-gtw-audience` (small 2). Event list from `talks` featured + `teaching` featured.

**Layout.** Photo grid `2fr 1fr`, two rows; large figure spans both rows at 4:3, small figures 4:3. Figcaption overlaid bottom-left on a soft dark gradient (white 12–13 px text; the gradient keeps contrast ≥ 4.5:1). Under the grid, a ruled list of five entries: bold event · role · city · month year (events) or role · topics (teaching). Event names link to `talks[].url` where known.

**Motion.** Images scale from 1.03 → 1 on reveal (600 ms). Hover: none on images, caption stays.

**Mobile.** Figures stack, all 3:2 (native), captions inline below each image instead of overlaid (easier to read, no contrast risk).

### 2.8 Press & interviews `#press`

**Purpose.** Everything written or recorded, in one scannable list.

**Content.** Two sub-lists. Articles: `press-forbes-strategic-code`, `press-mckinsey-agile-bank`, `press-georgian-journal-30u30`, `press-bmg-pensight-london`, `press-bmg-digital-institute`. Interviews & podcasts: `int-ai-interconnect`, `int-tevent-talks`, `int-alexander-mihalcea`, `int-bmg`, `int-lk-podcast`, `int-globalize`. Digital Institute videos stay out until titled.

**Layout.** Ruled list rows: outlet (mono uppercase, 140 px column) · title (17 px) · language tag (`EN`/`KA`, mono, hairline box) · `↗`. Row hover nudges 8 px right (250 ms). All open in a new tab with `rel="noopener"`. Press cards (`press_cards`) are **not** rendered.

**Mobile.** Outlet on its own line above the title; arrow hidden; tag right-aligned.

### 2.9 About teaser `#about`

**Purpose.** Hand-off to the person.

**Content.** `photo-gtw-with-tomo` (4:3, focal 75% 50%) + eyebrow, h2, one line, ghost button → `/about/`.

**Layout.** Two equal columns, image left, text right, vertically centred. Image radius 20 px.

**Mobile.** Image above text.

### 2.10 Contact `#contact`

**Purpose.** One clear action.

**Content.** Eyebrow, big h2, one line of context, buttons: **Message me on LinkedIn** (primary, `socials.linkedin`) · **X** (ghost). Email button appears only when `person.email` is set; CV link only when `person.cv_pdf` is set (§10).

**Layout.** Generous vertical padding, left-aligned display h2 up to 14ch, buttons in a row.

**Motion.** The primary button has a magnetic hover on fine pointers (translate up to 4 px toward the cursor, springs back). Off under reduced motion and on touch.

### 2.11 Footer

**Content.** Brand + `person.headline` · "Elsewhere": LinkedIn, X, Instagram · "Language": segmented EN / ქართული (links) · small print: © 2026 Tengo Meskhi · "Built in the open → /journey" (only once that page exists; omit in v2.0).

**Layout.** Ink background, paper text, three columns → one on mobile. Focus ring on the dark footer is white, not amber.

---

## 3. About page, section by section

Route `/about/` (`/ka/about/`). Same nav and footer. Shorter than the home page; it should read in two minutes.

| # | Section | Content | Image | Layout notes |
|---|---|---|---|---|
| 3.1 | Hero | Eyebrow "About", h1, lead | `photo-gtw-speaking` full-width, 21:9 on desktop (focal 50% 35%), 3:2 on mobile; sits *below* the h1, not behind it | Static, no canvas. h1 at section-h2 size (`clamp(44px, 7vw, 104px)`). |
| 3.2 | The name | "Tengo = 10go" story: the Georgian name, the short form, why it reads as ten-go. Shown as Latin and Georgian side by side (`Tengo Meskhi` / `თენგო მესხი`) | — | Two-column text; the Georgian name set in Noto Serif Georgian at display size — the one typographic flourish on the page. The "10go" pun is a line of copy, not a logo. |
| 3.3 | The path | Three short paragraphs: Cambridge (bioengineering), McKinsey Digital, Bank of Georgia (link to McKinsey case) | — | Ruled rows like Track record, but prose. |
| 3.4 | London | Pensight, Head of Growth; the Forbes Georgia quote about London's tech ecosystem (`press.quote_en` [tbc translation]) with source link | — | Pull-quote block: display italic 28–36 px, source in mono. If the translation is not confirmed, show the Georgian quote on both pages with a one-line English paraphrase, or omit the quote. |
| 3.5 | Tbilisi | Home base, two alphabets; teaching at KIU and GRU (`teaching`) | `photo-gtw-audience` 16:9, optional | Keep to one paragraph + a two-item list. Anything personal (restaurant, Tikit, hobbies) is **not** included until the owner confirms it [tbc]. |
| 3.6 | Elsewhere + CTA | Socials (`socials`), and a ghost button "Work with me →" to `/#contact` | — | Compact row. |

Interim portrait: if the owner wants a face on this page before the studio original arrives, use the headshot crop from `press_cards.card-def-ai-2025` (§8) at 1:1, 320–480 px, radius 20 px, in 3.2 beside the name.

---

## 4. Copy

Final English. Georgian is a draft (marked) for the owner or a translator to review; the KA strings use the same ids as the EN ones so the builder can wire them to i18n keys. `[tbc]` = needs owner confirmation before launch; §10 says what renders if it is not confirmed.

### 4.1 Global

| id | EN | KA (draft) |
|---|---|---|
| brand | Tengo Meskhi. | თენგო მესხი. |
| nav.help | How I help | როგორ დაგეხმარებით |
| nav.track | Track record | გამოცდილება |
| nav.stage | Speaking | გამოსვლები |
| nav.press | Press | მედია |
| nav.about | About | ჩემ შესახებ |
| nav.contact | Get in touch | დამიკავშირდით |
| nav.menu.open / close | Open menu / Close menu | მენიუს გახსნა / დახურვა |
| lang.label | Language | ენა |
| lang.en / lang.ka | English / ქართული | English / ქართული |
| footer.tag | Technology leader and founder, based in Tbilisi. | ტექნოლოგიური ლიდერი და დამფუძნებელი, თბილისიდან. |
| footer.elsewhere | Elsewhere | სოციალური ქსელები |
| footer.copyright | © 2026 Tengo Meskhi | © 2026 თენგო მესხი |
| skip | Skip to content | გადასვლა შინაარსზე |

### 4.2 Home

**Hero**

| id | EN | KA (draft) |
|---|---|---|
| hero.chip.1 | **CEO & Founder** · Conceptdigital | **CEO და დამფუძნებელი** · Conceptdigital |
| hero.chip.2 | **CTO** · Boon | **CTO** · Boon |
| hero.chip.3 | Forbes Georgia 30 Under 30 | Forbes Georgia 30 Under 30 |
| hero.h1 | Tengo Meskhi | თენგო მესხი |
| hero.lead | I help companies change how they build, from agile teams to AI products. I have done it from inside a bank, a global consultancy and my own companies. | ვეხმარები კომპანიებს, შეცვალონ ის, თუ როგორ ქმნიან — Agile გუნდებიდან AI პროდუქტებამდე. ეს გზა გავლილი მაქვს ბანკის, გლობალური საკონსულტაციო კომპანიისა და საკუთარი კომპანიების შიგნიდან. |
| hero.cta.primary | Work with me → | ვითანამშრომლოთ → |
| hero.cta.secondary | Book me to speak | მომიწვიეთ სპიკერად |

**Proof strip**

| id | EN | KA (draft) |
|---|---|---|
| proof.press | Featured in | მედიაში |
| proof.stage | On stage at | სცენაზე |
| proof.teach | Guest lecturer at | მოწვეული ლექტორი |

**Now**

| id | EN | KA (draft) |
|---|---|---|
| now.eyebrow | Now | ახლა |
| now.h2 | What I'm building today | რას ვაშენებ დღეს |
| now.card.conceptdigital.role | Founder & CEO | დამფუძნებელი და CEO |
| now.card.conceptdigital.line | [tbc — owner's one line. Draft: "Digital transformation and product partner for companies in Georgia and beyond."] | [tbc. ვარიანტი: "ციფრული ტრანსფორმაციისა და პროდუქტის პარტნიორი კომპანიებისთვის საქართველოში და მის ფარგლებს გარეთ."] |
| now.card.digital-institute.role | Founder [tbc title] | დამფუძნებელი [tbc] |
| now.card.digital-institute.line | [tbc. Draft: "A tech school that guarantees its graduates a job." — from the BMG headline] | [tbc. ვარიანტი: "ტექნოლოგიური სკოლა, რომელიც კურსდამთავრებულებს დასაქმების გარანტიას აძლევს."] |
| now.card.boon.role | CTO | CTO |
| now.card.boon.line | [tbc — owner's one line. No draft: we know nothing about Boon.] | [tbc] |
| now.card.visit | Visit ↗ | საიტი ↗ |

**Track record**

| id | EN | KA (draft) |
|---|---|---|
| track.eyebrow | Track record | გამოცდილება |
| track.h2 | Science, strategy, banking, startups | მეცნიერება, სტრატეგია, ბანკი, სტარტაპები |
| track.cambridge.org / role / what | University of Cambridge / Bioengineering / Trained as an engineer. Learned to model complex systems before managing one. | კემბრიჯის უნივერსიტეტი / ბიოინჟინერია / ინჟინრად ჩამოვყალიბდი: რთული სისტემების მოდელირება ვისწავლე, სანამ მათ მართვას დავიწყებდი. |
| track.mckinsey.org / role / what | McKinsey & Company / Digital McKinsey / Advised banks and corporates on digital strategy and transformation. [tbc: sectors] | McKinsey & Company / Digital McKinsey / ბანკებსა და კორპორაციებს ციფრულ სტრატეგიასა და ტრანსფორმაციაში ვურჩევდი. |
| track.bog.org / role / what / link | Bank of Georgia / Deputy CIO & Head of Agile / Helped make it one of Georgia's first agile banks. / McKinsey case ↗ | საქართველოს ბანკი / CIO-ს მოადგილე და Agile-ის ხელმძღვანელი / დავეხმარე ბანკს, გამხდარიყო საქართველოს ერთ-ერთი პირველი Agile ბანკი. / McKinsey-ის ქეისი ↗ |
| track.pensight.org / role / what | Pensight · London / Head of Growth / Led growth at a London tech startup. | Pensight · ლონდონი / ზრდის ხელმძღვანელი / ლონდონური ტექ სტარტაპის ზრდას ვხელმძღვანელობდი. |
| track.own.org / role / what | Conceptdigital · Boon · Digital Institute / Founder & CEO · CTO · Founder / Building companies of my own. | Conceptdigital · Boon · Digital Institute / დამფუძნებელი და CEO · CTO · დამფუძნებელი / ვაშენებ საკუთარ კომპანიებს. |
| track.award.year / title / link | 2020 / Forbes Georgia 30 Under 30 / Georgian Journal ↗ | 2020 / Forbes Georgia 30 Under 30 / Georgian Journal ↗ |

**Where I can help**

| id | EN | KA (draft) |
|---|---|---|
| help.eyebrow | Where I can help | სად შემიძლია დახმარება |
| help.h2 | Three ways to work together | თანამშრომლობის სამი გზა |
| help.intro | For boards, executive teams and founders who want someone who has done it, not only advised on it. | ბორდებისთვის, აღმასრულებელი გუნდებისა და დამფუძნებლებისთვის, ვისაც სჭირდება ადამიანი, ვინც ეს თავად გააკეთა და არა მხოლოდ ურჩია. |
| help.1.h3 | Transformation and agile at scale | ტრანსფორმაცია და Agile მასშტაბურად |
| help.1.p | Operating model, team design and delivery for organisations that need to move faster without breaking what works. | ოპერაციული მოდელი, გუნდების დიზაინი და მიწოდება ორგანიზაციებისთვის, რომლებსაც სისწრაფე სჭირდებათ იმის დაზიანების გარეშე, რაც მუშაობს. |
| help.2.h3 | AI and digital products | AI და ციფრული პროდუქტები |
| help.2.p | From strategy to shipped product: AI agents, platforms and the teams that run them. | სტრატეგიიდან გაშვებულ პროდუქტამდე: AI აგენტები, პლატფორმები და გუნდები, რომლებიც მათ მართავენ. |
| help.3.h3 | Speaking and moderating | გამოსვლები და მოდერაცია |
| help.3.p | Keynotes, panels, workshops and university lectures on technology, AI and transformation, in English or Georgian. | მოხსენებები, პანელები, ვორქშოფები და საუნივერსიტეტო ლექციები ტექნოლოგიაზე, AI-სა და ტრანსფორმაციაზე, ინგლისურად ან ქართულად. |

**On stage**

| id | EN | KA (draft) |
|---|---|---|
| stage.eyebrow | Speaking and teaching | გამოსვლები და ლექციები |
| stage.h2 | On stage | სცენაზე |
| stage.cap.large | Moderating the Superstar Panel · Global Tech Weekend × Forbes, Tbilisi, 2025 | პანელის მოდერაცია · Global Tech Weekend × Forbes, თბილისი, 2025 |
| stage.cap.small1 | Global Tech Weekend 2025 | Global Tech Weekend 2025 |
| stage.cap.small2 | Stamba rooftop, Tbilisi | სტამბის სახურავი, თბილისი |
| stage.ev.gtw | Global Tech Weekend × Forbes · Moderator · Tbilisi · June 2025 | Global Tech Weekend × Forbes · მოდერატორი · თბილისი · ივნისი 2025 |
| stage.ev.defai | DEF-AI 2025 · Speaker · Tbilisi · September 2025 | DEF-AI 2025 · სპიკერი · თბილისი · სექტემბერი 2025 |
| stage.ev.globalize | Globalize UK Conference · Speaker · London · November 2022 | Globalize UK კონფერენცია · სპიკერი · ლონდონი · ნოემბერი 2022 |
| stage.ev.kiu | Kutaisi International University · Guest lecturer · Data Science for Business, Digital Transformation | ქუთაისის საერთაშორისო უნივერსიტეტი · მოწვეული ლექტორი · მონაცემთა მეცნიერება ბიზნესისთვის, ციფრული ტრანსფორმაცია |
| stage.ev.gru | Grigol Robakidze University · Guest lecturer · Data Science for Business, Digital Transformation | გრიგოლ რობაქიძის სახელობის უნივერსიტეტი · მოწვეული ლექტორი · მონაცემთა მეცნიერება ბიზნესისთვის, ციფრული ტრანსფორმაცია |

**Press & interviews**

| id | EN | KA (draft) |
|---|---|---|
| press.eyebrow | Press and interviews | მედია და ინტერვიუები |
| press.h2 | In the media | მედიაში |
| press.group.articles | Articles | სტატიები |
| press.group.interviews | Interviews and podcasts | ინტერვიუები და პოდკასტები |
| press row titles | as in `media.yaml` `title` / `title_ka`; where `title_ka` is `tbc`, KA pages show the EN title with the `EN` tag | — |

**About teaser**

| id | EN | KA (draft) |
|---|---|---|
| about.eyebrow | About | ჩემ შესახებ |
| about.h2 | There's more than the CV | CV-ზე მეტი |
| about.p | Why Tengo is sometimes 10go, what a bioengineer is doing in banking, and life in Tbilisi. | რატომ არის თენგო ზოგჯერ 10go, რას აკეთებს ბიოინჟინერი ბანკში და ცხოვრება თბილისში. |
| about.cta | Read my story → | ჩემი ისტორია → |

**Contact**

| id | EN | KA (draft) |
|---|---|---|
| contact.eyebrow | Get in touch | დამიკავშირდით |
| contact.h2 | Let's talk. | მოდი, ვისაუბროთ. |
| contact.p | Advisory, transformation programmes, AI products, keynotes and lectures. English or Georgian. | კონსულტაცია, ტრანსფორმაციის პროგრამები, AI პროდუქტები, მოხსენებები და ლექციები. ინგლისურად ან ქართულად. |
| contact.linkedin | Message me on LinkedIn → | მომწერეთ LinkedIn-ზე → |
| contact.x | X | X |
| contact.email | Email me [renders only when `person.email` is set] | მომწერეთ |
| contact.cv | Download CV (PDF) [only when `person.cv_pdf` is set] | CV-ის ჩამოტვირთვა (PDF) |

### 4.3 About page

| id | EN | KA (draft) |
|---|---|---|
| about.title.h1 | The person behind the CV | ადამიანი CV-ს მიღმა |
| about.lead | Bioengineer by training, technologist by trade, Tbilisian by heart. A few things the track record doesn't say. | განათლებით ბიოინჟინერი, პროფესიით ტექნოლოგი, გულით თბილისელი. რამდენიმე რამ, რასაც CV არ ამბობს. |
| about.name.eyebrow | The name | სახელი |
| about.name.h2 | Tengo, also 10go | თენგო, ანუ 10go |
| about.name.p | My name is Tengiz; everyone calls me Tengo. Written quickly it reads as ten, go — a countdown that ends in a start. In Georgian it looks like this: თენგო მესხი. Both are me. [tbc: owner to confirm the story in his own words] | მე თენგიზი მქვია, ყველა თენგოს მეძახის. ლათინურად დაწერილი ten, go-ს ჰგავს — ათვლა, რომელიც სტარტით მთავრდება. ქართულად ასე იწერება: თენგო მესხი. ორივე მე ვარ. [tbc] |
| about.path.eyebrow | The path | გზა |
| about.path.h2 | From the lab to the boardroom | ლაბორატორიიდან საბჭოს დარბაზამდე |
| about.path.cambridge | I studied bioengineering at Cambridge. Modelling living systems taught me that the interesting problems are the ones where every part depends on every other part. | კემბრიჯში ბიოინჟინერია ვისწავლე. ცოცხალი სისტემების მოდელირებამ მასწავლა, რომ საინტერესო პრობლემები ისაა, სადაც ყველა ნაწილი ყველა სხვაზეა დამოკიდებული. |
| about.path.mckinsey | At Digital McKinsey I learned how large organisations actually change, and how often they don't. | Digital McKinsey-ში ვისწავლე, როგორ იცვლებიან დიდი ორგანიზაციები სინამდვილეში — და რამდენად ხშირად არ იცვლებიან. |
| about.path.bog | At Bank of Georgia, as Deputy CIO and Head of Agile, I got to apply both: helping a major bank become one of the first agile banks in the country. (McKinsey case ↗) | საქართველოს ბანკში, CIO-ს მოადგილისა და Agile-ის ხელმძღვანელის პოზიციაზე, ორივე გამოვიყენე: დავეხმარე დიდ ბანკს, გამხდარიყო ქვეყნის ერთ-ერთი პირველი Agile ბანკი. (McKinsey-ის ქეისი ↗) |
| about.london.eyebrow | London | ლონდონი |
| about.london.h2 | A London chapter | ლონდონური თავი |
| about.london.p | I led growth at Pensight, a London tech startup, and spoke about the experience at the Globalize UK Conference in 2022. | Pensight-ში, ლონდონურ ტექ სტარტაპში, ზრდას ვხელმძღვანელობდი და ამ გამოცდილებაზე 2022 წელს Globalize UK კონფერენციაზე ვისაუბრე. |
| about.london.quote | "London's tech ecosystem is demanding and full of opportunity. It is genuinely exciting to work in such a dynamic environment." — Forbes Georgia [tbc translation; original is Georgian] | „ლონდონის ტექნოლოგიური ეკოსისტემა საკმაოდ მოთხოვნადი და შესაძლებლობებით სავსეა. საოცრად ამაღელვებელია და საინტერესო, როდესაც ამ დინამიკურ გარემოში მუშაობ." — Forbes Georgia |
| about.tbilisi.eyebrow | Home | სახლი |
| about.tbilisi.h2 | Tbilisi | თბილისი |
| about.tbilisi.p | I live and work in Tbilisi, in two alphabets. When I'm not building, I teach: guest lectures on Data Science for Business and Digital Transformation at Kutaisi International University and Grigol Robakidze University. | თბილისში ვცხოვრობ და ვმუშაობ, ორ ანბანში. როცა არ ვაშენებ, ვასწავლი: მოწვეული ლექციები მონაცემთა მეცნიერებასა და ციფრულ ტრანსფორმაციაზე ქუთაისის საერთაშორისო უნივერსიტეტსა და გრიგოლ რობაქიძის სახელობის უნივერსიტეტში. |
| about.elsewhere.h2 | Elsewhere | სოციალური ქსელები |
| about.cta | Work with me → | ვითანამშრომლოთ → |

### 4.4 404

| id | EN | KA (draft) |
|---|---|---|
| 404.h1 | Nothing here. | აქ არაფერია. |
| 404.p | The page you wanted doesn't exist, or moved. | გვერდი, რომელსაც ეძებდით, არ არსებობს ან გადავიდა. |
| 404.cta | Back to the start → / მთავარზე დაბრუნება → | (both shown; one page serves both languages) |

---

## 5. Design system

Builds on `mockups/home-professional.html`, tightened. Vanilla CSS with custom properties; no utility framework.

### 5.1 Colour

Light only. Every colour is set explicitly; `color-scheme: light`.

| Token | Value | Use | Contrast on paper |
|---|---|---|---|
| `--paper` | `#FAFAF8` | page background | — |
| `--surface` | `#FFFFFF` | cards, chips | — |
| `--ink` | `#121316` | headings, body, primary button, footer bg | 17.4:1 |
| `--ink-2` | `#3C3E44` | secondary text | 10.3:1 |
| `--muted` | `#63656D` | captions, meta (≥ 12 px) | 5.6:1 |
| `--line` | `#E4E3DF` | hairlines, card borders | — |
| `--rule` | `#121316` | section top rules (ink) | — |
| `--amber` | `#E2902A` | accent: brand full stop, contour major lines, highlights. **Never for text under 24 px** | 2.4:1 |
| `--amber-ink` | `#9A5A0C` | accent text: eyebrows, inline links | 5.3:1 |
| `--amber-wash` | `#FFF6E8` | award band background | — |
| `--amber-line` | `#F2DCB6` | award band border | — |
| `--wash` | `rgba(250,250,248,.86)` | hero text-zone wash | — |
| `--on-ink` | `#D9D9D6` / `#FFFFFF` | footer text / footer headings | ≥ 12:1 |
| `--focus` | `#E2902A` (light surfaces), `#FFFFFF` (on ink) | focus rings | — |

Only one accent. No gradients except the hero wash and the photo caption scrim. No shadows except the card hover (`0 18px 40px -24px rgba(18,19,22,.35)`).

### 5.2 Type

Google Fonts only, self-hosted as subset woff2 (OFL allows it; faster and no third-party request). Total font payload ≤ 120 KB per language.

| Role | EN | KA | Weights |
|---|---|---|---|
| Display | Instrument Serif | Noto Serif Georgian | 400 (+ italic for pull-quotes); KA 300 + 400 |
| Body / UI | Geist | Noto Sans Georgian | 400, 500, 600 |
| Mono (eyebrows, meta, numbers) | Geist Mono | Geist Mono (Latin digits/labels only) | 400, 500 |

Stacks: `--f-display: "Instrument Serif", "Noto Serif Georgian", Georgia, serif`. On `:lang(ka)` the display stack is `"Noto Serif Georgian", "Instrument Serif", serif` and body is `"Noto Sans Georgian", "Geist", system-ui`. Subset: Latin + Latin-ext for Geist/Instrument; Georgian + basic Latin for the Noto faces (Latin brand names inside Georgian sentences then render in Noto, which is intentional: one face per line). `font-display: swap`; preload the display face used by the h1 for the current language only. Test the h1 and section h2s in KA at every breakpoint; Mkhedruli has no capitals, so KA headings run ~25% longer and need the smaller clamps given below.

Scale (fluid, `clamp(min, preferred, max)`):

| Step | EN | KA | Line-height | Letter-spacing |
|---|---|---|---|---|
| h1 hero | `clamp(56px, 11.5vw, 168px)` | `clamp(40px, 8.4vw, 124px)` | .9 / 1.05 | −.03em / 0 |
| h2 section | `clamp(38px, 5.4vw, 72px)` | `clamp(30px, 4vw, 54px)` | 1 / 1.15 | −.02em / 0 |
| h2 contact | `clamp(48px, 8vw, 116px)` | `clamp(36px, 5.6vw, 80px)` | .95 / 1.1 | −.03em / 0 |
| display-s (card h3, timeline org) | `clamp(26px, 3vw, 38px)` | same −10% | 1.05 | −.01em |
| lead | `clamp(20px, 2.3vw, 28px)` | same | 1.35 | −.01em |
| body | 17 px (16 under 480 px) | 17 px | 1.55 | 0 |
| small | 14 px | 14 px | 1.45 | 0 |
| eyebrow (mono) | 12 px uppercase | 12 px (Latin only) | 1 | .14em |
| meta (mono) | 11–13 px | same | 1.3 | .08em |

Measure: body ≤ 62ch, lead ≤ 34ch. `text-wrap: balance` on headings, `pretty` on paragraphs.

### 5.3 Spacing, radius, grid

- Base 4 px. Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Section padding `clamp(56px, 8vw, 112px)`.
- Container 1240 px; gutter `clamp(16px, 4vw, 56px)`; 12-column grid on desktop, 4 on mobile; column gaps 16/32 px.
- Radius: `--r-s: 6px` (tags, focus), `--r-m: 14px` (buttons that are not pills, images in lists), `--r-l: 20px` (cards, photos), `--r-pill: 999px` (chips, buttons, nav CTA, language selector).
- Hairlines 1 px `--line`; section/list top rules 1 px `--ink`.
- Breakpoints: 480 (phone-wide), 900 (nav switch and two-column layouts), 1240 (container).

### 5.4 Motion

- Easing: `--ease-out: cubic-bezier(.2,.8,.2,1)`; `--ease-inout: cubic-bezier(.65,0,.35,1)` for the magnetic spring-back.
- Durations: 150 ms (colour/opacity), 250 ms (hover transforms), 500 ms (reveals), 600 ms (image scale-in). Nothing longer than 600 ms except the contour drift.
- Reveals: `opacity 0→1`, `translateY 8px→0`, stagger 40–60 ms, triggered by IntersectionObserver at 15% visibility, once; elements are visible by default when JS fails (no hidden-until-JS content).
- No smooth-scroll library, no pinning, no parallax, no scroll-jacking, no custom cursor in v2.0.
- Hover effects only on `(hover: hover) and (pointer: fine)`.
- `@media (prefers-reduced-motion: reduce)`: reveals render in final state; transitions ≤ 1 ms; contour canvas not started (static SVG shown); magnetic button off. Tested in CI with Playwright's `reducedMotion: 'reduce'`.

### 5.5 Focus and interaction states

- `:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; border-radius: var(--r-s) }`; on `--ink` surfaces `--focus` is white.
- Buttons: primary (ink bg, paper text; hover `#000`; active scale .98), ghost (paper 70% bg, ink border; hover surface), text link (ink, underline offset 3 px, amber-ink on hover for inline links in prose).
- Skip link appears on focus at top-left.
- Tap targets ≥ 44 × 44 px; nav CTA and language segments included.

### 5.6 Things we deliberately avoid

Gradient blobs, glass cards, icon grids, emoji, drop-caps, animated counters, marquee tickers, testimonial carousels, "trusted by" logo walls, purple. The site's character comes from type, rules, real photographs and one amber.

---

## 6. Hero background: recommendation and spec

**Recommendation: Contours.** Reasons, in order:

1. It carries the one concept the project kept from day one (Terrain: Tbilisi's layered terrain, circuit traces) without being literal or decorative.
2. It is line-work in ink on paper, so it stays quiet behind a serif headline and reads as drafting rather than "generative art demo". The owner already likes it.
3. It is cheap: 2D canvas marching squares, no WebGL, no library, and it has a perfect static fallback (an SVG of the same field) for reduced motion, no-JS and low-end devices.
4. The alternatives each fail a credibility test: **dot field** is the default look of a hundred AI/SaaS landing pages; **flow** needs persistent trails (full-canvas redraw per frame, costly on mobile) and reads as a screensaver; **aurora** is the most generic 2024–26 pattern and fights the "no gradients" rule; the **Stamba photo** is the strongest single image we have, but as a hero it dates the site to one evening in June 2025 and competes with the name. It does more work in On stage and as the About OG image.

**Look.** Thirteen levels of a layered-noise height field; minor lines `rgba(18,19,22, .08–.19)` at .8 px, every fourth line amber `.85` at 1.3 px. Cell size 9 px desktop / 11 px mobile. Field drifts at roughly one slow cycle per 40 s; the pointer raises a soft hill (radius ~150 px, 22% amplitude) that eases in/out over ~400 ms. Left 46–75% of the hero fades to paper so the text column is calm; the right side is where the lines live.

**Behaviour.**

- Island, loaded after `document.fonts.ready` and only when the hero is in view; renders a first frame synchronously on mount so there is no flash. The `<h1>` is never inside the canvas.
- Frame budget ≤ 4 ms on a 2022 laptop, ≤ 8 ms on a 2022 mid-range Android; capped at 30 fps; pauses when the hero scrolls out or the tab is hidden; DPR capped at 1.5.
- Pointer influence only on fine pointers; no gyroscope.
- Fallback to static when: `prefers-reduced-motion`, `navigator.hardwareConcurrency ≤ 4`, `saveData`, no `requestAnimationFrame`, or the first three frames average over budget. The fallback is `hero-contours.svg`, generated **at build time** from the same noise seed so static and animated match. Inline it (≤ 12 KB) or load as a background image; either way it is in the first paint.
- Script ≤ 8 KB gzipped, no dependencies. Separate from the rest of the JS so it can fail alone.
- Pointer events go through to the hero links; canvas has `pointer-events: none` and `aria-hidden="true"`.

Keep the dot/flow/aurora/photo implementations out of the build. They were useful to decide, not to ship.

---

## 7. Components (for the builder)

Astro components, zero client JS unless marked.

| Component | Props / notes |
|---|---|
| `Layout` | `lang`, `title`, `description`, `og`, `alternate` (hreflang pairs), JSON-LD slot; sets `html[lang]`, fonts, skip link |
| `Nav` | links from a per-language map; `current` page; client script for sticky border and menu (≤ 2 KB) |
| `MobileMenu` | dialog semantics, focus trap, `Esc`, language selector inside |
| `LangSwitch` | `current`, `hrefEn`, `hrefKa`; segmented links, `aria-current` |
| `Hero` | chips, name, lead, CTAs; mounts `ContourField` |
| `ContourField` | client island (§6) with inline SVG fallback |
| `ProofStrip` | rows: `{label, items[]}` |
| `SectionHead` | `eyebrow`, `title`, optional `intro`, 1fr/2fr grid |
| `VentureCard` | `role`, `name`, `line?`, `url?` |
| `Timeline` | rows `{org, role, what, link?, period?}`; renders period column only when any row has one |
| `AwardBand` | `year`, `title`, `source` |
| `HelpColumns` | items `{n, title, body}` |
| `PhotoGrid` | three `{photo, caption}`; `<picture>` with AVIF/WebP, `sizes`, `loading="lazy"`, overlaid captions on desktop, inline on mobile |
| `EventList` | items from talks + teaching |
| `PressList` | groups `{heading, items[{outlet, title, url, lang}]}` |
| `AboutTeaser` | photo + copy + CTA |
| `Contact` | h2, p, buttons; shows email/CV buttons conditionally; `MagneticButton` behaviour on primary (client, ≤ 1 KB) |
| `Footer` | brand, headline, socials, `LangSwitch`, small print |
| `PullQuote` | About only |
| `Reveal` | wrapper that adds the IO-driven reveal class; no-op under reduced motion |
| `Seo` / `PersonJsonLd` | per-page meta and JSON-LD (§9) |

Content loading: `media.yaml` via Astro content collections (`file()` loader keyed by `id`), one `i18n/en.json` and `i18n/ka.json` keyed by the ids in §4.

---

## 8. Image handling

Pipeline: originals in `assets/`, imported through `astro:assets`; output AVIF + WebP at 480, 768, 1200, 1600, 2000 w; `sizes` per slot; `decoding="async"`; everything below the fold `loading="lazy"`; LCP is text so no image is preloaded on the home page. Above-the-fold image budget: 0 KB on home, ≤ 150 KB on About (hero at 1200 w AVIF).

| Slot | Source (`photos[].id`) | Ratio desktop / mobile | Focal | Rendered widths |
|---|---|---|---|---|
| home.stage.large | `photo-gtw-panel-wide` | 4:3 / 3:2 | 55% 50% | up to 820 px CSS |
| home.stage.small-1 | `photo-gtw-speaking` | 4:3 / 3:2 | 50% 35% | up to 400 px |
| home.stage.small-2 | `photo-gtw-audience` | 4:3 / 16:9 | 50% 45% | up to 400 px |
| home.about-teaser | `photo-gtw-with-tomo` | 4:3 / 4:3 | 75% 50% | up to 600 px |
| about.hero | `photo-gtw-speaking` | 21:9 / 3:2 | 50% 35% | full container |
| about.tbilisi (optional) | `photo-gtw-audience` | 16:9 / 16:9 | 50% 45% | full container |
| about.og | `photo-gtw-speaking` | 1.91:1 | 50% 35% | 1200×630 |
| interim portrait | `card-def-ai-2025`, crop x 310–970, y 530–1190 (≈ 660 × 660 of the 1280 × 1600 card; plain grey backdrop) | 1:1 | — | 480 px; also JSON-LD `image` |

Alt text: use `photos[].alt.en` / `.alt.ka` verbatim. Decorative uses (none planned) would get `alt=""`.

Press cards: `press_cards` are **kept as source only** (`used_in_v2: false`), except the DEF-AI headshot crop above. Reasons: third-party event branding, "Tengiz" credits on three of five, and purple/blue palettes that break the system. Revisit for `/press/` later, where small thumbnails in a list could work.

Favicon: `favicon.svg`, the amber full stop on paper (a single filled circle `#E2902A` on `#FAFAF8`), plus a 180 px apple-touch PNG. Not a "TM" monogram.

---

## 9. SEO and metadata

Titles ≤ 60 chars, descriptions ≤ 155. OG images 1200×630, generated at build.

| Page | `<title>` | Description | OG image |
|---|---|---|---|
| `/` | Tengo Meskhi — Technology leader and founder, Tbilisi | Tengo Meskhi: CEO & Founder of Conceptdigital, CTO of Boon, former Deputy CIO & Head of Agile at Bank of Georgia, Digital McKinsey, Cambridge bioengineer. Transformation, AI products, speaking. | Generated: name + chips on paper with the static contour field (`og/home-en.png`) |
| `/ka/` | თენგო მესხი — ტექნოლოგიური ლიდერი და დამფუძნებელი, თბილისი | თენგო მესხი: Conceptdigital-ის CEO და დამფუძნებელი, Boon-ის CTO, საქართველოს ბანკის ყოფილი CIO-ს მოადგილე და Agile-ის ხელმძღვანელი, Digital McKinsey, კემბრიჯის ბიოინჟინერი. | Generated, KA name (`og/home-ka.png`) |
| `/about/` | About Tengo Meskhi — the name, the path, Tbilisi | Why Tengo is sometimes 10go, how a Cambridge bioengineer ended up leading agile at a bank, a London chapter, and life and teaching in Tbilisi. | `photo-gtw-speaking` crop with a small name label (`og/about-en.png`) |
| `/ka/about/` | თენგო მესხის შესახებ — სახელი, გზა, თბილისი | რატომ არის თენგო ზოგჯერ 10go, როგორ მოხვდა კემბრიჯელი ბიოინჟინერი ბანკში, ლონდონური თავი და ცხოვრება და სწავლება თბილისში. | `og/about-ka.png` |
| 404 | Not found — Tengo Meskhi | — | `noindex` |

Per page: canonical, `hreflang` (`en`, `ka`, `x-default`), `og:type` (`profile` on home, `website` on About), `og:locale` (`en_GB` / `ka_GE`), `twitter:card summary_large_image`, `twitter:site @tengmesk`. `sitemap-index.xml` with both locales; `robots.txt` allowing all.

JSON-LD `Person` on `/` and `/ka/` (one block, EN values with `alternateName` for KA):

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://tengmesk.com/#person",
  "name": "Tengo Meskhi",
  "alternateName": ["თენგო მესხი", "Tengiz Meskhi"],
  "url": "https://tengmesk.com/",
  "image": "https://tengmesk.com/img/tengo-meskhi.jpg",
  "jobTitle": ["CEO & Founder", "CTO"],
  "worksFor": [
    { "@type": "Organization", "name": "Conceptdigital" },
    { "@type": "Organization", "name": "Boon" }
  ],
  "alumniOf": [{ "@type": "CollegeOrUniversity", "name": "University of Cambridge" }],
  "award": "Forbes Georgia 30 Under 30 (2020)",
  "knowsLanguage": ["en", "ka"],
  "address": { "@type": "PostalAddress", "addressLocality": "Tbilisi", "addressCountry": "GE" },
  "sameAs": [
    "https://www.linkedin.com/in/tmeskhi",
    "https://x.com/tengmesk",
    "https://instagram.com/tengo.ai"
  ]
}
```

`image` points at the portrait once we have one (interim: the DEF-AI crop). Add `email` only if the owner publishes one. Do not add `birthDate`, `telephone` or home addresses.

---

## 10. Placeholder strategy (shipping with unknowns)

Principle: **omit, don't apologise.** Nothing on the live site ever shows "tbc", "coming soon", a dashed placeholder box or a lorem line. The design is built so each unknown has a no-op state that looks like a choice.

| Unknown (`tbc` in media.yaml) | What renders in v2.0 | When it arrives |
|---|---|---|
| Years per role (`roles[].period`) | Timeline has no date column; the h2 ("Science, strategy, banking, startups") and the ordering carry the sequence | Column appears automatically (`Timeline` renders it when any row has a period) |
| Venture one-liners (`ventures[].summary`) | Card shows role + name only; cards have a fixed min-height so a mixed set still aligns. If *none* are confirmed by launch, the Now section renders as a single ruled list (name · role) instead of cards | Switch back to cards |
| Venture URLs | No "Visit" link | Link appears |
| Email | Contact shows LinkedIn (primary) + X (ghost); the h2 still reads as a complete invitation | Email button added as the primary, LinkedIn becomes ghost |
| CV PDF | No CV link anywhere | "Download CV" in Contact and footer |
| Portrait | No face on About except the interim crop (optional); the site relies on event photography, which is honest and stronger | Replace the crop; add to JSON-LD |
| Digital Institute video titles | Not listed | Added to Press under a "Digital Institute" group or to `/press/` |
| Press dates | Press list has no date column (outlet · title · language is enough) | Add a mono date column, same as the timeline |
| KA titles for EN press | KA page shows the EN title with the `EN` tag; that is what a Georgian reader will click into anyway | Replace when translated |
| McKinsey mention confirmation | If unconfirmed at launch: drop McKinsey from the proof strip's "Featured in" row (the Track record link remains, it is a fact about the bank) | Reinstate |
| 10go story in the owner's words | §4.3 draft, kept to three sentences; nothing it says is unverifiable (name, short form, pun, Georgian spelling) | Replace with owner's text |
| Georgian copy quality | Mark the footer small print "ქართული ვერსია მუშავდება" (Georgian version in progress)? **No.** Either a translator signs off before launch, or `/ka/` launches with the draft and no disclaimer; drafts marked here are good enough to read, not good enough to be called drafts in public | — |

---

## 11. v2.0 acceptance checklist

Content

- [ ] Every fact on both pages traces to `media.yaml`; no "tbc" string or placeholder box anywhere in the built HTML.
- [ ] Every link from the owner's original list is reachable from the site or consciously held back (Digital Institute videos, press cards) per §10.
- [ ] Name is Tengo / თენგო everywhere the site speaks; press titles unchanged.
- [ ] Georgian pages reviewed by a native speaker; no machine-translation artefacts in headings.
- [ ] No personal claims (restaurant, Tikit, hobbies) unless the owner confirmed them.

Design and craft

- [ ] Matches §5 tokens; only one accent; no gradients beyond the hero wash and caption scrim.
- [ ] KA h1/h2 fit on 320, 390, 768, 1024, 1440 px without overflow or orphaned words.
- [ ] Contours look identical in static and animated states at first paint; no flash of empty hero.
- [ ] Press cards not rendered on the site.

Performance (Lighthouse mobile, throttled; CI gate)

- [ ] Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100 on `/`, `/ka/`, `/about/`, `/ka/about/`.
- [ ] LCP ≤ 2.0 s (the h1), CLS ≤ 0.05, INP ≤ 200 ms.
- [ ] Budgets: HTML ≤ 30 KB, CSS ≤ 40 KB, JS ≤ 20 KB total (contours ≤ 8 KB), fonts ≤ 120 KB per language, images above the fold 0 KB (home) / ≤ 150 KB (About), total first view ≤ 600 KB.
- [ ] Contour island holds 30 fps on a 2022 mid-range Android or falls back; CPU idle when hero is off-screen.

Accessibility

- [ ] WCAG 2.2 AA: axe clean on all four pages; contrast per §5.1; visible focus everywhere incl. footer.
- [ ] Full keyboard operation: nav, mobile menu (trap, `Esc`), language links, all CTAs.
- [ ] `prefers-reduced-motion` verified in Playwright: no reveals, static hero, no magnetic button.
- [ ] Pinch-zoom works; no `user-scalable=no`; no touchmove blocking (the old site's defects).
- [ ] `lang` correct on `<html>`; language selector marks the current language with `aria-current`.

SEO and infra

- [ ] Titles, descriptions, OG images per §9 on every page; `hreflang` pairs validate; sitemap and robots present.
- [ ] JSON-LD Person validates in the Rich Results test.
- [ ] `/ka.html` stub redirects to `/ka/`; 404 page served by Pages.
- [ ] Deployed by GitHub Actions to the staging URL; cutover plan from SPEC §9 M5 unchanged.

Journal

- [ ] `docs/journey/04-foundations.md` (or next number) written with before/after screenshots at 1440×900 and 390×844.

---

## 12. Open questions for the owner (short list)

1. One line each for Conceptdigital, Boon and Digital Institute. Is Digital Institute part of Conceptdigital? Founder or co-founder?
2. Years: Cambridge, McKinsey, Bank of Georgia, Pensight, and when the companies started.
3. Publish an email address? Send a CV PDF?
4. The original studio headshot (grey shirt) as a file.
5. Confirm the 10go story in your own words (three sentences is plenty).
6. Are you named in the McKinsey "agile banks" piece? (Decides whether McKinsey sits in "Featured in".)
7. Episode titles for the AI Interconnect, Alexander Mihalcea, BMG, LK Podcast and Globalize interviews, and the four Digital Institute videos.
8. Hero background: this plan recommends Contours (§6). Yes?
9. Who reviews the Georgian copy before launch?
