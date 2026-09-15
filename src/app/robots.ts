import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Personal results and the question flow are not worth indexing.
      disallow: ["/results", "/calculate"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
