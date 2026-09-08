"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface TreeNodeLayout {
  id: string;
  val: number | string;
  x: number;
  y: number;
  left?: string;
  right?: string;
}

interface TreeStep {
  active: string[];
  dim?: string[];
  path?: string[];
  action: string;
  detail?: string;
  note?: string;
  visitOrder?: string[];
}

interface Preset {
  title: string;
  subtitle: string;
  nodes: TreeNodeLayout[];
  steps: TreeStep[];
  result: string;
}

const VB_W = 400;
const VB_H = 280;
const NODE_R = 18;

/** Shared BST — generous spacing so nodes never collide */
const BST_NODES: TreeNodeLayout[] = [
  { id: "8", val: 8, x: 200, y: 36, left: "3", right: "10" },
  { id: "3", val: 3, x: 110, y: 100, left: "1", right: "6" },
  { id: "10", val: 10, x: 290, y: 100, right: "14" },
  { id: "1", val: 1, x: 50, y: 164 },
  { id: "6", val: 6, x: 150, y: 164, left: "4", right: "7" },
  { id: "14", val: 14, x: 340, y: 164, left: "13" },
  { id: "4", val: 4, x: 110, y: 236 },
  { id: "7", val: 7, x: 190, y: 236 },
  { id: "13", val: 13, x: 300, y: 236 },
];

const SMALL_NODES: TreeNodeLayout[] = [
  { id: "5", val: 5, x: 200, y: 40, left: "3", right: "8" },
  { id: "3", val: 3, x: 110, y: 120, left: "1", right: "4" },
  { id: "8", val: 8, x: 290, y: 120, right: "9" },
  { id: "1", val: 1, x: 60, y: 210 },
  { id: "4", val: 4, x: 150, y: 210 },
  { id: "9", val: 9, x: 340, y: 210 },
];

const INVALID_BST_NODES: TreeNodeLayout[] = [
  { id: "5", val: 5, x: 200, y: 48, left: "1", right: "7" },
  { id: "1", val: 1, x: 120, y: 130, right: "6" },
  { id: "7", val: 7, x: 280, y: 130 },
  { id: "6", val: 6, x: 170, y: 220 },
];

function edgeCoords(
  from: TreeNodeLayout,
  to: TreeNodeLayout,
  radius: number
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: from.x + ux * radius,
    y1: from.y + uy * radius,
    x2: to.x - ux * radius,
    y2: to.y - uy * radius,
  };
}

