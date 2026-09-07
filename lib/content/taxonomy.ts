/**
 * The site's spine: the three-bucket taxonomy from the corporate portfolio deck (p4,
 * "Technical Portfolio"). The deck's own section dividers already follow these buckets,
 * so the site structure mirrors how the business describes itself.
 *
 * Capability names and their one-line descriptors are taken verbatim from the deck;
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
 *   - AWS, Azure and GCP by name — deck p13.
 *   - "infrastructure onboarding from weeks to hours" — deck p15, the Cloud
 *     Orchestration Platform's own stated outcome, alongside 10x faster and zero drift.
 *   - Stopping at the point a person approves — deck p14 says it plainly: "with human
 *     approval checkpoints before critical actions". That sentence is where the site's
 *     whole visual language comes from.
 */

export type CategorySlug =
  | "ai-automation"
  | "digital-platforms"
  | "cloud-testing";

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
    tagline: "Put AI to work on the decisions people still make by hand.",
    image: "ai-automation",
    intro:
      "Anything you can write down in advance, ordinary automation already handles. What is left is the messy part. An exception to chase. A policy to apply. Two or three systems to open before anyone can sign anything off. We build the software that does that work, and stops at the point where a person has to approve it.",
    capabilities: [
      {
        title: "AI-Driven Automation",
        descriptor: "Automating repetitive tasks with GenAI & Agentic AI.",
        detail:
          "Agentic systems that pursue a goal rather than replay a script — planning, reasoning, acting, and adapting as conditions change, with human approval at the points that matter.",
      },
      {
        title: "Advanced Analytics",
        descriptor: "Trends forecast and BI.",
        detail:
          "Forecasting, anomaly detection, and pattern recognition on live data, delivered as dashboards and answers business users can act on without a BI team in the loop.",
      },
      {
        title: "AI-Integrated Ecosystem",
        descriptor: "Modernize with AI in real-time applications.",
        detail:
          "Adding AI to systems already in production — conversational interfaces, document understanding, and CRM-connected retrieval — without rebuilding what already works.",
      },
      {
        title: "AI Based Network Optimization",
        descriptor: "AI Ops for Telecom.",
        detail:
          "AI-Ops for telecom operators: anticipating degradation, prioritising interventions, and reducing manual triage across network operations.",
      },
    ],
  },
  {
    slug: "digital-platforms",
    name: "Digital Platforms",
    navLabel: "Digital Platforms",
    tagline: "Platforms built to be run for years.",
    image: "digital-platforms",
    intro:
      "Our platforms have more than one kind of user. An advertiser, a partner and an administrator, each seeing a different thing, over one engine. Real money moves through them, or real compliance does — our whistleblowing platform is built to the EU Whistleblower Directive and ISO 37002, with anonymous reporting and a complete audit trail. And somebody has to run the whole thing on a Tuesday two years from now, without calling us.",
    capabilities: [
      {
        title: "Custom Software Solutions",
        descriptor: "Evolving Hybrid smart Platforms",
        detail:
          "End-to-end platform builds spanning multiple portals and roles — advertiser, partner, and administrator views over one core engine, each with its own permissions and reporting.",
      },
      {
        title: "Smart Applications",
        descriptor: "Web & Mobile Applications",
        detail:
          "Web and mobile applications designed for the conditions they actually run in: shared devices, patchy connectivity, and users who will not be trained.",
      },
      {
        title: "Data Governance & ETL",
        descriptor: "Integrating and Transforming data.",
        detail:
          "Integrating and transforming data across systems, with the lineage, validation, and access controls needed to trust what comes out the other side.",
      },
      {
        title: "AI Enabled Platforms",
        descriptor: "Sector agnostic AI platforms",
        detail:
          "Platforms where AI is the product rather than a feature — case triage, risk detection, and document intelligence built into the core workflow.",
      },
    ],
  },
  {
    slug: "cloud-testing",
    name: "Cloud Services & Testing",
    navLabel: "Cloud & Testing",
    tagline: "Provision it, run it, and prove it works.",
    image: "cloud-testing",
    intro:
      "We provision on AWS, Azure and GCP, we run what we provision, and we test what runs on it. Our own orchestration platform takes infrastructure onboarding from weeks to hours. The testing goes as far as the AI itself — whether a prompt does what it claims, and whether an answer is really grounded in the source it cites.",
    capabilities: [
      {
        title: "DevOps",
        descriptor: "Strategic DevOps Implementations.",
        detail:
          "DevOps, SRE, and infrastructure provisioning across AWS, Azure, and GCP — turning infrastructure requests into governed, repeatable deployments.",
      },
      {
        title: "Automation & Quality Engineering",
        descriptor: "Workflow automations & E2E Testing",
        detail:
          "End-to-end test suite development and execution across functional, non-functional, integration, and penetration testing — extending to prompt-engineering validation and RAG groundedness testing for GenAI systems.",
      },
      {
        title: "Managed Services",
        descriptor: "Unwavering operational excellence",
        detail:
          "Ongoing operation of the platforms we build and the infrastructure they run on, with defined ownership rather than best-effort support.",
      },
      {
        title: "Wireless Testing",
        descriptor: "Comprehensive wireless testing — 5G/6G",
        detail:
          "Comprehensive wireless testing for 5G and 6G deployments, covering device, network, and performance validation.",
      },
    ],
  },
];

export const CATEGORY_BY_SLUG: Record<CategorySlug, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<CategorySlug, Category>;
