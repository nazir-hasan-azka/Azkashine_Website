/**
 * Route-level copy — the headings, ledes and section labels for the seventeen pages.
 *
 * All of it was hard-coded inside the previous app's route files, which meant
 * `standards.mjs` had never read a word of it. It lives here now, with the rest.
 *
 * CORRECTED ON THE WAY ACROSS. The old copy said "nine products" in five places and
 * listed visitor management among them. Community Connect was removed on 2026-09-06, so
 * every count here is EIGHT and the capability lists no longer name it. Counts are
 * derived from `PRODUCTS` where a sentence can carry a variable, so this cannot drift
 * again — a number written as a word in a sentence is a number nobody updates.
 *
 * THE THREE PRACTICES READ EQUAL. The products split 5 / 2 / 1 across them, which is a
 * fact and not something to hide, but no sentence here presents AI as the main event and
 * the other two as the remainder. Where a count would do that, the sentence counts
 * capabilities instead — those are four, four and four.
 */

import { PRODUCTS } from "./products";

/** Written as digits nowhere: a sentence needs the word. Derived, so it cannot go stale. */
const COUNT_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
] as const;
const productCount = COUNT_WORDS[PRODUCTS.length] ?? String(PRODUCTS.length);

export const WHAT_WE_DO_PAGE = {
  metaTitle: "What we do",
  metaDescription:
    "Twelve capabilities across three practices: AI & Automation, Digital Platforms, and Cloud Services & Testing.",
  crumb: "What we do",
  title: "What we do",
  lede: "Three practices, four capabilities each — and the products built on top of them.",
  /** Prefix for the link into a practice. The practice name completes it. */
  moreOn: "More on",
  productsLabel: "Products",
  /** Shown where a practice has no product of its own yet. Honest, not padded. */
  noProducts: "No product in this practice yet — this is service work.",
} as const;

export const CATEGORY_PAGE = {
  eyebrow: "What we do",
  capabilitiesHeading: "Capabilities",
  productsHeading: "Products in this practice",
  workHeading: "Platforms we have built",
  workLede: "Delivered client platforms, not products in our own line.",
  siblingsHeading: "The other two practices",
} as const;

export const PRODUCTS_PAGE = {
  metaTitle: "Products",
  metaDescription:
    "Eight platforms built and operated by Azkashine — AI analytics, financial compliance and XBRL automation, agentic AI, whistleblowing and ethics, cloud orchestration, and blue-collar hiring.",
  crumb: "Products",
  title: "Products",
  lede: `${
    productCount.charAt(0).toUpperCase() + productCount.slice(1)
  } platforms, grouped by the practice they belong to. Each one is built, run, and supported by Azkashine.`,
  learnMore: "Learn more",
  /** The audit interaction. Hovering or focusing a product reveals where it came from. */
  sourceLabel: "Source",
} as const;

export const PRODUCT_PAGE = {
  problemHeading: "The problem",
  whatItDoesHeading: "What it does",
  outcomesHeading: "Business outcomes",
  /** Caption under a coded interface, so nobody reads it as a screenshot of live data. */
  visualCaption: "Representative interface, drawn as code.",
  partOf: "Part of",
  demoHeading: "in action",
  demoLede:
    "We will walk you through it against a problem you actually have, and tell you plainly whether it fits.",
  demoPrimary: "Request a walkthrough",
  demoTry: "Try it",
  sourceLabel: "Source",
} as const;

export const INDUSTRIES_PAGE = {
  metaTitle: "Industries",
  metaDescription:
    "Telecom, public sector, manufacturing, and energy — the sectors Azkashine builds and operates software for.",
  crumb: "Industries",
  title: "Industries",
  lede: "Four sectors where operational complexity is high and the cost of getting software wrong is measured in more than money.",
  capabilitiesHeading: "Capabilities applied",
  practiceLink: "Explore the practice",
  productsHeading: "Relevant products",
} as const;

/**
 * The three reasons, which `why.ts` has carried since the start and which no page has
 * ever rendered the evidence of. `REASONS[].evidence` and `REASONS[].products` are the
 * proof behind each claim; showing them is what makes the section checkable rather than
 * a set of assertions.
 */
export const WHY_SECTION = {
  eyebrow: "Why us",
  heading: "Three things you can check",
  lede: "Rather than three things we believe about ourselves.",
  evidenceLabel: "Evidenced by",
  productsLabel: "Proved by",
} as const;

/**
 * The 404 page.
 *
 * A lost visitor wants somewhere to go, not an apology. These are the three places
 * that are actually useful from a dead end, and "home" is not one of them — somebody
 * who mistyped a product URL wants the product list, not the front door.
 */
export const NOT_FOUND = {
  metaTitle: "Page not found",
  code: "404",
  title: "That page is not here",
  lede: "The link may be old, or the address slightly off. These are the places worth trying.",
  links: [
    { label: "All products", href: "/products/" },
    { label: "What we do", href: "/what-we-do/" },
    { label: "Talk to us", href: "/contact/" },
  ],
} as const;
