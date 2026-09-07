import type { ReactNode } from "react";
import { Spine } from "@/components/site/Spine";
import { cn } from "@/lib/utils";

/**
 * The frame every inner route sits in.
 *
 * It exists so seventeen pages cannot each invent their own margins. It carries the
 * spine, the gutter, and the indent past the spine — the three things that have to be
 * identical on every route for the site to read as one site.
 *
 * `Section` and `SectionHead` below are the only other structural pieces. A route that
 * needs something else says so; a route that quietly sets its own padding is the drift
 * `.claude/rules/styles.md` records.
 */
export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="page">
      <Spine />
      {children}
    </div>
  );
}

/**
 * One band of a route.
 *
 * `tone` is the only variation, and there are two: paper, and the tinted ground that
 * separates one band from the next. Alternating them is what the previous site did with
 * `bg-surface-2`, and it is still the cheapest way to make a long page legible.
 */
export function Section({
  id,
  tone = "paper",
  labelledBy,
  className,
  children,
}: {
  id?: string;
  tone?: "paper" | "tint" | "deep";
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-tone={tone}
      aria-labelledby={labelledBy}
      className={cn("band", className)}
    >
      <div className="band-inner">{children}</div>
    </section>
  );
}

/**
 * A section's heading, with the oversized ghost word behind it.
 *
 * TYPE AS TONE, and this is where it earns its place. `ghost` is set at
 * `--text-display-lg` in a grey a shade off the paper, so it reads as texture and
 * structure rather than as a headline competing with the real one. Copula builds an
 * entire site out of this move and no second colour.
 *
 * It is `aria-hidden` and it is clipped by the band, because an oversized word that can
 * push a 320px viewport sideways is a horizontal scrollbar, and standard 1 does not
 * care how good it looked at 1440.
 */
export function SectionHead({
  id,
  ghost,
  eyebrow,
  title,
  lede,
  level = 2,
}: {
  id?: string;
  ghost?: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  level?: 2 | 3;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div className="sh">
      {ghost && (
        <span aria-hidden="true" className="sh-ghost">
          {ghost}
        </span>
      )}
      <div className="sh-body reveal-group">
        {eyebrow && <p className="sh-eyebrow">{eyebrow}</p>}
        <Heading id={id} className="sh-title">
          {title}
        </Heading>
        {lede && <p className="sh-lede">{lede}</p>}
      </div>
    </div>
  );
}
