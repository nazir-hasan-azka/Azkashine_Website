import Link from "next/link";
import { CTA } from "@/lib/content/about";
import { SITE } from "@/lib/content/site";

/**
 * The block that closes every inner route.
 *
 * It says what a first conversation is actually like — bring the problem, and we will
 * tell you which product fits, what we would have to build, or that you would be better
 * served elsewhere. That last clause is the only sentence on the site a competitor
 * would not print, which is what makes it worth keeping as the last thing read.
 *
 * A LIGHT PANEL, NOT A DARK BAND, from 2026-10-07. It was a full-width `blue-900` band,
 * which made it the one dark band on an inner route — until the About page's values
 * became a dark band too, and the two sat a screen apart and cancelled each other out.
 * The panel also fixes the band's own fault: the copy sat in the left half with the
 * right half empty. Copy left, actions right; stacked on a phone.
 *
 * The email is sales@, because a visitor who has read to the end of a page and wants to
 * talk is a sales enquiry.
 */
export function Cta() {
  return (
    <section aria-labelledby="cta-heading" className="cta">
      <div className="cta-inner">
        <div className="cta-panel reveal-group">
          <div className="cta-copy">
            <h2 id="cta-heading" className="cta-heading">
              {CTA.heading}
            </h2>
            <p className="cta-lede">{CTA.lede}</p>
          </div>
          <div className="cta-actions">
            <Link href={CTA.primary.href} className="cta-btn cta-btn-solid">
              {CTA.primary.label}
              <span aria-hidden="true" className="nudge">
                →
              </span>
            </Link>
            <Link href={CTA.secondary.href} className="cta-btn cta-btn-ghost">
              {CTA.secondary.label}
            </Link>
            <a href={`mailto:${SITE.emails[0].address}`} className="cta-mail">
              {SITE.emails[0].address}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
