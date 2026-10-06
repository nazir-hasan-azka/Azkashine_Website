/**
 * The reasons the site gives for choosing Azkashine.
 *
 * Lifted out of `components/sections/WhyChooseUs.tsx` so the copy lives in the content
 * layer with everything else, and so the redesign directions can render the same three
 * reasons in a different shape without the strings being duplicated.
 *
 * NO COMPARISONS, from 2026-09-07. These carried three: "Most firms do one of the
 * three", "That last part is the one almost nobody else offers", and a practice tagline
 * ending "not demoed once". A reader cannot check what somebody else does or does not
 * do, so a comparison is the one kind of sentence that can never be evidence — and it
 * makes the page sound like it is arguing with someone who is not in the room. What we
 * do is more convincing than what anybody else does not.
 *
 * Each is checkable rather than asserted. The previous copy ("We align every solution
 * with your goals and challenges") asserted nothing a reader could verify or a competitor
 * could not equally claim. These point at things Azkashine demonstrably does: products in
 * production, and governance defaults built into the platforms.
 *
 * TWO REASONS FROM 2026-10-06. "We build it, run it, and test it" went with the Cloud
 * Services & Testing practice: its evidence was that practice's capabilities.
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
      "Eight of our products are live and in use today. AuditSiddhi generates regulator-ready filings for SOCPA and Tadawul in Saudi Arabia, Q-Disclosure in Qatar, SEC EDGAR, MCA India and ESEF in Europe. NodeSiddhi runs multi-agent workflows across OpenAI, Gemini and Claude. When we say we can build something, there is usually a version of it already running that you can go and look at.",
    icon: "/why/business-first.png",
    iconWidth: 486,
    iconHeight: 414,
    evidence: [],
    products: ["auditsiddhi", "nodesiddhi", "prosiddhi"],
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
