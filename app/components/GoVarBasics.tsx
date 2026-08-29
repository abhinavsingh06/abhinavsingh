"use client";

import { useState } from "react";

interface Topic {
  id: string;
  name: string;
  claim: string;
  surface: string;
  deeper: string;
  gotcha: string;
  example: string;
}

const TOPICS: Topic[] = [
  {
    id: "variables",
    name: "Variables",
    claim:
      "A variable is a labeled box. In Go, the box is never empty when you create it — it always starts with something real.",
    surface:
      'Write var count int, or var name = "Ada". If you give a value, Go can often guess the type for you.',
    deeper:
      "In C, a new local can hold leftover junk from memory. In Go, that never happens. Forget to set a number? You still get 0 — not a random crash later.",
    gotcha:
      "A variable at package level lives for the whole program. Keep most variables short-lived inside functions. Shared globals are easy to regret.",
    example: `var count int
var name string = "Ada"
var ready = true`,
  },
  {
    id: "types",
    name: "Types",
    claim:
      "A type is the rulebook for a value. It answers: what is this, and what am I allowed to do with it?",
    surface:
      "Common ones: int, float64, bool, string. Bigger building blocks: slices, maps, structs, pointers.",
    deeper:
      "Go checks types before your program runs. That’s why int and int64 won’t silently mix — you convert on purpose. Types also carry meaning: a Duration is not “just a number.”",
    gotcha:
      "The bare number 1 is flexible. A variable typed as int is not. Once something has a type, Go won’t quietly turn it into another type.",
    example: `var x int = 10
var y int64 = 10
// x = y  // nope — convert first
y = int64(x)`,
  },
  {
    id: "constants",
    name: "Constants",
    claim:
      "A constant is a value baked in at compile time. Think stamp, not sticky note — it can’t change while the program runs.",
    surface:
      "const MaxRetries = 3. Group related ones together. iota is a tiny counter for lists like statuses.",
    deeper:
      "Constants are flexible until you use them. That’s why 2 * 3.14 just works in many places without a pile of casts.",
    gotcha:
      "You can’t take the address of a constant (&MaxRetries fails). And const can’t call a function — the compiler must know the value up front.",
    example: `const (
    StatusOK = iota
    StatusRetry
    StatusFail
)
const Greeting = "hello"`,
  },
  {
    id: "zero-values",
    name: "Zero values",
    claim:
      "Create a variable without setting it, and Go still fills it in. That starter value is the zero value.",
    surface:
      'Numbers → 0. bool → false. string → "". Pointers, slices, maps → nil. Structs → each field gets its own zero.',
    deeper:
      "Zeros aren’t lazy — they’re a feature. A Mutex and a Buffer are usable the moment you declare them. Great APIs ask: does var t T already work?",
    gotcha:
      "Nil slice? You can often range and append. Nil map? Reading is fine — writing panics. “Has a zero” ≠ “safe for every operation.”",
    example: `var n int           // 0
var s string        // ""
var p *Person       // nil
var buf bytes.Buffer // ready to use`,
  },
  {
    id: "short-decl",
    name: "Short declaration",
    claim:
      ":= is the everyday shortcut: create a local and give it a value in one breath. Go figures out the type from the right side.",
    surface:
      "n := 42. name, err := load(). Fast to write. Easy to read inside functions.",
    deeper:
      "Use := when you have a value ready. Use var when you want the zero first, or when the variable lives at package level.",
    gotcha:
      ":= can reuse a name if something else on the left is new. That’s why err often gets “updated.” Inside an if, a new err can hide the outer one — look left before you trust it.",
    example: `func run() error {
    cfg, err := loadConfig()
    if err != nil {
        return err
    }
    n := len(cfg.Items)
    _ = n
    return nil
}`,
  },
];

export default function GoVarBasics() {
  const [activeId, setActiveId] = useState(TOPICS[0].id);
  const active = TOPICS.find((t) => t.id === activeId) ?? TOPICS[0];
  const index = TOPICS.findIndex((t) => t.id === activeId);

  return (
    <div className="my-10 min-w-0 max-w-full border-t border-[var(--line)] pt-10">
      <div className="grid min-w-0 max-w-full gap-10 lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] lg:gap-14">
        <nav
          aria-label="Go variable topics"
          className="min-w-0 max-w-full lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 text-sm text-[var(--muted)]">Topics</p>
          <ul className="!m-0 flex w-full min-w-0 max-w-full list-none flex-row flex-wrap gap-1 !p-0 lg:flex-col lg:flex-nowrap lg:gap-0">
            {TOPICS.map((t, i) => {
              const isActive = t.id === activeId;
              return (
                <li
                  key={t.id}
                  className="!m-0 shrink-0 before:!hidden lg:shrink">
                  <button
                    type="button"
                    onClick={() => setActiveId(t.id)}
                    className={[
                      "w-full rounded-md px-3 py-2 text-left text-sm transition-colors lg:rounded-none lg:border-l lg:px-0 lg:pl-3 lg:py-2.5",
                      isActive
                        ? "bg-[var(--bg-2)] text-[var(--fg)] lg:border-[var(--fg)] lg:bg-transparent"
                        : "text-[var(--muted)] hover:text-[var(--fg-2)] lg:border-transparent",
                    ].join(" ")}>
                    <span className="mr-2 tabular-nums text-[var(--muted)] lg:hidden">
                      {i + 1}.
                    </span>
                    {t.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <article className="min-w-0">
          <p className="text-sm text-[var(--muted)]">
            {index + 1} of {TOPICS.length}
          </p>
          <h3 className="mt-2 font-display text-2xl text-[var(--fg)] sm:text-3xl">
            {active.name}
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--fg)] sm:text-base">
            {active.claim}
          </p>

          <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
            <p>
              <span className="text-[var(--fg)]">How you write it. </span>
              {active.surface}
            </p>
            <p>
              <span className="text-[var(--fg)]">Why it sticks. </span>
              {active.deeper}
            </p>
            <p>
              <span className="text-[var(--fg)]">Don’t get tripped. </span>
              {active.gotcha}
            </p>
          </div>

          <div className="mt-8 min-w-0 max-w-full overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--bg-2)] p-4">
            <p className="text-sm text-[var(--muted)]">Example</p>
            <pre className="mt-3 max-w-full overflow-x-auto font-mono text-xs leading-relaxed text-[var(--fg)] sm:text-sm">
              {active.example}
            </pre>
          </div>

          <div className="mt-10 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setActiveId(TOPICS[index - 1].id)}
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)] disabled:opacity-30">
              ← Previous
            </button>
            <button
              type="button"
              disabled={index === TOPICS.length - 1}
              onClick={() => setActiveId(TOPICS[index + 1].id)}
              className="text-sm text-[var(--fg-2)] transition-colors hover:text-[var(--fg)] disabled:opacity-30">
              Next topic →
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