const PRESETS: Record<string, Preset> = {
  "bst-search": {
    title: "BST Search",
    subtitle: "Search for 6 — compare and discard half the tree",
    nodes: BST_NODES,
    steps: [
      {
        active: ["8"],
        action: "Start at root 8",
        detail: "6 < 8 → go left",
        note: "target = 6",
      },
      {
        active: ["3"],
        path: ["8"],
        action: "At 3",
        detail: "6 > 3 → go right",
      },
      {
        active: ["6"],
        path: ["8", "3"],
        action: "At 6 — match",
        detail: "Found in O(h) comparisons",
      },
    ],
    result: "Return node 6 — each step halves the search space when balanced",
  },
  "bst-insert": {
    title: "BST Insert",
    subtitle: "Insert 5 — walk until a null child, then attach",
    nodes: BST_NODES,
    steps: [
      {
        active: ["8"],
        action: "Start at 8",
        detail: "5 < 8 → left",
        note: "insert 5",
      },
      {
        active: ["3"],
        path: ["8"],
        action: "At 3",
        detail: "5 > 3 → right",
      },
      {
        active: ["6"],
        path: ["8", "3"],
        action: "At 6",
        detail: "5 < 6 → left",
      },
      {
        active: ["4"],
        path: ["8", "3", "6"],
        action: "At 4",
        detail: "5 > 4 and right is null → attach 5 as right child of 4",
      },
    ],
    result: "Insert walks like search, then links one new edge — O(h)",
  },
  inorder: {
    title: "Inorder Traversal",
    subtitle: "Left → node → right — on a BST this visits values sorted",
    nodes: BST_NODES,
    steps: [
      {
        active: ["1"],
        visitOrder: ["1"],
        action: "Visit 1",
        detail: "Leftmost leaf first",
        note: "left → node → right",
      },
      {
        active: ["3"],
        visitOrder: ["1", "3"],
        path: ["1"],
        action: "Visit 3",
        detail: "After finishing left subtree of 3",
      },
      {
        active: ["4"],
        visitOrder: ["1", "3", "4"],
        path: ["1", "3"],
        action: "Visit 4",
        detail: "Left of 6",
      },
      {
        active: ["6"],
        visitOrder: ["1", "3", "4", "6"],
        path: ["1", "3", "4"],
        action: "Visit 6",
      },
      {
        active: ["7"],
        visitOrder: ["1", "3", "4", "6", "7"],
        path: ["1", "3", "4", "6"],
        action: "Visit 7",
      },
      {
        active: ["8"],
        visitOrder: ["1", "3", "4", "6", "7", "8"],
        path: ["1", "3", "4", "6", "7"],
        action: "Visit 8 (root)",
        detail: "Then the right subtree",
      },
      {
        active: ["10"],
        visitOrder: ["1", "3", "4", "6", "7", "8", "10"],
        path: ["1", "3", "4", "6", "7", "8"],
        action: "Visit 10",
      },
      {
        active: ["13"],
        visitOrder: ["1", "3", "4", "6", "7", "8", "10", "13"],
        path: ["1", "3", "4", "6", "7", "8", "10"],
        action: "Visit 13",
      },
      {
        active: ["14"],
        visitOrder: ["1", "3", "4", "6", "7", "8", "10", "13", "14"],
        path: ["1", "3", "4", "6", "7", "8", "10", "13"],
        action: "Visit 14",
        detail: "Full inorder: 1, 3, 4, 6, 7, 8, 10, 13, 14",
      },
    ],
    result:
      "BST inorder = sorted order — validate BST by checking increasing sequence",
  },
  "max-depth": {
    title: "Maximum Depth",
    subtitle: "depth(node) = 1 + max(depth(left), depth(right))",
    nodes: SMALL_NODES,
    steps: [
      {
        active: ["1"],
        action: "Leaf 1 → depth 1",
        detail: "Base case: null child contributes 0",
      },
      {
        active: ["4"],
        path: ["1"],
        action: "Leaf 4 → depth 1",
      },
      {
        active: ["3"],
        path: ["1", "4"],
        action: "Node 3 → 1 + max(1, 1) = 2",
        detail: "Return height of this subtree to parent",
      },
      {
        active: ["9"],
        path: ["1", "4", "3"],
        action: "Leaf 9 → depth 1",
      },
      {
        active: ["8"],
        path: ["1", "4", "3", "9"],
        action: "Node 8 → 1 + max(0, 1) = 2",
      },
      {
        active: ["5"],
        path: ["1", "4", "3", "9", "8"],
        action: "Root 5 → 1 + max(2, 2) = 3",
        detail: "Maximum depth of the tree is 3",
      },
    ],
    result: "O(n) visits — each node once; stack space O(h)",
  },
  "validate-bst": {
    title: "Validate BST",
    subtitle: "Each node must stay inside (lo, hi) bounds from ancestors",
    nodes: INVALID_BST_NODES,
    steps: [
      {
        active: ["5"],
        action: "Root 5 — bounds (−∞, +∞)",
        detail: "Left subtree must be < 5; right must be > 5",
        note: "validate",
      },
      {
        active: ["1"],
        path: ["5"],
        action: "Node 1 — bounds (−∞, 5)",
        detail: "1 < 5 ✓ — its right child must be in (1, 5)",
      },
      {
        active: ["6"],
        path: ["5", "1"],
        dim: ["7"],
        action: "Node 6 — claimed bounds (1, 5)",
        detail: "6 is not < 5 → invalid. Common bug: only compare with parent",
      },
    ],
    result: "Pass (lo, hi) down — parent-only checks miss this case",
  },
  "level-order": {
    title: "Level-Order BFS",
    subtitle: "Queue processes one level at a time",
    nodes: SMALL_NODES,
    steps: [
      {
        active: ["5"],
        visitOrder: ["5"],
        action: "Level 0: dequeue 5",
        detail: "Enqueue children 3, 8",
        note: "queue",
      },
      {
        active: ["3", "8"],
        visitOrder: ["5", "3", "8"],
        path: ["5"],
        action: "Level 1: 3, then 8",
        detail: "Enqueue 1, 4 from 3; enqueue 9 from 8",
      },
      {
        active: ["1", "4", "9"],
        visitOrder: ["5", "3", "8", "1", "4", "9"],
        path: ["5", "3", "8"],
        action: "Level 2: 1, 4, 9",
        detail: "No more children — done",
      },
    ],
    result: "[[5], [3, 8], [1, 4, 9]] — O(n) time, O(w) queue space",
  },
};

interface BinaryTreeAnimationProps {
  preset: string;
}

