"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "aspect", label: "", emphasis: true },
  { id: "bfs", label: "BFS" },
  { id: "dfs", label: "DFS" },
];

const ROWS = [
  {
    id: "order",
    cells: {
      aspect: "Visit order",
      bfs: "By distance from the start",
      dfs: "Dive down one branch first",
    },
  },
  {
    id: "structure",
    cells: {
      aspect: "Structure",
      bfs: "Queue",
      dfs: "Stack or recursion",
    },
  },
  {
    id: "shortest",
    cells: {
      aspect: "Unweighted shortest path",
      bfs: "First time you reach the node",
      dfs: "Not guaranteed — may wander",
    },
    highlight: true,
  },
  {
    id: "use",
    cells: {
      aspect: "Reach for it when",
      bfs: "Levels, fewest hops, nearest",
      dfs: "Cycles, paths, topo, connected components in a deep graph",
    },
  },
];

export default function GraphBfsVsDfs() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
