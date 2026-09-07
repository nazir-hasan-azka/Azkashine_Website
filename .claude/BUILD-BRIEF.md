# Build brief — the whole site, one run

**Written 2026-09-06.** Nazir is away. When he is back the site should be finished.
This is the instruction; `DIRECTION.md` is the design; `PLAN.md` is the running record.

Read `CLAUDE.md`, `PLAN.md` and `DIRECTION.md` in full before writing anything.

---

## Mission

Build the entire Azkashine website, end to end, in one continuous run. **Do not stop to
ask.** Where something is ambiguous, make the best call and record it in `PLAN.md` as you
go. Full freedom: run as long as it takes, spawn subagents, parallelise across routes,
work in whatever order you judge best.

The gate is built and works — `components/film/`, `lib/film/`, `app/variations/film/`.
Start from that code; it is the pattern, not a draft.

**The only thing you may not decide for yourself is a claim.** No invented client, metric
or capability. Every sentence comes from `lib/content/`, from the sources below, or is a
chapter title you write. `deckPage` provenance stays.

---

## The one thing to get right

**This must not become an AI-agent company website.** Azkashine is an engineering company
that does three things in roughly equal measure:

> **AI & Automation** · **Digital Platforms** · **Cloud Services & Testing**

The trace is the path of **work through the company** — not an AI agent's reasoning. It
means three different true things at once (see `DIRECTION.md`): an agent's decision path,
an audit trail, and a fault traced back to its cause. Governance and traceability belong
to platforms and to testing as much as to AI.

In practice:

- The three practices get **equal weight and equal visual invention**. If Digital
  Platforms and Cloud & Testing end up as "the two sections after the good one", it has
  gone wrong.
- The eight products span all three categories. The products chapter shows that spread;
  it does not lead with the AI ones.
- **Do not add "AI-powered" adjectives anywhere.** The existing copy is balanced. Keep it.
- The hero headline is signed off and stays exactly as it is.

---

## Content sources, in order of authority

1. **`lib/content/` in this app** — the content layer. Everything user-facing lives here.
   Nine files, already correct, already checked by `standards.mjs`.
2. **The old app: `../new-azkashine-website/`** — the previous site's code. Eighteen built
   routes, the same content layer plus `directions.ts` and `landings.ts`. Use it for
   copy and structure, never for its visual system: that is the design this project
   exists to replace.
3. **The live site: https://test.azkashine.com/** — what is published today. Useful for
   checking wording and what a page currently covers. It is the "not polished, plain, not
   ready for public" version; take the words, leave the design.

### ⚠️ About and Contact copy is NOT in `lib/content/`

It is hard-coded inside the old app's route files:

- `../new-azkashine-website/app/about/page.tsx` — 152 lines
- `../new-azkashine-website/app/contact/page.tsx` — 129 lines

**Lift that copy into `lib/content/` first**, as `about.ts` and `contact.ts`, before
building either page. The project rule is that no sentence is hard-coded in a route, and
`standards.mjs` only checks `lib/content/` — copy left in a route file is copy nothing is
checking.

Contact details already exist in `lib/content/site.ts`: email, landline, three phone
numbers, the Bengaluru address, and a leadership entry. Use those rather than
transcribing them again.

### Images

`public/img/` holds 34 webp banners and cards — practices, products, industries, about.
Use what serves the design and ignore the rest; they came with the design being replaced.
`public/partners/` holds the five partner PNGs: cleared for use, "Our partners" is the
confirmed wording, and **the PNGs stay** (see the note in `clients.ts`).

---

## Routes — all 17, every link resolving

```
/                     the film (home)
/what-we-do/          index + ai-automation, digital-platforms, cloud-testing
/products/            index + 8 product pages
/industries/          ONE page, four anchored sections
                      (#telecom, #public-sector, #manufacturing, #energy)
/about/
/contact/
```

Industries are anchors on a single page, not separate routes — the footer already links
them that way, so building them as routes would break those links.

Every route exports `metadata`. Move each one out of `PLANNED` and into `ROUTES` in
`tests/links.mjs` as it lands.

---

## Order

1. **Finish the film** — chapters 01–06 per the chapter map in `DIRECTION.md`. Chapter 03
   (the ledger) next: `WhatWeDo.tsx` is already a pinned state machine with signed-off
   content, so it proves the scene primitive against real material.
2. **Swap the film into `/`** in one move. Retire the variation routes.
3. **Build the 17 routes.** These stay conventional and fast — a buyer comparing vendors
   needs them scannable — with the quiet static trace down the left gutter. No canvas, no
   gates. Same language, none of the weight.

---

## Non-negotiable architecture

All of it is in `DIRECTION.md` and all of it already works in the gate:

- **One canvas** for the trace, for the whole site. Chapters register segments; they never
  create a context. The hero's WebGL canvas is the only other one, and nothing draws into
  it — it paints its resting frame once and is never woken.
- **One rAF loop** writing `--p` as a CSS custom property. Never React state. Reads
  batched before writes.
- **Scene = tall wrapper** whose height IS the duration + one sticky viewport-tall stage.
  No animation library for pinning.
- **Sections ride out, never fade.**
- **Three tiers decided once:** reduced-motion and no-JS render every scene at its final
  state, content complete; below `lg` scenes shorten and horizontal turns are dropped;
  full is the film.

---

## Responsive — every route, not just the home page

**320×568 through 2560×1440. No horizontal overflow anywhere, ever.**

Phones get a deliberately different choreography, not a scaled-down desktop one: vertical
trace only, shallower excursions, no sideways movement. The gate currently reads weakly at
390px — the mark is a blip and the barrier is a few pixels wide. Fix that.

---

## Tests — extend them, they are currently blind

`links.mjs` has `ROUTES = ["/"]` and `responsive.mjs` hardcodes `goto(BASE + "/")`. Both
suites therefore reported green having never opened the film route that was just built.
That is the third time this class of bug has appeared here.

Widen both to walk **every route**, and keep the count-what-you-inspected discipline
already in them: assert the number of things examined, not just the number of failures.
**A green check that inspected nothing is worse than a red one.**

`npm run check` and `npm test` must pass. Also run **`npm run build`** — this is
`output: "export"` and it has never been run in this app; a client/server boundary mistake
will only surface there.

---

## Make it good

The gate has not yet used the craft the direction asks for. Add it:

- **Typography as a graphic object.** Copula's type-as-tone is untouched: oversized words
  set a shade off the paper, reading as structure rather than headline. Route headers and
  chapter cards are the obvious homes.
- Per-word and per-line reveals, type cropped by the frame edge, a marquee where a
  sentence genuinely repeats.
- **Hover that reveals information** rather than just moving something. Every claim
  showing its deck page is signature moment 03 in `DIRECTION.md` and is still unbuilt —
  it is the idea that turns the claims rule from a restriction into the best interaction
  on the site.

But keep the hierarchy: ambient motion once, **one signature moment per page**, nothing
animated because it can be. A site that is loud continuously has no impacts at all.

---

## Housekeeping

- **This folder is not in git. There is no undo.** Say so before any destructive command.
- Keep `PLAN.md` true as you go: what you built, what you chose where the brief was
  ambiguous, and anything you deliberately left. The next session reads it cold.
- Performance: static export on a host with no CDN, so weight lands on the visitor.
  LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- Open questions that are Nazir's, not yours — build past them, do not block:
  **section order** (client's deck puts products last; the plan moves them up), and
  **any home-page metric** (nothing goes up unless it comes from a deck).
