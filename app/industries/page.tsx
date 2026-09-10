import type { Metadata } from "next";
import Link from "next/link";
import { Page, Section, SectionHead } from "@/components/site/Page";
import { RouteHeader } from "@/components/site/RouteHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { Cta } from "@/components/site/Cta";
import { INDUSTRIES } from "@/lib/content/industries";
import { CATEGORY_BY_SLUG } from "@/lib/content/taxonomy";
import { getProduct } from "@/lib/content/products";
import { INDUSTRIES_PAGE } from "@/lib/content/routes";
import { CRUMB_HOME } from "@/lib/content/company-pages";

export const metadata: Metadata = {
  title: INDUSTRIES_PAGE.metaTitle,
  description: INDUSTRIES_PAGE.metaDescription,
};

/**
 * Industries — ONE page with four anchored sections, not four routes.
 *
 * The footer already links `/industries/#telecom` and the three beside it. Building
 * these as `/industries/telecom/` would leave four dead links in the footer of every
 * page on the site, which is exactly the failure `tests/links.mjs` exists to catch. The
 * sections carry `.anchor` so a jump lands clear of the 5rem sticky header.
 *
 * THE PRACTICE IS THE EYEBROW, and that is the whole argument of the page. Azkashine
 * does three things in equal measure, and the four sectors do not all lead with the
 * same one — telecom and energy come in through Cloud Services & Testing, public sector
 * through Digital Platforms, manufacturing through AI & Automation. Naming the practice
 * above each sector's name is what makes that spread visible instead of implied; every
 * sector otherwise reads as a variation on the same sell.
 *
 * The banner alternates sides and the ground alternates paper and tint, so four
 * structurally identical sections do not read as one long one. No ghost word here —
 * `SectionHead`'s watermark is worth at most twice on a page and there are four
 * headings, so using it would either be noise or arbitrary.
 */
export default function IndustriesPage() {
  return (
    <Page>
      <RouteHeader
        crumbs={[
          { label: CRUMB_HOME, href: "/" },
          { label: INDUSTRIES_PAGE.crumb },
        ]}
        title={INDUSTRIES_PAGE.title}
        lede={INDUSTRIES_PAGE.lede}
      />

      {INDUSTRIES.map((industry, i) => {
        const practice = CATEGORY_BY_SLUG[industry.primaryCategory];
        // One pass, and no type predicate: `?? []` drops a slug with no product behind
        // it and leaves `Product[]` without a cast.
        const products = industry.products.flatMap(
          (slug) => getProduct(slug) ?? [],
        );
        const headingId = `${industry.slug}-heading`;

        return (
          <Section
            key={industry.slug}
            id={industry.slug}
            tone={i % 2 === 0 ? "paper" : "tint"}
            labelledBy={headingId}
            className="anchor"
          >
            <div
              className="split"
              data-media={i % 2 === 0 ? "left" : "right"}
            >
              <div className="split-media">
                <div className="frame">
                  {/* Decoration, so the alt is empty: the section's own heading and
                      intro already say what the sector is. Plain `<img>` rather than
                      `next/image` because `images.unoptimized` is set for the static
                      export — the component would ship JavaScript and emit no srcset.
                      The dimensions state the 16:9 the `.frame` reserves; every banner
                      in `/public/img` is cut to it, and CSS sizes the box. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/img/${industry.image}.webp`}
                    alt=""
                    width={1600}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="split-body">
                <SectionHead
                  id={headingId}
                  eyebrow={practice.navLabel}
                  title={industry.name}
                  lede={industry.tagline}
                />

                <p className="copy">{industry.intro}</p>

                <div className="page-block">
                  <h3 className="subhead">
                    {INDUSTRIES_PAGE.capabilitiesHeading}
                  </h3>
                  <ul className="pills">
                    {industry.capabilities.map((capability) => (
                      <li key={capability} className="pill">
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tlink-row">
                  <Link
                    href={`/what-we-do/${industry.primaryCategory}/`}
                    className="tlink"
                  >
                    {INDUSTRIES_PAGE.practiceLink}
                    <span aria-hidden="true" className="nudge">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {products.length > 0 && (
              <div className="ind-products">
                <h3 className="subhead">{INDUSTRIES_PAGE.productsHeading}</h3>
                <div className="pgrid">
                  {products.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              </div>
            )}
          </Section>
        );
      })}

      <Cta />
    </Page>
  );
}
