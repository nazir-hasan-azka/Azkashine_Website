import { ScrollScene } from "@/components/film/ScrollScene";
import { FILM_WHY } from "@/lib/content/film";

/**
 * Chapter 07 — "Why Choose Us", as a check run.
 *
 * Two references, both measured rather than admired from a distance:
 *
 *   basement.studio — one enormous statement carries the feeling; the substance sits
 *   small and quiet underneath it. Their whole homepage is 392 words across 7.5 screens.
 *
 *   temporal.io — "Watch a Workflow recover from failure": not a diagram of a process,
 *   the process running.
 *
 * So this states one thing and then RUNS three checks in front of you. Scroll is the
 * runner: each line resolves, its value prints, and the mark lands — the same deep-blue
 * mark the gate uses sixty screens earlier. There, a person signs the work; here, the
 * claims are signed.
 *
 * THREE BOXES, ONE SHORT PARAGRAPH EACH — which is basement.studio's structure properly
 * followed rather than half of it. About 90 words against the 226 this replaces.
 *
 * IT FLOWS BELOW LG. Pinned, the stage is one viewport tall and this chapter's content
 * is 909px at 390x844 and 941px at 320x568 — so the third box was clipped away and
 * unreachable on a phone. The route sweep in `responsive.mjs` deliberately ignores text
 * an ancestor clips, because the film's stages are `overflow: hidden` on purpose, so it
 * could never have caught this. Tier one's promise is content complete, and a claim
 * nobody can scroll to is not content.
 *
 * A console rather than a dashboard, deliberately — `.claude/DIRECTION.md` rejects the
 * generic dashboard, and Azkashine's own differentiator is that it TESTS things. A
 * passing run is the site proving itself with its own product.
 *
 * IT REPLACED `Case.tsx` on 2026-09-07. That chapter was 226 words — the wordiest thing
 * on the page — three paragraphs of assertion with grey tags under them, and it was the
 * only chapter that did not operate: the page's scenes are request, gate, breath,
 * ledger, running, failure, and `Case` was not among them. It also opened 01/02/03 in
 * ghost numerals, forty screens after the ledger had already numbered three things.
 */
export function Why() {
  return (
    <ScrollScene id="why" screens={4} screensSm={3} flowBelowLg className="chk">
      <div className="chk-inner">
        <div className="chk-top">
          <p className="chk-eyebrow">{FILM_WHY.eyebrow}</p>
          <p className="chk-state" aria-live="polite">
            <span className="chk-state-run">{FILM_WHY.running}</span>
            <span className="chk-state-done">{FILM_WHY.done}</span>
          </p>
        </div>

        {/* The statement, split so it can arrive a word at a time. Split here rather
            than in the content layer: the sentence stays one string that a person can
            read and edit, and the presentation stays in the component. */}
        <h2 className="chk-statement">
          {FILM_WHY.statement.split(" ").map((word, w) => (
            <span
              key={`${word}-${w}`}
              className="chk-word"
              style={{ "--w": String(w) } as React.CSSProperties}
            >
              {word}
              {w < FILM_WHY.statement.split(" ").length - 1 ? " " : ""}
            </span>
          ))}
        </h2>

        <div className="chk-sweep" aria-hidden="true" />

        <ul className="chk-list">
          {FILM_WHY.checks.map((check, i) => (
            <li
              key={check.label}
              className="chk-box"
              style={{ "--i": String(i) } as React.CSSProperties}
            >
              <p className="chk-head">
                <span className="chk-mark" aria-hidden="true" />
                <span className="chk-label">{check.label}</span>
              </p>
              <p className="chk-body">{check.body}</p>
              <p className="chk-foot">
                <span className="chk-value">{check.value}</span>
              </p>
            </li>
          ))}
        </ul>

      </div>
    </ScrollScene>
  );
}
