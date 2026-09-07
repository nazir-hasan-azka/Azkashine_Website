/**
 * Company-level facts. Contact details are verbatim from the corporate portfolio deck (p18);
 * vision, mission, and values from p3; the chairman's note from p2.
 */

export const SITE = {
  name: "Azkashine",
  legalName: "Azkashine Software and Services Private Limited",
  url: "https://www.azkashine.com",
  email: "contact@azkashine.com",
  landline: "080-25301553",
  phones: ["+91 9492062249", "+91 7026554789", "+966 582836442"],
  address: {
    lines: [
      "#73, 3rd Floor, Fountain Head Building",
      "Varthur Road, Nagavarapalya, CV Raman Nagar (Post)",
      "Bengaluru - 560093, Karnataka, India",
    ],
    locality: "Bengaluru",
    region: "Karnataka",
    postalCode: "560093",
    country: "IN",
  },
} as const;

export const VISION =
  "To exemplify excellence in technology solutions, setting new benchmarks and enabling businesses to reach their highest potential.";

export const MISSION =
  "To be the most reliable partner in addressing the diverse software and service needs of our clients.";

export const VALUES: { title: string; description: string }[] = [
  {
    title: "Trusted Team",
    description:
      "A team of experts combining deep business knowledge with hands-on technical experience.",
  },
  {
    title: "Excellence",
    description:
      "Setting new benchmarks in delivery quality rather than meeting the minimum bar.",
  },
  {
    title: "Integrity",
    description:
      "Doing what we said we would do, including when it is inconvenient.",
  },
  {
    title: "Innovation",
    description:
      "Applying emerging technology where it creates measurable advantage, not where it looks impressive.",
  },
  {
    title: "Customer Centric",
    description:
      "Judging our work by the outcome it produces for the client, not the effort it took us.",
  },
];

/** Executive summary bullets, deck p3. */
export const AT_A_GLANCE: string[] = [
  "Fast-paced, growing IT software and services company",
  "Specialised in custom software (web, mobile), AI, automation, cloud services, and E2E testing",
  "Positioned as a premier technology partner",
  "Enabling enterprises through digital transformation",
];

/** Chairman's note, deck p2. */
export const CHAIRMAN = {
  name: "Ishaq Shaik",
  title: "Chairman & Managing Director",
  location: "Bengaluru, India",
  tagline: "Transformation Admired…",
  note: [
    "We drive technology-led transformation, delivering future-ready solutions that empower enterprises to scale, innovate, and thrive in an evolving digital landscape.",
    "Built on expertise, trust, and innovation, we deliver software and services in artificial intelligence to accelerate business success across diverse industries.",
    "As industries evolve, Azkashine remains a trusted partner — transforming vision into reality and challenges into opportunities.",
    "Together, let’s shape a future where technology is not just adopted but truly admired.",
  ],
} as const;
