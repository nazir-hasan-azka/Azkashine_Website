# Plan

**Written 2026-09-04. Updated 2026-09-06.** Where things stand, what is being built, and in what order.
`BRIEF.md`, beside this file, is the diagnosis it all comes from; read it once, then this.

This is a running record, not a set of rules. Variations are how this project decides —
build them freely, and take the ambitious version of an idea over the safe one.

---

## The bar

The boss's verdict on the previous site: **"not polished, plain, not ready for public."**
Nazir agreed — *"just grid and images with text, so early 2000s."* Reversing that specific
reaction is the goal. Not a generic idea of premium.

The diagnosis, confirmed against the code rather than guessed:

1. **Every section was the same shape.** Hero → grid → grid → grid → grid → CTA. Six
   sections, one shape. That sameness is what "plain" meant.
2. **The best asset was buried.** `components/product-ui/` holds real, coded Azkashine
   product interfaces. They appeared on exactly one route and never on the home page.

Both faults have to be fixed by whatever gets built, in any direction.

## Where things stand

Signed off *so far*, which is not the same as closed. Anything here can be reopened —
some of it only needs a word from Nazir, some would go back to the client. What it is
not is a list of things to stop thinking about.

| | Decision | When |
|---|---|---|
| **Palette** | The bright tokens now in `@theme`. Ground `#fafbff`, ink `#0f1125`, deep `#00357c`, brand `#5cc2ed`/`#85e2fe`, blues `#2185f8`/`#1964ba` | 2026-08-31 |
| **Hero copy** | `HOME_HERO` in `lib/content/home.ts`. Signed off, unchanged. Line breaks may differ; the words and their order may not | earlier |
| **Hero direction** | The aperture — heavy type cut out of the paper, a lit volume moving inside the letterforms | 2026-09-04 |
| **Claims rule** | If a claim is not in a deck, it does not go on the site. No invented clients, metrics or capabilities | standing |
| **Case** | Sentence case for every heading and nav label | standing |
| **Variations** | Build as many as the decision needs. Scope each one so it cannot reach production — see `CLAUDE.md` beside this file | 2026-09-04 |
| **Standards** | Four, each enforced by a command that runs. A standard nobody can check is a wish — see `CLAUDE.md` | 2026-09-05 |
| **Type scale** | Archivo Black hero only, Figtree everything, mono for labels only. Ten steps, weights 400/500/600 | 2026-09-05 |
| **Logos in colour** | Full brand colour, not greyed and not colour-on-hover. *"The grey is dimming it."* Centred, fluid `clamp()` per logo | 2026-09-06 |
| **Type scale** | The ten steps are real tokens now — `--text-label-sm` … `--text-h1` in `@theme`. `display` stays the hero's own, capped by height as well as width | 2026-09-06 |
| **"What we do"** | A stacking deck of **white** cards on the `blue-900` band. D's mechanism, A's colour | 2026-09-06 |
| **Constraints** | Lifted by Nazir: free rein on stack, visual system and structure. **The claims rule stays** — it protects the client relationship | 2026-09-06 |
| **Direction** | **The trace** — see `DIRECTION.md`. Liked, and the prototype at `/variations/trace/` was approved as "bold and interesting" | 2026-09-06 |
| **Site shape** | **Multi-page.** The home page is the film; the other routes stay conventional and fast, with a thin static trace down the gutter | 2026-09-06 |
| **Community Connect** | **Removed.** Azkashine no longer offers the visitor management product. Eight products now, not nine | 2026-09-06 |
| **Docs layout** | Everything Claude reads lives in `.claude/` — `CLAUDE.md`, `PLAN.md`, `BRIEF.md`, path-scoped `rules/`, `commands/`. Root keeps `README.md` and `AGENTS.md` | 2026-09-06 |

### What has been shown, and the reaction

History, so nothing gets rediscovered by accident. None of it is off limits — a rejected
idea executed differently is a different idea.

- **Nine early rounds — "ok ok".** Knot, helix, sphere, morphing solid, reacting tiles,
  contours, arcs, grainy ribbon, pulses. The useful reading is that all nine changed the
  *graphic* and none changed the *room*: same copy-left-graphic-right layout, same type,
  same scale. The object was never the variable.
- **Masthead — passed over.** Instrument Serif at 8.5vw, paper, film grain, no graphic
  at all.
- **Deck — passed over.** The nine coded product interfaces as the hero ground, in 3D
  perspective, drifting.
- **Aperture — chosen, with room to push.** "Potential to go to Wow."

Masthead and Deck live in the old app's uncommitted tree under `app/v3/` and
`components/v3/` if either is ever worth another look.

## Order of work

### 1 · The hero, and the logo row under it — built

**One hero. `components/hero/`, rendered at `/`.** The headline is cut out of the paper
with a lit volume moving inside the letterforms, and on arrival the letters fly in from
around the block and assemble into the sentence. One hand-written WebGL2 shader, no
packages, about 5KB gzipped.

The arrival and the resting state are deliberately different code paths: in flight the
mask is composited from per-glyph sprites at reduced resolution, and the moment the
letters land the original full-resolution mask is drawn once and never touched again. So
the hero at rest is pixel-identical to what it was before any of this, and the animation
costs nothing once it is over.

**Everything else was built, compared and deleted.** Worth keeping in mind so none of it
gets proposed again as if it were new:

- **Nine early rounds — "ok ok".** Knot, helix, sphere, morphing solid, reacting tiles,
  contours, arcs, grainy ribbon, pulses. All nine changed the *graphic* and none changed
  the *room*: same copy-left-graphic-right layout, same type, same scale.
