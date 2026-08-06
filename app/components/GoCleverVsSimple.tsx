"use client";

import { useState } from "react";

interface Pair {
  id: string;
  title: string;
  clever: string;
  simple: string;
  note: string;
}

const PAIRS: Pair[] = [
  {
    id: "errors",
    title: "Handling failure",
    clever: `result := must(loadConfig())
// panics somewhere upstream if anything fails`,
    simple: `cfg, err := loadConfig()
if err != nil {
    return fmt.Errorf("load config: %w", err)
}`,
    note: "The simple version makes the failure path local and searchable.",
  },
  {
    id: "interfaces",
    title: "Depending on behavior",
    clever: `// Huge interface “for flexibility”
type Store interface {
    Get, Put, Delete, List, Watch, Migrate, ...
}`,
    simple: `type UserRepo interface {
    ByID(ctx context.Context, id string) (User, error)
}`,
    note: "Small interfaces are easier to fake in tests and easier to satisfy in production.",
  },
  {
    id: "flow",
    title: "Transforming data",
    clever: `return Map(Filter(Reduce(items, ...), pred), fn)`,
    simple: `var out []Item
for _, item := range items {
    if !pred(item) {
        continue
    }
    out = append(out, fn(item))
}
return out`,
    note: "The loop is longer. It is also obvious to every Go reader without a tour of helpers.",
  },
];

export default function GoCleverVsSimple() {
  const [activeId, setActiveId] = useState(PAIRS[0].id);
  const active = PAIRS.find((p) => p.id === activeId) ?? PAIRS[0];

  return (
    <div className="my-10 border-t border-[var(--line)] pt-10">
      <p className="text-sm text-[var(--muted)]">Side by side</p>
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

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--bg-2)] p-4">
          <p className="text-sm text-[var(--muted)]">Clever</p>
          <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-[var(--fg-2)] sm:text-sm">
            {active.clever}
          </pre>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--bg-2)] p-4">
          <p className="text-sm text-[var(--muted)]">Simple</p>
          <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-[var(--fg)] sm:text-sm">
            {active.simple}
          </pre>
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--fg-2)]">
        {active.note}
      </p>
    </div>
  );
}
