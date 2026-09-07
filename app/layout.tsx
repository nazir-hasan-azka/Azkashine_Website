import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SITE } from "@/lib/content/site";
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
        <div className="relative">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
