"use client";

import InteractivePatternPicker, {
  type FlowEdge,
  type FlowNode,
} from "./InteractivePatternPicker";

const NODES: FlowNode[] = [
  {
    id: "start",
    label: "Order matter?",
    detail: "Elements interact in a specific order",
    x: 328,
    y: 16,
    variant: "start",
  },
  {
    id: "lifo",
    label: "Last in, first out",
    detail: "Most recent matches / undoes first",
    x: 120,
    y: 108,
    variant: "answer",
  },
  {
    id: "fifo",
    label: "First in, first out",
    detail: "Oldest leaves first",
    x: 328,
    y: 108,
    variant: "answer",
  },
  {
    id: "next",
    label: "Next greater / smaller",
    detail: "Or maintain window max/min",
    x: 536,
    y: 108,
    variant: "answer",
  },
  {
    id: "parens",
    label: "Stack string problems",
    detail: "Parentheses, duplicates, backspace",
    x: 64,
    y: 212,
    variant: "answer",
  },
  {
    id: "stream",
    label: "Queue stream",
    detail: "Recent calls, expiry window",
    x: 280,
    y: 212,
    variant: "answer",
  },
  {
    id: "mono-s",
    label: "Monotonic stack",
    detail: "Daily temperatures, next greater",
    x: 460,
    y: 212,
    variant: "answer",
  },
  {
    id: "mono-d",
    label: "Monotonic deque",
    detail: "Window max, abs-diff limit",
    x: 592,
    y: 212,
    variant: "answer",
  },
];

const EDGES: FlowEdge[] = [
  { from: "start", to: "lifo", label: "LIFO" },
  { from: "start", to: "fifo", label: "FIFO" },
  { from: "start", to: "next", label: "extremum" },
  { from: "lifo", to: "parens", label: "strings" },
  { from: "fifo", to: "stream", label: "queue" },
  { from: "next", to: "mono-s", label: "per index" },
  { from: "next", to: "mono-d", label: "sliding window" },
];

export default function StackQueueQuickRef() {
  return (
    <InteractivePatternPicker
      nodes={NODES}
      edges={EDGES}
      markerId="sq-arrowhead"
      ariaLabel="Stack and queue pattern decision flowchart"
      getNodeWidth={(node) => (node.variant === "start" ? 200 : 120)}
    />
  );
}
