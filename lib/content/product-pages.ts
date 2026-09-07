/**
 * The handful of strings the two product routes need that `routes.ts` does not already
 * carry. `PRODUCTS_PAGE` and `PRODUCT_PAGE` there are still the source for every
 * heading, lede and label those pages show; this is the remainder.
 *
 * It is a separate file rather than four more keys in `routes.ts` because several
 * routes were built at the same time, and two people editing one content file is how a
 * sentence quietly loses a merge.
 *
 * Nothing here is a claim about a product. Route furniture only — a crumb label, a
 * micro-heading, a field name, and the two watermark words.
 */

export const PRODUCT_ROUTES = {
  /** Root crumb on both product routes. */
  crumbHome: "Home",
  /**
   * Micro-heading over the stats band. Two of the eight products carry a figure their
   * deck actually states; the other six get no band rather than one padded with counts
   * of their own bullet points.
   */
  statsHeading: "Measured",
  /** Field name in the provenance strip, beside the practice and the deck page. */
  capabilityLabel: "Capability",
  /**
   * The watermark words behind two section heads. `SectionHead` sets its ghost
   * `white-space: nowrap` and the band clips it, so each has to be ONE short word — a
   * phrase arrives on a phone as a cropped fragment.
   */
  ghostProblem: "Problem",
  ghostOutcomes: "Outcomes",
} as const;
