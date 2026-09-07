import Link from "next/link";
import { HOME_WHAT_WE_DO } from "@/lib/content/home";
import { CATEGORIES } from "@/lib/content/taxonomy";

/**
 * "What we do" — the three practices as a stacking deck on a saturated band.
 *
 * THE SHAPE IS THE POINT. The brief's diagnosis of the old site was "six sections, one
 * shape" — hero, then grid, grid, grid, grid, CTA. So this changes three things at once
 * against the two sections above it: the ground goes from white to `blue-900` full bleed,
 * the alignment goes from centred to hard left, and the structure goes from marks in a
 * row to panels that stack. It is the page's first ground change, which is half of what
 * "rhythm" means here.
 *
 * THE MECHANISM IS `position: sticky` AND NOTHING ELSE. Each card sticks a little lower
 * than the one before it (`--i` feeds the offset), so the earlier cards stay on screen as
 * a deck of edges while the next slides over them. No scroll listener, no library, no
 * measurement, nothing to throttle. Sticky starts at lg: below that the cards are taller
 * than the viewport, and a sticky element taller than its scrollport just scrolls, which
 * reads as a bug.
 *
 * DELIBERATELY NO `.reveal` IN HERE. A scroll-driven animation on content that sticky is
 * holding still freezes at whatever progress it had when it stuck. The stacking is the
 * motion in this section.
 *
 * Every word except the eyebrow, heading and lede comes from `taxonomy.ts`, verbatim from
 * deck p4. All twelve capabilities print, which is what makes the lede checkable on the
 * page it sits on rather than a claim the reader has to take.
 */
export function WhatWeDo() {
  return (
    <section aria-labelledby="what-we-do-heading" className="wwd">
      <div className="wwd-inner">
        <div className="wwd-head">
          <p className="wwd-eyebrow">{HOME_WHAT_WE_DO.eyebrow}</p>
          <h2 id="what-we-do-heading" className="wwd-heading">
            {HOME_WHAT_WE_DO.heading}
          </h2>
          <p className="wwd-lede">{HOME_WHAT_WE_DO.lede}</p>
        </div>

        {/* `data-stack` / `data-stack-card` are a contract with `tests/links.mjs`: a
            link covered by a *later* card of the same stack is the pattern working,
            not a link nobody can click. Everything else covering a link still fails,
            and `tests/responsive.mjs` separately proves each link is reachable at the
            scroll position where its own card is in front. */}
        <div className="wwd-stack" data-stack>
          {CATEGORIES.map((cat, i) => (
            <article
              key={cat.slug}
              className="wwd-card"
              data-stack-card
              /* The card's own index, and the only thing that differs between them:
                 the sticky offset is `top + i * step`, so card 02 parks 1.1rem below
                 card 01 and the edge of what is underneath stays visible. */
              style={{ "--i": i } as React.CSSProperties}
            >
              {/* The strip is the card's label AND the only part of it that stays
                  visible once the next card lands on top — the stack step is set to
                  exactly this height, so a card underneath shows precisely its number
                  and its name and nothing half-cut. That is what makes the assembled
                  deck an index of itself rather than three anonymous edges. The number
                  is ordinal, so it is hidden from screen readers; the name carries the
                  structure. */}
              <div className="wwd-strip">
                <span aria-hidden="true" className="wwd-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="wwd-name">{cat.name}</h3>
              </div>

              <div className="wwd-body">
                <div className="wwd-copy">
                  <p className="wwd-tagline">{cat.tagline}</p>
                  <p className="wwd-intro">{cat.intro}</p>
                  <Link href={`/what-we-do/${cat.slug}/`} className="wwd-link">
                    {cat.navLabel} {HOME_WHAT_WE_DO.linkSuffix}
                    <span aria-hidden="true" className="nudge">
                      →
                    </span>
                  </Link>
                </div>

                {/* A definition list, because that is what this is: a capability and the
                    line the deck uses to define it. */}
                <dl className="wwd-caps">
                  {cat.capabilities.map((c) => (
                    <div key={c.title} className="wwd-cap">
                      <dt className="wwd-cap-title">{c.title}</dt>
                      <dd className="wwd-cap-desc">{c.descriptor}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}

          {/* Dwell spacer.
              A sticky box is clamped to its containing block's *content* box, and that
              box ends with the last card — so without this the deck forms and lets go in
              almost the same gesture. Padding does not fix it, because padding is outside
              the content box; an element does. */}
          <div aria-hidden="true" className="wwd-dwell" />
        </div>
      </div>
    </section>
  );
}
