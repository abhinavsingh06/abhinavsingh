"use client";

import { useCallback, useEffect, useState } from "react";

interface BsStep {
  left: number;
  right: number;
  mid?: number;
  action: string;
  detail?: string;
  note?: string;
}

interface Preset {
  title: string;
  subtitle: string;
  values: (number | string)[];
  steps: BsStep[];
  result: string;
}

const PRESETS: Record<string, Preset> = {
  classic: {
    title: "Classic Binary Search",
    subtitle: "nums = [-1, 0, 3, 5, 9, 12], target = 9",
    values: [-1, 0, 3, 5, 9, 12],
    steps: [
      {
        left: 0,
        right: 5,
        mid: 2,
        action: "mid = 2, nums[2] = 3 < 9",
        detail: "Discard left half → left = mid + 1 = 3",
        note: "target = 9",
      },
      {
        left: 3,
        right: 5,
        mid: 4,
        action: "mid = 4, nums[4] = 9 = target",
        detail: "Found at index 4 ✓",
      },
    ],
    result: "Return 4 — O(log n) instead of O(n) linear scan",
  },
  "lower-bound": {
    title: "Lower Bound — First Position",
    subtitle: "nums = [1, 2, 2, 2, 3], target = 2 — left-most index",
    values: [1, 2, 2, 2, 3],
    steps: [
      {
        left: 0,
        right: 4,
        mid: 2,
        action: "nums[mid] = 2 ≥ target",
        detail: "Answer could be at mid or left → right = mid − 1",
        note: "find first 2",
      },
      {
        left: 0,
        right: 1,
        mid: 0,
        action: "nums[0] = 1 < target",
        detail: "Too small → left = mid + 1 = 1",
      },
      {
        left: 1,
        right: 1,
        mid: 1,
        action: "nums[1] = 2 ≥ target, right = 0",
        detail: "Loop ends — left = 1 is first index of 2",
      },
    ],
    result: "Return left = 1 — template for duplicates",
  },
  matrix: {
    title: "2D Matrix as One Sorted Array",
    subtitle: "Flatten row-major indices — i → (i // n, i % n)",
    values: [1, 3, 5, 10, 11, 16, 20, 23, 30],
    steps: [
      {
        left: 0,
        right: 8,
        mid: 4,
        action: "Flat index 4 → matrix[1][1] = 11",
        detail: "11 < 16 → search right half",
        note: "target = 16",
      },
      {
        left: 5,
        right: 8,
        mid: 6,
        action: "Flat index 6 → matrix[2][0] = 20",
        detail: "20 > 16 → search left half",
      },
      {
        left: 5,
        right: 5,
        mid: 5,
        action: "Flat index 5 → matrix[1][2] = 16",
        detail: "Found ✓",
      },
    ],
    result: "O(log(m·n)) — treat matrix as sorted 1D array",
  },
  spells: {
    title: "Binary Search on Sorted Potions",
    subtitle: "potions sorted — count pairs with spell × potion ≥ success",
    values: [5, 8, 9, 15, 16],
    steps: [
      {
        left: 0,
        right: 4,
        mid: 2,
        action: "Need potion ≥ 12/3 = 4",
        detail: "potions[2] = 9 ≥ 4 → enough potions from index 2 onward",
        note: "spell = 3, success = 12",
      },
      {
        left: 0,
        right: 1,
        mid: 0,
        action: "potions[0] = 5 ≥ 4",
        detail: "Still valid → shrink right",
      },
      {
        left: 0,
        right: 0,
        mid: 0,
        action: "First valid index = 0",
        detail: "m − left = 5 successful potions for this spell",
      },
    ],
    result: "O((n + m) log m) — sort once, binary search per spell",
  },
  koko: {
    title: "Binary Search on Answer Space",
    subtitle: "piles = [3, 6, 7, 11], h = 8 — minimum eating speed k",
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    steps: [
      {
        left: 0,
        right: 10,
        mid: 5,
        action: "Try k = 6 — can finish in 8 hours?",
        detail: "Hours needed = 10 > h → too slow, need faster k",
        note: "search speeds 1..11",
      },
      {
        left: 6,
        right: 10,
        mid: 8,
        action: "Try k = 8 — feasible ✓",
        detail: "Fits in h → try smaller k (right = mid − 1)",
      },
      {
        left: 6,
        right: 7,
        mid: 6,
        action: "Try k = 6 — not feasible",
        detail: "left = 7 — minimum feasible speed",
      },
      {
        left: 7,
        right: 7,
        mid: 7,
        action: "k = 7 is minimum",
        detail: "Return left when searching for minimum",
      },
    ],
    result: "O(n log k) — check(mid) is greedy O(n), halve answer space",
  },
};

interface BinarySearchAnimationProps {
  preset: string;
}

export default function BinarySearchAnimation({
  preset,
}: BinarySearchAnimationProps) {
  const config = PRESETS[preset] ?? PRESETS.classic;
  const { title, subtitle, values, steps, result } = config;

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
            {preset === "koko" ? "speed k" : "nums"}
          </p>
          <div
            className="grid gap-2 sm:gap-3"
            style={{
              gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
            }}>
            {values.map((value, idx) => {
              const inRange = idx >= step.left && idx <= step.right;
              const isMid = step.mid === idx;
              const isLeft = step.left === idx;
              const isRight = step.right === idx;

              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    className={[
                      "flex h-11 w-full sm:h-12 items-center justify-center rounded-lg border-2 font-mono text-xs sm:text-sm font-semibold transition-all duration-500",
                      isMid
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg)] scale-105"
                        : inRange
                          ? "border-[var(--line)] bg-[var(--bg)] text-[var(--fg)]"
                          : "border-[var(--line)] bg-[var(--bg)]/40 text-[var(--muted)] opacity-50",
                    ].join(" ")}>
                    {value}
                  </div>
                  <div className="flex h-5 items-start justify-center gap-1">
                    {isLeft && (
                      <span className="rounded bg-blue-500/20 px-1 font-mono-xs text-blue-400">
                        L
                      </span>
                    )}
                    {isMid && (
                      <span className="rounded bg-[var(--accent-soft)] px-1 font-mono-xs text-[var(--accent)]">
                        M
                      </span>
                    )}
                    {isRight && (
                      <span className="rounded bg-rose-500/20 px-1 font-mono-xs text-rose-400">
                        R
                      </span>
                    )}
                  </div>
                  <span className="font-mono-xs text-[var(--muted)]">{idx}</span>
                </div>
              );
            })}
          </div>
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
