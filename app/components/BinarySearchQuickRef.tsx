"use client";

import InteractivePatternPicker, {
  type FlowEdge,
  type FlowNode,
} from "./InteractivePatternPicker";

const NODES: FlowNode[] = [
  {
    id: "start",
    label: "Need O(log n)?",
    detail: "Sorted input or monotonic answer space",
    x: 328,
    y: 16,
    variant: "start",
  },
  {
    id: "sorted-array",
    label: "Sorted array",
    detail: "Classic L/R on indices",
    x: 120,
    y: 108,
    variant: "answer",
  },
  {
    id: "duplicates",
    label: "Duplicates?",
    detail: "Lower / upper bound templates",
    x: 328,
    y: 108,
    variant: "answer",
  },
  {
    id: "answer-space",
    label: "Min / max answer",
    detail: "Binary search on k with check(k)",
    x: 536,
    y: 108,
    variant: "answer",
  },
  {
    id: "find-x",
    label: "Find exact x",
    detail: "LC 704 template",
    x: 64,
    y: 212,
    variant: "answer",
  },
  {
    id: "insert",
    label: "Insert position",
    detail: "Return left when not found",
    x: 196,
    y: 212,
    variant: "answer",
  },
  {
    id: "matrix",
    label: "2D sorted matrix",
    detail: "Flatten to 1D indices",
    x: 420,
    y: 212,
    variant: "answer",
  },
  {
    id: "koko",
    label: "Feasibility check",
    detail: "Koko, min speed, min effort",
    x: 592,
    y: 212,
    variant: "answer",
  },
];

const EDGES: FlowEdge[] = [
  { from: "start", to: "sorted-array", label: "indices" },
  { from: "start", to: "answer-space", label: "optimize k" },
  { from: "sorted-array", to: "duplicates", label: "repeats?" },
  { from: "sorted-array", to: "find-x", label: "unique" },
  { from: "duplicates", to: "insert", label: "bounds" },
  { from: "sorted-array", to: "matrix", label: "grid" },
  { from: "answer-space", to: "koko", label: "check(mid)" },
];

export default function BinarySearchQuickRef() {
  return (
    <InteractivePatternPicker
      nodes={NODES}
      edges={EDGES}
      markerId="bs-arrowhead"
      ariaLabel="Binary search pattern decision flowchart"
      getNodeWidth={(node) => (node.variant === "start" ? 200 : 120)}
    />
  );
}
