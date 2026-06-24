"use client";

import { useCallback, useEffect, useState } from "react";

interface CommitNode {
  id: string;
  label: string;
  x: number;
  y: number;
  branch: "main" | "feature";
}

interface BranchEdge {
  from: string;
  to: string;
  style?: "solid" | "dashed" | "merge";
}

interface BranchStep {
  action: string;
  command?: string;
  detail: string;
  nodes: CommitNode[];
  edges: BranchEdge[];
}

interface Preset {
  title: string;
  subtitle: string;
  steps: BranchStep[];
  result: string;
}

const PRESETS: Record<string, Preset> = {
  "feature-branch": {
    title: "Creating a Feature Branch",
    subtitle: "Branch off main and work in isolation",
    steps: [
      {
        action: "Start on main",
        detail: "main has two commits. You're about to start a new feature.",
        nodes: [
          { id: "a", label: "A", x: 60, y: 120, branch: "main" },
          { id: "b", label: "B", x: 160, y: 120, branch: "main" },
        ],
        edges: [{ from: "a", to: "b" }],
      },
      {
        command: "git checkout -b feature-login",
        action: "Create & switch branch",
        detail: "feature-login points at the same commit as main. Your work won't touch main yet.",
        nodes: [
          { id: "a", label: "A", x: 60, y: 120, branch: "main" },
          { id: "b", label: "B", x: 160, y: 120, branch: "main" },
          { id: "c", label: "C", x: 260, y: 80, branch: "feature" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "c", style: "dashed" },
        ],
      },
      {
        command: 'git commit -m "Add login form"',
        action: "Commit on feature branch",
        detail: "New commits live only on feature-login. main stays at B.",
        nodes: [
          { id: "a", label: "A", x: 60, y: 120, branch: "main" },
          { id: "b", label: "B", x: 160, y: 120, branch: "main" },
          { id: "c", label: "C", x: 260, y: 80, branch: "feature" },
          { id: "d", label: "D", x: 360, y: 80, branch: "feature" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "c", style: "dashed" },
          { from: "c", to: "d" },
        ],
      },
    ],
    result: "Feature branches let you experiment without breaking main.",
  },
  merge: {
    title: "Merging a Branch",
    subtitle: "Combine feature work back into main",
    steps: [
      {
        action: "Two branches diverged",
        detail: "main moved forward to F while you built feature-login.",
        nodes: [
          { id: "a", label: "A", x: 40, y: 120, branch: "main" },
          { id: "b", label: "B", x: 130, y: 120, branch: "main" },
          { id: "c", label: "C", x: 220, y: 70, branch: "feature" },
          { id: "d", label: "D", x: 310, y: 70, branch: "feature" },
          { id: "f", label: "F", x: 220, y: 170, branch: "main" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "c", style: "dashed" },
          { from: "c", to: "d" },
          { from: "b", to: "f" },
        ],
      },
      {
        command: "git checkout main && git merge feature-login",
        action: "Merge feature into main",
        detail: "Git creates a merge commit M that joins both histories.",
        nodes: [
          { id: "a", label: "A", x: 40, y: 120, branch: "main" },
          { id: "b", label: "B", x: 130, y: 120, branch: "main" },
          { id: "c", label: "C", x: 220, y: 70, branch: "feature" },
          { id: "d", label: "D", x: 310, y: 70, branch: "feature" },
          { id: "f", label: "F", x: 220, y: 170, branch: "main" },
          { id: "m", label: "M", x: 400, y: 120, branch: "main" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "c", style: "dashed" },
          { from: "c", to: "d" },
          { from: "b", to: "f" },
          { from: "d", to: "m", style: "merge" },
          { from: "f", to: "m", style: "merge" },
        ],
      },
    ],
    result: "Merge preserves full history — you can see exactly when branches joined.",
  },
  rebase: {
    title: "Rebasing a Branch",
    subtitle: "Replay commits on top of latest main",
    steps: [
      {
        action: "Before rebase",
        detail: "feature-login branched off B, but main has moved to C.",
        nodes: [
          { id: "a", label: "A", x: 40, y: 120, branch: "main" },
          { id: "b", label: "B", x: 130, y: 120, branch: "main" },
          { id: "c", label: "C", x: 220, y: 120, branch: "main" },
          { id: "d", label: "D", x: 220, y: 60, branch: "feature" },
          { id: "e", label: "E", x: 310, y: 60, branch: "feature" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "c" },
          { from: "b", to: "d", style: "dashed" },
          { from: "d", to: "e" },
        ],
      },
      {
        command: "git checkout feature-login && git rebase main",
        action: "Rebase onto main",
        detail: "Commits D and E are replayed on top of C. History looks linear.",
        nodes: [
          { id: "a", label: "A", x: 40, y: 120, branch: "main" },
          { id: "b", label: "B", x: 130, y: 120, branch: "main" },
          { id: "c", label: "C", x: 220, y: 120, branch: "main" },
          { id: "d2", label: "D'", x: 310, y: 120, branch: "feature" },
          { id: "e2", label: "E'", x: 400, y: 120, branch: "feature" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "c" },
          { from: "c", to: "d2" },
          { from: "d2", to: "e2" },
        ],
      },
    ],
    result: "Rebase = cleaner history. Never rebase shared/public branches.",
  },
  conflict: {
    title: "Resolving a Merge Conflict",
    subtitle: "When Git can't auto-combine changes",
    steps: [
      {
        action: "Both branches edited the same line",
        detail: 'main has "Hello Friend", feature has "Hello World".',
        nodes: [
          { id: "a", label: "A", x: 80, y: 120, branch: "main" },
          { id: "b", label: "B", x: 180, y: 120, branch: "main" },
          { id: "c", label: "C", x: 180, y: 60, branch: "feature" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "c", style: "dashed" },
        ],
      },
      {
        command: "git merge feature-branch",
        action: "Conflict detected",
        detail: "Git pauses the merge and marks the file. You choose what to keep.",
        nodes: [
          { id: "a", label: "A", x: 80, y: 120, branch: "main" },
          { id: "b", label: "B", x: 180, y: 120, branch: "main" },
          { id: "c", label: "C", x: 180, y: 60, branch: "feature" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "c", style: "dashed" },
        ],
      },
      {
        command: "git add . && git commit",
        action: "Resolve & complete merge",
        detail: "Edit the file, remove conflict markers, stage, and commit to finish.",
        nodes: [
          { id: "a", label: "A", x: 80, y: 120, branch: "main" },
          { id: "b", label: "B", x: 180, y: 120, branch: "main" },
          { id: "c", label: "C", x: 180, y: 60, branch: "feature" },
          { id: "m", label: "M", x: 280, y: 90, branch: "main" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "c", style: "dashed" },
          { from: "c", to: "m", style: "merge" },
          { from: "b", to: "m", style: "merge" },
        ],
      },
    ],
    result: "Conflicts are normal. Fix the file → git add → git commit.",
  },
};

