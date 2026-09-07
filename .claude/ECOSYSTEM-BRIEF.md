# Build brief — the ecosystem page

**Written 2026-09-07.** A new route, `/ecosystem/`. Read `CLAUDE.md`, `DIRECTION.md` and
`PLAN.md` first — this assumes the trace, the scene primitive and the one rAF loop.

The reference is lusion.co, and the instruction from Nazir was explicit: **do not copy
it.** Reproduce the interaction *principle* with Azkashine's own content.

---

## What lusion.co actually does, measured

Driven in a real browser, not admired from a distance:

- **`window.scrollY` never leaves 0.** Across the whole site. The document does not
  scroll. Scroll is intercepted, turned into a number, and fed to a camera.
- **Three WebGL canvases.** The hero is a real-time rigid-body simulation of tumbling
  connector shapes; a later scene is a 3D tunnel with chromatic aberration.
- **~16 seconds of preloader** before anything responded.

### Why it feels physical — four reasons, and the first is the whole game

1. **It is simulation, not animation.** Objects collide with each other and settle. No
   keyframe fakes mutual collision, and that is what reads as *mass*.
2. **The camera moves, not the objects.** You feel like you are travelling because the
   viewpoint travels. Objects sliding across a screen never feel like that.
3. **Material does more than motion.** Specular highlights sweep across surfaces as they
   rotate. Remove the lighting and the same motion reads as animated shapes.
4. **Postprocessing sells it.** Depth of field and chromatic aberration make it read as
   photographed rather than rendered.

### Borrow

Scroll **velocity** rather than position, with damping and settle · genuinely different
depths moving at different rates · rotation that comes from movement, never a constant
spin · **no shared baseline** (a grid is what makes things read as cards) · one object in
focus, the rest context · per-object variation that is designed and deterministic.

### Do not borrow

- **The virtual scroll.** It breaks find-in-page, deep links, the scrollbar and keyboard
  paging, and it would fail standard 2. The horizontal-deck prototype in this repo needed
  three separate input bugs fixed before it behaved; that is the cost of hijacking scroll.
- **The preloader.** 16 seconds against LCP ≤ 2.5s on a host with no CDN.
- **WebGL postprocessing.** What makes it beautiful is what makes it expensive.
- **Their content model.** An agency showreel is decoration. Ours has eight products a
  buyer must read, compare and link to.

---

## Why this is its own route and not a home-page chapter

Considered and rejected: Products (that page's job is comparison and linking — a spatial
world fights it), What we do (three practices is too few objects to make a field),
Industries (four items, too thin).

`/ecosystem/` wins on four counts:

1. **The home page is already ~30 screens.** Ten more makes the film an endurance test.
2. **It gets its own budget** — code-split away from the route that must hit LCP ≤ 2.5s.
3. **It is a link sales can send:** *"here is everything we run, in one place."*
4. **It is cuttable.** If it does not land, delete one route and nothing else is touched.

It also saves chapter 04's horizontal traverse, which is the only horizontal move in the
film. Two product chapters on one page was one too many; on two pages they are the short
version and the long version.

**On the home page instead:** about two screens at the end of chapter 04. The traverse
decelerates, the frame dissolves, and for a beat all eight sit at different depths at
once — then one link into this page. The wow without the ten screens.

**Do not spread the effect across other routes.** The same spatial treatment on products,
practices and industries is how "six sections, one shape" comes back. Interior routes stay
quiet and fast; that contrast is what makes this page land.

---

## The metaphor: the floor

Not a constellation, not a neural net — **an operations floor seen from inside.**

The film follows *one* line through the business. Nowhere does the site show that there
are hundreds of them, across eight products, three practices and four industries, all with
approval gates. That is the truest thing about an enterprise engineering company and the
one thing the site never says.

The trace zooms out. You stop following one piece of work and see the system carrying many.

### The objects are the real product interfaces

`components/product-ui/` holds coded Azkashine interfaces. Render them as **DOM panels in
CSS 3D** — not abstract forms. They are the asset the brief says was buried, they already
exist, and unlike a blob a panel can be read, focused, linked and tabbed to.

### Spatial model — three depth bands, no more

