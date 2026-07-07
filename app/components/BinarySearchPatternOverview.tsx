"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "pattern", label: "Pattern", emphasis: true },
  { id: "template", label: "Template", mono: true },
  { id: "when", label: "When to use" },
];

const ROWS = [
  {
    id: "classic",
    cells: {
      pattern: "Classic search",
      template: "while (L ≤ R)",
      when: "Find index of x in sorted array with no duplicates",
    },
    highlight: true,
  },
  {
    id: "lower",
    cells: {
      pattern: "Lower bound",
      template: "first index where arr[i] ≥ x",
      when: "Duplicates — left-most position, insert point",
    },
  },
  {
    id: "upper",
    cells: {
      pattern: "Upper bound",
      template: "first index where arr[i] > x",
      when: "Right-most element + 1, range counts",
    },
  },
  {
    id: "matrix",
    cells: {
      pattern: "2D flatten",
      template: "mid → (mid // n, mid % n)",
      when: "Sorted rows + last row < next row first",
    },
  },
  {
    id: "min-answer",
    cells: {
      pattern: "Min feasible answer",
      template: "check(mid) → shrink right if true",
      when: "“Minimum k such that…” with monotonic feasibility",
    },
  },
  {
    id: "max-answer",
    cells: {
      pattern: "Max feasible answer",
      template: "check(mid) → shrink left if true",
      when: "“Maximum x such that…” — return right at end",
    },
  },
];

export default function BinarySearchPatternOverview() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
