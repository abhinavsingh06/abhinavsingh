"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "operation", label: "Operation", emphasis: true },
  { id: "map", label: "Hash Map", mono: true, accent: true },
  { id: "set", label: "Hash Set", mono: true, accent: true },
  { id: "array", label: "Array scan", mono: true },
];

const ROWS = [
  {
    id: "add",
    cells: {
      operation: "Add element",
      map: "O(1)*",
      set: "O(1)*",
      array: "O(1) append",
    },
  },
  {
    id: "lookup",
    cells: {
      operation: "Check existence",
      map: "O(1)*",
      set: "O(1)*",
      array: "O(n)",
    },
  },
  {
    id: "delete",
    cells: {
      operation: "Delete element",
      map: "O(1)*",
      set: "O(1)*",
      array: "O(n)",
    },
  },
  {
    id: "two-sum",
    cells: {
      operation: "Two Sum (n elements)",
      map: "O(n)",
      set: "O(n)†",
      array: "O(n²)",
    },
  },
  {
    id: "subarray-k",
    cells: {
      operation: "Subarray sum = K",
      map: "O(n)",
      set: "—",
      array: "O(n²)",
    },
  },
];

export default function HashingComplexitySheet() {
  return (
    <BlogDataTable
      columns={COLUMNS}
      rows={ROWS}
      footnote="* Average case; hashing strings costs O(m) for length m. † Set finds a pair but not indices."
    />
  );
}
