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
    id: "if",
    name: "if",
    claim:
      "if is a fork in the road. Go keeps it boring: no parentheses, braces required, and you can declare a value right in the condition.",
    surface:
      "if err != nil { return err }. Optional init: if v, err := load(); err != nil { ... }. There is no ternary ? : — write a normal if.",
    deeper:
      "Putting a short declaration in the if keeps err and v close to the check. That is the Go style: fail fast, keep the happy path unindented.",
    gotcha:
      "A variable declared in if v, err := ... lives only in that if/else. Need it later? Declare it above. Also: braces are mandatory even for one line. That’s a feature — it stops dangling-else bugs.",
    example: `if n := len(items); n == 0 {
    return errors.New("empty")
}
if err != nil {
    return err
}`,
  },
  {
    id: "switch",
    name: "switch",
    claim:
      "switch is if’s cleaner cousin. Cases don’t fall through. You can switch on values — or on true/false conditions with no expression at all.",
    surface:
      "switch x { case 1: ... case 2, 3: ... default: ... }. Or switch { case n < 0: ... case n == 0: ... }. Need the old C fallthrough? Write fallthrough on purpose.",
    deeper:
      "No accidental fall-through means you can read a case in isolation. A tagless switch is often clearer than a ladder of else if. Type switches (switch x.(type)) belong later — same idea, types instead of values.",
    gotcha:
      "Cases are not scopes by default in a way that surprises people coming from if: one switch can share variables across cases. And fallthrough jumps to the next case body without re-checking its condition.",
    example: `switch {
case n < 0:
    return "negative"
case n == 0:
    return "zero"
default:
    return "positive"
}`,
  },
  {
    id: "for",
    name: "for",
    claim:
      "Go has one loop word: for. While, do-while, and foreach are all spelled for. Fewer shapes. Same muscle memory.",
    surface:
      "for i := 0; i < n; i++ { } · for i, v := range items { } · for running { } · for { } forever. Drop the parts you don’t need — that’s your while.",
    deeper:
      "while (x) in C is for x in Go. An infinite loop is for { }. range walks slices, maps, strings, channels. One keyword means you never hunt for the “right” loop — you fill in the blanks.",
    gotcha:
      "range on a map is in random order. range on a string yields runes, not bytes. The classic for i := range s copies the index only if you write for i := range — the value is optional. And for i, v := range slice copies v; mutating v does not change the slice.",
    example: `for i := 0; i < n; i++ {
    // C-style
}
for _, item := range items {
    // each element
}
for err == nil {
    err = step() // while
}`,
  },
  {
    id: "break-continue",
    name: "break & continue",
    claim:
      "continue skips to the next round. break leaves the loop (or switch) you’re in. Small words, big control — as long as you know which block they mean.",
    surface:
      "continue: “this item is done, next please.” break: “we’re finished with this loop.” Inside a switch, break leaves the switch, not the for around it.",
    deeper:
      "That’s why nested loops sometimes need labels. A bare break in a switch-inside-for only ends the switch. If you meant to leave the loop, say so with a label — or restructure so you don’t need the trick.",
    gotcha:
      "continue in a range loop still advances to the next element — you don’t have to increment anything. Forgetting that switch has its own break is the #1 nested-loop surprise.",
    example: `for _, n := range nums {
    if n < 0 {
        continue // skip
    }
    if n == 0 {
        break // stop the loop
    }
    use(n)
}`,
  },
  {
    id: "labels",
    name: "Labels",
    claim:
      "A label is a name on a loop (or switch) so break and continue can aim at it. Rare. Loud. Use when nested loops would otherwise lie.",
    surface:
      "Outer: for { for { break Outer } }. The label sits above the loop. break Outer leaves both loops. continue Outer starts the next Outer round.",
    deeper:
      "Labels are not goto in disguise for everyday code. Go has goto, but the honest use of labels is “break this outer loop.” If you need them often, the design is probably too nested.",
    gotcha:
      "A label must be on a loop or switch for break/continue. Unused labels are a compile error. Don’t sprinkle them “just in case” — they make the happy path harder to see.",
    example: `Search:
for _, row := range grid {
    for _, cell := range row {
        if cell == target {
            break Search
        }
    }
}`,
  },
  {
    id: "defer",
    name: "defer",
    claim:
      "defer says “run this when the function returns” — success, error, or panic. It’s how Go keeps cleanup next to setup.",
    surface:
      "f, err := os.Open(path); defer f.Close(). Defers stack up and run last-in, first-out when the function exits.",
    deeper:
      "You don’t need try/finally. Open a file, defer the close, then write the real logic. The close still runs if you return early. That’s the whole pitch: cleanup is a promise, not a scavenger hunt.",
    gotcha:
      "defer runs at function end, not block end. In a loop, defer f.Close() piles up until the function returns — often wrong. Arguments are evaluated now, the call happens later. Prefer defer func() { ... }() when the value should be read at exit (named result params, unlocking with a condition).",
    example: `f, err := os.Open(path)
if err != nil {
    return err
}
defer f.Close()

return scan(f)`,
  },
];

export default function GoControlFlowTopics() {
  const [activeId, setActiveId] = useState(TOPICS[0].id);
  const active = TOPICS.find((t) => t.id === activeId) ?? TOPICS[0];
  const index = TOPICS.findIndex((t) => t.id === activeId);

  return (
    <div className="my-10 min-w-0 max-w-full border-t border-[var(--line)] pt-10">
      <div className="grid min-w-0 max-w-full gap-10 lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] lg:gap-14">
        <nav
          aria-label="Go control flow topics"
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
