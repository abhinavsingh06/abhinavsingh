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
    id: "why-boring",
    question: "Why does Go value boring code?",
    shortAnswer:
      "Because most of the cost shows up after the clever part was written — in review, on-call, and the next change.",
    argument:
      "Boring code is predictable. Predictable code is reviewable by people who did not invent it. Go's syntax, gofmt, and small feature set all push teams toward the same shape of program so attention stays on the problem domain.",
    counter:
      "Boring can become dogmatic. Sometimes a sharp abstraction removes real duplication. Sometimes performance needs an unusual structure. “Always boring” can calcify into fear of any design.",
    resolution:
      "Go's bet is default boring, exception rare. Earn complexity with a measured win — fewer bugs, clearer ownership, or proven speed — not with taste alone.",
  },
  {
    id: "scales-better",
    question: "Could boring code scale better than smart code?",
    shortAnswer:
      "Yes — if “scale” means more people, more time, and more change, not just more QPS.",
    argument:
      "Smart code often scales the author's insight, not the team's throughput. As headcount and churn rise, the limiting factor becomes how fast strangers can safely modify the system. Uniform, explicit, shallow code wins that race.",
    counter:
      "Some problems are inherently hard. A naive design can create distributed complexity that is worse than one well-placed clever core. Throughput and latency sometimes demand sophistication.",
    resolution:
      "Separate product scale from organizational scale. Clever kernels can exist behind boring interfaces. What usually fails is cleverness smeared across every package — a dialect only the original authors speak.",
  },
];

export default function GoBoringCodeDebate() {
  const [activeId, setActiveId] = useState(DEBATES[0].id);
  const active = DEBATES.find((d) => d.id === activeId) ?? DEBATES[0];

  return (
    <div className="my-10 border-t border-[var(--line)] pt-10">
      <p className="text-sm text-[var(--muted)]">Two questions worth sitting with</p>
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

      <article className="mt-8 max-w-2xl">
        <h3 className="font-display text-2xl text-[var(--fg)] sm:text-3xl">
          {active.question}
        </h3>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--fg)] sm:text-base">
          {active.shortAnswer}
        </p>
        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
          <p>
            <span className="text-[var(--fg)]">The case for yes. </span>
            {active.argument}
          </p>
          <p>
            <span className="text-[var(--fg)]">The honest pushback. </span>
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
