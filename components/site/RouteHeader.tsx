import Link from "next/link";

/**
 * The opening of every inner route: breadcrumb, optional eyebrow, title, lede.
 *
 * TYPE AS A GRAPHIC OBJECT. The title is set at `--text-display-sm` — a step above
 * everything else on the page and fluid between 44px and 80px — and it is cropped by
 * the frame on the left, sitting on the spine rather than politely inside a column.
 * That is Copula's lesson applied where it belongs: the largest thing on a route page
 * should be the name of the page, not a decoration next to it.
 *
 * The words arrive a line at a time. `.reveal-group` is the site's existing scroll-driven
 * reveal — CSS `animation-timeline: view()`, no observer, no JavaScript — and with no
 * support or `prefers-reduced-motion` it resolves to the finished state, which is what
 * makes it safe to use on the first thing a visitor sees.
 *
 * ONE SIGNATURE MOMENT PER PAGE. This is not it. The header is ambient: it moves once,
 * quietly, and then holds. Anything louder here spends the page's whole motion budget
 * before the content starts.
 */
export function RouteHeader({
  crumbs,
  eyebrow,
  title,
  lede,
}: {
  /** Root to leaf. The last one is the current page and carries no href. */
  crumbs: { label: string; href?: string }[];
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="rh">
      <nav aria-label="Breadcrumb" className="rh-crumbs">
        <ol>
          {crumbs.map((crumb, i) => (
            <li key={crumb.label}>
              {crumb.href ? (
                <Link href={crumb.href}>{crumb.label}</Link>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
              {i < crumbs.length - 1 && (
                <span aria-hidden="true" className="rh-sep">
                  /
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="rh-body reveal-group">
        {eyebrow && <p className="rh-eyebrow">{eyebrow}</p>}
        <h1 className="rh-title">{title}</h1>
        {lede && <p className="rh-lede">{lede}</p>}
      </div>
    </header>
  );
}