- **Masthead** — serif, paper, film grain, no graphic. Passed over.
- **Deck** — the nine product interfaces as the hero ground, in 3D. Passed over.
- **Assembly** — every letter a milled solid, flying in and assembling on scroll, built
  on three.js from the font's real `glyf` outlines. Good, but a separate hero from the
  one that was liked. Its idea survives: the arrival on `/` is that choreography, done
  in 2D with the aperture's own material.
- **Plant** — a dark machined plane with light in channels, restrained type. "Plain and
  bland", which is the exact word this redesign exists to kill. Two lessons: glowing
  lines on a dark plane is generic sci-fi and fails the brief's own test, and Linear's
  restraint only works because a product screenshot talks underneath it.
- **Crystal** — the whole page refracted through hand-blown glass. Vivid, but still a
  third treatment of the same four lines rather than a new idea.

The pattern across all of it: the client twice pointed at *the headline as a physical
object*, and the thing that finally worked was combining what they had already liked
rather than inventing another one.

**Under it: the partner logo row.** `components/sections/Clients.tsx`, five logos from
`lib/content/clients.ts`, full colour, centred, each with its own fluid `clamp()` so all
five scale by one factor and the optical balance holds at every width. It replaced a band
that listed the three practices — which the very next section names again in full.

Open on the hero:
- `GROUND` in `Hero.tsx` — `paper` ships; `deep` exists and has never been seen in the
  browser since the comparison route went.
- Frame rate on real hardware, still unmeasured from here.

### 2 · "What we do" — built 2026-09-06

**`components/sections/WhatWeDo.tsx`, rendered under the logo row.** Three practices as a
**stacking deck of white cards on a `blue-900` band** — direction D's mechanism, direction
A's colour. Not the numbered ledger this plan first called for; that was built, shown, and
replaced on the same day at Nazir's direction.

The mechanism is `position: sticky` and nothing else — each card parks lower than the one
before it, so earlier cards stay on screen as a deck of edges. No scroll listener, no
library. Sticky starts at `lg`; below that the cards are taller than the viewport, where a
sticky element just scrolls and reads as a bug.

**One departure from direction D worth keeping.** In D the covered cards show a bare sliver
of panel — anonymous edges. Here `--stack-step` is set to *exactly* the card's label-strip
height, so a covered card shows precisely its number and its name and never a half-cut
line. Assembled, the deck reads as an index of itself.

Cards are **pure white**, not a lighter blue: against a saturated ground anything short of
white reads grey, which is the same call the hero already makes. Everything on the card
inverts — and `brand-light` cannot come along, because it measures 1.42:1 on white.
`blue-700` carries the accent at 5.9:1.

The deck's shadow casts **upward**. The covering card arrives from below, so the seam is
its top edge; a downward shadow falls into empty space and the deck reads as one
continuous white panel.

Three test fixes came out of building it, all real:

- `standards.mjs` scoped tokens to `components/sections/Clients` **by name**, so any new
  section landed outside standard 3. Now the directory, with Navbar and Footer exempt.
- `links.mjs` tested one screenful and skipped everything below the fold, and a
  `.reveal-group` child reads as invisible to `checkVisibility` until its animation runs.
  Both suites now walk the page a screen at a time and report how many links they inspected.
- **`responsive.mjs` was comparing the headline against a gutter of zero.** It read
  `.hero-frame`'s `padding-left`, which went to 0 when the horizontal padding moved to its
  children. Every gutter line printed `72 vs 0`. It reads `.clients-inner` now.

A stacking deck covers its own earlier cards on purpose, so `links.mjs` treats "covered by
a later card of the same stack" as a warning (via `data-stack` / `data-stack-card`), and
`responsive.mjs` separately asserts each link is reachable at the scroll position where its
own card is in front. Without that second check the first would be a hole.

Staged and still unused: `components/product-ui/`, `components/ui/` (Breadcrumb, CountUp,
GridPattern, Media, PageHeader, StatsBand), `public/img/`, and `lib/content/why.ts`.

### 2b · Where the design goes next — read `DIRECTION.md`

Everything above was section-by-section. On 2026-09-06 the brief widened: Nazir asked for
an experience closer to foodnia.co.jp, tokens.studio and copula.agency, and lifted the
constraints this plan had been working under. **`DIRECTION.md`, beside this file, is the
result** — the trace as Azkashine's visual language, the scroll grammar taken from those
sites with measurements, a seven-chapter map and the signature moments.

**It is proposed, not approved.** Do not build against it without a word from Nazir.

Two prototypes existed and both were retired on 2026-09-07 when the film became the home
page. What they proved is above; the code is in neither the app nor the routes:

- **`app/variations/horizontal/`** — the site as a deck that does not scroll at all; six
  panels advanced by wheel, keys, swipe and dots. `noindex`, nothing links to it. Built
  2026-09-06 to test "remove the scroll entirely". Verdict pending. Its real finding is in
  the code comments: locking the scroll means giving back by hand everything the browser
  did for free, and three separate input bugs came out of it.
- **The trace prototype** at `/variations/trace/` — twenty seconds of the line itself:
  the drop out of the hero, one branch, one gate, one horizontal turn. Built and shown; it
  is what got the direction approved. Superseded for the gate by `/variations/film/` below,
  and kept because the branch and the turn have not been rebuilt yet.

### 2c · The gate — built 2026-09-06, at `/variations/film/`

**The first thing off the direction's build order, and the only thing on that page so
far.** `noindex`, nothing links to it, `/` untouched. The riskiest idea first, because if
it reads as a broken page rather than as a beat the chapter map changes shape.

The four architectural decisions it was built to prove, all standing:

- **One canvas.** `components/film/TraceCanvas.tsx`, mounted once. Chapters register
  *segments* into it and never create a context. A segment says where it takes the line
  over and where the spine may resume below it — **or returns `null`, which stops the
  line dead.** The gate is not a picture of a stop: it is a segment that refuses to hand
  the line on, so nothing below it exists. Two canvases on the page and no more, asserted.
