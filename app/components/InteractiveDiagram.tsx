"use client";

import { useState } from "react";

interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  connections?: string[];
}

interface InteractiveDiagramProps {
  nodes: DiagramNode[];
  title?: string;
}

export default function InteractiveDiagram({
  nodes,
  title,
}: InteractiveDiagramProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const getNodeColor = (nodeId: string) => {
    if (selectedNode === nodeId) {
      return "from-blue-500 to-cyan-500";
    }
    return "from-blue-400 to-cyan-400";
  };

  return (
    <div className="ocean-card my-8 rounded-xl p-6 shadow-lg">
      {title && (
        <h3 className="mb-6 text-xl font-bold text-blue-900 dark:text-blue-100">
          {title}
        </h3>
      )}
      <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
        <svg
          className="h-full w-full"
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid meet">
          {/* Draw connections */}
          {nodes.map((node) =>
            node.connections?.map((connectionId) => {
              const targetNode = nodes.find((n) => n.id === connectionId);
              if (!targetNode) return null;

              return (
                <line
                  key={`${node.id}-${connectionId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={
                    selectedNode === node.id || selectedNode === connectionId
                      ? "#3b82f6"
                      : "#60a5fa"
                  }
                  strokeWidth={2}
                  opacity={0.4}
                  className="transition-all duration-300"
                />
              );
            })
          )}

          {/* Draw nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={selectedNode === node.id ? 25 : 20}
                fill={`url(#gradient-${node.id})`}
                className="cursor-pointer transition-all duration-300 hover:scale-110"
                onClick={() =>
                  setSelectedNode(selectedNode === node.id ? null : node.id)
                }
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                className="pointer-events-none text-xs font-semibold fill-white"
                style={{ userSelect: "none" }}>
                {node.label}
              </text>
              <defs>
                <linearGradient
                  id={`gradient-${node.id}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%">
                  <stop
                    offset="0%"
                    stopColor={selectedNode === node.id ? "#3b82f6" : "#60a5fa"}
                  />
                  <stop
                    offset="100%"
                    stopColor={selectedNode === node.id ? "#06b6d4" : "#22d3ee"}
                  />
                </linearGradient>
              </defs>
            </g>
          ))}
        </svg>
      </div>
      {selectedNode && (
        <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Selected:{" "}
            <strong>{nodes.find((n) => n.id === selectedNode)?.label}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
