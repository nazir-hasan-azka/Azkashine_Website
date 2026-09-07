"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollScene } from "@/components/film/ScrollScene";
import { registerPainter, type FilmFrame } from "@/lib/film/loop";
import { registerSegment, type TraceFrame } from "@/lib/film/trace";

/**
 * CHAPTER 04 — ALREADY RUNNING. The eight product interfaces travel horizontally past a
 * pinned stage.
 *
 * HOLD AND TRAVERSE, the second of the four moves in `DIRECTION.md`. The stage locks and
 * the content moves sideways, which is the one moment vertical movement has already
 * stopped and a sideways move contradicts nothing. The whole traverse is one line of
 * CSS — `translateX(calc(var(--p) * (100vw - 100%)))`, where the percentage resolves
 * against the track's own width — so nothing measures anything and there is no carousel,
 * no dots, and no library.
 *
 * IT TAKES ITS CHILDREN RATHER THAN RENDERING THEM. This half has to be a Client
 * Component because it registers a trace segment; the panels do not, and they carry
 * `components/product-ui/` — eight coded interfaces, several hundred lines of JSX. Passed
 * in as `children` they stay server-rendered and never reach the browser bundle. That is
 * the only reason this file is split in two.
 */

const SCENE = "running";

export function Running({ children }: { children: ReactNode }) {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let top = Number.POSITIVE_INFINITY;
    let bottom = Number.POSITIVE_INFINITY;
    let written = "";

    /* THE TRAVERSE, written straight onto the track.
       It used to be `transform: translateX(calc(var(--p) * (100vw - 100%)))` in the
       stylesheet, reading the inherited `--p` off the stage. That is elegant and it
       was the single most expensive thing on the page: an inherited custom property
       invalidates style for everything below it, and below it are eight coded product
       interfaces totalling 376 elements. One inline style on one element instead.

       The percentage still does the work — it resolves against the track's own width —
       so nothing is measured here either. */
    const offPaint = registerPainter((f: FilmFrame) => {
      const track = railRef.current;
      const s = f.scene(SCENE);
      if (!track || !s) return;
      /* Below lg, and under reduced motion, the track is a column and the stylesheet
         says `transform: none`. An inline style would beat that media query, so this
         writes nothing at all in those two cases. */
      const flow = f.w < 1024 || f.reduced;
      const next = flow ? "" : `translateX(calc(${s.p.toFixed(4)} * (100vw - 100%)))`;
      if (next === written) return;
      written = next;
      track.style.transform = next;
    });

    const offSegment = registerSegment({
      id: SCENE,
      order: 40,

      entry: () => {
        const rect = railRef.current?.getBoundingClientRect();
        top = rect?.top ?? Number.POSITIVE_INFINITY;
        bottom = rect?.bottom ?? Number.POSITIVE_INFINITY;
        return top;
      },

      draw: (f: TraceFrame) => {
        const s = f.scene(SCENE);
        if (!s || !Number.isFinite(top)) return f.h + 40;
        // On a phone the panels stack and nothing traverses, so there is nothing for a
        // horizontal line to mean. `DIRECTION.md`: no horizontal turns below lg.
        if (f.w < 1024) return bottom;

        const { ctx, colours } = f;
        const x = f.spineX;
        /* Off the stage's bottom edge. The rail IS the track, and the track fills the
           stage, so drawing on `bottom` put the line on the last pixel row of the
           window where it read as a border on the browser. */
        const y = bottom - Math.min(64, (bottom - top) * 0.09);

        /* THE LINE ARRIVES BEFORE IT TURNS, and it did not — this chapter drew its
           horizontal run and nothing else, so a segment claiming 7,200px of page put
           7,200px of nothing in the gutter above it. The trace read as disconnected,
           which is exactly what it was.

           The vertical comes down the gutter to the turn, every frame. THEN it turns. */
        ctx.strokeStyle = colours.ink;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, Math.max(top, -20));
        ctx.lineTo(x, y);
        ctx.stroke();

        /* THE TURN. Vertical is travelling, horizontal is working — and this is the
           only chapter where the line is allowed to run sideways, because the stage is
           pinned and the gesture it would fight has already stopped. It runs under the
           track, in step with it. */
        const run = x + (f.w - x * 2) * s.p;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(run, y);
        ctx.stroke();

        /* And it carries on down once the traverse is spent, so the chapter hands the
           line to the next one instead of ending on a right angle. */
        if (s.p > 0.94) {
          const on = (s.p - 0.94) / 0.06;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + (bottom - y) * on);
          ctx.stroke();
        }

        // A tick per product passed. The record of where it has been, which is what a
        // trace is for.
        const ticks = Math.floor(s.p * 8);
        ctx.strokeStyle = colours.live;
        ctx.lineWidth = 1;
        for (let i = 1; i <= ticks; i++) {
          const tx = x + ((f.w - x * 2) / 8) * i;
          ctx.beginPath();
          ctx.moveTo(tx, y - 5);
          ctx.lineTo(tx, y + 5);
          ctx.stroke();
        }

        return bottom;
      },
    });

    return () => {
      offPaint();
      offSegment();
    };
  }, []);

  return (
    <ScrollScene
      id={SCENE}
      screens={8}
      screensSm={1}
      flowBelowLg
      className="film-running"
    >
      <div ref={railRef} className="film-track">
        {children}
      </div>
    </ScrollScene>
  );
}