- **One rAF loop**, `lib/film/loop.ts`, writing `--p` onto each stage. No React state
  anywhere in the motion path. All reads happen before any write, or a `setProperty`
  between two `getBoundingClientRect` calls costs a layout per scene instead of per frame.
- **`ScrollScene`** — tall wrapper, sticky stage, no library. `screens` and `screensSm`.
- **The origin is real.** `ApertureCanvas` now publishes the tittle of the first dotted
  letter on the last line — the "i" of "intelligence" — through `lib/film/origin.ts`. The
  prototype's `gutter + w * 0.22` is gone. The hero is otherwise untouched and `/` reads
  none of it.

Four things that cost time and would cost it again:

- **The gate's position is the DOM's, not a fraction.** It was `0.56` of the stage in the
  component *and* in the stylesheet. At 320×568 the heading grew to four lines and ran up
  under the header. Now a zero-height `.film-gate-line` sits in ordinary flow and the
  canvas reads it, so every window gets the composition its own type produced and there is
  no shared number left to drift. Same failure as the hero's reserves, caught earlier.
- **`border-strong` on white is about 1.1:1.** The waiting bar was invisible, so the line
  stopped at nothing. It is ink at 34% now, going `blue-900` on approval — the colour
  carries the state and the deep blue stays scarce.
- **Brand cyan cannot carry the live ring** (1.95:1, fails the 3:1 for a UI component).
  `blue-500` does. The cyan survives only where the hero's material is behind it.
- **The wait has to be legible from the middle of the screen.** The ring answers the
  scroll, but it lives out in the margin, and a visitor whose page has stopped is looking
  at the centre. The status label breathes on a 2.2s pulse under the heading.

**Where the risk actually sits.** Four things carry it and none are polish: scrolling
during the hold fills the ring *and* presses the bar down a few pixels which spring back,
so the page is visibly reading you and refusing; the mark breathes; "Awaiting approval" is
in words in a live region; and one sentence arrives a moment in — *"Keep scrolling. The
page is not stuck — the work is."* The hold is ~1,100px. That number is the first thing to
change if it tests badly, in either direction.

**Not yet done: shown to somebody cold.** Machine checks prove the line does not advance
across the hold and does once signed. They cannot prove it reads as a beat. Until someone
who has not seen it scrolls it, the direction's own first signature moment is unproven.

Open, and both are one-word calls:

- **The heading is at `--text-h1`, the top of the scale.** Copula's lesson is type as
  tone, and the direction says Archivo Black covers oversized chapter titles. Going bigger
  means a new scale step, which is a new pattern and wants a word first.
- **The stage is quiet on the right.** Deliberate at this size, but the gate may want the
  thing being approved beside it once chapter 01 is around it.

## The whole site, built 2026-09-07

**`BUILD-BRIEF.md` was the instruction: build it end to end in one run.** This is what
landed, what was chosen where the brief left room, and what was deliberately not done.

### The shape of it

**`/` is the film.** Seven chapters, ~38 screens at 1440×900 and ~24 at 390×844, drawn by
**one** 2D canvas and driven by **one** rAF loop. The hero's WebGL context is the only
other context on the page and nothing draws into it.

| # | Chapter | Move | Screens | What carries it |
|---|---|---|---|---|
| 00 | Aperture | ambient | 1 | The hero, unchanged. The line leaves the tittle of the "i" it measured |
| 01 | The request | branch, then gate | 5 + 4 | AI & Automation |
| 02 | What we do | the breath | 3 | Act title only. The thing most imitations leave out |
| 03 | The ledger | hold and operate | 9 | Three practices, twelve capabilities, **a different trace move for each** |
| 04 | Already running | hold and traverse | 8 | The eight coded product interfaces, travelling |
| 05 | The failure | the reversal | 6 | Cloud Services & Testing |
| 06 | Signed | quiet | — | Industries, partners, the mark. Not a scene |

**And sixteen conventional routes**: `/what-we-do/` + three practices, `/products/` +
eight products, `/industries/` (one page, four anchors), `/about/`, `/contact/`. Seventeen
in total, every link resolving, no `PLANNED` list left.

### How the three practices were kept equal

This was the brief's one non-negotiable and it is a structural answer, not a promise:

- **Chapter 01 is AI & Automation and chapter 05 is Cloud Services & Testing**, each with a
  move nothing else on the site has — a branch and a gate, and the only backwards motion.
- **Chapter 03 gives each practice its own trace behaviour.** AI branches; Digital
  Platforms splits into parallel lanes (several classes of user, one engine — which is
  what `client-work.ts` describes in words); Cloud & Testing doubles back, because that is
  what a test is. If one practice had the interesting animation and the others had a fade,
  the brief would be broken whatever the copy said.
- **The ledger comes BEFORE the products, deliberately.** The products split 5 / 2 / 1
  across the practices; the capabilities split 4 / 4 / 4. Leading with the twelve is the
  honest order.
- **Chapter 04 interleaves the products by practice**, round-robin. In file order a visitor
  passes five AI products before seeing anything else and reasonably concludes this is an
  AI company with two side projects. The spread is a fact either way; what changes is
  whether it can be seen.
- No "AI-powered" adjective was added anywhere.

### Decisions made where the brief left room

1. **`/what-we-do/` was rebuilt on the new furniture rather than keeping `WhatWeDo.tsx`.**
   `DIRECTION.md` said the stacking deck would stay as-is on that route. It did not: the
   route is built from the same `Page`/`Section`/`SectionHead` furniture as the other
   fifteen, because a single page in a different visual system reads as an oversight.
   `WhatWeDo.tsx` is still on disk and is no longer rendered anywhere.
2. **Two type steps were added** — `--text-display-sm` and `--text-display-lg`. The scale
   topped out at 44px outside the hero and `BUILD-BRIEF.md` asks for Copula's type-as-tone,
   which needs something to set it in. Both fluid, both capped.
