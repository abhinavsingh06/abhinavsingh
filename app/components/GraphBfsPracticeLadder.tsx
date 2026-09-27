"use client";

interface Problem {
  num: number;
  name: string;
  pattern: string;
  level: "warm-up" | "core" | "intermediate" | "hard";
  leetcodeId: number;
  leetcodeSlug: string;
  note?: string;
}

const PROBLEMS: Problem[] = [
  {
    num: 1,
    name: "Flood Fill",
    pattern: "Grid BFS",
    level: "warm-up",
    leetcodeId: 733,
    leetcodeSlug: "flood-fill",
  },
  {
    num: 2,
    name: "Number of Islands",
    pattern: "BFS each component",
    level: "warm-up",
    leetcodeId: 200,
    leetcodeSlug: "number-of-islands",
  },
  {
    num: 3,
    name: "Clone Graph",
    pattern: "BFS + map old → new",
    level: "core",
    leetcodeId: 133,
    leetcodeSlug: "clone-graph",
  },
  {
    num: 4,
    name: "Rotting Oranges",
    pattern: "Multi-source BFS",
    level: "core",
    leetcodeId: 994,
    leetcodeSlug: "rotting-oranges",
    note: "Every rotten orange starts in the queue at minute 0.",
  },
  {
    num: 5,
    name: "Shortest Path in Binary Matrix",
    pattern: "Grid shortest path",
    level: "intermediate",
    leetcodeId: 1091,
    leetcodeSlug: "shortest-path-in-binary-matrix",
  },
  {
    num: 6,
    name: "01 Matrix",
    pattern: "Multi-source distance",
    level: "intermediate",
    leetcodeId: 542,
    leetcodeSlug: "01-matrix",
  },
  {
    num: 7,
    name: "Word Ladder",
    pattern: "Implicit graph BFS",
    level: "hard",
    leetcodeId: 127,
    leetcodeSlug: "word-ladder",
    note: "Each word is a node; an edge exists when one letter differs.",
  },
];

const LEVEL_STYLES: Record<
  Problem["level"],
  { label: string; bar: string; badge: string }
> = {
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

export default function GraphBfsPracticeLadder() {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-5 py-4 sm:px-6">
        <p className="font-mono-xs text-[var(--muted)]">Easiest → Hardest</p>
        <p className="mt-1 text-sm text-[var(--fg-2)]">
          Walk the animations first, then open a problem on LeetCode.
        </p>
      </div>
      <div className="relative px-5 py-6 sm:px-6">
        <div className="absolute bottom-8 left-[2.6rem] top-8 w-px bg-gradient-to-b from-emerald-500/60 via-amber-500/40 to-rose-500/60 sm:left-[2.85rem]" />
        <div className="space-y-3">
          {PROBLEMS.map((problem) => {
            const style = LEVEL_STYLES[problem.level];
            const href = `https://leetcode.com/problems/${problem.leetcodeSlug}/`;
            return (
              <div key={problem.num} className="relative flex items-start gap-4 pl-1 sm:gap-5">
                <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--line)] bg-[var(--bg)] font-mono text-sm font-bold text-[var(--accent)] sm:h-10 sm:w-10">
                  {problem.num}
                </div>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4 transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]/30">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 font-mono-xs font-semibold ${style.badge}`}>
                      {style.label}
                    </span>
                    <span className="font-mono-xs text-[var(--muted)]">{problem.pattern}</span>
                    <span className="ml-auto font-mono-xs text-[var(--accent)] opacity-70 group-hover:opacity-100">
                      LC {problem.leetcodeId}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="font-medium text-[var(--fg)] group-hover:text-[var(--accent)]">
                      {problem.name}
                    </p>
                    <ExternalIcon />
                  </div>
                  {problem.note ? (
                    <p className="mt-1.5 text-xs text-[var(--muted)]">{problem.note}</p>
                  ) : null}
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
