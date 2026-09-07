---
paths:
  - "**/*.css"
---

# Styles and tokens

- **Hex is allowed where a custom property is *defined*.** That is what a token is. It is
  never allowed on a `background:` or `color:` — that is a value nobody can find again.
  `standards.mjs` enforces exactly this line.
- **One gutter.** `--page-gutter`, read by the header, the hero and every section. Anything
  that sets its own horizontal padding drifts — which is what put the logo row 40px off
  the headline.
- **Cyan cannot carry text on a light ground.** `brand-light` measures 1.42:1 and `brand`
  1.95:1 on white. Both fail at any size. Use `blue-700` (5.68:1).
- **A media query loses to a later rule of the same specificity.** The phone overrides sat
  above the rules they were meant to beat and silently never applied — with fresh CSS and
  the query matching. Put narrow-screen overrides *after* what they override.
- **The dev server serves stale CSS.** A rule can be in `globals.css` and missing from the
  chunk the browser gets, hash unchanged. Symptom: it renders but does not move, or an
  edit changes nothing. Fix: stop the server, `rm -rf .next`, restart. Confirm the rule
  reached the served chunk before concluding anything about the source.
- Motion picks from `--dur-fast/base/slow/slower` and the two easings. Do not invent
  timings. Animate `transform` and `opacity` only.
