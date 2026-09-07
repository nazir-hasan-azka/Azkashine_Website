import { FILM_RUNNING } from "@/lib/content/film";
import { PRODUCTS, type Product } from "@/lib/content/products";
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
 * THE ORDER IS SET BY HAND, AND THE REASONING IS ON `PANEL_ORDER` BELOW. In file order
 * a visitor passes five AI products before seeing anything else and reasonably concludes
 * this is an AI company with two side projects. The split is a fact either way; what
 * changes is whether it reads as a spread or as a monoculture.
 *
 * EVERY PANEL SHOWS ITS SOURCE — signature moment 03 in `DIRECTION.md`, and the reason
 * `deckPage` has been carried on every product since the content layer was written.
 */

/**
 * The order the eight products travel past in, and it is not the file's order or a
 * round-robin.
 *
 * ROUND-ROBIN WAS WRONG AND IT TOOK SOMEBODY LOOKING AT IT TO SEE WHY. The split is five
 * AI & Automation, two Digital Platforms, one Cloud Services & Testing. Cycling the three
 * buckets spends the two smaller ones immediately — Cloud Orchestration landed third and
 * there was nothing left of its practice afterwards — so the run finished
 * AI, AI, AI and the last thing anybody saw was three AI products in a row. The balance
 * was all at the front and the impression was all at the back.
 *
 * SO THE TWO NON-AI PRACTICES ARE SPACED TO BREAK THE RUN, and the single Cloud product
 * goes LAST. Nothing is buried by that: in a horizontal traverse the final panel is the
 * one the scroll comes to rest on, which is the strongest position on the track, and it
 * is the only one of the eight that can end the chapter on a practice other than AI.
 *
 * The rule this encodes, for whoever adds a ninth product: never more than two from the
 * same practice in a row, and never end on the practice that has the most.
 */
const PANEL_ORDER = [
  "savant-ai", // AI & Automation
  "ethics-intelligence", // Digital Platforms
  "tawthiq", // AI & Automation
  "agentos", // AI & Automation
  "prosiddhi", // Digital Platforms
  "agent-siddhi", // AI & Automation
  "smart-ai-assistant", // AI & Automation
  "cloud-orchestration", // Cloud Services & Testing — the note above says why it is last
];

function interleaved(): Product[] {
  const byOrder = PANEL_ORDER.map((slug) =>
    PRODUCTS.find((p) => p.slug === slug),
  ).filter((p): p is Product => p !== undefined);
  /* Anything not named above still travels — a product added to `products.ts` and
     forgotten here appears at the end rather than silently vanishing off the page. */
  const rest = PRODUCTS.filter((p) => !PANEL_ORDER.includes(p.slug));
  return [...byOrder, ...rest];
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
