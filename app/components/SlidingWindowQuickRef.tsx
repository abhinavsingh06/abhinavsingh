"use client";

import InteractivePatternPicker, {
  type FlowEdge,
  type FlowNode,
} from "./InteractivePatternPicker";

const NODES: FlowNode[] = [
  {
    id: "start",
    label: "Sliding Window Problem",
    detail: "Contiguous subarray or substring?",
    x: 210,
    y: 16,
    variant: "start",
  },
  {
    id: "fixed",
    label: "Fixed size k",
    detail: "Build window[0..k−1], slide right, drop left",
    x: 70,
    y: 108,
    variant: "answer",
  },
  {
    id: "shortest",
    label: "Shortest window",
    detail: "Expand R → shrink L while VALID → record during shrink",
    x: 210,
    y: 108,
    variant: "answer",
  },
  {
    id: "longest",
    label: "Longest window",
    detail: "Expand R → shrink L while INVALID → record after shrink",
    x: 350,
    y: 108,
    variant: "answer",
  },
  {
    id: "count",
    label: "Count all valid",
    detail: "On each valid step: count += right − left + 1",
    x: 100,
    y: 212,
    variant: "answer",
  },
  {
    id: "exactly",
    label: "Exactly K",
    detail: "atMost(K) − atMost(K − 1)",
    x: 210,
    y: 212,
    variant: "answer",
  },
  {
    id: "max",
    label: "Max / Min in window",
    detail: "Monotonic deque of indices (decreasing values)",
    x: 320,
    y: 212,
    variant: "answer",
  },
];

const EDGES: FlowEdge[] = [
  { from: "start", to: "fixed", label: "size k given" },
  { from: "start", to: "shortest", label: "min length" },
  { from: "start", to: "longest", label: "max length" },
  { from: "longest", to: "count", label: "count all" },
  { from: "longest", to: "exactly", label: "exactly K" },
  { from: "fixed", to: "max", label: "max/min metric" },
];

export default function SlidingWindowQuickRef() {
  return (
    <InteractivePatternPicker
      nodes={NODES}
      edges={EDGES}
      markerId="sw-arrowhead"
      ariaLabel="Sliding window pattern decision flowchart"
      getNodeWidth={(node) => (node.variant === "start" ? 200 : 128)}
    />
  );
}
