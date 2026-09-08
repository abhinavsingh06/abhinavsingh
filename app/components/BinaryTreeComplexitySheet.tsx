"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "problem", label: "Problem", emphasis: true },
  { id: "time", label: "Time", mono: true, accent: true },
  { id: "space", label: "Space", mono: true, accent: true },
];

const ROWS = [
  {
    id: "dfs",
    cells: {
      problem: "DFS over all nodes",
      time: "O(n)",
      space: "O(h)",
    },
  },
  {
    id: "bfs",
    cells: {
      problem: "Level-order BFS",
      time: "O(n)",
      space: "O(w)",
    },
  },
  {
    id: "bst",
    cells: {
      problem: "BST search / insert",
      time: "O(h)",
      space: "O(1)*",
    },
  },
  {
    id: "balanced",
    cells: {
      problem: "Balanced BST (AVL / red-black)",
      time: "O(log n)",
      space: "O(log n)",
    },
  },
  {
    id: "skewed",
    cells: {
      problem: "Skewed tree (worst h = n)",
      time: "O(n)",
      space: "O(n)",
    },
  },
];

export default function BinaryTreeComplexitySheet() {
  return (
    <BlogDataTable
      columns={COLUMNS}
      rows={ROWS}
      footnote="h = height, w = max width of a level. * Iterative BST search; recursive uses O(h) stack."
    />
  );
}
