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
- **A per-area stylesheet loses to `globals.css` at equal specificity.** The
  `@import`s are at the TOP of `globals.css`, so every rule in that file comes later in
  the cascade. `.eco-cap-link { min-height: 2.25rem }` in `styles/ecosystem.css` changed
  nothing, because `.tlink { min-height: 1.5rem }` sits in globals and wins on order.
  Override a shared class from an area sheet with two classes, not one.
- **`--page-gutter` CENTRES A FULL-WIDTH BOX. Never pair it with a `max-width`.** It is
  `max(4.5rem, (100% - 1440px) / 2)`, so a full-width element already resolves to a 1440px
  column centred on any screen — and a percentage padding resolves against the CONTAINING
  BLOCK, not the element. A box capped at 1680 inside a 2560 window still padded itself by
  560 a side and came out 560px wide, hard against the left edge. `max-width: 1680px` was
  on six blocks (`.band-inner`, `.cta-inner`, `.ledger-stack`, three film chapters) and
  broke every one above 1680px of viewport. Same fault crushed the contracted nav pill,
  which is 71% wide and was still padding itself for a full-width one: the menu wrapped
  onto two lines at 2560. Invisible at 1440, which is why it shipped.
- **A media query loses to a later rule of the same specificity.** The phone overrides sat
  above the rules they were meant to beat and silently never applied — with fresh CSS and
  the query matching. Put narrow-screen overrides *after* what they override.
- **The dev server serves stale CSS.** A rule can be in `globals.css` and missing from the
  chunk the browser gets, hash unchanged. Symptom: it renders but does not move, or an
  edit changes nothing. Fix: stop the server, `rm -rf .next`, restart. Confirm the rule
  reached the served chunk before concluding anything about the source.
- **Nothing that TURNS in 3D may be expensive to rasterise.** An element inside a rotating
  container has a screen projection that changes every frame, so the browser redraws it
  every frame. On `/ecosystem/` a ruled floor plane cost 16ms of a 16.7ms budget — and the
  SAME whether it was 5200px or 1000px, so shrinking it is not the fix. Move it outside the
  rotating element and write its transform once. `filter: blur()` and any shadow with a
  blur radius cost the same way on anything whose scale changes: use `--shadow-hard`, which
  has no blur and no spread. Measured 333ms a frame -> 16.7ms.
- **An attribute selector beats a class, whatever the order.** A
  `.room-panel[data-band="back"] { visibility: hidden }` cull could not be undone in the
  reduced-motion block by `.room-panel { visibility: visible }`; it needs the attribute too.
- **Never name a class after a Tailwind utility.** `.block` in `pages.css` merged with
  Tailwind's `block` and put a 32-44px top margin on fifteen elements for three days,
  including every row of the phone menu — which is what pushed Products off the first
  screen. The element's class list shows `block` and nothing else; only the browser's
  matched-rules list shows the second rule. Prefix area classes: `.page-block`, `.wwd-*`,
  `.eco-*`.
- Motion picks from `--dur-fast/base/slow/slower` and the two easings. Do not invent
  timings. Animate `transform` and `opacity` only.
