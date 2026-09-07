# Direction — the trace

**Written 2026-09-06. Status: APPROVED as a direction on 2026-09-06** — *"I like the idea,
it's bold and interesting"* — after the prototype at `/variations/trace/` was scrolled.
Individual chapters are not approved; the language is. The visual language for the site,
and the reading of the reference sites it came from. `BRIEF.md` is the diagnosis,
`PLAN.md` is the running record of what is built; this is *what the thing should be*.

Full write-up, with the reference analysis in longer form:
https://claude.ai/code/artifact/200b4e3e-5a2e-466e-937d-607d546ab5d9

---

## The metaphor

**A trace: a line that shows the path something took.**

One continuous hairline that carries a piece of work through the business — a request
arrives, an agent weighs options, the losing branches die, it stops at a gate where a
person signs, it completes, and it leaves a permanent record behind it.

```
a request                the AI weighs options       a person signs     done
    ●──────────────┬───────── option A  ····fades
                   ├───────── option B  ····fades
                   └───────── option C ──────────■────────────────●
                                              approved
```

### Why this word and not another

"Trace" is a real term of art in **all three practices**, and it means something
different and correct in each:

| Practice | What "trace" means there |
|---|---|
| **AI & Automation** | The path an agent took to a decision. Reasoning made inspectable. |
| **Digital Platforms** | The audit trail — who did what, which regulated buyers must produce. |
| **Cloud Services & Testing** | Following a failure back to its cause. And literally, a signal path in wireless testing. |

One motif, three true readings, all from the client's own vocabulary. Nothing invented.

### The argument behind it

Read the existing copy and one idea appears three times, always as the differentiator:
agents that plan *"with human approval at the points that matter"*; platforms where
*"approval checkpoints, audit trails and role-based access are built in, not bolted on —
because our buyers answer to regulators"*; testing that validates AI systems themselves,
which *"few engineering firms offer at all"*.

**Azkashine is not selling intelligence. Everyone sells intelligence. It is selling
intelligence that can be held to account.** A line is the only shape that can show that,
because you can see it *stop*.

Rejected as predictable, and rejected on purpose: neural brain, particle field, circuit
board, floating sphere, generic dashboard, cartoon mascot. The last one would be fatal
with a telecom or public-sector buyer.

---

## The direction rule

**Vertical = travelling. Horizontal = working.**

The line's default is vertical, running down the **left page gutter** — the same
`--page-gutter` everything else uses, so it aligns to the page rather than floating over
it. A rule down the left margin is also what a ledger looks like, which is what an audit
trail is.

It turns horizontal **only inside a pinned scene**, because that is the one moment
vertical movement has already stopped and a sideways move contradicts nothing. The turn
is therefore the signal that you have entered a scene.

It leaves the gutter only when it has something to do — bowing into the content, branching
at a decision, stopping at a gate — then returns. Quiet by default.

**It is not a progress bar.** It does not report how far down the page you are. It reports
what is happening to the work.

On a phone: vertical only, shallower excursions, no horizontal turns at all. A sideways
move on a phone is the first thing to cut rather than shrink.

---

## The scroll grammar, taken from the references

The structural unit, measured on foodnia.co.jp: a tall wrapper whose **height buys the
scene its time**, containing one viewport-tall child at `position: sticky; top: 0`.
Nothing is pinned by JavaScript. A releasing scene's sticky `top` was observed marching
−22 → −322 → −622 → −922 → −1222.

Chapters there run **6,000–12,000px each — 7 to 13 screens per act.**

Four moves. Never the same one twice in a row:

1. **Hold and operate** — stage locks, scroll changes state *inside* it. The visitor is
   turning a dial, not scrolling a page. The most transferable idea on any reference site.
2. **Hold and traverse** — stage locks, content moves sideways. Their marquee is two copies
   of one text, the second translated `matrix(1,0,0,1,-3796,0)` — exactly one copy-width —
   so it loops seamlessly.
3. **Fly-through** — objects cross the locked stage on long diagonals (one measured at
   `translate(-2244px, 1351px)`) at different rates. That rate difference *is* the depth.
4. **Ride-out** — **sections never fade.** Opacity holds at 1; the stage slides up and off
   like a card lifted from a stack. This is why it reads as physical rather than as slides,
   and it costs nothing.

**Between chapters: a held card.** Near-empty, the act title only, pinned for ~1,500px
while one element walks in. Everything from the previous act is gone before anything from
the next arrives. This is the breath that makes a long scroll survivable, and it is what
most imitations leave out.

---

## Measured facts about the references

