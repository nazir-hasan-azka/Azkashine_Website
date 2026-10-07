import type { CSSProperties } from "react";
import { Page, Section, SectionHead } from "@/components/site/Page";
import { RouteHeader } from "@/components/site/RouteHeader";
import { Cta } from "@/components/site/Cta";
import { ABOUT } from "@/lib/content/about";
import { AT_A_GLANCE, CHAIRMAN, MISSION, VALUES, VISION } from "@/lib/content/site";
import { ABOUT_GHOST, CRUMB_HOME } from "@/lib/content/company-pages";

/**
 * The About page.
 *
 * Four bands: the executive summary, the vision and mission pair, the values, and the
 * Chairman's note. Every fact on the page comes out of `site.ts`, where each block
 * carries the deck page it was taken from — nothing here is written for the web.
 *
 * THE VALUES ARE THE TRACE, chosen by Nazir on 2026-10-07 over a large-type statement
 * and a row of tinted tiles, which were built, compared in place and deleted.
 */

const n = (i: number) => String(i + 1).padStart(2, "0");

/**
 * The site's own line, run through the five values. Horizontal from 1024px, vertical
 * below, where five stops across a phone would be too narrow to read. It is the only
 * dark band on the page; the closing panel was made light so it stays that way.
 */
function Values() {
  return (
    <Section tone="deep" labelledBy="values-heading">
      <SectionHead id="values-heading" ghost={ABOUT_GHOST.values} title={ABOUT.valuesHeading} />
      <ol className="val-rail reveal-group" style={{ "--n": VALUES.length } as CSSProperties}>
        {VALUES.map((v, i) => (
          <li key={v.title} className="val-stop">
            <span aria-hidden="true" className="val-dot" />
            <span aria-hidden="true" className="val-n">
              {n(i)}
            </span>
            <h3 className="val-name">{v.title}</h3>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/**
 * The Chairman's note. EDITORIAL: a panel in the photograph's own grey with the portrait
 * standing in its foot, so the photo reads as a feature rather than a picture dropped
 * beside text — the fault in the first placement (2026-10-06). The panel stretches to
 * the note's height on a wide screen, so the two columns end together.
 */
function Chairman() {
  return (
    <Section tone="tint" labelledBy="chairman-heading">
      <div className="chair">
        <figure className="chair-panel">
          <figcaption className="chair-who">
            <span className="chair-name">{CHAIRMAN.name}</span>
            <span className="chair-role">{CHAIRMAN.title}</span>
            <span className="chair-role">{CHAIRMAN.location}</span>
          </figcaption>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="chair-photo"
            src="/img/chairman.webp"
            alt={`${CHAIRMAN.name}, ${CHAIRMAN.title}`}
            width={960}
            height={1200}
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="chair-body">
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
        </div>
      </div>
    </Section>
  );
}

export function AboutBody() {
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
                    {n(i)}
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

      <Values />
      <Chairman />
      <Cta />
    </Page>
  );
}
