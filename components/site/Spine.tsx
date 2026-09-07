/**
 * The trace on an inner route: a thin static spine down the left gutter.
 *
 * Same language as the home page, none of the weight. No canvas, no rAF loop, no
 * branching and no gates — `DIRECTION.md` is explicit that a buyer comparing vendors
 * needs these pages scannable and fast, and that the cinema belongs on the home page.
 * This is what stops the site reading as a showreel bolted onto a brochure.
 *
 * It is one fixed element and a `border-left`. There is no JavaScript in this file at
 * all, which is the point: a Server Component that ships nothing.
 *
 * It runs on `--spine-x`, the same custom property the film's canvas measures, so the
 * rule on `/products/` is on exactly the same line as the trace on `/`.
 */
export function Spine() {
  return <div className="spine" aria-hidden="true" />;
}
