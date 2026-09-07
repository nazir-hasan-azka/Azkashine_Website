"use client";

import { useEffect, useRef } from "react";
import { FILM_DECISION } from "@/lib/content/film";
import { CATEGORY_BY_SLUG } from "@/lib/content/taxonomy";
import { ScrollScene } from "@/components/film/ScrollScene";
import { Beat, ChapterMark } from "@/components/film/Beat";
import {
  beat,
  easeOutSoft,
  registerSegment,
  type TraceFrame,
} from "@/lib/film/trace";

/**
 * CHAPTER 01 — THE REQUEST. AI & Automation, and where the trace teaches its own
 * vocabulary: line, branch, gate, mark.
 *
 * Five candidate paths draw, four retract, one completes. The visitor watches an agent
 * plan and discard rather than being shown an icon of a brain — which is the whole
 * argument for a line over every rejected alternative in `DIRECTION.md` (neural brain,
 * particle field, circuit board, floating sphere).
 *
 * THE SURVIVOR IS THE FOURTH, NOT THE MIDDLE ONE. A horizontal survivor drew a straight
 * line back to the gutter and, with the drop above it, closed a rectangle — the whole
 * beat read as a box rather than as a choice. One below centre descends, which is both
 * more alive and truer: the work is still heading down the page.
 *
 * ON A PHONE the branches shrink to short stubs rather than being cut. `DIRECTION.md`
 * asks for "shallower excursions, no horizontal turns" below `lg` — a branch is an
 * excursion, not a turn, and it is the one beat that has to survive for the metaphor to
 * mean anything.
 *
 * EVERY SENTENCE HERE IS THE PRACTICE'S OWN. The heading is
 * `CATEGORY_BY_SLUG["ai-automation"].tagline` and the lede is its `intro`, both verbatim
 * from deck p4. The first version of this chapter had prose written for it — an agent
 * weighing options and choosing a path — and the home page read as an AI-agent company.
 * A chapter that needs its own paragraph to explain a practice is a chapter explaining
 * the wrong thing.
 */

const SCENE = "request";

/** Five candidates, and the one that survives. Not the middle — see the note above. */
const PATHS = 5;
const SURVIVOR = 3;

/* The windows OVERLAP on purpose. With retraction finishing at 0.78 and the return
   starting there, the four losers were gone and the survivor hung in space for a
   sixth of the chapter before anything else happened. The chosen path now starts
   heading back while the last of the others is still letting go, which is what makes
   it read as one decision rather than three separate events. */
const FANNING = 0.38;
const RETRACT_FROM = 0.34;
const RETRACTING = 0.7;
const RETURNS = 0.6;

