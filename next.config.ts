import type { NextConfig } from "next";

/**
 * Where this deployment actually lives.
 *
 * Priority: an explicit NEXT_PUBLIC_SITE_URL, then the stable production
 * domain Vercel injects, then the per-deployment URL (previews). Resolved here
 * rather than in `lib/site.ts` because only NEXT_PUBLIC_* reaches the client
 * bundle, and the share cards need the real domain at runtime.
 *
 * Leaving all three unset falls back to the canonical domain in lib/site.ts.
 */
function resolveSiteUrl(): string | undefined {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost.replace(/\/$/, "")}`;

  return undefined;
}

const siteUrl = resolveSiteUrl();

const nextConfig: NextConfig = {
  env: siteUrl ? { NEXT_PUBLIC_SITE_URL: siteUrl } : {},
};

export default nextConfig;
