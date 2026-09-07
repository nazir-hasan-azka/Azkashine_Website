import type { Metadata } from "next";
import Link from "next/link";
import { Page, Section, SectionHead } from "@/components/site/Page";
import { RouteHeader } from "@/components/site/RouteHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { Cta } from "@/components/site/Cta";
import { CATEGORIES } from "@/lib/content/taxonomy";
import { productsByCategory } from "@/lib/content/products";
import { CATEGORY_PAGE, WHAT_WE_DO_PAGE } from "@/lib/content/routes";
import { PRACTICE_PAGES } from "@/lib/content/practice-pages";
import { SITE } from "@/lib/content/site";

export const metadata: Metadata = {
  title: WHAT_WE_DO_PAGE.metaTitle,
  description: WHAT_WE_DO_PAGE.metaDescription,
  openGraph: {
    title: `${WHAT_WE_DO_PAGE.metaTitle} | ${SITE.name}`,
    description: WHAT_WE_DO_PAGE.metaDescription,
  },
};

/**
 * The practice index: three practices, four capabilities each, and the products built
 * on top of them.
 *
 * THREE SECTIONS, ONE SHAPE. Every practice gets the same eyebrow, the same heading
 * size, the same four rows, and the same product block — including the practice whose
 * product block is a single sentence saying there is no product yet. The split is
 * 5 / 2 / 1 and that is a fact about the product line, not a ranking of the practices,
 * so nothing here varies with the count. The map is what enforces it: there is one
 * section written, rendered three times, and no way for one to drift.
 *
 * The tone alternates paper / tint / paper. That is legibility on a long page, not
 * emphasis — `.claude/rules/styles.md` and the bands in `globals.css` both read it that
 * way, and the middle practice is not the highlighted one.
 *
 * NO GHOST WORD ON THIS PAGE. `SectionHead`'s watermark is powerful enough that two per
 * page is the ceiling, and there are three sections here that have to look identical.
 * Two of three would be a hierarchy; three would be noise. The practice pages spend the
 * one use each.
 */
export default function WhatWeDoPage() {
  return (
    <Page>
      <RouteHeader
        crumbs={[
          { label: PRACTICE_PAGES.homeCrumb, href: "/" },
          { label: WHAT_WE_DO_PAGE.crumb },
        ]}
        title={WHAT_WE_DO_PAGE.title}
        lede={WHAT_WE_DO_PAGE.lede}
      />

      {CATEGORIES.map((cat, index) => {
        const products = productsByCategory(cat.slug);
        const headingId = `practice-${cat.slug}`;

        return (
          <Section
            key={cat.slug}
            id={cat.slug}
            tone={index % 2 === 0 ? "paper" : "tint"}
            labelledBy={headingId}
            className="practice"
          >
            <SectionHead
              id={headingId}
              eyebrow={PRACTICE_PAGES.practiceEyebrow}
              title={cat.name}
              lede={cat.tagline}
            />

            <p className="practice-intro">{cat.intro}</p>

            <h3 className="block-label">{CATEGORY_PAGE.capabilitiesHeading}</h3>
            <ul className="rows">
              {cat.capabilities.map((capability, n) => (
                <li key={capability.title} className="row">
                  <span aria-hidden="true" className="row-index">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <h4 className="row-title">{capability.title}</h4>
                  <p className="row-desc">{capability.descriptor}</p>
                </li>
              ))}
            </ul>

            {/* One link per practice rather than one per capability. Four anchors to the
                same page, three sections deep, is twelve identical destinations in the
                tab order for no gain. */}
            <p className="practice-more">
              <Link href={`/what-we-do/${cat.slug}/`} className="tlink">
                {`${WHAT_WE_DO_PAGE.moreOn} ${cat.name}`}
                <span aria-hidden="true" className="nudge">
                  →
                </span>
              </Link>
            </p>

            <h3 className="block-label">{WHAT_WE_DO_PAGE.productsLabel}</h3>
            {products.length > 0 ? (
              <div className="pgrid">
                {products.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <p className="practice-note">{WHAT_WE_DO_PAGE.noProducts}</p>
            )}
          </Section>
        );
      })}

      <Cta />
    </Page>
  );
}
