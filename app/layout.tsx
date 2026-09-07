import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SITE } from "@/lib/content/site";
import { CATEGORIES } from "@/lib/content/taxonomy";
import { figtree, heavy, mono } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    default: "Azkashine — AI products, platforms, and engineering services",
    template: "%s | Azkashine",
  },
  description:
    "Azkashine builds AI products, digital platforms, and cloud engineering services for telecom, public sector, manufacturing, and energy organisations.",
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: "Azkashine — AI products, platforms, and engineering services",
    description:
      "Eight products across AI & automation, digital platforms, and cloud services & testing — built, run, and independently validated.",
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${heavy.variable} ${mono.variable} antialiased`}
    >
      <body>
        {/* Organization schema. Every field comes from `site.ts` or `taxonomy.ts` —
            the legal name, the real address, the real numbers, the three practices.
            Nothing here is written for search engines that is not already true on the
            page, which is the same rule the copy follows. */}
        <script
          type="application/ld+json"
          // The content is ours and built from typed constants, not user input.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE.legalName,
              alternateName: SITE.name,
              url: SITE.url,
              email: SITE.email,
              telephone: [SITE.landline, ...SITE.phones],
              address: {
                "@type": "PostalAddress",
                streetAddress: SITE.address.lines.join(", "),
                addressLocality: "Bengaluru",
                addressRegion: "Karnataka",
                addressCountry: "IN",
              },
              knowsAbout: CATEGORIES.map((c) => c.name),
            }),
          }}
        />
        <div className="relative">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
