"use client";

import { useState } from "react";

interface TypeRow {
  id: string;
  type: string;
  example: string;
  meaning: string;
  trap: string;
}

const ROWS: TypeRow[] = [
  {
    id: "number",
    type: "number",
    example: "42, 3.14, NaN",
    meaning: "All numbers are floats under the hood. Math just works until you hit precision limits.",
    trap: "0.1 + 0.2 !== 0.3. Use integers (cents) or a decimal library when money matters.",
  },
  {
    id: "string",
    type: "string",
    example: '"hi", `hello ${name}`',
    meaning: "Text in single quotes, double quotes, or backticks for templates.",
    trap: "Strings are immutable — methods return new strings. += on huge strings in a loop can get slow.",
  },
  {
    id: "boolean",
    type: "boolean",
    example: "true, false",
    meaning: "Yes or no. Often comes from comparisons: age >= 18.",
    trap: "Truthy/falsy is wider than true/false — empty string is falsy, \"0\" is truthy. Be explicit when it matters.",
  },
  {
    id: "undefined",
    type: "undefined",
    example: "let x; missing property",
    meaning: "JavaScript’s default for “never assigned” or “not there.”",
    trap: "A function with no return gives undefined. Optional params you skip are undefined — not null.",
  },
  {
    id: "null",
    type: "null",
    example: "let user = null",
    meaning: "You chose “no value” on purpose — cleared a field, empty slot in data.",
    trap: "typeof null === \"object\" — a famous bug from 1995. Use === null when you mean null.",
  },
  {
    id: "object",
    type: "object",
    example: "{ id: 1 }, [1, 2], new Date()",
    meaning: "Collections and structured data. Arrays and functions are objects too.",
    trap: "Objects are compared by reference — {} !== {}. Copy with spread or structuredClone when you need a clone.",
  },
  {
    id: "symbol",
    type: "symbol",
    example: "Symbol('id')",
    meaning: "Unique keys — useful for hiding metadata on objects without name clashes.",
    trap: "Rare in day-to-day app code. Know it exists; reach for it when object keys must be guaranteed unique.",
  },
  {
    id: "bigint",
    type: "bigint",
    example: "9007199254740991n",
    meaning: "Integers bigger than Number.MAX_SAFE_INTEGER.",
    trap: "Cannot mix bigint and number without explicit conversion. JSON.stringify throws on bigint.",
  },
];

export default function JsTypesLab() {
  const [activeId, setActiveId] = useState(ROWS[0].id);
  const active = ROWS.find((r) => r.id === activeId) ?? ROWS[0];

  return (
    <div className="my-10 min-w-0 max-w-full border-t border-[var(--line)] pt-10">
      <p className="text-sm text-[var(--muted)]">Primitive and object types</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {ROWS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setActiveId(r.id)}
            className={[
              "rounded-md border px-3 py-1.5 font-mono text-sm transition-colors",
              activeId === r.id
                ? "border-[var(--fg)] text-[var(--fg)]"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
            ].join(" ")}>
            {r.type}
          </button>
        ))}
      </div>

      <article className="mt-8 max-w-2xl min-w-0">
        <h3 className="font-display text-2xl text-[var(--fg)] sm:text-3xl">
          <code className="font-mono text-[var(--accent)]">{active.type}</code>
        </h3>
        <p className="mt-4 font-mono text-sm text-[var(--muted)]">
          {active.example}
        </p>
        <p className="mt-6 text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
          {active.meaning}
        </p>
        <p className="mt-6 border-t border-[var(--line)] pt-6 text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
          <span className="text-[var(--fg)]">Watch out. </span>
          {active.trap}
        </p>
      </article>
    </div>
  );
}
