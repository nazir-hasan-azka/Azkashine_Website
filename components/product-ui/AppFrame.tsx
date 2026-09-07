import { cn } from "@/lib/utils";

/**
 * Coded product UI, not screenshots.
 *
 * There is no usable product imagery in the source material — the only real screens in
 * the decks are 1152x648 and 586x287, and every high-resolution asset is stock. So the
 * product visuals are built in markup instead, the way Linear and Stripe do it: sharp at
 * any DPI, zero image weight, automatically on-brand, and animatable.
 *
 * These are representative of each product's interface, drawn from what the decks
 * describe. They are illustrative UI, not literal captures of shipped screens.
 */

export function AppFrame({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[16px] border border-border-strong bg-white shadow-[0_18px_50px_-12px_rgba(15,17,37,0.18)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <Dot className="bg-accent-pink/60" />
          <Dot className="bg-accent-yellow/70" />
          <Dot className="bg-accent-green" />
        </span>
        <span className="ml-2 truncate text-xs font-medium text-muted">{title}</span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function Dot({ className }: { className?: string }) {
  return <span className={cn("block h-2.5 w-2.5 rounded-full", className)} />;
}

/* ── Primitives shared by the product visuals ─────────────────────────────── */

export function Kpi({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3">
      <p className="text-[11px] font-medium text-muted">{label}</p>
      <p className="mt-1 text-xl font-bold leading-none text-ink">{value}</p>
      {delta && <p className="mt-1 text-[11px] font-semibold text-brand">{delta}</p>}
    </div>
  );
}

/** Simple CSS bar chart. Heights are percentages, so it scales with the container. */
export function BarChart({ bars, className }: { bars: number[]; className?: string }) {
  return (
    <div className={cn("flex h-24 items-end gap-1.5", className)} aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className="flex-1 rounded-t-[3px] bg-brand/70"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "pass" | "warn" | "brand";
}) {
  const tones = {
    neutral: "bg-surface text-muted border-border",
    pass: "bg-accent-green/40 text-ink border-accent-green",
    warn: "bg-accent-yellow/30 text-ink border-accent-yellow/60",
    brand: "bg-brand/15 text-blue-900 border-brand/40",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Row({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-border py-2.5 last:border-b-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Left-hand app rail, used by the dashboard-style visuals. */
export function Rail({ items, active = 0 }: { items: string[]; active?: number }) {
  return (
    <nav className="hidden w-32 shrink-0 border-r border-border pr-3 sm:block" aria-hidden="true">
      <ul className="space-y-1">
        {items.map((label, i) => (
          <li
            key={label}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-[11px] font-medium",
              i === active ? "bg-brand/15 text-blue-900" : "text-muted",
            )}
          >
            {label}
          </li>
        ))}
      </ul>
    </nav>
  );
}
