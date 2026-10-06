/**
 * The four services, as Nazir's About paragraph lists them (2026-10-07): custom software
 * solutions, cloud infra engineering (DevOps), managed services and software quality
 * validation. AI & Automation and Digital Platforms, the other two in that paragraph,
 * are the practices and are shown as such.
 *
 * WHERE THE WORDS COME FROM. Three of these were capabilities of the Cloud Services &
 * Testing practice, deck p4, removed on 2026-10-06 and brought back as services on
 * 2026-10-07 at Nazir's explicit confirmation. Their `detail` keeps the deck's
 * substance — AWS, Azure and GCP; functional, non-functional, integration and
 * penetration testing; prompt validation and RAG groundedness — in plainer sentences.
 * Custom software draws on the Digital Platforms capabilities "Custom software
 * solutions" and "Smart applications". Nothing here is new.
 */

export interface Service {
  /** Anchor on `/services/`, which the home page links to. */
  slug: string;
  name: string;
  /** One line, for the home page card. */
  line: string;
  /** A short paragraph, for the Services page. */
  detail: string;
}

export const SERVICES: Service[] = [
  {
    slug: "custom-software",
    name: "Custom software development",
    line: "End-to-end builds spanning web, mobile and multi-portal platforms.",
    detail:
      "We design and build custom software end to end: multi-portal platforms with separate views, permissions and reporting for each kind of user, and web and mobile applications built for the conditions they run in.",
  },
  {
    slug: "cloud-devops",
    name: "Cloud infrastructure engineering (DevOps)",
    line: "Provisioning and DevOps across AWS, Azure and GCP, as governed, repeatable deployments.",
    detail:
      "DevOps, site reliability engineering and infrastructure provisioning across AWS, Azure and GCP, turning infrastructure requests into governed, repeatable deployments. CloudSiddhi, our own platform, automates the cycle from requirements to deployment.",
  },
  {
    slug: "managed-services",
    name: "Managed services",
    line: "Ongoing operation of the platforms we build and the infrastructure they run on.",
    detail:
      "We operate the platforms we build and the infrastructure beneath them after go-live, with defined ownership rather than best-effort support.",
  },
  {
    slug: "quality-validation",
    name: "Software quality validation",
    line: "Functional, performance, integration and security testing, extended to GenAI systems.",
    detail:
      "End-to-end test development and execution across functional, non-functional, integration and penetration testing, extending to prompt validation and RAG groundedness testing for GenAI systems.",
  },
];
