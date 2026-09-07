import { FILM_RUNNING } from "@/lib/content/film";
import { PRODUCTS, type Product } from "@/lib/content/products";
import { CATEGORY_BY_SLUG, CATEGORIES } from "@/lib/content/taxonomy";
import { ProductVisual, hasVisual } from "@/components/product-ui/ProductVisual";
import { ChapterMark } from "@/components/film/Beat";
import Link from "next/link";

/**
 * The panels chapter 04 travels past. A Server Component, and that is the point — the
 * eight coded interfaces in `components/product-ui/` are several hundred lines of JSX
 * that never need to reach the browser as JavaScript.
 *
 * THE BURIED ASSET, UNBURIED. The project brief's diagnosis of the previous site names
 * this as fault #2: `components/product-ui/` holds real, coded Azkashine product
 * interfaces and they appeared on exactly one route, never on the home page. Here they
 * are the home page, full size. They are code rather than screenshots, so they are crisp
 * at any width and weigh nothing — which is what replaces the reference sites'
 * photography.
 *
 * THE ORDER IS INTERLEAVED BY PRACTICE, AND THAT IS A DELIBERATE EDIT. The products
 * split five AI, two Platforms, one Cloud & Testing. In file order the visitor would
 * pass five AI products before seeing anything else and would reasonably conclude this
 * is an AI company with two side projects. Round-robin over the three practices puts one
 * of each in the first three panels. The spread is a fact either way; what changes is
 * whether the visitor can see it.
 *
 * EVERY PANEL SHOWS ITS SOURCE — signature moment 03 in `DIRECTION.md`, and the reason
 * `deckPage` has been carried on every product since the content layer was written.
 */

/** Round-robin over the practices, so no practice appears three times before another. */
function interleaved(): Product[] {
  const buckets = CATEGORIES.map((c) =>
    PRODUCTS.filter((p) => p.category === c.slug),
  );
  const out: Product[] = [];
  for (let i = 0; out.length < PRODUCTS.length; i++) {
    for (const bucket of buckets) {
      const next = bucket[i];
      if (next) out.push(next);
    }
  }
  return out;
}

export function RunningPanels() {
  const products = interleaved();

  return (
    <>
      <div className="film-running-head">
        <ChapterMark number={FILM_RUNNING.chapter} title={FILM_RUNNING.title} />
        <p className="film-heading">{FILM_RUNNING.heading}</p>
        <p className="film-lede">{FILM_RUNNING.lede}</p>
      </div>

      {products.map((product, i) => (
        <article key={product.slug} className="film-panel">
          <div className="film-panel-head">
            <span className="film-panel-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="film-panel-cat">
              {CATEGORY_BY_SLUG[product.category].navLabel}
            </span>
          </div>

          {/* The interface itself, at the size it was drawn for. */}
          {hasVisual(product.slug) && (
            <div className="film-panel-ui">
              <ProductVisual slug={product.slug} />
            </div>
          )}

          <h3 className="film-panel-name">
            <Link href={`/products/${product.slug}/`} className="film-panel-link">
              {product.name}
            </Link>
          </h3>
          <p className="film-panel-tagline">{product.tagline}</p>
        </article>
      ))}
    </>
  );
}
