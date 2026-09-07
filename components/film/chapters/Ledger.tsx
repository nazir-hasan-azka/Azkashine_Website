import type { CSSProperties } from "react";
import { FILM_LEDGER } from "@/lib/content/film";
import { CATEGORIES } from "@/lib/content/taxonomy";
import { ChapterMark } from "@/components/film/Beat";

/**
 * CHAPTER 03 — THE LEDGER. Three practices, twelve capabilities.
 *
 * REBUILT 2026-09-07 as a stack of three colour cards, replacing a single pinned stage
 * that held all twelve rows at once. Three things were wrong with that version and this
 * fixes all three:
 *
 *   SPACING. Twelve rows, three headings and a heading in one 900px stage meant every
 *   row was squeezed to 0.52rem of padding and the section read as a spreadsheet. A card
 *   per practice gives each one a whole screen, and the rows get room to be read.
 *   THE PRACTICES DID NOT LOOK EQUAL. They were three headings in one list, and a list
 *   has a top. Three cards of the same size, the same structure and matched-lightness
 *   tints are equal by construction — you cannot tell from the design which one the
 *   company would rather sell.
 *   IT DID NOT STACK. Nazir asked for Tokens Studio's card stacking specifically, and
 *   this is the section it belongs in.
 *
 * THE MECHANISM IS `position: sticky` AND NOTHING ELSE — the same one `WhatWeDo.tsx`
 * used before the film replaced it, and the same one `.claude/TOKENS-STUDIO.md` measured
 * on the reference: each card's parent height is its duration, and a card leaves by
 * being covered rather than by fading. Opacity holds at 1 throughout.
 *
 * WHAT STAYS VISIBLE of a covered card is exactly its label strip — the number and the
 * practice name — because `--stack-step` is set to that strip's height. Assembled, the
 * stack is an index of itself. That was the one departure from the reference worth
 * keeping from the old deck: Tokens Studio shows a bare edge, and a bare edge tells you
 * nothing about what is under it.
 *
 * IT REGISTERS NO CANVAS SEGMENT, and that is deliberate rather than an omission. The
 * cards sit inside `--page-gutter`; the trace runs at `--spine-x`, in the margin
 * outside them, and passes the stack rather than crossing it — which is the rule
 * `DIRECTION.md` sets: colour is scenery the trace passes, and nothing may swallow it.
 *
 * It DID register one, briefly, and that put a hole in the line. A segment claims the
 * span between where it takes over and where it hands back; this one drew nothing in
 * between, so the spine stopped dead for the height of the whole chapter and picked up
 * again underneath. The canvas draws straight through anything no segment has claimed,
 * so the fix was to claim nothing. A chapter only needs a segment if it interrupts the
 * line.
 *
 * A Server Component, therefore. There is nothing here to subscribe to.
 */

const SCENE = "ledger";

/** One tint per practice, matched in lightness. See the note in `globals.css`. */
const TINTS = ["cyan", "blue", "deep"] as const;

export function Ledger() {
  return (
    <section
      aria-labelledby="ledger-heading"
      className="film-ledger-band"
      data-scene={SCENE}
      id={SCENE}
    >
      {/* A CAPTION, NOT A SECOND TITLE CARD. Chapter 02 is the act's title — "What we
          do", set at the display step and held on a near-empty screen for three
          screens. This chapter used to open with its own display heading in the
          identical face, size, colour and position, immediately after it: the same
          idea announced twice, and the breath stopped being a breath because it had
          become the first of two title screens.

          The act gets one title. What the ledger needs is a line saying what the cards
          below are, and that belongs in the label register with every other eyebrow on
          the site — which is also the jump the reference makes, display straight to
          small with nothing in between. */}
      <div className="film-ledger-head">
        <ChapterMark number={FILM_LEDGER.chapter} title={FILM_LEDGER.title} />
        <h2 id="ledger-heading" className="film-ledger-caption reveal">
          {FILM_LEDGER.heading}
        </h2>
      </div>

      {/* `data-stack` / `data-stack-card` are a contract with `tests/links.mjs`: a link
          covered by a LATER card of the same stack is the pattern working, not a link
          nobody can click. Everything else covering a link is still a failure. */}
      <div className="ledger-stack" data-stack>
        {CATEGORIES.map((category, i) => (
          <article
            key={category.slug}
            className="ledger-card"
            data-stack-card
            data-tint={TINTS[i]}
            style={{ "--i": i } as CSSProperties}
          >
            <div className="ledger-strip">
              <span aria-hidden="true" className="ledger-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="ledger-name">{category.name}</h3>
              <span className="ledger-count">
                {category.capabilities.length} {FILM_LEDGER.countLabel}
              </span>
            </div>

            <div className="ledger-body">
              <p className="ledger-tagline">{category.tagline}</p>

              {/* A definition list, because that is what this is: a capability and the
                  line the deck uses to define it, verbatim from p4. */}
              <dl className="ledger-caps">
                {category.capabilities.map((c) => (
                  <div key={c.title} className="ledger-cap">
                    <dt className="ledger-cap-title">{c.title}</dt>
                    <dd className="ledger-cap-desc">{c.descriptor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
