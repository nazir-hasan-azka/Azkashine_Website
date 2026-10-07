/**
 * The Azkashine products: the live ones with a page each, and the ones coming soon.
 *
 * Facts, figures, and capability lists come from the corporate portfolio deck; the
 * `deckPage` field records provenance so any claim can be traced back. Two products
 * (ProSiddhi, AgentSiddhi) have no portfolio-deck page and are sourced from their own
 * product decks — noted per-entry.
 *
 * No client names, logos, or outcome numbers are invented here. If it is not in a deck,
 * it is not on the site.
 *
 * RENAMED 2026-10-06 to the Siddhi family, at Nazir's direction. Was → is:
 * AgentOS → NodeSiddhi, Smart AI Assistant → SmartSiddhi, Agent Siddhi → AgentSiddhi,
 * Tawthiq → AuditSiddhi, Cloud Orchestration Platform → CloudSiddhi (moved from the
 * retired Cloud Services & Testing practice into AI & Automation), Ethics Intelligence →
 * ShieldSiddhi. Savant AI was removed. The taglines are Nazir's own one-line descriptions.
 * The old addresses forward to the new ones — see `public/products/`.
 */

import type { CategorySlug } from "./taxonomy";

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductStat {
  value: string;
  label: string;
}

export interface CoverageGroup {
  label: string;
  items: string[];
}

