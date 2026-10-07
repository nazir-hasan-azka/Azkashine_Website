/**
 * The site's spine: the practices from the corporate portfolio deck (p4, "Technical
 * Portfolio"). The deck's own section dividers already follow these buckets, so the site
 * structure mirrors how the business describes itself.
 *
 * TWO PRACTICES, FROM 2026-10-06. The deck has three buckets; the third, Cloud Services &
 * Testing, was removed from the site at Nazir's call, with its four capabilities (DevOps,
 * Automation & Quality Engineering, Managed Services, Wireless Testing). Its one product,
 * the cloud orchestration platform, is now IntentSiddhi under AI & Automation.
 *
 * Capability names and their one-line descriptors are taken from the deck, set in sentence
 * case (2026-10-06) like every other heading on the site;
 * the longer `intro` copy is written for the web.
 *
 * REWRITTEN 2026-09-07. The intros were accurate and read as though a machine had
 * written them: five "not X, but Y" constructions across this file and `why.ts`, an em
 * dash appending a qualifier to almost every sentence, and nobody performing any of the
 * verbs — "that is where our practice operates". They now use short sentences and name
 * things.
 *
 * They also carry real specifics from the deck, which was unavailable until it landed at
 * `.claude/references/` on 2026-09-07 (extracted to `deck-text.md` beside it, so the
 * claims can be checked without PowerPoint):
 *
 *   - Stopping at the point a person approves — deck p14 says it plainly: "with human
 *     approval checkpoints before critical actions". That sentence is where the site's
 *     whole visual language comes from.
 */

export type CategorySlug = "ai-automation" | "digital-platforms";

export interface Capability {
  /** Verbatim capability name from deck p4. */
  title: string;
  /** Verbatim one-liner from deck p4. */
  descriptor: string;
  /** Expanded copy for the category page. */
  detail: string;
}

export interface Category {
  slug: CategorySlug;
  /** Verbatim bucket name from deck p4. */
  name: string;
  /** Short label used in navigation. */
  navLabel: string;
  tagline: string;
  intro: string;
  /** Banner image in /public/img (without extension). */
  image: string;
  capabilities: Capability[];
}

export const CATEGORIES: Category[] = [
  {
    slug: "ai-automation",
    name: "AI & Automation",
    navLabel: "AI & Automation",
    tagline: "Intelligent automation for enterprise operations.",
    image: "ai-automation",
    intro:
      "We design, build and run AI agents and automation for high-volume operational work, from document processing to exception handling, with a person approving every critical step.",
    capabilities: [
      {
        title: "AI-driven automation",
        descriptor: "GenAI and agentic AI that take on repetitive, rules-heavy work.",
        detail:
          "Agentic systems that pursue a goal rather than replay a script — planning, reasoning, acting, and adapting as conditions change, with human approval at the points that matter.",
      },
      {
        title: "AI-integrated ecosystem",
        descriptor: "AI added to the systems you already run, in real time.",
        detail:
          "Adding AI to systems already in production — conversational interfaces, document understanding, and CRM-connected retrieval — without rebuilding what already works.",
      },
      {
        title: "AI-based network optimisation",
        descriptor: "AI operations for telecom networks.",
        detail:
          "AI-Ops for telecom operators: anticipating degradation, prioritising interventions, and reducing manual triage across network operations.",
      },
    ],
  },
  {
    slug: "digital-platforms",
    name: "Digital Platforms",
    navLabel: "Digital Platforms",
    tagline: "Enterprise platforms, built to last.",
    image: "digital-platforms",
    intro:
      "Our platforms have more than one kind of user. An advertiser, a partner and an administrator, each seeing a different thing, over one engine. Real money moves through them, or real compliance does — our whistleblowing platform is built to the EU Whistleblower Directive and ISO 37002, with anonymous reporting and a complete audit trail. And somebody has to run the whole thing on a Tuesday two years from now, without calling us.",
    capabilities: [
      {
        title: "Custom software solutions",
        descriptor: "Multi-portal platforms built around your business.",
        detail:
          "End-to-end platform builds spanning multiple portals and roles — advertiser, partner, and administrator views over one core engine, each with its own permissions and reporting.",
      },
      {
        title: "Smart applications",
        descriptor: "Web and mobile applications for every kind of user.",
        detail:
          "Web and mobile applications designed for the conditions they actually run in: shared devices, patchy connectivity, and users who will not be trained.",
      },
      {
        title: "Data governance & ETL",
        descriptor: "Integrating, transforming and governing enterprise data.",
        detail:
          "Integrating and transforming data across systems, with the lineage, validation, and access controls needed to trust what comes out the other side.",
      },
      {
        title: "AI-enabled platforms",
        descriptor: "Platforms with AI at the core, for any sector.",
        detail:
          "Platforms where AI is the product rather than a feature — case triage, risk detection, and document intelligence built into the core workflow.",
      },
    ],
  },
];

export const CATEGORY_BY_SLUG: Record<CategorySlug, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<CategorySlug, Category>;
