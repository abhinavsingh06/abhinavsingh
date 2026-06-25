"use client";

import { useCallback, useEffect, useState } from "react";

interface PointerStep {
  left?: number;
  right?: number;
  i?: number;
  j?: number;
  action: string;
  detail?: string;
  note?: string;
}

interface Preset {
  title: string;
  subtitle: string;
  mode: "converge" | "dual";
  array?: (number | string)[];
  arrayB?: (number | string)[];
  steps: PointerStep[];
  result: string;
}

const PRESETS: Record<string, Preset> = {
  palindrome: {
    title: "Valid Palindrome",
    subtitle: 'Check if "racecar" reads the same forward and backward',
    mode: "converge",
    array: ["r", "a", "c", "e", "c", "a", "r"],
    steps: [
      {
        left: 0,
        right: 6,
        action: "Compare s[0] vs s[6]",
        detail: "'r' === 'r' ✓ — move inward",
      },
      {
        left: 1,
        right: 5,
        action: "Compare s[1] vs s[5]",
        detail: "'a' === 'a' ✓",
      },
      {
        left: 2,
        right: 4,
        action: "Compare s[2] vs s[4]",
        detail: "'c' === 'c' ✓",
      },
      {
        left: 3,
        right: 3,
        action: "Pointers met at center",
        detail: "All pairs matched → palindrome",
      },
    ],
    result: "Return true — O(n) time, O(1) space",
  },
  "two-sum-sorted": {
    title: "Two Sum II (Sorted Input)",
    subtitle: "nums = [1,2,4,6,8,9,14,15], target = 13",
    mode: "converge",
    array: [1, 2, 4, 6, 8, 9, 14, 15],
    steps: [
      {
        left: 0,
        right: 7,
        action: "Sum = 1 + 15 = 16",
        detail: "16 > 13 → decrease sum, move right--",
        note: "target = 13",
      },
      {
        left: 0,
        right: 6,
        action: "Sum = 1 + 14 = 15",
        detail: "Still too large → right--",
      },
      {
        left: 0,
        right: 5,
        action: "Sum = 1 + 9 = 10",
        detail: "10 < 13 → need larger sum, left++",
      },
      {
        left: 1,
        right: 5,
        action: "Sum = 2 + 9 = 11",
        detail: "Still too small → left++",
      },
      {
        left: 2,
        right: 5,
        action: "Sum = 4 + 9 = 13",
        detail: "Exact match found ✓",
      },
    ],
    result: "Return true (4 + 9 = 13) — O(n) instead of O(n²)",
  },
  "merge-sorted": {
    title: "Merge Two Sorted Arrays",
    subtitle: "Build [1,2,3,4,5,6] from [1,3,5] and [2,4,6]",
    mode: "dual",
    array: [1, 3, 5],
    arrayB: [2, 4, 6],
    steps: [
      {
        i: 0,
        j: 0,
        action: "Compare 1 vs 2",
        detail: "Take 1 → ans = [1]",
      },
      {
        i: 1,
        j: 0,
        action: "Compare 3 vs 2",
        detail: "Take 2 → ans = [1, 2]",
      },
      {
        i: 1,
        j: 1,
        action: "Compare 3 vs 4",
        detail: "Take 3 → ans = [1, 2, 3]",
      },
      {
        i: 2,
        j: 1,
        action: "Compare 5 vs 4",
        detail: "Take 4 → ans = [1, 2, 3, 4]",
      },
      {
        i: 2,
        j: 2,
        action: "Compare 5 vs 6",
        detail: "Take 5 → ans = [1, 2, 3, 4, 5]",
      },
      {
        i: 3,
        j: 2,
        action: "arr1 exhausted",
        detail: "Append remaining from arr2 → [1,2,3,4,5,6]",
      },
    ],
    result: "Merged in O(n + m) — no sorting needed",
  },
  subsequence: {
    title: "Is Subsequence",
    subtitle: 'Is s = "ace" a subsequence of t = "abcde"?',
    mode: "dual",
    array: ["a", "c", "e"],
    arrayB: ["a", "b", "c", "d", "e"],
    steps: [
      {
        i: 0,
        j: 0,
        action: "s[0] == t[0] ('a')",
        detail: "Match → i++",
      },
      {
        i: 1,
        j: 1,
        action: "s[1] ('c') != t[1] ('b')",
        detail: "No match → only j++",
      },
      {
        i: 1,
        j: 2,
        action: "s[1] == t[2] ('c')",
        detail: "Match → i++",
      },
      {
        i: 2,
        j: 3,
        action: "s[2] ('e') != t[3] ('d')",
        detail: "No match → j++",
      },
      {
        i: 2,
        j: 4,
        action: "s[2] == t[4] ('e')",
        detail: "Match → i++",
      },
      {
        i: 3,
        j: 5,
        action: "i == s.length",
        detail: "All characters of s found in order",
      },
    ],
    result: "Return true — O(|s| + |t|) time, O(1) space",
  },
};

interface TwoPointersAnimationProps {
  preset: string;
}

function PointerRow({
  label,
  values,
  activeIndex,
  activeIndexB,
  pointerA,
  pointerB,
}: {
  label: string;
  values: (number | string)[];
  activeIndex?: number;
  activeIndexB?: number;
  pointerA?: string;
  pointerB?: string;
}) {
  return (
    <div className="mb-4">
      <p className="mb-2 font-mono-xs text-[var(--muted)]">{label}</p>
      <div
        className="grid gap-2 sm:gap-3"
        style={{
          gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
        }}>
        {values.map((value, idx) => {
          const isA = activeIndex === idx;
          const isB = activeIndexB === idx;
          const highlighted = isA || isB;

          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div
                className={[
                  "relative flex h-12 w-full sm:h-14 items-center justify-center rounded-lg border-2 font-mono text-sm sm:text-base font-semibold transition-all duration-500",
                  highlighted
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg)] scale-105"
                    : "border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]",
                ].join(" ")}>
                {value}
              </div>
              <div className="flex h-6 items-start justify-center gap-1">
                {isA && pointerA && (
                  <span className="rounded bg-blue-500/20 px-1.5 py-0.5 font-mono-xs font-bold text-blue-400">
                    {pointerA}
                  </span>
                )}
                {isB && pointerB && (
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono-xs font-bold text-emerald-400">
                    {pointerB}
                  </span>
                )}
              </div>
              <span className="font-mono-xs text-[var(--muted)]">{idx}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TwoPointersAnimation({
  preset,
}: TwoPointersAnimationProps) {
  const config = PRESETS[preset] ?? PRESETS.palindrome;
  const { title, subtitle, mode, array = [], arrayB = [], steps, result } =
    config;

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
          {mode === "converge" ? (
            <PointerRow
              label="Input"
              values={array}
              activeIndex={step.left}
              activeIndexB={step.right}
              pointerA="L"
              pointerB="R"
            />
          ) : (
            <>
              <PointerRow
                label={preset === "subsequence" ? "s" : "arr1"}
                values={array}
                activeIndex={step.i}
                pointerA="i"
              />
              <PointerRow
                label={preset === "subsequence" ? "t" : "arr2"}
                values={arrayB}
                activeIndex={step.j}
                pointerA="j"
              />
            </>
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
