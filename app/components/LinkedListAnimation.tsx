"use client";

import { useCallback, useEffect, useState } from "react";

interface LlStep {
  action: string;
  detail?: string;
  note?: string;
  values: (number | string)[];
  /** Index highlights */
  curr?: number;
  prev?: number;
  next?: number;
  slow?: number;
  fast?: number;
  /** Edge indices that are "broken" / not drawn (from → to) */
  hideEdgeFrom?: number;
  /** Show reverse arrows for indices that point backward */
  reverseEdges?: boolean;
  /** Cycle: last node points back to this index */
  cycleTo?: number;
  /** Dimmed / deleted node index */
  deleted?: number;
}

interface Preset {
  title: string;
  subtitle: string;
  steps: LlStep[];
  result: string;
}

const PRESETS: Record<string, Preset> = {
  build: {
    title: "Building a Singly Linked List",
    subtitle: "1 → 2 → 3 — each node holds val and next",
    steps: [
      {
        action: "Create node 1 (head)",
        detail: "head.val = 1, head.next = null",
        values: [1],
        curr: 0,
        note: "keep a reference to head",
      },
      {
        action: "Create node 2, link head.next",
        detail: "head.next = node2",
        values: [1, 2],
        curr: 1,
        prev: 0,
      },
      {
        action: "Create node 3, link node2.next",
        detail: "node2.next = node3 — list complete",
        values: [1, 2, 3],
        curr: 2,
        prev: 1,
      },
    ],
    result: "Head is the only node that can reach every element",
  },
  insert: {
    title: "Insert at Position i",
    subtitle: "Insert 99 after node 1 in 1 → 2 → 3",
    steps: [
      {
        action: "Start with 1 → 2 → 3",
        detail: "Want to insert after the node at i − 1 (value 1)",
        values: [1, 2, 3],
        prev: 0,
        next: 1,
      },
      {
        action: "newNode.next = prev.next",
        detail: "99 points at 2 — rest of list is preserved",
        values: [1, 99, 2, 3],
        prev: 0,
        curr: 1,
        next: 2,
      },
      {
        action: "prev.next = newNode",
        detail: "1 now points at 99 → O(1) with a prev reference",
        values: [1, 99, 2, 3],
        prev: 0,
        curr: 1,
      },
    ],
    result: "Without prev, finding position i costs O(n)",
  },
  delete: {
    title: "Delete at Position i",
    subtitle: "Delete 2 from 1 → 2 → 3",
    steps: [
      {
        action: "prev points at 1",
        detail: "prev.next is the node to delete (2)",
        values: [1, 2, 3],
        prev: 0,
        curr: 1,
        next: 2,
      },
      {
        action: "prev.next = prev.next.next",
        detail: "1 now points at 3 — 2 is unreachable",
        values: [1, 2, 3],
        prev: 0,
        deleted: 1,
        next: 2,
        hideEdgeFrom: 0,
      },
      {
        action: "List is 1 → 3",
        detail: "Severed next pointer removes the node from the list",
        values: [1, 3],
        prev: 0,
        next: 1,
      },
    ],
    result: "O(1) delete when you already hold prev",
  },
  reverse: {
    title: "Reverse a Linked List",
    subtitle: "1 → 2 → 3 → 4 becomes 4 → 3 → 2 → 1",
    steps: [
      {
        action: "prev = null, curr = head",
        detail: "Need nextNode before flipping curr.next",
        values: [1, 2, 3, 4],
        curr: 0,
        note: "three pointers",
      },
      {
        action: "Flip 1 → null",
        detail: "nextNode = 2; curr.next = prev; advance prev & curr",
        values: [1, 2, 3, 4],
        prev: 0,
        curr: 1,
        next: 2,
        reverseEdges: true,
      },
      {
        action: "Flip 2 → 1",
        detail: "List so far: null ← 1 ← 2 | 3 → 4",
        values: [1, 2, 3, 4],
        prev: 1,
        curr: 2,
        next: 3,
        reverseEdges: true,
      },
      {
        action: "Flip 3 → 2",
        detail: "null ← 1 ← 2 ← 3 | 4",
        values: [1, 2, 3, 4],
        prev: 2,
        curr: 3,
        reverseEdges: true,
      },
      {
        action: "Flip 4 → 3, curr = null",
        detail: "prev is the new head",
        values: [4, 3, 2, 1],
        prev: 0,
        reverseEdges: true,
      },
    ],
    result: "O(n) time, O(1) space — classic interview reverse",
  },
  middle: {
    title: "Middle Node — Fast & Slow",
    subtitle: "1 → 2 → 3 → 4 → 5 — find the middle value",
    steps: [
      {
        action: "slow = head, fast = head",
        detail: "fast moves 2× as fast as slow",
        values: [1, 2, 3, 4, 5],
        slow: 0,
        fast: 0,
      },
      {
        action: "Move once",
        detail: "slow → 2, fast → 3",
        values: [1, 2, 3, 4, 5],
        slow: 1,
        fast: 2,
      },
      {
        action: "Move again",
        detail: "slow → 3, fast → 5",
        values: [1, 2, 3, 4, 5],
        slow: 2,
        fast: 4,
      },
      {
        action: "fast.next is null — stop",
        detail: "slow is at the middle",
        values: [1, 2, 3, 4, 5],
        slow: 2,
        fast: 4,
      },
    ],
    result: "Return 3 — O(n) time, O(1) space (no array cheat)",
  },
  cycle: {
    title: "Detect a Cycle",
    subtitle: "Floyd's tortoise and hare — do slow and fast ever meet?",
    steps: [
      {
        action: "No cycle — linear track",
        detail: "Fast finishes; slow never catches up",
        values: [1, 2, 3, 4],
        slow: 0,
        fast: 0,
      },
      {
        action: "With cycle 2 → 3 → 4 → 2",
        detail: "Circular track — fast will lap slow",
        values: [1, 2, 3, 4],
        slow: 0,
        fast: 0,
        cycleTo: 1,
      },
      {
        action: "After moves…",
        detail: "slow at 3, fast at 3 — they meet ✓",
        values: [1, 2, 3, 4],
        slow: 2,
        fast: 2,
        cycleTo: 1,
        note: "cycle detected",
      },
    ],
    result: "O(n) time, O(1) space — better than hashing every node",
  },
  "kth-end": {
    title: "k-th Node From the End",
    subtitle: "1 → 2 → 3 → 4 → 5, k = 2 → return 4",
    steps: [
      {
        action: "Advance fast by k steps",
        detail: "Gap of k between slow and fast",
        values: [1, 2, 3, 4, 5],
        slow: 0,
        fast: 2,
        note: "k = 2",
      },
      {
        action: "Move both at same speed",
        detail: "slow → 2, fast → 4",
        values: [1, 2, 3, 4, 5],
        slow: 1,
        fast: 3,
      },
      {
        action: "fast reaches the end",
        detail: "slow is k nodes behind → answer",
        values: [1, 2, 3, 4, 5],
        slow: 3,
        fast: 4,
      },
    ],
    result: "Return node 4 — O(n) one pass, O(1) space",
  },
  "swap-pairs": {
    title: "Swap Nodes in Pairs",
    subtitle: "1 → 2 → 3 → 4 → 5 → 6 becomes 2 → 1 → 4 → 3 → 6 → 5",
    steps: [
      {
        action: "Pair A, B = 1, 2",
        detail: "Save nextNode = C before flipping B.next",
        values: [1, 2, 3, 4, 5, 6],
        curr: 0,
        next: 1,
      },
      {
        action: "B → A, A → D later",
        detail: "2 → 1, then connect 1 to next pair",
        values: [2, 1, 3, 4, 5, 6],
        prev: 1,
        curr: 2,
        next: 3,
      },
      {
        action: "Swap 3, 4 then 5, 6",
        detail: "Repeat until fewer than 2 nodes remain",
        values: [2, 1, 4, 3, 6, 5],
        curr: 4,
        next: 5,
      },
    ],
    result: "O(n) time, O(1) space — pointer choreography",
  },
};

