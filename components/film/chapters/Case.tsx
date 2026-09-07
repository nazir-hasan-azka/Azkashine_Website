import Link from "next/link";
import { FILM_CASE } from "@/lib/content/film";
import { WHY_SECTION } from "@/lib/content/routes";
import { REASONS } from "@/lib/content/why";
import { getProduct } from "@/lib/content/products";
import { ChapterMark } from "@/components/film/Beat";

/**
 * CHAPTER 06 — THE CASE. The three reasons, and the receipt for each.
 *
 * `why.ts` has carried `evidence[]` and `products[]` since it was written and NOTHING
 * HAS EVER RENDERED EITHER. The previous site showed the three reasons as three numbered
 * cards with icons in a row — the "six sections, one shape" fault `BRIEF.md` names as the
 * whole reason this redesign exists — and its icon files do not even exist in this app.
 *
 * THE SECTION'S OWN LEDE IS "THREE THINGS YOU CAN CHECK". Three assertions and a picture
 * is not something anybody can check; it is three things we believe about ourselves,
 * which is the exact sentence the lede promises not to be. The evidence is what makes it
 * true, so the evidence is what this renders.
 *
 * AND EVERY RECEIPT IS ALREADY ON THE PAGE ABOVE IT:
 *
 *   Eight products, already running   →  Tawthiq, AgentOS, ProSiddhi — chapter 04,
 *                                        which the visitor has just watched travel past
 *   We build it, run it, and test it  →  four capability names, from the ledger
 *   Governed by default               →  approval checkpoints, audit trails, role-based
 *                                        access — the gate they waited at
 *
 * So this is not a feature list, it is a closing argument: it names what has already been
 * shown rather than introducing anything new. That is why it sits here, after the failure
 * and before the sign-off, and why it comes so late.
 *
 * THE NUMERAL IS THE DISPLAY ELEMENT, not the claim. The ledger already sets practice
 * taglines in uppercase Archivo Black and chapter 04 is eight product interfaces; a third
 * section shouting in the same voice would flatten all three. Here the oversized thing is
 * the count, and the claim is set in ordinary sentence case beside it — a different shape
 * for a different job, which is the rule the whole page is built on.
 *
 * A Server Component: no scroll state, no segment. The trace runs past it in the margin.
 */
export function Case() {
  return (
    <section aria-labelledby="case-heading" className="film-case">
      <div className="film-case-inner">
        <ChapterMark number={FILM_CASE.chapter} title={FILM_CASE.title} />

        <p className="film-case-eyebrow">{WHY_SECTION.eyebrow}</p>
        <h2 id="case-heading" className="film-act reveal">
          {WHY_SECTION.heading}
        </h2>
        <p className="film-case-lede">{WHY_SECTION.lede}</p>

        <ol className="film-claims">
          {REASONS.map((reason, i) => {
            const products = (reason.products ?? [])
              .map((slug) => getProduct(slug))
              .filter((p) => p !== undefined);

            return (
              <li key={reason.id} className="film-claim reveal">
                <span aria-hidden="true" className="film-claim-n">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="film-claim-body">
                  <h3 className="film-claim-title">{reason.title}</h3>
                  <p className="film-claim-desc">{reason.description}</p>

                  {/* THE RECEIPT. Capability names are verbatim from deck p4; product
                      names link to the page that carries the rest of the proof. This is
                      the half of `why.ts` that has never been on a screen. */}
                  <div className="film-claim-proof">
                    {reason.evidence.length > 0 && (
                      <>
                        <span className="film-claim-label">
                          {WHY_SECTION.evidenceLabel}
                        </span>
                        <ul className="film-claim-chips">
                          {reason.evidence.map((item) => (
                            <li key={item} className="film-chip">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {products.length > 0 && (
                      <>
                        <span className="film-claim-label">
                          {WHY_SECTION.productsLabel}
                        </span>
                        <ul className="film-claim-chips">
                          {products.map((product) => (
                            <li key={product.slug}>
                              <Link
                                href={`/products/${product.slug}/`}
                                className="film-chip film-chip-link"
                              >
                                {product.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
