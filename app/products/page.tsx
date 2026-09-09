import type { Metadata } from "next";
import Link from "next/link";
import { Page, Section, SectionHead } from "@/components/site/Page";
import { RouteHeader } from "@/components/site/RouteHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { Cta } from "@/components/site/Cta";
import { Room } from "@/components/floor/Room";
import { RoomPanels } from "@/components/floor/RoomPanels";
import { FLOOR } from "@/lib/content/floor";
import { PRODUCTS_PAGE, WHAT_WE_DO_PAGE } from "@/lib/content/routes";
import { PRODUCT_ROUTES } from "@/lib/content/product-pages";
import { CATEGORIES } from "@/lib/content/taxonomy";
import { productsByCategory } from "@/lib/content/products";

export const metadata: Metadata = {
  title: PRODUCTS_PAGE.metaTitle,
  description: PRODUCTS_PAGE.metaDescription,
};

/**
 * The product index: eight products, grouped by the practice that owns them.
 *
 * THE THREE PRACTICES GET IDENTICAL TREATMENT. The split is five, two and one — a fact,
 * and not one to hide — but the page must not read as an AI product line with two
 * afterthoughts. So every practice band is built from the same four pieces in the same
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
 * caps the box to the cards it has, so the card in Cloud Services & Testing is the same
 * card at the same size as any of the five above it. That hook is new; the pattern
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

      {/* Outside the stage on purpose. Anything pinned over a floor whose focused panel is
          centred is one short window away from sitting on it, and the instruction is only
          needed once. */}
      <p className="room-hint">{FLOOR.hint}</p>

      <Room look="dark">
        <RoomPanels />
      </Room>

      {CATEGORIES.map((category, index) => {
        const products = productsByCategory(category.slug);
        if (products.length === 0) return null;
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
