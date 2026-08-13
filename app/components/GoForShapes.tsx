"use client";

import { useState } from "react";

interface Pair {
  id: string;
  title: string;
  leftLabel: string;
  rightLabel: string;
  left: string;
  right: string;
  note: string;
}

const PAIRS: Pair[] = [
  {
    id: "while",
    title: "while → for",
    leftLabel: "Other languages",
    rightLabel: "Go",
    left: `while (err == nil) {
    err = step()
}`,
    right: `for err == nil {
    err = step()
}`,
    note: "Drop the init and the post. Keep the condition. That’s while — spelled for.",
  },
  {
    id: "forever",
    title: "forever",
    leftLabel: "Other languages",
    rightLabel: "Go",
    left: `while (true) {
    serve()
}

for (;;) {
    serve()
}`,
    right: `for {
    serve()
}`,
    note: "Empty for is an infinite loop. Break (or return) when you’re done. No true, no ;;.",
  },
  {
    id: "range",
    title: "foreach → range",
    leftLabel: "Other languages",
    rightLabel: "Go",
    left: `for (const item of items) {
    use(item)
}`,
    right: `for _, item := range items {
    use(item)
}`,
    note: "range gives index and value. Don’t need the index? Name it _ . Don’t need the value? Omit it: for i := range items.",
  },
  {
    id: "c-style",
    title: "C-style for",
    leftLabel: "Three parts",
    rightLabel: "Same idea in Go",
    left: `for (int i = 0; i < n; i++) {
    use(i)
}`,
    right: `for i := 0; i < n; i++ {
    use(i)
}`,
    note: "Init, condition, post. Parentheses gone. Braces stay. i is scoped to the loop.",
  },
];

export default function GoForShapes() {
  const [activeId, setActiveId] = useState(PAIRS[0].id);
  const active = PAIRS.find((p) => p.id === activeId) ?? PAIRS[0];

  return (
    <div className="my-10 min-w-0 max-w-full border-t border-[var(--line)] pt-10">
      <p className="text-sm text-[var(--muted)]">Compare</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {PAIRS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveId(p.id)}
            className={[
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              activeId === p.id
                ? "border-[var(--fg)] text-[var(--fg)]"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
            ].join(" ")}>
            {p.title}
          </button>
        ))}
      </div>

      <div className="mt-6 grid min-w-0 max-w-full gap-4 lg:grid-cols-2">
        <div className="min-w-0 max-w-full rounded-lg border border-[var(--line)] bg-[var(--bg-2)] p-4">
          <p className="text-sm text-[var(--muted)]">{active.leftLabel}</p>
          <pre className="mt-3 max-w-full overflow-x-auto font-mono text-xs leading-relaxed text-[var(--fg-2)] sm:text-sm">
            {active.left}
          </pre>
        </div>
        <div className="min-w-0 max-w-full rounded-lg border border-[var(--line)] bg-[var(--bg-2)] p-4">
          <p className="text-sm text-[var(--muted)]">{active.rightLabel}</p>
          <pre className="mt-3 max-w-full overflow-x-auto font-mono text-xs leading-relaxed text-[var(--fg)] sm:text-sm">
            {active.right}
          </pre>
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--fg-2)]">
        {active.note}
      </p>
    </div>
  );
}
