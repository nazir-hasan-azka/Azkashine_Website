/**
 * The contact page's own copy.
 *
 * Lifted out of the previous app's `app/contact/page.tsx`, where it was hard-coded in
 * the route. Every contact FACT — email, three mobiles, the landline, the address, the
 * legal name — is already in `site.ts` and is read from there, so there is exactly one
 * place a phone number can be wrong.
 *
 * WHY THERE IS NO FORM, carried across from the old route because it is a decision and
 * not an omission: this is a static export with no server behind it. A contact form
 * would need a third-party endpoint or would silently fail, and a form that swallows an
 * enquiry is worse than no form. Email and telephone links work everywhere and go
 * straight to a person.
 *
 * The old metadata description hard-coded the email address and the first phone number
 * as literal text, which put two facts outside the content layer's single source. They
 * are interpolated here.
 */

import { PRODUCTS } from "./products";
import { SITE } from "./site";

export const CONTACT = {
  metaTitle: "Contact",
  metaDescription: `Get in touch with Azkashine — Bengaluru, India. Email ${SITE.email} or call ${SITE.phones[0]}.`,
  crumb: "Contact",
  title: "Contact us",
  lede: "Tell us what you are trying to solve. If we are not the right fit, we will say so.",
  detailsHeading: "Contact details",
  emailHeading: "Email",
  phoneHeading: "Phone",
  officeHeading: "Office",
  /** Distinguishes the landline from the three mobiles in the same list. */
  landlineSuffix: "(landline)",
  enquiry: {
    heading: "Asking about a specific product?",
    lede: "Pick one and we will reply with a walkthrough against your own use case rather than a generic deck.",
    /** Appended to the product name to make the mail subject. */
    subjectSuffix: "enquiry",
  },
  /* The old page listed nine products because it predated Community Connect being
     removed. It maps `PRODUCTS` now, so the list is eight and cannot drift again. */
  browse: {
    before: "Prefer to browse first? See",
    products: { label: "all products", href: "/products/" },
    between: "or",
    whatWeDo: { label: "what we do", href: "/what-we-do/" },
    after: ".",
  },
} as const;

/** `mailto:` with the subject filled in, so a reply already knows what it is about. */
export function productEnquiryHref(name: string): string {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(
    `${name} ${CONTACT.enquiry.subjectSuffix}`,
  )}`;
}

export const ENQUIRY_PRODUCTS = PRODUCTS.map((p) => ({
  name: p.name,
  href: productEnquiryHref(p.name),
}));
