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
- **`hero.mjs` has one flaky assertion, found 2026-09-07 and NOT fixed.** *and the
  material is blue, not paper* reads `px.best[2] > px.best[0]` — blue over red — on the
  single most opaque pixel in a block of an ANIMATING shader, so which frame
  `readPixels` lands on decides it. Observed `r62 g24 b55` (fail) and `r46 g23 b51`,
  `r2 g10 b61`, `r2 g10 b59` (pass) across four runs of the same unchanged code. The
  material really does sweep through frames where red edges ahead by a few counts.
  It wants a margin or a sample over several frames rather than one pixel of one frame —
  but it is an assertion about a signed-off hero, so it is flagged here rather than
  quietly retuned. **A run that fails only this line has not found a regression.**
