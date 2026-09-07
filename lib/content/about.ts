/**
 * The about page's own copy.
 *
 * Lifted out of the previous app's `app/about/page.tsx`, where it was hard-coded in the
 * route. The project rule is that no sentence lives in a route file — `standards.mjs`
 * only reads `lib/content/`, so copy left in a route is copy nothing is checking.
 *
 * Only the page's own headings are here. Everything the page says about the company is
 * already in `site.ts` — `AT_A_GLANCE`, `VISION`, `MISSION`, `VALUES` and `CHAIRMAN`,
 * all with deck provenance in that file's header — and this does not repeat a word of it.
 *
 * TWO THINGS A READER SHOULD KNOW, carried across from the old route rather than lost:
 *
 *   - The `about-meeting` image is deliberately architecture, not a person. What belongs
 *     in that slot is a portrait of the Chairman, once one is supplied.
 *   - `VALUES` titles are Title Case ("Trusted Team", "Customer Centric") against the
 *     site's sentence-case rule. They are verbatim from deck p3, so they are treated as
 *     names rather than as headings. Worth a word from Nazir; not worth silently editing
 *     a deck.
 */

import { SITE } from "./site";

export const ABOUT = {
  metaTitle: "About",
  metaDescription:
    "Azkashine Software and Services Private Limited — a Bengaluru-based IT software and services company building AI products, digital platforms, and cloud engineering services.",
  crumb: "About",
  title: "About Azkashine",
  /* The old metadata said "IT software and services company" and the lede said
     "software and services company". Kept as the lede had it; the meta line is the
     deck's own phrasing and stays. */
  lede: `${SITE.legalName} is a Bengaluru-based software and services company building AI products, digital platforms, and the cloud engineering to run them.`,
  glanceHeading: "At a glance",
  visionMissionHeading: "Vision and mission",
  visionHeading: "Our vision",
  missionHeading: "Our mission",
  valuesHeading: "What we value",
  chairmanHeading: "A note from our Chairman",
} as const;

/**
 * The closing block that ended the about page, and which every route below the home
 * page now ends with.
 *
 * It says what a first conversation is actually like rather than asking for a demo,
 * which is the one thing on a vendor site a buyer cannot get from a competitor's.
 */
export const CTA = {
  heading: "Tell us what you’re trying to solve",
  lede: "Bring us the problem, not a specification. We’ll tell you which of our products fits, what we’d have to build, or whether you’d be better served elsewhere.",
  primary: { label: "Talk to us", href: "/contact/" },
  secondary: { label: "See the products", href: "/products/" },
} as const;
