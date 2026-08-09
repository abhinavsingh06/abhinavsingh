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
    id: "var-vs-short",
    title: "var vs :=",
    leftLabel: "var — clear and steady",
    rightLabel: ":= — quick and local",
    left: `var total int
total = sum(items)

var name string = "Ada"`,
    right: `total := sum(items)
name := "Ada"`,
    note: "Have a value ready inside a function? Use :=. Want the zero first, or a package-level name? Use var.",
  },
  {
    id: "zero-vs-nil",
    title: "Empty vs missing",
    leftLabel: "Fuzzy",
    rightLabel: "Clear",
    left: `var retries int
// is 0 “unset” or “zero retries”?`,
    right: `retries, ok := cfg["retries"]
if !ok {
    retries = 3 // real default
}`,
    note: "If zero is a real answer in your app, don’t also use it for “I never set this.” Ask the map (or use a pointer) so missing has its own voice.",
  },
  {
    id: "const-vs-var",
    title: "const vs var",
    leftLabel: "const — frozen",
    rightLabel: "var — can change",
    left: `const MaxWorkers = 8
// fixed when you build
// cannot change, no &`,
    right: `var maxWorkers = 8
// can change later
// can take the address`,
    note: "Never changes? Prefer const. Might change or need a pointer? That’s a variable.",
  },
];

export default function GoDeclCompare() {
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
