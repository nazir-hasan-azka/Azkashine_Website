/**
 * The trace: one line, one canvas, and the segments chapters contribute to it.
 *
 * ONE CANVAS FOR THE WHOLE SITE. A chapter never creates a context. It registers a
 * segment — a piece of the path, in viewport coordinates, drawn into the context that
 * already exists. Six chapters with six canvases would cost six times the memory and
 * make the handoff between them impossible to draw, because the line has to cross from
 * one chapter to the next without a seam. See the five decisions in
 * `.claude/DIRECTION.md`; this is the one most likely to be broken by accident.
 *
 * THE SPINE IS NOT A SEGMENT. The canvas draws the vertical hairline down the gutter
 * itself, from the hero's origin to the foot of the page, and segments interrupt it.
 * Each one says where it takes over (`entry`) and where the spine may resume below it
 * (the return from `draw`) — or returns `null`, which stops the line dead. That is what
 * the gate is: not a picture of a stop, but a segment that refuses to hand the line on.
 */

import type { FilmFrame } from "./loop";

export type TraceColours = {
  ink: string;
  /** `blue-900`. The gate, and the closing mark. Nothing else, ever. */
  deep: string;
  /** Brand cyan. Only where it sits on the hero material, never on paper. */
  brand: string;
  /**
   * What is happening right now — a filling ring, a live mark.
   *
   * `blue-500`, not the brand cyan the direction names for the trace's marks. Cyan
   * measures 1.95:1 on white and a 2px ring in it is a ring nobody can see, which
   * fails the 3:1 the standards set for a UI component. It keeps the cyan wherever it
   * has the hero's material behind it.
   */
  live: string;
  faint: string;
};

export type TraceFrame = FilmFrame & {
  ctx: CanvasRenderingContext2D;
  /**
   * Where the spine runs, in CSS pixels — the browser's own resolution of `--spine-x`,
   * read off a probe element. Every segment anchors to this and never computes it, and
   * nothing here transcribes the formula: `globals.css` is the only place it exists.
   */
  spineX: number;
  colours: TraceColours;
};

export type TraceSegment = {
  id: string;
  /** Position in the path. The canvas walks segments in this order, low to high. */
  order: number;
  /** Viewport y at which this segment takes the line over. */
  entry: (frame: TraceFrame) => number;
  /**
   * Draw this chapter's contribution. Return the viewport y where the spine resumes
   * below, or `null` while the line is held here.
   */
  draw: (frame: TraceFrame) => number | null;
};

const segments: TraceSegment[] = [];

/** Registered in path order, so the canvas never sorts on a frame. */
export function registerSegment(segment: TraceSegment) {
  segments.push(segment);
  segments.sort((a, b) => a.order - b.order);
  return () => {
    const i = segments.indexOf(segment);
    if (i >= 0) segments.splice(i, 1);
  };
}

export function traceSegments(): readonly TraceSegment[] {
  return segments;
}

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** The project's easing, as a function. Mirrors `--ease-out-soft` closely enough. */
export const easeOutSoft = (t: number) => 1 - Math.pow(1 - t, 3);

/** Progress through one beat of a timeline, given its start and end. */
export const beat = (p: number, from: number, to: number) =>
  clamp01((p - from) / (to - from));

/**
 * The palette, read off the document rather than copied in.
 *
 * A canvas takes colour strings, not custom properties. Writing the hex values into
 * this file would put a second, silent copy of the palette somewhere nobody would think
 * to update it — the exact drift `tests/standards.mjs` exists to stop.
 */
export function readColours(): TraceColours {
  const cs = getComputedStyle(document.documentElement);
  const token = (name: string, fallback: string) =>
    cs.getPropertyValue(name).trim() || fallback;
  return {
    ink: token("--color-ink", "#000"),
    deep: token("--color-blue-900", "#000"),
    brand: token("--color-brand", "#000"),
    live: token("--color-blue-500", "#000"),
    faint: token("--color-border-strong", "#000"),
  };
}
