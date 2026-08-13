"use client";

import { useState } from "react";

interface Debate {
  id: string;
  question: string;
  shortAnswer: string;
  argument: string;
  counter: string;
  resolution: string;
}

const DEBATES: Debate[] = [
  {
    id: "why-no-while",
    question: "Why doesn’t Go have while loops?",
    shortAnswer:
      "Because while is just for with the extra parts left blank — and Go would rather teach one loop than three.",
    argument:
      "C-family languages give you while, do-while, for, and often foreach. Each has a slightly different story. Go’s bet: one keyword, optional pieces. Condition only? That’s while. Nothing at all? That’s forever. range? That’s foreach. You learn for once.",
    counter:
      "while (running) reads like English. for running looks like a typo if you grew up with while. One keyword can feel like a costume party where every loop wears the same name.",
    resolution:
      "Readability here is team-scale, not sentence-scale. A codebase with one loop word greps cleanly and onboards faster. The “missing while” is the same design as the missing ternary: fewer ways to say the same thing.",
  },
  {
    id: "one-keyword",
    question: "Does one loop keyword actually prevent bugs?",
    shortAnswer:
      "It prevents dialect. The remaining bugs are about what you loop over — not which keyword you picked.",
    argument:
      "Off-by-one errors still exist. Infinite loops still exist. But you don’t get “I used while when I meant for” debates, or do-while that runs once by accident because someone forgot the condition belongs at the bottom. Less syntax → fewer half-remembered variants.",
    counter:
      "range copies, map order, and defer-in-a-loop still bite. Shrinking the keyword list doesn’t shrink the semantics. A clever for with a buried continue can be as bad as any while.",
    resolution:
      "The win is a smaller menu, not magic safety. Prefer range when you’re walking a collection. Prefer a condition-only for when you’re waiting on a flag. Reach for labels only when nested break would lie. Keep defer next to setup — and out of hot loops.",
  },
];

export default function GoWhileDebate() {
  const [activeId, setActiveId] = useState(DEBATES[0].id);
  const active = DEBATES.find((d) => d.id === activeId) ?? DEBATES[0];

  return (
    <div className="my-10 min-w-0 max-w-full border-t border-[var(--line)] pt-10">
      <p className="text-sm text-[var(--muted)]">Two questions</p>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
        The design choice underneath the syntax.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
        {DEBATES.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setActiveId(d.id)}
            className={[
              "flex-1 rounded-lg border px-4 py-3 text-left text-sm leading-snug transition-colors",
              activeId === d.id
                ? "border-[var(--fg)] text-[var(--fg)]"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
            ].join(" ")}>
            {d.question}
          </button>
        ))}
      </div>

      <article className="mt-8 max-w-2xl min-w-0">
        <h3 className="font-display text-2xl text-[var(--fg)] sm:text-3xl">
          {active.question}
        </h3>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--fg)] sm:text-base">
          {active.shortAnswer}
        </p>
        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
          <p>
            <span className="text-[var(--fg)]">Why it helps. </span>
            {active.argument}
          </p>
          <p>
            <span className="text-[var(--fg)]">But wait. </span>
            {active.counter}
          </p>
          <p className="border-t border-[var(--line)] pt-6 text-[var(--fg)]">
            {active.resolution}
          </p>
        </div>
      </article>
    </div>
  );
}
