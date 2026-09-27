"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "pattern", label: "Pattern", emphasis: true },
  { id: "shape", label: "Shape", mono: true },
  { id: "when", label: "When to use" },
];

const ROWS = [
  {
    id: "traverse",
    cells: {
      pattern: "Graph BFS",
      shape: "queue + visited",
      when: "Level by level from a start node",
    },
    highlight: true,
  },
  {
    id: "shortest",
    cells: {
      pattern: "Unweighted shortest path",
      shape: "dist / parent map",
      when: "Fewest edges — stop when the target is first reached",
    },
  },
  {
    id: "grid",
    cells: {
      pattern: "Grid BFS",
      shape: "4-direction neighbors",
      when: "Matrices, walls, rotting, flood fill",
    },
  },
  {
    id: "multi",
    cells: {
      pattern: "Multi-source BFS",
      shape: "seed queue with every source",
      when: "Distance to nearest 0, simultaneous rot",
    },
  },
];

export default function GraphBfsPatternOverview() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
