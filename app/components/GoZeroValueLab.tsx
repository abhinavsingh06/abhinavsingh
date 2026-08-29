"use client";

import { useState } from "react";

interface ZeroRow {
  id: string;
  type: string;
  zero: string;
  meaning: string;
  safeUse: string;
  trap: string;
}

const ROWS: ZeroRow[] = [
  {
    id: "int",
    type: "int / float64",
    zero: "0 / 0.0",
    meaning: "You start at nothing to add. Perfect for counters and totals.",
    safeUse: "Just write var sum int and start adding. You already begin at 0.",
    trap: "Sometimes 0 means “none yet,” sometimes it means “really zero.” If both matter, don’t guess — use a flag or a pointer.",
  },
  {
    id: "bool",
    type: "bool",
    zero: "false",
    meaning: "The light starts off. Something must turn it on.",
    safeUse:
      "Feature flags, “done yet?”, anything that should stay off by default.",
    trap: "false is not “I don’t know.” Need yes / no / unknown? Use a pointer or a small custom type.",
  },
  {
    id: "string",
    type: "string",
    zero: `""`,
    meaning: "An empty string — still a real string. Not null. Not broken.",
    safeUse: "You can len it, add to it, loop it. No warm-up needed.",
    trap: '"" can mean empty name or “no name provided.” Those are different stories — tell them apart in code.',
  },
  {
    id: "pointer",
    type: "pointer / interface",
    zero: "nil",
    meaning: "Points at nothing. Like a blank “see also” line.",
    safeUse: "Optional fields. Check before you follow the arrow (*p).",
    trap: "An interface can hold a typed nil and still look “not nil.” Weird, common, and worth a second look.",
  },
  {
    id: "slice",
    type: "slice",
    zero: "nil",
    meaning: "No elements yet. For many reads, it behaves like an empty list.",
    safeUse: "range and append usually work. You can grow it from nil.",
    trap: "JSON: nil becomes null, empty slice becomes []. APIs care which one you send.",
  },
  {
    id: "map",
    type: "map",
    zero: "nil",
    meaning:
      "Like a closed notebook: you can try to read a page, but you can’t write yet.",
    safeUse:
      "Lookups are fine. Missing keys just give the zero of the value type.",
    trap: "Write to a nil map → panic. Open it first: make(map[string]int) or a map literal.",
  },
  {
    id: "struct",
    type: "struct",
    zero: "field zeros",
    meaning:
      "Every field gets its own starter value. The whole struct is defined.",
    safeUse:
      "Aim for types that work with var t T — Mutex and Buffer do this well.",
    trap: "Pointer fields inside are still nil. “All zeros” is not the same as “fully set up for business logic.”",
  },
];

export default function GoZeroValueLab() {
  const [activeId, setActiveId] = useState(ROWS[0].id);
  const active = ROWS.find((r) => r.id === activeId) ?? ROWS[0];

  return (
    <div className="my-10 min-w-0 max-w-full border-t border-[var(--line)] pt-10">
      <p className="text-sm text-[var(--muted)]">By type</p>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
        What Go puts in the box first — and whether that starter is safe to use
        right away.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {ROWS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setActiveId(r.id)}
            className={[
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              activeId === r.id
                ? "border-[var(--fg)] text-[var(--fg)]"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
            ].join(" ")}>
            {r.type}
          </button>
        ))}
      </div>

      <article className="mt-8 max-w-2xl min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-2xl text-[var(--fg)] sm:text-3xl">
            {active.type}
          </h3>
          <code className="font-mono text-sm text-[var(--accent)]">
            → {active.zero}
          </code>
        </div>
        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
          <p>
            <span className="text-[var(--fg)]">Picture it. </span>
            {active.meaning}
          </p>
          <p>
            <span className="text-[var(--fg)]">Safe to use. </span>
            {active.safeUse}
          </p>
          <p className="border-t border-[var(--line)] pt-6">
            <span className="text-[var(--fg)]">Watch out. </span>
            {active.trap}
          </p>
        </div>
      </article>
    </div>
  );
}
