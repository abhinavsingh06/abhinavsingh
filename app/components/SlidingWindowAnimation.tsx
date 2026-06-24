"use client";

import { useCallback, useEffect, useState } from "react";

interface WindowStep {
  left: number;
  right: number;
  action: string;
  detail?: string;
  best?: string;
  deque?: string;
  invariant?: string;
}

interface Preset {
  title: string;
  subtitle: string;
  array: (number | string)[];
  steps: WindowStep[];
  result: string;
}

const PRESETS: Record<string, Preset> = {
  "fixed-k": {
    title: "Fixed-Size Window",
    subtitle: "Max sum of any subarray of size k = 3",
    array: [2, 1, 5, 1, 3, 2],
    steps: [
      {
        left: 0,
        right: 2,
        action: "Build initial window",
        detail: "Sum = 2 + 1 + 5 = 8. Best so far: 8",
        best: "8",
      },
      {
        left: 1,
        right: 3,
        action: "Slide right →",
        detail: "Drop 2, add 1. Sum = 8 − 2 + 1 = 7",
        best: "8",
      },
      {
        left: 2,
        right: 4,
        action: "Slide right →",
        detail: "Drop 1, add 3. Sum = 7 − 1 + 3 = 9",
        best: "9",
      },
      {
        left: 3,
        right: 5,
        action: "Slide right →",
        detail: "Drop 5, add 2. Sum = 9 − 5 + 2 = 6",
        best: "9",
      },
    ],
    result: "Maximum sum = 9 (subarray [5, 1, 3])",
  },
  "variable-shrink": {
    title: "Variable-Size Window",
    subtitle: "Smallest subarray with sum ≥ 7",
    array: [2, 3, 1, 2, 4, 3],
    steps: [
      {
        left: 0,
        right: 0,
        action: "Expand right →",
        detail: "Window [2], sum = 2 — too small",
      },
      {
        left: 0,
        right: 1,
        action: "Expand right →",
        detail: "Window [2, 3], sum = 5 — still too small",
      },
      {
        left: 0,
        right: 2,
        action: "Expand right →",
        detail: "Window [2, 3, 1], sum = 6 — still too small",
      },
      {
        left: 0,
        right: 3,
        action: "Expand right →",
        detail: "Window [2, 3, 1, 2], sum = 8 ≥ 7. Length = 4",
        best: "4",
      },
      {
        left: 1,
        right: 3,
        action: "Shrink left ←",
        detail: "Drop 2. Window [3, 1, 2], sum = 6 — too small, expand again",
      },
      {
        left: 1,
        right: 4,
        action: "Expand right →",
        detail: "Window [3, 1, 2, 4], sum = 10 ≥ 7. Length = 4",
        best: "4",
      },
      {
        left: 2,
        right: 4,
        action: "Shrink left ←",
        detail: "Drop 3. Window [1, 2, 4], sum = 7 ≥ 7. Length = 3 ✓",
        best: "3",
      },
      {
        left: 3,
        right: 4,
        action: "Shrink left ←",
        detail: "Drop 1. Window [2, 4], sum = 6 — too small",
      },
    ],
    result: "Minimum length = 3 (subarray [1, 2, 4])",
  },
  "longest-unique": {
    title: "Longest Unique Substring",
    subtitle: "Longest substring without repeating characters",
    array: ["a", "b", "c", "a", "b", "c", "b", "b"],
    steps: [
      {
        left: 0,
        right: 0,
        action: "Expand right →",
        detail: "Window [a], length = 1",
        best: "1",
      },
      {
        left: 0,
        right: 1,
        action: "Expand right →",
        detail: "Window [a, b], length = 2",
        best: "2",
      },
      {
        left: 0,
        right: 2,
        action: "Expand right →",
        detail: "Window [a, b, c], length = 3",
        best: "3",
      },
      {
        left: 0,
        right: 3,
        action: "Duplicate 'a' found",
        detail: "Shrink left until 'a' is removed",
      },
      {
        left: 1,
        right: 3,
        action: "Shrink left ←",
        detail: "Window [b, c, a], length = 3",
        best: "3",
      },
      {
        left: 1,
        right: 4,
        action: "Expand right →",
        detail: "Window [b, c, a, b] — duplicate 'b', shrink",
      },
      {
        left: 2,
        right: 4,
        action: "Shrink left ←",
        detail: "Window [c, a, b], length = 3",
        best: "3",
      },
      {
        left: 2,
        right: 5,
        action: "Expand right →",
        detail: "Window [c, a, b, c] — duplicate 'c', shrink",
      },
      {
        left: 3,
        right: 5,
        action: "Shrink left ←",
        detail: "Window [a, b, c], length = 3",
        best: "3",
      },
      {
        left: 3,
        right: 6,
        action: "Expand right →",
        detail: "Window [a, b, c, b] — duplicate 'b', shrink",
      },
      {
        left: 5,
        right: 6,
        action: "Shrink left ←",
        detail: "Window [c, b], length = 2",
        best: "3",
      },
      {
        left: 5,
        right: 7,
        action: "Expand right →",
        detail: "Window [c, b, b] — duplicate 'b', shrink",
      },
      {
        left: 7,
        right: 7,
        action: "Shrink left ←",
        detail: "Window [b], length = 1",
        best: "3",
      },
    ],
    result: "Longest length = 3 (e.g. \"abc\")",
  },
  "min-window": {
    title: "Minimum Window Substring",
    subtitle: "Smallest window in s containing all chars of t = \"abc\"",
    array: ["a", "b", "d", "b", "c", "a"],
    steps: [
      {
        left: 0,
        right: 0,
        action: "Expand right →",
        detail: "Window [a]. Have {a:1}. Still need b, c.",
        invariant: "Window missing required chars → expand",
      },
      {
        left: 0,
        right: 1,
        action: "Expand right →",
        detail: "Window [a,b]. Have {a:1,b:1}. Still need c.",
        invariant: "Window missing required chars → expand",
      },
      {
        left: 0,
        right: 4,
        action: "Expand right →",
        detail: "Window [a,b,d,b,c]. All of t covered. Length = 5.",
        best: "5",
        invariant: "Window valid → record answer, then shrink",
      },
      {
        left: 1,
        right: 4,
        action: "Shrink left ←",
        detail: "Drop a. Window [b,d,b,c]. Missing a — invalid.",
        invariant: "Window invalid → expand again",
      },
      {
        left: 1,
        right: 5,
        action: "Expand right →",
        detail: "Window [b,d,b,c,a]. All covered. Length = 5.",
        best: "5",
        invariant: "Window valid → record answer, then shrink",
      },
      {
        left: 2,
        right: 5,
        action: "Shrink left ←",
        detail: "Drop b. Window [d,b,c,a]. All covered. Length = 4.",
        best: "4",
        invariant: "Still valid → keep shrinking",
      },
      {
        left: 3,
        right: 5,
        action: "Shrink left ←",
        detail: "Drop d. Window [b,c,a]. All covered. Length = 3.",
        best: "3",
        invariant: "Still valid → keep shrinking",
      },
    ],
    result: "Minimum window = \"bca\" (length 3)",
  },
  "monotonic-deque": {
    title: "Monotonic Deque — Max in Window",
    subtitle: "Max of each subarray of size k = 3 in [1, 3, −1, −3, 5, 3, 6, 7]",
    array: [1, 3, "-1", "-3", 5, 3, 6, 7],
    steps: [
      {
        left: 0,
        right: 0,
        action: "Push index 0 (val 1)",
        detail: "Deque stores indices of candidates for max, descending by value.",
        deque: "[0] → max = 1",
      },
      {
        left: 0,
        right: 1,
        action: "3 > 1 → pop back, push 1",
        detail: "Smaller values at the back are useless — they'll expire first.",
        deque: "[1] → max = 3",
      },
      {
        left: 0,
        right: 2,
        action: "Push index 2 (val −1)",
        detail: "−1 < 3, so it goes at the back. Window [1,3,−1].",
        deque: "[1, 2] → max = 3",
        best: "3",
      },
      {
        left: 1,
        right: 3,
        action: "Slide: pop front (idx 0 expired), push 3",
        detail: "Index 0 left the window. Window [3,−1,−3].",
        deque: "[1, 3] → max = 3",
        best: "3",
      },
      {
        left: 2,
        right: 4,
        action: "5 dominates → pop 3, pop 2, push 4",
        detail: "5 is larger than everything in deque. Window [−1,−3,5].",
        deque: "[4] → max = 5",
        best: "5",
      },
      {
        left: 3,
        right: 5,
        action: "Push index 5 (val 3)",
        detail: "3 < 5, push back. Window [−3,5,3].",
        deque: "[4, 5] → max = 5",
        best: "5",
      },
      {
        left: 4,
        right: 6,
        action: "6 dominates → pop 5, pop 4, push 6",
        detail: "Window [5,3,6]. Deque front always holds current max index.",
        deque: "[6] → max = 6",
        best: "6",
      },
      {
        left: 5,
        right: 7,
        action: "Push index 7 (val 7)",
        detail: "7 > 6, pop back. Window [3,6,7].",
        deque: "[7] → max = 7",
        best: "7",
      },
    ],
    result: "Output: [3, 3, 5, 5, 6, 7] — O(n) without rescanning each window",
  },
};

