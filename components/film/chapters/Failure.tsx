"use client";

import { useEffect, useRef } from "react";
import { FILM_FAILURE } from "@/lib/content/film";
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
 * CHAPTER 05 — THE FAILURE. Cloud Services & Testing, and the only backwards motion on
 * the site.
 *
 * A run completes, a step fails, and the line goes back along its own path to find the
 * cause. `DIRECTION.md` lists it as signature moment 06 and notes that no reference site
 * does this — which is the reason to build it rather than a reason to worry.
 *
 * IT IS ALSO THE THIRD PRACTICE'S EQUAL. Chapter 01 gives AI & Automation a branch and a
 * gate; this gives Cloud Services & Testing a move nothing else on the site has. Neither
 * is a decorated version of the other, and that is the difference between three practices
 * in equal measure and one practice with two appendices.
 *
 * NO NEW COLOUR FOR THE FAILURE. Red is the obvious choice and the palette does not have
 * one — `DIRECTION.md` reserves `blue-900` for the gate and the closing mark and allows
 * nothing else. So the failure is drawn as a BREAK: the line stops, there is a gap, and
 * what comes back is dashed. Direction and texture carry the meaning instead of hue,
 * which also means it still reads for a visitor who cannot distinguish red from green.
 */

const SCENE = "failure";

const RUNS = 0.3;
const BREAKS = 0.4;
const TRACES = 0.82;

/** Where down the rail the run stops, and where the cause turns out to be. */
const BREAK_AT = 0.74;
const CAUSE_AT = 0.26;

export function Failure() {
  const railRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let top = Number.POSITIVE_INFINITY;
    let bottom = Number.POSITIVE_INFINITY;
    let last = "";

    const setStatus = (text: string) => {
      if (text === last || !statusRef.current) return;
      last = text;
      statusRef.current.textContent = text;
    };

    return registerSegment({
      id: SCENE,
      order: 50,

      entry: () => {
        const rect = railRef.current?.getBoundingClientRect();
        top = rect?.top ?? Number.POSITIVE_INFINITY;
        bottom = rect?.bottom ?? Number.POSITIVE_INFINITY;
        return top;
      },

      draw: (f: TraceFrame) => {
        const s = f.scene(SCENE);
        if (!s || !Number.isFinite(top)) return f.h + 40;

        const { ctx, colours } = f;
        const p = s.p;
        const x = f.spineX;
        const span = Math.max(1, bottom - top);
        const breakY = top + span * BREAK_AT;
        const causeY = top + span * CAUSE_AT;

        const run = easeOutSoft(beat(p, 0, RUNS));
        const broke = beat(p, RUNS, BREAKS);
        const back = easeOutSoft(beat(p, BREAKS, TRACES));
        const done = easeOutSoft(beat(p, TRACES, 1));

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = colours.ink;

        // 1 — the run. Down to the break and no further.
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, top + (breakY - top) * run);
        ctx.stroke();

        // 2 — the break. A gap the line does not cross, and a stutter across it so the
        // stop is an event rather than an absence.
        if (broke > 0) {
          /* Two bars across the line with a gap between them — a barrier the run did
             not get past. At 14px wide they read as a hyphen; at 30 they read as a
             stop, which is the whole point of the beat. */
          const wide = 15;
          ctx.globalAlpha = broke;
          ctx.strokeStyle = colours.ink;
          ctx.lineWidth = 2;
          for (const dy of [-4, 4]) {
            ctx.beginPath();
            ctx.moveTo(x - wide, breakY + dy);
            ctx.lineTo(x + wide, breakY + dy);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }

        /* 3 — THE REVERSAL. A dashed pass travelling UP the path it already took. Dashed
           because it is a re-reading of work already done rather than new work, and
           offset a couple of pixels so it is legible against the solid line beneath it. */
        if (back > 0) {
          const from = breakY;
          const to = from + (causeY - from) * back;
          ctx.save();
          ctx.setLineDash([4, 5]);
          ctx.strokeStyle = colours.live;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x + 3, from);
          ctx.lineTo(x + 3, to);
          ctx.stroke();
          ctx.restore();
        }

        // 4 — the cause. A square, because every other mark on this site is round and
        // this one is a different kind of thing.
        if (done > 0) {
          const r = 4.5 * done;
          ctx.fillStyle = colours.deep;
          ctx.fillRect(x - r, causeY - r, r * 2, r * 2);

          // Fixed, and the run completes past the break.
          ctx.strokeStyle = colours.ink;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x, breakY);
          ctx.lineTo(x, breakY + (bottom - breakY) * done);
          ctx.stroke();
        }

        setStatus(
          run < 1
            ? FILM_FAILURE.states.running
            : back <= 0
              ? FILM_FAILURE.states.failed
              : done < 1
                ? FILM_FAILURE.states.tracing
                : FILM_FAILURE.states.found,
        );

        if (done < 1) return null;
        return bottom;
      },
    });
  }, []);

  const practice = CATEGORY_BY_SLUG["cloud-testing"];

  return (
    <ScrollScene id={SCENE} screens={6} screensSm={4} className="film-failure">
      <div className="film-chapter">
        <ChapterMark number={FILM_FAILURE.chapter} title={FILM_FAILURE.title} />

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

        {/* The rail the run happens on. Zero-height markers at each end, so the canvas
            reads the layout rather than agreeing with it about a fraction. */}
        <div ref={railRef} className="film-rail-tall" aria-hidden="true" />

        <p ref={statusRef} className="film-status" aria-live="polite">
          {FILM_FAILURE.states.running}
        </p>
      </div>
    </ScrollScene>
  );
}
