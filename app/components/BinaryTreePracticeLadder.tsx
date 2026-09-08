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
    name: "Maximum Depth of Binary Tree",
    pattern: "DFS height",
    level: "warm-up",
    leetcodeId: 104,
    leetcodeSlug: "maximum-depth-of-binary-tree",
  },
  {
    num: 2,
    name: "Invert Binary Tree",
    pattern: "Swap left/right",
    level: "warm-up",
    leetcodeId: 226,
    leetcodeSlug: "invert-binary-tree",
  },
  {
    num: 3,
    name: "Same Tree",
    pattern: "Parallel DFS",
    level: "warm-up",
    leetcodeId: 100,
    leetcodeSlug: "same-tree",
  },
  {
    num: 4,
    name: "Binary Tree Level Order Traversal",
    pattern: "BFS queue",
    level: "core",
    leetcodeId: 102,
    leetcodeSlug: "binary-tree-level-order-traversal",
  },
  {
    num: 5,
    name: "Validate Binary Search Tree",
    pattern: "Bounds / inorder",
    level: "core",
    leetcodeId: 98,
    leetcodeSlug: "validate-binary-search-tree",
  },
  {
    num: 6,
    name: "Lowest Common Ancestor of a BST",
    pattern: "BST walk",
    level: "core",
    leetcodeId: 235,
    leetcodeSlug: "lowest-common-ancestor-of-a-binary-search-tree",
  },
  {
    num: 7,
    name: "Construct Binary Tree from Preorder and Inorder",
    pattern: "Divide + recurse",
    level: "intermediate",
    leetcodeId: 105,
    leetcodeSlug: "construct-binary-tree-from-preorder-and-inorder-traversal",
  },
  {
    num: 8,
    name: "Binary Tree Maximum Path Sum",
    pattern: "DFS gain",
    level: "hard",
    leetcodeId: 124,
    leetcodeSlug: "binary-tree-maximum-path-sum",
    note: "Track global max; return single-arm gain to parent.",
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

export default function BinaryTreePracticeLadder() {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-5 py-4 sm:px-6">
        <p className="font-mono-xs text-[var(--muted)]">Easiest → Hardest</p>
        <p className="mt-1 text-sm text-[var(--fg-2)]">
          Step through the animations in this post first, then click any problem
          to open it on LeetCode.
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

                  {problem.note && (
                    <p className="mt-1.5 text-xs text-[var(--muted)]">
                      {problem.note}
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
