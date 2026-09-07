# Tokens Studio, measured

**Written 2026-09-07.** Driven in a real browser at 1440×900 and read out of the DOM —
computed styles and bounding boxes, not eyeballed from a screenshot. Nazir has seen the
site and asked for four things: the way the cards stack, the colouring, the font
treatment, and the header. This is what those four things actually are.

`DIRECTION.md` already carried a short reading of this site. Two lines of it are
corrected below.

---

## The page

| | |
|---|---|
| Height | **9,568px** — 10.6 screens at 900px tall |
| `<body>` background | `#ffffff`, and it never changes |
| Animation library | **None by filename.** No GSAP, no ScrollTrigger, no Lenis, no Locomotive. The site is Framer-published, so its scroll behaviour is Framer's own bundled runtime rather than a library you could name and copy |
| Font files | 12 `.woff2`, and the weights are **separate files**, not a variable axis |

`DIRECTION.md` said "Framer + Lenis". No Lenis bundle is served. The correction matters
because it means **none of what makes this site good comes from a library** — the same
finding the direction already recorded about Copula, now true of the second reference too.

---

## 1 · The header

The thing worth taking, and it is not what it looks like standing still.

**The outer bar** is `position: fixed`, `top: 0`, full width, **78px** tall, `z-index: 10`
— and its background is `rgba(0,0,0,0)`. It paints nothing. The white you see is one
descendant.

**The inner pill changes shape on scroll.** This is the whole move:

| | At rest (0 – ~450px) | Scrolled (~600px onward) |
|---|---|---|
| Box | `x=0, top=0, 1440×78` | `x=208, top=20, 1024×78` |
| Radius | `10px` — off-screen, so invisible | `10px`, and now you see it |
| Shadow | `none` | `rgba(12,15,15,0.2) 0 3px 0 0` |

Caught mid-transition at scrollY 500: `x=194, top=19, 1053px wide`, shadow at `1.84px`
and alpha `0.12`. It is a continuous interpolation, not a class swap — the element carries
`transition: all`.

**Read it as:** a full-bleed bar at rest that **contracts into a floating pill** once you
have committed to the page. 1024px is a fixed maximum, centred — `(1440 − 1024) / 2 = 208`.

**The shadow is the signature and it is not an elevation shadow.** `0 3px 0 0` — three
pixels down, **zero blur, zero spread**. That is a printed-sticker offset, not a soft
material lift. The same hard offset appears on the article cards further down, there with
a black hairline border as well. Anyone copying this with a blurred shadow has copied the
wrong thing.

---

## 2 · The stacking

Four `position: sticky` blocks, and they are **not one stack with a ladder of offsets**.

| # | `top` | Own height | Parent height | Travel |
|---|---|---|---|---|
| 0 | `50px` | 462 | 1192 | 730px |
| 1 | `200px` | 192 | **462** | 270px |
| 2 | `200px` | 630 | 1630 | 1000px |
| 3 | `149px` | 400 | 840 | 440px |

Two findings:

1. **The parent's height IS the scene's duration.** Travel is `parentH − selfH` every
   time. That is exactly the scene unit this project already builds on, and it is the
   third reference site in a row confirming it. Nothing new to learn, but worth knowing
   the reference agrees.
2. **Block 1 is nested inside block 0** — its parent's height, 462, is block 0's own
   height. A sticky element inside a sticky element: the outer one pins the scene, the
   inner one pins a part of it for a shorter stretch. That is where the layered feel comes
   from, not from a ladder of `top` values.

The `top` values are per-scene, derived from what has to stay visible above the pinned
block: 78px of header plus breathing room. `50px` is used where the block is allowed to
slide under the header; `149px`/`200px` where it must clear it.

**What actually stacks visually** is the colour cards — see below. A card is a big rounded
block, and the next one is pinned so it rises over the one before it. What stays visible of
a covered card is its top edge and nothing else: there is no label strip, no peek of
content. **A card leaves by being covered, never by fading** — opacity stays at 1
throughout, which is the "ride-out" rule `DIRECTION.md` already records from foodnia.

---

## 3 · The colour

The measurement that resolves the conflict in `DIRECTION.md`, so it is worth stating
precisely.

**The ground is white and stays white.** `<body>` is `#ffffff` across all 9,568px. The
second ground is `#f7f8f8` — a grey so close to white it reads as paper, on a
`1440×8373` block, i.e. most of the page.

**The colour is in objects sitting on that ground, not in the ground.**

| Fill | Role | Box | Radius |
|---|---|---|---|
| `#ffca38` yellow | Statement card | 1280×504 | **20px** |
| `#a499ff` purple | Statement card | 1280×541 | **20px** |
| `#f2f2f2` grey | Panel | 772×457 | 24px |
| `#fef3f0` `#fefaf0` `#f1f0fe` `#fef0f4` `#f6fef0` | Support cards — pale tints of five hues | ~412–525 wide | 10–16px |
| `#2f0d02` `#2f2302` | Dark buttons inside colour cards | 412×106 | 10px |
| `#032d30` dark teal | **The one full-bleed section**, at the very end | 1440×1195 | **0px** |

