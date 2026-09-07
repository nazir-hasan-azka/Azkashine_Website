"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Skewed-tile backdrop, ported from the previous Azkashine site.
 *
 * The original used framer-motion for the hover pulse. This version does it with a CSS
 * keyframe instead, so the effect ships with no animation dependency — the tile under the
 * cursor lights up and fades out, and removes itself on `animationend`.
 *
 * The geometry (96 wide, 160 tall, -32px x-shift per row) has to stay in step between the
 * `<pattern>` path, the block transform, and the hit-test maths below, or the highlight
 * lands on the wrong tile.
 */

const TILE_W = 96;
const TILE_H = 160;
const SKEW = 32;

function Block({
  x,
  y,
  className,
  onAnimationEnd,
}: {
  x: number;
  y: number;
  className?: string;
  onAnimationEnd?: () => void;
}) {
  return (
    <path
      transform={`translate(${-SKEW * y + TILE_W * x} ${TILE_H * y})`}
      className={className}
      onAnimationEnd={onAnimationEnd}
      d="M45.119 4.5a11.5 11.5 0 0 0-11.277 9.245l-25.6 128C6.82 148.861 12.262 155.5 19.52 155.5h63.366a11.5 11.5 0 0 0 11.277-9.245l25.6-128c1.423-7.116-4.02-13.755-11.277-13.755H45.119Z"
    />
  );
}

/** A few tiles are filled by default so the pattern reads even before anyone hovers. */
const STATIC_BLOCKS: [number, number][] = [
  [1, 1],
  [2, 2],
  [4, 3],
  [6, 2],
  [7, 4],
  [5, 5],
];

export function GridPattern({
  yOffset = 0,
  interactive = false,
  className,
}: {
  yOffset?: number;
  interactive?: boolean;
  className?: string;
}) {
  const id = useId();
  const ref = useRef<SVGSVGElement>(null);
  const current = useRef<[number, number] | null>(null);
  const counter = useRef(0);
  const [hovered, setHovered] = useState<[number, number, number][]>([]);

  useEffect(() => {
    if (!interactive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Pointer-driven, so skip it entirely on touch devices.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    function onMouseMove(event: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      // Undo the pattern's centring and skew to find which tile the cursor is over.
      x = x - rect.width / 2 - SKEW;
      y = y - yOffset;
      x += Math.tan(SKEW / TILE_H) * y;
      x = Math.floor(x / TILE_W);
      y = Math.floor(y / TILE_H);

      if (current.current?.[0] === x && current.current?.[1] === y) return;
      current.current = [x, y];

      setHovered((blocks) => {
        const key = counter.current++;
        return [...blocks, [x, y, key] as [number, number, number]].filter(
          (b) => !(b[0] === x && b[1] === y && b[2] !== key),
        );
      });
    }

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [yOffset, interactive]);

  return (
    <svg ref={ref} aria-hidden="true" className={className}>
      <rect width="100%" height="100%" fill={`url(#${id})`} strokeWidth="0" />
      <svg x="50%" y={yOffset} strokeWidth="0" className="overflow-visible">
        {STATIC_BLOCKS.map(([x, y]) => (
          <Block key={`${x}-${y}`} x={x} y={y} />
        ))}
        {hovered.map(([x, y, key]) => (
          <Block
            key={key}
            x={x}
            y={y}
            className="tile-pulse"
            onAnimationEnd={() =>
              setHovered((blocks) => blocks.filter((b) => b[2] !== key))
            }
          />
        ))}
      </svg>
      <defs>
        <pattern
          id={id}
          width={TILE_W}
          height={TILE_H * 3}
          x="50%"
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(0 ${yOffset})`}
          fill="none"
        >
          <path d="M128 0 98.572 147.138A16 16 0 0 1 82.883 160H13.117a16 16 0 0 0-15.69 12.862l-26.855 134.276A16 16 0 0 1-45.117 320H-116M64-160 34.572-12.862A16 16 0 0 1 18.883 0h-69.766a16 16 0 0 0-15.69 12.862l-26.855 134.276A16 16 0 0 1-109.117 160H-180M192 160l-29.428 147.138A15.999 15.999 0 0 1 146.883 320H77.117a16 16 0 0 0-15.69 12.862L34.573 467.138A16 16 0 0 1 18.883 480H-52M-136 480h58.883a16 16 0 0 0 15.69-12.862l26.855-134.276A16 16 0 0 1-18.883 320h69.766a16 16 0 0 0 15.69-12.862l26.855-134.276A16 16 0 0 1 109.117 160H192M-72 640h58.883a16 16 0 0 0 15.69-12.862l26.855-134.276A16 16 0 0 1 45.117 480h69.766a15.999 15.999 0 0 0 15.689-12.862l26.856-134.276A15.999 15.999 0 0 1 173.117 320H256M-200 320h58.883a15.999 15.999 0 0 0 15.689-12.862l26.856-134.276A16 16 0 0 1-82.883 160h69.766a16 16 0 0 0 15.69-12.862L29.427 12.862A16 16 0 0 1 45.117 0H128" />
        </pattern>
      </defs>
    </svg>
  );
}
