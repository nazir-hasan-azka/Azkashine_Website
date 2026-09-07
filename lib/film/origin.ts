/**
 * Where the trace starts, published by the hero.
 *
 * `ApertureCanvas` already knows exactly where every letterform is — it lays the
 * headline out from the window and stamps each glyph itself. The trace's origin is one
 * of those glyphs, so the hero hands the point over rather than the trace guessing at
 * it. The prototype's `gutter + w * 0.22` was a placeholder and does not survive.
 *
 * WHY A MODULE AND NOT A PROP OR CONTEXT. The hero is a finished component that is not
 * being rebuilt, and it must keep costing nothing once its arrival is over — a React
 * value crossing from it to the trace would put a re-render in the path of a number
 * that changes on resize and never otherwise. This is a two-field box: the hero writes
 * on layout, the trace reads on the frames it draws, and on `/` nothing reads it at all.
 *
 * COORDINATES are CSS pixels relative to the hero canvas's own top-left corner, which
 * is what the hero's layout produces. Turning that into a page position is the reader's
 * job, because only the reader knows where on the page the hero ended up.
 */

export type TraceOrigin = {
  x: number;
  y: number;
  /** The headline's type size. The trace scales its first move off the letter it left. */
  size: number;
  /** `performance.now()` at publication, so the drop can wait for the arrival to land. */
  at: number;
};

let origin: TraceOrigin | null = null;

export function publishTraceOrigin(x: number, y: number, size: number) {
  origin = { x, y, size, at: performance.now() };
}

export function clearTraceOrigin() {
  origin = null;
}

export function traceOrigin(): TraceOrigin | null {
  return origin;
}
