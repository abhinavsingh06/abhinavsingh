"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "pattern", label: "Pattern", emphasis: true },
  { id: "structure", label: "Structure", mono: true },
  { id: "when", label: "When to use" },
];

const ROWS = [
  {
    id: "stack",
    cells: {
      pattern: "LIFO stack",
      structure: "push / pop / peek",
      when: "Matching, undo, nested history, recursion-like order",
    },
    highlight: true,
  },
  {
    id: "queue",
    cells: {
      pattern: "FIFO queue",
      structure: "enqueue / dequeue",
      when: "First-come streams, sliding expiry, later BFS",
    },
  },
  {
    id: "deque",
    cells: {
      pattern: "Deque",
      structure: "add/remove both ends",
      when: "Window max/min, monotonic + sliding window",
    },
  },
  {
    id: "mono-stack",
    cells: {
      pattern: "Monotonic stack",
      structure: "pop while violates order",
      when: "Next greater/smaller, daily temperatures",
    },
  },
  {
    id: "mono-deque",
    cells: {
      pattern: "Monotonic deque",
      structure: "front = extremum",
      when: "Sliding window maximum / min–max constraint",
    },
  },
];

export default function StackQueuePatternOverview() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
