"use client";

import InteractivePatternPicker, {
  type FlowEdge,
  type FlowNode,
} from "./InteractivePatternPicker";

const NODES: FlowNode[] = [
  {
    id: "start",
    label: "Subarray Sum Problem",
    detail: "Need sums over ranges or splits?",
    x: 328,
    y: 16,
    variant: "start",
  },
  {
    id: "many-queries",
    label: "Many range queries",
    detail: "Build prefix[] once → prefix[j] − prefix[i−1]",
    x: 120,
    y: 108,
    variant: "answer",
  },
  {
    id: "incremental",
    label: "Left → right scan",
    detail: "Running sum + total — O(1) space",
    x: 328,
    y: 108,
    variant: "answer",
  },
  {
    id: "count-k",
    label: "Count sum = K",
    detail: "Prefix + hash map of prefix frequencies",
    x: 536,
    y: 108,
    variant: "answer",
  },
  {
    id: "immutable",
    label: "Range Sum Query",
    detail: "Class with prefix built in constructor",
    x: 64,
    y: 212,
    variant: "answer",
  },
  {
    id: "pivot",
    label: "Pivot / split index",
    detail: "left = prefix[i], right = total − left",
    x: 196,
    y: 212,
    variant: "answer",
  },
  {
    id: "modulo",
    label: "Divisible by K",
    detail: "Store prefix % K counts in map",
    x: 460,
    y: 212,
    variant: "answer",
  },
  {
    id: "grid",
    label: "2D submatrix",
    detail: "2D prefix + inclusion-exclusion",
    x: 592,
    y: 212,
    variant: "answer",
  },
];

const EDGES: FlowEdge[] = [
  { from: "start", to: "many-queries", label: "static + many queries" },
  { from: "start", to: "incremental", label: "single left→right pass" },
  { from: "start", to: "count-k", label: "how many subarrays?" },
  { from: "many-queries", to: "immutable", label: "LC 303 class" },
  { from: "incremental", to: "pivot", label: "split / balance" },
  { from: "count-k", to: "modulo", label: "mod K" },
  { from: "many-queries", to: "grid", label: "matrix input" },
];

export default function PrefixSumQuickRef() {
  return (
    <InteractivePatternPicker
      nodes={NODES}
      edges={EDGES}
      markerId="ps-arrowhead"
      ariaLabel="Prefix sum pattern decision flowchart"
      getNodeWidth={(node) => (node.variant === "start" ? 200 : 120)}
    />
  );
}
