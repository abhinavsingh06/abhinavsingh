"use client";

import { useCallback, useEffect, useState } from "react";

interface SqStep {
  action: string;
  detail?: string;
  note?: string;
  /** Stack contents bottom → top (top is last) */
  stack?: (number | string)[];
  /** Queue / deque contents front → back */
  queue?: (number | string)[];
  /** Second deque for min/max problems */
  queueB?: (number | string)[];
  /** Input array being scanned */
  input?: (number | string)[];
  /** Highlighted index in input */
  idx?: number;
  /** Window [left, right] inclusive */
  windowFrom?: number;
  windowTo?: number;
  /** Answer / output so far */
  answer?: string;
}

interface Preset {
  title: string;
  subtitle: string;
  mode: "stack" | "queue" | "deque" | "dual-deque";
  steps: SqStep[];
  result: string;
}

const PRESETS: Record<string, Preset> = {
  parentheses: {
    title: "Valid Parentheses — Stack Matching",
    subtitle: 's = "({[]})" — last open is first to close (LIFO)',
    mode: "stack",
    steps: [
      {
        action: "See '(' — push",
        detail: "Opening bracket → stack",
        input: ["(", "{", "[", "]", "}", ")"],
        idx: 0,
        stack: ["("],
      },
      {
        action: "See '{' — push",
        detail: "stack = [ (, { ]",
        input: ["(", "{", "[", "]", "}", ")"],
        idx: 1,
        stack: ["(", "{"],
      },
      {
        action: "See '[' — push",
        detail: "stack = [ (, {, [ ]",
        input: ["(", "{", "[", "]", "}", ")"],
        idx: 2,
        stack: ["(", "{", "["],
      },
      {
        action: "See ']' — pop '['",
        detail: "Top matches closing bracket ✓",
        input: ["(", "{", "[", "]", "}", ")"],
        idx: 3,
        stack: ["(", "{"],
      },
      {
        action: "See '}' then ')' — pop both",
        detail: "Stack empty at end → valid",
        input: ["(", "{", "[", "]", "}", ")"],
        idx: 5,
        stack: [],
      },
    ],
    result: "Return true — O(n) time, O(n) space",
  },
  duplicates: {
    title: "Remove Adjacent Duplicates",
    subtitle: 's = "abbaca" — delete pairs until none remain',
    mode: "stack",
    steps: [
      {
        action: "Push 'a', push 'b'",
        detail: "stack = [a, b]",
        input: ["a", "b", "b", "a", "c", "a"],
        idx: 1,
        stack: ["a", "b"],
      },
      {
        action: "See 'b' — equals top → pop",
        detail: "Adjacent duplicate removed",
        input: ["a", "b", "b", "a", "c", "a"],
        idx: 2,
        stack: ["a"],
      },
      {
        action: "See 'a' — equals top → pop",
        detail: "Now stack is empty",
        input: ["a", "b", "b", "a", "c", "a"],
        idx: 3,
        stack: [],
      },
      {
        action: "Push 'c', push 'a'",
        detail: "Final string = stack joined",
        input: ["a", "b", "b", "a", "c", "a"],
        idx: 5,
        stack: ["c", "a"],
        answer: '"ca"',
      },
    ],
    result: 'Return "ca" — LIFO deletion order',
  },
  backspace: {
    title: "Backspace String Compare",
    subtitle: 's = "ab#c", t = "ad#c" — both become "ac"',
    mode: "stack",
    steps: [
      {
        action: "Type s: a, b",
        detail: "stack_s = [a, b]",
        stack: ["a", "b"],
        note: "s",
      },
      {
        action: "See '#' — pop",
        detail: "Backspace removes most recent char",
        stack: ["a"],
      },
      {
        action: "Type 'c'",
        detail: "stack_s = [a, c]",
        stack: ["a", "c"],
        answer: 's → "ac"',
      },
      {
        action: "Same for t → [a, c]",
        detail: "Stacks equal → strings equal",
        stack: ["a", "c"],
        answer: 't → "ac"',
      },
    ],
    result: "Return true — simulate typing with a stack",
  },
  "recent-calls": {
    title: "Number of Recent Calls",
    subtitle: "Keep only pings in [t − 3000, t] — FIFO queue",
    mode: "queue",
    steps: [
      {
        action: "ping(1)",
        detail: "queue = [1], count = 1",
        queue: [1],
        answer: "1",
      },
      {
        action: "ping(100)",
        detail: "queue = [1, 100], both in window",
        queue: [1, 100],
        answer: "2",
      },
      {
        action: "ping(3001)",
        detail: "queue = [1, 100, 3001]",
        queue: [1, 100, 3001],
        answer: "3",
      },
      {
        action: "ping(3002) — dequeue 1",
        detail: "1 < 3002 − 3000 → remove from front",
        queue: [100, 3001, 3002],
        answer: "3",
      },
    ],
    result: "O(1) amortized dequeue — outdated calls leave the front",
  },
  "daily-temps": {
    title: "Daily Temperatures — Monotonic Stack",
    subtitle: "temps = [73, 74, 75, 71, 69, 72, 76] — days until warmer",
    mode: "stack",
    steps: [
      {
        action: "i = 0, push index 0",
        detail: "stack holds indices of unresolved days",
        input: [73, 74, 75, 71, 69, 72, 76],
        idx: 0,
        stack: [0],
        note: "decreasing stack",
      },
      {
        action: "i = 1, 74 > 73 → pop 0",
        detail: "answer[0] = 1 − 0 = 1 day",
        input: [73, 74, 75, 71, 69, 72, 76],
        idx: 1,
        stack: [1],
        answer: "[1, 0, 0, 0, 0, 0, 0]",
      },
      {
        action: "i = 2, 75 > 74 → pop 1",
        detail: "answer[1] = 1 — keep pushing colder days",
        input: [73, 74, 75, 71, 69, 72, 76],
        idx: 2,
        stack: [2],
        answer: "[1, 1, 0, 0, 0, 0, 0]",
      },
      {
        action: "Push 71, 69 — colder",
        detail: "stack = [2, 3, 4]",
        input: [73, 74, 75, 71, 69, 72, 76],
        idx: 4,
        stack: [2, 3, 4],
      },
      {
        action: "72 pops 69 and 71",
        detail: "First warmer for those days",
        input: [73, 74, 75, 71, 69, 72, 76],
        idx: 5,
        stack: [2, 5],
        answer: "[1, 1, 0, 2, 1, 0, 0]",
      },
      {
        action: "76 pops everything left",
        detail: "answer[2] = 4, answer[5] = 1",
        input: [73, 74, 75, 71, 69, 72, 76],
        idx: 6,
        stack: [6],
        answer: "[1, 1, 4, 2, 1, 1, 0]",
      },
    ],
    result: "O(n) — each index pushed/popped at most once",
  },
  "window-max": {
    title: "Sliding Window Maximum — Monotonic Deque",
    subtitle: "nums = [1, 3, −1, −3, 5, 3, 6, 7], k = 3",
    mode: "deque",
    steps: [
      {
        action: "Window [1, 3, −1]",
        detail: "Deque indices (decreasing values): [1] → max = 3",
        input: [1, 3, -1, -3, 5, 3, 6, 7],
        windowFrom: 0,
        windowTo: 2,
        queue: [3],
        answer: "[3]",
        note: "k = 3",
      },
      {
        action: "Slide — add −3",
        detail: "−3 < 3 and −1 — append; max still 3",
        input: [1, 3, -1, -3, 5, 3, 6, 7],
        windowFrom: 1,
        windowTo: 3,
        queue: [3, -1, -3],
        answer: "[3, 3]",
      },
      {
        action: "Add 5 — pop smaller from right",
        detail: "No need for 3, −1, −3 once 5 arrives",
        input: [1, 3, -1, -3, 5, 3, 6, 7],
        windowFrom: 2,
        windowTo: 4,
        queue: [5],
        answer: "[3, 3, 5]",
      },
      {
        action: "Continue to end",
        detail: "Front always holds window max",
        input: [1, 3, -1, -3, 5, 3, 6, 7],
        windowFrom: 5,
        windowTo: 7,
        queue: [7],
        answer: "[3, 3, 5, 5, 6, 7]",
      },
    ],
    result: "O(n) time — deque never grows beyond k",
  },
};

