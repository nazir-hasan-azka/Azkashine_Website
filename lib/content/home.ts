/**
 * Home page hero copy.
 *
 * Lifted out of the component so the site's most-read sentence lives in the content
 * layer with everything else. The words are unchanged from the previous hero — the
 * message was signed off; only what it sits on has changed.
 */
export const HOME_HERO = {
  eyebrow: "AI & automation · Digital platforms · Cloud services & testing",
  /** Set as two mask lines. Sized so each holds on one line from lg up. */
  headingLine1: "Transform your business with",
  headingAccent: "AI-powered",
  headingLine2: "intelligence",
  lede: "We build intelligent systems, automation workflows, and AI agents that streamline operations, reduce costs, and unlock exponential growth.",
  primary: { label: "Explore our products", href: "/products/" },
  secondary: { label: "Book a demo", href: "/contact/" },
} as const;

/**
 * "What we do" — the section head only.
 *
 * Three strings, because everything else in that section is already written: the practice
 * names, taglines, intros and all twelve capability lines come from `taxonomy.ts`, deck
 * p4 verbatim. Nothing here needs the client to clear it.
 *
 * The lede counts things rather than describing a posture — three practices, twelve
 * capabilities (4 + 4 + 4 in `taxonomy.ts`) and eight products (`PRODUCTS`). Both figures
 * were checked against the tree, not assumed, and the section prints all twelve
 * capabilities underneath, so a reader can verify the sentence on the page it sits on.
 * A competitor can print "we start from the outcome"; they cannot print this.
 */
export const HOME_WHAT_WE_DO = {
  eyebrow: "Practices",
  heading: "What we do",
  lede: "Three practices, twelve capabilities, and the eight products built on them.",
  /** Suffix after the practice name: "AI & Automation in detail →". */
  linkSuffix: "in detail",
} as const;
