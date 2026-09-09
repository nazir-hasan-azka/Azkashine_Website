/**
 * The floor's own labels, and there are deliberately very few of them.
 *
 * The floor is the spatial scene at the top of `/products/` — eight coded product
 * interfaces standing in a room, turned by scroll. Every sentence a visitor reads on a
 * panel already exists elsewhere: the product's `name` and `tagline` from `products.ts`,
 * the practice's `navLabel` from `taxonomy.ts`. What is here is the furniture around them.
 *
 * IT USED TO BE `lib/content/ecosystem.ts`, for a route called `/ecosystem/` that no
 * longer exists. The scene moved onto the products page on 2026-09-09 and the route was
 * deleted — a page whose whole content was "the eight products" was carrying a second copy
 * of the product index, and the strongest asset in the repo was sitting behind a word
 * nobody would navigate to. The page-level copy went with the route; `PRODUCTS_PAGE` in
 * `routes.ts` owns the title and the lede now.
 *
 * THE SAME TEST APPLIES AS `film.ts`: if a new sentence describes what Azkashine does, it
 * belongs in the content layer where a deck backs it, or it should not be written. Nothing
 * here makes a claim.
 */

export const FLOOR = {
  /** Names the scene for assistive technology. Not shown. */
  label: "Every product, in the room",

  /** Sits above the floor and says what the scroll does. An instruction, not a claim. */
  hint: "Scroll. Each product comes forward in turn.",

  /** Reads "03 / 08" beside the practice name on the panel in focus. */
  counterSeparator: "/",

  /** Read out when the floor brings a new product forward. */
  announce: "In focus",

  openLabel: "Open",

  /** The link out of chapter 04 on the home page, which now lands on `/products/`. */
  onward: {
    label: "See the whole floor",
    line: "All of it at once, at depth.",
    cta: "All eight products",
  },
} as const;
