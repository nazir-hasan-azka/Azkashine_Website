"use client";

import { useEffect, useRef } from "react";
import { FILM_GATE } from "@/lib/content/film";
import { REASONS } from "@/lib/content/why";
import { ScrollScene } from "@/components/film/ScrollScene";
import {
  beat,
  clamp01,
  easeOutSoft,
  registerSegment,
  type TraceFrame,
} from "@/lib/film/trace";

/**
 * THE GATE. The trace reaches an approval checkpoint and stops.
 *
 * This is the riskiest idea in `.claude/DIRECTION.md` and the cheapest to abandon,
 * which is why it is the first thing built. It deliberately spends scroll on nothing
 * advancing — the only place on the site where that is true — and the failure mode is
 * not that it looks dull, it is that it looks BROKEN. Four things are load-bearing
 * against that, and none of them can be dropped as polish:
 *
 *   1 · THE WAIT ANSWERS THE SCROLL. Scrolling during the hold does not move the line,
 *       but it does fill the ring around the waiting mark and it presses the gate down
 *       a few pixels, which spring back. The visitor learns that the page is reading
 *       them and refusing, rather than that it has died. This is the difference between
 *       a held page and a frozen one, and it is the whole trick.
 *   2 · A BREATHING MARK. Nothing on screen is ever completely still.
 *   3 · AN EXPLICIT STATE. "Awaiting approval" is on the page in words, in a live
 *       region, before anything has stopped.
 *   4 · A SENTENCE, a moment in. "The page is not stuck — the work is." It arrives once
 *       the stop has been felt rather than pre-empting it, and it is the line that turns
 *       a bug report into the point of the section.
 *
 * The bar across the line is NOT the trace turning horizontal — it is the checkpoint,
 * and the trace runs into it. The direction rule (vertical is travelling, horizontal is
 * working) is about the line itself. On a phone the bar shrinks to a tick either side,
 * because a sideways move on a phone is the first thing to cut rather than shrink.
 */

const SCENE = "gate";

/**
 * The timeline, in scene progress. The scene is four screens tall, so it has three to
 * spend, and the hold takes about 1.2 of them — roughly 1,100px of scrolling in which
 * the line does not move. Long enough to be unmistakably deliberate, short enough that
 * nobody reaches for the back button. This is the number to change first if it tests
 * badly, in either direction.
 */
const ARRIVED = 0.18;
const SIGNING = 0.58;
const SIGNED = 0.68;
const RUN_ENDS = 0.88;

/**
 * WHERE THE CHECKPOINT SITS IS THE DOM'S DECISION, not a fraction of the stage.
 *
 * It was 0.56 of the stage height in both this file and the stylesheet, and at 320x568
 * that put the bar straight through a heading that had grown to four lines — the
 * heading ran up under the header and the top of it was gone. A number two files share
 * is also a number that drifts, which is exactly the trap the hero's reserves fell into
 * twice. So the stage lays out in normal flow, a zero-height marker sits between the
 * copy and the status line, and the canvas reads that marker. Every window gets the
 * composition its own type produced, and there is no shared constant left to disagree
 * about.
 */

/** The "governed by default" reason. The gate is what it looks like. */
const GOVERNED = REASONS.find((r) => r.id === "governed");

