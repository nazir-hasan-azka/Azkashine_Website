import { FILM_RUNNING } from "@/lib/content/film";
import { FLOOR } from "@/lib/content/floor";
import { PRODUCTS_IN_RUN_ORDER } from "@/lib/content/products";
import { CATEGORY_BY_SLUG } from "@/lib/content/taxonomy";
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
 * THE ORDER IS `PRODUCTS_IN_RUN_ORDER`, and the argument for it lives on that export in
 * `products.ts`: never more than two of one practice in a row, and never end on the
 * practice that has the most. It was a private array in this file until 2026-09-07, when
 * the floor started running the same eight products past you one at a time and needed the
 * same order — and two copies of an order that carries an argument is two copies that can
 * disagree.
 *
 * THE TRACK ENDS ON THE WAY OUT, not on a product. The last thing the traverse comes to
 * rest on is the link into `/products/`, where all eight stand in one room at once.
 * `.claude/ECOSYSTEM-BRIEF.md` asks for about two screens here — the traverse
 * decelerating, the frame dissolving, the eight settling at different depths — and what
 * is built is the link with a still of that idea behind it. `PLAN.md` records the call.
 */
export function RunningPanels() {
  const products = PRODUCTS_IN_RUN_ORDER;

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

      {/* Three plates at three depths, in CSS and nothing else — a still of what the
          floor at the top of `/products/` does with these same eight products, standing
          where a ninth panel would be. The plates are decoration and are hidden from
          assistive technology; the link under them is the content. */}
      <article className="film-panel film-onward">
        <div aria-hidden="true" className="film-onward-depth">
          <span className="film-onward-plate" data-depth="far" />
          <span className="film-onward-plate" data-depth="mid" />
          <span className="film-onward-plate" data-depth="near" />
        </div>

        <h3 className="film-panel-name">{FLOOR.onward.label}</h3>
        <p className="film-panel-tagline">{FLOOR.onward.line}</p>
        <p className="film-onward-more">
          <Link href="/products/" className="tlink">
            {FLOOR.onward.cta}
            <span aria-hidden="true" className="nudge">
              →
            </span>
          </Link>
        </p>
      </article>
    </>
  );
}