export function Request() {
  const lineRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let y = Number.POSITIVE_INFINITY;
    let last = "";

    const setStatus = (text: string) => {
      if (text === last || !statusRef.current) return;
      last = text;
      statusRef.current.textContent = text;
    };

    return registerSegment({
      id: SCENE,
      order: 5,

      entry: () => {
        y = lineRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
        return y;
      },

      draw: (f: TraceFrame) => {
        const s = f.scene(SCENE);
        if (!s || !Number.isFinite(y)) return f.h + 40;

        const { ctx, colours } = f;
        const p = s.p;
        const x = f.spineX;

        const fan = easeOutSoft(beat(p, 0.06, FANNING));
        const die = beat(p, RETRACT_FROM, RETRACTING);
        const join = easeOutSoft(beat(p, RETURNS, 0.96));

        /* Sized off the viewport, not a fixed pixel count. At a flat 260px the whole
           decision happened in the left fifth of a 1440px screen and read as timid —
           the branch is the most important beat in the chapter and should own the
           stage. On a phone it is a stub, because there is nowhere for it to go. */
        const wide = f.w >= 1024;
        const reach = wide ? Math.min(f.w * 0.34, 520) : Math.min(f.w * 0.2, 76);
        /* THE FAN OPENS DOWNWARD FROM THE JUNCTION, and every path is below the
           anchor. Fanning symmetrically about it put the top two candidates straight
           through the lede — the trace drawing over the sentence explaining it.
           Downward is also the shape `DIRECTION.md` draws the metaphor as, and the
           step is measured from the room left under the anchor, so the beat fits
           whatever height the copy above it happened to take.

           THE ROOM IS MEASURED INSIDE THE STAGE, not down to the bottom of the
           window. Measured against the viewport it grew without limit once the
           chapter had scrolled away — the anchor's y goes far negative, `f.h - y`
           goes huge, and chapter 01's branch was drawing itself across chapter 04
           four screens later. Stage-relative, it is the same number at every scroll
           position, which is what it should always have been. */
        const room = Math.max(60, s.stageHeight - (y - s.stageTop) - 48);
        const step = room / (PATHS + 1.6);

        ctx.lineWidth = 1.5;

        for (let i = 0; i < PATHS; i++) {
          const survivor = i === SURVIVOR;
          // Losers grow, hold, then retract over the back half of the beat. Each one
          // goes at its own moment, so four paths do not vanish as a single event.
          const retract = survivor
            ? 0
            : Math.min(1, Math.max(0, (die - i * 0.06) / 0.42));
          const len = reach * fan * (1 - retract);
          const alpha = survivor ? 1 : 1 - retract;
          if (len <= 1 || alpha <= 0.02) continue;

          const endY = y + (i + 1) * step;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = survivor ? colours.ink : colours.faint;
          ctx.lineWidth = survivor ? 1.5 : 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.bezierCurveTo(x + len * 0.4, y, x + len * 0.5, endY, x + len, endY);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        /* The survivor curves BACK to the spine rather than retracing its own line.
           Retracing looked like a drawn box; a curve reads as the chosen path
           rejoining, which is what it is. */
        const tipY = y + (SURVIVOR + 1) * step;
        const joinY = y + (PATHS + 1.3) * step;
        if (join > 0) {
          ctx.strokeStyle = colours.ink;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x + reach * fan, tipY);
          ctx.bezierCurveTo(
            x + reach * 0.45 * fan,
            tipY,
            x + reach * 0.3 * fan,
            joinY,
            x,
            joinY,
          );
          ctx.stroke();

          // The mark where the decision was made, on the spine.
          ctx.fillStyle = colours.live;
          ctx.beginPath();
          ctx.arc(x, joinY, 3.5 * join, 0, Math.PI * 2);
          ctx.fill();
        }

        setStatus(
          fan < 0.9
            ? FILM_DECISION.states.weighing
            : die < 0.9
              ? FILM_DECISION.states.discarding
              : FILM_DECISION.states.chosen,
        );

        // Nothing below exists until the chosen path has rejoined the spine.
        if (join < 1) return null;
        return joinY;
      },
    });
  }, []);

  const practice = CATEGORY_BY_SLUG["ai-automation"];

  return (
    <ScrollScene id={SCENE} screens={5} screensSm={4} className="film-request">
      <div className="film-chapter">
        <ChapterMark number={FILM_DECISION.chapter} title={FILM_DECISION.title} />

        <div className="film-copy">
          <Beat at={0.02} as="p" className="film-eyebrow">
            {practice.name}
          </Beat>
          <Beat at={0.05} as="p" className="film-heading">
            {practice.tagline}
          </Beat>
          <Beat at={0.1} as="p" className="film-lede">
            {practice.intro}
          </Beat>
        </div>

        {/* Named as it happens, and a live region so the beat is not silent to a
            screen reader that cannot see a line move. Above the junction, because
            everything the canvas draws in this chapter is below it. */}
        <p ref={statusRef} className="film-status" aria-live="polite">
          {FILM_DECISION.states.arriving}
        </p>

        {/* Zero-height, and the only thing that says where the branch happens — so the
            canvas and the layout cannot disagree about it, and every window gets the
            composition its own type produced. Same contract the gate uses. */}
        <div ref={lineRef} className="film-anchor" aria-hidden="true" />
      </div>
    </ScrollScene>
  );
}
