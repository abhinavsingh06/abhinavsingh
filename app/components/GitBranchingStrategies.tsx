"use client";

import { useCallback, useEffect, useState } from "react";

interface CommitNode {
  id: string;
  label: string;
  x: number;
  y: number;
  branch: "main" | "develop" | "feature" | "release" | "hotfix";
}

interface BranchEdge {
  from: string;
  to: string;
  style?: "solid" | "dashed" | "merge";
}

interface StrategyStep {
  action: string;
  command?: string;
  detail: string;
  nodes: CommitNode[];
  edges: BranchEdge[];
}

interface Strategy {
  id: string;
  name: string;
  tagline: string;
  bestFor: string;
  branchLifespan: string;
  steps: StrategyStep[];
  result: string;
}

const BRANCH_COLORS: Record<CommitNode["branch"], string> = {
  main: "#d4ff3a",
  develop: "#5eb3ff",
  feature: "#a78bfa",
  release: "#f59e0b",
  hotfix: "#ff5e57",
};

const STRATEGIES: Strategy[] = [
  {
    id: "github",
    name: "GitHub Flow",
    tagline: "One main branch. Ship constantly.",
    bestFor: "Startups, web apps, SaaS, most small–mid teams",
    branchLifespan: "Days — branch → PR → merge → delete",
    result: "Simplest daily flow. If you only learn one strategy, learn this.",
    steps: [
      {
        action: "main is always deployable",
        detail: "Production runs from main. Every commit on main should be releasable.",
        nodes: [
          { id: "a", label: "A", x: 80, y: 120, branch: "main" },
          { id: "b", label: "B", x: 180, y: 120, branch: "main" },
        ],
        edges: [{ from: "a", to: "b" }],
      },
      {
        command: "git checkout -b feature/checkout",
        action: "Branch for every change",
        detail: "New feature, bug fix, or tweak — always branch off latest main.",
        nodes: [
          { id: "a", label: "A", x: 80, y: 120, branch: "main" },
          { id: "b", label: "B", x: 180, y: 120, branch: "main" },
          { id: "c", label: "C", x: 280, y: 70, branch: "feature" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "c", style: "dashed" },
        ],
      },
      {
        command: "git push -u origin feature/checkout",
        action: "Open a Pull Request",
        detail: "Push your branch and open a PR. Teammates review before anything hits main.",
        nodes: [
          { id: "a", label: "A", x: 80, y: 120, branch: "main" },
          { id: "b", label: "B", x: 180, y: 120, branch: "main" },
          { id: "c", label: "C", x: 280, y: 70, branch: "feature" },
          { id: "d", label: "D", x: 380, y: 70, branch: "feature" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "c", style: "dashed" },
          { from: "c", to: "d" },
        ],
      },
      {
        command: "Merge PR on GitHub",
        action: "Merge to main → deploy",
        detail: "After approval, merge the PR. CI deploys main automatically.",
        nodes: [
          { id: "a", label: "A", x: 80, y: 120, branch: "main" },
          { id: "b", label: "B", x: 180, y: 120, branch: "main" },
          { id: "c", label: "C", x: 280, y: 70, branch: "feature" },
          { id: "d", label: "D", x: 380, y: 70, branch: "feature" },
          { id: "e", label: "E", x: 380, y: 120, branch: "main" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "c", style: "dashed" },
          { from: "c", to: "d" },
          { from: "b", to: "e" },
          { from: "d", to: "e", style: "merge" },
        ],
      },
      {
        command: "git branch -d feature/checkout",
        action: "Delete the branch",
        detail: "Merged branches get deleted. main moves forward. Start the next feature.",
        nodes: [
          { id: "a", label: "A", x: 80, y: 120, branch: "main" },
          { id: "b", label: "B", x: 180, y: 120, branch: "main" },
          { id: "e", label: "E", x: 280, y: 120, branch: "main" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "e" },
        ],
      },
    ],
  },
  {
    id: "gitflow",
    name: "Git Flow",
    tagline: "Separate branches for building and releasing.",
    bestFor: "Mobile apps, desktop software, scheduled version releases",
    branchLifespan: "Weeks — features integrate on develop, releases are batched",
    result: "More structure, more branches. Worth it when releases are scheduled, not continuous.",
    steps: [
      {
        action: "Two long-lived branches",
        detail: "main = production. develop = where features combine before a release.",
        nodes: [
          { id: "m1", label: "M1", x: 80, y: 150, branch: "main" },
          { id: "d1", label: "D1", x: 180, y: 90, branch: "develop" },
          { id: "d2", label: "D2", x: 280, y: 90, branch: "develop" },
        ],
        edges: [
          { from: "m1", to: "d1", style: "dashed" },
          { from: "d1", to: "d2" },
        ],
      },
      {
        command: "git checkout -b feature/payments develop",
        action: "Feature branches off develop",
        detail: "Never branch features from main. develop is the integration line.",
        nodes: [
          { id: "m1", label: "M1", x: 80, y: 150, branch: "main" },
          { id: "d1", label: "D1", x: 180, y: 90, branch: "develop" },
          { id: "d2", label: "D2", x: 280, y: 90, branch: "develop" },
          { id: "f1", label: "F1", x: 280, y: 40, branch: "feature" },
        ],
        edges: [
          { from: "m1", to: "d1", style: "dashed" },
          { from: "d1", to: "d2" },
          { from: "d2", to: "f1", style: "dashed" },
        ],
      },
      {
        command: "git checkout develop && git merge feature/payments",
        action: "Merge feature into develop",
        detail: "Finished features merge back to develop — not main.",
        nodes: [
          { id: "m1", label: "M1", x: 80, y: 150, branch: "main" },
          { id: "d1", label: "D1", x: 180, y: 90, branch: "develop" },
          { id: "d2", label: "D2", x: 280, y: 90, branch: "develop" },
          { id: "f1", label: "F1", x: 280, y: 40, branch: "feature" },
          { id: "d3", label: "D3", x: 380, y: 90, branch: "develop" },
        ],
        edges: [
          { from: "m1", to: "d1", style: "dashed" },
          { from: "d1", to: "d2" },
          { from: "d2", to: "f1", style: "dashed" },
          { from: "d2", to: "d3" },
          { from: "f1", to: "d3", style: "merge" },
        ],
      },
      {
        command: "git checkout -b release/2.0 develop",
        action: "Cut a release branch",
        detail: "When develop is ready, branch release/2.0 for final QA and bug fixes only.",
        nodes: [
          { id: "m1", label: "M1", x: 60, y: 150, branch: "main" },
          { id: "d3", label: "D3", x: 200, y: 90, branch: "develop" },
          { id: "r1", label: "R1", x: 320, y: 50, branch: "release" },
        ],
        edges: [
          { from: "d3", to: "r1", style: "dashed" },
        ],
      },
      {
        command: "git checkout main && git merge release/2.0",
        action: "Ship to production",
        detail: "Merge release branch to main (tag v2.0), then merge back to develop too.",
        nodes: [
          { id: "m1", label: "M1", x: 60, y: 150, branch: "main" },
          { id: "r1", label: "R1", x: 200, y: 50, branch: "release" },
          { id: "m2", label: "M2", x: 320, y: 150, branch: "main" },
          { id: "d4", label: "D4", x: 320, y: 90, branch: "develop" },
        ],
        edges: [
          { from: "r1", to: "m2", style: "merge" },
          { from: "r1", to: "d4", style: "merge" },
        ],
      },
      {
        command: "git checkout -b hotfix/crash main",
        action: "Hotfix from main",
        detail: "Production bug? Branch hotfix from main, fix, merge to both main and develop.",
        nodes: [
          { id: "m2", label: "M2", x: 120, y: 150, branch: "main" },
          { id: "h1", label: "H1", x: 240, y: 100, branch: "hotfix" },
          { id: "m3", label: "M3", x: 360, y: 150, branch: "main" },
        ],
        edges: [
          { from: "m2", to: "h1", style: "dashed" },
          { from: "h1", to: "m3", style: "merge" },
        ],
      },
    ],
  },
  {
    id: "trunk",
    name: "Trunk-Based",
    tagline: "Everyone commits to main. Branches live hours.",
    bestFor: "Large teams with strong CI/CD and feature flags",
    branchLifespan: "Hours — tiny branches or direct commits to main",
    result: "Fastest integration. Requires great tests, feature flags, and team discipline.",
    steps: [
      {
        action: "main is the trunk",
        detail: "All developers integrate into main multiple times per day.",
        nodes: [
          { id: "a", label: "A", x: 80, y: 120, branch: "main" },
          { id: "b", label: "B", x: 180, y: 120, branch: "main" },
          { id: "c", label: "C", x: 280, y: 120, branch: "main" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "c" },
        ],
      },
      {
        command: "git checkout -b fix/typo",
        action: "Short-lived branches",
        detail: "Even trunk teams use branches — but they merge within hours, not weeks.",
        nodes: [
          { id: "a", label: "A", x: 80, y: 120, branch: "main" },
          { id: "b", label: "B", x: 180, y: 120, branch: "main" },
          { id: "f1", label: "F", x: 240, y: 70, branch: "feature" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "f1", style: "dashed" },
        ],
      },
      {
        command: "git merge fix/typo && git push",
        action: "Merge back quickly",
        detail: "CI runs on every push. Broken main is fixed within minutes, not days.",
        nodes: [
          { id: "a", label: "A", x: 80, y: 120, branch: "main" },
          { id: "b", label: "B", x: 180, y: 120, branch: "main" },
          { id: "d", label: "D", x: 280, y: 120, branch: "main" },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "b", to: "d" },
        ],
      },
      {
        action: "Feature flags hide incomplete work",
        detail: "Big features ship to main behind a flag. Code is integrated early; users see it when ready.",
        command: "if (featureFlags.newCheckout) { ... }",
        nodes: [
          { id: "b", label: "B", x: 120, y: 120, branch: "main" },
          { id: "d", label: "D", x: 220, y: 120, branch: "main" },
          { id: "e", label: "E", x: 320, y: 120, branch: "main" },
        ],
        edges: [
          { from: "b", to: "d" },
          { from: "d", to: "e" },
        ],
      },
      {
        action: "PR reviews still happen",
        detail: "Even with trunk-based flow, changes go through quick PR review + automated tests before merge.",
        command: "git push && open PR → CI green → merge",
        nodes: [
          { id: "d", label: "D", x: 180, y: 120, branch: "main" },
          { id: "e", label: "E", x: 300, y: 120, branch: "main" },
        ],
        edges: [{ from: "d", to: "e" }],
      },
    ],
  },
];

