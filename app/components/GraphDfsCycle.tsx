"use client";

import { useState } from "react";

const NODES = [
  { id: "order", label: "Order", x: 180, y: 48 },
  { id: "reserve", label: "Reserve", x: 48, y: 200 },
  { id: "pack", label: "Pack", x: 312, y: 200 },
];

const EDGES: [string, string][] = [
  ["order", "reserve"],
  ["reserve", "pack"],
  ["pack", "order"],
];

const FRAMES = [
  {
    label: "Start",
    headline: "Walk the steps for order-8841",
    body: "Nothing is on the stack yet. Order is the first step.",
    active: "order",
    onPath: [] as string[],
    cycle: false,
  },
  {
    label: "Order",
    headline: "Enter Order",
    body: "Order is on the path. Next step is Reserve.",
    active: "order",
    onPath: ["order"],
    cycle: false,
  },
  {
    label: "Reserve",
    headline: "Enter Reserve",
    body: "Still one chain. Reserve points at Pack.",
    active: "reserve",
    onPath: ["order", "reserve"],
    cycle: false,
  },
  {
    label: "Pack",
    headline: "Enter Pack",
    body: "Pack’s next step is Order. Order is already on this path.",
    active: "pack",
    onPath: ["order", "reserve", "pack"],
    cycle: false,
  },
  {
    label: "Cycle",
    headline: "The same order is in the chain",
    body: "That back edge is the cycle. This order can never finish. Depth-first search finds it because the node is still on the stack.",
    active: "order",
    onPath: ["order", "reserve", "pack"],
    cycle: true,
  },
];

export default function GraphDfsCycle() {
  const [step, setStep] = useState(0);
  const frame = FRAMES[step];
  const onPath = new Set(frame.onPath);

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Follow one order</p>
        <p className="font-mono-xs text-[var(--accent)]">
          {step + 1} / {FRAMES.length}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-b border-[var(--line)] px-3 py-5 sm:px-5 lg:border-b-0 lg:border-r">
          <svg viewBox="0 0 400 280" className="mx-auto h-auto w-full max-w-md" role="img" aria-label="Order cycle">
            {EDGES.map(([a, b]) => {
              const na = NODES.find((n) => n.id === a)!;
              const nb = NODES.find((n) => n.id === b)!;
              const hot =
                frame.cycle &&
                ((a === "pack" && b === "order") ||
                  (onPath.has(a) && onPath.has(b) && a !== "pack"));
              const cycleEdge = frame.cycle && a === "pack" && b === "order";
              return (
                <line
                  key={`${a}-${b}`}
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  stroke={cycleEdge || hot ? "var(--accent)" : "var(--line-strong)"}
                  strokeWidth={cycleEdge ? 3 : 1.5}
                />
              );
            })}
            {NODES.map((n) => {
              const here = frame.active === n.id;
              const path = onPath.has(n.id);
              return (
                <g key={n.id}>
                  <rect
                    x={n.x - 52}
                    y={n.y - 18}
                    width={104}
                    height={36}
                    rx={8}
                    fill={here || (frame.cycle && path) ? "var(--accent-soft)" : "var(--bg)"}
                    stroke={here || path ? "var(--accent)" : "var(--line-strong)"}
                    strokeWidth={here ? 2 : 1.25}
                  />
                  <text
                    x={n.x}
                    y={n.y + 5}
                    textAnchor="middle"
                    fill={here || path ? "var(--accent)" : "var(--fg)"}
                    style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}>
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="flex flex-col px-4 py-5 sm:px-6">
          <p className="font-mono-xs text-[var(--accent)]">{frame.label}</p>
          <h4 className="mt-2 font-display text-xl text-[var(--fg)]">{frame.headline}</h4>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg-2)]">{frame.body}</p>
          <div className="mt-auto flex gap-2 pt-6">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-md border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)] disabled:opacity-30">
              ← Prev
            </button>
            <button
              type="button"
              disabled={step === FRAMES.length - 1}
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 rounded-md border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-2 text-sm font-medium text-[var(--accent)] disabled:opacity-30">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
