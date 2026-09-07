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
 *
 * CHAPTER LABELS SAY WHAT YOU ARE LOOKING AT — changed 2026-09-07. They used to be "The
 * decision", "The ledger", "The case", "Signed": names for the beats of the trace, taken
 * from `DIRECTION.md`. They read perfectly well if you have read that document, and a
 * visitor has not. To anybody else they are abstract nouns floating above a section, and
 * the effect is arty rather than clear. A label on a section is navigation, not a title
 * card — so it is the practice, the count, or the question the section answers.
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
  title: "AI & Automation",
  /** Named as the beat happens, and read out to screen readers. Not a story. */
  states: {
    arriving: "A request comes in",
    weighing: "Ways to handle it",
    discarding: "Ruled out",
    chosen: "The one that works",
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
  released: "Approved and logged",
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
  line: "Three practices, twelve capabilities, eight products.",
} as const;

/** Chapter 03 — the ledger. All three practices, twelve capabilities, operated by scroll. */
export const FILM_LEDGER = {
  chapter: "03",
  title: "Three practices",
  heading: "What each practice covers",
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
  title: "Eight products",
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
  title: "Cloud & Testing",
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
  title: "Why us",
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
  /* The mark, the heading and the list label were "Who we build for", "Who we build
     for" and "Sectors we build for" — the same phrase three times in one screen. The
     mark names the section, the heading asks the question, and the list needs no label
     at all because the four names under it are self-evidently the answer. */
  title: "Industries & partners",
  heading: "Who we build for",
  closing: "Built, run, and independently validated.",
  cta: { label: "Start a conversation", href: "/contact/" },
  secondary: { label: "See the products", href: "/products/" },
} as const;

/**
 * Why choose us — SAMPLE COPY for the proposed chapter 07.
 *
 * ABOUT 90 WORDS, DOWN FROM 226. The first cut went to fifteen and Nazir wanted the
 * substance back — so each check now carries one short paragraph rather than a bare
 * value. That is basement.studio's actual structure, not a retreat from it: one
 * enormous statement carrying the feeling, then columns with a heading, a few lines,
 * and a tag.
 *
 * What did NOT come back is "eight products". The page shows you the eight interfaces
 * in chapter 04; counting them again in prose was the repetition, not the proof.
 *
 * The statement carries the feeling; the checks carry the substance. Nothing here is a
 * new claim — each line is a shorter way of saying what `why.ts` already says.
 *
 * NO DECK REFERENCES ON THE PAGE. They were on hover for a while and came off on
 * 2026-09-07: a visitor does not know what "deck p8" means, and a citation only reads
 * as proof to somebody who already has the document. Provenance still lives on every
 * product in `products.ts`, which is where it is useful.
 *
 * `Why Choose Us` is Title Case against the site's sentence-case rule, at Nazir's
 * explicit request on 2026-09-07. Recorded so it reads as a decision, not a slip.
 */
export const FILM_WHY = {
  eyebrow: "Why Choose Us",
  statement: "Ask us to prove any of it.",
  checks: [
    {
      label: "Already built",
      value: "in production",
      body: "Financial filings, agentic workflows and hiring platforms are running today. Ask to see any of them before you commit to anything.",
    },
    {
      label: "Built, run and tested",
      value: "all three, in-house",
      body: "We write the software, run the cloud beneath it, and test both — including the AI itself. Most firms do one of the three.",
    },
    {
      label: "Nothing ships unsigned",
      value: "approval before deploy",
      body: "Approval checkpoints, audit trails and role-based access from the first sprint, because our clients answer to regulators.",
    },
  ],
  running: "running",
  done: "3 of 3",
} as const;
