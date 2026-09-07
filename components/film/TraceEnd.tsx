"use client";

import { useEffect, useRef } from "react";
import { registerSegment, type TraceFrame } from "@/lib/film/trace";

/**
 * Where the line stops.
 *
 * A segment like any other, and it uses the same word the gate does: returning `null`
 * means nothing below this point exists. For the gate that is a refusal; here it is the
 * end of the run. Without it the hairline would carry on off the bottom of the last
 * section and through the footer, which is not a line that finished — it is a line
 * somebody forgot to stop.
 *
 * It reads its own rectangle once a frame, which is what a scene costs, and does it in
 * `entry` so `draw` reuses the number rather than asking twice.
 */
export function TraceEnd() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let y = Number.POSITIVE_INFINITY;
    return registerSegment({
      id: "end",
      order: 99,
      entry: () => {
        y = ref.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
        return y;
      },
      draw: (f: TraceFrame) => {
        if (y > -40 && y < f.h + 40) {
          f.ctx.fillStyle = f.colours.deep;
          f.ctx.beginPath();
          f.ctx.arc(f.spineX, y, 4, 0, Math.PI * 2);
          f.ctx.fill();
        }
        return null;
      },
    });
  }, []);

  return <div ref={ref} className="film-end" aria-hidden="true" />;
}
