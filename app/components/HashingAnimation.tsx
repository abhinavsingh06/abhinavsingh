"use client";

import { useCallback, useEffect, useState } from "react";

interface MapEntry {
  key: string;
  value: string;
}

interface HashStep {
  action: string;
  detail?: string;
  note?: string;
  highlightIdx?: number;
  highlightFrom?: number;
  highlightTo?: number;
  map?: MapEntry[];
  set?: string[];
  lookup?: string;
  lookupFound?: boolean;
}

interface Preset {
  title: string;
  subtitle: string;
  mode: "array" | "string";
  values: (number | string)[];
  steps: HashStep[];
  result: string;
}

const PRESETS: Record<string, Preset> = {
  "two-sum": {
    title: "Two Sum — Hash Map Lookup",
    subtitle: "nums = [2, 7, 11, 15], target = 9",
    mode: "array",
    values: [2, 7, 11, 15],
    steps: [
      {
        action: "i = 0, num = 2",
        detail: "Need target − num = 9 − 2 = 7. Map empty → no match.",
        highlightIdx: 0,
        map: [],
        lookup: "7",
        lookupFound: false,
        note: "target = 9",
      },
      {
        action: "Store 2 → index 0",
        detail: "map[2] = 0",
        highlightIdx: 0,
        map: [{ key: "2", value: "0" }],
      },
      {
        action: "i = 1, num = 7",
        detail: "Need 9 − 7 = 2. map[2] exists → return [0, 1]",
        highlightIdx: 1,
        map: [{ key: "2", value: "0" }],
        lookup: "2",
        lookupFound: true,
      },
    ],
    result: "Found pair [0, 1] — O(n) instead of O(n²)",
  },
  "first-letter": {
    title: "First Letter to Appear Twice",
    subtitle: 's = "abccba" — O(1) existence checks with a set',
    mode: "string",
    values: ["a", "b", "c", "c", "b", "a"],
    steps: [
      {
        action: "See 'a' — not in set",
        detail: "Add 'a' to set",
        highlightIdx: 0,
        set: [],
      },
      {
        action: "See 'b' — not in set",
        detail: "Add 'b'",
        highlightIdx: 1,
        set: ["a"],
      },
      {
        action: "See 'c' — not in set",
        detail: "Add 'c'",
        highlightIdx: 2,
        set: ["a", "b"],
      },
      {
        action: "See 'c' again — already in set ✓",
        detail: "First duplicate letter → return 'c'",
        highlightIdx: 3,
        set: ["a", "b", "c"],
        lookup: "c",
        lookupFound: true,
      },
    ],
    result: "Return 'c' — each step O(1) with a set",
  },
  "k-distinct": {
    title: "At Most K Distinct Characters",
    subtitle: 's = "eceba", k = 2 — counts map tracks window',
    mode: "string",
    values: ["e", "c", "e", "b", "a"],
    steps: [
      {
        action: "Expand — window [e]",
        detail: "counts = {e:1}, distinct = 1",
        highlightFrom: 0,
        highlightTo: 0,
        map: [{ key: "e", value: "1" }],
        note: "k = 2",
      },
      {
        action: "Expand — window [e,c]",
        detail: "counts = {e:1,c:1}, distinct = 2 ✓",
        highlightFrom: 0,
        highlightTo: 1,
        map: [
          { key: "e", value: "1" },
          { key: "c", value: "1" },
        ],
        note: "best = 2",
      },
      {
        action: "Expand — window [e,c,e]",
        detail: "e:2 — still 2 distinct, best = 3",
        highlightFrom: 0,
        highlightTo: 2,
        map: [
          { key: "e", value: "2" },
          { key: "c", value: "1" },
        ],
        note: "best = 3",
      },
      {
        action: "Expand — window [e,c,e,b]",
        detail: "3 distinct > k → shrink from left",
        highlightFrom: 0,
        highlightTo: 3,
        map: [
          { key: "e", value: "2" },
          { key: "c", value: "1" },
          { key: "b", value: "1" },
        ],
      },
      {
        action: "Shrink until valid — window [c,e,b]",
        detail: "Remove left 'e's until distinct ≤ 2",
        highlightFrom: 1,
        highlightTo: 3,
        map: [
          { key: "c", value: "1" },
          { key: "e", value: "1" },
          { key: "b", value: "1" },
        ],
        note: "best stays 3",
      },
    ],
    result: "Longest valid substring length = 3 (\"ece\")",
  },
  "subarray-sum-k": {
    title: "Subarray Sum Equals K",
    subtitle: "nums = [1, 2, 1, 2, 1], k = 3 — prefix + frequency map",
    mode: "array",
    values: [1, 2, 1, 2, 1],
    steps: [
      {
        action: "Initialize counts[0] = 1",
        detail: "Empty prefix has sum 0",
        map: [{ key: "0", value: "1" }],
        note: "k = 3, ans = 0",
      },
      {
        action: "i = 0, curr = 1",
        detail: "curr − k = −2 not in map. counts[1] = 1",
        highlightIdx: 0,
        map: [
          { key: "0", value: "1" },
          { key: "1", value: "1" },
        ],
      },
      {
        action: "i = 1, curr = 3",
        detail: "curr − k = 0 found! ans += counts[0] = 1 → subarray [1,2]",
        highlightIdx: 1,
        map: [
          { key: "0", value: "1" },
          { key: "1", value: "1" },
          { key: "3", value: "1" },
        ],
        lookup: "0",
        lookupFound: true,
        note: "ans = 1",
      },
      {
        action: "i = 2, curr = 4",
        detail: "curr − k = 1 found! ans += 1 → subarray [2,1]",
        highlightIdx: 2,
        map: [
          { key: "0", value: "1" },
          { key: "1", value: "1" },
          { key: "3", value: "1" },
          { key: "4", value: "1" },
        ],
        lookup: "1",
        lookupFound: true,
        note: "ans = 2",
      },
      {
        action: "Continue to end…",
        detail: "Two more matches at i = 3 and i = 4",
        highlightIdx: 4,
        map: [
          { key: "0", value: "1" },
          { key: "1", value: "1" },
          { key: "3", value: "1" },
          { key: "4", value: "1" },
          { key: "6", value: "1" },
          { key: "7", value: "1" },
        ],
        note: "ans = 4",
      },
    ],
    result: "4 subarrays with sum 3 — O(n) time and space",
  },
  "group-anagrams": {
    title: "Group Anagrams — Key by Sorted String",
    subtitle: 'strs = ["eat","tea","tan","ate","nat","bat"]',
    mode: "string",
    values: ["eat", "tea", "tan", "ate", "nat", "bat"],
    steps: [
      {
        action: '"eat" → key "aet"',
        detail: 'groups["aet"] = ["eat"]',
        highlightIdx: 0,
        map: [{ key: "aet", value: '["eat"]' }],
      },
      {
        action: '"tea" → key "aet"',
        detail: 'Append to same group',
        highlightIdx: 1,
        map: [{ key: "aet", value: '["eat","tea"]' }],
      },
      {
        action: '"tan" → key "ant"',
        detail: 'New group',
        highlightIdx: 2,
        map: [
          { key: "aet", value: '["eat","tea"]' },
          { key: "ant", value: '["tan"]' },
        ],
      },
      {
        action: '"ate","nat" join existing groups',
        detail: 'Sort each string to get its group ID',
        highlightIdx: 4,
        map: [
          { key: "aet", value: '["eat","tea","ate"]' },
          { key: "ant", value: '["tan","nat"]' },
          { key: "abt", value: '["bat"]' },
        ],
      },
    ],
    result: '3 groups: [["bat"],["nat","tan"],["ate","eat","tea"]]',
  },
};

