"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface PrefixStep {
  action: string;
  detail?: string;
  note?: string;
  prefixLen?: number;
  subFrom?: number;
  subTo?: number;
  greenIdx?: number;
  redIdx?: number;
  splitAfter?: number;
  leftSum?: number;
  rightSum?: number;
  runningLeft?: number;
}

interface Preset {
  title: string;
  subtitle: string;
  nums: number[];
  steps: PrefixStep[];
  result: string;
  showPrefixRow?: boolean;
}

const PRESETS: Record<string, Preset> = {
  build: {
    title: "Building the Prefix Array",
    subtitle: "nums = [5, 2, 1, 6, 3, 8] — accumulate one index at a time",
    nums: [5, 2, 1, 6, 3, 8],
    showPrefixRow: true,
    steps: [
      {
        action: "Start with the first element",
        detail: "prefix[0] = nums[0] = 5",
        prefixLen: 1,
      },
      {
        action: "Extend to index 1",
        detail: "prefix[1] = prefix[0] + nums[1] = 5 + 2 = 7",
        prefixLen: 2,
      },
      {
        action: "Extend to index 2",
        detail: "prefix[2] = 7 + 1 = 8",
        prefixLen: 3,
      },
      {
        action: "Extend to index 3",
        detail: "prefix[3] = 8 + 6 = 14",
        prefixLen: 4,
      },
      {
        action: "Extend to index 4",
        detail: "prefix[4] = 14 + 3 = 17",
        prefixLen: 5,
      },
      {
        action: "Extend to index 5",
        detail: "prefix[5] = 17 + 8 = 25 — build complete",
        prefixLen: 6,
      },
    ],
    result: "Built in O(n) — prefix[i] = sum of nums[0..i]",
  },
  "range-query": {
    title: "Range Sum Query in O(1)",
    subtitle: "Sum of subarray nums[2..4] using prefix[j] − prefix[i−1]",
    nums: [5, 2, 1, 6, 3, 8],
    showPrefixRow: true,
    steps: [
      {
        action: "Prefix array is ready",
        detail: "prefix = [5, 7, 8, 14, 17, 25]",
        prefixLen: 6,
        note: "Query: i = 2, j = 4",
      },
      {
        action: "Highlight subarray nums[2..4]",
        detail: "Values 1 + 6 + 3 = ?",
        prefixLen: 6,
        subFrom: 2,
        subTo: 4,
        note: "i = 2, j = 4",
      },
      {
        action: "Green line — prefix[j]",
        detail: "prefix[4] = 17 (sum through index 4)",
        prefixLen: 6,
        subFrom: 2,
        subTo: 4,
        greenIdx: 4,
      },
      {
        action: "Red line — prefix[i − 1]",
        detail: "prefix[1] = 7 (sum before index 2)",
        prefixLen: 6,
        subFrom: 2,
        subTo: 4,
        greenIdx: 4,
        redIdx: 1,
      },
      {
        action: "Subtract",
        detail: "17 − 7 = 10 ✓",
        prefixLen: 6,
        subFrom: 2,
        subTo: 4,
        greenIdx: 4,
        redIdx: 1,
        note: "sum(2, 4) = 10",
      },
    ],
    result: "Any range sum in O(1) after O(n) preprocessing",
  },
  queries: {
    title: "Answer Many Queries Fast",
    subtitle: "nums = [1, 6, 3, 2, 7, 2], limit = 13",
    nums: [1, 6, 3, 2, 7, 2],
    showPrefixRow: true,
    steps: [
      {
        action: "Build prefix sum",
        detail: "prefix = [1, 7, 10, 12, 19, 21]",
        prefixLen: 6,
      },
      {
        action: "Query [0, 3]",
        detail: "sum = prefix[3] = 12 < 13 → true",
        prefixLen: 6,
        subFrom: 0,
        subTo: 3,
        greenIdx: 3,
        note: "12 < 13 ✓",
      },
      {
        action: "Query [2, 5]",
        detail: "sum = prefix[5] − prefix[1] = 21 − 7 = 14 ≥ 13 → false",
        prefixLen: 6,
        subFrom: 2,
        subTo: 5,
        greenIdx: 5,
        redIdx: 1,
        note: "14 ≥ 13 ✗",
      },
      {
        action: "Query [2, 4]",
        detail: "sum = prefix[4] − prefix[1] = 19 − 7 = 12 < 13 → true",
        prefixLen: 6,
        subFrom: 2,
        subTo: 4,
        greenIdx: 4,
        redIdx: 1,
        note: "12 < 13 ✓",
      },
    ],
    result: "Answer: [true, false, true] — O(n + m) for m queries",
  },
  "split-array": {
    title: "Split Array — Prefix + Total",
    subtitle: "nums = [10, 4, −8, 7] — count splits where left ≥ right",
    nums: [10, 4, -8, 7],
    showPrefixRow: true,
    steps: [
      {
        action: "Build prefix, total = 13",
        detail: "prefix = [10, 14, 6, 13]",
        prefixLen: 4,
      },
      {
        action: "Split after index 0",
        detail: "left = prefix[0] = 10, right = 13 − 10 = 3 → 10 ≥ 3 ✓",
        prefixLen: 4,
        splitAfter: 0,
        leftSum: 10,
        rightSum: 3,
      },
      {
        action: "Split after index 1",
        detail: "left = 14, right = 13 − 14 = −1 → 14 ≥ −1 ✓",
        prefixLen: 4,
        splitAfter: 1,
        leftSum: 14,
        rightSum: -1,
      },
      {
        action: "Split after index 2",
        detail: "left = 6, right = 13 − 6 = 7 → 6 ≥ 7 ✗",
        prefixLen: 4,
        splitAfter: 2,
        leftSum: 6,
        rightSum: 7,
      },
    ],
    result: "2 valid splits — O(n) instead of O(n²) brute force",
  },
  "running-sum": {
    title: "Running Sum — O(1) Space",
    subtitle: "Same split problem without storing the prefix array",
    nums: [10, 4, -8, 7],
    showPrefixRow: false,
    steps: [
      {
        action: "Precompute total = 13",
        detail: "One pass over nums — no prefix array needed",
        note: "total = 13",
      },
      {
        action: "i = 0: add nums[0] to left",
        detail: "left = 10, right = 13 − 10 = 3 → valid",
        splitAfter: 0,
        runningLeft: 10,
        leftSum: 10,
        rightSum: 3,
      },
      {
        action: "i = 1: left += nums[1]",
        detail: "left = 14, right = −1 → valid",
        splitAfter: 1,
        runningLeft: 14,
        leftSum: 14,
        rightSum: -1,
      },
      {
        action: "i = 2: left += nums[2]",
        detail: "left = 6, right = 7 → invalid",
        splitAfter: 2,
        runningLeft: 6,
        leftSum: 6,
        rightSum: 7,
      },
    ],
    result: "O(n) time, O(1) space — when you only scan left → right",
  },
};

