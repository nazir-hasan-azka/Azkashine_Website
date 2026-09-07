import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A thing that appears at a point in its scene, driven entirely by CSS.
 *
 * `--p` is on the stage and every child inherits it, so a row can compute its own
 * opacity from the scene's progress with no JavaScript per element at all:
 *
 *     --k: clamp(0, (var(--p) - var(--at)) / var(--span), 1)
 *
 * Custom properties substitute as tokens, so that whole expression lands inside the
 * `opacity` and `transform` declarations and the compositor does the rest. Twelve
 * capability rows ruling themselves in one at a time is twelve of these and zero
 * subscriptions — the alternative is twelve React components re-rendering on scroll,
 * which is the thing `DIRECTION.md` puts in bold.
 *
 * `--p` DEFAULTS TO 1, not 0. With no JavaScript, no support for the loop, or reduced
 * motion, every beat resolves to its finished state and the chapter is simply a page of
 * content — which is tier one of the three in `DIRECTION.md`, and the reason this is
 * safe to use for content rather than only for decoration.
 */
export function Beat({
  at,
  span = 0.06,
  as: Tag = "div",
  className,
  children,
}: {
  /** Scene progress at which this starts arriving, 0 to 1. */
  at: number;
  /** How much progress it takes to arrive. */
  span?: number;
  as?: "div" | "li" | "p" | "span" | "article";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn("beat", className)}
      style={{ "--at": at, "--span": span } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/**
 * The chapter number and title on the spine.
 *
 * DOM rather than canvas, deliberately. It is type, it never moves, and it has to be
 * readable by a screen reader — three reasons it does not belong in a bitmap. The trace
 * passes behind it and the tick is a border, so the whole marker costs one element.
 */
export function ChapterMark({ number, title }: { number: string; title: string }) {
  return (
    <p className="chmark">
      <span className="chmark-n">{number}</span>
      <span className="chmark-t">{title}</span>
    </p>
  );
}
