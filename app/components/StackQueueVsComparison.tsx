"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "aspect", label: "", emphasis: true },
  { id: "stack", label: "Stack" },
  { id: "queue", label: "Queue / deque" },
];

const ROWS = [
  {
    id: "order",
    cells: {
      aspect: "Order",
      stack: "LIFO — same end",
      queue: "FIFO — opposite ends (deque: both)",
    },
  },
  {
    id: "ops",
    cells: {
      aspect: "Core ops",
      stack: "push, pop, peek",
      queue: "enqueue, dequeue (deque both ends)",
    },
  },
  {
    id: "impl",
    cells: {
      aspect: "Easy impl",
      stack: "Dynamic array",
      queue: "Deque / doubly linked list",
    },
  },
  {
    id: "use",
    cells: {
      aspect: "Classic use",
      stack: "Matching, undo, next greater",
      queue: "Streams, BFS, window extrema",
    },
  },
  {
    id: "mono",
    cells: {
      aspect: "Monotonic form",
      stack: "Next warmer / next greater",
      queue: "Sliding window max / min",
    },
  },
];

export default function StackQueueVsComparison() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
