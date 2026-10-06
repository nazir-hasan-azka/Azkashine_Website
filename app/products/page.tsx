import type { Metadata } from "next";
import Link from "next/link";
import { Page, Section, SectionHead } from "@/components/site/Page";
import { RouteHeader } from "@/components/site/RouteHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { Cta } from "@/components/site/Cta";
import { Room } from "@/components/floor/Room";
import { RoomPanels } from "@/components/floor/RoomPanels";
import { PRODUCTS_PAGE, WHAT_WE_DO_PAGE } from "@/lib/content/routes";
import { PRODUCT_ROUTES } from "@/lib/content/product-pages";
import { CATEGORIES } from "@/lib/content/taxonomy";
import { productsByCategory, upcomingByCategory } from "@/lib/content/products";

export const metadata: Metadata = {
  title: PRODUCTS_PAGE.metaTitle,
  description: PRODUCTS_PAGE.metaDescription,
};

/**
 * The product index: the live products, grouped by the practice that owns them, with the
 * ones coming soon listed under each practice's grid.
 *
 * THE PRACTICES GET IDENTICAL TREATMENT. The split is five and two — a fact, and not one
 * to hide — but the page must not read as an AI product line with an afterthought. So every practice band is built from the same four pieces in the same
 * order: heading, tagline, the card grid, the link into the practice. No band gets an
 * extra flourish, and none gets a ghost word the others do not have.
 *
 * THE FLOOR OPENS IT, AND THE GRID IS UNCHANGED UNDERNEATH. Added 2026-09-09, when
 * `/ecosystem/` was deleted and its scene moved here. Two things settled it: that route's
 * own second half was a plain list of the eight products, which is what this page already
 * is — so the site was carrying two product indexes — and this page showed NONE of the
 * eight interfaces. It is the page a buyer opens to see what Azkashine sells and it was
 * four thousand pixels of text cards. `BRIEF.md` calls the buried interfaces fault #2 of
 * the site this one replaces; a route behind a word nobody would navigate to is a quieter
 * version of the same burial.
 *
 * THE ORDER IS DELIBERATE: room, then grid. A buyer landing on Products should see the
 * products before reading about them. The cost is that the comparison grid starts seven
 * screens down, which is why the scene is eight screens rather than the twelve it was
 * built at — see the note on `--screens` in `Room.tsx`, which is the one number to change.
 *
 * The one thing that could not stay identical is the grid itself. `.pgrid` fills with
 * `auto-fill`, so a practice with one product would leave two empty tracks — and with a
 * 1px gap over a filled background, an empty track paints as a solid slab. `data-count`
 * caps the box to the cards it has, so a practice with two products shows two cards at
 * the same size as the five above them.
 *
 * COMING SOON, from 2026-10-06. Announced products get a card with a name, the practice,
 * one line and a tag, and no link: there is no page behind them yet, and a card that
 * looks clickable and goes nowhere is the fault `tests/links.mjs` exists to catch. That hook is new; the pattern
 * follows `.band[data-tone]` in `globals.css` rather than inventing a second one.
 */
export default function ProductsPage() {
  return (
    <Page>
      <RouteHeader
        crumbs={[
          { label: PRODUCT_ROUTES.crumbHome, href: "/" },
          { label: PRODUCTS_PAGE.crumb },
        ]}
        title={PRODUCTS_PAGE.title}
        lede={PRODUCTS_PAGE.lede}
      />

      <Room look="dark">
        <RoomPanels />
      </Room>

      {CATEGORIES.map((category, index) => {
        const products = productsByCategory(category.slug);
        const upcoming = upcomingByCategory(category.slug);
        if (products.length === 0 && upcoming.length === 0) return null;
        const headingId = `${category.slug}-heading`;

        return (
          <Section
            key={category.slug}
            id={category.slug}
            tone={index % 2 === 1 ? "tint" : "paper"}
            labelledBy={headingId}
          >
            <SectionHead
              id={headingId}
              title={category.name}
              lede={category.tagline}
            />

            <div className="pgrid" data-count={products.length}>
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>

            {upcoming.length > 0 && (
              <div className="pgrid pp-soon" data-count={upcoming.length}>
                {upcoming.map((product) => (
                  <article key={product.name} className="pcard">
                    <div className="pcard-top">
                      <span className="pcard-cat">{category.navLabel}</span>
                      <span className="pp-soon-tag">{PRODUCTS_PAGE.comingSoon}</span>
                    </div>
                    <h3 className="pcard-name">{product.name}</h3>
                    <p className="pcard-tagline">{product.tagline}</p>
                  </article>
                ))}
              </div>
            )}

            <p className="pp-more">
              <Link href={`/what-we-do/${category.slug}/`} className="tlink">
                {`${WHAT_WE_DO_PAGE.moreOn} ${category.name}`}
                <span aria-hidden="true" className="nudge">
                  →
                </span>
              </Link>
            </p>
          </Section>
        );
      })}

      <Cta />
    </Page>
  );
}
