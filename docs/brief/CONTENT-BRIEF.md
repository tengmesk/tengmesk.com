# Content brief — tengmesk.com

Single source of truth for the website bake-off. Every skill/model gets this file plus `assets/`.
Built from interviews with Tengo. Where this conflicts with SITE-PLAN.md or media.yaml, **this file wins**.

Status legend: ✅ confirmed by Tengo · ⚠️ needs confirmation

---

## 1. Identity & positioning ✅ (interview round 1, 2026-10-30)

**Name:** Tengo Meskhi / თენგო მესხი (formerly Tengiz in press).

**One-liner (his words):** "I help companies use tech & AI to accelerate their growth and streamline their operations."
- Avoid repeating "build". Do not mention Boon.

**Edge / why him:**
- Has sat on every side of the table: consulting across a wide range of industries, managing inside enterprises, growing startups.
- Bilingual in business and tech: understands the business, speaks the language of tech and engineers.
- Goes toe-to-toe on operations, and can also tell which marketing / go-to-market will work and which won't.
- Tells you honestly what products can actually be built, how feasible they are, and what complexity you'll hit.

**Site goals (ranked):**
1. Advisory / consulting clients (via Conceptdigital).
2. Speaking & moderating invitations.
3. Partners & investors for his upcoming health venture (brand: **Lozano Health** or **Jani.bio**, undecided).
4. Board / advisory seats.
5. Media.
6. Hiring.

**Audiences (priority order):**
1. Execs of **medium-sized businesses in the UK and US**.
2. CEO/COO/CIO at a bank, telecom or large corporate in Georgia / the Caucasus who needs to move faster on digital or AI.
3. Event organisers (Tbilisi, Europe) looking for a bilingual tech speaker or moderator.
4. Founders / investors checking him out before a meeting.

**Primary action:** Book a call. **Secondary:** LinkedIn.

**Location:** Based in **London**, visits **Tbilisi** often, currently in **Miami**. Works in English and Georgian.
- Feature idea: a **"where I am / where I'm next" city tracker** on the site (current city + upcoming).

**First impression:** sharp, credible, builder. Never "consultant-y" (slides, no shipping).

## 2. Status changes vs earlier material ✅

- **Boon: closed.** Remove from the site entirely (hero chips, Now, timeline, JSON-LD).
- **Digital Institute: closed.** Shown as a past venture (see §3).
- **Location is London, not Tbilisi.** Fix "based in Tbilisi" copy, footer tagline, JSON-LD address.
- **New:** upcoming health venture, Lozano Health / Jani.bio (see §3).
- **New:** Fractional CMO at Halocarbon.

## 3. Ventures & roles (interview round 2, 2026-10-30)

### Current
- **Conceptdigital** ✅ (source: Conceptdigital working session, 2026-10-30)
  - **What:** London-based software development and technology consulting company. Builds digital products, internal tools, automations and AI systems, and extends clients' software teams.
  - **Services:** software & product builds (web/mobile apps, MVPs, internal platforms, portals, integrations) · websites & growth (marketing sites, landing pages, SEO, paid social, conversion) · internal ops & automation (dashboards, reporting, workflow automation, process digitisation) · AI systems (AI features, AI agents, AI app support) · enterprise consulting (banking & fintech, digital transformation, platform architecture) · talent (staff augmentation, outstaffing, specialist tech hiring).
  - **Who:** banking & fintech, healthcare, real estate, retail & FMCG, logistics, manufacturing, legal, media, travel & booking, e-commerce. From seed startups (Rex, Theneo YC W22) through mid-size (Halocarbon) to enterprises and a central bank (National Bank of Georgia).
  - **Scale:** 50+ projects, 15+ industries, 4 continents, 98% client satisfaction (as reported by Forbes Georgia). ~two dozen people (employees + contractors). Registered office 128 City Road, London EC1V 2NX.
  - **Clients that CAN be named:** Forbes, National Bank of Georgia, Bank of Georgia, Credo Bank, ProCredit Bank, Aversi Pharmacy, Tbilisi Holding Company, Schirnhofer, GPI Holding, SEU University, Rex, Halocarbon, Children's Hospital Colorado / University of Colorado, Todd Bartos Group, Arte Development, Transiberia, Boon, Theneo, Atlas Metrics, BoxLock.
  - **NEVER name:** Medlabtests (Mrcheveli Medical Centre), the US radio group podcast-analytics MVP, Breezy, Fintex, Centre for Surgery. ⚠️ Not cleared (don't name): Aluframe, NICUVerse (Cincinnati Children's), Dr Todd Ponsky's AI projects, Kus Tba Padel, DineSpace, Casa Calda. Never name proposal-stage prospects.
  - **Results:**
    - Rex (Berlin vet clinics): built the full MVP; client raised a **€5M seed** shortly after launch.
    - Tbilisi Holding Company: inventory system cut overstock by **$3M** ($11M → $8M).
    - Transiberia (rail freight): automated wagon tracking cut call-operator costs by **65%**.
    - Arte Development (real estate): ERP manages **1,124+ apartments**, **$13M+** portfolio.
    - Fore Hadley (health charity): pro-bono SEO raised site scores **25/26 → 92/100**.
  - **Founded:** brand 2020; CONCEPTDIGITAL LTD incorporated 2 Aug 2022 (UK 14270819). Tengo = **founder & CEO**. ⚠️ Zurab Dzagania (joined via ZD Consulting acquisition, 2025) and Ioane Chikovani are listed internally as co-founders; wording to confirm.
  - **Tengo full-time on Conceptdigital since 2024.**
  - **Book a call:** https://cal.com/tengmesk/strategy (30-min strategy call) ← site's primary CTA.
- **Halocarbon** ✅ Fractional CMO since ~June 2026. Also a Conceptdigital client. (⚠️ company description pending: www.halocarbon.com blocked from the build sandbox.)
- **Health venture: Lozano Health / Jani.bio** ✅ early-stage, stealth, exploratory. On the site: at most a teaser ("something new in health"); no product details. Seeking partners & investors.

### Past ventures ✅
- **Boon**: blockchain-based social gamification platform. Closed.
- **Digital Institute**: tech school taught by MAANG lecturers; students went on to work at Tesla, Google and other top companies. Closed.
- Older projects (Tikit, restaurant, etc.): **omit**.

### Past roles
- **Pensight** (https://pensight.com), Head of Growth ✅. Pensight: all-in-one platform for creators, coaches and educators to sell digital products, courses, memberships and 1:1 sessions (link-in-bio store; 30,000+ creators today). Grew the team from 2 founders + Tengo to **12 people**; grew users from **~1,600 to 18,000+**. (⚠️ years)
- Bank of Georgia (Deputy CIO, Head of Agile), Digital McKinsey, Cambridge bioengineering: see media.yaml (⚠️ years: from CV up to 2023; CV PDF pending upload).

## 4. Whereabouts tracker ✅

- Site shows **current city** and **what's next** (London base, frequent Tbilisi, currently Miami).
- Updated **weekly by Roger** (Tengo's assistant agent), who asks Tengo and writes the data.
- Data contract (proposal): `assets/whereabouts.yaml`
  ```yaml
  updated: 2026-10-30
  base: London
  now:  { city: Miami, country: US, until: 2026-11-tbc }
  next:
    - { city: tbc, from: tbc, to: tbc, note: "" }
  ```
- **UI ✅:** show "Now: <city>"; on hover/focus reveal "Coming up: <city>, <city>, <city>". (Must also work on touch + keyboard.)
