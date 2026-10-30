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
- **Conceptdigital** ✅ his company. Details to be sourced from conceptdigital.com and the Conceptdigital working session (⚠️ pending: services, clients, results, founder/co-founder, year).
- **Halocarbon** ✅ Fractional CMO. https://halocarbon.com (⚠️ pending: what Halocarbon does, scope of the role, since when, results).
- **Health venture: Lozano Health / Jani.bio** ✅ early-stage, stealth, exploratory. On the site: at most a teaser ("something new in health"); no product details. Seeking partners & investors.

### Past ventures ✅ (3 in total; ⚠️ third one not yet named)
- **Boon**: blockchain-based social gamification platform. Closed.
- **Digital Institute**: tech school taught by MAANG lecturers; students went on to work at Tesla, Google and other top companies. Closed.
- ⚠️ Third past venture: name + one line.
- Older projects (e.g. Tikit, a restaurant): ⚠️ include or omit?

### Past roles
- **Pensight** (https://pensight.com), Head of Growth ✅. Grew the team from 2 founders + Tengo to **12 people**; grew users from **~1,600 to 18,000+**. (⚠️ years)
- Bank of Georgia (Deputy CIO, Head of Agile), Digital McKinsey, Cambridge bioengineering: see media.yaml (⚠️ years).

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
  ⚠️ Granularity of dates shown publicly (exact dates vs month only).
