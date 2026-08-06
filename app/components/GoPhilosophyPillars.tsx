"use client";

import { useState } from "react";

interface Pillar {
  id: string;
  name: string;
  claim: string;
  cleverTrap: string;
  boringMove: string;
  example: string;
  whyItScales: string;
}

const PILLARS: Pillar[] = [
  {
    id: "readability",
    name: "Readability",
    claim:
      "Code is read far more than it is written. Go optimizes for the next person at 2am — often you, six months later.",
    cleverTrap:
      "Dense one-liners, clever abstractions, and “elegant” indirection that need a guided tour to understand.",
    boringMove:
      "Straight-line logic, obvious names, small functions, and gofmt so style debates die quietly.",
    example:
      "Prefer a plain for loop over a nested map/filter chain when the chain hides control flow. The loop looks older. It also greps better.",
    whyItScales:
      "Uniform codebases mean reviews focus on behavior, not dialect. Onboarding cost drops when every package feels familiar.",
  },
  {
    id: "explicit",
    name: "Explicit code",
    claim:
      "Hidden control flow is expensive. Go wants failures, types, and dependencies visible at the call site.",
    cleverTrap:
      "Exceptions that jump elsewhere, magic constructors, and framework lifecycle hooks that run “somehow.”",
    boringMove:
      "if err != nil near the call. Pass dependencies in. Return values you can see in the signature.",
    example:
      "func Open(path string) (*File, error) tells you more than openOrDie(path) ever will — especially when “die” means three layers up.",
    whyItScales:
      "Explicit errors and wiring make ownership obvious in large systems. Debuggers and newcomers both thank you.",
  },
  {
    id: "zero-values",
    name: "Zero values",
    claim:
      "Useful defaults beat ceremonial constructors. A zero value should often be ready to use.",
    cleverTrap:
      "Mandatory init() rituals, nil panics on first use, and types that are unsafe until “configured correctly.”",
    boringMove:
      "Design so var s SyncMap or bytes.Buffer{} works immediately. Document when zero is not enough.",
    example:
      "var mu sync.Mutex is locked/unlocked without NewMutex(). That is not laziness — it removes a failure mode.",
    whyItScales:
      "Fewer initialization footguns means fewer “forgot to call Init” incidents across a large API surface.",
  },
  {
    id: "composition",
    name: "Composition",
    claim:
      "Build behavior by combining small pieces, not by climbing inheritance trees.",
    cleverTrap:
      "Deep base classes, fragile overrides, and shared mutable state living three parents up.",
    boringMove:
      "Embed structs when you need fields. Pass collaborators. Keep each type responsible for one clear job.",
    example:
      "type Server struct { addr string; log Logger } — the server has a logger; it is not a LoggerWithHTTPSkills subclass.",
    whyItScales:
      "Shallow object graphs are easier to delete, replace, and test. Hierarchies age poorly under many authors.",
  },
  {
    id: "interfaces",
    name: "Interfaces",
    claim:
      "Depend on small behaviors, not on concrete packages. Interfaces are satisfied implicitly — by methods, not by declaration.",
    cleverTrap:
      "Fat “IService” interfaces, interface-for-everything theater, and premature abstraction on day one.",
    boringMove:
      "Define interfaces where you consume them, keep them tiny (often one or two methods), and accept concrete types until you need a seam.",
    example:
      "type Reader interface { Read([]byte) (int, error) } unlocked an ecosystem. Your app probably needs something that small too.",
    whyItScales:
      "Narrow interfaces let packages evolve independently. Wide ones glue the codebase into one brittle shape.",
  },
];

export default function GoPhilosophyPillars() {
  const [activeId, setActiveId] = useState(PILLARS[0].id);
  const active = PILLARS.find((p) => p.id === activeId) ?? PILLARS[0];
  const index = PILLARS.findIndex((p) => p.id === activeId);

  return (
    <div className="my-10 border-t border-[var(--line)] pt-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] lg:gap-14">
        <nav
          aria-label="Go philosophy topics"
          className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 text-sm text-[var(--muted)]">Topics</p>
          <ul className="flex flex-row gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
            {PILLARS.map((p, i) => {
              const isActive = p.id === activeId;
              return (
                <li key={p.id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => setActiveId(p.id)}
                    className={[
                      "w-full rounded-md px-3 py-2 text-left text-sm transition-colors lg:rounded-none lg:border-l lg:px-0 lg:pl-3 lg:py-2.5",
                      isActive
                        ? "bg-[var(--bg-2)] text-[var(--fg)] lg:border-[var(--fg)] lg:bg-transparent"
                        : "text-[var(--muted)] hover:text-[var(--fg-2)] lg:border-transparent",
                    ].join(" ")}>
                    <span className="mr-2 tabular-nums text-[var(--muted)] lg:hidden">
                      {i + 1}.
                    </span>
                    {p.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <article className="min-w-0">
          <p className="text-sm text-[var(--muted)]">
            {index + 1} of {PILLARS.length}
          </p>
          <h3 className="mt-2 font-display text-2xl text-[var(--fg)] sm:text-3xl">
            {active.name}
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--fg)] sm:text-base">
            {active.claim}
          </p>

          <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
            <p>
              <span className="text-[var(--fg)]">The clever trap. </span>
              {active.cleverTrap}
            </p>
            <p>
              <span className="text-[var(--fg)]">The boring move. </span>
              {active.boringMove}
            </p>
            <p>
              <span className="text-[var(--fg)]">In practice. </span>
              {active.example}
            </p>
            <p className="border-t border-[var(--line)] pt-8">
              {active.whyItScales}
            </p>
          </div>

          <div className="mt-10 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setActiveId(PILLARS[index - 1].id)}
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)] disabled:opacity-30">
              ← Previous
            </button>
            <button
              type="button"
              disabled={index === PILLARS.length - 1}
              onClick={() => setActiveId(PILLARS[index + 1].id)}
              className="text-sm text-[var(--fg-2)] transition-colors hover:text-[var(--fg)] disabled:opacity-30">
              Next topic →
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
