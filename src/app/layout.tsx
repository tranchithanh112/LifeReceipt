import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { LocaleHtmlLang } from "@/components/site/locale-switch";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

/*
 * Fonts are vendored rather than fetched from Google at build time: the share
 * cards are rasterised in the browser from live DOM, and same-origin font
 * files are the only ones html-to-image can reliably inline.
 */
const sans = localFont({
  src: "../fonts/Inter-Variable.woff2",
  variable: "--font-sans-local",
  weight: "400 700",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

const mono = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-mono-local",
  weight: "400 700",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

/*
 * Fraunces replaces Instrument Serif, which has no Vietnamese glyphs at all.
 * Its `opsz` axis stays live so headlines get the high-contrast display cut
 * and small text gets a readable one, automatically. `WONK` stays live too:
 * it supplies the emphasis that a missing italic would otherwise fake.
 */
const display = localFont({
  src: "../fonts/Fraunces-Variable.woff2",
  variable: "--font-display-local",
  weight: "400 700",
  display: "swap",
  fallback: ["Iowan Old Style", "Georgia", "serif"],
});

/**
 * Metadata ships in the default locale: it is baked into the static HTML, and
 * a client-side language toggle cannot rewrite what a crawler already fetched.
 */
const t = getDictionary();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: t.meta.title,
    template: `%s — ${SITE_NAME}`,
  },
  description: t.meta.description,
  applicationName: SITE_NAME,
  keywords: t.meta.keywords,
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: t.meta.tagline,
    description: t.meta.description,
    locale: "vi_VN",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: t.meta.tagline,
    description: t.meta.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f2eee5",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={t.htmlLang}
      // The smooth scroll is for in-page anchors; without this Next.js keeps it
      // during route transitions too, which makes the reveal arrive mid-slide.
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${mono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <LocaleHtmlLang />
        {children}
      </body>
    </html>
  );
}
