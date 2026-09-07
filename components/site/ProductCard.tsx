import Link from "next/link";
import { CATEGORY_BY_SLUG } from "@/lib/content/taxonomy";
import { PRODUCTS_PAGE } from "@/lib/content/routes";
import type { Product } from "@/lib/content/products";

/**
 * One product, wherever a list of them appears — the products index, a practice page,
 * an industry section.
 *
 * The whole card is the link, via an overlay pseudo-element on the title's anchor, so
 * the pointer target is the card and not a 40px strip of text. `tests/links.mjs` checks
 * 24×24 on every target and this comfortably clears it.
 *
 * ITS PROVENANCE IS PART OF THE CARD, not a footnote. `Source` is always in the DOM and
 * reveals on hover or on `:focus-within`, so tabbing through the grid shows each card's
 * deck page as it goes. It sits OUTSIDE the overlay link's stacking order deliberately —
 * inside, it would be swallowed by the anchor and read out as part of the link text.
 */
export function ProductCard({ product }: { product: Product }) {
  const category = CATEGORY_BY_SLUG[product.category];
  return (
    <article className="pcard">
      <div className="pcard-top">
        <span className="pcard-cat">{category.navLabel}</span>
      </div>

      <h3 className="pcard-name">
        <Link href={`/products/${product.slug}/`} className="pcard-link">
          {product.name}
        </Link>
      </h3>

      <p className="pcard-tagline">{product.tagline}</p>
      <p className="pcard-summary">{product.summary}</p>

      <span aria-hidden="true" className="pcard-more">
        {PRODUCTS_PAGE.learnMore}
        <span className="nudge">→</span>
      </span>
    </article>
  );
}
