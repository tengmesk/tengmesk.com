# Homepage bake-off: results

Five design skills, same model (Fable), same brief and inputs (`bakeoff/inputs/`), built blind and in isolation.

## Label key
| Viewer label | Judge 1 label | Judge 2 label | Skill |
|---|---|---|---|
| A | A | Q | Anthropic frontend-design |
| B | B | P | Impeccable (pbakaus/impeccable) |
| C | C | S | MotionSites Web Builder (Motionsites-AI/claude-skill) |
| D | D | R | UI/UX Pro Max (nextlevelbuilder/ui-ux-pro-max-skill) |
| E | (not entered) | T | Hallmark (Nutlope/hallmark) |

## Scores (out of 10: aesthetics / usability / structure → average)
| Entry | Skill | Judge 1 | Judge 2 | Tengo |
|---|---|---|---|---|
| A | frontend-design | 7.2 / 7.4 / 8.0 → 7.53 | 6.0 / 8.0 / 7.5 → 7.17 | – |
| B | Impeccable | 6.8 / 6.6 / 7.3 → 6.90 | 6.5 / 7.5 / 8.0 → 7.33 | – |
| C | MotionSites | 8.6 / 7.0 / 8.0 → 7.87 | 8.5 / 6.5 / 8.0 → 7.67 | top 2, **chosen** |
| D | UI/UX Pro Max | 8.3 / 8.4 / 8.5 → **8.40** | 7.5 / 8.5 / 8.5 → **8.17** | top 2 |
| E | Hallmark | – | 6.3 / 7.3 / 7.0 → 6.87 | – |

Both AI judges ranked D first and C second; both rated C the best-looking (aesthetics 8.6 / 8.5) and D the most usable. Tengo chose **C** (2026-11-24).

## C: issues both judges found (fix list for v3)
- City tracker on touch: first tap does nothing (needs two); click while hovered closes it.
- First paint is a blank green screen until the entrance animation runs (needs content visible at rest).
- Count-up stats briefly show wrong values ("70%", "3.2/5") before settling.
- Some body text too small / low contrast (~11 px).
- Mobile hero crowds the buttons onto the portrait.
- Logo marquee has no pause control.
- Cut-out portrait has slightly soft hair edges at 2×.

## Worth stealing from the others
- D: proof-first section order, marquee pause button, honest newsletter copy (but rename its "Clients that can be named" heading).
- B: the Client / What we did / Result table; role-specific calls to action.
- A: plainest, best-written hero paragraph; duotone portrait treatment.
- E: full-bleed stage-photo band.

Full verdicts: `judge-1-verdict-A-D.md` (letters A–D) and `judge-2-verdict-P-T.md` (letters P–T, see key).
