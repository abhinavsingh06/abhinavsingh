"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "problem", label: "Problem", emphasis: true },
  { id: "time", label: "Time", mono: true, accent: true },
  { id: "space", label: "Space", mono: true, accent: true },
];

const ROWS = [
  {
    id: "classic",
    cells: {
      problem: "Binary search on n elements",
      time: "O(log n)",
      space: "O(1)",
    },
  },
  {
    id: "matrix",
    cells: {
      problem: "2D matrix (m × n)",
      time: "O(log(m·n))",
      space: "O(1)",
    },
  },
  {
    id: "spells",
    cells: {
      problem: "Spells × sorted potions",
      time: "O((n+m) log m)",
      space: "O(1)*",
    },
  },
  {
    id: "answer",
    cells: {
      problem: "Answer space + check O(n)",
      time: "O(n log k)",
      space: "O(1)",
    },
  },
  {
    id: "effort",
    cells: {
      problem: "Min effort + DFS check",
      time: "O(m·n log k)",
      space: "O(m·n)",
    },
  },
];

export default function BinarySearchComplexitySheet() {
  return (
    <BlogDataTable
      columns={COLUMNS}
      rows={ROWS}
      footnote="* Sorting potions may use O(m) space depending on language sort implementation."
    />
  );
}