function buildPrefixValues(nums: number[]): number[] {
  if (nums.length === 0) return [];
  const prefix = [nums[0]];
  for (let i = 1; i < nums.length; i++) {
    prefix.push(nums[i] + prefix[prefix.length - 1]);
  }
  return prefix;
}

interface PrefixSumAnimationProps {
  preset: string;
}

export default function PrefixSumAnimation({ preset }: PrefixSumAnimationProps) {
  const config = PRESETS[preset] ?? PRESETS.build;
  const { title, subtitle, nums, steps, result, showPrefixRow = true } = config;

  const prefixValues = useMemo(() => buildPrefixValues(nums), [nums]);

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const step = steps[stepIndex];
  const isLast = stepIndex >= steps.length - 1;
  const prefixLen = step.prefixLen ?? 0;

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

  const renderRow = (
    label: string,
    values: number[],
    options: {
      visibleCount?: number;
      highlight?: (idx: number) => boolean;
      marker?: (idx: number) => string | null;
      accent?: (idx: number) => "green" | "red" | "sub" | null;
    }
  ) => {
    const { visibleCount = values.length, highlight, marker, accent } = options;

    return (
      <div className="mb-5">
        <p className="mb-2 font-mono-xs text-[var(--muted)]">{label}</p>
        <div
          className="grid gap-2 sm:gap-3"
          style={{
            gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
          }}>
          {values.map((value, idx) => {
            const visible = idx < visibleCount;
            const isHighlighted = highlight?.(idx) ?? false;
            const tag = marker?.(idx);
            const tone = accent?.(idx);

            let border = "border-[var(--line)]";
            let bg = "bg-[var(--bg)]";
            let text = visible ? "text-[var(--fg)]" : "text-[var(--muted)] opacity-40";

            if (isHighlighted) {
              border = "border-[var(--accent)]";
              bg = "bg-[var(--accent-soft)]";
              text = "text-[var(--fg)] scale-105";
            }
            if (tone === "green") {
              border = "border-emerald-500";
              bg = "bg-emerald-500/15";
            }
            if (tone === "red") {
              border = "border-rose-500";
              bg = "bg-rose-500/15";
            }
            if (tone === "sub") {
              border = "border-[var(--accent)]";
              bg = "bg-[var(--accent-soft)]";
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div
                  className={[
                    "relative flex h-11 w-full sm:h-12 items-center justify-center rounded-lg border-2 font-mono text-xs sm:text-sm font-semibold transition-all duration-500",
                    border,
                    bg,
                    text,
                    isHighlighted ? "shadow-[0_0_16px_var(--accent-glow)]" : "",
                  ].join(" ")}>
                  {visible ? value : "·"}
                </div>
                <div className="flex h-5 items-start justify-center">
                  {tag && (
                    <span
                      className={[
                        "rounded px-1.5 py-0.5 font-mono-xs font-bold",
                        tone === "green"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : tone === "red"
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-blue-500/20 text-blue-400",
                      ].join(" ")}>
                      {tag}
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
  };

  const splitLeftEnd = step.splitAfter ?? -1;

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
          {renderRow("nums", nums, {
            highlight: (idx) =>
              step.subFrom !== undefined &&
              step.subTo !== undefined &&
              idx >= step.subFrom &&
              idx <= step.subTo,
            accent: (idx) => {
              if (
                step.subFrom !== undefined &&
                step.subTo !== undefined &&
                idx >= step.subFrom &&
                idx <= step.subTo
              ) {
                return "sub";
              }
              if (splitLeftEnd >= 0 && idx <= splitLeftEnd) return "green";
              if (splitLeftEnd >= 0 && idx > splitLeftEnd) return "red";
              return null;
            },
            marker: (idx) => {
              if (idx === step.splitAfter) return "split";
              return null;
            },
          })}

          {showPrefixRow &&
            renderRow("prefix", prefixValues, {
              visibleCount: prefixLen,
              accent: (idx) => {
                if (idx === step.greenIdx) return "green";
                if (idx === step.redIdx) return "red";
                return null;
              },
              marker: (idx) => {
                if (idx === step.greenIdx) return "j";
                if (idx === step.redIdx) return "i−1";
                return null;
              },
            })}

          {step.runningLeft !== undefined && (
            <div className="mb-4 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-4 py-3">
              <p className="font-mono-xs text-[var(--muted)]">running left</p>
              <p className="mt-1 font-mono text-lg font-semibold text-emerald-400">
                {step.runningLeft}
              </p>
            </div>
          )}

          {(step.leftSum !== undefined || step.rightSum !== undefined) && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                <p className="font-mono-xs text-emerald-400">left sum</p>
                <p className="mt-1 font-mono text-lg font-semibold text-[var(--fg)]">
                  {step.leftSum}
                </p>
              </div>
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3">
                <p className="font-mono-xs text-rose-400">right sum</p>
                <p className="mt-1 font-mono text-lg font-semibold text-[var(--fg)]">
                  {step.rightSum}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip chip-accent font-mono-xs">
              Step {stepIndex + 1}/{steps.length}
            </span>
            {step.note && (
              <span className="font-mono-xs text-[var(--accent)]">{step.note}</span>
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
