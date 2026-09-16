/**
 * Single source of truth for anything that changes when the app is rebranded
 * or moved to another domain. The share cards bake the domain into the image,
 * so it must not drift from the metadata.
 */

export const SITE_NAME = "LifeReceipt";

/** The canonical home, used when no deployment URL is configured. */
const CANONICAL_URL = "https://lifereceipt.app";

/**
 * `NEXT_PUBLIC_SITE_URL` is set for us at build time by next.config.ts, which
 * falls back to Vercel's injected domain. That keeps OG tags, the sitemap and
 * the domain printed on every share card pointing somewhere that resolves.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || CANONICAL_URL;

/** Hostname only. Printed on the receipt and on both share cards. */
export const SITE_DOMAIN = hostnameOf(SITE_URL);

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "lifereceipt.app";
  }
}

export const SITE_TITLE = "LifeReceipt — Where Did Your Life Go?";

export const SITE_DESCRIPTION =
  "Find out how many years of your life you spend sleeping, working, scrolling, commuting and more.";

export const SITE_TAGLINE = "Where did your life go?";
