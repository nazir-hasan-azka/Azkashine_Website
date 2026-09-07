import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content/site";

/**
 * robots.txt.
 *
 * ⚠️ THIS NOW ALLOWS CRAWLING, WHICH IS ONLY CORRECT ON THE PRODUCTION HOST.
 *
 * It disallowed everything until 2026-09-07, because the deploy target was
 * `test/` on Hostinger — a public staging URL, and a staging copy competing with
 * azkashine.com for its own content is worse than no staging at all.
 *
 * The two settings have to move together. `server-dir` in
 * `.github/workflows/deploy.yml` and this file are a pair: allowing crawling while
 * still deploying to `test/` gets the staging copy indexed, and disallowing while
 * deploying to production removes the real site from search. Change one, change
 * the other, in the same commit.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