export default function BinaryTreeAnimation({
  preset,
}: BinaryTreeAnimationProps) {
  const config = PRESETS[preset] ?? PRESETS["bst-search"];
  const { title, subtitle, nodes, steps, result } = config;

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const step = steps[stepIndex];
  const isLast = stepIndex >= steps.length - 1;

  const nodeMap = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])),
    [nodes]
  );

  const edges = useMemo(
    () =>
      nodes.flatMap((n) => {
        const list: { from: TreeNodeLayout; to: TreeNodeLayout }[] = [];
        if (n.left && nodeMap[n.left])
          list.push({ from: n, to: nodeMap[n.left] });
        if (n.right && nodeMap[n.right])
          list.push({ from: n, to: nodeMap[n.right] });
        return list;
      }),
    [nodes, nodeMap]
  );

  const goTo = useCallback(
    (index: number) => {
      setStepIndex(Math.max(0, Math.min(index, steps.length - 1)));
    },
    [steps.length]
  );

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [preset]);

  useEffect(() => {
    if (!playing) return;
    if (isLast) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStepIndex((i) => i + 1), 1400);
    return () => clearTimeout(timer);
  }, [playing, stepIndex, isLast]);

  const isEdgeOnPath = (fromId: string, toId: string) => {
    const fromHit =
      step.path?.includes(fromId) || step.active.includes(fromId);
    const toHit = step.path?.includes(toId) || step.active.includes(toId);
    return Boolean(fromHit && toHit);
  };

  return (
    <div className="my-6 sm:my-8 rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <h3 className="font-display text-lg text-[var(--fg)] sm:text-xl">
          {title}
        </h3>
        <p className="mt-1 font-mono-xs text-[var(--muted)]">{subtitle}</p>
      </div>

      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-lg">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            width="100%"
            height="auto"
            className="block"
            role="img"
            aria-label={title}>
            {edges.map(({ from, to }) => {
              const onPath = isEdgeOnPath(from.id, to.id);
              const { x1, y1, x2, y2 } = edgeCoords(from, to, NODE_R);
              return (
                <line
                  key={`${from.id}-${to.id}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={onPath ? "var(--accent)" : "var(--line-strong)"}
                  strokeWidth={onPath ? 2.5 : 1.75}
                  strokeLinecap="round"
                />
              );
            })}

            {nodes.map((n) => {
              const isActive = step.active.includes(n.id);
              const onPath = Boolean(step.path?.includes(n.id));
              const visited = Boolean(step.visitOrder?.includes(n.id));
              const dimmed = Boolean(step.dim?.includes(n.id));
              const emphasized = isActive || onPath || visited;

              return (
                <g key={n.id} opacity={dimmed ? 0.35 : 1}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={NODE_R}
                    fill={isActive ? "var(--accent-soft)" : "var(--bg)"}
                    stroke={
                      isActive || emphasized
                        ? "var(--accent)"
                        : "var(--line-strong)"
                    }
                    strokeWidth={isActive ? 3 : 2}
                  />
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dy="0.35em"
                    fill={
                      isActive
                        ? "var(--accent)"
                        : dimmed
                          ? "var(--muted)"
                          : "var(--fg)"
                    }
                    style={{
                      fontSize: 14,
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontWeight: 600,
                      pointerEvents: "none",
                    }}>
                    {String(n.val)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {step.visitOrder && step.visitOrder.length > 0 ? (
          <p className="mx-auto mt-4 max-w-2xl text-center font-mono-xs text-[var(--muted)]">
            Visit order:{" "}
            <span className="text-[var(--accent)]">
              {step.visitOrder.join(" → ")}
            </span>
          </p>
        ) : null}

        <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip chip-accent font-mono-xs">
              Step {stepIndex + 1}/{steps.length}
            </span>
            {step.note ? (
              <span className="font-mono-xs text-[var(--accent)]">
                {step.note}
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm font-semibold text-[var(--fg)]">
            {step.action}
          </p>
          {step.detail ? (
            <p className="mt-1 text-sm text-[var(--fg-2)]">{step.detail}</p>
          ) : null}
          {isLast ? (
            <p className="mt-3 rounded-md bg-[var(--accent-soft)] px-3 py-2 text-sm font-semibold text-[var(--accent)]">
              {result}
            </p>
          ) : null}
        </div>

        <div className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => goTo(0)}
            className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
            ↺ Reset
          </button>
          <button
            type="button"
            onClick={() => goTo(stepIndex - 1)}
            disabled={stepIndex === 0}
            className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30">
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-5 py-2 font-mono-xs font-semibold text-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-[var(--bg)]">
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            type="button"
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
