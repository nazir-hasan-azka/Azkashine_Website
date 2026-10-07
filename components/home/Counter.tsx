"use client";

import { useEffect, useRef } from "react";

/**
 * A number that counts up from zero the first time it comes into view.
 *
 * The server renders the real value, so the number is correct for a crawler, without
 * JavaScript, and under reduced motion. It only drops to zero once mounted and only while
 * still below the window, so nobody ever sees a wrong number sitting still.
 */
export function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only count up for a number the visitor has yet to scroll to. One already in view,
    // or already scrolled past (a reload mid-page), keeps its real value.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.textContent = "0";
    let frame = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const DURATION = 1100;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = String(Math.round(value * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = String(value);
    };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
