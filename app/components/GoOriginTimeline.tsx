"use client";

import { useCallback, useEffect, useState } from "react";

interface TimelineStep {
  era: string;
  title: string;
  problem: string;
  insight: string;
  note: string;
}

const STEPS: TimelineStep[] = [
  {
    era: "2007 · Google",
    title: "The scale problem",
    problem:
      "Millions of lines of C++ and Java. Builds took minutes to hours. Waiting on compile blocked entire teams.",
    insight:
      "At Google's size, language design is also an operations problem — slow feedback loops cost more than clever syntax saves.",
    note: "Treat compile latency as a product metric. Languages that stay fast under huge dependency graphs win org-wide adoption.",
  },
  {
    era: "Pain · C++",
    title: "Compilation & headers",
    problem:
      "C++ header inclusion and template instantiation made incremental builds painful. Changing one header could cascade rebuilds.",
    insight:
      "Go chose a module/package model with fast, predictable compilation as a first-class design goal — not an afterthought.",
    note: "Dependency edges are explicit; the build graph is simpler than C++'s textual inclusion model. You feel that as near-instant go build on most services.",
  },
  {
    era: "Pain · Dependencies",
    title: "Dependency hell",
    problem:
      "Complex build systems, version skew, and unclear ownership of transitive deps slowed every change.",
    insight:
      "Go pushed toward simple, explicit package imports and (later) modules — make the dependency story boring on purpose.",
    note: "Boring dependency graphs reduce coordination cost across hundreds of teams.",
  },
  {
    era: "Pain · Safety",
    title: "Memory safety without GC wars",
    problem:
      "C++ gave control and footguns. Manual memory bugs were expensive in large codebases.",
    insight:
      "Go picked garbage collection + simple value/pointer rules: safer than C++, simpler than proving ownership like Rust.",
    note: "GC is a tradeoff. For Google's network services profile, it was acceptable — and productive.",
  },
  {
    era: "Pain · Concurrency",
    title: "Multicore was the future",
    problem:
      "Threads + locks in C++/Java were powerful but hard to get right at scale. Callback-heavy async was also painful.",
    insight:
      "Goroutines + channels made concurrent style feel like structured sequential code (CSP-inspired).",
    note: "Cheap goroutines change architecture: prefer many small concurrent units over heavy thread pools — with care for sharing.",
  },
  {
    era: "Design · Philosophy",
    title: "Simplicity over cleverness",
    problem:
      "C++ rewards expertise with power — and punishes average usage with complexity.",
    insight:
      "Go optimized for reading and maintaining other people's code. Fewer features → more uniform codebases.",
    note: "Feature omission is a governance tool: it reduces dialect fragmentation across a large engineering org.",
  },
];

export default function GoOriginTimeline() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const step = STEPS[stepIndex];
  const isLast = stepIndex >= STEPS.length - 1;

  const goTo = useCallback((index: number) => {
    setStepIndex(Math.max(0, Math.min(index, STEPS.length - 1)));
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (isLast) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStepIndex((i) => i + 1), 2800);
    return () => clearTimeout(timer);
  }, [playing, stepIndex, isLast]);

  return (
    <div className="my-6 sm:my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <h3 className="font-display text-lg sm:text-xl text-[var(--fg)]">
          Case study · Why Google built Go
        </h3>
        <p className="mt-1 font-mono-xs text-[var(--muted)]">
          Step through the problems that made “just improve C++” the wrong answer
        </p>
      </div>

      <div className="px-4 py-5 sm:px-6">
        <div className="mb-5 flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => goTo(i)}
              className={[
                "rounded-full border px-3 py-1 font-mono-xs transition-colors",
                i === stepIndex
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : i < stepIndex
                    ? "border-[var(--line)] text-[var(--fg-2)] hover:border-[var(--accent)]"
                    : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
              ].join(" ")}>
              {i + 1}
            </button>
          ))}
        </div>

        <p className="font-mono-xs text-[var(--accent)]">{step.era}</p>
        <h4 className="mt-2 font-display text-xl text-[var(--fg)] sm:text-2xl">
          {step.title}
        </h4>
        <p className="mt-3 text-sm leading-relaxed text-[var(--fg-2)]">
          {step.problem}
        </p>
        <p className="mt-3 rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4 text-sm leading-relaxed text-[var(--fg)]">
          {step.insight}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--fg-2)]">
          {step.note}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => goTo(0)}
            className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
            ↺ Reset
          </button>
          <button
            onClick={() => goTo(stepIndex - 1)}
            disabled={stepIndex === 0}
            className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30">
            ← Prev
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-5 py-2 font-mono-xs font-semibold text-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-[var(--bg)]">
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={() => goTo(stepIndex + 1)}
            disabled={isLast}
            className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30">
            Next →
          </button>
        </div>

        <div className="mx-auto mt-4 h-1 max-w-2xl overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
