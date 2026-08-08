"use client";

import { useState } from "react";

interface Scenario {
  id: string;
  title: string;
  context: string;
  verdict: "go" | "maybe" | "other";
  verdictLabel: string;
  why: string;
  note: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "apis",
    title: "HTTP APIs & microservices",
    context: "Many small services, lots of networking, mixed experience on the team.",
    verdict: "go",
    verdictLabel: "Strong Go fit",
    why: "Fast builds, simple deployment (static binary), solid stdlib net/http, easy concurrency for I/O.",
    note: "Operational simplicity compounds: one binary, predictable performance envelope, easy onboarding.",
  },
  {
    id: "cli",
    title: "CLI tools & DevOps utilities",
    context: "Ship a single binary to many machines; startup time matters.",
    verdict: "go",
    verdictLabel: "Strong Go fit",
    why: "Static linking and fast startup made Go a default for cloud-native tooling (Docker, Kubernetes ecosystem).",
    note: "Cross-compile is a superpower for platform teams — distribute one file, no runtime install story.",
  },
  {
    id: "game",
    title: "Game engine / AAA realtime",
    context: "Frame budgets, custom allocators, maximum control.",
    verdict: "other",
    verdictLabel: "Prefer C++ / Rust / engines",
    why: "GC pauses and less control over layout/SIMD make Go a poor default here.",
    note: "Language choice is a constraint match, not a loyalty test.",
  },
  {
    id: "ml",
    title: "Heavy numerical / ML research",
    context: "Matrix-heavy code, Python ecosystem, GPU kernels.",
    verdict: "other",
    verdictLabel: "Usually not Go",
    why: "Ecosystem and operator-friendly numerics live elsewhere. Go can serve models, rarely train them.",
    note: "Polyglot is fine — Go for the service boundary, specialized stacks for compute.",
  },
  {
    id: "refactor",
    title: "Replace a huge C++ monolith “because Go is simpler”",
    context: "Decade of C++ domain logic; team already expert.",
    verdict: "maybe",
    verdictLabel: "Case-by-case",
    why: "Rewrite risk dwarfs language wins. Extract new services in Go; don't boil the ocean.",
    note: "Strangler pattern: new boundaries in Go where compile time or concurrency pain is worst.",
  },
  {
    id: "concurrency",
    title: "High-fanout I/O concurrency",
    context: "Thousands of connections, fan-in fan-out jobs, not hard realtime.",
    verdict: "go",
    verdictLabel: "Strong Go fit",
    why: "Goroutines make concurrent I/O models approachable without reactive framework ceremony.",
    note: "Start with goroutines, channels, and context — then profile for leaks and GC under load.",
  },
];

const VERDICT_STYLE: Record<Scenario["verdict"], string> = {
  go: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  maybe: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  other: "text-rose-400 border-rose-500/30 bg-rose-500/10",
};

export default function GoWhenToUse() {
  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const active = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0];

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-5 py-4 sm:px-6">
        <h3 className="font-display text-lg text-[var(--fg)]">
          Scenario lab · When Go fits
        </h3>
        <p className="mt-1 text-sm text-[var(--fg-2)]">
          Pick a situation. The point isn&apos;t hype — it&apos;s matching
          constraints.
        </p>
      </div>

      <div className="grid min-w-0 max-w-full gap-0 lg:grid-cols-[240px_1fr]">
        <div className="flex min-w-0 max-w-full flex-row gap-2 overflow-x-auto border-b border-[var(--line)] p-4 lg:flex-col lg:border-b-0 lg:border-r">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveId(s.id)}
              className={[
                "shrink-0 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                activeId === s.id
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg)]"
                  : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
              ].join(" ")}>
              {s.title}
            </button>
          ))}
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <p className="text-sm text-[var(--fg-2)]">{active.context}</p>
          <span
            className={`inline-flex rounded-full border px-3 py-1 font-mono-xs font-semibold ${VERDICT_STYLE[active.verdict]}`}>
            {active.verdictLabel}
          </span>
          <p className="text-sm leading-relaxed text-[var(--fg)]">{active.why}</p>
          <p className="text-sm leading-relaxed text-[var(--fg-2)]">
            {active.note}
          </p>
        </div>
      </div>
    </div>
  );
}
