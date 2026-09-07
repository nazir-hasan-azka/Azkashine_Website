/**
 * The three strings the company routes need that no existing content file owns.
 *
 * `/industries/`, `/about/` and `/contact/` say everything else out of `routes.ts`,
 * `about.ts`, `contact.ts` and `site.ts`. This file exists only so those three routes
 * hold no sentence of their own — the project rule is that `standards.mjs` reads
 * `lib/content/` and nothing else, so a word left in a route is a word nothing checks.
 *
 * It is deliberately this small. If it starts collecting page copy, the copy belongs in
 * the file that owns the page.
 */

/** The root breadcrumb, on every inner route. The nav hard-codes its own copy of this. */
export const CRUMB_HOME = "Home";

/**
 * The watermark words behind two of the about page's section heads.
 *
 * `SectionHead`'s `ghost` is set at `--text-display-lg` and does not wrap, so it has to
 * be ONE short word — the visible heading it sits behind ("What we value", "A note from
 * our Chairman") is far too long to use as its own watermark. It is `aria-hidden`, so
 * these are texture rather than copy, which is why there are only two of them.
 */
export const ABOUT_GHOST = {
  values: "Values",
  chairman: "Chairman",
} as const;
