"use client";

import { useState } from "react";

const STEPS = [
  {
    id: "steady",
    label: "Steady",
    headline: "Inventory is keeping up",
    body: "Two workers, group inventory, three partitions. Checkout publishes. Inventory commits. Lag sits near zero.",
    lag: 0,
    publishing: true,
    consuming: true,
    note: "Lag is not ‘Kafka is slow.’ It is orders published minus orders inventory has committed.",
  },
  {
    id: "deploy",
    label: "Deploy",
    headline: "You restart inventory",
    body: "Both workers drop out of the group. Kafka rebalances. For a few seconds nobody owns the partitions, so nobody reads.",
    lag: 40,
    publishing: true,
    consuming: false,
    note: "Checkout does not pause. OrderPlaced keeps landing in the log while the group has no active members.",
  },
  {
    id: "pile",
    label: "Pile-up",
    headline: "The deploy finishes. The backlog does not.",
    body: "Workers rejoin, get partitions again, and resume from the last commit. Everything published during the pause is still unread.",
    lag: 120,
    publishing: true,
    consuming: true,
    note: "A rebalance is a pause in reading, not a loss of data. The pile is the cost of that pause.",
  },
  {
    id: "drain",
    label: "Drain",
    headline: "They read faster than checkout writes",
    body: "Lag falls only if inventory’s read rate beats the publish rate. If it merely matches, the pile stays.",
    lag: 30,
    publishing: true,
    consuming: true,
    note: "Watch lag after deploys. A group that ‘came back healthy’ can still be minutes behind.",
  },
];

export default function KafkaLagStory() {
  const [step, setStep] = useState(0);
  const frame = STEPS[step];
  const width = Math.min(100, Math.round((frame.lag / 120) * 100));

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3 sm:px-6">
        <p className="text-sm text-[var(--muted)]">What lag is</p>
        <p className="font-mono-xs text-[var(--accent)]">
          {step + 1} / {STEPS.length}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-b border-[var(--line)] px-4 py-5 sm:px-6 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap gap-2">
            <Pill on={frame.publishing} label="Checkout publishing" />
            <Pill on={frame.consuming} label="Inventory reading" />
          </div>
          <p className="mt-6 font-mono-xs text-[var(--muted)]">Consumer lag</p>
          <p className="mt-1 font-display text-4xl text-[var(--fg)]">{frame.lag}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--line)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${width}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Unread orders in group <span className="text-[var(--fg-2)]">inventory</span>
          </p>
        </div>
        <div className="flex flex-col px-4 py-5 sm:px-6">
          <p className="font-mono-xs text-[var(--accent)]">{frame.label}</p>
          <h4 className="mt-2 font-display text-xl text-[var(--fg)]">{frame.headline}</h4>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg-2)]">{frame.body}</p>
          <p className="mt-3 text-sm text-[var(--muted)]">{frame.note}</p>
          <div className="mt-auto flex gap-2 pt-6">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-md border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)] disabled:opacity-30">
              ← Prev
            </button>
            <button
              type="button"
              disabled={step === STEPS.length - 1}
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 rounded-md border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-2 text-sm font-medium text-[var(--accent)] disabled:opacity-30">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={[
        "rounded-md border px-2 py-1 font-mono-xs",
        on
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
          : "border-[var(--line)] text-[var(--muted)]",
      ].join(" ")}>
      {label}
      {on ? "" : " · paused"}
    </span>
  );
}
