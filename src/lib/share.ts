"use client";

/**
 * Turning a DOM node into something a person can put on their story.
 *
 * Everything here is best-effort by design: Web Share with files where the
 * browser supports it, a download otherwise, and a clipboard fallback under
 * that. No path throws at the caller — they get a result to report instead.
 */

import { SITE_URL } from "./site";

export type ShareOutcome = "shared" | "downloaded" | "copied" | "failed";

/** Rasterises a node at 2x so the card is crisp on a phone screen. */
export async function nodeToPngBlob(
  node: HTMLElement,
  { width, height }: { width: number; height: number },
): Promise<Blob | null> {
  try {
    // Loaded on demand: the rasteriser is only needed when someone actually
    // exports a card, and it is by far the heaviest dependency in the app.
    const { toBlob } = await import("html-to-image");
    return await toBlob(node, {
      width,
      height,
      pixelRatio: 2,
      cacheBust: false,
      // The node is rendered off-screen; neutralise the staging transform.
      style: { transform: "none", margin: "0" },
      backgroundColor: "#f2eee5",
    });
  } catch {
    return null;
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Give the browser a beat to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function downloadBlob(blob: Blob, filename: string): ShareOutcome {
  try {
    triggerDownload(blob, filename);
    return "downloaded";
  } catch {
    return "failed";
  }
}

/** Native share sheet with the image attached, falling back to a download. */
export async function sharePng(
  blob: Blob,
  { filename, text, title }: { filename: string; text: string; title: string },
): Promise<ShareOutcome> {
  const file = new File([blob], filename, { type: "image/png" });

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    navigator.canShare?.({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file], text, title });
      return "shared";
    } catch (error) {
      // AbortError means the user closed the sheet — not a failure.
      if (error instanceof DOMException && error.name === "AbortError") return "shared";
    }
  }

  return downloadBlob(blob, filename);
}

/** Share plain text + link, e.g. the "challenge a friend" button. */
export async function shareText({
  text,
  title,
  url = SITE_URL,
}: {
  text: string;
  title: string;
  url?: string;
}): Promise<ShareOutcome> {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ text, title, url });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "shared";
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return "copied";
  } catch {
    return "failed";
  }
}

export async function copyToClipboard(value: string): Promise<ShareOutcome> {
  try {
    await navigator.clipboard.writeText(value);
    return "copied";
  } catch {
    return "failed";
  }
}
