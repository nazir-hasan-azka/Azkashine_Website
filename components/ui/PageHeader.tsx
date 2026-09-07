import { Container } from "@/components/ui/Container";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { GridPattern } from "@/components/ui/GridPattern";

/**
 * Standard header for interior routes: breadcrumb, optional eyebrow, title, and lede.
 * Keeps every non-home page opening with the same rhythm.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-surface-2">
      {/* Interactive tiles, ported from the previous site — they light up under the
          cursor. Tried the flowing-line motif here instead; it was calmer but static,
          and the header needs something that responds. */}
      <GridPattern
        yOffset={-96}
        interactive
        className="absolute inset-0 -z-10 h-full w-full fill-brand/[0.06] stroke-ink/[0.06] [mask-image:linear-gradient(to_bottom_left,white_45%,transparent_75%)]"
      />
      <Container>
        <div className="py-12 lg:py-20">
          {crumbs && crumbs.length > 0 && <Breadcrumb crumbs={crumbs} />}
          {eyebrow && (
            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-brand">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-[56px]">
            {title}
          </h1>
          {lede && (
            <p className="mt-5 max-w-5xl text-lg leading-relaxed text-muted lg:text-xl">
              {lede}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
