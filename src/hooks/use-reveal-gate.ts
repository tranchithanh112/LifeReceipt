"use client";

import * as React from "react";

import { hasSeenReveal, markRevealSeen } from "@/lib/storage";

/**
 * Whether the intro animation has already played this session, as an external
 * store so the flag can be read during render instead of chased in an effect.
 */

type Listener = () => void;

const listeners = new Set<Listener>();
let cached: boolean | null = null;

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): boolean {
  cached ??= hasSeenReveal();
  return cached;
}

/** On the server, assume it has been seen — the reveal is client-only. */
const getServerSnapshot = () => true;

export function useRevealGate(): { seen: boolean; markSeen: () => void } {
  const seen = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const markSeen = React.useCallback(() => {
    markRevealSeen();
    cached = true;
    for (const listener of listeners) listener();
  }, []);

  return { seen, markSeen };
}
