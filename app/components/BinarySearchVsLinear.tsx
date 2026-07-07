"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "aspect", label: "", emphasis: true },
  { id: "binary", label: "Binary search" },
  { id: "linear", label: "Linear scan" },
];

const ROWS = [
  {
    id: "requirement",
    cells: {
      aspect: "Requirement",
      binary: "Sorted order or monotonic check",
      linear: "Works on any array",
    },
  },
  {
    id: "time",
    cells: {
      aspect: "Single lookup",
      binary: "O(log n)",
      linear: "O(n)",
    },
  },
  {
    id: "queries",
    cells: {
      aspect: "Many queries on static data",
      binary: "Huge win at scale",
      linear: "O(n) per query",
    },
  },
  {
    id: "setup",
    cells: {
      aspect: "Setup cost",
      binary: "May need sort O(n log n)",
      linear: "None",
    },
  },
  {
    id: "when",
    cells: {
      aspect: "Prefer linear when",
      binary: "—",
      linear: "n is tiny or already one pass",
    },
  },
];

export default function BinarySearchVsLinear() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