export interface Product {
  slug: string;
  /** Display name — portfolio-deck naming, per the agreed convention. */
  name: string;
  category: CategorySlug;
  /** Which of the deck p4 capabilities this sits under. */
  capability: string;
  /** One line under the page title. */
  tagline: string;
  /** Opening paragraph: what it is. */
  summary: string;
  /** The buyer's problem, stated before the solution. */
  problem: string;
  features: ProductFeature[];
  /** Business outcomes. Empty where the deck states none — never padded. */
  outcomes: ProductFeature[];
  /** Headline numbers, shown as a stats band. Only the three products whose decks state
   *  real measured figures carry one — the rest deliberately have none rather than a band
   *  padded with counts of their own bullet points. */
  stats?: ProductStat[];
  /** Regulatory / technical coverage, where the product has it. */
  coverage?: { heading: string; groups: CoverageGroup[] };
  /** Live sample URL. Null until a real demo exists — the CTA falls back to contact. */
  demoUrl: string | null;
  /** Banner image in /public/img (without extension), taken from the product's own deck. */
  image?: string;
  /** Provenance for every claim on the page. */
  deckPage: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: "auditsiddhi",
    image: "prod-auditsiddhi",
    name: "AuditSiddhi",
    category: "ai-automation",
    capability: "AI-driven automation",
    tagline: "Data-driven audit intelligence.",
    summary:
      "AuditSiddhi automates the entire financial reporting lifecycle — document validation, data extraction, taxonomy mapping, XBRL generation, and regulator-ready submission — with page-level evidence traceability at every step.",
    problem:
      "Financial statements are still reviewed manually, page by page. XBRL preparation needs specialist expertise, and filing errors lead to rejection, resubmission, and penalties — while regulatory obligations across the GCC keep expanding.",
    features: [
      {
        title: "Document intelligence",
        description:
          "Processes PDFs, scanned files, and Excel in Arabic and English; extracts revenue, balance sheet, cash flow, and auditor data automatically.",
      },
      {
        title: "Compliance validation",
        description:
          "Detects missing disclosures, inconsistencies, and violations against regulatory and business rules.",
      },
      {
        title: "XBRL generation",
        description:
          "Auto-generates regulator-ready XBRL packages with multi-country taxonomy support.",
      },
      {
        title: "Evidence traceability",
        description:
          "Page-level source traceability, evidence highlighting, and audit-ready validation workflows.",
      },
    ],
    outcomes: [],
    coverage: {
      heading: "Regulatory coverage",
      groups: [
        {
          label: "Saudi Arabia",
          items: ["Qawaem", "Tadawul", "SOCPA", "CMA", "SAMA", "IFRS"],
        },
        { label: "Qatar", items: ["Q-Disclosure", "IFRS reporting"] },
        {
          label: "International",
          items: ["SEC EDGAR", "MCA India", "ESEF Europe"],
        },
      ],
    },
    demoUrl: null,
    deckPage: "p8",
  },
  {
    slug: "nodesiddhi",
    stats: [
      { value: "80%", label: "Less AI development effort" },
    ],
    image: "prod-nodesiddhi",
    name: "NodeSiddhi",
    category: "ai-automation",
    capability: "AI-driven automation",
    tagline: "Build, deploy and govern AI agents at scale.",
    summary:
      "NodeSiddhi lets organisations rapidly build, deploy, orchestrate, and govern intelligent AI agents at scale — combining multi-agent orchestration, autonomous decision-making, human oversight, and enterprise integration in one platform.",
    problem:
      "AI agents are straightforward to prototype and difficult to operate. Getting them into production means solving orchestration, governance, human oversight, and integration — usually rebuilt from scratch for every use case.",
    features: [
      {
        title: "Knowledge agent",
        description: "Manages memory and context across tasks.",
      },
      {
        title: "Format detection agent",
        description: "Identifies data structures automatically.",
      },
      {
        title: "Schema intelligence agent",
        description: "Maps incoming data to business models.",
      },
      {
        title: "Human governance agent",
        description: "Handles approval and oversight checkpoints.",
      },
      {
        title: "Validation agent",
        description: "Performs quality and compliance checks.",
      },
      {
        title: "Orchestration agent",
        description: "Coordinates workflows across the other agents.",
      },
    ],
    outcomes: [
      {
        title: "Up to 80% less AI development effort",
        description: "Reusable templates replace bespoke build-out.",
      },
      {
        title: "Faster deployment",
        description: "Reusable templates shorten time to production.",
      },
      {
        title: "Model flexibility",
        description: "Supports OpenAI, Gemini, Claude, and open-source models.",
      },
      {
        title: "RAG-powered knowledge management",
        description: "Grounded retrieval built into the platform.",
      },
      {
        title: "Cloud-agnostic, API-first",
        description: "Deploys against your existing cloud and systems.",
      },
    ],
    demoUrl: null,
    deckPage: "p9",
  },
  {
    slug: "agentsiddhi",
    image: "prod-agentsiddhi",
    name: "AgentSiddhi",
    category: "ai-automation",
    capability: "AI-driven automation",
    tagline: "Goal-oriented autonomous AI agent platform.",
    summary:
      "AgentSiddhi is an enterprise intelligence, governance, and agentic execution platform — combining enterprise discovery, digital-twin modelling, knowledge-graph intelligence, and governed agentic execution in a single operating environment.",
    problem:
      "Traditional automation works when a process is known and its steps can be listed in advance. It struggles when the goal is known but the execution path varies with data and conditions discovered at runtime. That gap is where manual effort concentrates — people moving between applications, interpreting information, investigating exceptions, and applying policy.",
    features: [
      {
        title: "Enterprise discovery",
        description:
          "Maps the applications, workflows, and dependencies already in place.",
      },
      {
        title: "Digital twin",
        description:
          "Models operations so changes can be reasoned about before they are made.",
      },
      {
        title: "Knowledge graph intelligence",
        description:
          "Connects systems, policies, and processes into queryable context.",
      },
      {
        title: "Agentic execution",
        description:
          "Pursues goals across systems, adapting the path based on what it finds.",
      },
      {
        title: "Governance & compliance",
        description:
          "Policy enforcement and compliance automation with execution traceability.",
      },
      {
        title: "Executive visibility",
        description: "Operational transparency across the estate.",
      },
    ],
    outcomes: [],
    demoUrl: null,
    deckPage: "product deck — not in the portfolio deck",
  },
  {
    slug: "smartsiddhi",
    image: "prod-smartsiddhi",
    name: "SmartSiddhi",
    category: "ai-automation",
    capability: "AI-integrated ecosystem",
    tagline: "Conversational AI assistant.",
    summary:
      "A conversational platform that handles multi-turn guidance, extracts data from documents, retrieves from connected systems, and classifies business activity for compliance — with protection and moderation built in rather than bolted on.",
    problem:
      "Self-service works only when the assistant can actually complete the task. Most stop at answering questions, leaving the work — retrieving the record, reading the document, classifying the activity — to a person.",
    features: [
      {
        title: "Conversational AI",
        description: "Natural language, multi-turn guidance.",
      },
      {
        title: "Document processing",
        description: "Auto-extracts data from submitted documents.",
      },
      {
        title: "CRM integration",
        description: "Seamless retrieval from connected systems.",
      },
      {
        title: "Compliance validation",
        description: "Classifies business activities against policy.",
      },
    ],
    outcomes: [
      {
        title: "Faster task execution",
        description: "AI-driven automation shortens the path to done.",
      },
      { title: "Fewer human errors", description: "Consistent handling every time." },
      { title: "24/7 self-service support", description: "No queue, no office hours." },
      { title: "Automated mappings", description: "Classification without manual lookup." },
    ],
    coverage: {
      heading: "Security & safety",
      groups: [
        {
          label: "Built in",
          items: [
            "Automatic protection",
            "Prompt injection protection",
            "Content moderation",
            "Regulatory compliance for restricted industries",
          ],
        },
      ],
    },
    demoUrl: null,
    deckPage: "p6",
  },
  {
    /* From the product deck "AI-Powered Chatbot for Qatar Aeronautical Academy (QAA)",
       2026-10. That deck is one client's deployment; the client is NOT named on the site
       until Nazir confirms it may be, so "students" is generalised to "users" and
       "hosted in Qatar" to in-country hosting. Every other claim is the deck's. */
    slug: "connectsiddhi",
    image: "prod-connectsiddhi",
    name: "ConnectSiddhi",
    category: "ai-automation",
    capability: "AI-integrated ecosystem",
    tagline: "Agentic AI and WhatsApp API integration.",
    summary:
      "A bilingual conversational AI platform that runs on WhatsApp, through the Business API, and on your website. It answers in Arabic and English, by text or voice, from a governed knowledge base, verifies who it is talking to when it needs to, and hands the conversation to a live agent — with the full context — when it is not confident.",
    problem:
      "Service teams are overwhelmed by the same questions asked again and again. Responses slow down at peak periods, there is no support after hours, and the answer someone gets depends on which channel they asked on.",
    features: [
      {
        title: "Bilingual and voice-first",
        description:
          "Arabic and English, automatic language detection, and voice messages transcribed across Arabic dialects.",
      },
      {
        title: "WhatsApp and web",
        description: "One assistant on the WhatsApp Business API and embedded on your website.",
      },
      {
        title: "Intent matching",
        description:
          "Menus and free text together, with LLM intent matching over a decision tree your team keeps in Excel.",
      },
      {
        title: "Confidence-based escalation",
        description:
          "Low-confidence questions go to a live agent on WhatsApp, with the full conversation attached.",
      },
      {
        title: "Auto-ticketing",
        description: "Requests are ticketed and routed to the right team through Freshdesk or email.",
      },
      {
        title: "Operations dashboard",
        description: "Queues, agent load, SLAs, satisfaction and compliance in one place.",
      },
    ],
    outcomes: [
      {
        title: "Answers around the clock",
        description: "Instant AI answers at any hour, with after-hours queuing for anything that needs a person.",
      },
      {
        title: "One consistent answer",
        description: "A shared, governed knowledge base behind every channel.",
      },
      {
        title: "Knowledge that improves",
        description: "Confidence scoring, supervisor review and continuous learning close gaps over time.",
      },
    ],
    coverage: {
      heading: "Security & compliance",
      groups: [
        {
          label: "Built in",
          items: [
            "In-country hosting on GCP",
            "Identity verification",
            "Role-based access control",
            "Full audit logging",
            "WhatsApp Business API compliance",
          ],
        },
      ],
    },
    demoUrl: null,
    deckPage: "product deck — AI-powered chatbot (QAA), 2026-10",
  },
  {
    slug: "shieldsiddhi",
    image: "prod-shieldsiddhi",
    name: "ShieldSiddhi",
    category: "digital-platforms",
    capability: "AI-enabled platforms",
    tagline: "Anonymity-guaranteed whistleblower tool.",
    summary:
      "A whistleblowing and ethics platform built for privacy, security, and trust. Reports are fully anonymous, communication stays encrypted in both directions, and AI handles risk detection, case analysis, and prioritisation from the first signal.",
    problem:
      "Organisations struggle to build reporting channels employees genuinely trust, so misconduct goes unreported. Identities leak through email and phone trails, manual triage stalls cases for weeks, and low participation leaves real compliance risk undetected.",
    features: [
      {
        title: "Smart risk detection",
        description: "Surfaces emerging risk from incoming reports.",
      },
      {
        title: "Threat intelligence",
        description: "Correlates signals across cases.",
      },
      {
        title: "Intelligent case analysis",
        description: "Reduces case review and triage effort.",
      },
      {
        title: "Pattern recognition engine",
        description: "Identifies repeat behaviour across time and teams.",
      },
      {
        title: "AI-based case prioritisation",
        description: "Ranks cases so the serious ones move first.",
      },
      {
        title: "Predictive compliance intelligence",
        description: "Anticipates where compliance gaps are forming.",
      },
    ],
    outcomes: [
      {
        title: "Detect risks earlier",
        description: "Identify misconduct before it becomes a major incident.",
      },
      {
        title: "Faster investigations",
        description: "AI reduces case review and triage effort.",
      },
      {
        title: "Stronger compliance",
        description: "Improved regulatory readiness and governance maturity.",
      },
      {
        title: "Organisational trust",
        description: "A safe, secure reporting channel for employees.",
      },
      {
        title: "Reduced financial and reputational risk",
        description: "Issues addressed proactively.",
      },
      {
        title: "Better ethics culture",
        description: "Transparency, accountability, and responsible behaviour.",
      },
    ],
    coverage: {
      heading: "Compliance & governance",
      groups: [
        {
          label: "Aligned to",
          items: [
            "EU Whistleblower Directive",
            "ISO 37002",
            "Anti-bribery & ethics programmes",
            "Corporate governance frameworks",
          ],
        },
        {
          label: "Controls",
          items: [
            "Complete audit trails",
            "Role-based access control",
            "Data retention policies",
            "Governance dashboards",
          ],
        },
        {
          label: "Reporting & communication",
          items: [
            "100% anonymous submissions",
            "No personal data collection",
            "Secure access codes",
            "End-to-end encryption",
            "Anonymous two-way messaging",
            "Real-time status tracking",
          ],
        },
      ],
    },
    demoUrl: null,
    deckPage: "p11–12",
  },
  {
    slug: "intentsiddhi",
    stats: [
      { value: "10x", label: "Faster infrastructure onboarding" },
    ],
    image: "prod-intentsiddhi",
    name: "IntentSiddhi",
    category: "ai-automation",
    capability: "AI-driven automation",
    tagline: "Telecom services fulfilment intelligence platform.",
    summary:
      "Complete infrastructure lifecycle automation — from requirements and architecture design through policy validation, infrastructure-as-code, deployment, and audit generation. Each phase is handled by a specialised agent, with human approval checkpoints before critical actions.",
    problem:
      "Cloud provisioning cycles run long. Manual configuration produces inconsistent deployments, compliance is checked late, service activation slips, and nobody has visibility into onboarding progress — which raises cost and slows customer onboarding.",
    features: [
      { title: "Requirements", description: "Captures and structures the business request." },
      { title: "Architecture", description: "Designs the target infrastructure." },
      { title: "Policy check", description: "Validates against governance and compliance rules." },
      { title: "IaC", description: "Generates infrastructure-as-code." },
      { title: "Deploy", description: "Executes across AWS, Azure, and GCP." },
    ],
    outcomes: [
      {
        title: "10x faster",
        description: "Infrastructure onboarding from weeks to hours.",
      },
      {
        title: "Cost savings",
        description: "Reduced manual effort and operational overhead.",
      },
      {
        title: "Zero drift",
        description: "Standardised, repeatable deployments.",
      },
    ],
    demoUrl: null,
    deckPage: "p14–15",
  },
  {
    slug: "prosiddhi",
    image: "prod-prosiddhi",
    name: "ProSiddhi",
    category: "digital-platforms",
    capability: "Smart applications",
    tagline: "India’s employment ecosystem.",
    summary:
      "ProSiddhi connects employers with skilled and semi-skilled workers across India — helpers, drivers, electricians, welders, delivery executives, security guards, machine operators, and technicians — with a pay-as-you-go model and a bilingual interface.",
    problem:
      "Hiring frontline workers is slow and costly. Candidates do not show up, employers have limited access to verified talent, and workers struggle to find genuine jobs near where they live.",
    features: [
      {
        title: "Post jobs in minutes",
        description: "Employers publish roles and start receiving applicants immediately.",
      },
      {
        title: "Search and unlock profiles",
        description: "Smart search and filters over screened candidates.",
      },
      {
        title: "Schedule interviews",
        description: "Interview scheduling and tracking from one dashboard.",
      },
      {
        title: "Credit wallet",
        description: "Pay-as-you-go — pay only for the profiles you unlock.",
      },
      {
        title: "Free for job seekers",
        description: "Registration, search, one-click apply, and alerts at no cost.",
      },
      {
        title: "English & Hindi",
        description: "Works on any smartphone browser, in either language.",
      },
    ],
    outcomes: [],
    coverage: {
      heading: "Industries served",
      groups: [
        {
          label: "Sectors",
          items: [
            "Manufacturing",
            "Warehousing",
            "Logistics",
            "Construction",
            "Retail",
            "Hospitality",
            "Facility management",
            "Healthcare support",
          ],
        },
        {
          label: "Skilled roles",
          items: [
            "Electricians",
            "Plumbers",
            "Welders",
            "Fitters",
            "Mechanics",
            "Machine operators",
            "Technicians",
          ],
        },
        {
          label: "Semi-skilled roles",
          items: [
            "Helpers",
            "Packers",
            "Loaders",
            "Drivers",
            "Delivery executives",
            "Security guards",
          ],
        },
      ],
    },
    demoUrl: null,
    deckPage: "product deck — not in the portfolio deck",
  },
];

