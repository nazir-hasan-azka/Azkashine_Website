"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Plays a coded product screen once, the first time it comes into view: its rows, cards
 * and chat bubbles (`[data-live-step]`) arrive one after another, then its status pills
 * (`[data-live-pop]`) pop in. Added 2026-10-07 to give the home page some life without
 * holding the scroll.
 *
 * NOTHING IS HIDDEN UNTIL THIS RUNS. The server renders the screen complete, so a crawler,
 * a visitor without JavaScript, and anyone who prefers reduced motion all see the finished
 * screen. Only once mounted, and only if the screen is not yet on screen, does it arm
 * (hide the steps) — then plays when it arrives.
 */
export function LiveOnView({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Number the steps and pops in document order, so the stylesheet can stagger them.
    const steps = el.querySelectorAll<HTMLElement>("[data-live-step]");
    steps.forEach((s, i) => s.style.setProperty("--n", String(i)));
    el.querySelectorAll<HTMLElement>("[data-live-pop]").forEach((p, i) =>
      p.style.setProperty("--p", String(i)),
    );
    el.style.setProperty("--steps", String(steps.length));
    el.dataset.live = "armed";

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          // One frame in the armed state first, so the transition has a start to run from.
          requestAnimationFrame(() => {
            el.dataset.live = "on";
          });
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="live" data-live="idle">
      {children}
    </div>
  );
}
