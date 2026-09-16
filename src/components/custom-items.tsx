"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NumberField } from "@/components/ui/number-field";
import { useLifeReceipt } from "@/lib/state";
import { cn } from "@/lib/utils";

const MAX_CUSTOM = 6;

/**
 * Editor for user-defined line items.
 *
 * This deliberately does not live in the question flow: typing is the slowest
 * thing we can ask for, and asking for it on the last screen before the reveal
 * costs completions. It sits on the results page instead, where the people who
 * want it are already invested.
 */
export function CustomItems() {
  const { answers, addCustom, updateCustom, removeCustom } = useLifeReceipt();
  const items = answers.custom;

  return (
    <div>
      {items.length > 0 ? (
        <ul className="mb-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-3 border-t border-ink/12 pt-3"
            >
              <input
                value={item.label}
                onChange={(event) => updateCustom(item.id, { label: event.target.value })}
                placeholder="Activity"
                maxLength={24}
                aria-label="Activity name"
                className="min-w-[8rem] flex-1 bg-transparent text-[0.9375rem] font-medium text-ink outline-none placeholder:text-ink-faint"
              />

              <NumberField
                label={`Hours for ${item.label || "this activity"}`}
                controlName="hours"
                value={item.value}
                onChange={(value) => updateCustom(item.id, { value })}
                min={0}
                max={item.cadence === "daily" ? 14 : 60}
                step={0.25}
                suffix="h"
              />

              <div
                role="group"
                aria-label="How often"
                className="inline-flex overflow-hidden rounded-full border border-ink/15"
              >
                {(["daily", "weekly"] as const).map((cadence) => (
                  <button
                    key={cadence}
                    type="button"
                    aria-pressed={item.cadence === cadence}
                    onClick={() => updateCustom(item.id, { cadence })}
                    className={cn(
                      "px-3 py-1.5 font-mono text-[0.6875rem] tracking-wide uppercase transition-colors",
                      item.cadence === cadence
                        ? "bg-ink text-paper"
                        : "text-ink-muted hover:bg-ink/[0.06]",
                    )}
                  >
                    {cadence === "daily" ? "/day" : "/week"}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => removeCustom(item.id)}
                aria-label={`Remove ${item.label || "activity"}`}
                className="grid h-9 w-9 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/[0.06] hover:text-stamp"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {items.length < MAX_CUSTOM ? (
        <Button
          variant="outline"
          size="md"
          onClick={() => addCustom({ label: "", value: 1, cadence: "daily" })}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add a line item
        </Button>
      ) : (
        <p className="text-[0.8125rem] text-ink-faint">
          Six custom lines is plenty. The receipt has to fit on a phone.
        </p>
      )}
    </div>
  );
}
