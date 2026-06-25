"use client";

import InteractivePatternPicker, {
  type FlowEdge,
  type FlowNode,
} from "./InteractivePatternPicker";

const NODES: FlowNode[] = [
  {
    id: "start",
    label: "Two Pointers Problem",
    detail: "Array or string with two indices?",
    x: 328,
    y: 16,
    variant: "start",
  },
  {
    id: "opposite",
    label: "Opposite ends",
    detail: "left = 0, right = n−1 → move inward",
    x: 164,
    y: 100,
    variant: "answer",
  },
  {
    id: "parallel",
    label: "Parallel scan",
    detail: "i, j start at 0 → move forward on 1–2 inputs",
    x: 492,
    y: 100,
    variant: "answer",
  },
  {
    id: "palindrome",
    label: "Compare pairs",
    detail: "Match s[left] vs s[right], shrink both sides",
    x: 64,
    y: 204,
    variant: "answer",
  },
  {
    id: "two-sum",
    label: "Sorted two sum",
    detail: "Sum too big → right--; too small → left++",
    x: 196,
    y: 204,
    variant: "answer",
  },
  {
    id: "container",
    label: "Maximize metric",
    detail: "Move the shorter height pointer inward",
    x: 328,
    y: 204,
    variant: "answer",
  },
  {
    id: "merge",
    label: "Merge sorted",
    detail: "Take smaller of arr1[i], arr2[j]",
    x: 460,
    y: 204,
    variant: "answer",
  },
  {
    id: "subsequence",
    label: "Subsequence match",
    detail: "Match → i++; always j++ on t",
    x: 592,
    y: 204,
    variant: "answer",
  },
];

const EDGES: FlowEdge[] = [
  { from: "start", to: "opposite", label: "pair from ends" },
  { from: "start", to: "parallel", label: "two sequences" },
  { from: "opposite", to: "palindrome", label: "equal pairs" },
  { from: "opposite", to: "two-sum", label: "sorted + target" },
  { from: "opposite", to: "container", label: "max area/volume" },
  { from: "parallel", to: "merge", label: "both sorted" },
  { from: "parallel", to: "subsequence", label: "pattern in text" },
];

export default function TwoPointersQuickRef() {
  return (
    <InteractivePatternPicker
      nodes={NODES}
      edges={EDGES}
      markerId="tp-arrowhead"
      ariaLabel="Two pointers pattern decision flowchart"
      getNodeWidth={(node) => (node.variant === "start" ? 200 : 120)}
    />
  );
}