export function Gate() {
  const statusRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Held between frames and never in React state: this is a spring, and a spring that
       re-rendered a component sixty times a second would be a spring nobody could
       afford. See the second architectural decision in `.claude/DIRECTION.md`. */
    let push = 0;
    /** Viewport y of the checkpoint, read from the DOM once a frame. */
    let gy = Number.POSITIVE_INFINITY;
    // Matches what the server rendered, so frame one writes nothing and no screen
    // reader is told the state changed when it did not.
    let lastState = "waiting";
    let lastHint = -1;

    const setState = (state: string, label: string) => {
      if (state === lastState) return;
      lastState = state;
      if (statusRef.current) statusRef.current.textContent = label;
      if (innerRef.current) innerRef.current.dataset.state = state;
    };

    const setHint = (value: number) => {
      const rounded = Math.round(value * 20) / 20;
      if (rounded === lastHint || !hintRef.current) return;
      lastHint = rounded;
      hintRef.current.style.opacity = String(rounded);
    };

    const off = registerSegment({
      id: SCENE,
      order: 10,

      /* One rectangle a frame, read here so `draw` reuses it instead of asking twice.
         The canvas always calls `entry` first. */
      entry: () => {
        gy = lineRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
        return gy;
      },

      draw: (f: TraceFrame) => {
        const s = f.scene(SCENE);
        if (!s || !Number.isFinite(gy)) return f.h + 40;

        const { ctx, colours } = f;
        const p = s.p;
        const x = f.spineX;

        const arrive = easeOutSoft(beat(p, 0, ARRIVED));
        const wait = beat(p, ARRIVED, SIGNING);
        const seal = easeOutSoft(beat(p, SIGNING, SIGNED));
        const run = easeOutSoft(beat(p, SIGNED, RUN_ENDS));

        /* The push-back. Scroll during the hold feeds a damped spring; the line and the
           bar it is pressing on give by a few pixels and recover. Reduced motion gets
           none of it — there is nothing to feel when nothing is being scrubbed. */
        if (!f.reduced && p > 0.01 && p < SIGNING) {
          push = Math.min(6, push * 0.86 + Math.abs(f.scrolled) * 0.05);
        } else {
          push *= 0.8;
        }
        const dip = seal > 0 ? 0 : push;

        // ── the checkpoint ────────────────────────────────────────────────────
        // A bar across the line with a post at each end. Posts are what make it read
        // as a gate rather than as a rule under the heading above it.
        const wide = f.w >= 768;
        /* Long enough to cross the copy column. At 380px it stopped short of the text
           and read as a rule under the heading; a barrier has to look like it is in the
           way of something. */
        const reach = wide ? Math.min(f.w * 0.44, 620) : 26;
        // The spine is 14px off the edge on a phone, so everything drawn to the LEFT of
        // it has that much room and no more. At 34 and 14 the post and the ring were
        // being clipped by the viewport.
        const back = wide ? 34 : 9;
        const rest = wide ? 10 : 6;
        // It opens as it releases, and never closes fully again: what is left is the
        // record that the checkpoint was here.
        const open = 1 - easeOutSoft(beat(p, SIGNED, RUN_ENDS));
        const rx = x + Math.max(reach * arrive * open, rest * arrive);
        const lx = x - Math.max(back * arrive * open, rest * arrive);

        const bar = () => {
          ctx.beginPath();
          ctx.moveTo(lx, gy);
          ctx.quadraticCurveTo(x, gy + dip * 2, rx, gy);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(lx, gy - 4);
          ctx.lineTo(lx, gy + 4);
          ctx.moveTo(rx, gy - 4);
          ctx.lineTo(rx, gy + 4);
          ctx.stroke();
        };

        /* The unsigned bar is INK held back, not `border-strong`. The pale token
           measures about 1.1:1 on white — the line was stopping at something nobody
           could see, which is a stop that reads as a bug rather than as a barrier.
           Grey while it waits, `blue-900` once it is signed: the colour carries the
           state, and the deep blue stays scarce because it only ever means approved. */
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.34;
        ctx.strokeStyle = colours.ink;
        bar();
        ctx.globalAlpha = 1;
        if (seal > 0) {
          // The signed bar paints over the waiting one rather than interpolating a
          // colour: two strokes, one alpha, and no colour arithmetic in a hot loop.
          ctx.globalAlpha = seal;
          ctx.strokeStyle = colours.deep;
          bar();
          ctx.globalAlpha = 1;
        }

        // ── the line pressing on it ───────────────────────────────────────────
        // Drawn here rather than by the spine, because its tip has to follow the dip.
        if (dip > 0.05) {
          ctx.strokeStyle = colours.ink;
          ctx.beginPath();
          ctx.moveTo(x, gy - 1);
          ctx.lineTo(x, gy + dip * 2);
          ctx.stroke();
        }

        // ── waiting ───────────────────────────────────────────────────────────
        if (seal < 1) {
          const alpha = arrive * (1 - seal);
          const cy = gy + dip * 2;
          const r = wide ? 20 : 11;

          ctx.globalAlpha = alpha * 0.16;
          ctx.strokeStyle = colours.ink;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, cy, r, 0, Math.PI * 2);
          ctx.stroke();

          /* The ring fills as the visitor scrolls. It is the answer to "is this
             broken?" — the trace is not moving, but the wait plainly is, and it is
             their scrolling that is moving it. That turns a stop into a dial, which is
             the reference sites' own grammar. */
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = colours.live;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, cy, r, -Math.PI / 2, -Math.PI / 2 + wait * Math.PI * 2);
          ctx.stroke();

          // Breathing, so a held page is never a still one.
          const pulse = f.reduced ? 0.6 : 0.5 + 0.32 * Math.sin(f.now / 360);
          ctx.globalAlpha = alpha * pulse;
          ctx.fillStyle = colours.live;
          ctx.beginPath();
          ctx.arc(x, cy, 3.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // ── the mark landing ──────────────────────────────────────────────────
        if (seal > 0) {
          ctx.globalAlpha = (1 - seal) * 0.55;
          ctx.strokeStyle = colours.deep;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.arc(x, gy, 13 + 22 * seal, 0, Math.PI * 2);
          ctx.stroke();

          ctx.globalAlpha = seal;
          ctx.fillStyle = colours.deep;
          ctx.beginPath();
          ctx.arc(x, gy, 5 * (1 + 1.8 * (1 - seal)), 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // ── the words ─────────────────────────────────────────────────────────
        if (p < SIGNING) setState("waiting", FILM_GATE.waiting);
        else if (p < RUN_ENDS) setState("signed", FILM_GATE.signed);
        else setState("released", FILM_GATE.released);
        setHint(clamp01((wait - 0.18) / 0.25) * (1 - seal));

        // ── release ───────────────────────────────────────────────────────────
        if (run <= 0) return null;
        if (run >= 1) return gy; // the spine takes the line on from here
        ctx.strokeStyle = colours.ink;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, gy);
        ctx.lineTo(x, gy + (f.h + 20 - gy) * run);
        ctx.stroke();
        return null;
      },
    });

    return off;
  }, []);

  return (
    <ScrollScene id={SCENE} screens={4} screensSm={3} className="film-gate">
      <div ref={innerRef} className="film-gate-inner" data-state="waiting">
        <div className="film-copy">
          <p className="film-eyebrow">{FILM_GATE.eyebrow}</p>
          <h2 className="film-heading">{FILM_GATE.heading}</h2>
          {/* `why.ts`, verbatim: approval checkpoints and audit trails as defaults,
              because the buyers answer to regulators. That sentence is what this beat
              is a picture of, and it belongs to all three practices rather than to the
              AI one — which is why it replaced the paragraph that used to be here. */}
          <p className="film-lede">{GOVERNED?.description}</p>
        </div>

        {/* Zero-height, and the only thing that says where the checkpoint is. The bar
            is drawn on it, and the layout above and below it is ordinary flow. */}
        <div ref={lineRef} className="film-gate-line" aria-hidden="true" />

        <div className="film-gate-foot">
          {/* The only text that changes, and the reason a screen reader is told the
              page is waiting rather than left with a heading and silence. */}
          <p ref={statusRef} className="film-gate-status" aria-live="polite">
            {FILM_GATE.waiting}
          </p>
          <p ref={hintRef} className="film-gate-hint">
            {FILM_GATE.hint}
          </p>
        </div>
      </div>
    </ScrollScene>
  );
}
