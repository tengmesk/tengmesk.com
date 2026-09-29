# The build journal — how tengmesk.com was made

This folder is the "making of" for the tengmesk.com redesign. It is written as we go, one entry per milestone, so that at the end it can be published as a case study (and rendered on the site itself at `/journey/`).

The rule: **write the entry while the decisions are fresh**, not after. Include the wrong turns. A journal that only records wins is a changelog, not a story.

## Format

One Markdown file per milestone, numbered so they sort:

```
00-kickoff.md          what exists, why redesign, the plan
01-foundations.md      scaffold, deploy pipeline, parity site
02-direction.md        moodboard, three directions, the pick
03-hero.md             terrain + bilingual morph
04-story.md            timeline, work, contact, copy
05-launch.md           polish, audit, domain cutover
06-case-study.md       awards, retrospective
```

Each entry uses the same headings (skip one only if it truly doesn't apply):

```markdown
# NN — Title
Date range · Milestone · Status (draft / done)

## Goal
One paragraph. What this milestone had to achieve and why it comes now.

## Decisions
Bullet list. Each: the decision, the alternatives, why. Link to the spec section.

## What got built
Plain description of what changed. Link PRs/commits. Numbers where they exist
(bytes, Lighthouse scores, fps).

## Before / after
Screenshots in ./assets/NN-*.png (mobile + desktop). Short caption each.
Lighthouse or bundle-size deltas as a small table when relevant.

## Lessons
What surprised us, what we'd do differently, what to watch in the next milestone.

## Next
Two or three lines on what the following entry will cover.
```

## Conventions

- Screenshots live in `docs/journey/assets/`, named `NN-short-name.png`. Capture at 1440×900 and 390×844. Keep under 500 KB each (WebP fine).
- Cite files and sources when stating facts about the code or the old site — future-us should be able to verify every claim.
- Tone: first person plural, plain language, short paragraphs. Written for a designer or developer who has never seen this repo.
- Never include secrets, personal contact details beyond what the site itself publishes, or unverified claims about the owner without marking them as such.
- The journal is *not* the spec. The spec (`../redesign/SPEC.md`) is the plan; the journal is what actually happened. When they disagree, update the spec and note the change in the journal.
