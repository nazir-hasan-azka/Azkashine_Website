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
- **Nothing measures the phone menu.** Neither browser suite ever opens a menu, so every
  link in the drawer — the only navigation a phone has — is invisible to standard 2. That
  is how "Products" sat unreachable on phones from 2026-09-07 to 2026-09-10 with every
  suite green. Since the rebuild the drawer is not in the DOM until it is opened, and
  folded sections are `hidden`, so a closed-state check finds nothing at all rather than
  a zero-height box. The check run by hand on 2026-09-10, which belongs in `links.mjs`:
  open the drawer, disclose each section, tap every one of its 21 links, and assert the
  URL, the menu closing, the link being the top element at its centre, and 44px height —
  in Chromium and WebKit, at iPhone SE, iPhone 13 and iPhone SE landscape. 126 taps.
- **WebKit's "Navigation canceled by policy check" is usually the test, not the site.**
  Three taps failed with it in that 126-tap run; the same three links went 30 for 30 on a
  re-run, before and after hydration. Re-run before believing it.
- **Match every string, then filter.** A minimum length in the string regex pairs a short
  literal's closing quote with the next literal's opening quote, and the checker starts
  reporting on the code between strings.
- Routes not built yet go in `PLANNED` in `links.mjs` and report as warnings. Move them
  into `ROUTES` as they land.
- **The 24x24 check has a hole: its inline exception matches ANY anchor inside a `p` or
  `li`.** That is meant for a link inside a sentence; it also silently exempts every item
  in the main navigation, which sat at 20px tall for months. If a target lives in a list
  because it is a list of targets, the exception should not apply to it.
- **Do not test navigation with a fixed sleep.** A dev server compiles a route on demand,
  and the two big pages take seconds — a 1.2s wait reported "clicking Products does not
  navigate" when it navigated fine. Use `waitForURL`.
- **`hero.mjs` has one flaky assertion, found 2026-09-07 and NOT fixed.** *and the
  material is blue, not paper* reads `px.best[2] > px.best[0]` — blue over red — on the
  single most opaque pixel in a block of an ANIMATING shader, so which frame
  `readPixels` lands on decides it. Observed `r62 g24 b55` (fail) and `r46 g23 b51`,
  `r2 g10 b61`, `r2 g10 b59` (pass) across four runs of the same unchanged code. The
  material really does sweep through frames where red edges ahead by a few counts.
  It wants a margin or a sample over several frames rather than one pixel of one frame —
  but it is an assertion about a signed-off hero, so it is flagged here rather than
  quietly retuned. **A run that fails only this line has not found a regression.**
