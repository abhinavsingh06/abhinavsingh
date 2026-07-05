"use client";

import InteractivePatternPicker, {
  type FlowEdge,
  type FlowNode,
} from "./InteractivePatternPicker";

const NODES: FlowNode[] = [
  {
    id: "start",
    label: "Need fast lookup?",
    detail: "Seeing if x in ... inside a loop?",
    x: 328,
    y: 16,
    variant: "start",
  },
  {
    id: "existence",
    label: "Check existence",
    detail: "Set — add / has in O(1)",
    x: 120,
    y: 108,
    variant: "answer",
  },
  {
    id: "pair",
    label: "Need index or value?",
    detail: "Map value → index (Two Sum)",
    x: 328,
    y: 108,
    variant: "answer",
  },
  {
    id: "count",
    label: "Count frequencies",
    detail: "Map element → count",
    x: 536,
    y: 108,
    variant: "answer",
  },
  {
    id: "group",
    label: "Group by signature",
    detail: "sorted string, tuple, digit sum",
    x: 64,
    y: 212,
    variant: "answer",
  },
  {
    id: "indices",
    label: "Track last index",
    detail: "Map value → most recent index",
    x: 220,
    y: 212,
    variant: "answer",
  },
  {
    id: "window",
    label: "Window constraint",
    detail: "counts map + sliding window",
    x: 420,
    y: 212,
    variant: "answer",
  },
  {
    id: "prefix-k",
    label: "Exact subarray metric",
    detail: "prefix + counts[curr − k]",
    x: 592,
    y: 212,
    variant: "answer",
  },
];

const EDGES: FlowEdge[] = [
  { from: "start", to: "existence", label: "yes/no only" },
  { from: "start", to: "pair", label: "return indices" },
  { from: "start", to: "count", label: "how many times?" },
  { from: "existence", to: "group", label: "cluster items" },
  { from: "pair", to: "indices", label: "shortest distance" },
  { from: "count", to: "window", label: "in a window" },
  { from: "count", to: "prefix-k", label: "subarray sum = K" },
];

export default function HashingQuickRef() {
  return (
    <InteractivePatternPicker
      nodes={NODES}
      edges={EDGES}
      markerId="hash-arrowhead"
      ariaLabel="Hash map pattern decision flowchart"
      getNodeWidth={(node) => (node.variant === "start" ? 200 : 128)}
    />
  );
}