Driven in a real browser and read from the DOM, not eyeballed. Two things commonly said
about these sites are false.

| Site | Height | Screens | Animation library | Largest type | Background |
|---|---|---|---|---|---|
| foodnia.co.jp | 58,108px | 64.6 | GSAP + ScrollTrigger, Lenis, Three.js | — | `#ffffff` throughout |
| tokens.studio | 9,568px | 10.6 | **none by filename** (Framer runtime) | 80px | `#ffffff` throughout, colour in cards |
| copula.agency | 14,992px | 16.7 | **none** | 170px | `#f4efe9` + full-bleed scenes |
| test.azkashine.com | 5,499px | 6.1 | none | 68px | `#fafbff` |

- **Foodnia never changes its background.** Sampled at fourteen positions across all
  58,108px — white every time. Any brief describing its "white → dark → accent"
  transitions is describing a site that does not exist.
- **Copula loads no animation library at all.** No GSAP, no Lenis, no Framer. It is the
  most typographically confident of the three and it is built from CSS. **The wow is not
  in the library.**
- **Neither does Tokens Studio**, re-measured 2026-09-07: no GSAP, ScrollTrigger, Lenis or
  Locomotive bundle is served. This document previously said "Framer + Lenis"; the Lenis
  half was wrong. Two of the three references ship no animation library at all.

### What each reference is actually for

- **Tokens Studio** — *the site is an instance of the product.* Abstract product nouns are
  given physical mass; the payoff is shown as the real artefact (an actual
  `build/android/light.xml` with real XML in it, not an icon of a file); the testimonial
  cards are each a theme, with their text coloured from their own tint. It proves the
  product by being built out of it. **Lesson: find what your product does, and do it to
  the website.**
- **Copula** — *type as tone.* Section labels set enormous in a grey a shade off the paper,
  reading as texture rather than headline; one saturated field; hierarchy built from tone
  and scale alone, with no second colour.
- **Foodnia** — *a film with a cast.* Its best moment is a process wheel pinned while
  scroll advances **which node is live** — active node scales and saturates, others sit
  small and flat, a callout re-anchors, a photograph swaps in beside it.

---

## The chapter map

Seven chapters, ~32 screens (~29,000px) against 5,499px today. Ground stays white
throughout — the trace is the colour, so the page must not compete. `blue-900` and the
brand cyan are the only accents, and `blue-900` is reserved for the gate and the closing
mark, because impact needs scarcity.

### Colour, resolved — 2026-09-07

Nazir asked for Tokens Studio's colour. This document says *"ground stays white throughout
— the trace is the colour, so the page must not compete."* Those look like contradictory
instructions. They are not, and the reason is a measurement: **Tokens Studio's ground is
white too.**

`<body>` is `#ffffff` across all 9,568px of it. The colour a visitor remembers is in
**objects sitting on that white** — statement cards 1280px wide in a 1440px window, inset
80px each side, radius 20–24px. Sampling the middle of the window down the page returns
five different colours and looks like five background changes; four of them are cards the
sample landed on. There is exactly **one** real full-bleed saturated ground on the whole
page and it is the last section. See `TOKENS-STUDIO.md` for the numbers.

**So the rule does not change; it gets a second clause.**

> **The ground stays white. Colour arrives as objects on it — inset cards with a radius,
> never a full-bleed band — and the trace runs outside them, in the gutter, where nothing
> can swallow it.**
>
> One saturated card on screen at a time. Text inside a tinted card is ink, not white;
> inversion is reserved for one element inside the card. `blue-900` stays reserved for the
> gate, the closing mark, and **one** full-bleed section at the very end of the page.

**Where the trace crosses a dark card it inverts rather than disappearing.** The cards are
inset from `--page-gutter`; the spine runs at `--spine-x`, which is in the margin outside
them, so the two do not normally meet. Where a chapter deliberately runs the line over a
dark ground, the chapter registers that band with the canvas and the line is drawn light
across it. The line is never hidden and never re-routed around a card — it is the
protagonist, and the colour is scenery it passes.

**What this does NOT license:** a chapter per colour, colour as decoration, or a card
because a section looked plain. A statement card means *this chapter is making a claim
loud enough to change the page*. Three of the seven chapters get one. The rest are paper.

---

