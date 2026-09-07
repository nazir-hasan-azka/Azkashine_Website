---
paths:
  - "lib/content/**"
---

# Copy

All user-facing sentences live here, so they can be checked in one place.
`node tests/standards.mjs` enforces the mechanical half.

- **If a deck does not evidence it, it does not go on the site.** No invented clients,
  metrics or capabilities. Each product carries `deckPage` recording where it came from.
- **Sentence case everywhere** — headings, nav labels, section titles. "What we do", not
  "What We Do". This was inconsistent once and is easy to reintroduce.
- **Typographic apostrophes** (’), never straight ('). No double spaces, no leading or
  trailing whitespace.
- **Say something checkable.** Avoid sentences that describe a posture — "we start from
  the outcome, not the technology" — because a competitor can print the same line. Point
  at a product in production, a capability the decks evidence, or a number.
- The checker cannot catch a sentence that is grammatical and wrong. That still needs a
  person reading it aloud.

**Settled 2026-09-06:** the partner logos are cleared for use and "Our partners" is the
confirmed wording for all five. Still open: vector art — see the note in `clients.ts` for
which three cannot simply be pulled from the companies' own sites.
