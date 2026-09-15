/**
 * Single source of truth for anything that changes when the app is rebranded
 * or moved to another domain. The share cards bake the domain into the image,
 * so it must not drift from the metadata.
 */

export const SITE_NAME = "LifeReceipt";

/** Shown on share cards and in copy. Hostname only, no protocol. */
export const SITE_DOMAIN = "lifereceipt.app";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? `https://${SITE_DOMAIN}`;

export const SITE_TITLE = "LifeReceipt — Where Did Your Life Go?";

export const SITE_DESCRIPTION =
  "Find out how many years of your life you spend sleeping, working, scrolling, commuting and more.";

export const SITE_TAGLINE = "Where did your life go?";
