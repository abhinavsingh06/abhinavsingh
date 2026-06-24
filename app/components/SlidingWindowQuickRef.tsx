"use client";

interface FlowNode {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
  variant?: "start" | "decision" | "answer";
}

interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

const NODES: FlowNode[] = [
  { id: "start", label: "Sliding Window Problem", detail: "Contiguous subarray or substring?", x: 200, y: 30, variant: "start" },
  { id: "fixed", label: "Fixed size k", detail: "Build window[0..k−1], slide right, drop left", x: 50, y: 150, variant: "answer" },
  { id: "shortest", label: "Shortest window", detail: "Expand R → shrink L while VALID → record during shrink", x: 200, y: 150, variant: "answer" },
  { id: "longest", label: "Longest window", detail: "Expand R → shrink L while INVALID → record after shrink", x: 350, y: 150, variant: "answer" },
  { id: "count", label: "Count all valid", detail: "On each valid step: count += right − left + 1", x: 80, y: 270, variant: "answer" },
  { id: "exactly", label: "Exactly K", detail: "atMost(K) − atMost(K − 1)", x: 200, y: 270, variant: "answer" },
  { id: "max", label: "Max / Min in window", detail: "Monotonic deque of indices (decreasing values)", x: 320, y: 270, variant: "answer" },
];

const EDGES: FlowEdge[] = [
  { from: "start", to: "fixed", label: "size k given" },
  { from: "start", to: "shortest", label: "min length" },
  { from: "start", to: "longest", label: "max length" },
  { from: "longest", to: "count", label: "count all" },
  { from: "longest", to: "exactly", label: "exactly K" },
  { from: "fixed", to: "max", label: "max/min metric" },
];

function getNode(id: string) {
  return NODES.find((n) => n.id === id)!;
}

export default function SlidingWindowQuickRef() {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-5 py-4 sm:px-6">
        <h3 className="font-display text-lg text-[var(--fg)]">Pattern Picker</h3>
        <p className="mt-1 font-mono-xs text-[var(--muted)]">
          Follow the path that matches your problem
        </p>
      </div>

      {/* SVG flowchart */}
      <div className="overflow-x-auto px-2 py-6 sm:px-4">
        <svg
          viewBox="0 0 420 340"
          className="mx-auto w-full max-w-xl"
          aria-label="Sliding window pattern decision flowchart">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--accent)" opacity="0.6" />
            </marker>
          </defs>

          {/* Edges */}
          {EDGES.map((edge) => {
            const from = getNode(edge.from);
            const to = getNode(edge.to);
            const midY = (from.y + 60 + to.y) / 2;
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={`M ${from.x} ${from.y + 44} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y - 4}`}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeOpacity="0.35"
                  markerEnd="url(#arrowhead)"
                />
                {edge.label && (
                  <text
                    x={(from.x + to.x) / 2}
                    y={midY - 4}
                    textAnchor="middle"
                    className="fill-[var(--muted)]"
                    fontSize="9"
                    fontFamily="var(--font-geist-mono)">
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map((node) => {
            const isStart = node.variant === "start";
            const w = isStart ? 180 : 130;
            const h = isStart ? 44 : 52;
            const x = node.x - w / 2;
            const y = node.y;

            return (
              <g key={node.id}>
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx="8"
                  fill={isStart ? "var(--accent-soft)" : "var(--bg)"}
                  stroke={isStart ? "var(--accent)" : "var(--line)"}
                  strokeWidth={isStart ? 2 : 1}
                />
                <text
                  x={node.x}
                  y={y + (isStart ? 18 : 16)}
                  textAnchor="middle"
                  fill="var(--fg)"
                  fontSize={isStart ? "11" : "10"}
                  fontWeight="600"
                  fontFamily="var(--font-geist-sans)">
                  {node.label}
                </text>
                {!isStart && (
                  <text
                    x={node.x}
                    y={y + 32}
                    textAnchor="middle"
                    fill="var(--muted)"
                    fontSize="7.5"
                    fontFamily="var(--font-geist-mono)">
                    {node.detail.length > 38
                      ? node.detail.slice(0, 36) + "…"
                      : node.detail}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail cards below */}
      <div className="grid gap-2 border-t border-[var(--line)] p-4 sm:grid-cols-2 sm:p-6">
        {NODES.filter((n) => n.variant === "answer").map((node) => (
          <div
            key={node.id}
            className="rounded-lg border border-[var(--line)] bg-[var(--bg)] px-4 py-3">
            <p className="font-mono-xs font-semibold text-[var(--accent)]">
              {node.label}
            </p>
            <p className="mt-1 text-sm leading-snug text-[var(--fg-2)]">
              {node.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
