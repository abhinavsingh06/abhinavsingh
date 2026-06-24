"use client";

interface Problem {
  num: number;
  name: string;
  pattern: string;
  level: "warm-up" | "core" | "intermediate" | "hard";
  leetcodeId: number;
  leetcodeSlug: string;
}

const PROBLEMS: Problem[] = [
  {
    num: 1,
    name: "Maximum Average Subarray I",
    pattern: "Fixed window",
    level: "warm-up",
    leetcodeId: 643,
    leetcodeSlug: "maximum-average-subarray-i",
  },
  {
    num: 2,
    name: "Maximum Sum Subarray of Size K",
    pattern: "Fixed window",
    level: "warm-up",
    leetcodeId: 643,
    leetcodeSlug: "maximum-average-subarray-i",
  },
  {
    num: 3,
    name: "Minimum Size Subarray Sum",
    pattern: "Variable · Shape A",
    level: "core",
    leetcodeId: 209,
    leetcodeSlug: "minimum-size-subarray-sum",
  },
  {
    num: 4,
    name: "Longest Substring Without Repeating Characters",
    pattern: "Variable · Shape B",
    level: "core",
    leetcodeId: 3,
    leetcodeSlug: "longest-substring-without-repeating-characters",
  },
  {
    num: 5,
    name: "Permutation in String",
    pattern: "Fixed window + freq match",
    level: "intermediate",
    leetcodeId: 567,
    leetcodeSlug: "permutation-in-string",
  },
  {
    num: 6,
    name: "Subarrays with K Different Integers",
    pattern: "atMost(K) − atMost(K−1)",
    level: "intermediate",
    leetcodeId: 992,
    leetcodeSlug: "subarrays-with-k-different-integers",
  },
  {
    num: 7,
    name: "Minimum Window Substring",
    pattern: "Variable + formed counter",
    level: "hard",
    leetcodeId: 76,
    leetcodeSlug: "minimum-window-substring",
  },
  {
    num: 8,
    name: "Sliding Window Maximum",
    pattern: "Monotonic deque",
    level: "hard",
    leetcodeId: 239,
    leetcodeSlug: "sliding-window-maximum",
  },
];

const LEVEL_STYLES: Record<Problem["level"], { label: string; bar: string; badge: string }> = {
  "warm-up": {
    label: "Warm-up",
    bar: "bg-emerald-500",
    badge: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  },
  core: {
    label: "Core",
    bar: "bg-blue-500",
    badge: "text-blue-400 bg-blue-500/15 border-blue-500/30",
  },
  intermediate: {
    label: "Intermediate",
    bar: "bg-amber-500",
    badge: "text-amber-400 bg-amber-500/15 border-amber-500/30",
  },
  hard: {
    label: "Hard",
    bar: "bg-rose-500",
    badge: "text-rose-400 bg-rose-500/15 border-rose-500/30",
  },
};

function ExternalIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-70"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

export default function PracticeProblemsLadder() {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-5 py-4 sm:px-6">
        <p className="font-mono-xs text-[var(--muted)]">Easiest → Hardest</p>
        <p className="mt-1 text-sm text-[var(--fg-2)]">
          Step through the animations in this post first, then click any problem to
          open it on LeetCode.
        </p>
      </div>

      <div className="relative px-5 py-6 sm:px-6">
        <div className="absolute left-[2.6rem] top-8 bottom-8 w-px bg-gradient-to-b from-emerald-500/60 via-amber-500/40 to-rose-500/60 sm:left-[2.85rem]" />

        <div className="space-y-3">
          {PROBLEMS.map((problem) => {
            const style = LEVEL_STYLES[problem.level];
            const href = `https://leetcode.com/problems/${problem.leetcodeSlug}/`;

            return (
              <div
                key={problem.num}
                className="relative flex items-start gap-4 pl-1 sm:gap-5">
                <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--line)] bg-[var(--bg)] font-mono text-sm font-bold text-[var(--accent)] sm:h-10 sm:w-10">
                  {problem.num}
                </div>

                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4 transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]/30 hover:shadow-[0_0_24px_var(--accent-glow)]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono-xs font-semibold ${style.badge}`}>
                      {style.label}
                    </span>
                    <span className="font-mono-xs text-[var(--muted)]">
                      {problem.pattern}
                    </span>
                    <span className="ml-auto font-mono-xs text-[var(--accent)] opacity-70 group-hover:opacity-100">
                      LC {problem.leetcodeId}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="font-medium text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                      {problem.name}
                    </p>
                    <ExternalIcon />
                  </div>

                  {problem.num === 2 && (
                    <p className="mt-1.5 text-xs text-[var(--muted)]">
                      Same fixed-window technique as LC 643 — track sum instead of
                      average.
                    </p>
                  )}

                  <div className={`mt-3 h-0.5 w-12 rounded-full ${style.bar}`} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
