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
    id: "why-value",
    question: "Why does every variable already have a value?",
    shortAnswer:
      "Because “I forgot to set this” is a classic bug — and Go won’t leave that trap in the language.",
    argument:
      "In older languages like C, a new variable can hold random leftover bits from memory. Sometimes it works. Sometimes it explodes. Those bugs are nightmare fuel. Go’s fix is simple: create a variable, get a known starter value. Always.",
    counter:
      "A known starter can still be the wrong answer for your problem. If 0 means both “unset” and “zero retries,” you’ve made a new mess — just a quieter one.",
    resolution:
      "Zeros kill random garbage. They don’t kill fuzzy meaning. Use the zero when empty is a great start. When “empty” and “missing” differ, say missing clearly — with ok, a pointer, or a small status type.",
  },
  {
    id: "prevent-bugs",
    question: "How does this prevent bugs?",
    shortAnswer:
      "It deletes one whole failure mode: reading memory nobody meant to write.",
    argument:
      "You stop asking “did anyone initialize this?” The language did. Teams share one mental model: var x int means 0. Fewer mystery states → fewer “works on my machine” ghosts. Reviewers argue about behavior, not whether the variable was born empty.",
    counter:
      "Nil maps still panic on write. Nil pointers still bite. “Everything has a zero” is not “everything is safe.” Blind trust creates new outages.",
    resolution:
      "Learn the tiny table: numbers and strings are gentle; maps and pointers need a second thought. Predictable defaults + make when you need a working map. That’s the whole game.",
  },
];

export default function GoUninitDebate() {
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
