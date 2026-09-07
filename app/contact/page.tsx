import type { Metadata } from "next";
import Link from "next/link";
import { Page, Section, SectionHead } from "@/components/site/Page";
import { RouteHeader } from "@/components/site/RouteHeader";
import { CONTACT, ENQUIRY_PRODUCTS } from "@/lib/content/contact";
import { SITE } from "@/lib/content/site";
import { CRUMB_HOME } from "@/lib/content/company-pages";

export const metadata: Metadata = {
  title: CONTACT.metaTitle,
  description: CONTACT.metaDescription,
};

/**
 * The three mobiles and the landline in one list, so the page has one place a number
 * can be read from. `note` marks the landline apart from the mobiles above it.
 */
const NUMBERS: { number: string; note?: string }[] = [
  ...SITE.phones.map((number) => ({ number })),
  { number: SITE.landline, note: CONTACT.landlineSuffix },
];

/** `tel:` will not dial a number with spaces in it; the visible text keeps them. */
const dial = (number: string) => `tel:${number.replace(/\s/g, "")}`;

/**
 * Contact.
 *
 * NO FORM, AND THAT IS A DECISION — `lib/content/contact.ts` records it and this route
 * only honours it. The site is a static export with no server behind it, so a form
 * would need a third-party endpoint or would accept an enquiry and drop it, and a form
 * that silently swallows an enquiry is worse than no form. `mailto:` and `tel:` work
 * everywhere and land on a person. That is also why nothing on this page is a Client
 * Component: there is no state to hold.
 *
 * NO CLOSING `<Cta />` EITHER. Every other inner route ends with "tell us what you are
 * trying to solve"; a "talk to us" block at the bottom of the page whose whole job is
 * talking to us is a page arguing with itself. The browse line closes it instead, and
 * points at the two places a visitor who is not ready to write yet should go.
 *
 * The phone list and the enquiry list are LISTS OF LINKS, not sentences with links in
 * them, so the inline exemption in `tests/links.mjs` does not cover them and each row
 * carries a real 2.75rem target of its own.
 */
export default function ContactPage() {
  return (
    <Page>
      <RouteHeader
        crumbs={[{ label: CRUMB_HOME, href: "/" }, { label: CONTACT.crumb }]}
        title={CONTACT.title}
        lede={CONTACT.lede}
      />

      <Section tone="paper" labelledBy="contact-heading">
        <SectionHead id="contact-heading" title={CONTACT.detailsHeading} />

        <div className="contact-split">
          <div className="reveal-group">
            <div className="block">
              <h3 className="subhead">{CONTACT.emailHeading}</h3>
              <a href={`mailto:${SITE.email}`} className="cmail">
                {SITE.email}
              </a>
            </div>

            <div className="block">
              <h3 className="subhead">{CONTACT.phoneHeading}</h3>
              <ul className="clist">
                {NUMBERS.map(({ number, note }) => (
                  <li key={number}>
                    <a href={dial(number)}>
                      <span>{number}</span>
                      {note && <span className="clist-note">{note}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="block">
              <h3 className="subhead">{CONTACT.officeHeading}</h3>
              <address className="caddr">
                <span className="caddr-org">{SITE.legalName}</span>
                {SITE.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
          </div>

          <aside className="ecard" aria-labelledby="enquiry-heading">
            <h3 id="enquiry-heading" className="ecard-title">
              {CONTACT.enquiry.heading}
            </h3>
            <p className="ecard-lede">{CONTACT.enquiry.lede}</p>
            {/* Eight, derived from `PRODUCTS`. The old site listed nine because it
                predated Community Connect being removed; a count nobody derives is a
                count nobody updates. */}
            <ul className="ecard-list">
              {ENQUIRY_PRODUCTS.map((product) => (
                <li key={product.name}>
                  <a href={product.href}>
                    <span>{product.name}</span>
                    <span aria-hidden="true" className="nudge">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <p className="browse">
          {CONTACT.browse.before}{" "}
          <Link href={CONTACT.browse.products.href}>
            {CONTACT.browse.products.label}
          </Link>{" "}
          {CONTACT.browse.between}{" "}
          <Link href={CONTACT.browse.whatWeDo.href}>
            {CONTACT.browse.whatWeDo.label}
          </Link>
          {CONTACT.browse.after}
        </p>
      </Section>
    </Page>
  );
}