3. **`--spine-x` is a token now**, and the film's canvas measures it off a probe element
   rather than carrying the formula in JavaScript. That is what puts the rule on
   `/products/` on exactly the line the trace runs down on `/`.
4. **`blue-500` carries "live" marks, not brand cyan.** Cyan measures 1.95:1 on white and
   fails the 3:1 the standards set for a UI component. The cyan survives where the hero's
   material is behind it.
5. **The failure has no red**, because the palette has none and `DIRECTION.md` allows only
   `blue-900` and the cyan. The failure is a break and a dashed return: direction and
   texture instead of hue, which also survives colour blindness.
6. **Chapter 06 is not a scene.** After five pinned chapters the thing that reads as an
   ending is the film letting go of the scroll.
7. **Each chapter is linkable.** `DIRECTION.md` asks that a moment on the film can be
   sent to somebody, so every scene carries a real `id` and the loop writes the fragment
   as you pass — `replaceState`, never `pushState`, so the back button leaves the page
   rather than walking back up seven chapters. `/#failure` lands on chapter 05.
8. **The variation routes were retired**, as the brief asks — `/variations/film`, `/trace`
   and `/horizontal`, plus their two prototype components. Their findings are already
   recorded above and in `DIRECTION.md`; the code is not.

### Faults found and fixed, all of which would have shipped

- **Chapter 01's branch was drawing itself across chapter 04, four screens later.** The fan
  was sized from the distance to the bottom of the window, so once the chapter scrolled
  away the anchor's `y` went far negative, the "room" grew without limit, and the paths
  reached into whatever was on screen. It is measured inside its own stage now, which is
  the same number at every scroll position.
- **The branch crossed its own copy.** Fanning symmetrically about the junction put the top
  two candidates through the lede. It opens downward now, which is also the shape the
  metaphor is drawn as in `DIRECTION.md`.
- **A transform makes a containing block.** Chapter 04's chapter mark was positioned
  against a track that had already slid half off screen, so "04" sat pinned to the right
  edge of the window.
- **The ledger's heading was painted over by the header.** Centring a block taller than its
  stage pushes half the overflow upwards. Top-aligned, tighter rows, smaller heading.
- **An empty grid track painted as a solid tile.** Five products in a three-column grid
  leaves one cell empty, and `.pgrid` drew its rules as a 1px gap over a filled background
  — so the empty cell was a sixth tile that looked like a card that had failed to load. The
  rules are borders on the cards now.
- **Two pointer targets under 24×24** (WCAG 2.2 SC 2.5.8): the email link in the closing
  block, on every route that has one, and "See the products" in chapter 06. Both were bare
  inline anchors sitting in a row of buttons. `.tlink` had the same fault and was fixed on
  the base class before it could reach a route.
- **Reduced motion would have hidden seven of the eight products.** `globals.css` collapses
  every scene to one screen there, which is right for a chapter that holds one screenful
  and wrong for a traverse — `transform: none` sits it at its start and the stage clips the
  rest. The two oversized chapters become columns instead.

### The tests, which were blind

`links.mjs` had `ROUTES = ["/"]` and `responsive.mjs` hardcoded `goto(BASE + "/")`. Both
reported green having never opened a page that was not the home page.

- **`links.mjs` now walks all seventeen**, `PLANNED` is empty, and a link to anything
  outside `ROUTES` is a failure rather than a warning. It refuses to start if `ROUTES` does
  not hold seventeen entries.
- **`responsive.mjs` now sweeps every route at all sixteen viewports**, 320×568 to
  2560×1440 — 33,173 text runs measured on the last run. It checks two things: the document
  does not scroll sideways, and no *visible* text crosses either page edge. Ink is measured
  with a Range rather than a bounding box, because an element box can stay put while the
  glyphs inside it paint outside. Text an ancestor clips away is skipped, or the film's own
  `overflow: hidden` stages would be reported as faults.
- Both count what they inspected and fail on zero. That discipline is the reason the two
  bugs above were found rather than shipped.

### What was deliberately left

- **`components/ui/`** — `Media`, `PageHeader`, `StatsBand`, `Breadcrumb`, `GridPattern`,
  `CountUp` — is now dead: the new routes use the `components/site/` furniture and plain
  `<img>`. `Container` is still used by the Navbar and Footer. Nothing was deleted at the
  time because there was no undo; there is now, so removing it is a safe piece of
  housekeeping whenever someone wants it.
- **`Navbar` and `Footer` are still the carried-over versions**, exempt from the token rule
  by name in `standards.mjs`. They work, they link correctly to all seventeen routes, and
  rebuilding them was not in the brief.
- **Launch readiness is still §4 and still not done**: `og:image`, sitemap, robots,
  JSON-LD, a 404 page, favicons. None of it existed on the old site either.
- **Nobody has seen the film who has not built it.** The gate's own note stands: machine
  checks prove the line does not advance across the hold and does once signed; they cannot
  prove it reads as a beat. That is still the one open question worth a cold pair of eyes,
  and the hold length is one constant — `SIGNING` in `components/film/chapters/Gate.tsx`.
- **Two product taglines in `products.ts` already contain "AI-powered"** (Tawthiq, Ethics
  Intelligence). They are deck copy and were left alone, but they cut against the
  equal-measure point and are worth a word from Nazir.

---

### "The text is very AI-AI" — diagnosed and partly fixed, 2026-09-07

Nazir's read was right. Measured on the rendered page rather than argued about: **43
mentions of AI / agent / GenAI in 1,184 words, one every 28.** But the density is not
spread evenly and it is not the film's own writing.

