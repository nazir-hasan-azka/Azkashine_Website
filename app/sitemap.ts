import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content/site";
import { PRODUCTS } from "@/lib/content/products";
import { CATEGORIES } from "@/lib/content/taxonomy";

/**
 * The sitemap. Seventeen routes, derived rather than typed out.
 *
 * `products` and `taxonomy` are the same lists the navigation, the footer and the link
 * suite read, so a product that is added or removed appears here without anybody
 * remembering to come back. Community Connect was removed on 2026-09-06 and a hand-typed
 * sitemap would still be advertising it.
 *
 * `output: "export"` has no server to ask at request time, so the route says plainly
 * that it is static — without this the build fails rather than shipping a sitemap that
 * never gets generated, which is the better failure of the two.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const at = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  });

  return [
    at("/", 1),
    at("/what-we-do/", 0.8),
    ...CATEGORIES.map((c) => at(`/what-we-do/${c.slug}/`, 0.7)),
    at("/products/", 0.8),
    ...PRODUCTS.map((p) => at(`/products/${p.slug}/`, 0.7)),
    at("/industries/", 0.6),
    at("/about/", 0.5),
    at("/contact/", 0.5),
  ];
}