| # | Chapter | Move | Length | Content |
|---|---|---|---|---|
| 00 | **Aperture** | ambient | ~1 screen | `HOME_HERO`, unchanged. Light escapes a letterform as a line |
| 01 | **The request** | hold and operate | ~6 | AI & Automation. Teaches the vocabulary: line, branch, gate, mark |
| 02 | **Chapter card** | release | ~1.5 | `HOME_WHAT_WE_DO`. The breath |
| 03 | **The ledger** | hold and operate | ~9 | Three practices, twelve capabilities, operated by scroll |
| 04 | **Already running** | hold and traverse | ~8 | The eight coded product UIs travel horizontally past a fixed frame |
| 05 | **The failure** | signature | ~5 | Cloud & Testing. A run fails; the trace reverses to the cause |
| 06 | **Signed** | quiet | ~2 | Industries, partners, closing mark. Almost no motion |

---

## Signature moments

Interactions, not effects. In rough order of how much they matter.

1. **The gate that makes you wait.** The trace reaches an approval checkpoint and stops.
   You keep scrolling and *nothing advances* — the only place on the site where that is
   true. A mark lands; it releases. Governance is the one thing Azkashine sells that a
   visitor can physically feel, and friction is the honest way to express it.
   **This is the riskiest idea here** — it can read as broken. Build it first, show an
   explicit "awaiting approval" state, hold briefly, and test it on someone cold.
2. ~~**Every claim shows its source.**~~ **BUILT AND WITHDRAWN, 2026-09-07.** Hovering a
   claim revealed the deck page it came from. The idea was that Azkashine would be the only
   vendor site where you can audit the marketing copy. In front of a buyer it was noise:
   `deckPage` holds OUR filing references — "p11–12", "product deck — not in the portfolio
   deck" — which mean nothing to a reader and advertise internal process on a page meant to
   sell. `deckPage` stays in the content layer as the record the claims rule is enforced
   against; nothing renders it. **The claims rule is a discipline, not a feature.**
3. **The branches that die.** Five candidate paths draw; four retract; one completes. The
   visitor watches an agent plan and discard rather than seeing an icon of a brain.
4. **The ledger assembling.** Twelve capability rows rule themselves in one at a time under
   the practice that owns them.
5. **The interfaces going past.** Real product UIs, full size, horizontal under vertical
   scroll. Not a carousel with dots.
6. **The reversal.** A test fails and the trace runs backwards to find why. The only
   backwards motion on the site. No reference does this.
7. **The mark.** The trace returns into the wordmark and terminates in a single signature.
   Then stillness.

---

## What does not change

The experience is unconventional; the information architecture is not.

- **The eighteen routes stay conventional.** A buyer comparing vendors needs product pages
  scannable and fast. The cinema belongs on the home page.
- **The words do not change.** Capability names and descriptors stay verbatim from deck p4.
  Only act titles are new copy.
- **The claims rule survives.** No invented client, metric or capability.

## Honest costs

- ~29,000px against 5,499px. The mechanism is cheap; the composition is not.
- Every section must be **re-authored as a stage** with internal states. Not a CSS pass.
- Mobile needs its own choreography, not a scaled-down desktop one.
- The gate is a real risk and should be built and tested before anything is built on top
  of it.


---

# Implementation

Agreed 2026-09-06. Planning and building are deliberately separate sessions: this section
is the brief a cold session starts from.

## Site shape — multi-page

**The home page is the film. The other seventeen routes stay conventional and fast.**

- **Search.** A static export with no CDN and seventeen routes' worth of copy already in
  `lib/content/`. A one-pager collapses those into one indexable page. Someone searching
  "wireless testing" or "AgentOS" needs a page to land on.
- **How the buyers behave.** A telecom or public-sector evaluator sends a colleague a link
  to one product. That needs a URL.
- **Courtesy.** ~32 screens to reach a phone number is hostile.

The trace still appears on inner pages, as a **thin static spine down the left gutter** —
no branching, no gates, no canvas. Same language, none of the weight. That is what stops
the site reading as a showreel bolted onto a brochure.

## The five architectural decisions

Get these right and chapters are cheap. Get them wrong and every chapter is bespoke.

**1 · One scene unit.** `<ScrollScene screens={9}>` — a wrapper whose height *is* the
scene's duration, with a `position: sticky; top: 0` stage inside. Pinning needs no
library: this is what foodnia.co.jp is built from and what `WhatWeDo.tsx` already does.

**2 · One progress loop for the whole site.** A single `requestAnimationFrame` loop reads
every registered scene's position and writes a `--p` custom property (0→1) onto its stage.
CSS chapters read it directly (`translateX(calc(var(--p) * -100%))`); canvas chapters read
it as a number.

> **Never React state.** Moving a line must not re-render a tree. And one loop, not one
> observer per scene — six scenes with six observers is six layout reads per frame.

