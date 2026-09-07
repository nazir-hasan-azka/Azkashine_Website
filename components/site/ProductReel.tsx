import Link from "next/link";
import { PRODUCTS } from "@/lib/content/products";
import { CATEGORY_BY_SLUG } from "@/lib/content/taxonomy";
import { ProductVisual, hasVisual } from "@/components/product-ui/ProductVisual";

/**
 * The product reel — eight interfaces, one at a time.
 *
 * THE FAULT THIS FIXES is the first one in the brief: `components/product-ui/` holds
 * real, coded Azkashine interfaces and this page showed exactly none of them. Eight
 * products described in text, with the best asset on the site sitting unused one import
 * away.
 *
 * THE MECHANISM IS `position: sticky` AND NOTHING ELSE, and it differs from the film's
 * card deck in one deliberate way: every row pins at the SAME top offset rather than a
 * stepped one, so each product completely covers the one before it instead of leaving a
 * visible edge. One product on screen at a time, replaced rather than stacked. Measured
 * off basement.studio, whose featured-projects rows pin at 147.2, 147.2 and 148.8px —
 * the same line, three times.
 *
 * Below lg it is a plain column: a sticky element taller than its scrollport just
 * scrolls, which reads as a bug, and a phone should not have to fight this.
 */
export function ProductReel() {
  return (
    <div className="reel">
      {PRODUCTS.map((product, i) => {
        const category = CATEGORY_BY_SLUG[product.category];
        return (
          <article key={product.slug} className="reel-row" style={{ zIndex: i + 1 }}>
            <div className="reel-media">
              {hasVisual(product.slug) ? (
                <ProductVisual slug={product.slug} />
              ) : (
                <div className="reel-media-empty" aria-hidden="true" />
              )}
            </div>

            <div className="reel-copy">
              <p className="reel-cat">{category.navLabel}</p>
              <p className="reel-tag">{product.tagline}</p>
              <Link href={`/products/${product.slug}/`} className="reel-link">
                Open
                <span aria-hidden="true" className="nudge">
                  →
                </span>
              </Link>
            </div>

            <h3 className="reel-name">{product.name}</h3>
          </article>
        );
      })}
    </div>
  );
}