function BranchGraph({ step }: { step: StrategyStep }) {
  const nodeMap = Object.fromEntries(step.nodes.map((n) => [n.id, n]));
  const branchLabels = [...new Set(step.nodes.map((n) => n.branch))];

  return (
    <svg viewBox="0 0 440 200" className="mx-auto w-full max-w-xl" aria-hidden>
      {branchLabels.map((branch, i) => (
        <text
          key={branch}
          x={8}
          y={55 + i * 55}
          fill={BRANCH_COLORS[branch]}
          fontSize="9"
          fontFamily="monospace"
          opacity={0.7}>
          {branch}
        </text>
      ))}
      {step.edges.map((edge) => {
        const from = nodeMap[edge.from];
        const to = nodeMap[edge.to];
        if (!from || !to) return null;
        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={edge.style === "merge" ? "#f59e0b" : "var(--muted)"}
            strokeWidth={edge.style === "merge" ? 2 : 1.5}
            strokeDasharray={edge.style === "dashed" ? "6 4" : undefined}
            opacity={0.55}
          />
        );
      })}
      {step.nodes.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r={15}
            fill={BRANCH_COLORS[node.branch]}
            fillOpacity={0.2}
            stroke={BRANCH_COLORS[node.branch]}
            strokeWidth={2}
          />
          <text
            x={node.x}
            y={node.y + 4}
            textAnchor="middle"
            fill={BRANCH_COLORS[node.branch]}
            fontSize="10"
            fontWeight="600"
            fontFamily="monospace">
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function GitBranchingStrategies() {
  const [strategyId, setStrategyId] = useState("github");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const strategy = STRATEGIES.find((s) => s.id === strategyId) ?? STRATEGIES[0];
  const step = strategy.steps[stepIndex];
  const isLast = stepIndex >= strategy.steps.length - 1;

  const selectStrategy = (id: string) => {
    setStrategyId(id);
    setStepIndex(0);
    setPlaying(false);
  };

  const goTo = useCallback(
    (i: number) => setStepIndex(Math.max(0, Math.min(i, strategy.steps.length - 1))),
    [strategy.steps.length]
  );

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [strategyId]);

  useEffect(() => {
    if (!playing || isLast) {
      if (isLast) setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), 1800);
    return () => clearTimeout(t);
  }, [playing, stepIndex, isLast]);

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-5 py-4 sm:px-6">
        <h3 className="font-display text-lg text-[var(--fg)]">
          Branching Strategies — Step Through Each Flow
        </h3>
        <p className="mt-1 text-sm text-[var(--fg-2)]">
          Pick a strategy, then play through how work moves from branch to production.
        </p>
      </div>

      {/* Strategy picker */}
      <div className="grid gap-2 border-b border-[var(--line)] p-4 sm:grid-cols-3 sm:p-6">
        {STRATEGIES.map((s) => (
          <button
            key={s.id}
            onClick={() => selectStrategy(s.id)}
            className={[
              "rounded-lg border p-4 text-left transition-all",
              strategyId === s.id
                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--line)] bg-[var(--bg)] hover:border-[var(--accent)]/40",
            ].join(" ")}>
            <p className="font-semibold text-[var(--fg)]">{s.name}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{s.tagline}</p>
          </button>
        ))}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 border-b border-[var(--line)] px-5 py-3 sm:px-6">
        <span className="font-mono-xs text-[var(--muted)]">
          Best for: <span className="text-[var(--fg-2)]">{strategy.bestFor}</span>
        </span>
        <span className="font-mono-xs text-[var(--muted)]">
          Branch lifespan: <span className="text-[var(--fg-2)]">{strategy.branchLifespan}</span>
        </span>
      </div>

      <div className="px-4 py-6 sm:px-6">
        <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
          <BranchGraph step={step} />
        </div>

        <div className="mt-4 rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip chip-accent font-mono-xs">
              Step {stepIndex + 1}/{strategy.steps.length}
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
              {strategy.result}
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
