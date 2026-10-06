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

- **Write for an enterprise buyer** (management, 2026-10-07, who called the old home page
  "absolute gibberish"). Complete sentences in a plain, confident register. No fragments,
  no wordplay, no labels that narrate a design idea ("Ruled out", "Awaiting approval"),
  no asides about the reader's Tuesday. Cut before rewording: a line that says nothing a
  buyer needs goes, it does not get polished.
- **Never name a client from a deck without permission.** A deck written for one client
  (ConnectSiddhi's was for Qatar Aeronautical Academy) is a source of product facts, not a
  licence to name the client.

**Partners, 2026-10-06:** fifteen, from Nazir's list; logos and sources are noted at the
top of `clients.ts`. "Our partners" was confirmed for the original five on 2026-09-06; the
other ten are on the waiting list in `PLAN.md`.
