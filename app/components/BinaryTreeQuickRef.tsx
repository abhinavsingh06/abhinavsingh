"use client";

import InteractivePatternPicker, {
  type FlowEdge,
  type FlowNode,
} from "./InteractivePatternPicker";

const NODES: FlowNode[] = [
  {
    id: "start",
    label: "Tree problem?",
    detail: "Hierarchy, parents, left/right",
    x: 328,
    y: 16,
    variant: "start",
  },
  {
    id: "bst",
    label: "Is it a BST?",
    detail: "left < node < right",
    x: 120,
    y: 108,
    variant: "answer",
  },
  {
    id: "levels",
    label: "Need levels?",
    detail: "Process by depth",
    x: 328,
    y: 108,
    variant: "answer",
  },
  {
    id: "dfs",
    label: "DFS recurse",
    detail: "Depth, paths, invert, diameter",
    x: 536,
    y: 108,
    variant: "answer",
  },
  {
    id: "search",
    label: "Search / insert",
    detail: "Compare vs node.val",
    x: 48,
    y: 212,
    variant: "answer",
  },
  {
    id: "validate",
    label: "Validate BST",
    detail: "Pass (lo, hi) bounds",
    x: 176,
    y: 212,
    variant: "answer",
  },
  {
    id: "bfs",
    label: "BFS queue",
    detail: "Level order, zigzag",
    x: 328,
    y: 212,
    variant: "answer",
  },
  {
    id: "lca",
    label: "LCA / path",
    detail: "Meet in ancestors",
    x: 480,
    y: 212,
    variant: "answer",
  },
  {
    id: "rebuild",
    label: "Rebuild tree",
    detail: "Pre + inorder split",
    x: 608,
    y: 212,
    variant: "answer",
  },
];

const EDGES: FlowEdge[] = [
  { from: "start", to: "bst", label: "ordered" },
  { from: "start", to: "levels", label: "by depth" },
  { from: "start", to: "dfs", label: "recurse" },
  { from: "bst", to: "search", label: "lookup" },
  { from: "bst", to: "validate", label: "check" },
  { from: "levels", to: "bfs", label: "queue" },
  { from: "dfs", to: "lca", label: "ancestors" },
  { from: "dfs", to: "rebuild", label: "arrays" },
];

export default function BinaryTreeQuickRef() {
  return (
    <InteractivePatternPicker
      nodes={NODES}
      edges={EDGES}
      markerId="bt-arrowhead"
      ariaLabel="Binary tree pattern decision flowchart"
      getNodeWidth={(node) => (node.variant === "start" ? 200 : 120)}
    />
  );
}
