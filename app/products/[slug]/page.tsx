import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, Section, SectionHead } from "@/components/site/Page";
import { RouteHeader } from "@/components/site/RouteHeader";
import { ProductVisual, hasVisual } from "@/components/product-ui/ProductVisual";
import { PRODUCTS_PAGE, PRODUCT_PAGE } from "@/lib/content/routes";
import { PRODUCT_ROUTES } from "@/lib/content/product-pages";
import { CATEGORY_BY_SLUG } from "@/lib/content/taxonomy";
import { PRODUCT_SLUGS, getProduct } from "@/lib/content/products";
import { SITE } from "@/lib/content/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: `${product.name} | ${SITE.name}`,
      description: product.tagline,
    },
  };
}

/**
 * One template for all eight products.
 *
 * THE SECTION ORDER IS FIXED — problem, measured, what it does, outcomes, coverage,
 * walkthrough, provenance — so eight pages read as one product line rather than eight
 * one-offs. A section with no content is OMITTED, never padded: three products have no
 * business outcomes in their deck and five have no coverage, and inventing either would
 * break the claims rule the whole site is built on.
 *
 * THE CODED INTERFACE GETS THE LARGER HALF OF THE BAND. `components/product-ui/` draws
 * a real Azkashine product UI in markup, and the brief's second finding about the old
 * site is that it was buried — one route, sidebar width, below the fold. Here it sits
 * beside the problem it answers at roughly 680px on a 1440 screen, which is where a
 * reader is looking when they have just read what the product is for. It is capped
 * rather than uncapped; see the note in `app/styles/products.css` for why.
 *
 * THE DEEP BLUE APPEARS ONCE, on the walkthrough panel. The stats band could have taken
 * it and does not, because only two of the eight products have a figure and a page with
 * a number must not read as louder than the six without one.
 */
export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = CATEGORY_BY_SLUG[product.category];
  const stats = product.stats ?? [];
  const coverage = product.coverage;

  /**
   * Bands alternate paper and tint in the order they ACTUALLY render. Keying the tone
   * off a fixed section index instead would leave two identical grounds touching on the
   * five products that skip a section.
   */
  const rendered: string[] = [
    "problem",
    ...(stats.length > 0 ? ["stats"] : []),
    "features",
    ...(product.outcomes.length > 0 ? ["outcomes"] : []),
    ...(coverage ? ["coverage"] : []),
  ];
  const bandTone: Record<string, "paper" | "tint"> = Object.fromEntries(
    rendered.map((name, i): [string, "paper" | "tint"] => [
      name,
      i % 2 === 0 ? "paper" : "tint",
    ]),
  );

  return (
    <Page>
      <RouteHeader
        crumbs={[
          { label: PRODUCT_ROUTES.crumbHome, href: "/" },
          { label: PRODUCTS_PAGE.crumb, href: "/products/" },
          { label: product.name },
        ]}
        eyebrow={category.name}
        title={product.name}
        lede={product.tagline}
      />

      {/* The problem before the solution, and the interface beside it — so the reader
          can see the thing being described rather than only read about it. */}
      <Section id="problem" tone={bandTone.problem} labelledBy="problem-heading">
        <SectionHead
          id="problem-heading"
          ghost={PRODUCT_ROUTES.ghostProblem}
          title={PRODUCT_PAGE.problemHeading}
        />

        <div className="pp-split reveal-group">
          <div className="pp-copy">
            <p className="pp-lead">{product.problem}</p>
            <p className="pp-body">{product.summary}</p>
          </div>

          {hasVisual(product.slug) && (
            <figure className="pp-figure">
              <ProductVisual slug={product.slug} />
              {/* The frames are drawn in code, not captured. Saying so is the
                  difference between an illustration and a false claim about a
                  customer's live data. */}
              <figcaption className="pp-figcap">
                {PRODUCT_PAGE.visualCaption}
              </figcaption>
            </figure>
          )}
        </div>
      </Section>

      {stats.length > 0 && (
        <Section
          id="measured"
          tone={bandTone.stats}
          labelledBy="measured-heading"
          className="pp-measured"
        >
          <h2 id="measured-heading" className="pp-kicker">
            {PRODUCT_ROUTES.statsHeading}
          </h2>
          <ul className="pp-stats reveal-group">
            {stats.map((stat) => (
              <li key={stat.label} className="pp-stat">
                <p className="pp-stat-value">{stat.value}</p>
                <p className="pp-stat-label">{stat.label}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        id="what-it-does"
        tone={bandTone.features}
        labelledBy="what-it-does-heading"
      >
        <SectionHead
          id="what-it-does-heading"
          title={PRODUCT_PAGE.whatItDoesHeading}
        />
        <ol className="rows">
          {product.features.map((feature, i) => (
            <li key={feature.title} className="row">
              <span aria-hidden="true" className="row-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="row-title">{feature.title}</h3>
              <p className="row-desc">{feature.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      {product.outcomes.length > 0 && (
        <Section
          id="outcomes"
          tone={bandTone.outcomes}
          labelledBy="outcomes-heading"
        >
          <SectionHead
            id="outcomes-heading"
            ghost={PRODUCT_ROUTES.ghostOutcomes}
            title={PRODUCT_PAGE.outcomesHeading}
          />
          <ol className="rows">
            {product.outcomes.map((outcome, i) => (
              <li key={outcome.title} className="row">
                <span aria-hidden="true" className="row-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="row-title">{outcome.title}</h3>
                <p className="row-desc">{outcome.description}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {coverage && (
        <Section
          id="coverage"
          tone={bandTone.coverage}
          labelledBy="coverage-heading"
        >
          <SectionHead id="coverage-heading" title={coverage.heading} />
          <div className="pp-groups reveal-group">
            {coverage.groups.map((group) => (
              <div key={group.label} className="pp-group">
                <h3 className="pp-group-label">{group.label}</h3>
                <ul className="pills">
                  {group.items.map((item) => (
                    <li key={item} className="pill">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* The one saturated band on the route. `demoUrl` is null on all eight today, so
          the second button is a code path with no page behind it yet — which is why the
          primary action is a conversation and not a dead link to a demo. */}
      <Section id="walkthrough" tone="deep" labelledBy="walkthrough-heading">
        <SectionHead
          id="walkthrough-heading"
          title={`${product.name} ${PRODUCT_PAGE.demoHeading}`}
          lede={PRODUCT_PAGE.demoLede}
        />
        <div className="pp-actions">
          <Link href="/contact/" className="cta-btn cta-btn-solid">
            {PRODUCT_PAGE.demoPrimary}
            <span aria-hidden="true" className="nudge">
              →
            </span>
          </Link>
          {product.demoUrl && (
            <a href={product.demoUrl} className="cta-btn cta-btn-ghost">
              {PRODUCT_PAGE.demoTry}
            </a>
          )}
        </div>
      </Section>

      {/* Where the page came from: the practice it belongs to, the capability it sits
          under, and the deck page every claim above is traceable to. */}
      <Section id="provenance" tone="paper" className="pp-prov">
        <ul className="pp-prov-list">
          <li className="pp-prov-item">
            <span className="pp-prov-tag">{PRODUCT_PAGE.partOf}</span>
            <Link
              href={`/what-we-do/${category.slug}/`}
              className="pp-prov-link"
            >
              {category.name}
            </Link>
          </li>
          <li className="pp-prov-item">
            <span className="pp-prov-tag">
              {PRODUCT_ROUTES.capabilityLabel}
            </span>
            <span className="pp-prov-value">{product.capability}</span>
          </li>
        </ul>
      </Section>
    </Page>
  );
}
