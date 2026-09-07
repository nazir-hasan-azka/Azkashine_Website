/**
 * The eight Azkashine products.
 *
 * Facts, figures, and capability lists come from the corporate portfolio deck; the
 * `deckPage` field records provenance so any claim can be traced back. Two products
 * (ProSiddhi, Agent Siddhi) have no portfolio-deck page and are sourced from their own
 * product decks — noted per-entry.
 *
 * No client names, logos, or outcome numbers are invented here. If it is not in a deck,
 * it is not on the site.
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
  /** Which of the twelve deck p4 capabilities this sits under. */
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
    slug: "savant-ai",
    image: "prod-savant",
    name: "Savant AI",
    category: "ai-automation",
    capability: "Advanced Analytics",
    tagline: "Zero-configuration analytics — insights in minutes, at scale.",
    summary:
      "Savant AI generates industry-specific dashboards and analytical insights from your data automatically. It identifies the domain, selects the metrics that matter, designs the visualisations, and answers questions in natural language — with no setup, no modelling, and no SQL.",
    problem:
      "Most organisations have data but not insight. Exports pile up from ERP, POS, CRM, payroll, and logistics systems, and turning them into something readable takes skilled analysts, expensive BI tooling, or hours in a spreadsheet. Even when a dashboard exists, it is generic — it does not know which KPIs your industry actually tracks.",
    features: [
      {
        title: "Auto Dashboards",
        description: "Dynamic KPI cards and visualisations generated instantly.",
      },
      {
        title: "Predictive Analytics",
        description: "Trend forecasting, anomaly detection, and pattern recognition.",
      },
      {
        title: "Conversational AI",
        description:
          "Ask questions in natural language and get instant, data-grounded answers.",
      },
      {
        title: "Industry-Aware",
        description:
          "Supports Retail, Finance, Healthcare, HR, Logistics, and more.",
      },
    ],
    outcomes: [
      {
        title: "Faster decision making",
        description: "Raw data to insight in minutes.",
      },
      {
        title: "Reduced analytics cost",
        description: "No dedicated BI team required.",
      },
      {
        title: "Self-service intelligence",
        description: "No technical skills needed.",
      },
      {
        title: "Improved forecasting",
        description: "Identify trends before they hit.",
      },
      {
        title: "Increased productivity",
        description: "Automated data preparation and reporting.",
      },
    ],
    demoUrl: null,
    deckPage: "p7",
  },
  {
    slug: "tawthiq",
    image: "prod-tawthiq",
    name: "Tawthiq",
    category: "ai-automation",
    capability: "AI-Driven Automation",
    tagline:
      "AI-powered financial compliance and XBRL automation, built Arabic-first.",
    summary:
      "Tawthiq automates the entire financial reporting lifecycle — document validation, data extraction, taxonomy mapping, XBRL generation, and regulator-ready submission — with page-level evidence traceability at every step.",
    problem:
      "Financial statements are still reviewed manually, page by page. XBRL preparation needs specialist expertise, and filing errors lead to rejection, resubmission, and penalties — while regulatory obligations across the GCC keep expanding.",
    features: [
      {
        title: "Document Intelligence",
        description:
          "Processes PDFs, scanned files, and Excel in Arabic and English; extracts revenue, balance sheet, cash flow, and auditor data automatically.",
      },
      {
        title: "Compliance Validation",
        description:
          "Detects missing disclosures, inconsistencies, and violations against regulatory and business rules.",
      },
      {
        title: "XBRL Generation",
        description:
          "Auto-generates regulator-ready XBRL packages with multi-country taxonomy support.",
      },
      {
        title: "Evidence Traceability",
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
        { label: "Qatar", items: ["Q-Disclosure", "IFRS Reporting"] },
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
    slug: "agentos",
    stats: [
      { value: "80%", label: "Less AI development effort" },
    ],
    image: "prod-agentos",
    name: "AgentOS",
    category: "ai-automation",
    capability: "AI-Driven Automation",
    tagline: "Build. Deploy. Govern. Scale.",
    summary:
      "AgentOS lets organisations rapidly build, deploy, orchestrate, and govern intelligent AI agents at scale — combining multi-agent orchestration, autonomous decision-making, human oversight, and enterprise integration in one platform.",
    problem:
      "AI agents are straightforward to prototype and difficult to operate. Getting them into production means solving orchestration, governance, human oversight, and integration — usually rebuilt from scratch for every use case.",
    features: [
      {
        title: "Knowledge Agent",
        description: "Manages memory and context across tasks.",
      },
      {
        title: "Format Detection Agent",
        description: "Identifies data structures automatically.",
      },
      {
        title: "Schema Intelligence Agent",
        description: "Maps incoming data to business models.",
      },
      {
        title: "Human Governance Agent",
        description: "Handles approval and oversight checkpoints.",
      },
      {
        title: "Validation Agent",
        description: "Performs quality and compliance checks.",
      },
      {
        title: "Orchestration Agent",
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
    slug: "agent-siddhi",
    image: "prod-agent-siddhi",
    name: "Agent Siddhi",
    category: "ai-automation",
    capability: "AI-Driven Automation",
    tagline: "Discover. Understand. Govern. Execute.",
    summary:
      "Agent Siddhi is an enterprise intelligence, governance, and agentic execution platform — combining enterprise discovery, digital-twin modelling, knowledge-graph intelligence, and governed agentic execution in a single operating environment.",
    problem:
      "Traditional automation works when a process is known and its steps can be listed in advance. It struggles when the goal is known but the execution path varies with data and conditions discovered at runtime. That gap is where manual effort concentrates — people moving between applications, interpreting information, investigating exceptions, and applying policy.",
    features: [
      {
        title: "Enterprise Discovery",
        description:
          "Maps the applications, workflows, and dependencies already in place.",
      },
      {
        title: "Digital Twin",
        description:
          "Models operations so changes can be reasoned about before they are made.",
      },
      {
        title: "Knowledge Graph Intelligence",
        description:
          "Connects systems, policies, and processes into queryable context.",
      },
      {
        title: "Agentic Execution",
        description:
          "Pursues goals across systems, adapting the path based on what it finds.",
      },
      {
        title: "Governance & Compliance",
        description:
          "Policy enforcement and compliance automation with execution traceability.",
      },
      {
        title: "Executive Visibility",
        description: "Operational transparency across the estate.",
      },
    ],
    outcomes: [],
    demoUrl: null,
    deckPage: "product deck — not in the portfolio deck",
  },
  {
    slug: "smart-ai-assistant",
    image: "prod-smart-assistant",
    name: "Smart AI Assistant",
    category: "ai-automation",
    capability: "AI-Integrated Ecosystem",
    tagline: "An AI-powered conversational platform for the enterprise.",
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
        title: "Document Processing",
        description: "Auto-extracts data from submitted documents.",
      },
      {
        title: "CRM Integration",
        description: "Seamless retrieval from connected systems.",
      },
      {
        title: "Compliance Validation",
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
    slug: "ethics-intelligence",
    image: "prod-ethics",
    name: "Ethics Intelligence",
    category: "digital-platforms",
    capability: "AI Enabled Platforms",
    tagline:
      "AI-powered whistleblowing and ethics intelligence — anonymous by design.",
    summary:
      "A whistleblowing and ethics platform built for privacy, security, and trust. Reports are fully anonymous, communication stays encrypted in both directions, and AI handles risk detection, case analysis, and prioritisation from the first signal.",
    problem:
      "Organisations struggle to build reporting channels employees genuinely trust, so misconduct goes unreported. Identities leak through email and phone trails, manual triage stalls cases for weeks, and low participation leaves real compliance risk undetected.",
    features: [
      {
        title: "Smart Risk Detection",
        description: "Surfaces emerging risk from incoming reports.",
      },
      {
        title: "Threat Intelligence",
        description: "Correlates signals across cases.",
      },
      {
        title: "Intelligent Case Analysis",
        description: "Reduces case review and triage effort.",
      },
      {
        title: "Pattern Recognition Engine",
        description: "Identifies repeat behaviour across time and teams.",
      },
      {
        title: "AI-Based Case Prioritisation",
        description: "Ranks cases so the serious ones move first.",
      },
      {
        title: "Predictive Compliance Intelligence",
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
            "Anti-Bribery & Ethics Programs",
            "Corporate Governance Frameworks",
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
    slug: "cloud-orchestration",
    stats: [
      { value: "10x", label: "Faster infrastructure onboarding" },
    ],
    image: "prod-cloud",
    name: "Cloud Orchestration Platform",
    category: "cloud-testing",
    capability: "DevOps",
    tagline:
      "Agentic AI work-order automation for the full infrastructure lifecycle.",
    summary:
      "Complete infrastructure lifecycle automation — from requirements and architecture design through policy validation, infrastructure-as-code, deployment, and audit generation. Each phase is handled by a specialised agent, with human approval checkpoints before critical actions.",
    problem:
      "Cloud provisioning cycles run long. Manual configuration produces inconsistent deployments, compliance is checked late, service activation slips, and nobody has visibility into onboarding progress — which raises cost and slows customer onboarding.",
    features: [
      { title: "Requirements", description: "Captures and structures the business request." },
      { title: "Architecture", description: "Designs the target infrastructure." },
      { title: "Policy Check", description: "Validates against governance and compliance rules." },
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
    capability: "Smart Applications",
    tagline: "India’s smart blue-collar hiring platform.",
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
            "Facility Management",
            "Healthcare Support",
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
            "Machine Operators",
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
            "Delivery Executives",
            "Security Guards",
          ],
        },
      ],
    },
    demoUrl: null,
    deckPage: "product deck — not in the portfolio deck",
  },
];

export const PRODUCT_SLUGS = PRODUCTS.map((p) => p.slug);

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCategory(category: CategorySlug): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}
