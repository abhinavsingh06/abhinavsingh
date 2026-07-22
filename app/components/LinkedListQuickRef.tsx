"use client";

import InteractivePatternPicker, {
  type FlowEdge,
  type FlowNode,
} from "./InteractivePatternPicker";

const NODES: FlowNode[] = [
  {
    id: "start",
    label: "Linked list problem?",
    detail: "Don't convert to an array — use pointers",
    x: 328,
    y: 16,
    variant: "start",
  },
  {
    id: "structure",
    label: "Edit structure",
    detail: "Insert, delete, reverse, swap",
    x: 120,
    y: 108,
    variant: "answer",
  },
  {
    id: "measure",
    label: "Find position / property",
    detail: "Middle, k-th from end, cycle",
    x: 328,
    y: 108,
    variant: "answer",
  },
  {
    id: "combine",
    label: "Multi-step",
    detail: "Middle + reverse second half",
    x: 536,
    y: 108,
    variant: "answer",
  },
  {
    id: "prev",
    label: "Hold prev",
    detail: "O(1) splice with prev.next",
    x: 64,
    y: 212,
    variant: "answer",
  },
  {
    id: "three",
    label: "Three pointers",
    detail: "prev / curr / nextNode reverse",
    x: 196,
    y: 212,
    variant: "answer",
  },
  {
    id: "floyd",
    label: "Fast & slow",
    detail: "2× speed or gap of k",
    x: 420,
    y: 212,
    variant: "answer",
  },
  {
    id: "dummy",
    label: "Dummy / sentinel",
    detail: "Protect head; simplify edges",
    x: 592,
    y: 212,
    variant: "answer",
  },
];

const EDGES: FlowEdge[] = [
  { from: "start", to: "structure", label: "mutate links" },
  { from: "start", to: "measure", label: "read / detect" },
  { from: "start", to: "combine", label: "compose patterns" },
  { from: "structure", to: "prev", label: "insert/delete" },
  { from: "structure", to: "three", label: "reverse" },
  { from: "measure", to: "floyd", label: "length unknown" },
  { from: "structure", to: "dummy", label: "head changes" },
];

export default function LinkedListQuickRef() {
  return (
    <InteractivePatternPicker
      nodes={NODES}
      edges={EDGES}
      markerId="ll-arrowhead"
      ariaLabel="Linked list pattern decision flowchart"
      getNodeWidth={(node) => (node.variant === "start" ? 210 : 120)}
    />
  );
}
