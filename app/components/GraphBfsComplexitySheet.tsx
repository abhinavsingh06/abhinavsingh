"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "problem", label: "Problem", emphasis: true },
  { id: "time", label: "Time", mono: true, accent: true },
  { id: "space", label: "Space", mono: true, accent: true },
];

const ROWS = [
  {
    id: "bfs",
    cells: {
      problem: "BFS on a graph",
      time: "O(V + E)",
      space: "O(V)",
    },
    highlight: true,
  },
  {
    id: "grid",
    cells: {
      problem: "BFS on an r × c grid",
      time: "O(r · c)",
      space: "O(r · c)",
    },
  },
  {
    id: "shortest",
    cells: {
      problem: "Shortest path, unweighted",
      time: "O(V + E)",
      space: "O(V)",
    },
  },
  {
    id: "weighted",
    cells: {
      problem: "Shortest path, positive weights",
      time: "Dijkstra — not plain BFS",
      space: "O(V)",
    },
  },
];

export default function GraphBfsComplexitySheet() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
