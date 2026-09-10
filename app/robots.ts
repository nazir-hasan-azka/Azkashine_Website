import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content/site";

/**
 * robots.txt, decided by the deploy target rather than by whoever edited this last.
 *
 * THIS FILE USED TO BE A HAND-FLIPPED SWITCH AND IT COST US. It shipped `allow` for the
 * production cut on 2026-09-07; the next push to `main` carried the same `allow` to
 * test.azkashine.com, and the staging site spent two days inviting Google to index a
 * complete duplicate of the live site — pointing at the production sitemap, no less.
 * Two hosts serving identical content, one canonical, and the search engine choosing.
 *
 * So the switch is gone. Production is whatever sets `NEXT_PUBLIC_SITE_ENV`, which is
 * `.github/workflows/deploy.yml`, on a push to `main`, and nothing else.
 * Every other build — local, anybody's laptop — disallows by default, which is
 * the safe direction to be wrong in: a staging site nobody indexes costs nothing, and a
 * production site nobody indexes costs everything.
 */
export const dynamic = "force-static";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
