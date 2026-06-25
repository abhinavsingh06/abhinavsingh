"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "aspect", label: "", emphasis: true },
  { id: "twoPointers", label: "Two pointers" },
  { id: "slidingWindow", label: "Sliding window" },
];

const ROWS = [
  {
    id: "goal",
    cells: {
      aspect: "Goal",
      twoPointers: "Compare or merge from two positions",
      slidingWindow: "Maintain a contiguous subarray/substring",
    },
  },
  {
    id: "movement",
    cells: {
      aspect: "Pointer movement",
      twoPointers: "Often opposite ends or two separate arrays",
      slidingWindow: "Usually both move forward (L, R)",
    },
  },
  {
    id: "problems",
    cells: {
      aspect: "Classic problems",
      twoPointers: "Palindrome, two sum II, merge, subsequence",
      slidingWindow: "Max sum size k, longest unique substring",
    },
  },
];

export default function TwoPointersVsSlidingWindow() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