| Band | Contents | Parallax |
|---|---|---|
| **Near** | The focused product, readable | 1.0 |
| **Mid** | Two or three neighbours, legible not readable | 0.55 |
| **Far** | The rest, plus practice and industry labels as spatial signage | 0.25 |

---

## Motion

- **Velocity in, damping out.** Scroll velocity feeds each object's velocity; each has its
  own mass so they settle at different rates. Stop scrolling and the floor drifts briefly,
  then rests.
- **Rotation is banking** — objects tilt *into* the direction of travel, **±6° maximum**,
  and return to rest. Never a continuous spin.
- **Depth drives everything**: parallax, scale, blur, settle rate.
- **Deterministic variation.** Derive each product's depth, drift phase and rotation bias
  from a hash of its slug. Same every render — this is a static export and the server and
  client must agree, so `Math.random()` at module scope is a hydration bug waiting.

**Position selects, velocity animates.** Scroll position chooses which product is in
focus; velocity animates the floor. That separation is what stops it feeling mechanical —
the same scroll distance feels different fast versus slow.

**Focus:** the panel comes to the near band, straightens to face you, sharpens, and its
name and one line arrive. Nothing zooms dramatically; it simply becomes the only readable
thing.

**Transition:** panels **trade places in depth**, they do not cut. The outgoing banks away
and recedes to mid as the incoming rises from mid to near. There is a moment where both
are legible, and that overlap is what makes it a floor rather than a slideshow.

## Choreography

| | |
|---|---|
| Enter | The floor is already alive and drifting. Nothing waits to be triggered |
| Settle | Depth resolves; it reads as a space, not a collage |
| Focus ×8 | Each product takes the near band, becomes readable, trades away |
| Pull back | All eight at once — the composition that proves the point |
| Exit | The floor recedes |

Roughly 10–12 screens. That is the honest cost.

---

## Technology — CSS 3D, not WebGL

`perspective` on the stage, `translate3d` / `rotate3d` on panels, driven by **the rAF loop
that already exists** (`lib/film/loop.ts`), writing custom properties.

**Not Three.js:** no second render pipeline, no preloader, no context loss, no bundle.
**Not GSAP or Framer Motion:** `ScrollScene` and `--p` already do this, and adding a
library to repeat it is weight for nothing. **Lenis is the one thing worth evaluating** —
about 3KB, purely for scroll feel.

Panels stay DOM: selectable, linkable, focusable, and the real interfaces stay interactive.

**Performance:** `transform` and `opacity` only, so compositor work and no layout. Eight
panels is a trivial layer count. Fake depth-of-field with a cheap blur on far bands only.
`content-visibility` on off-screen panels.

## Responsive

**Desktop** — full three-band depth. Cursor adds gentle camera yaw and pitch, **±3° and
capped**, so the space responds without wobbling. Never on touch.

**Mobile — not disabled, and not the desktop shrunk.** Two depth bands, no cursor
influence, one product per screen, panels scaled for legibility rather than composition,
drift amplitude roughly halved. The idea survives; the density does not.

## Reduced motion and accessibility

`prefers-reduced-motion` and no-JS collapse the floor to a **static composition** with
every product legible — content complete, nothing moving. Focus order follows product
order regardless of depth; off-band panels are `inert`; the focused product is announced.
**Depth is never the only signal** — name and label are always present.

---

## Definition of done

- `npm run check`, `npm test` and `npm run build` all pass.
- `/ecosystem/` added to `ROUTES` in **both** `tests/links.mjs` and `tests/responsive.mjs`,
  and their route-count assertions updated from 17 to 18. Both suites have twice reported
  green having never opened a page that was just built; do not let that happen a third time.
- No horizontal overflow, 320 → 2560.
- **Verify by eye that nothing is clipped.** The route sweep deliberately ignores text an
  ancestor clips, because the film's stages are `overflow: hidden` on purpose — so it
  cannot catch a panel cut off inside a stage. That exact bug shipped in chapter 07 and
  was caught by looking, not by testing.
- A link into it from the end of chapter 04, and an entry in the nav or footer. A page
  nothing links to is a page nobody sees.
