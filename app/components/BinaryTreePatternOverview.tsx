"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "pattern", label: "Pattern", emphasis: true },
  { id: "shape", label: "Shape", mono: true },
  { id: "when", label: "When to use" },
];

const ROWS = [
  {
    id: "dfs",
    cells: {
      pattern: "DFS recursion",
      shape: "left / right recurse",
      when: "Depth, paths, validate, invert, diameter",
    },
    highlight: true,
  },
  {
    id: "bfs",
    cells: {
      pattern: "BFS / level order",
      shape: "queue of nodes",
      when: "Level averages, zigzag, shortest tree path",
    },
  },
  {
    id: "bst-search",
    cells: {
      pattern: "BST search / insert",
      shape: "compare vs node.val",
      when: "Ordered tree — O(h) lookup and insert",
    },
  },
  {
    id: "traverse",
    cells: {
      pattern: "Traversals",
      shape: "pre / in / post",
      when: "Serialize, rebuild, sorted order from BST",
    },
  },
  {
    id: "lca",
    cells: {
      pattern: "LCA / ancestors",
      shape: "path or BST bounds",
      when: "Lowest common ancestor, path between nodes",
    },
  },
];

export default function BinaryTreePatternOverview() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
