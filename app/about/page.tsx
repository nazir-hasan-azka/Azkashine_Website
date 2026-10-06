import type { Metadata } from "next";
import { AboutBody } from "@/components/about/AboutBody";
import { ABOUT } from "@/lib/content/about";

export const metadata: Metadata = {
  title: ABOUT.metaTitle,
  description: ABOUT.metaDescription,
};

/**
 * About. The page itself is `components/about/AboutBody.tsx`.
 *
 * `VALUES` titles were Title Case in deck p3 ("Trusted Team", "Customer Centric"). They
 * are sentence case since the casing pass of 2026-10-06, at Nazir's request.
 */
export default function AboutPage() {
  return <AboutBody />;
}
