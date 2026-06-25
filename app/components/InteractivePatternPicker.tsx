"use client";

import { useCallback, useMemo, useState } from "react";

export interface FlowNode {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
  variant?: "start" | "decision" | "answer";
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

interface NodeLayout extends FlowNode {
  w: number;
  h: number;
  labelLines: string[];
}

interface InteractivePatternPickerProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  markerId: string;
  ariaLabel: string;
  getNodeWidth?: (node: FlowNode) => number;
}

function wrapLabel(label: string, maxWidth: number, charWidth: number): string[] {
  const maxChars = Math.max(8, Math.floor(maxWidth / charWidth));
  const words = label.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word.length > maxChars ? word.slice(0, maxChars - 1) + "…" : word;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [label];
}

function layoutNodes(
  nodes: FlowNode[],
  getNodeWidth: (node: FlowNode) => number
): NodeLayout[] {
  return nodes.map((node) => {
    const isStart = node.variant === "start";
    const w = getNodeWidth(node);
    const charWidth = isStart ? 6.2 : 5.8;
    const labelLines = wrapLabel(node.label, w - 16, charWidth);
    const lineHeight = isStart ? 13 : 12;
    const paddingY = isStart ? 14 : 10;
    const h = paddingY * 2 + labelLines.length * lineHeight;
    return { ...node, w, h, labelLines };
  });
}

function computeViewBox(layouts: NodeLayout[], padding = 20): string {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of layouts) {
    minX = Math.min(minX, node.x - node.w / 2);
    maxX = Math.max(maxX, node.x + node.w / 2);
    minY = Math.min(minY, node.y);
    maxY = Math.max(maxY, node.y + node.h);
  }

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  return `${minX - padding} ${minY - padding} ${width} ${height}`;
}

function getPathToNode(
  targetId: string,
  edges: FlowEdge[],
  startId = "start"
): string[] {
  if (targetId === startId) return [startId];

  const parentOf = new Map<string, string>();
  for (const edge of edges) {
    parentOf.set(edge.to, edge.from);
  }

  const path: string[] = [];
  let current: string | undefined = targetId;
  while (current) {
    path.unshift(current);
    current = parentOf.get(current);
  }

  return path[0] === startId ? path : [startId, ...path];
}

function edgeOnPath(edge: FlowEdge, path: string[]): boolean {
  const fromIdx = path.indexOf(edge.from);
  return fromIdx !== -1 && path[fromIdx + 1] === edge.to;
}

