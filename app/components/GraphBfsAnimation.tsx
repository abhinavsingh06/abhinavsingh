"use client";

import { useMemo, useState } from "react";

type Preset = "services" | "grid";

interface NodePos {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface Frame {
  queue: string[];
  visited: string[];
  current: string | null;
  justEnqueued: string[];
  dist: Record<string, number>;
  parent: Record<string, string | null>;
  note: string;
}

const SERVICE_NODES: NodePos[] = [
  { id: "order", label: "Order", x: 100, y: 160 },
  { id: "inventory", label: "Inventory", x: 310, y: 72 },
  { id: "notify", label: "Notify", x: 310, y: 248 },
  { id: "packing", label: "Packing", x: 530, y: 72 },
  { id: "shipping", label: "Shipping", x: 530, y: 248 },
];

const SERVICE_EDGES: [string, string][] = [
  ["order", "inventory"],
  ["order", "notify"],
  ["inventory", "packing"],
  ["packing", "shipping"],
  ["notify", "shipping"],
];

const SERVICE_ADJ: Record<string, string[]> = {
  order: ["inventory", "notify"],
  inventory: ["order", "packing"],
  notify: ["order", "shipping"],
  packing: ["inventory", "shipping"],
  shipping: ["notify", "packing"],
};

function buildBfs(
  start: string,
  adj: Record<string, string[]>,
  goal?: string
): Frame[] {
  const frames: Frame[] = [];
  const visited = new Set<string>([start]);
  const queue = [start];
  const dist: Record<string, number> = { [start]: 0 };
  const parent: Record<string, string | null> = { [start]: null };

  frames.push({
    queue: [...queue],
    visited: [...visited],
    current: null,
    justEnqueued: [start],
    dist: { ...dist },
    parent: { ...parent },
    note: `Seed the queue with ${start}. Distance 0. Mark it visited before neighbors can enqueue it again.`,
  });

  while (queue.length) {
    const current = queue.shift()!;
    const fresh: string[] = [];
    for (const next of adj[current] ?? []) {
      if (visited.has(next)) continue;
      visited.add(next);
      queue.push(next);
      dist[next] = dist[current] + 1;
      parent[next] = current;
      fresh.push(next);
    }
    const hit = goal && fresh.includes(goal);
    frames.push({
      queue: [...queue],
      visited: [...visited],
      current,
      justEnqueued: fresh,
      dist: { ...dist },
      parent: { ...parent },
      note: hit
        ? `Dequeued ${current}. First time ${goal} is reached — distance ${dist[goal!]}. Stop if you only need the shortest hop count.`
        : fresh.length
          ? `Dequeued ${current}. Enqueued ${fresh.join(", ")} (new). Already-visited neighbors stay out.`
          : `Dequeued ${current}. No new neighbors — every edge leads somewhere already seen.`,
    });
    if (hit) break;
  }

  return frames;
}

function pathTo(parent: Record<string, string | null>, goal: string): string[] {
  const path: string[] = [];
  let cur: string | null = goal;
  const guard = new Set<string>();
  while (cur && !guard.has(cur)) {
    guard.add(cur);
    path.push(cur);
    cur = parent[cur] ?? null;
  }
  return path.reverse();
}

const GRID = [
  ["S", ".", "."],
  [".", "#", "."],
  [".", ".", "T"],
];

const GRID_ADJ = (() => {
  const adj: Record<string, string[]> = {};
  const rows = GRID.length;
  const cols = GRID[0].length;
  const key = (r: number, c: number) => `${r},${c}`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (GRID[r][c] === "#") continue;
      const id = key(r, c);
      adj[id] = [];
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ] as const) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (GRID[nr][nc] === "#") continue;
        adj[id].push(key(nr, nc));
      }
    }
  }
  return adj;
})();

