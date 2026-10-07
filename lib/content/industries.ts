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
    tagline: "AI-driven network operations and automated provisioning.",
    intro:
      "Telecom operators carry the most operational complexity and the least tolerance for downtime. Our work here centres on AI-based network optimisation and on automating the provisioning cycles that slow customer onboarding.",
    capabilities: ["AI-based network optimisation", "AI-driven automation"],
    products: ["intentsiddhi", "nodesiddhi"],
    primaryCategory: "ai-automation",
  },
  {
    slug: "public-sector",
    image: "public-sector",
    name: "Public sector",
    tagline: "Governed, auditable platforms for public institutions.",
    intro:
      "Public sector work carries obligations that commercial projects do not — auditability, data residency, procurement rigour, and the requirement that a decision can be explained after the fact. Our platforms are built with approval checkpoints, audit trails, and role-based access as defaults rather than additions.",
    capabilities: [
      "AI-driven automation",
      "AI-enabled platforms",
      "Custom software solutions",
    ],
    products: ["shieldsiddhi", "auditsiddhi", "agentsiddhi"],
    primaryCategory: "digital-platforms",
  },
  {
    slug: "manufacturing",
    image: "manufacturing",
    name: "Manufacturing",
    tagline: "Frontline hiring and operational data platforms.",
    intro:
      "Manufacturing generates more data than most sectors and uses less of it. Our work here centres on integrating and governing operational data, and on frontline hiring through ProSiddhi.",
    capabilities: [
      "Data governance & ETL",
      "Smart applications",
    ],
    products: ["prosiddhi"],
    primaryCategory: "ai-automation",
  },
  {
    slug: "energy",
    image: "energy",
    name: "Energy",
    tagline: "Data governance and cloud automation for critical operations.",
    intro:
      "Energy operations combine distributed physical assets with strict compliance obligations. Our work focuses on the data engineering, governance, and cloud infrastructure automation that make those operations legible and repeatable.",
    capabilities: [
      "Data governance & ETL",
      "AI-integrated ecosystem",
    ],
    products: ["nodesiddhi", "intentsiddhi"],
    primaryCategory: "digital-platforms",
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