interface StackQueueAnimationProps {
  preset: string;
}

export default function StackQueueAnimation({
  preset,
}: StackQueueAnimationProps) {
  const config = PRESETS[preset] ?? PRESETS.parentheses;
  const { title, subtitle, mode, steps, result } = config;

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
    const timer = setTimeout(() => setStepIndex((i) => i + 1), 1500);
    return () => clearTimeout(timer);
  }, [playing, stepIndex, isLast]);

  const renderStrip = (
    label: string,
    items: (number | string)[] | undefined,
    options?: { highlightLast?: boolean; emptyLabel?: string }
  ) => {
    const list = items ?? [];
    return (
      <div className="mb-4">
        <p className="mb-2 font-mono-xs text-[var(--muted)]">{label}</p>
        <div className="flex flex-wrap items-center gap-2">
          {list.length === 0 ? (
            <span className="font-mono-xs text-[var(--muted)]">
              {options?.emptyLabel ?? "(empty)"}
            </span>
          ) : (
            list.map((item, i) => {
              const isTop =
                options?.highlightLast && i === list.length - 1;
              return (
                <div
                  key={`${label}-${i}-${item}`}
                  className={[
                    "flex h-11 min-w-[2.75rem] items-center justify-center rounded-lg border-2 px-2 font-mono text-sm font-semibold transition-all duration-500",
                    isTop
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg)] scale-105"
                      : "border-[var(--line)] bg-[var(--bg)] text-[var(--fg)]",
                  ].join(" ")}>
                  {item}
                </div>
              );
            })
          )}
          {mode === "stack" && list.length > 0 && (
            <span className="font-mono-xs text-[var(--accent)]">← top</span>
          )}
          {(mode === "queue" || mode === "deque") && list.length > 0 && (
            <span className="font-mono-xs text-[var(--muted)]">
              front → back
            </span>
          )}
        </div>
      </div>
    );
  };

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
          {step.input && (
            <div className="mb-5">
              <p className="mb-2 font-mono-xs text-[var(--muted)]">input</p>
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${step.input.length}, minmax(0, 1fr))`,
                }}>
                {step.input.map((value, idx) => {
                  const inWindow =
                    step.windowFrom !== undefined &&
                    step.windowTo !== undefined &&
                    idx >= step.windowFrom &&
                    idx <= step.windowTo;
                  const isIdx = step.idx === idx;

                  return (
                    <div
                      key={idx}
                      className={[
                        "flex h-11 items-center justify-center rounded-lg border-2 font-mono text-xs sm:text-sm font-semibold transition-all duration-500",
                        isIdx || inWindow
                          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg)]"
                          : "border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]",
                      ].join(" ")}>
                      {value}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {mode === "stack" &&
            renderStrip("stack (bottom → top)", step.stack, {
              highlightLast: true,
            })}
          {(mode === "queue" || mode === "deque") &&
            renderStrip(
              mode === "deque" ? "deque" : "queue",
              step.queue,
              { highlightLast: false }
            )}
          {mode === "dual-deque" && (
            <>
              {renderStrip("max deque", step.queue)}
              {renderStrip("min deque", step.queueB)}
            </>
          )}

          {step.answer && (
            <p className="mt-2 font-mono-xs text-[var(--fg-2)]">
              answer:{" "}
              <span className="text-[var(--accent)]">{step.answer}</span>
            </p>
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
