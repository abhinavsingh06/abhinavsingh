"use client";

import { useState } from "react";

interface OmittedFeature {
  id: string;
  name: string;
  temptation: string;
  whyNot: string;
  goWay: string;
  takeaway: string;
  caveat: string;
}

const FEATURES: OmittedFeature[] = [
  {
    id: "inheritance",
    name: "Inheritance",
    temptation:
      "Reuse behavior by extending base classes the way C++ and Java encourage.",
    whyNot:
      "Deep hierarchies get brittle. Shared mutable state in parents is hard to reason about when hundreds of people touch the same tree.",
    goWay:
      "Compose structs and depend on small interfaces. You embed when you need fields; you satisfy an interface just by having the methods.",
    takeaway:
      "Prefer has-a over is-a. Start from the behavior you need, then name an interface for it. Implicit interfaces decouple packages without a shared base type — strong for API boundaries, weaker for “find every subclass” navigation.",
    caveat:
      "Composition still needs clear ownership. Over-embedding can surprise readers as much as inheritance did.",
  },
  {
    id: "generics",
    name: "Generics (at first)",
    temptation:
      "Write one type-safe container for any T and avoid interface{} casts.",
    whyNot:
      "Early Go wanted a language you could finish learning, and a compiler that stayed fast. Generics add real complexity to both.",
    goWay:
      "For years: interfaces and occasional code generation. Since 1.18: a constrained generics design for the cases that hurt most.",
    takeaway:
      "Learn slices, maps, and interfaces first. Reach for generics when duplication is real — not speculative. Delaying them was a product bet: ship something teams can absorb, then add power carefully.",
    caveat:
      "Go has generics now. The lesson is sequencing complexity — not “generics forever forbidden.”",
  },
  {
    id: "exceptions",
    name: "Exceptions",
    temptation: "Throw and catch so the happy path stays visually clean.",
    whyNot:
      "Exceptions hide control flow. Failures become easy to ignore, and it is unclear where they are handled.",
    goWay:
      "Errors are values. Check them near the call. Panic and recover stay reserved for true crashes, not business logic.",
    takeaway:
      "Returning an error is normal. Explicit errors push API design into the open: wrap with context, define sentinels, keep failure modes in the signature.",
    caveat:
      "Yes, it gets verbose. Helpers and consistent wrapping help — inventing silent exceptions does not.",
  },
  {
    id: "operators",
    name: "Operator overloading",
    temptation:
      "Make a + b work for your types so domain code looks mathematical.",
    whyNot:
      "Readers cannot know what + costs or means. Overloading grows private dialects and hides expensive work.",
    goWay:
      "Name the operation: Add, Append, Equal. What you see is what runs.",
    takeaway:
      "Clarity beats clever syntax when you are reading an unfamiliar package. In a large org, review cost matters more than local elegance.",
    caveat:
      "Some domains miss operators. Go accepts that tradeoff on purpose.",
  },
  {
    id: "macros",
    name: "Macros",
    temptation:
      "Invent syntax or generate code the way C macros or Lisp macros allow.",
    whyNot:
      "Macros become private languages. Formatters, jump-to-definition, and grepping all get harder.",
    goWay:
      "Prefer plain code. When you need generation, use go generate and check in output humans can read.",
    takeaway:
      "If you generate code, keep the result reviewable. Metaprogramming concentrates expertise — Go pushes power into libraries and conventions instead.",
    caveat:
      "You will write more boilerplate sometimes. That is often cheaper than teaching a second language inside the first.",
  },
];

export default function GoOmittedFeatures() {
  const [activeId, setActiveId] = useState(FEATURES[0].id);
  const active = FEATURES.find((f) => f.id === activeId) ?? FEATURES[0];
  const index = FEATURES.findIndex((f) => f.id === activeId);

  return (
    <div className="my-10 min-w-0 max-w-full border-t border-[var(--line)] pt-10">
      <div className="grid min-w-0 max-w-full gap-10 lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] lg:gap-14">
        <nav
          aria-label="Features Go omitted"
          className="min-w-0 max-w-full lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 text-sm text-[var(--muted)]">Topics</p>
          <ul className="!m-0 flex w-full min-w-0 max-w-full list-none flex-row flex-wrap gap-1 !p-0 lg:flex-col lg:flex-nowrap lg:gap-0">
            {FEATURES.map((f, i) => {
              const isActive = f.id === activeId;
              return (
                <li
                  key={f.id}
                  className="!m-0 shrink-0 before:!hidden lg:shrink">
                  <button
                    type="button"
                    onClick={() => setActiveId(f.id)}
                    className={[
                      "w-full rounded-md px-3 py-2 text-left text-sm transition-colors lg:rounded-none lg:border-l lg:px-0 lg:pl-3 lg:py-2.5",
                      isActive
                        ? "bg-[var(--bg-2)] text-[var(--fg)] lg:border-[var(--fg)] lg:bg-transparent"
                        : "text-[var(--muted)] hover:text-[var(--fg-2)] lg:border-transparent",
                    ].join(" ")}>
                    <span className="mr-2 tabular-nums text-[var(--muted)] lg:hidden">
                      {i + 1}.
                    </span>
                    {f.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <article className="min-w-0">
          <p className="text-sm text-[var(--muted)]">
            {index + 1} of {FEATURES.length}
          </p>
          <h3 className="mt-2 font-display text-2xl text-[var(--fg)] sm:text-3xl">
            {active.name}
          </h3>

          <div className="mt-8 space-y-8 text-[15px] leading-relaxed sm:text-base">
            <p className="text-[var(--fg-2)]">
              <span className="text-[var(--fg)]">What people wanted. </span>
              {active.temptation}
            </p>
            <p className="text-[var(--fg-2)]">
              <span className="text-[var(--fg)]">Why Go said no. </span>
              {active.whyNot}
            </p>
            <p className="text-[var(--fg-2)]">
              <span className="text-[var(--fg)]">What you do instead. </span>
              {active.goWay}
            </p>
            <p className="border-t border-[var(--line)] pt-8 text-[var(--fg-2)]">
              {active.takeaway}
            </p>
            <p className="text-sm text-[var(--muted)]">{active.caveat}</p>
          </div>

          <div className="mt-10 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setActiveId(FEATURES[index - 1].id)}
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)] disabled:opacity-30">
              ← Previous
            </button>
            <button
              type="button"
              disabled={index === FEATURES.length - 1}
              onClick={() => setActiveId(FEATURES[index + 1].id)}
              className="text-sm text-[var(--fg-2)] transition-colors hover:text-[var(--fg)] disabled:opacity-30">
              Next topic →
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
