"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "problem", label: "Problem", emphasis: true },
  { id: "time", label: "Time", mono: true, accent: true },
  { id: "space", label: "Space", mono: true, accent: true },
];

const ROWS = [
  {
    id: "build",
    cells: {
      problem: "Build prefix array",
      time: "O(n)",
      space: "O(n)",
    },
  },
  {
    id: "query",
    cells: {
      problem: "Range sum query",
      time: "O(1)",
      space: "O(1)*",
    },
  },
  {
    id: "queries",
    cells: {
      problem: "m range queries",
      time: "O(n + m)",
      space: "O(n)",
    },
  },
  {
    id: "split",
    cells: {
      problem: "Split array (prefix + total)",
      time: "O(n)",
      space: "O(1)†",
    },
  },
  {
    id: "equals-k",
    cells: {
      problem: "Subarray sum equals K",
      time: "O(n)",
      space: "O(n)",
    },
  },
  {
    id: "2d",
    cells: {
      problem: "2D submatrix query",
      time: "O(1)",
      space: "O(r × c)",
    },
  },
];

export default function PrefixSumComplexitySheet() {
  return (
    <BlogDataTable
      columns={COLUMNS}
      rows={ROWS}
      footnote="* Per query after preprocessing. † Running-sum variant — no prefix array stored."
    />
  );
}
