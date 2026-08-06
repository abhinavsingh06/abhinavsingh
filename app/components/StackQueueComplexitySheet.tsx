"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "problem", label: "Problem", emphasis: true },
  { id: "time", label: "Time", mono: true, accent: true },
  { id: "space", label: "Space", mono: true, accent: true },
];

const ROWS = [
  {
    id: "parens",
    cells: {
      problem: "Valid parentheses / string stack",
      time: "O(n)",
      space: "O(n)",
    },
  },
  {
    id: "queue",
    cells: {
      problem: "Recent calls (efficient queue)",
      time: "O(1)*",
      space: "O(w)",
    },
  },
  {
    id: "temps",
    cells: {
      problem: "Daily temperatures",
      time: "O(n)",
      space: "O(n)",
    },
  },
  {
    id: "window",
    cells: {
      problem: "Sliding window maximum",
      time: "O(n)",
      space: "O(k)",
    },
  },
  {
    id: "limit",
    cells: {
      problem: "Subarray abs-diff ≤ limit",
      time: "O(n)",
      space: "O(n)",
    },
  },
];

export default function StackQueueComplexitySheet() {
  return (
    <BlogDataTable
      columns={COLUMNS}
      rows={ROWS}
      footnote="* Amortized per ping when dequeue from front is O(1). w = calls inside the 3000 ms window. Nested while-pops are still O(n) overall — each element enters/leaves once."
    />
  );
}
