/**
 * The few words `/what-we-do/` and the three practice pages need that `routes.ts` does
 * not already carry.
 *
 * Deliberately short. Everything those two routes say about a practice — its name,
 * tagline, intro, and the four capabilities under it — comes from `taxonomy.ts`, and
 * everything they say about themselves comes from `WHAT_WE_DO_PAGE` and `CATEGORY_PAGE`
 * in `routes.ts`. What is left is three labels that had nowhere else to live.
 *
 * THE THREE PRACTICES READ EQUAL. `practiceEyebrow` is one string used above all three
 * headings rather than three numbered ones, because an ordinal above a practice is a
 * ranking to anyone scanning the page, and the products split 5 / 2 / 1 gives that
 * reading somewhere to land. Same word, same size, three times.
 */

export const PRACTICE_PAGES = {
  /** The first breadcrumb on every inner route. The Navbar has its own copy of it. */
  homeCrumb: "Home",
  /** Above each practice name. Identical for all three, on purpose — see above. */
  practiceEyebrow: "Practice",
  /** Above the pill list on a delivered client platform. */
  workIncludesLabel: "Includes",
} as const;
