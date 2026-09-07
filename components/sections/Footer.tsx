import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CATEGORIES } from "@/lib/content/taxonomy";
import { PRODUCTS } from "@/lib/content/products";
import { INDUSTRIES } from "@/lib/content/industries";
import { SITE } from "@/lib/content/site";

/**
 * Footer doubles as the site's full sitemap — every route is reachable from here, which
 * is the pattern every strong reference site in the research shares.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container>
        <div className="grid gap-10 py-14 lg:grid-cols-[1.2fr_repeat(4,1fr)] lg:gap-8 lg:py-20">
          <div>
            <Image
              src="/azkashine-logo.png"
              alt="Azkashine"
              width={133}
              height={37}
              className="h-9 w-auto"
            />
            <address className="mt-6 text-sm not-italic leading-relaxed text-muted">
              {SITE.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            {/* Callable. The numbers were already here as text, which is no use to
                somebody reading this on a phone. `tel:` strips the spaces because a
                dialler will not. */}
            <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
              {[SITE.landline, ...SITE.phones].map((number) => (
                <a
                  key={number}
                  href={`tel:${number.replace(/[^+\d]/g, "")}`}
                  className="py-1 hover:text-ink"
                >
                  {number}
                </a>
              ))}
            </p>
            <a
              href={`mailto:${SITE.email}`}
              /* py-1 takes this to 28px tall. A standalone link has to clear 24x24 (WCAG 2.5.8);
                 the inline exception only covers links sitting inside a sentence. */
              className="mt-1 inline-block py-1 text-sm text-ink underline underline-offset-4"
            >
              {SITE.email}
            </a>
          </div>

          <FooterColumn
            title="What we do"
            links={[
              ...CATEGORIES.map((c) => ({
                label: c.name,
                href: `/what-we-do/${c.slug}/`,
              })),
              { label: "All capabilities", href: "/what-we-do/" },
            ]}
          />

          {/* Split across two labelled columns — an unlabelled continuation column
              reads as a rendering fault. Derived from the list length rather than a
              hard-coded 5, which silently unbalanced the row when a product left. */}
          <FooterColumn
            title="Products"
            links={PRODUCTS.slice(0, Math.ceil(PRODUCTS.length / 2)).map((p) => ({
              label: p.name,
              href: `/products/${p.slug}/`,
            }))}
          />

          <FooterColumn
            title="More products"
            links={[
              ...PRODUCTS.slice(Math.ceil(PRODUCTS.length / 2)).map((p) => ({
                label: p.name,
                href: `/products/${p.slug}/`,
              })),
              { label: "All products", href: "/products/" },
            ]}
          />

          <FooterColumn
            title="Company"
            links={[
              { label: "About", href: "/about/" },
              { label: "Industries", href: "/industries/" },
              ...INDUSTRIES.map((i) => ({
                label: i.name,
                href: `/industries/#${i.slug}`,
              })),
              { label: "Contact", href: "/contact/" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs">
            {SITE.legalName}. All rights reserved.
          </p>
          <p className="text-xs">
            Bengaluru, India &middot;{" "}
            <a href={`mailto:${SITE.email}`} className="hover:text-ink">
              {SITE.email}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-ink">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm text-muted">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href} className="transition-colors hover:text-brand">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
