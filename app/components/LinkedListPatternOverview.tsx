"use client";

import BlogDataTable from "./BlogDataTable";

const COLUMNS = [
  { id: "pattern", label: "Pattern", emphasis: true },
  { id: "pointers", label: "Pointers", mono: true },
  { id: "when", label: "When to use" },
];

const ROWS = [
  {
    id: "traverse",
    cells: {
      pattern: "Traversal",
      pointers: "curr = curr.next",
      when: "Sum, length, convert — never lose head",
    },
  },
  {
    id: "insert-delete",
    cells: {
      pattern: "Insert / delete",
      pointers: "prev + newNode",
      when: "O(1) if you already hold the node before i",
    },
    highlight: true,
  },
  {
    id: "fast-slow",
    cells: {
      pattern: "Fast & slow",
      pointers: "fast = fast.next.next",
      when: "Middle, cycle detect, k-th from end",
    },
  },
  {
    id: "reverse",
    cells: {
      pattern: "Reverse",
      pointers: "prev, curr, nextNode",
      when: "Full reverse or reverse a sublist / second half",
    },
  },
  {
    id: "swap",
    cells: {
      pattern: "Pointer choreography",
      pointers: "dummy + prev",
      when: "Swap pairs, reorder, splice without arrays",
    },
  },
];

export default function LinkedListPatternOverview() {
  return <BlogDataTable columns={COLUMNS} rows={ROWS} />;
}
