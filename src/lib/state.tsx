"use client";

/**
 * The only piece of app-wide state: the user's answers.
 *
 * Implemented as a module-level external store read through
 * `useSyncExternalStore`, which is what makes "render the server's empty
 * answers, then swap in whatever is on this device" a supported hydration
 * path rather than an effect that fights React.
 *
 * Nothing here talks to a network. Swapping localStorage for a backend later
 * means changing this file and `storage.ts`, and nothing else.
 */

import { useCallback, useMemo, useSyncExternalStore } from "react";

import type { ActivityId, CustomActivity } from "./activities";
import { calculate, createDefaultAnswers, type Answers, type LifeResult } from "./calc";
import { clearAnswers, loadAnswers, saveAnswers } from "./storage";

type Listener = () => void;

const listeners = new Set<Listener>();

/** Stable identity for SSR and the hydration render. */
const SERVER_SNAPSHOT: Answers = createDefaultAnswers();

/** Lazily filled from localStorage on the first client read. */
let snapshot: Answers | null = null;

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Answers {
  snapshot ??= loadAnswers() ?? createDefaultAnswers();
  return snapshot;
}

function getServerSnapshot(): Answers {
  return SERVER_SNAPSHOT;
}

function emit() {
  for (const listener of listeners) listener();
}

function update(updater: (prev: Answers) => Answers) {
  const next = updater(getSnapshot());
  if (next === snapshot) return;
  snapshot = next;
  saveAnswers(next);
  emit();
}

function resetStore() {
  clearAnswers();
  snapshot = createDefaultAnswers();
  emit();
}

/* ------------------------------------------------------------------ */

const neverChanges = () => () => {};
const onClient = () => true;
const onServer = () => false;

/** False during SSR and the hydration render, true from then on. */
export function useHydrated(): boolean {
  return useSyncExternalStore(neverChanges, onClient, onServer);
}

export interface LifeReceiptStore {
  answers: Answers;
  result: LifeResult | null;
  hydrated: boolean;
  setAge: (age: number) => void;
  setLifeExpectancy: (years: number) => void;
  setName: (name: string) => void;
  setValue: (id: ActivityId, value: number | null) => void;
  addCustom: (activity: Omit<CustomActivity, "id">) => void;
  updateCustom: (id: string, patch: Partial<Omit<CustomActivity, "id">>) => void;
  removeCustom: (id: string) => void;
  reset: () => void;
}

export function useLifeReceipt(): LifeReceiptStore {
  const answers = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useHydrated();

  const result = useMemo(() => calculate(answers), [answers]);

  const setAge = useCallback((age: number) => update((prev) => ({ ...prev, age })), []);

  const setLifeExpectancy = useCallback(
    (lifeExpectancy: number) => update((prev) => ({ ...prev, lifeExpectancy })),
    [],
  );

  const setName = useCallback(
    (name: string) => update((prev) => ({ ...prev, name: name.slice(0, 24) })),
    [],
  );

  const setValue = useCallback(
    (id: ActivityId, value: number | null) =>
      update((prev) => ({ ...prev, values: { ...prev.values, [id]: value } })),
    [],
  );

  const addCustom = useCallback(
    (activity: Omit<CustomActivity, "id">) =>
      update((prev) =>
        prev.custom.length >= 6
          ? prev
          : {
              ...prev,
              custom: [
                ...prev.custom,
                { ...activity, id: `custom-${Date.now().toString(36)}` },
              ],
            },
      ),
    [],
  );

  const updateCustom = useCallback(
    (id: string, patch: Partial<Omit<CustomActivity, "id">>) =>
      update((prev) => ({
        ...prev,
        custom: prev.custom.map((entry) =>
          entry.id === id ? { ...entry, ...patch } : entry,
        ),
      })),
    [],
  );

  const removeCustom = useCallback(
    (id: string) =>
      update((prev) => ({
        ...prev,
        custom: prev.custom.filter((entry) => entry.id !== id),
      })),
    [],
  );

  const reset = useCallback(() => resetStore(), []);

  return {
    answers,
    result,
    hydrated,
    setAge,
    setLifeExpectancy,
    setName,
    setValue,
    addCustom,
    updateCustom,
    removeCustom,
    reset,
  };
}
