/**
 * The three reasons the site gives for choosing Azkashine.
 *
 * Lifted out of `components/sections/WhyChooseUs.tsx` so the copy lives in the content
 * layer with everything else, and so the redesign directions can render the same three
 * reasons in a different shape without the strings being duplicated.
 *
 * Each is checkable rather than asserted. The previous copy ("We align every solution
 * with your goals and challenges") asserted nothing a reader could verify or a competitor
 * could not equally claim. These point at things Azkashine demonstrably does: eight
 * products in production, AI-specific validation as a service (deck p17), and governance
 * defaults built into the platforms.
 *
 * `evidence` holds supporting points that are themselves traceable — capability names are
 * verbatim from deck p4, and `products` refers to entries in `products.ts` rather than
 * repeating their names here.
 */

export interface Reason {
  id: string;
  title: string;
  description: string;
  /** Template render used by the current card layout. */
  icon: string;
  iconWidth: number;
  iconHeight: number;
  /** Short supporting points. Deck-traceable; never padded to fill a layout. */
  evidence: string[];
  /** Product slugs that stand as proof of this reason. */
  products?: string[];
}

export const REASONS: Reason[] = [
  {
    id: "in-production",
    title: "Eight products, already running",
    description:
      "Eight of our products are live and in use today. Tawthiq generates regulator-ready filings for SOCPA and Tadawul in Saudi Arabia, Q-Disclosure in Qatar, SEC EDGAR, MCA India and ESEF in Europe. AgentOS runs multi-agent workflows across OpenAI, Gemini and Claude. When we say we can build something, there is usually a version of it already running that you can go and look at.",
    icon: "/why/business-first.png",
    iconWidth: 486,
    iconHeight: 414,
    evidence: [],
    products: ["tawthiq", "agentos", "prosiddhi"],
  },
  {
    id: "build-run-test",
    title: "We build it, run it, and test it",
    description:
      "Most firms do one of the three. We build the product, run the cloud underneath it on AWS, Azure or GCP, and test both. Testing goes all the way to the AI: prompt validation, RAG groundedness, model and data-quality checks, alongside the ordinary functional, performance, security and penetration work. That last part is the one almost nobody else offers.",
    icon: "/why/ai-powered.png",
    iconWidth: 485,
    iconHeight: 390,
    evidence: [
      "Custom Software Solutions",
      "DevOps",
      "Automation & Quality Engineering",
      "Managed Services",
    ],
  },
  {
    id: "governed",
    title: "Governed by default",
    description:
      "Our clients answer to regulators, so we design for that from the first sprint. Our cloud platform runs five phases — requirements, architecture, policy check, infrastructure as code, deploy — and puts a human approval checkpoint before anything irreversible. Audit trails and role-based access come as standard, because adding them later costs far more than building them in.",
    icon: "/why/scalable-impact.png",
    iconWidth: 358,
    iconHeight: 335,
    evidence: ["Approval checkpoints", "Audit trails", "Role-based access"],
  },
];
