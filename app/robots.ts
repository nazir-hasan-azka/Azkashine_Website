import type { MetadataRoute } from "next";

/**
 * robots.txt.
 *
 * ⚠️ THIS DISALLOWS EVERYTHING, ON PURPOSE. `.github/workflows/deploy.yml` FTPs the
 * build into Hostinger's `test/` folder, which is served at https://test.azkashine.com/
 * — a public URL holding a staging copy of the real site. Left indexable, it competes
 * with azkashine.com for its own content and Google picks a winner on its own terms.
 *
 * BEFORE THIS REPO EVER DEPLOYS TO PRODUCTION, this file has to change: allow "/", and
 * point `sitemap` at the real host. A staging disallow shipped to production is the
 * quietest way to remove a site from search results.
 */
/* `output: "export"` has no server to ask at request time, so a metadata route has to
   say plainly that it is static. Without this the build fails rather than shipping a
   robots.txt that never gets generated — which is the better failure of the two. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
