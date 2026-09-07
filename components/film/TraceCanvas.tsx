"use client";

import { useEffect, useRef } from "react";
import { registerMeasure, registerPainter, type FilmFrame } from "@/lib/film/loop";
import { traceOrigin } from "@/lib/film/origin";
import {
  clamp01,
  easeOutSoft,
  readColours,
  traceSegments,
  type TraceColours,
  type TraceFrame,
} from "@/lib/film/trace";

/**
 * The trace. ONE canvas, mounted once, for the whole film.
 *
 * Chapters do not own canvases — they register segments (`lib/film/trace.ts`) and this
 * draws them into the single context that already exists. What this file owns directly
 * is the spine: the hairline down the page gutter that every chapter interrupts and
 * hands back.
 *
 * WHY CANVAS AND NOT SVG. The line is one path whose geometry changes every frame. In
 * SVG that is a `d` attribute rewritten sixty times a second — a path string parsed on
 * every frame, and an element the browser has to lay out again. Here it is a few dozen
 * `lineTo` calls against numbers we already hold, in one element that never relayouts.
 *
 * IT IS FIXED, AND THE PAGE SCROLLS UNDER IT. So everything a segment draws is in
 * viewport coordinates and comes from its scene's sticky stage, which is exactly the
 * frame of reference a pinned scene works in.
 *
 * z-index sits below the header's 50 on purpose: the header is white at 90% with a
 * blur, so the line passes behind it and dims rather than crossing it.
 */