| Zone | Density before | Where it comes from |
|---|---|---|
| **Hero** | **1 per 10** | signed off. `HOME_HERO` |
| **Ledger** | 1 per 12 | deck p4 — four of the twelve capability names literally begin with "AI" |
| **Products** | 1 per 11 | four of eight product NAMES contain AI or Agent, plus the taglines |
| The case | 1 per 121 | written for the film |
| The gate | **0** | written for the film |
| The failure | 1 per 43 | written for the film |

The chapters written for this page are the cleanest text on it. The concentration is in
copy that is either signed off or verbatim from the deck.

**Fixed: four product taglines.** They opened "AI-powered …" or "Agentic AI …", which says
nothing a competitor could not equally print, and product taglines run under every card in
the traverse — so the phrase landed four times in one screenful. Each is now what the
product's own `summary` already said it does. No new claim; the abstraction removed and the
checkable half kept. Products zone went **1 per 11 → 1 per 18**, page total 43 → 38.

**Fixed: the traverse order, which was a real fault.** Round-robin over the three practices
spends the two small buckets immediately — five AI, two Platforms, one Cloud & Testing — so
Cloud Orchestration landed third with nothing of its practice left afterwards, and the run
finished **AI, AI, AI**. The balance was all at the front and the impression was all at the
back. The order is set by hand now, the two Platforms products space the run, and the single
Cloud product goes **last**: in a horizontal traverse the final panel is where the scroll
comes to rest, and it is the only one of the eight that can end the chapter on a practice
other than AI. Rule encoded on `PANEL_ORDER` for whoever adds a ninth: never more than two
of one practice in a row, never end on the practice that has the most.

**Not fixed, and needs Nazir's word — the hero.** It is the densest text on the page at one
AI word per ten, it is the largest type on the site, and it is the first thing anybody
reads. Three specific problems:

- **"AI-powered intelligence" is a tautology** — intelligence powered by intelligence.
- **"AI-powered" is the ACCENT line**, so the single most emphasised word on the whole site
  is the one being objected to.
- **"streamline operations, reduce costs, and unlock exponential growth"** are three
  abstractions any competitor could print, which is exactly what
  `.claude/rules/content.md` forbids: *say something checkable*.

`PLAN.md` records the hero copy as signed off — "the words and their order may not"
change — so it is not mine to rewrite. A proposal is with Nazir.

**Also worth knowing:** the three practice intros in `taxonomy.ts` were rewritten by
somebody between sessions, into a markedly more human register ("Anything you can write
down in advance, ordinary automation already handles. What is left is the messy part.").
That is the register the rest of the copy should be judged against, and the four tagline
rewrites above were written to match it.

---

### One act, one title — 2026-09-07

Nazir: *"What we do — what each practice actually covers, two headings, same format,
looking off."* Correct, and it was worse than a formatting clash.

Chapter 02's whole job is to be the act's title card: "What we do", set at the display
step and held on a near-empty screen for three screens — the breath `DIRECTION.md` says
most imitations leave out. Chapter 03 then opened with its own display heading in the
**identical face, size, weight, colour and left position**, directly underneath it. The
same idea announced twice, so the breath stopped functioning as a breath and became the
first of two title screens.

**An act gets one title, and it is the breath.** The ledger does not need a heading, it
needs a caption saying what the cards below are — so "What each practice actually covers"
now sits in the label register with every other eyebrow on the site: 11px mono, tracked,
one line. Which is also the jump the reference makes, display straight to small with
nothing in between doing real work (`TOKENS-STUDIO.md`).

The display tier on this page now belongs to exactly two things: **the act titles**
(chapters 02 and 06, far apart) and **the practice taglines inside the ledger cards**.
Nothing else competes for it.

Worth keeping in mind for any new chapter: `.film-act` is the act-title register and
there should never be two of them within a screen of each other. `.film-heading` is the
chapter register, and the label register is where a caption goes.

---

### Chapter 06, "The case" — the why-us section, built 2026-09-07

Nazir asked how the *Why choose us* section from the live site would be designed. It had
no equivalent on the new home page at all: `why.ts` was being read for exactly one
sentence, by the gate.

**What the old one was.** Three numbered cards with icons, in a row, between "What we do"
and "Industries" — the "six sections, one shape" fault `BRIEF.md` names as the whole reason
this redesign exists. Its icon files (`/why/business-first.png` and the other two) **do not
exist in this app**, and their filenames stopped matching the copy some time ago, so it
could not have been carried over even if it should have been.

**The design, and the one idea in it.** `why.ts` has carried `evidence[]` and `products[]`
since the day it was written and **nothing has ever rendered either**. The section's own
lede is *"Three things you can check, rather than three things we believe about
ourselves."* Three assertions and a picture is not something anybody can check — it is
precisely the three-things-we-believe the lede promises not to be. The evidence is what
makes the sentence true, so the evidence is what this renders.

**And every receipt is already on the page above it:**

| Claim | Receipt | Where the visitor already saw it |
|---|---|---|
| Eight products, already running | Tawthiq · AgentOS · ProSiddhi, linked | chapter 04, travelling past |
| We build it, run it, and test it | four capability names, deck p4 | the ledger |
| Governed by default | approval checkpoints · audit trails · role-based access | the gate they waited at |

So it is a closing argument, not a feature list: it names what has already been shown and
introduces nothing. That is why it sits after the failure and before the sign-off, and why
it comes so late in a 32-screen page.

**The numeral is the display element, not the claim.** The ledger already sets practice
taglines in uppercase Archivo Black and chapter 04 is eight product interfaces at full
size. A third section shouting in the same voice would flatten all three, so here the
oversized thing is the count — set in the display face, in a shade off the paper — and the
claim is ordinary sentence case beside it. Hairline rules, not cards: the page has spent
its card budget on the ledger.

Chapter 07 is the sign-off; `Signed` was renumbered from 06.

**Left alone deliberately:** the section is home-page only. It was never on an inner route
and a why-us block on a product page is a sales interruption, not an argument.

---

### Home page, second pass — 2026-09-07

Nazir's second review, five faults. All five were real and all five are fixed.

**1 · Two headings were being painted over by their chapter mark.** `.chmark` was
absolutely positioned everywhere, at a `top` that had to be guessed against each
section's own padding — and on the ledger and the closing chapter it lost. Those two are
ordinary bands, not pinned stages, and in a band the mark is simply the first thing in
the column. It is in flow by default now; only `.film-chapter` lifts it into a stage's
top padding, and only there does it get a `top` at all.

**2 · The cards were not stacking, and it took two passes to get right.**

The first pass moved the gate from width to height, which was the right axis and the
wrong threshold — `min-height: 780px`. Measured against real machines that switched
stacking OFF almost everywhere: 1366×768 minus browser chrome is a **625px** viewport,
1536×864 is about **730**. Only a 1440×900 Mac and a 1080p screen cleared it. Nazir's
question — "has the card stacking been removed completely?" — was the correct read of
what he could see.

**The answer was not a lower threshold, it was a shorter card.** The card was 607px tall
on every laptop because the display type was sized on width alone, so it was 80px whether
the window was 900px tall or 625px. Everything inside the card now scales with viewport
height — the tagline is `clamp(1.75rem, min(5.4vw, 6.4vh), 5rem)`, capped by height as
well as width, exactly the correction the hero's headline needed for the same reason —
and the paddings, the strip and the parking offset follow. The card fits the window
instead of the window having to be big enough for the card.

Verified across twelve viewports from 600×960 to 2560×1440: **every one stacks, and the
last card is fully visible when parked.** Card heights now run 333–814px against windows
of 625–1440.

`--stack-top` also had to grow to 6.75rem: the header is not a 5rem bar any more, it is a
pill that floats 1.25rem down, so its underside is at 6.5rem and the parked strips were
being covered by it. A stack whose index you cannot read is just a card with a gap above
it.

**2b · The original width note, kept because the axis matters.** Whether a stack can work is a question about HEIGHT: a sticky element taller than
its scrollport does not pin, it scrolls. `max-width: 1023px` turned stacking off at
768×1024, where the cards fit with 170px to spare, and left it on at 1280×720, where they
do not — wrong in both directions. It is `(min-width: 600px) and (min-height: 780px)` now:
tall enough for the stack, and wide enough that the card is not 830px of wrapped display
type, which is what it is on a 390px phone at any height. Measured across nine viewports,
stacking is now on exactly where the tallest card plus its parked strips fit the window.

**3 · The trace had two holes in it, and both were the same mistake.** A segment claims
the span between where it takes over and where it hands back. The ledger registered one
and drew nothing across it, so the line stopped dead for the height of the whole chapter;
chapter 04 drew its horizontal run and nothing above it, so 7,200px of page had no line in
the gutter. **A chapter only needs a segment if it interrupts the line** — the canvas draws
straight through anything unclaimed. The ledger's segment is gone entirely (it is a Server
Component again), and chapter 04 now brings the line down the gutter before it turns, and
carries it on down once the traverse is spent, so it hands over instead of ending on a
right angle.

