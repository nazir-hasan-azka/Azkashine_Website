/**
 * The film's own copy — and there is deliberately very little of it.
 *
 * REWRITTEN 2026-09-07, because the first version was wrong. It narrated an AI agent
 * weighing options and choosing a path, in sentences nobody at Azkashine had written,
 * and the home page read as an AI-agent company with two side practices. That is the one
 * thing `.claude/BUILD-BRIEF.md` says must not happen, and it happened because the
 * chapters were given prose of their own instead of the company's.
 *
 * SO THE CHAPTERS NO LONGER CARRY HEADINGS OR LEDES. Every sentence a visitor reads on
 * the home page now comes from `taxonomy.ts` — the practice taglines and intros, verbatim
 * from deck p4 — from `products.ts`, from `industries.ts`, or from `why.ts`. What is left
 * in this file is six chapter titles, the labels that name a beat as it happens, and one
 * closing line. Nothing here makes a claim, because nothing here is a sentence about the
 * business at all.
 *
 * THE TEST FOR ANY EDIT TO THIS FILE: if a new sentence describes what Azkashine does,
 * it is in the wrong file. Put it in the content layer where the deck backs it, or do not
 * write it.
 */

/**
 * Chapter 01 — the decision. AI & Automation, and where the trace teaches its own
 * vocabulary: line, branch, gate, mark.
 *
 * The heading and lede are `CATEGORY_BY_SLUG["ai-automation"]`'s own `tagline` and
 * `intro`. The practice already describes itself better than a sentence written for a
 * scroll animation would, and one version of it cannot drift from another.
 */
export const FILM_DECISION = {
  chapter: "01",
  title: "The decision",
  /** Named as the beat happens, and read out to screen readers. Not a story. */
  states: {
    arriving: "Work arrives",
    weighing: "Options considered",
    discarding: "Options discarded",
    chosen: "One path taken",
  },
} as const;

/**
 * The gate. The riskiest idea in `.claude/DIRECTION.md` and the first thing built,
 * because if it reads as a broken page rather than as a beat, the chapter map changes
 * shape.
 *
 * The lede is `REASONS`' "governed" entry from `why.ts`, verbatim — approval checkpoints
 * and audit trails as defaults, because the buyers answer to regulators. That sentence is
 * what the gate is a picture of, and it belongs to all three practices rather than to the
 * AI one.
 *
 * `hint` is the line that decides whether the beat works. A page that stops moving is a
 * page that looks broken, and no amount of animation fixes that — a sentence does. It
 * arrives a moment into the wait, so the stop is felt before it is explained.
 */
export const FILM_GATE = {
  eyebrow: "Approval checkpoint",
  heading: "The work stops for a person",
  /** The three states of the checkpoint, written to the DOM by the film loop. */
  waiting: "Awaiting approval",
  signed: "Approved",
  released: "Approved, and on the record",
  hint: "Keep scrolling. The page is not stuck — the work is.",
} as const;

/**
 * Chapter 02 — the breath.
 *
 * Near-empty on purpose. Everything from the previous act is gone before anything from
 * the next arrives, which is what makes a long scroll survivable and what most imitations
 * of this leave out.
 */
export const FILM_BREATH = {
  chapter: "02",
  title: "What we do",
  line: "Three practices, in equal measure.",
} as const;

/** Chapter 03 — the ledger. All three practices, twelve capabilities, operated by scroll. */
export const FILM_LEDGER = {
  chapter: "03",
  title: "The ledger",
  heading: "What each practice actually covers",
  /** Sits beside the practice name while its rows rule themselves in. */
  countLabel: "capabilities",
} as const;

/**
 * Chapter 04 — the products, travelling.
 *
 * The lede names things on purpose. It used to say the interfaces were "drawn as code
 * rather than screenshots", which is a fact about how this website was built and of no
 * interest to anyone visiting it. What replaced it is evidence, and every item in it is
 * already in `products.ts` with a `deckPage`: the regulator list is deck p8, the model
 * list deck p9, weeks-to-hours deck p15. Nothing here is a new claim.
 *
 * It also names one product from each practice, which is the cheapest guard there is
 * against the home page reading as an AI-agent company with two side practices.
 */
export const FILM_RUNNING = {
  chapter: "04",
  title: "Already running",
  heading: "Eight products, built and operating",
  lede: "Real interfaces from products in use today. Tawthiq generates regulator-ready filings for SOCPA, Tadawul, Q-Disclosure, SEC EDGAR and MCA India. AgentOS orchestrates agents across OpenAI, Gemini and Claude. Cloud Orchestration takes infrastructure onboarding from weeks to hours. All three practices are here.",
  sourceHint: "Every claim here shows the deck page it came from.",
} as const;

/**
 * Chapter 05 — the failure. Cloud Services & Testing, and the only backwards motion.
 *
 * Heading and lede come from `CATEGORY_BY_SLUG["cloud-testing"]`, same as chapter 01.
 */
export const FILM_FAILURE = {
  chapter: "05",
  title: "The failure",
  states: {
    running: "Running",
    failed: "Failed",
    tracing: "Tracing back",
    found: "Cause found",
  },
} as const;

/**
 * Chapter 06 — the case. The three reasons, each with its receipt.
 *
 * Carries no sentence of its own: the eyebrow, heading and lede are `WHY_SECTION` in
 * `routes.ts` and the claims are `REASONS` in `why.ts`, whose `evidence` and `products`
 * had never been rendered anywhere before this chapter existed.
 */
export const FILM_CASE = {
  chapter: "06",
  title: "The case",
} as const;

/**
 * Chapter 07 — signed. Industries, partners, and the mark.
 *
 * `closing` was "Intelligence that can be held to account." — the direction's own thesis,
 * and the last thing on the page. It leaned on the word this site must not lean on, and
 * it described one practice. What replaced it is the site's own metadata line, which
 * covers all three in the order the deck puts them and is checkable on the pages above it.
 */
export const FILM_SIGNED = {
  chapter: "07",
  title: "Signed",
  heading: "Where the work goes",
  industriesLabel: "Sectors we build for",
  closing: "Built, run, and independently validated.",
  cta: { label: "Start a conversation", href: "/contact/" },
  secondary: { label: "See the products", href: "/products/" },
} as const;