interface SlidingWindowAnimationProps {
  preset: string;
}

export default function SlidingWindowAnimation({
  preset,
}: SlidingWindowAnimationProps) {
  const config = PRESETS[preset] ?? PRESETS["fixed-k"];
  const { title, subtitle, array, steps, result } = config;

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

  const cellCount = array.length;

  return (
    <div className="my-6 sm:my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <h3 className="font-display text-lg sm:text-xl text-[var(--fg)]">
          {title}
        </h3>
        <p className="mt-1 font-mono-xs text-[var(--muted)]">{subtitle}</p>
      </div>

      <div className="px-4 py-6 sm:px-6 sm:py-8">
        {/* Array visualization */}
        <div className="relative mx-auto max-w-2xl">
          <div
            className="grid gap-2 sm:gap-3"
            style={{
              gridTemplateColumns: `repeat(${cellCount}, minmax(0, 1fr))`,
            }}>
            {array.map((value, i) => {
              const inWindow = i >= step.left && i <= step.right;
              const isLeft = i === step.left;
              const isRight = i === step.right;

              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className={[
                      "relative flex h-12 w-full sm:h-14 items-center justify-center rounded-lg border-2 font-mono text-sm sm:text-base font-semibold transition-all duration-500 ease-out",
                      inWindow
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg)] scale-105 shadow-[0_0_20px_var(--accent-glow)]"
                        : "border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]",
                    ].join(" ")}>
                    {value}
                    {inWindow && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
                    )}
                  </div>

                  {/* Pointer labels */}
                  <div className="flex h-6 items-start justify-center gap-1">
                    {isLeft && (
                      <span className="rounded bg-blue-500/20 px-1.5 py-0.5 font-mono-xs font-bold text-blue-400 transition-all duration-500">
                        L
                      </span>
                    )}
                    {isRight && step.left !== step.right && (
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono-xs font-bold text-emerald-400 transition-all duration-500">
                        R
                      </span>
                    )}
                    {isLeft && isRight && (
                      <span className="rounded bg-purple-500/20 px-1.5 py-0.5 font-mono-xs font-bold text-purple-400 transition-all duration-500">
                        L,R
                      </span>
                    )}
                  </div>

                  <span className="font-mono-xs text-[var(--muted)]">{i}</span>
                </div>
              );
            })}
          </div>

          {/* Window bracket */}
          <div
            className="pointer-events-none absolute top-0 h-12 sm:h-14 rounded-lg border-2 border-dashed border-[var(--accent)] transition-all duration-500 ease-out"
            style={{
              left: `${(step.left / cellCount) * 100}%`,
              width: `${((step.right - step.left + 1) / cellCount) * 100}%`,
              opacity: 0.5,
            }}
          />
        </div>

        {/* Step info */}
        <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip chip-accent font-mono-xs">
              Step {stepIndex + 1}/{steps.length}
            </span>
            <span className="font-mono-xs text-[var(--muted)]">
              L = {step.left}, R = {step.right}
            </span>
            {step.best && (
              <span className="font-mono-xs text-[var(--accent)]">
                Best: {step.best}
              </span>
            )}
          </div>
          <p className="mt-3 text-sm font-semibold text-[var(--fg)]">
            {step.action}
          </p>
          {step.invariant && (
            <p className="mt-2 rounded-md border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs text-blue-300">
              Invariant: {step.invariant}
            </p>
          )}
          {step.deque && (
            <p className="mt-2 rounded-md border border-purple-500/20 bg-purple-500/10 px-3 py-2 font-mono text-xs text-purple-300">
              Deque: {step.deque}
            </p>
          )}
          {step.detail && (
            <p className="mt-1 text-sm text-[var(--fg-2)]">{step.detail}</p>
          )}
          {isLast && (
            <p className="mt-3 rounded-md bg-[var(--accent-soft)] px-3 py-2 text-sm font-semibold text-[var(--accent)]">
              {result}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => goTo(0)}
            className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            aria-label="Reset">
            ↺ Reset
          </button>
          <button
            onClick={() => goTo(stepIndex - 1)}
            disabled={stepIndex === 0}
            className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30"
            aria-label="Previous step">
            ← Prev
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-5 py-2 font-mono-xs font-semibold text-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-[var(--bg)]"
            aria-label={playing ? "Pause" : "Play"}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={() => goTo(stepIndex + 1)}
            disabled={isLast}
            className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30"
            aria-label="Next step">
            Next →
          </button>
        </div>

        {/* Progress bar */}
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
