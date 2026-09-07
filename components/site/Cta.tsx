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
 * `blue-900`, and it is the only saturated band on an inner route. Same scarcity rule
 * the film runs on: the deep blue means something because it is almost never used.
 */
export function Cta() {
  return (
    <section aria-labelledby="cta-heading" className="cta">
      <div className="cta-inner reveal-group">
        <h2 id="cta-heading" className="cta-heading">
          {CTA.heading}
        </h2>
        <p className="cta-lede">{CTA.lede}</p>
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
          <a href={`mailto:${SITE.email}`} className="cta-mail">
            {SITE.email}
          </a>
        </div>
      </div>
    </section>
  );
}