**4 · The product interfaces sat top-aligned in a box most of them did not fill.** Fixed
height was the right call and it was only half the fix. `align-content: safe center` is the
rest: an interface shorter than the box is centred, and one taller falls back to starting
at the top so the crop only ever takes the bottom — plain `center` would have cut the
window chrome off a tall one. All eight now measure 384px.

**5 · The deck-page reveal is gone.** `DIRECTION.md`'s signature moment 03 was "every claim
shows its source", and Nazir pulled it, correctly: "p11–12" and "product deck — not in the
portfolio deck" are OUR filing references. They tell a buyer nothing and they advertise
internal process on a page meant to sell. `components/site/Source.tsx` and its styles are
deleted. **`deckPage` stays on every product in `products.ts`** — it is what the claims
rule is enforced against and it is why provenance can be checked at all. It just is not
something a visitor should be reading.

---

## Home page, revised 2026-09-07 — Nazir's five

Nazir reviewed the built site: *"the overall site is really well done… only the homepage
can be improved a bit."* Five things, and the analysis of tokens.studio that came with
them. Everything below is home page only; the sixteen inner routes were not touched.

### 1 · The copy was an AI-agent website. Fixed at the source.

**This was the worst of the five and it was self-inflicted.** The film's chapters had been
given prose written for them — *"an agent weighs the ways it could get there, discards the
ones that do not hold"* — and the home page duly read as an AI-agent company with two side
practices. `BUILD-BRIEF.md` says in bold that this must not happen.

The cause was structural, not stylistic: chapters carried `heading` and `lede` strings of
their own. **They do not any more.** `lib/content/film.ts` now holds six chapter titles,
the labels that name a beat, and one closing line — and nothing else. Every sentence a
visitor reads on the home page comes from the content layer:

| Was | Is now |
|---|---|
| Chapter 01 heading and lede, written for the film | `CATEGORY_BY_SLUG["ai-automation"]`'s own `tagline` and `intro`, deck p4 verbatim |
| Chapter 05 heading and lede, written for the film | `CATEGORY_BY_SLUG["cloud-testing"]`, same |
| The gate's lede, written for the film | `REASONS`' "governed" entry from `why.ts`, verbatim — approval checkpoints and audit trails, because the buyers answer to regulators |
| Closing: *"Intelligence that can be held to account."* | *"Built, run, and independently validated."* — the site's own metadata line, which covers all three practices instead of one |
| Chapter 01 title: "The request" | "The decision" |

**The test for any future edit to `film.ts` is written at the top of it:** if a new
sentence describes what Azkashine does, it belongs in the content layer where a deck backs
it, or it should not be written.

### 2 · Scrolling hung. It was three separate faults.