interface LinkedListAnimationProps {
  preset: string;
}

export default function LinkedListAnimation({
  preset,
}: LinkedListAnimationProps) {
  const config = PRESETS[preset] ?? PRESETS.build;
  const { title, subtitle, steps, result } = config;

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

  const { values } = step;

  return (
    <div className="my-6 sm:my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <h3 className="font-display text-lg sm:text-xl text-[var(--fg)]">
          {title}
        </h3>
        <p className="mt-1 font-mono-xs text-[var(--muted)]">{subtitle}</p>
      </div>

      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-3xl overflow-x-auto">
          <div className="flex min-w-max items-center justify-center gap-1 py-2">
            {values.map((value, idx) => {
              const isCurr = step.curr === idx;
              const isPrev = step.prev === idx;
              const isNext = step.next === idx;
              const isSlow = step.slow === idx;
              const isFast = step.fast === idx;
              const isDeleted = step.deleted === idx;
              const highlighted =
                isCurr || isPrev || isNext || isSlow || isFast;

              const showArrow =
                idx < values.length - 1 &&
                !(step.hideEdgeFrom === idx) &&
                !isDeleted;

              return (
                <div key={idx} className="flex items-center gap-1">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={[
                        "relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg border-2 font-mono text-sm font-semibold transition-all duration-500",
                        isDeleted
                          ? "border-rose-500/40 bg-rose-500/10 text-rose-400/60 line-through opacity-50"
                          : highlighted
                            ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg)] scale-105"
                            : "border-[var(--line)] bg-[var(--bg)] text-[var(--fg)]",
                      ].join(" ")}>
                      {value}
                    </div>
                    <div className="flex h-5 flex-wrap items-start justify-center gap-0.5">
                      {isPrev && (
                        <span className="rounded bg-blue-500/20 px-1 font-mono-xs text-blue-400">
                          prev
                        </span>
                      )}
                      {isCurr && (
                        <span className="rounded bg-[var(--accent-soft)] px-1 font-mono-xs text-[var(--accent)]">
                          curr
                        </span>
                      )}
                      {isNext && (
                        <span className="rounded bg-emerald-500/20 px-1 font-mono-xs text-emerald-400">
                          next
                        </span>
                      )}
                      {isSlow && (
                        <span className="rounded bg-blue-500/20 px-1 font-mono-xs text-blue-400">
                          slow
                        </span>
                      )}
                      {isFast && (
                        <span className="rounded bg-rose-500/20 px-1 font-mono-xs text-rose-400">
                          fast
                        </span>
                      )}
                    </div>
                  </div>

                  {showArrow && (
                    <span
                      className={[
                        "font-mono text-lg transition-colors",
                        step.reverseEdges && idx < (step.prev ?? -1)
                          ? "text-[var(--accent)]"
                          : "text-[var(--muted)]",
                      ].join(" ")}
                      aria-hidden="true">
                      {step.reverseEdges && idx < (step.curr ?? values.length)
                        ? "←"
                        : "→"}
                    </span>
                  )}
                </div>
              );
            })}

            {step.cycleTo !== undefined && (
              <span className="ml-2 font-mono-xs text-rose-400">
                ↻ cycle → {values[step.cycleTo]}
              </span>
            )}

            {!step.cycleTo && values.length > 0 && (
              <span className="ml-1 font-mono-xs text-[var(--muted)]">
                → null
              </span>
            )}
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
