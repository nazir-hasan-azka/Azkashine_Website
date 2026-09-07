# Website Redesign — Direction Brief

**Written 2026-08-27.** Carried over from a discussion that happened in the wrong session
(the ProSiddhi frontend one). Everything below is already agreed. Start from here — do
not re-run the analysis.

---

## The problem, stated plainly

Nazir's boss: the site is **"not polished, plain, not ready for public."** Nazir agrees.
His own words: *"just grid and images with text, so early 2000s."*

He opened [handhold.io](https://handhold.io/) and felt **"WOW"**. He wants that feeling.

## The diagnosis — confirmed against this codebase, not guessed

**1. Every section is the same shape.**

The homepage is: Hero → grid → grid → grid → grid → CTA.
`grid-cols` appears in nearly every section component on the site. After the hero,
every section is: heading, lede paragraph, row of bordered cards with an image on top
and text underneath.

The page has **no rhythm**. Six sections, one shape. That is what "plain" and
"early 2000s" actually mean here. It is sameness, not ugliness.

**2. The best asset on the site is buried.**

`components/product-ui/` holds **543 lines of coded product interfaces** — real, live,
rendered Azkashine product UIs. Not screenshots.

They are used on **exactly one page**: `app/products/[slug]/page.tsx:106`.
**They are not on the homepage at all.**

Meanwhile the homepage shows `business-first.png` and `ai-powered.png` — generic icons.
This is a wiring problem, not a design problem, and it is the cheapest big win available.

## Why Handhold cannot be copied

**Handhold sells one product.** Their whole page is one argument for one thing. Confidence
is easy when you only have to say one sentence.

**Azkashine sells nine products, three practices, four industries.** Using their technique
gives a page that says nothing beautifully — worse than plain.

**The better reference is [toxsl.com/portfolio](https://toxsl.com/portfolio)** (Nazir sent
a screen recording of it). A services firm with many offerings, solving the same problem:
**one colour band per service, every band wall-to-wall real screens.** No icons, no
abstract illustration. Just work.

Azkashine has better material than TOXSL — theirs are app mockups, ours are real
enterprise products in production.

## The four mechanics that create "wow"

1. **Depth.** Flat boxes on one plane = 2000s. Overlapping elements, things breaking out
   of their frames, real shadows = modern. TOXSL pops UI fragments *out* of phone frames;
   that single trick does most of their work.
2. **Section shapes that differ.** Grid, then full-bleed dark band, then sticky-scroll
   sequence, then offset two-column. Rhythm.
3. **Show, don't describe.** The nine product UIs, on the homepage, large.
4. **Type with a point of view.** Figtree is safe and neutral. Not wrong, but it does no
   work for us.

## Decisions already made

| Question | Answer |
|---|---|
| What can we show? | **The nine product UIs** *and* **named clients + logos** |
| How far can we go? | **New design language** — keep the content layer and the claims rule, replace the visual system |

**⛔ Keep this rule.** From `CLAUDE.md`: *"if a claim is not in a deck, it does not go on
the site."* No invented clients, metrics or capabilities. It is the best rule in the
codebase. It survives the redesign.

## The plan — three directions, built not discussed

Nazir has already researched "to no much avail." More discussion will not help. Build
three genuinely different directions — **hero plus two sections each**, as real pages in
this Next project, openable in a browser.

### A — The Proof Wall
TOXSL's logic, executed better. The homepage *is* the products. Full-bleed alternating
bands, each a real product interface at large scale breaking out of its frame. Client
logos directly under the hero. Very little copy.
*Confident and concrete. Risk: reads more portfolio than premium.*

### B — Command Surface ⭐ recommended
Lean into what Azkashine actually sells: agentic AI, orchestration, governed automation
for regulated industries. Dark, dense, instrument-like — the site itself feels like
enterprise software. Stacked translucent panels, precise hairlines, monospace accents.
Depth from layering, not gradient blobs.
*Most differentiated. The only direction where the website itself argues we can build
enterprise software — and for a telecom or public-sector buyer that argument is the sale.
Risk: dark is easy to do badly.*

### C — Editorial Authority
Light and spacious, carried by typography. A real display face, big statements,
asymmetric composition, product screens as large inset figures. Feels like a top-tier
consultancy's own site. Wow comes from type and composition, not effects.
*Safest to get right. Risk: can read as less technical.*

**All three must fix the two structural faults regardless of which wins:**
section shapes vary, and the product UIs come to the homepage.

## Still needed from Nazir

1. **Go-ahead on the three directions** (or swap one out).
2. **Client logos and names** — which clients can be named, and where the logo files live.
   Build with placeholders and swap them in; this should not block starting.
3. **Real metrics** — if any homepage numbers are wanted, someone must pull them from the
   decks. The claims rule forbids inventing them.

## Current state of this project (for context)

- Next.js 16 · React 19 · Tailwind 4 · TypeScript strict · Playwright tests
- Design tokens in `app/globals.css` from Figma — brand cyan `#5cc2ed`, ground `#fafbff`
- A real motion vocabulary: fixed durations/easings, `.lift`, `.nudge`, `.btn-motion`,
  `prefers-reduced-motion` honoured
- `HeroCanvas.tsx` — a canvas particle hero (converging light streams), written to replace
  a heavy background video. Good tech, but a stock "AI company" visual
- `CountUp` / `StatsBand` render only where a real figure exists
- Content layer in `lib/content/` — all copy lives there, routes stay thin
- Deploys via GitHub Actions to the Hostinger `test/` subfolder on push to `main`
  (live at https://test.azkashine.com/)

**None of this is bad work.** The engineering is sound. The problem is the visual system
and the composition, which is exactly what this brief replaces.
