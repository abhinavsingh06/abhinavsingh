"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "pattern", label: "Pattern", emphasis: true },
  { id: "setup", label: "Setup", mono: true },
  { id: "when", label: "When to use" },
];

const ROWS = [
  {
    id: "build",
    cells: {
      pattern: "Build prefix array",
      setup: "prefix[i] = prefix[i−1] + nums[i]",
      when: "Many arbitrary range-sum queries on static input",
    },
    highlight: true,
  },
  {
    id: "running",
    cells: {
      pattern: "Running sum",
      setup: "left += nums[i] as i moves forward",
      when: "Only need prefix[i] in order — split array, pivot index",
    },
  },
  {
    id: "hashmap",
    cells: {
      pattern: "Prefix + hash map",
      setup: "Count prefix[j] − prefix[i] = K occurrences",
      when: "Count subarrays with sum K, divisible by K",
    },
  },
  {
    id: "2d",
    cells: {
      pattern: "2D prefix",
      setup: "prefix[r][c] = sum of rectangle (0,0)→(r,c)",
      when: "Submatrix sum queries on a grid",
    },
  },
];

export default function PrefixSumPatternOverview() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
