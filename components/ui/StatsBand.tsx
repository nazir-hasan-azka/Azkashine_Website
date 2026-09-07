import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";

export interface Stat {
  value: string;
  label: string;
}

/**
 * Volume-signal band. Used where the content set gives real figures — never padded with
 * invented client counts or ROI claims.
 */
export function StatsBand({
  stats,
  tone = "light",
}: {
  stats: Stat[];
  tone?: "light" | "brand";
}) {
  const isBrand = tone === "brand";
  return (
    <section
      className={
        isBrand
          ? "bg-blue-900 py-10 text-white lg:py-14"
          : "border-y border-border bg-surface py-10 lg:py-14"
      }
    >
      <Container>
        {/* Column count follows the number of figures — AgentOS and Cloud Orchestration
            carry a single real metric each, and one value stranded in a four-column grid
            reads as a rendering fault. */}
        <dl
          className={`reveal-group grid gap-8 sm:gap-10 ${
            stats.length === 1
              ? "grid-cols-1"
              : stats.length === 2
                ? "grid-cols-2"
                : "grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <CountUp
                  value={s.value}
                  className={`block text-3xl font-bold leading-none tabular-nums sm:text-4xl lg:text-[44px] ${
                    isBrand ? "text-white" : "text-ink"
                  }`}
                />
                <span
                  className={`mt-2 block text-sm lg:text-base ${
                    isBrand ? "text-white/75" : "text-muted"
                  }`}
                >
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