export default function GraphBfsAnimation({
  preset = "services",
}: {
  preset?: string;
}) {
  const mode: Preset = preset === "grid" ? "grid" : "services";
  const frames = useMemo(
    () =>
      mode === "grid"
        ? buildBfs("0,0", GRID_ADJ, "2,2")
        : buildBfs("order", SERVICE_ADJ, "shipping"),
    [mode]
  );
  const [step, setStep] = useState(0);
  const frame = frames[Math.min(step, frames.length - 1)];
  const goal = mode === "grid" ? "2,2" : "shipping";
  const path =
    frame.parent[goal] !== undefined || goal in frame.parent
      ? pathTo(frame.parent, goal)
      : [];
  const showPath = goal in frame.dist && (frame.justEnqueued.includes(goal) || step === frames.length - 1);

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3 sm:px-6">
        <p className="text-sm text-[var(--muted)]">
          {mode === "grid" ? "Grid BFS — around a wall" : "BFS — shortest hops"}
        </p>
        <p className="font-mono-xs text-[var(--accent)]">
          {step + 1} / {frames.length}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="border-b border-[var(--line)] px-3 py-5 sm:px-5 lg:border-b-0 lg:border-r">
          {mode === "services" ? (
            <ServiceGraph frame={frame} showPath={showPath} path={path} />
          ) : (
            <GridGraph frame={frame} showPath={showPath} path={path} />
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip label="Queue" value={frame.queue.length ? frame.queue.map(pretty).join("  →  ") : "empty"} />
          </div>
        </div>

        <div className="flex flex-col px-4 py-5 sm:px-6">
          <p className="font-mono-xs text-[var(--accent)]">
            {frame.current ? `Dequeue ${pretty(frame.current)}` : "Start"}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg-2)]">
            {frame.note}
          </p>
          {showPath && path.length > 1 ? (
            <p className="mt-3 text-sm text-[var(--fg)]">
              Shortest path:{" "}
              <span className="font-mono-xs text-[var(--accent)]">
                {path.map(pretty).join(" → ")}
              </span>
              <span className="text-[var(--muted)]">
                {" "}
                · {path.length - 1} hop{path.length - 1 === 1 ? "" : "s"}
              </span>
            </p>
          ) : null}
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
              disabled={step >= frames.length - 1}
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

function pretty(id: string): string {
  if (id.includes(",")) return `(${id})`;
  return id[0].toUpperCase() + id.slice(1);
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-2">
      <p className="font-mono-xs text-[var(--muted)]">{label}</p>
      <p className="mt-1 break-words font-mono-xs text-[var(--fg)]">{value}</p>
    </div>
  );
}

function ServiceGraph({
  frame,
  showPath,
  path,
}: {
  frame: Frame;
  showPath: boolean;
  path: string[];
}) {
  const onPath = new Set(showPath ? path : []);
  return (
    <svg viewBox="0 0 660 330" className="mx-auto h-auto w-full" role="img" aria-label="Service graph BFS">
      {SERVICE_EDGES.map(([a, b]) => {
        const na = SERVICE_NODES.find((n) => n.id === a)!;
        const nb = SERVICE_NODES.find((n) => n.id === b)!;
        const hot =
          onPath.has(a) &&
          onPath.has(b) &&
          Math.abs(path.indexOf(a) - path.indexOf(b)) === 1;
        return (
          <line
            key={`${a}-${b}`}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke={hot ? "var(--accent)" : "var(--line-strong)"}
            strokeWidth={hot ? 3 : 1.5}
          />
        );
      })}
      {SERVICE_NODES.map((n) => {
        const visited = frame.visited.includes(n.id);
        const current = frame.current === n.id;
        const queued = frame.queue.includes(n.id);
        const fresh = frame.justEnqueued.includes(n.id);
        const stroke = current || fresh ? "var(--accent)" : visited ? "var(--fg-2)" : "var(--line-strong)";
        return (
          <g key={n.id}>
            <rect
              x={n.x - 58}
              y={n.y - 18}
              width={116}
              height={36}
              rx={8}
              fill={current || fresh ? "var(--accent-soft)" : "var(--bg)"}
              stroke={stroke}
              strokeWidth={current ? 2 : 1.25}
            />
            <text
              x={n.x}
              y={n.y + 5}
              textAnchor="middle"
              fill={current || fresh ? "var(--accent)" : "var(--fg)"}
              style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}>
              {n.label}
            </text>
            {frame.dist[n.id] !== undefined ? (
              <text
                x={n.x}
                y={n.y - 26}
                textAnchor="middle"
                fill="var(--muted)"
                style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
                d={frame.dist[n.id]}
              </text>
            ) : null}
            {queued && !current ? (
              <text
                x={n.x}
                y={n.y + 34}
                textAnchor="middle"
                fill="var(--muted)"
                style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>
                in queue
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function GridGraph({
  frame,
  showPath,
  path,
}: {
  frame: Frame;
  showPath: boolean;
  path: string[];
}) {
  const onPath = new Set(showPath ? path : []);
  return (
    <div className="mx-auto grid max-w-xs grid-cols-3 gap-2">
      {GRID.flatMap((row, r) =>
        row.map((cell, c) => {
          const id = `${r},${c}`;
          const wall = cell === "#";
          const current = frame.current === id;
          const fresh = frame.justEnqueued.includes(id);
          const visited = frame.visited.includes(id);
          const pathCell = onPath.has(id);
          return (
            <div
              key={id}
              className={[
                "flex aspect-square flex-col items-center justify-center rounded-lg border font-mono-xs",
                wall
                  ? "border-[var(--line)] bg-[var(--bg)] text-[var(--muted-2)]"
                  : current || fresh || pathCell
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : visited
                      ? "border-[var(--line-strong)] text-[var(--fg)]"
                      : "border-[var(--line)] text-[var(--muted)]",
              ].join(" ")}>
              <span>{wall ? "wall" : cell === "S" ? "start" : cell === "T" ? "target" : "open"}</span>
              {!wall && frame.dist[id] !== undefined ? (
                <span className="mt-1 text-[var(--muted)]">d={frame.dist[id]}</span>
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
}
