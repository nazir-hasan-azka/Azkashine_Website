"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { registerScene } from "@/lib/film/loop";

/**
 * The scene unit, and there is only one of them.
 *
 * A tall wrapper whose HEIGHT IS THE DURATION, holding one viewport-tall child at
 * `position: sticky; top: 0`. Nothing is pinned by JavaScript and no library is
 * involved — this is what foodnia.co.jp is built from and what `WhatWeDo.tsx` already
 * does with its card deck.
 *
 * The only thing the JavaScript adds is a number: the single loop in `lib/film/loop.ts`
 * writes `--p`, 0 to 1, onto the stage. CSS reads it directly; canvas segments read the
 * same value through the scene id.
 *
 * `screens` is in viewport heights, and the scene gets `screens - 1` of them to spend —
 * the last one is the stage standing still on screen at p = 1. Below `lg` the scene can
 * be shorter, because a phone spends real effort on every screen of scroll.
 */
export function ScrollScene({
  id,
  screens,
  screensSm = screens,
  flowBelowLg = false,
  className,
  children,
}: {
  id: string;
  screens: number;
  screensSm?: number;
  /**
   * Below `lg`, stop pinning and let the stage be an ordinary block that scrolls.
   *
   * Some scenes hold more than a phone viewport can show — the ledger is twelve rows
   * and three headings — and a sticky element taller than its scrollport does not pin,
   * it just scrolls, which reads as a bug. `.claude/PLAN.md` records the same finding
   * from the What we do deck. Tier two in `DIRECTION.md` is "scenes shorten"; for these
   * two, shortening means becoming a list.
   */
  flowBelowLg?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;
    return registerScene(id, wrap, stage);
  }, [id]);

  return (
    <div
      ref={wrapRef}
      /* A real id, not just the data attribute: `DIRECTION.md` asks that a moment on
         the film be linkable, and a fragment only scrolls to an element that has one.
         The loop writes the fragment as you pass — see `lib/film/loop.ts`. */
      id={id}
      className="film-scene"
      data-scene={id}
      data-flow={flowBelowLg ? "sm" : undefined}
      style={
        { "--screens": String(screens), "--screens-sm": String(screensSm) } as CSSProperties
      }
    >
      <div ref={stageRef} className={className ? `film-stage ${className}` : "film-stage"}>
        {children}
      </div>
    </div>
  );
}