export default function InteractivePatternPicker({
  nodes,
  edges,
  markerId,
  ariaLabel,
  getNodeWidth = (node) => (node.variant === "start" ? 200 : 120),
}: InteractivePatternPickerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const layouts = useMemo(
    () => layoutNodes(nodes, getNodeWidth),
    [nodes, getNodeWidth]
  );
  const layoutById = useMemo(
    () => new Map(layouts.map((n) => [n.id, n])),
    [layouts]
  );
  const viewBox = useMemo(() => computeViewBox(layouts), [layouts]);

  const path = useMemo(
    () => (selectedId ? getPathToNode(selectedId, edges) : []),
    [selectedId, edges]
  );
  const pathSet = useMemo(() => new Set(path), [path]);
  const hasSelection = selectedId !== null;

  const getLayout = useCallback(
    (id: string) => layoutById.get(id)!,
    [layoutById]
  );

  const handleNodeClick = (id: string) => {
    if (id === "start") {
      setSelectedId(null);
      return;
    }
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const answerNodes = nodes.filter((n) => n.variant === "answer");

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-5 py-4 sm:px-6">
        <h3 className="font-display text-lg text-[var(--fg)]">Pattern Picker</h3>
        <p className="mt-1 font-mono-xs text-[var(--muted)]">
          Click a node to trace the path — cards below update with your selection
        </p>
      </div>

      <div className="overflow-x-auto px-2 py-6 sm:px-4">
        <svg
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          className="mx-auto w-full min-w-[320px] max-w-3xl"
          aria-label={ariaLabel}>
          <defs>
            <marker
              id={markerId}
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto">
              <polygon
                points="0 0, 8 3, 0 6"
                fill="var(--accent)"
                opacity="0.6"
              />
            </marker>
            <marker
              id={`${markerId}-active`}
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--accent)" />
            </marker>
          </defs>

          {edges.map((edge) => {
            const from = getLayout(edge.from);
            const to = getLayout(edge.to);
            const fromBottom = from.y + from.h;
            const midY = (fromBottom + to.y) / 2;
            const active = hasSelection && edgeOnPath(edge, path);

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={`M ${from.x} ${fromBottom} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={active ? 2.5 : 1.5}
                  strokeOpacity={!hasSelection ? 0.35 : active ? 0.95 : 0.08}
                  markerEnd={
                    active
                      ? `url(#${markerId}-active)`
                      : `url(#${markerId})`
                  }
                  className="transition-all duration-300"
                />
                {edge.label && (
                  <text
                    x={(from.x + to.x) / 2}
                    y={midY - 6}
                    textAnchor="middle"
                    fill={active ? "var(--accent)" : "var(--muted)"}
                    opacity={!hasSelection ? 1 : active ? 1 : 0.25}
                    fontSize="9"
                    fontFamily="var(--font-geist-mono)"
                    className="pointer-events-none transition-all duration-300">
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {layouts.map((node) => {
            const isStart = node.variant === "start";
            const x = node.x - node.w / 2;
            const y = node.y;
            const isSelected = selectedId === node.id;
            const onPath = pathSet.has(node.id);
            const dimmed = hasSelection && !onPath;
            const lineHeight = isStart ? 13 : 12;
            const labelStartY = y + (node.h - node.labelLines.length * lineHeight) / 2 + (isStart ? 10 : 9);

            return (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${node.label}: ${node.detail}`}
                className="cursor-pointer outline-none"
                style={{ opacity: dimmed ? 0.3 : 1 }}
                onClick={() => handleNodeClick(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleNodeClick(node.id);
                  }
                }}>
                <rect
                  x={x}
                  y={y}
                  width={node.w}
                  height={node.h}
                  rx="8"
                  fill={
                    isSelected
                      ? "var(--accent-soft)"
                      : onPath && hasSelection
                        ? "color-mix(in srgb, var(--accent-soft) 60%, var(--bg))"
                        : isStart
                          ? "var(--accent-soft)"
                          : "var(--bg)"
                  }
                  stroke={
                    isSelected || (onPath && hasSelection)
                      ? "var(--accent)"
                      : isStart
                        ? "var(--accent)"
                        : "var(--line)"
                  }
                  strokeWidth={
                    isSelected ? 2.5 : onPath && hasSelection ? 2 : isStart ? 2 : 1
                  }
                  className="transition-all duration-300"
                  style={
                    isSelected
                      ? { filter: "drop-shadow(0 0 8px var(--accent-glow))" }
                      : undefined
                  }
                />
                {node.labelLines.map((line, i) => (
                  <text
                    key={i}
                    x={node.x}
                    y={labelStartY + i * lineHeight}
                    textAnchor="middle"
                    fill={isSelected ? "var(--accent)" : "var(--fg)"}
                    fontSize={isStart ? "11" : "10"}
                    fontWeight="600"
                    fontFamily="var(--font-geist-sans)"
                    className="pointer-events-none transition-colors duration-300">
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>

        {hasSelection && (
          <div className="mt-2 flex justify-center">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="rounded-full border border-[var(--line)] px-3 py-1 font-mono-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
              Clear selection
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-2 border-t border-[var(--line)] p-4 sm:grid-cols-2 sm:p-6">
        {answerNodes.map((node) => {
          const isSelected = selectedId === node.id;
          const onPath = pathSet.has(node.id);
          const dimmed = hasSelection && !onPath;

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => handleNodeClick(node.id)}
              className={`rounded-lg border px-4 py-3 text-left transition-all duration-300 ${
                isSelected
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-[0_0_24px_var(--accent-glow)]"
                  : onPath && hasSelection
                    ? "border-[var(--accent)]/50 bg-[var(--accent-soft)]/40"
                    : "border-[var(--line)] bg-[var(--bg)] hover:border-[var(--accent)]/40"
              }`}
              style={{ opacity: dimmed ? 0.35 : 1 }}>
              <p className="font-mono-xs font-semibold text-[var(--accent)]">
                {node.label}
              </p>
              <p className="mt-1 text-sm leading-snug text-[var(--fg-2)]">
                {node.detail}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