Profiled rather than guessed, and the numbers are worth keeping because the guesses were
all wrong. Median frame time on `/`, scrolled end to end at 1440×900, against `/about/` as
a control at 3ms:

| | median | p90 | stalls > 50ms | forced layout |
|---|---|---|---|---|
| Before | **32.3ms** | 594ms | 56 | **195ms** |
| After | **3.5ms** | 9ms | 7 | 5.8ms |

**a · The hero's shader never stopped.** `frame()` in `ApertureCanvas.tsx` rescheduled
itself unconditionally — `settled` only gated the mask composition. So a full-viewport
WebGL fragment shader ran at 60fps for the entire life of the page, including all
28,000px where the hero is nowhere near the window. Ablation: hiding that one canvas took
the median from 32ms to 19ms, the largest single cost on the page.

It parks now when `scrollY > innerHeight * 1.35`, and unparks on scroll, rebasing its
clock so the material resumes rather than lurching. **It measures nothing to decide** —
`window.scrollY` and `window.innerHeight` are the same two numbers the layout already
comes from, so `.claude/rules/hero.md`'s "nothing here measures the DOM" still holds. The
arrival is never interrupted; parking only happens once settled.

Note that the documented claim — *"the animation costs nothing once it is over"* — was
true of the mask and false of the render. The material is alive on purpose; it just had no
reason to be alive four screens away.

**b · The canvas read the DOM after the loop had written to it.** Segments called
`getBoundingClientRect` inside the painter, which runs after `--p` is written onto six
stages — so every read forced a full style recalculation and layout of a 28,000px
document, six times a frame. `lib/film/loop.ts` has a **measure pass** now, and the rule
is stated where it can be found: anything that reads the DOM on a frame registers there
and nowhere else.

**c · An inherited custom property was invalidating 376 elements.** `--p` is set on the
stage and the traverse read it in CSS — but below that stage sit the eight coded product
interfaces. Style recalculation was 5.78s across one scroll. The track's transform is
written as an inline style on that one element now; the percentage still resolves against
the track's own width, so nothing is measured. `will-change` also came off `.beat`, which
was promoting twelve rows to twelve compositor layers to fade fourteen pixels.

### 3 · The product interfaces are all the same size now

Measured live, the eight ran **319px to 789px tall** — ProSiddhi two and a half times
Cloud Orchestration — so nothing lined up as the row travelled. `.film-panel-ui` is a
fixed 26rem box with the overflow cropped and faded at the cut.

**The uniformity fix and part of the performance fix are the same fix.** A height that
does not depend on content is what makes `contain-intrinsic-size` exact, which is what
makes `content-visibility: auto` safe — so the seven off-screen panels now skip style and
layout entirely.

### 4 · "What we do" — rebuilt, and it answers three things at once

Chapter 03 was twelve rows, three headings and a heading crammed into one 900px stage at
0.52rem of row padding. It read as a spreadsheet. It is now **three stacking cards, one
per practice**, which fixes the spacing Nazir asked about and delivers the stacking he
asked for from tokens.studio, in the section where both belong.

It also fixes something he did not raise: **the practices did not look equal.** Three
headings in one list is a list, and a list has a top. Three cards of identical size and
structure, in three tints matched for lightness, are equal by construction — you cannot
tell from the design which one the company would rather sell.

`position: sticky` and nothing else. What stays visible of a covered card is exactly its
number and its name, because `--stack-step` is the strip's height — so assembled, the
stack is an index of itself. The reference shows a bare edge, which tells you nothing;
this is the one place the implementation deliberately does more than the thing it came
from.

### 5 · Tokens Studio — measured, then taken

`.claude/TOKENS-STUDIO.md` is the analysis: driven in a real browser at 1440×900 and read
out of the DOM. Nazir named four things and all four are in.

- **The header.** The outer bar paints nothing; the white is an inner pill that
  **contracts on scroll** — full-bleed and shadowless at rest, then a centred pill at
  ~71% width, 20px down, radius 12, with the hard shadow. Ours measures x=209, w=1022
  against their x=208, w=1024. It is a scroll-driven CSS animation; there is no
  JavaScript in it.
- **The shadow is `0 3px 0 0` — zero blur, zero spread.** A printed-sticker offset, not
  an elevation shadow. It is `--shadow-hard`, defined once, used by the header and the
  cards. Copying this with a soft blur is the easiest way to get it wrong.
- **The colour.** Three tint tokens at matched lightness, ink text on all three, the hue
  at full strength only on the accent inside each card.
- **The type.** Uppercase display at extreme weight with −0.03em tracking and a
  line-height under 1, jumping hard to small text with nothing in between — the behaviour,
  carried by **Archivo Black, which was already self-hosted**. No new typeface was added
  and none is needed; their Almarena Neue is commercially licensed and we do not have it.

**The conflict, resolved rather than split.** `DIRECTION.md` said the ground stays white;
Nazir wanted Tokens Studio's colour. The measurement dissolved it: **their ground is white
too** — `<body>` is `#ffffff` across all 9,568px, and the colour a visitor remembers is in
inset rounded cards sitting on it. Sampling the middle of the window down their page
returns five colours and looks like five background changes; four of them are cards the
sample landed on. The resolution is written into `DIRECTION.md` under "Colour, resolved":
the ground stays white, colour arrives as objects, the trace runs in the margin outside
them, and one saturated card is on screen at a time.

Two corrections to `DIRECTION.md`'s earlier reading, both now fixed in place: the page is
9,568px not 9,543px, and it serves **no animation library** — no GSAP, ScrollTrigger,
Lenis or Locomotive bundle. It previously said "Framer + Lenis". Two of the three
reference sites ship no animation library at all.

### Also changed, and worth knowing

