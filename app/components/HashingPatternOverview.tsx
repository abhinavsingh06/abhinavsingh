"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "pattern", label: "Pattern", emphasis: true },
  { id: "structure", label: "Structure", mono: true },
  { id: "when", label: "When to use" },
];

const ROWS = [
  {
    id: "existence",
    cells: {
      pattern: "Existence / lookup",
      structure: "Set or Map",
      when: "if x in arr in a loop → O(n²) without hashing",
    },
    highlight: true,
  },
  {
    id: "counting",
    cells: {
      pattern: "Frequency counting",
      structure: "Map key → count",
      when: "Track how often elements appear in window or array",
    },
  },
  {
    id: "complement",
    cells: {
      pattern: "Complement lookup",
      structure: "Map value → index",
      when: "Two Sum: search for target − num in O(1)",
    },
  },
  {
    id: "prefix-freq",
    cells: {
      pattern: "Prefix + frequency map",
      structure: "Map prefixSum → count",
      when: "Count subarrays with sum exactly K",
    },
  },
  {
    id: "grouping",
    cells: {
      pattern: "Grouping by signature",
      structure: "Map canonicalKey → group[]",
      when: "Anagrams, digit sums, row/column signatures",
    },
  },
];

export default function HashingPatternOverview() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