**3 · One canvas for the trace, for the entire site.** A single fixed full-viewport canvas
that outlives every chapter. Chapters do **not** own canvases; they contribute path
segments to the one that exists. Six contexts would cost six times the memory and make the
handoff between chapters impossible to draw continuously. This is the decision most likely
to be got wrong by accident.

**4 · Chapters are data, not bespoke pages.** Each chapter exports a descriptor — how many
screens it wants, its beats, how it draws its segment — plus its DOM content. Adding a
chapter is adding a file.

**5 · Three tiers, decided once rather than per chapter.**

| | What renders |
|---|---|
| No JS / `prefers-reduced-motion` | Every scene at its final state, stacked. Content complete, nothing moves |
| Below `lg` | Scenes shorten, trace stays vertical, horizontal turns dropped entirely |
| Full | The film |

Each chapter carries an id and the URL updates quietly as you pass it, so a moment can be
linked to.

## Chapter 00 and the hero — the handoff

**The existing hero stays exactly as it is.** It is not rebuilt, restyled or re-timed. It
is the one thing the client responded to, and it is what makes the trace possible: a line
that "escapes a letterform" only works because there is already light inside the
letterforms. Without the aperture, the trace starts nowhere.

The only addition is at the very end of the arrival: one hairline leaves a letterform and
drops to the gutter. Three things the implementation session needs to know:

- **Two canvases on the home page, and no more.** The hero owns a WebGL2 context
  (1440×900 at desktop); the trace is a separate 2D canvas. They do not compete, because
  the hero draws its resting frame once and never touches it again — that is the whole
  point of how it was built.
- **Do NOT draw the trace into the hero's canvas.** That would wake a context that has
  deliberately gone quiet and give back the "costs nothing once it is over" property.
- **Derive the origin, do not eyeball it.** `ApertureCanvas.tsx` already computes the
  gutter and the glyph layout; the trace's start should be attached to a real letterform
  — the dot of an "i" is the obvious candidate, since it is already a point. The
  prototype's `gutter + w * 0.22` is a placeholder and should not survive.

One thing to watch: the hero's material bleeds into the right of the frame, and a hairline
on white will disappear over it. The line should become visible as it leaves the type into
clean paper, not while it is still crossing the material.

## Build order

1. **The gate, alone.** Riskiest idea, cheapest to abandon. If it reads as a broken page
   rather than a beat, the chapter map changes shape. `/variations/trace/` already has a
   working version of it — start from that.
2. **Chapter 03, the ledger.** The content is signed off and `WhatWeDo.tsx` is already a
   pinned state machine. Proves the scene primitive against real content.
3. Then 01, 04, 05, 02, 06. Chapter cards are nearly free once the primitive exists.

**Where it lives while it is built:** `/variations/film/`, `noindex`, with `/` untouched,
swapped in as the home page in one move when enough chapters exist to judge. The live test
site never shows a half-built film.

`WhatWeDo.tsx` is **not** thrown away — it becomes chapter 03's basis on the home page and
stays as-is on `/what-we-do/`, where a buyer wants to read rather than be shown.

## Assets — what is needed, and what is not

The direction was chosen partly because there is no asset budget, and it needs almost
nothing new.

- **Colour: settled, and extended 2026-09-07.** White ground throughout; `blue-900`
  reserved for the gate, the closing mark and one full-bleed section; brand cyan for the
  trace's marks. Statement cards carry colour as objects on the white — see "Colour,
  resolved" above. The scarcity is the point, and adding cards does not spend it: one
  saturated card on screen at a time, three chapters out of seven.
- **Type: settled.** Archivo Black, Figtree, JetBrains Mono, self-hosted via `next/font`,
  ten-step scale now real tokens. Archivo Black already covers oversized chapter titles.
  **No new typeface.**
- **The trace is drawn, not an asset.** One canvas, no files.
- **The product interfaces are code, not screenshots.** Crisp at any size, weightless.
  That is what replaces the references' photography.

Real gaps, all of them client asks rather than design work:

1. **Partner logos as SVG.** 250×200 PNGs already look soft; at full-screen scale they
   would be embarrassing. Still not cleared for use either.
2. **`og:image` and favicons.** Never existed on the old site.
3. **The 36 webp banners in `public/img/`** are carried over from the design being
   replaced. The film likely uses almost none — a decision to make, not an asset to buy.
4. **Optional: one real photograph.** The one thing the references have that cannot be
   fabricated is a human moment. A single real photograph, placed once in the closing
   chapter, would do more than thirty stock images. Worth asking whether any exist.

## New copy the film needs

About six short strings — the chapter titles. Every other word already exists.