function nodeColor(branch: CommitNode["branch"]) {
  return branch === "main" ? "#d4ff3a" : "#5eb3ff";
}

interface GitBranchingAnimationProps {
  preset: string;
}

export default function GitBranchingAnimation({
  preset,
}: GitBranchingAnimationProps) {
  const config = PRESETS[preset] ?? PRESETS["feature-branch"];
  const { title, subtitle, steps, result } = config;

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = steps[stepIndex];
  const isLast = stepIndex >= steps.length - 1;

  const goTo = useCallback(
    (i: number) => setStepIndex(Math.max(0, Math.min(i, steps.length - 1))),
    [steps.length]
  );

  useEffect(() => {
    if (!playing || isLast) {
      if (isLast) setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), 1800);
    return () => clearTimeout(t);
  }, [playing, stepIndex, isLast]);

  const nodeMap = Object.fromEntries(step.nodes.map((n) => [n.id, n]));

  return (
    <div className="my-6 sm:my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <h3 className="font-display text-lg sm:text-xl text-[var(--fg)]">{title}</h3>
        <p className="mt-1 font-mono-xs text-[var(--muted)]">{subtitle}</p>
      </div>

      <div className="px-4 py-6 sm:px-6">
        <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
          <svg viewBox="0 0 460 220" className="mx-auto w-full max-w-lg" aria-hidden>
            {/* Branch labels */}
            <text x="12" y="78" fill="#5eb3ff" fontSize="10" fontFamily="monospace" opacity="0.7">feature</text>
            <text x="12" y="128" fill="#d4ff3a" fontSize="10" fontFamily="monospace" opacity="0.7">main</text>

            {step.edges.map((edge) => {
              const from = nodeMap[edge.from];
              const to = nodeMap[edge.to];
              if (!from || !to) return null;
              const dash = edge.style === "dashed" ? "6 4" : edge.style === "merge" ? "4 3" : undefined;
              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={edge.style === "merge" ? "#f59e0b" : "var(--muted)"}
                  strokeWidth={edge.style === "merge" ? 2 : 1.5}
                  strokeDasharray={dash}
                  opacity={0.6}
                />
              );
            })}

            {step.nodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={16}
                  fill={nodeColor(node.branch)}
                  fillOpacity={0.2}
                  stroke={nodeColor(node.branch)}
                  strokeWidth={2}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill={nodeColor(node.branch)}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="monospace">
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {preset === "conflict" && stepIndex === 1 && (
          <pre className="mt-4 overflow-x-auto rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 font-mono text-xs text-[var(--fg-2)]">
{`<<<<<<< HEAD
Hello Friend
=======
Hello World
>>>>>>> feature-branch`}
          </pre>
        )}

        <div className="mt-4 rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip chip-accent font-mono-xs">
              Step {stepIndex + 1}/{steps.length}
            </span>
            {step.command && (
              <code className="rounded bg-[var(--bg-elev-2)] px-2 py-0.5 font-mono-xs text-[var(--accent)]">
                {step.command}
              </code>
            )}
          </div>
          <p className="mt-3 text-sm font-semibold text-[var(--fg)]">{step.action}</p>
          <p className="mt-1 text-sm text-[var(--fg-2)]">{step.detail}</p>
          {isLast && (
            <p className="mt-3 rounded-md bg-[var(--accent-soft)] px-3 py-2 text-sm font-semibold text-[var(--accent)]">
              {result}
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button onClick={() => goTo(0)} className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] hover:border-[var(--accent)]">
            ↺ Reset
          </button>
          <button onClick={() => goTo(stepIndex - 1)} disabled={stepIndex === 0} className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] disabled:opacity-30">
            ← Prev
          </button>
          <button onClick={() => setPlaying((p) => !p)} className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-5 py-2 font-mono-xs font-semibold text-[var(--accent)]">
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={() => goTo(stepIndex + 1)} disabled={isLast} className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] disabled:opacity-30">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
