"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "aspect", label: "", emphasis: true },
  { id: "prefix", label: "Prefix sum" },
  { id: "sliding", label: "Sliding window" },
  { id: "twoPtr", label: "Two pointers" },
];

const ROWS = [
  {
    id: "goal",
    cells: {
      aspect: "Goal",
      prefix: "Answer subarray sum queries fast",
      sliding: "Optimize over contiguous windows",
      twoPtr: "Compare or merge from two positions",
    },
  },
  {
    id: "input",
    cells: {
      aspect: "Best input",
      prefix: "Static array; negatives OK",
      sliding: "Contiguous constraint (length, distinct, sum bound)",
      twoPtr: "Sorted arrays, two sequences, palindrome",
    },
  },
  {
    id: "complexity",
    cells: {
      aspect: "Typical time",
      prefix: "O(n) build + O(1) query",
      sliding: "O(n) single pass",
      twoPtr: "O(n) or O(n + m)",
    },
  },
  {
    id: "problems",
    cells: {
      aspect: "Classic problems",
      prefix: "Range queries, split array, sum equals K",
      sliding: "Max sum size k, longest unique substring",
      twoPtr: "Two sum II, merge, palindrome, subsequence",
    },
  },
];

export default function PrefixSumVsOthers() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
