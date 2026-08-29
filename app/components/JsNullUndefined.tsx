"use client";

import { useState } from "react";

interface Side {
  id: string;
  label: string;
  definition: string;
  useWhen: string;
  example: string;
}

const SIDES: Side[] = [
  {
    id: "undefined",
    label: "undefined",
    definition: "The language never got a value — or the property does not exist.",
    useWhen: "Default for `let x`, missing object keys, functions with no return.",
    example: `let total        // undefined
const cfg = {}
cfg.port           // undefined`,
  },
  {
    id: "null",
    label: "null",
    definition: "You explicitly set “nothing here” — on purpose.",
    useWhen: "Cleared a form field, empty database column, placeholder in an API.",
    example: `let selected = null
user.avatar = null // removed on purpose`,
  },
];

export default function JsNullUndefined() {
  const [activeId, setActiveId] = useState(SIDES[0].id);
  const active = SIDES.find((s) => s.id === activeId) ?? SIDES[0];

  return (
    <div className="my-10 min-w-0 max-w-full border-t border-[var(--line)] pt-10">
      <p className="text-sm text-[var(--muted)]">null vs undefined</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {SIDES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveId(s.id)}
            className={[
              "rounded-md border px-3 py-1.5 font-mono text-sm transition-colors",
              activeId === s.id
                ? "border-[var(--fg)] text-[var(--fg)]"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
            ].join(" ")}>
            {s.label}
          </button>
        ))}
      </div>

      <article className="mt-8 max-w-2xl min-w-0">
        <h3 className="font-display text-2xl text-[var(--fg)] sm:text-3xl">
          <code className="font-mono text-[var(--accent)]">{active.label}</code>
        </h3>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
          {active.definition}
        </p>
        <p className="mt-6 text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
          <span className="text-[var(--fg)]">Use when. </span>
          {active.useWhen}
        </p>
        <div className="mt-6 min-w-0 max-w-full overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--bg-2)] p-4">
          <pre className="max-w-full overflow-x-auto font-mono text-xs leading-relaxed text-[var(--fg)] sm:text-sm">
            {active.example}
          </pre>
        </div>
        <p className="mt-6 border-t border-[var(--line)] pt-6 text-[15px] leading-relaxed text-[var(--fg-2)]">
          <span className="text-[var(--fg)]">Sticky rule. </span>
          Both are falsy, but they mean different things. Use{" "}
          <code className="font-mono text-[var(--accent)]">===</code> and be
          explicit in APIs — optional fields as{" "}
          <code className="font-mono text-[var(--accent)]">undefined</code>,
          intentional emptiness as{" "}
          <code className="font-mono text-[var(--accent)]">null</code>.
        </p>
      </article>
    </div>
  );
}
