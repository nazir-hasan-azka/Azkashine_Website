import type { Metadata } from "next";
import Link from "next/link";
import { NOT_FOUND } from "@/lib/content/routes";

/**
 * 404.
 *
 * Next ships a default, which is why this was never urgent and also why it was never
 * done. The default says "404 | This page could not be found" in a system font on a
 * white page, and on a site whose whole argument is that the work is traceable, a dead
 * end that looks like a framework error is the wrong last impression.
 *
 * It offers the three places a lost visitor actually wants, rather than only the home
 * page: the products, the practices, and a way to talk to somebody.
 */
export const metadata: Metadata = {
  title: NOT_FOUND.metaTitle,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="nf">
      <div className="nf-inner">
        <p className="nf-code">{NOT_FOUND.code}</p>
        <h1 className="nf-title">{NOT_FOUND.title}</h1>
        <p className="nf-lede">{NOT_FOUND.lede}</p>
        <ul className="nf-links">
          {NOT_FOUND.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="nf-link">
                {link.label}
                <span aria-hidden="true" className="nudge">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