interface HashingAnimationProps {
  preset: string;
}

export default function HashingAnimation({ preset }: HashingAnimationProps) {
  const config = PRESETS[preset] ?? PRESETS["two-sum"];
  const { title, subtitle, mode, values, steps, result } = config;

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const step = steps[stepIndex];
  const isLast = stepIndex >= steps.length - 1;

  const goTo = useCallback(
    (index: number) => {
      setStepIndex(Math.max(0, Math.min(index, steps.length - 1)));
    },
    [steps.length]
  );

  useEffect(() => {
    if (!playing) return;
    if (isLast) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStepIndex((i) => i + 1), 1400);
    return () => clearTimeout(timer);
  }, [playing, stepIndex, isLast]);

  return (
    <div className="my-6 sm:my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <h3 className="font-display text-lg sm:text-xl text-[var(--fg)]">
          {title}
        </h3>
        <p className="mt-1 font-mono-xs text-[var(--muted)]">{subtitle}</p>
      </div>

      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 font-mono-xs text-[var(--muted)]">
            {mode === "array" ? "nums" : "input"}
          </p>
          <div
            className="grid gap-2 sm:gap-3"
            style={{
              gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
            }}>
            {values.map((value, idx) => {
              const inRange =
                step.highlightFrom !== undefined &&
                step.highlightTo !== undefined &&
                idx >= step.highlightFrom &&
                idx <= step.highlightTo;
              const isHighlight = step.highlightIdx === idx || inRange;

              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    className={[
                      "flex h-11 w-full sm:h-12 items-center justify-center rounded-lg border-2 font-mono text-xs sm:text-sm font-semibold transition-all duration-500",
                      isHighlight
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg)] scale-105"
                        : "border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]",
                    ].join(" ")}>
                    {value}
                  </div>
                  <span className="font-mono-xs text-[var(--muted)]">{idx}</span>
                </div>
              );
            })}
          </div>

          {(step.map || step.set) && (
            <div className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
              <p className="mb-3 font-mono-xs text-[var(--muted)]">
                {step.set ? "set" : "map"}
              </p>
              {step.set && step.set.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {step.set.map((item) => (
                    <span
                      key={item}
                      className={[
                        "rounded-md border px-2 py-1 font-mono text-sm",
                        step.lookup === item
                          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                          : "border-[var(--line)] text-[var(--fg)]",
                      ].join(" ")}>
                      {item}
                    </span>
                  ))}
                </div>
              ) : step.map && step.map.length > 0 ? (
                <div className="space-y-2">
                  {step.map.map((entry) => {
                    const isLookup =
                      step.lookup === entry.key && step.lookupFound;
                    return (
                      <div
                        key={entry.key}
                        className={[
                          "flex items-center justify-between rounded-md border px-3 py-2 font-mono text-sm transition-all",
                          isLookup
                            ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                            : step.lookup === entry.key
                              ? "border-rose-500/40 bg-rose-500/10"
                              : "border-[var(--line)]",
                        ].join(" ")}>
                        <span className="text-[var(--fg)]">{entry.key}</span>
                        <span className="text-[var(--muted)]">→</span>
                        <span className="text-[var(--accent)]">
                          {entry.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="font-mono-xs text-[var(--muted)]">(empty)</p>
              )}
              {step.lookup && !step.set && (
                <p className="mt-3 font-mono-xs text-[var(--fg-2)]">
                  lookup{" "}
                  <span className="text-[var(--accent)]">{step.lookup}</span>{" "}
                  →{" "}
                  {step.lookupFound ? (
                    <span className="text-emerald-400">found ✓</span>
                  ) : (
                    <span className="text-rose-400">not found</span>
                  )}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip chip-accent font-mono-xs">
              Step {stepIndex + 1}/{steps.length}
            </span>
            {step.note && (
              <span className="font-mono-xs text-[var(--accent)]">
                {step.note}
              </span>
            )}
          </div>
          <p className="mt-3 text-sm font-semibold text-[var(--fg)]">
            {step.action}
          </p>
          {step.detail && (
            <p className="mt-1 text-sm text-[var(--fg-2)]">{step.detail}</p>
          )}
          {isLast && (
            <p className="mt-3 rounded-md bg-[var(--accent-soft)] px-3 py-2 text-sm font-semibold text-[var(--accent)]">
              {result}
            </p>
          )}
        </div>

        <div className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => goTo(0)}
            className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
            ↺ Reset
          </button>
          <button
            onClick={() => goTo(stepIndex - 1)}
            disabled={stepIndex === 0}
            className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30">
            ← Prev
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-5 py-2 font-mono-xs font-semibold text-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-[var(--bg)]">
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={() => goTo(stepIndex + 1)}
            disabled={isLast}
            className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30">
            Next →
          </button>
        </div>

        <div className="mx-auto mt-4 h-1 max-w-2xl overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