- **The film's ground is `--color-background`, not pure white.** A white pill on a white
  page is invisible — all you see is its shadow and two corners, which reads as a
  rendering fault. Tokens Studio uses `#f7f8f8` for the same reason. The hero keeps pure
  white; it sets its own and needs it.
- **`tests/hero.mjs` had a race.** "Holds still under reduced motion" waited a flat
  2400ms, but the hero boots behind `document.fonts.load` and paints once when that
  resolves — so whether the check passed depended on how much unrelated layout work the
  page happened to be doing. It waits for `[data-hero][data-lit="true"]` now, which is the
  state the assertion is actually about. The assertion itself is unchanged.
- **Chapter 03 is no longer a `ScrollScene`.** It keeps its `data-scene` and `id` so
  `/#ledger` still resolves and still scrolls to it, but it does not claim the URL
  fragment, because a chapter that does not hold the scroll should not claim to be where
  you are.

---

### 3 · The routes — built 2026-09-07

**All seventeen, every link resolving.** The practice index and three practice pages, the
product index and eight product pages, industries as one page with four anchors, about,
contact. Built on one set of furniture in `components/site/` — `Page`, `Section`,
`SectionHead`, `RouteHeader`, `Cta`, `ProductCard`, `Source` — so seventeen pages could not
invent seventeen sets of margins.

Two content files were lifted out of the old app's route files, where `standards.mjs` had
never read a word of them: `about.ts` and `contact.ts`. A third, `routes.ts`, holds the
page-level headings and ledes that were hard-coded in the old routes. Every count in them
is derived from `PRODUCTS` rather than written as a word, because "nine products" appeared
in five places and was wrong in all five.

**`Source` is the interaction the direction asked for and nothing had built.** Every
product has carried `deckPage` since the content layer was written and nothing rendered it.
Now a product card reveals the deck page its claims come from, on hover and on
`:focus-within`, with no JavaScript — the text is always in the DOM, so a screen reader and
a crawler get it with no interaction at all. It is signature moment 03, and it is the audit
trail applied to the website's own marketing copy.

### 4 · Launch readiness

Never done on the old site either: `og:image`, sitemap, robots, JSON-LD, a 404 page,
favicons.

### 5 · Deploy — done 2026-09-07

**Live at https://test.azkashine.com/.** All seventeen routes return 200, `robots.txt`
and the favicon ship, and the served HTML carries all six film chapters.

**This folder is now the git repository.** Rather than copying the new app into the old
repo, `.git` was moved onto this folder — so every path written in `.claude/` stays
true and the working directory does not change. Remote and workflow came with it. The
old app is still on disk at `../new-azkashine-website/`, no longer a repo, kept as a
copy reference.

Nothing was lost. The previous app's 35 uncommitted files — `app/directions/`,
`components/v3/`, `HANDOFF.md`, `REDESIGN-BRIEF.md` — were committed to
**`archive/old-design`** and pushed before anything was replaced.

**The repo is PUBLIC**, so `/.claude/references` is gitignored: it holds the 42MB
corporate portfolio deck and its extracted text. Verified with `git check-ignore` before
the first commit. Publishing an internal sales deck is not undoable once it is in
history.

#### Three things the deploy taught, worth not relearning

- **`npm ci` cannot work here.** Two deploys failed at it in ten seconds each. The Linux
  runner wants `@emnapi/core` and `@emnapi/runtime` hoisted to the top level for
  `@tailwindcss/oxide-wasm32-wasi`; npm on Windows will not write them there. Regenerating
  the lock file, forcing `--os=linux --cpu=x64`, and deleting it and starting over all
  produced the same tree. The mismatch is structural — developed on Windows, deployed on
  Linux — so the workflow uses `npm install`, which still honours every pinned version.
  The reasoning is in `deploy.yml`; do not "fix" it back.
- **`npm run build` catches what dev never will.** `app/robots.ts` failed the build
  because `output: "export"` needs `export const dynamic = "force-static"` on a metadata
  route. Dev was perfectly happy. Run the build before every push.
- **Both failures happened before the FTP step**, so the live site was never left broken.
  That is the shape of this pipeline: install, build, then publish. A failure early is
  free.

#### Before the MAIN site

The current target is the `test/` folder. Pointing this at production needs, at minimum:

1. **`app/robots.ts` reversed.** It disallows everything on purpose — a staging copy
   competing with azkashine.com in search is worse than no staging at all. Production
   needs `allow: "/"` and a sitemap.
2. **A sitemap and `og:image`.** Neither exists. Sharing a link today gets a blank card.
3. **JSON-LD**, still never done.
4. **The `server-dir` in `deploy.yml` changed** from `test/` to the production root — and
   note the FTP account is chrooted to `public_html`, so the `test/` leaf is currently
   what stops a deploy writing into the main site. Removing it removes that guard.

## Waiting on Nazir

Both were asked and neither was answered. They block the section after next, not the next
one, so work can continue — but they go stale quietly, which is why they are written here.

- **Section order.** The client's deck puts products last. My plan moves them up, on the
  argument that the coded product interfaces are the strongest asset on the site and
  burying them is fault #2 in the diagnosis. Keep the client's order, or move products up?
- **"Our partners".** Is that the right wording for the logo row heading, and is it a
  claim the client will stand behind for all five?

## Open questions for the client

- **Client logos — closed 2026-09-06.** Cleared for use, "Our partners" confirmed for all
  five, CloudIT ME named correctly, and **the PNGs stay**. Vector art was attempted and
  dropped: Sasken publishes no SVG, the Vi SVG on myvi.in is a different lockup from the
  file we hold, and the CSG mark on csgi.com belongs to a **different company** — ours
  carries "Secure | Resilient | Compliant". See the note in `clients.ts`.
- **Real metrics.** Any figure on the home page has to be pulled from a deck by someone.
  The claims rule forbids inventing them.
- **Deck imagery provenance.** Confirming it is the client's to do.
