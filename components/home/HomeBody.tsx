import Link from "next/link";
import { Hero } from "@/components/hero/Hero";
import { Section, SectionHead } from "@/components/site/Page";
import { Cta } from "@/components/site/Cta";
import { Clients } from "@/components/sections/Clients";
import { TraceCanvas } from "@/components/film/TraceCanvas";
import { TraceEnd } from "@/components/film/TraceEnd";
import { Running } from "@/components/film/chapters/Running";
import { RunningPanels } from "@/components/film/chapters/RunningPanels";
import { HOME_PAGE } from "@/lib/content/home";
import { CATEGORIES } from "@/lib/content/taxonomy";
import { INDUSTRIES } from "@/lib/content/industries";
import { SERVICES } from "@/lib/content/services";

/**
 * The home page, as an enterprise site: the hero, then six sections that scroll like
 * every other page. Rebuilt 2026-10-07 to replace the scroll film (`components/film/`),
 * which held the scroll for most of its 29 desktop screens.
 *
 * Built from the same `Section` / `SectionHead` furniture as the inner routes, so it
 * spaces and reads like the rest of the site. Governance had a dark band of its own
 * until Nazir folded it into "Why Azkashine" as a fourth point (2026-10-07).
 *
 * TWO PIECES OF THE FILM STAY, at Nazir's request: the trace — the line that leaves the
 * hero and runs down the gutter as you scroll, ending at a mark before the partners —
 * and the products' sideways traverse with its full-size interfaces. The traverse holds
 * the scroll for 4 screens rather than the film's 8, and never on a phone.
 */

const TINTS = ["cyan", "blue"] as const;

/** "a, b, c and d" — a list read as a sentence. */
function listOf(items: string[]): string {
  return items.length < 2
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

export function HomeBody() {
  return (
    <div className="film">
      <TraceCanvas />
      <Hero />

      {/* What we do — the two practices, side by side. */}
      <Section tone="paper" labelledBy="hp-what">
        <SectionHead
          id="hp-what"
          eyebrow={HOME_PAGE.whatWeDo.eyebrow}
          title={HOME_PAGE.whatWeDo.title}
        />
        <div className="hp-practices reveal-group">
          {CATEGORIES.map((category, i) => (
            <article
              key={category.slug}
              className="hp-practice"
              data-tint={TINTS[i % 2]}
            >
              <h3 className="hp-practice-name">{category.name}</h3>
              <p className="hp-practice-tagline">{category.tagline}</p>
              <dl className="hp-caps">
                {category.capabilities.map((c) => (
                  <div key={c.title} className="hp-cap">
                    <dt>{c.title}</dt>
                    <dd>{c.descriptor}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href={`/what-we-do/${category.slug}/`}
                className="tlink hp-more"
              >
                {`${HOME_PAGE.whatWeDo.more} ${category.name}`}
                <span aria-hidden="true" className="nudge">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </Section>

      {/* Products — the sideways traverse, with the interfaces at full size. The
            panels are passed in so they stay server-rendered. */}
      <Running screens={4}>
        <RunningPanels eyebrow={HOME_PAGE.products.eyebrow} />
      </Running>

      {/* Why Azkashine — three points, each a fact. */}
      <Section tone="paper" labelledBy="hp-why">
        <SectionHead
          id="hp-why"
          eyebrow={HOME_PAGE.why.eyebrow}
          title={HOME_PAGE.why.title}
        />
        <div className="hp-why reveal-group">
          {HOME_PAGE.why.points.map((p) => (
            <div key={p.title} className="hp-why-point">
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Services — each links into its section of the Services page; the industries
            follow as one line. */}
      <Section tone="tint" labelledBy="hp-services">
        <SectionHead
          id="hp-services"
          eyebrow={HOME_PAGE.services.eyebrow}
          title={HOME_PAGE.services.title}
        />
        <ul className="hp-sectors reveal-group">
          {SERVICES.map((service) => (
            <li key={service.slug}>
              <Link href={`/services/#${service.slug}`} className="hp-sector">
                <span className="hp-sector-name">{service.name}</span>
                <span className="hp-sector-line">{service.line}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="hp-industries">
          {`${HOME_PAGE.services.industriesLead} ${listOf(INDUSTRIES.map((i) => i.name.toLowerCase()))}.`}
        </p>
      </Section>

      {/* Where the line stops: a mark before the partners, so it does not run on
            through the footer. */}
      <TraceEnd />
      <Clients />
      <Cta />
    </div>
  );
}
