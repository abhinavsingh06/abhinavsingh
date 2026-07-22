"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "operation", label: "Operation", emphasis: true },
  { id: "list", label: "Linked list", mono: true, accent: true },
  { id: "array", label: "Dynamic array", mono: true },
];

const ROWS = [
  {
    id: "access",
    cells: {
      operation: "Access index i",
      list: "O(n)",
      array: "O(1)",
    },
  },
  {
    id: "insert-known",
    cells: {
      operation: "Insert/delete with prev ref",
      list: "O(1)",
      array: "O(n)",
    },
  },
  {
    id: "insert-unknown",
    cells: {
      operation: "Insert/delete at arbitrary i",
      list: "O(n)",
      array: "O(n)",
    },
  },
  {
    id: "append",
    cells: {
      operation: "Append (with tail / sentinel)",
      list: "O(1)",
      array: "O(1)*",
    },
  },
  {
    id: "space",
    cells: {
      operation: "Per-element overhead",
      list: "Pointer(s)",
      array: "Packed",
    },
  },
];

export default function LinkedListVsArrays() {
  return (
    <BlogDataTable
      columns={COLUMNS}
      rows={ROWS}
      footnote="* Amortized — occasional resize is O(n). Interview tip: don't dump the list into an array unless asked."
    />
  );
}
