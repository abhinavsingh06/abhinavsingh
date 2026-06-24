"use client";

import { useCallback, useEffect, useState } from "react";

type Zone = "working" | "staging" | "commits" | "stash" | "remote";

interface WorkflowStep {
  command?: string;
  action: string;
  detail: string;
  highlight: Zone[];
  files: Partial<Record<Zone, string[]>>;
}

interface Preset {
  title: string;
  subtitle: string;
  steps: WorkflowStep[];
  result: string;
}

const ZONE_META: Record<
  Zone,
  { label: string; short: string; color: string }
> = {
  working: { label: "Working Directory", short: "Working", color: "border-blue-500/50 bg-blue-500/10" },
  staging: { label: "Staging Area", short: "Staging", color: "border-amber-500/50 bg-amber-500/10" },
  commits: { label: "Commit Tree", short: "Commits", color: "border-emerald-500/50 bg-emerald-500/10" },
  stash: { label: "Stash", short: "Stash", color: "border-purple-500/50 bg-purple-500/10" },
  remote: { label: "Remote (GitHub)", short: "Remote", color: "border-rose-500/50 bg-rose-500/10" },
};

const PRESETS: Record<string, Preset> = {
  workflow: {
    title: "Add → Commit → Push",
    subtitle: "The core loop every Git user repeats",
    steps: [
      {
        action: "Edit your files",
        detail: "You change login.js in your project folder. Git sees modified files in the working directory.",
        highlight: ["working"],
        files: { working: ["login.js (modified)"] },
      },
      {
        command: "git add login.js",
        action: "Stage the change",
        detail: "The file moves to staging — a preview of your next snapshot.",
        highlight: ["staging"],
        files: { staging: ["login.js"] },
      },
      {
        command: 'git commit -m "Add login"',
        action: "Save a snapshot",
        detail: "Git records a permanent commit in your local history with a unique hash.",
        highlight: ["commits"],
        files: { commits: ['a3f9c2 "Add login"'] },
      },
      {
        command: "git push origin main",
        action: "Upload to GitHub",
        detail: "Your commit is sent to the remote repository. Teammates can now pull it.",
        highlight: ["remote"],
        files: { commits: ['a3f9c2 "Add login"'], remote: ['a3f9c2 "Add login"'] },
      },
    ],
    result: "Your change traveled: Working → Staging → Commits → Remote",
  },
  stash: {
    title: "Stash & Pop",
    subtitle: "Park unfinished work and come back later",
    steps: [
      {
        action: "Work in progress",
        detail: "You're halfway through a feature but need to fix an urgent bug on main.",
        highlight: ["working"],
        files: { working: ["profile.js (half done)"] },
      },
      {
        command: "git stash",
        action: "Stash your changes",
        detail: "Uncommitted work is saved to the stash. Your working directory becomes clean.",
        highlight: ["stash"],
        files: { stash: ["profile.js (saved)"] },
      },
      {
        command: "git checkout main",
        action: "Switch branches safely",
        detail: "With a clean working tree, you can switch branches without losing work.",
        highlight: ["working"],
        files: { stash: ["profile.js (saved)"] },
      },
      {
        command: "git stash pop",
        action: "Restore your work",
        detail: "Stashed changes return to the working directory. You pick up where you left off.",
        highlight: ["working"],
        files: { working: ["profile.js (restored)"] },
      },
    ],
    result: "Stash = temporary drawer. Pop = take it back out.",
  },
};

interface GitWorkflowAnimationProps {
  preset: string;
}

export default function GitWorkflowAnimation({
  preset,
}: GitWorkflowAnimationProps) {
  const config = PRESETS[preset] ?? PRESETS.workflow;
  const { title, subtitle, steps, result } = config;

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = steps[stepIndex];
  const isLast = stepIndex >= steps.length - 1;

  const goTo = useCallback(
    (i: number) => setStepIndex(Math.max(0, Math.min(i, steps.length - 1))),
    [steps.length]
  );

  useEffect(() => {
    if (!playing || isLast) {
      if (isLast) setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), 1600);
    return () => clearTimeout(t);
  }, [playing, stepIndex, isLast]);

  const zones: Zone[] = ["working", "staging", "commits", "stash", "remote"];

  return (
    <div className="my-6 sm:my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <h3 className="font-display text-lg sm:text-xl text-[var(--fg)]">{title}</h3>
        <p className="mt-1 font-mono-xs text-[var(--muted)]">{subtitle}</p>
      </div>

      <div className="px-4 py-6 sm:px-6">
        {/* Zone pipeline */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
          {zones.map((zone, i) => {
            const meta = ZONE_META[zone];
            const active = step.highlight.includes(zone);
            const files = step.files[zone] ?? [];

            return (
              <div key={zone} className="relative">
                {i < zones.length - 1 && (
                  <span className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 font-mono-xs text-[var(--muted)] sm:block">
                    →
                  </span>
                )}
                <div
                  className={[
                    "min-h-[88px] rounded-lg border-2 p-3 transition-all duration-500",
                    meta.color,
                    active
                      ? "scale-105 border-[var(--accent)] shadow-[0_0_20px_var(--accent-glow)]"
                      : "opacity-50",
                  ].join(" ")}>
                  <p className="font-mono-xs font-semibold text-[var(--fg)]">
                    {meta.short}
                  </p>
                  <div className="mt-2 space-y-1">
                    {files.length > 0 ? (
                      files.map((f) => (
                        <p
                          key={f}
                          className="rounded bg-[var(--bg)] px-1.5 py-0.5 font-mono-xs text-[var(--accent)]">
                          {f}
                        </p>
                      ))
                    ) : (
                      <p className="font-mono-xs text-[var(--muted)]">empty</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step info */}
        <div className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip chip-accent font-mono-xs">
              Step {stepIndex + 1}/{steps.length}
            </span>
            {step.command && (
              <code className="rounded bg-[var(--bg-elev-2)] px-2 py-0.5 font-mono-xs text-[var(--accent)]">
                {step.command}
              </code>
            )}
          </div>
          <p className="mt-3 text-sm font-semibold text-[var(--fg)]">{step.action}</p>
          <p className="mt-1 text-sm text-[var(--fg-2)]">{step.detail}</p>
          {isLast && (
            <p className="mt-3 rounded-md bg-[var(--accent-soft)] px-3 py-2 text-sm font-semibold text-[var(--accent)]">
              {result}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button onClick={() => goTo(0)} className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
            ↺ Reset
          </button>
          <button onClick={() => goTo(stepIndex - 1)} disabled={stepIndex === 0} className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] hover:border-[var(--accent)] disabled:opacity-30">
            ← Prev
          </button>
          <button onClick={() => setPlaying((p) => !p)} className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-5 py-2 font-mono-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)]">
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={() => goTo(stepIndex + 1)} disabled={isLast} className="rounded-lg border border-[var(--line)] px-3 py-2 font-mono-xs text-[var(--muted)] hover:border-[var(--accent)] disabled:opacity-30">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
