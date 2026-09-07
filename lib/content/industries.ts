/**
 * The four industries named on deck p4's footer strip.
 *
 * The deck gives the names and little else, so these pages stay deliberately short and
 * point at the capabilities and products that actually serve each sector. They are honest
 * about scope rather than padded with generic sector commentary.
 */

import type { CategorySlug } from "./taxonomy";

export interface Industry {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  /** Banner image in /public/img (without extension). */
  image: string;
  /** Capabilities (deck p4) most relevant to this sector. */
  capabilities: string[];
  /** Product slugs most relevant to this sector. */
  products: string[];
  primaryCategory: CategorySlug;
}

export const INDUSTRIES: Industry[] = [
  {
    slug: "telecom",
    image: "telecom",
    name: "Telecom",
    tagline: "AI-Ops for networks that cannot wait for a ticket queue.",
    intro:
      "Telecom operators carry the most operational complexity and the least tolerance for downtime. Our work here centres on AI-based network optimisation, wireless validation for 5G and 6G, and automating the provisioning cycles that slow customer onboarding.",
    capabilities: [
      "AI Based Network Optimization",
      "Wireless Testing",
      "DevOps",
      "Managed Services",
    ],
    products: ["cloud-orchestration", "agentos"],
    primaryCategory: "cloud-testing",
  },
  {
    slug: "public-sector",
    image: "public-sector",
    name: "Public Sector",
    tagline: "Governed automation for organisations that answer to the public.",
    intro:
      "Public sector work carries obligations that commercial projects do not — auditability, data residency, procurement rigour, and the requirement that a decision can be explained after the fact. Our platforms are built with approval checkpoints, audit trails, and role-based access as defaults rather than additions.",
    capabilities: [
      "AI-Driven Automation",
      "AI Enabled Platforms",
      "Custom Software Solutions",
      "Managed Services",
    ],
    products: ["ethics-intelligence", "tawthiq", "agent-siddhi"],
    primaryCategory: "digital-platforms",
  },
  {
    slug: "manufacturing",
    image: "manufacturing",
    name: "Manufacturing",
    tagline: "Visibility across the floor, the supply chain, and the workforce.",
    intro:
      "Manufacturing generates more data than most sectors and uses less of it. Our work spans operational analytics — OEE, defect rates, yield, throughput, downtime — alongside the platforms that manage site access and frontline hiring.",
    capabilities: [
      "Advanced Analytics",
      "Data Governance & ETL",
      "Smart Applications",
      "Automation & Quality Engineering",
    ],
    products: ["savant-ai", "prosiddhi"],
    primaryCategory: "ai-automation",
  },
  {
    slug: "energy",
    image: "energy",
    name: "Energy",
    tagline: "Infrastructure-grade software for critical operations.",
    intro:
      "Energy operations combine distributed physical assets with strict compliance obligations. Our work focuses on the data engineering, governance, and cloud infrastructure automation that make those operations legible and repeatable.",
    capabilities: [
      "Data Governance & ETL",
      "Advanced Analytics",
      "DevOps",
      "AI-Integrated Ecosystem",
    ],
    products: ["agentos", "cloud-orchestration", "savant-ai"],
    primaryCategory: "cloud-testing",
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
