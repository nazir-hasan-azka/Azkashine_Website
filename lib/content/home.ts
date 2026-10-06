/**
 * Home page hero copy.
 *
 * Lifted out of the component so the site's most-read sentence lives in the content
 * layer with everything else. The words are unchanged from the previous hero — the
 * message was signed off; only what it sits on has changed.
 */
export const HOME_HERO = {
  eyebrow: "AI & automation · Digital platforms",
  /** Set as two mask lines. Sized so each holds on one line from lg up. */
  headingLine1: "Transform your business with",
  headingAccent: "AI-powered",
  headingLine2: "intelligence",
  lede: "We build intelligent systems, automation workflows, and AI agents that streamline operations, reduce costs, and unlock exponential growth.",
  primary: { label: "Explore our products", href: "/products/" },
  secondary: { label: "Book a demo", href: "/contact/" },
} as const;

/**
 * THE HOME PAGE BELOW THE HERO, rewritten 2026-10-07 for an enterprise reader.
 *
 * Management found the previous page, the scroll "film", slow and unclear: about 24 of
 * its 29 desktop screens held the scroll while labels narrated an animation ("Ruled
 * out", "Awaiting approval", "Keep scrolling"). This page scrolls normally, in about a
 * third of the length, and every line says what Azkashine does or what it delivers.
 * The wording was reviewed line by line in the copy document of 2026-10-07. Practice,
 * capability, product and industry lines come from `taxonomy.ts`, `products.ts` and
 * `industries.ts`; only the page's own headings live here.
 */
export const HOME_PAGE = {
  whatWeDo: {
    eyebrow: "What we do",
    title: "Two practices, seven capabilities and eight products in production.",
    more: "More on",
  },
  products: {
    eyebrow: "Our products",
    /* The heading and lede are `FILM_RUNNING`'s, which the traverse renders. */
  },
  why: {
    eyebrow: "Why Azkashine",
    title: "Proven in production.",
    points: [
      {
        title: "In production",
        body: "Our products are in use today, from regulator-ready financial filings to agentic workflows and hiring platforms.",
      },
      {
        title: "Built and run in-house",
        body: "We build the software and operate the cloud beneath it, on AWS, Azure or GCP.",
      },
      {
        /* "Partners", not "teams": the fifteen partners in `clients.ts` are what is on
           record in these regions. */
        title: "Delivering across regions",
        body: "With partners across India, the Middle East, Europe and the US.",
      },
      {
        title: "Governed by default",
        body: "Approval checkpoints, audit trails and role-based access in every platform we deliver.",
      },
    ],
  },
  services: {
    eyebrow: "Services",
    title: "We build, run and validate what we deliver.",
    /* The industries, as one line under the services. Kept at Nazir's request when the
       home page's industries section became services (2026-10-07); the link that
       followed it was removed at his request the same day. */
    industriesLead: "Serving",
  },
} as const;
