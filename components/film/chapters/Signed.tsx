import Link from "next/link";
import { FILM_SIGNED } from "@/lib/content/film";
import { INDUSTRIES } from "@/lib/content/industries";
import { Clients } from "@/components/sections/Clients";
import { TraceEnd } from "@/components/film/TraceEnd";
import { ChapterMark } from "@/components/film/Beat";

/**
 * CHAPTER 06 — SIGNED. Industries, partners, the closing mark, and the way out.
 *
 * IT IS NOT A SCENE, and that is the decision worth recording. Every other chapter is a
 * pinned stage with a duration; this one is an ordinary block that scrolls at the speed
 * of the page. `DIRECTION.md` calls the move "quiet" and gives it "almost no motion" —
 * and after five pinned chapters, the thing that reads as an ending is the film letting
 * go of the scroll and handing it back. A sixth stage that also held would just be a
 * fifth stage.
 *
 * A Server Component, therefore, with no `--p` and nothing registered.
 *
 * THE PARTNER ROW IS `Clients.tsx` UNCHANGED. It was built, measured logo by logo and
 * signed off on 2026-09-06 — full colour, centred, a fluid clamp per mark so all five
 * scale by one factor. Re-implementing it for the film would mean re-deriving five
 * optical heights that are already correct.
 *
 * `TraceEnd` is where the line stops. Without it the hairline runs off the bottom of the
 * last section and through the footer, which is not a line that finished — it is a line
 * somebody forgot to stop.
 */
export function Signed() {
  return (
    <section aria-labelledby="signed-heading" className="film-signed">
      <div className="film-signed-inner">
        <ChapterMark number={FILM_SIGNED.chapter} title={FILM_SIGNED.title} />

        <h2 id="signed-heading" className="film-heading reveal">
          {FILM_SIGNED.heading}
        </h2>

        {/* The four sectors, as names on the line rather than as another card grid.
            They link into the anchors on the industries page, which is how the footer
            already links them. */}
        <ul className="film-sectors reveal-group">
          {INDUSTRIES.map((industry) => (
            <li key={industry.slug}>
              <Link href={`/industries/#${industry.slug}`} className="film-sector">
                <span className="film-sector-name">{industry.name}</span>
                <span className="film-sector-line">{industry.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Clients />

      <div className="film-signed-inner film-signed-close">
        {/* THE MARK. The trace terminates here and stops — the only other place on the
            site `blue-900` is allowed, and the reason the gate's mark carries weight. */}
        <TraceEnd />

        <p className="film-closing reveal">{FILM_SIGNED.closing}</p>

        <div className="film-signed-actions">
          <Link href={FILM_SIGNED.cta.href} className="cta-btn cta-btn-solid">
            {FILM_SIGNED.cta.label}
            <span aria-hidden="true" className="nudge">
              →
            </span>
          </Link>
          <Link href={FILM_SIGNED.secondary.href} className="film-signed-secondary">
            {FILM_SIGNED.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
