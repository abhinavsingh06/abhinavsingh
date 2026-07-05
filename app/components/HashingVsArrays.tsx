"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "aspect", label: "", emphasis: true },
  { id: "hash", label: "Hash map / set" },
  { id: "array", label: "Array" },
];

const ROWS = [
  {
    id: "lookup",
    cells: {
      aspect: "Existence check",
      hash: "O(1) average",
      array: "O(n) scan",
    },
  },
  {
    id: "keys",
    cells: {
      aspect: "Key type",
      hash: "Almost any immutable key",
      array: "Integer index only",
    },
  },
  {
    id: "order",
    cells: {
      aspect: "Order",
      hash: "Unordered (usually)",
      array: "Ordered by index",
    },
  },
  {
    id: "space",
    cells: {
      aspect: "Space tradeoff",
      hash: "Overhead; may waste slots",
      array: "Compact for dense indices",
    },
  },
  {
    id: "small",
    cells: {
      aspect: "Small inputs",
      hash: "Constant factors can dominate",
      array: "Often faster in practice",
    },
  },
];

export default function HashingVsArrays() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
