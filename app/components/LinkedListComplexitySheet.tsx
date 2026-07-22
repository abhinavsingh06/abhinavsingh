"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "problem", label: "Problem", emphasis: true },
  { id: "time", label: "Time", mono: true, accent: true },
  { id: "space", label: "Space", mono: true, accent: true },
];

const ROWS = [
  {
    id: "traverse",
    cells: {
      problem: "Traverse / sum / length",
      time: "O(n)",
      space: "O(1)",
    },
  },
  {
    id: "middle",
    cells: {
      problem: "Middle (fast & slow)",
      time: "O(n)",
      space: "O(1)",
    },
  },
  {
    id: "cycle",
    cells: {
      problem: "Cycle detect (Floyd)",
      time: "O(n)",
      space: "O(1)",
    },
  },
  {
    id: "kth",
    cells: {
      problem: "k-th from end",
      time: "O(n)",
      space: "O(1)",
    },
  },
  {
    id: "reverse",
    cells: {
      problem: "Reverse list",
      time: "O(n)",
      space: "O(1)",
    },
  },
  {
    id: "swap",
    cells: {
      problem: "Swap pairs",
      time: "O(n)",
      space: "O(1)",
    },
  },
];

export default function LinkedListComplexitySheet() {
  return (
    <BlogDataTable
      columns={COLUMNS}
      rows={ROWS}
      footnote="Hashing for cycles is also O(n) time but O(n) space — prefer Floyd when interviewers want constant space."
    />
  );
}