export const PRODUCT_SLUGS = PRODUCTS.map((p) => p.slug);

/**
 * Products announced but not yet live. They are listed on `/products/` with a name, a
 * practice and one line, and nothing else: no page, no features, no claims, until a deck
 * or Nazir supplies them. ConnectSiddhi sat here until its deck arrived on 2026-10-07, and
 * IntentSiddhi until CloudSiddhi took its name the same day.
 */
export interface UpcomingProduct {
  name: string;
  category: CategorySlug;
  tagline: string;
}

export const UPCOMING_PRODUCTS: UpcomingProduct[] = [
  { name: "VigilSiddhi", category: "ai-automation", tagline: "Vision AI platform." },
  {
    name: "ApexSiddhi",
    category: "digital-platforms",
    tagline: "Multi-brand marketplace ecosystem.",
  },
  {
    name: "GateSiddhi",
    category: "digital-platforms",
    tagline: "Visitor management and smart gate system.",
  },
];

export function upcomingByCategory(category: CategorySlug): UpcomingProduct[] {
  return UPCOMING_PRODUCTS.filter((p) => p.category === category);
}

/**
 * The order the products are shown in when they are shown ONE AT A TIME, in a run —
 * chapter 04's horizontal traverse on the home page, and the focus run on the floor at
 * the top of `/products/`. It is not the file's order, and not a round-robin.
 *
 * ROUND-ROBIN WAS WRONG AND IT TOOK SOMEBODY LOOKING AT IT TO SEE WHY: cycling the
 * practices spends the smaller one immediately, and the run finishes on a row of AI
 * products. The split is six AI & Automation and two Digital Platforms, so the two
 * Digital Platforms products are spaced to break the run.
 *
 * THE RULE THIS ENCODES, for whoever adds a product: never more than two from the same
 * practice in a row. With six against two the run cannot also end on the smaller
 * practice without putting three AI products together somewhere, and three in a row is
 * the worse of the two.
 *
 * IT LIVES HERE RATHER THAN IN A COMPONENT because two pages run it, and two copies of an
 * order that carries an argument is two copies that can disagree.
 */
const RUN_ORDER = [
  "auditsiddhi", // AI & Automation
  "connectsiddhi", // AI & Automation
  "shieldsiddhi", // Digital Platforms
  "nodesiddhi", // AI & Automation
  "intentsiddhi", // AI & Automation
  "prosiddhi", // Digital Platforms
  "agentsiddhi", // AI & Automation
  "smartsiddhi", // AI & Automation
];

/**
 * `PRODUCTS`, in run order.
 *
 * Anything not named in `RUN_ORDER` still travels — a product added above and forgotten
 * there appears at the end rather than silently vanishing off the page.
 */
export const PRODUCTS_IN_RUN_ORDER: Product[] = [
  ...RUN_ORDER.map((slug) => PRODUCTS.find((p) => p.slug === slug)).filter(
    (p): p is Product => p !== undefined,
  ),
  ...PRODUCTS.filter((p) => !RUN_ORDER.includes(p.slug)),
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCategory(category: CategorySlug): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}
