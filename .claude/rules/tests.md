---
paths:
  - "tests/**"
---

# Tests

Four suites. `standards.mjs` needs nothing; the rest need `npm run dev` running.

- **A green check that inspected nothing is worse than a red one.** `standards.mjs` passed
  while checking zero files, because `join(".", x)` drops the `./` prefix and every filter
  matched nothing. Every suite must refuse to report a pass it did not earn — assert the
  count of things inspected, not just the count of failures.
- **A collapsed panel still reports boxes.** The mobile drawer is `overflow-y: auto` with
  height 0; its links are laid out, clipped and unreachable. `checkVisibility()` does not
  catch this — walk up for an ancestor that clips and has zero height. They are not
  covered; they are simply not reachable yet.
- **Match every string, then filter.** A minimum length in the string regex pairs a short
  literal's closing quote with the next literal's opening quote, and the checker starts
  reporting on the code between strings.
- Routes not built yet go in `PLANNED` in `links.mjs` and report as warnings. Move them
  into `ROUTES` as they land.