export function TraceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const probe = probeRef.current;
    if (!canvas || !probe) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let spine_x = 24;
    let colours: TraceColours = readColours();
    /** Document y of the hero canvas top edge, or null when there is no hero here. */
    let heroTop: number | null = null;

    /**
     * Everything that depends on layout, read in one place and only when layout can
     * have changed. Where the spine runs comes off a probe element rather than from a
     * formula copied out of the stylesheet — `--spine-x` is built from a `max()` of a
     * rem and a percentage, which `getComputedStyle` will not resolve for a custom
     * property but will resolve for the padding that uses it. `globals.css` stays the
     * only place that number is defined.
     */
    const measure = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spine_x = parseFloat(getComputedStyle(probe).paddingLeft) || 24;
      colours = readColours();
      const hero = document.querySelector<HTMLElement>("[data-hero] .hero-canvas");
      heroTop = hero ? hero.getBoundingClientRect().top + window.scrollY : null;
    };
    measure();
    window.addEventListener("resize", measure);
    /* The hero lays its headline out again once the webfont lands, which moves the
       origin and can move the hero height with it. */
    document.fonts?.ready.then(measure).catch(() => {});

    /* One frame object, reused. A per-frame literal here would be sixty allocations a
       second for numbers that all get overwritten. */
    const frame = {
      ctx,
      spineX: 0,
      colours,
      now: 0,
      scrollY: 0,
      scrolled: 0,
      w: 0,
      h: 0,
      reduced: false,
      scene: (() => undefined) as FilmFrame["scene"],
    } as TraceFrame;

    /** How long after the hero publishes its origin the line leaves the letter. */
    const DROP_DELAY = 2500; // the arrival runs 2200ms; the line waits for the letters
    const DROP_MS = 900;

    const spine = (from: number, to: number) => {
      if (to - from < 0.5) return;
      const x = frame.spineX;
      ctx.strokeStyle = colours.ink;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, Math.max(from, -20));
      ctx.lineTo(x, Math.min(to, h + 20));
      ctx.stroke();
    };

    /**
     * Chapter 00 handing over: one hairline leaves a letterform and drops to the gutter.
     *
     * The origin is the dot of the i that the hero itself measured — a point that is
     * already a point. It sits a few pixels right of the gutter, because that letter
     * starts a line, so the drop is a short lateral correction and then straight down.
     * That is the whole move; anything more would be a flourish over a headline that
     * does not need one.
     *
     * The line fades UP from nothing across the first stretch. The hero material
     * spills light onto the paper around the type, and a hairline drawn into that is a
     * hairline nobody can see — it has to become visible as it reaches clean paper.
     *
     * Returns the viewport y the spine carries on from, or null if the drop has not
     * started, in which case there is no line on the page at all yet.
     */
    const drop = (): number | null => {
      const o = traceOrigin();
      if (!o || heroTop === null) return null;
      /* Straight to the settled state for anyone who is already past the hero — a
         visitor who scrolled hard on arrival should not find a page with no line on it
         waiting for an animation they never saw. */
      const skip = frame.reduced || frame.scrollY > frame.h * 0.75;
      const t = skip ? 1 : clamp01((frame.now - o.at - DROP_DELAY) / DROP_MS);
      if (t <= 0) return null;

      const ox = o.x;
      const oy = o.y + heroTop - frame.scrollY;
      const x = frame.spineX;
      // As far as the letter is tall: enough to be clear of the headline own light.
      const settle = oy + o.size * 0.9;
      const e = easeOutSoft(t);
      const end = oy + (settle - oy) * e;

      const grad = ctx.createLinearGradient(ox, oy, x, settle);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(1, colours.ink);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.bezierCurveTo(
        ox,
        oy + (end - oy) * 0.55,
        x,
        oy + (end - oy) * 0.5,
        ox + (x - ox) * e,
        end,
      );
      ctx.stroke();

      // The origin mark, on the letterform it came out of.
      ctx.globalAlpha = e;
      ctx.fillStyle = colours.brand;
      ctx.beginPath();
      ctx.arc(ox, oy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Nothing below the drop exists until the drop has landed on the gutter.
      return e < 1 ? null : settle;
    };

    /* EVERY DOM READ THE CANVAS MAKES HAPPENS HERE, in the loop's read pass, before a
       single `--p` is written. Segments used to read their rectangles inside the
       painter, which runs after those writes — so each read forced a full style
       recalculation and layout of a 34,000px document, six times a frame. Median frame
       time was 50ms and the worst was 917ms. See the note on `measurers` in
       `lib/film/loop.ts`. */
    const entries: number[] = [];
    const readAll = (f: FilmFrame) => {
      if (!w || !h) return;
      Object.assign(frame, f);
      frame.spineX = spine_x;
      frame.colours = colours;
      const segments = traceSegments();
      entries.length = segments.length;
      for (let i = 0; i < segments.length; i++) entries[i] = segments[i].entry(frame);
    };

    const paint = (f: FilmFrame) => {
      if (!w || !h) return;
      Object.assign(frame, f);
      frame.spineX = spine_x;
      frame.colours = colours;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const start = drop();
      if (start === null) return;

      /* Walk the path. The spine runs from wherever the last segment let go to wherever
         the next one takes over; a segment that returns null is holding the line, and
         nothing below it exists. That is the gate, and it is structural rather than
         drawn: the line does not continue because no segment has handed it on.

         `entry` is the number read in the pass above, never re-read here. */
      let cursor = start;
      let held = false;
      const segments = traceSegments();
      for (let i = 0; i < segments.length; i++) {
        const entry = entries[i] ?? h + 40;
        spine(cursor, Math.min(entry, h + 20));
        const exit = segments[i].draw(frame);
        if (exit === null) {
          held = true;
          break;
        }
        cursor = Math.max(cursor, exit);
      }
      if (!held) spine(cursor, h + 20);
    };

    const offMeasure = registerMeasure(readAll);
    const off = registerPainter(paint);
    return () => {
      offMeasure();
      off();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="film-trace" aria-hidden="true" />
      {/* The gutter, measured rather than mirrored. Zero-sized, so it costs one
          computed-style read on resize and nothing else. */}
      <span ref={probeRef} className="film-gutter-probe" aria-hidden="true" />
    </>
  );
}
