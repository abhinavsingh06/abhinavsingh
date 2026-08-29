"use client";

import { useState } from "react";

interface Keyword {
  id: string;
  name: string;
  scope: string;
  reassign: string;
  when: string;
  trap: string;
  example: string;
}

const KEYWORDS: Keyword[] = [
  {
    id: "const",
    name: "const",
    scope: "Block — only inside `{ }` where it was declared",
    reassign: "No — the binding cannot point somewhere else",
    when: "Default choice. Names that should not be reassigned.",
    trap: "const arr = [] — you cannot do arr = [1], but arr.push(1) still works. const freezes the binding, not deep immutability.",
    example: `const maxRetries = 3
const items = []
items.push("a") // ok`,
  },
  {
    id: "let",
    name: "let",
    scope: "Block — same as const",
    reassign: "Yes — you can reassign later",
    when: "Counters, loop variables, anything that genuinely changes.",
    trap: "Hoisting still happens — let exists in a “temporal dead zone” until its line runs. Using it early throws.",
    example: `let count = 0
count += 1

for (let i = 0; i < n; i++) {
  // i is fresh each loop
}`,
  },
  {
    id: "var",
    name: "var",
    scope: "Function — visible across the whole function",
    reassign: "Yes",
    when: "Legacy code only. Modern style avoids var.",
    trap: "Leaks out of if/for blocks. Multiple vars in one function share one name — easy to overwrite by accident.",
    example: `function demo() {
  if (true) {
    var x = 1
  }
  console.log(x) // 1 — not block scoped
}`,
  },
];

export default function JsDeclCompare() {
  const [activeId, setActiveId] = useState(KEYWORDS[0].id);
  const active = KEYWORDS.find((k) => k.id === activeId) ?? KEYWORDS[0];

  return (
    <div className="my-10 min-w-0 max-w-full border-t border-[var(--line)] pt-10">
      <p className="text-sm text-[var(--muted)]">Three ways to declare</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {KEYWORDS.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setActiveId(k.id)}
            className={[
              "rounded-md border px-3 py-1.5 font-mono text-sm transition-colors",
              activeId === k.id
                ? "border-[var(--fg)] text-[var(--fg)]"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
            ].join(" ")}>
            {k.name}
          </button>
        ))}
      </div>

      <article className="mt-8 max-w-2xl min-w-0">
        <h3 className="font-display text-2xl text-[var(--fg)] sm:text-3xl">
          <code className="font-mono text-[var(--accent)]">{active.name}</code>
        </h3>
        <dl className="mt-6 space-y-4 text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
          <div>
            <dt className="font-mono-xs text-[var(--muted)]">Scope</dt>
            <dd className="mt-1 text-[var(--fg)]">{active.scope}</dd>
          </div>
          <div>
            <dt className="font-mono-xs text-[var(--muted)]">Reassign?</dt>
            <dd className="mt-1">{active.reassign}</dd>
          </div>
          <div>
            <dt className="font-mono-xs text-[var(--muted)]">Reach for it when</dt>
            <dd className="mt-1">{active.when}</dd>
          </div>
        </dl>
        <div className="mt-6 min-w-0 max-w-full overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--bg-2)] p-4">
          <pre className="max-w-full overflow-x-auto font-mono text-xs leading-relaxed text-[var(--fg)] sm:text-sm">
            {active.example}
          </pre>
        </div>
        <p className="mt-6 border-t border-[var(--line)] pt-6 text-[15px] leading-relaxed text-[var(--fg-2)]">
          <span className="text-[var(--fg)]">Watch out. </span>
          {active.trap}
        </p>
      </article>
    </div>
  );
}
