import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, Section, SectionHead } from "@/components/site/Page";
import { RouteHeader } from "@/components/site/RouteHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { Cta } from "@/components/site/Cta";
import {
  CATEGORIES,
  CATEGORY_BY_SLUG,
  type Category,
  type CategorySlug,
} from "@/lib/content/taxonomy";
import { productsByCategory } from "@/lib/content/products";
import { CLIENT_WORK } from "@/lib/content/client-work";
import { CATEGORY_PAGE, WHAT_WE_DO_PAGE } from "@/lib/content/routes";
import { PRACTICE_PAGES } from "@/lib/content/practice-pages";
import { SITE } from "@/lib/content/site";

type Params = { category: string };

export function generateStaticParams(): Params[] {
  return CATEGORIES.map((category) => ({ category: category.slug }));
}

/**
 * A description long enough to survive a search result, assembled from content rather
 * than written here: the practice's own tagline, then the four capability names the deck
 * gives it. Every practice therefore gets the same treatment and the same length, and no
 * sentence had to be invented in a route file to achieve it.
 */
function describe(category: Category): string {
  return `${category.tagline} ${category.capabilities
    .map((capability) => capability.title)
    .join(", ")}.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORY_BY_SLUG[category as CategorySlug];
  if (!cat) return {};

  const description = describe(cat);
  return {
    title: cat.name,
    description,
    openGraph: { title: `${cat.name} | ${SITE.name}`, description },
  };
}

/**
 * One of the three practices, in full.
 *
 * THE ONLY PLACE `detail` IS PRINTED. The index shows each capability as a name and the
 * deck's one-line descriptor; this page keeps that pair and puts the paragraph under it,
 * which is why the rows here start-align instead of sitting on a shared baseline — a
 * six-line block whose title is pinned to its first line reads as a caption.
 *
 * IDENTICAL FOR ALL THREE. The bands, the ghost word, the order, and the tone
 * alternation are written once and every practice gets them. What varies is only what
 * the practice actually has: five products or one, two delivered platforms or none. The
 * client work band is the one conditional, because printing an empty heading is worse
 * than not printing it.
 *
 * THE THREE ARE NAVIGABLE AS A SET. The band before the close links across to the other
 * two, so a visitor who arrived on Cloud Services & Testing from a search finds the
 * other two practices without going back up to the index.
 */
export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const cat = CATEGORY_BY_SLUG[category as CategorySlug];
  if (!cat) notFound();

  const products = productsByCategory(cat.slug);
  const work = CLIENT_WORK.filter((entry) => entry.category === cat.slug);
  const siblings = CATEGORIES.filter((other) => other.slug !== cat.slug);

  return (
    <Page>
      <RouteHeader
        crumbs={[
          { label: PRACTICE_PAGES.homeCrumb, href: "/" },
          { label: WHAT_WE_DO_PAGE.crumb, href: "/what-we-do/" },
          { label: cat.name },
        ]}
        eyebrow={CATEGORY_PAGE.eyebrow}
        title={cat.name}
        lede={cat.intro}
      />

      <Section tone="paper" labelledBy="capabilities-heading" className="practice">
        {/* The box is reserved by CSS ratio before the file arrives. No CDN sits in
            front of this host, so a banner that lands late and pushes the capabilities
            down is a CLS score the visitor pays for directly. */}
        <div className="banner">
          {/* A plain img, not next/image: `images.unoptimized` is set for the static
              export, so the component would ship a srcset generator to serve the one
              file that exists. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/img/${cat.image}.webp`}
            alt=""
            width={1300}
            height={731}
            loading="lazy"
            decoding="async"
          />
        </div>

        <SectionHead
          id="capabilities-heading"
          title={CATEGORY_PAGE.capabilitiesHeading}
          lede={cat.tagline}
        />

        <ul className="rows rows-detail">
          {cat.capabilities.map((capability, n) => (
            <li key={capability.title} className="row">
              <span aria-hidden="true" className="row-index">
                {String(n + 1).padStart(2, "0")}
              </span>
              <h3 className="row-title">{capability.title}</h3>
              <div className="row-desc">
                <p className="cap-descriptor">{capability.descriptor}</p>
                <p className="cap-detail">{capability.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint" labelledBy="products-heading">
        <SectionHead
          id="products-heading"
          ghost={WHAT_WE_DO_PAGE.productsLabel}
          title={CATEGORY_PAGE.productsHeading}
        />
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

      {work.length > 0 && (
        <Section tone="paper" labelledBy="work-heading">
          <SectionHead
            id="work-heading"
            title={CATEGORY_PAGE.workHeading}
            lede={CATEGORY_PAGE.workLede}
          />
          <div className="works">
            {work.map((entry) => (
              <article key={entry.title} className="work">
                <h3 className="work-title">{entry.title}</h3>
                <p className="work-desc">{entry.description}</p>
                <p className="work-includes">{PRACTICE_PAGES.workIncludesLabel}</p>
                <ul className="pills">
                  {entry.highlights.map((highlight) => (
                    <li key={highlight} className="pill">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* Tone follows whatever band came before, so the paper / tint alternation holds
          on the practice with delivered work and the two without. */}
      <Section
        tone={work.length > 0 ? "tint" : "paper"}
        labelledBy="siblings-heading"
      >
        <SectionHead id="siblings-heading" title={CATEGORY_PAGE.siblingsHeading} />
        <div className="sibs">
          {siblings.map((sibling) => (
            <article key={sibling.slug} className="sib">
              <h3 className="sib-name">
                <Link href={`/what-we-do/${sibling.slug}/`} className="sib-link">
                  {sibling.name}
                </Link>
              </h3>
              <p className="sib-tagline">{sibling.tagline}</p>
              <span aria-hidden="true" className="sib-more tlink">
                {`${WHAT_WE_DO_PAGE.moreOn} ${sibling.name}`}
                <span className="nudge">→</span>
              </span>
            </article>
          ))}
        </div>
      </Section>

      <Cta />
    </Page>
  );
}
