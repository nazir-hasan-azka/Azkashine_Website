/**
 * Route-level copy — the headings, ledes and section labels for every page.
 *
 * All of it was hard-coded inside the previous app's route files, which meant
 * `standards.mjs` had never read a word of it. It lives here now, with the rest.
 *
 * Counts are derived from `PRODUCTS` where a sentence can carry a variable, so they cannot
 * drift — a number written as a word in a sentence is a number nobody updates.
 *
 * TWO PRACTICES FROM 2026-10-06, when Cloud Services & Testing was retired. The products
 * split 5 / 2 between them, which is a fact and not something to hide, but no sentence
 * here presents AI as the main event and the other as the remainder. Where a count would
 * do that, the sentence counts capabilities instead — those are four and four.
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
    "Seven capabilities across two practices: AI & Automation and Digital Platforms.",
  crumb: "What we do",
  title: "What we do",
  lede: "Two practices, seven capabilities — and the products built on top of them.",
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
  siblingsHeading: "The other practice",
} as const;

export const PRODUCTS_PAGE = {
  metaTitle: "Products",
  metaDescription:
    "Eight products built and operated by Azkashine — governed AI agents, conversational AI on WhatsApp and the web, audit intelligence and XBRL automation, cloud orchestration, whistleblowing, and frontline hiring.",
  crumb: "Products",
  title: "Products",
  lede: `${
    productCount.charAt(0).toUpperCase() + productCount.slice(1)
  } platforms, grouped by the practice they belong to. Each one is built, run, and supported by Azkashine.`,
  learnMore: "Learn more",
  /** The coming-soon list under each practice's live products. */
  comingSoon: "Coming soon",
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

/**
 * The page at `/services/`. It was `/industries/` until 2026-10-06, when Nazir renamed it
 * "Services" everywhere; the content — the four sectors — is unchanged, and the old
 * address forwards here from `public/industries/`.
 */
export const SERVICES_PAGE = {
  metaTitle: "Services",
  metaDescription:
    "Telecom, public sector, manufacturing, and energy — the sectors Azkashine builds and operates software for.",
  crumb: "Services",
  title: "Services",
  lede: "Four sectors where operational complexity is high and the cost of getting software wrong is measured in more than money.",
  capabilitiesHeading: "Capabilities applied",
  practiceLink: "Explore the practice",
  productsHeading: "Relevant products",
} as const;

/**
 * The reasons, which `why.ts` has carried since the start and which no page has
 * ever rendered the evidence of. `REASONS[].evidence` and `REASONS[].products` are the
 * proof behind each claim; showing them is what makes the section checkable rather than
 * a set of assertions.
 */
export const WHY_SECTION = {
  eyebrow: "Why us",
  heading: "Two things you can check",
  lede: "Rather than two things we believe about ourselves.",
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
