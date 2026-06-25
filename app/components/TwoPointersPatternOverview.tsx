"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "pattern", label: "Pattern", emphasis: true },
  { id: "setup", label: "Setup", mono: true },
  { id: "when", label: "When to use" },
];

const ROWS = [
  {
    id: "opposite",
    cells: {
      pattern: "Opposite ends",
      setup: "left = 0, right = n − 1, move inward",
      when: "Palindrome, two sum on sorted array, container with most water",
    },
    highlight: true,
  },
  {
    id: "parallel",
    cells: {
      pattern: "Parallel scan",
      setup: "i and j on one or two arrays, move forward",
      when: "Merge sorted arrays, is subsequence, intersection of sorted lists",
    },
  },
];

export default function TwoPointersPatternOverview() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
