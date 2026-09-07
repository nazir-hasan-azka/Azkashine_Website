# Tests

Playwright scripts, no test framework. They drive a real browser against a running dev
server and assert on computed styles, measured geometry and pixels read back off the
canvas — which is what lets them catch things the eye misses.

```bash
npx playwright install chromium   # once
npm run dev                       # in one terminal
npm test                          # in another

BASE_URL=http://127.0.0.1:3100 npm test    # or point at a served build
node tests/hero.mjs ./shots                # add a directory to also write screenshots
```

The four enforced standards live here. `CLAUDE.md` explains why these four and not
twelve: a standard nobody can check is a wish.

```bash
npm run check   # types, lint, copy, tokens — no server, run this first
npm test        # the browser suites — needs `npm run dev`
```

| Suite | Covers |
|---|---|
| `standards.mjs` | Copy and tokens. No browser. Straight apostrophes, double spaces and stray whitespace across every sentence in `lib/content/`; no raw hex or arbitrary `text-[13px]` in our own code |
| `links.mjs` | Every href resolves, every visible link is the top element at its own centre at three widths, and every pointer target clears 24×24 |
| `responsive.mjs` | Sixteen viewports from 320x568 to 2560x1440. Horizontal overflow, the headline sitting on the gutter at both edges, and the four gaps that must stay positive — headline to eyebrow, headline to copy, copy to closing band, band to the bottom of the window — plus both CTAs still being the top element at their centre |
| `hero.mjs` | The signed-off copy surviving the re-broken lines, the canvas reporting ready and the reveal completing, a pixel read back from inside a glyph being opaque and blue, pixels changing over time, both CTAs being the top element at their centre, a resize with no reload, 390px glyph fit, and reduced motion holding still |

**Give the arrival time.** The letters take about 2.2 seconds to assemble, and a Playwright screenshot of this page takes another two to three on its own — so a capture taken "early" almost always lands after it has finished. That cost real time once: every screenshot showed the hero already assembled and it looked like the animation was broken when it was not. To actually see it, slow `ASSEMBLE_MS` right down rather than trying to time the capture.

More suites arrive as sections do. When they do, keep one list somewhere that is the
contract for what ships — the previous app used `routes.mjs` for that and it was the
single most useful file in the folder.

## Why the hero suite asserts what it does

Every check below is a bug that already happened, not a hypothetical.

- **The reveal wipe was inverted.** `smoothstep(a, b, x)` rises with `x`, so a
  left-to-right reveal needs `1.0 - smoothstep(front, front + w, x)` — and the front has
  to travel past `1.0` or the band never clears the right edge. Backwards, the material
  was masked out entirely and only the cut-edge shadow rendered. The page still looked
  deliberate. Reading a pixel back out of the canvas and requiring it to be opaque and
  blue is what catches this; a screenshot diff would not have.
- **The dev server served a stale CSS chunk.** A rule was in `globals.css` and absent
  from the chunk the browser got, hash unchanged even after touching the file. An entire
  section rendered completely unstyled. Symptom: it renders but does not move. Fix: stop
  the server, `rm -rf .next`, restart — and confirm the rule reached the served chunk
  before concluding anything about the source.
- **Cards silently never lifted.** A scroll-driven animation with `both` fill holds
  `transform: none`, and animations outrank normal declarations, so `.lift:hover` on the
  same element did nothing. Assert the measured transform, never the class.
- **A grid child overflowed at 390px.** `min-width: auto` refused to shrink below its
  content, pushing 404px into a 326px track. Measure `scrollWidth` against the viewport.
- **A box check missed a text overrun.** The hero's `h1` is width-constrained and its
  section clips, so the element box never reports the overflow, and `scrollWidth` is no
  good either where a mask line carries padding that paints nothing. Measure the drawn
  glyphs with a `Range` instead.
- **A claim that turned out to be false.** Cross-route View Transitions were assumed
  wired; counting `startViewTransition` calls showed zero. Assert the thing, not the
  intent.

## Gotchas

- Wait for hydration and for the font before interacting. The hero draws its mask only
  once `document.fonts.ready` resolves; short waits produce failures that look real.
- Park the mouse deliberately. The hero's material is brightest under the pointer, so
  where the mouse sits changes the pixels — screenshot comparisons need it in a fixed
  place, and keyboard tests need it away from the header or `mouseenter` fires.
- Full-page screenshots do **not** resolve scroll-driven animations. Content can appear
  blank in a capture while being perfectly visible to a reader. Assert on computed
  opacity at a real viewport size instead.
- **Measure the right thing.** Three instruments were wrong before the code was: a 150px
  sample disc that still contained the particles pushed to its edge, a bounding box on a
  rotating object which barely changes, and `svg.children` counted before the CSS that
  animates them had arrived. A failing measurement is not the same as a failing feature.
