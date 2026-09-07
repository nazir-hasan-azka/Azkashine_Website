import type { Metadata } from "next";
import { Page, Section, SectionHead } from "@/components/site/Page";
import { RouteHeader } from "@/components/site/RouteHeader";
import { Cta } from "@/components/site/Cta";
import { ABOUT } from "@/lib/content/about";
import {
  AT_A_GLANCE,
  CHAIRMAN,
  MISSION,
  SITE,
  VALUES,
  VISION,
} from "@/lib/content/site";
import { ABOUT_GHOST, CRUMB_HOME } from "@/lib/content/company-pages";

export const metadata: Metadata = {
  title: ABOUT.metaTitle,
  description: ABOUT.metaDescription,
};

/**
 * About.
 *
 * Four bands: the executive summary, the vision and mission pair, the values, and the
 * Chairman's note. Every fact on the page comes out of `site.ts`, where each block
 * carries the deck page it was taken from — nothing here is written for the web.
 *
 * TWO NOTES CARRIED ACROSS from `lib/content/about.ts`, because they are decisions and
 * would be lost the moment somebody looked only at this file:
 *
 *   - The `about-meeting` banner under the Chairman's note is deliberately
 *     ARCHITECTURE, NOT A PERSON. What belongs in that slot is a portrait of the
 *     Chairman. It is a placeholder waiting on one being supplied, not a design choice
 *     to preserve.
 *   - `VALUES` titles are Title Case ("Trusted Team", "Customer Centric") against the
 *     site's sentence-case rule. They are verbatim from deck p3 and are treated as
 *     names rather than headings. Worth a word from Nazir; not worth silently editing
 *     a deck.
 *
 * The ghost watermark is used exactly twice, on values and on the note — the two bands
 * with no banner. `SectionHead`'s ghost is texture, and a page that runs it on every
 * heading has no texture, only noise.
 */
export default function AboutPage() {
  return (
    <Page>
      <RouteHeader
        crumbs={[{ label: CRUMB_HOME, href: "/" }, { label: ABOUT.crumb }]}
        title={ABOUT.title}
        lede={ABOUT.lede}
      />

      <Section tone="paper" labelledBy="glance-heading">
        <div className="split" data-media="right">
          <div className="split-media">
            <div className="frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/corporate.webp"
                alt=""
                width={1600}
                height={900}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="split-body">
            <SectionHead id="glance-heading" title={ABOUT.glanceHeading} />
            <ul className="glance reveal-group">
              {AT_A_GLANCE.map((line, i) => (
                <li key={line}>
                  <span aria-hidden="true" className="glance-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* The visible headings here are the two h3s. "Vision and mission" is a heading
          for the outline and for the section's accessible name, and saying it on screen
          above two labels that already say it would be the third time in four lines. */}
      <Section tone="tint" labelledBy="vision-mission-heading">
        <h2 id="vision-mission-heading" className="sr-only">
          {ABOUT.visionMissionHeading}
        </h2>
        <div className="vm reveal-group">
          <div className="vm-item">
            <h3 className="vm-title">{ABOUT.visionHeading}</h3>
            <p className="vm-text">{VISION}</p>
          </div>
          <div className="vm-item">
            <h3 className="vm-title">{ABOUT.missionHeading}</h3>
            <p className="vm-text">{MISSION}</p>
          </div>
        </div>
      </Section>

      <Section tone="paper" labelledBy="values-heading">
        <SectionHead
          id="values-heading"
          ghost={ABOUT_GHOST.values}
          title={ABOUT.valuesHeading}
        />
        <div className="rows reveal-group">
          {VALUES.map((value, i) => (
            <div key={value.title} className="row">
              <span aria-hidden="true" className="row-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="row-title">{value.title}</h3>
              <p className="row-desc">{value.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="tint" labelledBy="chairman-heading">
        <div className="split" data-media="right">
          <div className="split-media">
            {/* PLACEHOLDER, and deliberately architecture rather than a person — see the
                note at the top of this file and in `lib/content/about.ts`. A portrait of
                the Chairman is what belongs here once one is supplied. */}
            <div className="frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/about-meeting.webp"
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
              id="chairman-heading"
              ghost={ABOUT_GHOST.chairman}
              title={ABOUT.chairmanHeading}
            />
            <div className="copy note">
              {CHAIRMAN.note.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="note-tagline">{CHAIRMAN.tagline}</p>
            <div className="note-by">
              <p className="note-name">{CHAIRMAN.name}</p>
              {/* Two lines rather than one joined by a separator: a punctuation mark
                  invented in a route is still a route inventing copy. */}
              <p className="note-role">{CHAIRMAN.title}</p>
              <p className="note-role">{CHAIRMAN.location}</p>
              <p className="note-org">{SITE.legalName}</p>
            </div>
          </div>
        </div>
      </Section>

      <Cta />
    </Page>
  );
}
