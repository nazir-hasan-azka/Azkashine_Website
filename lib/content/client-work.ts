/**
 * Delivered client platforms — shown as proof of capability, not as products in the
 * Azkashine line.
 *
 * Sourced from the portfolio deck p10, which shows real product screenshots of both.
 * Client names are deliberately absent: the deck does not name them, and we do not invent
 * attribution.
 */

import type { CategorySlug } from "./taxonomy";

export interface ClientWork {
  title: string;
  category: CategorySlug;
  description: string;
  highlights: string[];
  /** Screenshot path once the p10 assets are extracted from the deck. */
  screenshot?: string;
}

export const CLIENT_WORK: ClientWork[] = [
  {
    title: "Digital out-of-home advertising platform",
    category: "digital-platforms",
    description:
      "A three-portal advertising platform connecting brands to real-world audiences. Advertisers create campaigns and set budgets and targeting; screen partners register screens, manage locations, and view earnings; platform administrators approve campaigns, manage users, and monitor screens and analytics — all over one core engine.",
    highlights: [
      "Advertiser portal",
      "Screen partner portal",
      "Platform admin portal",
      "Ad serving engine",
      "Revenue engine",
      "Real-time analytics",
    ],
  },
  {
    title: "E-commerce platform",
    category: "digital-platforms",
    description:
      "A custom commerce build covering catalogue, campaign, and content management with an administrative surface designed to stay usable as the catalogue grows.",
    highlights: ["Content management", "Campaign management", "Analytics"],
  },
];
