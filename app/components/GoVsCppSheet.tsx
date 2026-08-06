"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "dimension", label: "Dimension", emphasis: true },
  { id: "cpp", label: "C++ (typical large codebase)" },
  { id: "go", label: "Go design bet", accent: true },
];

const ROWS = [
  {
    id: "compile",
    cells: {
      dimension: "Compile / feedback",
      cpp: "Can explode with headers & templates",
      go: "Fast, package-oriented builds",
    },
    highlight: true,
  },
  {
    id: "deps",
    cells: {
      dimension: "Dependencies",
      cpp: "Complex build graphs, include cascades",
      go: "Explicit imports; boring module story",
    },
  },
  {
    id: "memory",
    cells: {
      dimension: "Memory",
      cpp: "Manual control; high footgun density",
      go: "GC + simple pointer rules",
    },
  },
  {
    id: "concurrency",
    cells: {
      dimension: "Concurrency",
      cpp: "Threads, locks, async frameworks",
      go: "Goroutines + channels (CSP)",
    },
  },
  {
    id: "features",
    cells: {
      dimension: "Feature surface",
      cpp: "Huge language; many dialects",
      go: "Small language; uniform style",
    },
  },
  {
    id: "audience",
    cells: {
      dimension: "Optimized for",
      cpp: "Maximum control & expressiveness",
      go: "Reading & maintaining at org scale",
    },
  },
];

export default function GoVsCppSheet() {
  return (
    <BlogDataTable
      columns={COLUMNS}
      rows={ROWS}
      footnote="Not “C++ bad, Go good” — different optimization targets. C++ still wins where you need zero-cost abstractions and fine-grained control."
    />
  );
}
