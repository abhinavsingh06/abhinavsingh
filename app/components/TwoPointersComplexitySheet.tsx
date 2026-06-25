"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "problem", label: "Problem", emphasis: true },
  { id: "time", label: "Time", mono: true, accent: true },
  { id: "space", label: "Space", mono: true, accent: true },
];

const ROWS = [
  {
    id: "palindrome",
    cells: {
      problem: "Valid palindrome",
      time: "O(n)",
      space: "O(1)",
    },
  },
  {
    id: "two-sum",
    cells: {
      problem: "Two sum II (sorted)",
      time: "O(n)",
      space: "O(1)",
    },
  },
  {
    id: "merge",
    cells: {
      problem: "Merge two sorted arrays",
      time: "O(n + m)",
      space: "O(1)*",
    },
  },
  {
    id: "subsequence",
    cells: {
      problem: "Is subsequence",
      time: "O(n + m)",
      space: "O(1)",
    },
  },
];

export default function TwoPointersComplexitySheet() {
  return (
    <BlogDataTable
      columns={COLUMNS}
      rows={ROWS}
      footnote="* Output array not counted toward extra space."
    />
  );
}