Three rules fall out of that table:

1. **Statement cards are 1280 wide in a 1440 window** — an 80px inset each side. They are
   nearly full width but never touch the edge, and the 20px radius is what turns a band
   into an object.
2. **Text inside a tinted card is INK, not white.** Black on the yellow, black on the
   purple. The dark button inside the card is the only inversion. Colour carries the
   section's identity; it never takes over the text colour.
3. **Exactly one full-bleed saturated section on the whole page**, and it is the last one,
   and its radius is 0 because it is a ground rather than an object. Scarcity is doing the
   work — the same argument this project already makes about `blue-900`.

Counted per screen: **one saturated card at a time.** The yellow and the purple stack, so
you are never looking at two statement colours at once.

---

## 4 · The type

Ten steps, and the behaviour matters more than the sizes.

| px | Face / weight | Case | Tracking | Line-height |
|---|---|---|---|---|
| 80 | Display **ExtraBold** | uppercase | **−0.030em** | 0.90 |
| 80 | Neue 800 | uppercase | −0.010em | 0.90 |
| 64 | Display **Bold** | uppercase | **−0.030em** | 1.00 |
| 48 | Display Bold | uppercase | **−0.030em** | 1.00 |
| 40 | Display Bold | uppercase | normal | 1.00 |
| 32 | Display SemiBold | sentence | −0.030em | 1.19 |
| 28 | Medium | sentence | normal | 1.00 |
| 24 | Display SemiBold | uppercase | −0.030em | **1.58** — a label, not a heading |
| **23** | **PT Serif Bold** | sentence | −0.020em | 1.10 |
| 20 | SemiBold | sentence | −0.010em | 1.20 |
| **18** | Regular | sentence | −0.010em | **1.40** — the body |
| **14** | SemiBold | uppercase | normal | **2.00** — nav and UI |

Ratios: 80 → 64 → 48 → 40 → 32 → 28 → 24 → 20 → 18 → 14. Roughly 1.25 / 1.33 / 1.2 / 1.25
/ 1.14 / 1.17 / 1.2 / 1.11 / 1.29.

**Four behaviours, which is what transfers:**

1. **Display is uppercase, extreme weight, and tightened hard** — −0.03em at 48px and
   above. Negative tracking is what stops a heavy face at 80px reading as a body face that
   simply got bigger.
2. **Line-height collapses as size grows** — 1.40 at 18px, 1.00 at 48–64px, **0.90 at
   80px**. The display tier sets tighter than its own em box.
3. **There is a hard jump from the display tier to the body tier.** 48px or 40px straight
   to 18px, with nothing in between doing real work. The 32px and 28px steps exist but
   carry statistics and pull-quotes, not paragraphs.
4. **A third voice for accents** — PT Serif Bold at 23px, used for editorial asides. One
   sentence at a time, never a paragraph.

**The weights are separate font files.** "Display ExtraBold", "Display Bold", "Display
SemiBold" and "Neue Medium" all report `font-weight: 400` because each is its own family.
That is a licensing artefact of Almarena Neue, not a design decision, and nothing to copy.

---

## 5 · What a screenshot cannot show

- **The header contracts.** Covered above. It is the single best behaviour on the site and
  it is invisible standing still.
- **The ground never changes but the sampled colour does.** Sampling `elementFromPoint` at
  the centre of the window down the page returns `#f7f8f8`, `#ffffff`, `#ffca38`, `#2f0d02`,
  `#032d30` — which looks like a page that changes background five times. It is not. Four
  of those five are cards the sample happened to land on. Only `#032d30` is a real ground
  change. **This is exactly the mistake `DIRECTION.md` already caught somebody making
  about foodnia**, and it is available to make again here.
- **Cards do not fade.** They are covered. Opacity holds at 1.
- **Nested sticky.** A pinned block inside a pinned block, which no screenshot shows.

---

## 6 · What we take, and what we do not

**Take:**

- The header that contracts into a floating pill, with the **hard `0 3px 0 0` shadow**.
- Statement cards inset from the page edge with a 20–24px radius, stacking by sticky, one
  saturated card at a time.
- Ink text inside tinted cards; inversion reserved for one element inside them.
- Display type set uppercase at extreme weight with −0.03em tracking and sub-1.0
  line-height, jumping hard to an 18px body and a 14px uppercase UI label.
- Exactly one full-bleed saturated ground on the page, at the end.
- The principle underneath: **the site is an instance of the product.**

**Do not take:**

- `#ffca38`, `#a499ff`, `#032d30` — Tokens Studio's brand, not ours.
- Almarena Neue — commercially licensed, and we do not have it. **Archivo Black is already
  self-hosted and is the closer analogue anyway**: a single extreme weight, set uppercase
  and tracked to −0.03em, is what their Display ExtraBold is doing. No new face is needed
  and none is being added.
- PT Serif as the third voice. We already have a third voice — JetBrains Mono — and it is
  already doing the accent job. Adding a serif would be a fourth.
- The mascot, the copy, the section structure.
