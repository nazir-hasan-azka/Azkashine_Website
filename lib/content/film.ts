/**
 * The copy for what remains of the scroll film: the products' sideways traverse, which
 * the home page still runs. The film's other chapters, and their copy, were retired on
 * 2026-10-07 when the home page was rebuilt for an enterprise reader — see
 * `components/home/HomeBody.tsx`. Every product sentence comes from `products.ts`.
 */

/**
 * Chapter 04 — the products, travelling.
 *
 * The lede names things on purpose. It used to say the interfaces were "drawn as code
 * rather than screenshots", which is a fact about how this website was built and of no
 * interest to anyone visiting it. What replaced it is evidence, and every item in it is
 * already in `products.ts` with a `deckPage`: the regulator list is deck p8, the model
 * list deck p9, weeks-to-hours deck p15. Nothing here is a new claim.
 *
 * It also names a product from both practices, which is the cheapest guard there is
 * against the home page reading as an AI-agent company with a side practice.
 */
export const FILM_RUNNING = {
  chapter: "04",
  title: "Eight products",
  heading: "Eight products in production",
  lede: "Purpose-built platforms for audit and compliance, AI agents, conversational AI, cloud operations, whistleblowing and hiring, each in use today.",
  sourceHint: "Every claim here shows the deck page it came from.",
} as const;

