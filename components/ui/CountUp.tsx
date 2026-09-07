"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates the numeric part of a stat when it scrolls into view.
 *
 * Values arrive as display strings — "9", "10x", "80%", "100k+", "99.9%", "<5ms" — so the
 * prefix and suffix are preserved and only the number counts up. The server renders the
 * final value, which keeps it correct for search engines and for anyone without JS.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/^([^\d.]*)([\d.]+)(.*)$/);
    if (!match) return; // no number in it — leave as-is
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = (numStr.split(".")[1] || "").length;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || done.current) continue;
          done.current = true;
          observer.disconnect();

          const duration = 1100;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            // easeOutCubic — fast, then settles
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`);
            if (t < 1) requestAnimationFrame(tick);
            else setDisplay(value);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
