"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "aspect", label: "", emphasis: true },
  { id: "tree", label: "Binary tree / BST" },
  { id: "array", label: "Sorted array" },
];

const ROWS = [
  {
    id: "lookup",
    cells: {
      aspect: "Lookup",
      tree: "O(h) — O(log n) if balanced",
      array: "O(log n) binary search",
    },
  },
  {
    id: "insert",
    cells: {
      aspect: "Insert / delete",
      tree: "O(h) with local pointer updates",
      array: "O(n) shift to keep sorted",
    },
  },
  {
    id: "order",
    cells: {
      aspect: "Sorted iteration",
      tree: "Inorder walk — O(n)",
      array: "Already sorted — O(n)",
    },
  },
  {
    id: "structure",
    cells: {
      aspect: "Hierarchy / ancestors",
      tree: "Natural parent–child paths",
      array: "No structure — rebuild indices",
    },
  },
  {
    id: "when",
    cells: {
      aspect: "Prefer when",
      tree: "Many inserts + ordered queries",
      array: "Static data, heavy random access",
    },
  },
];

export default function BinaryTreeVsArrays() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
