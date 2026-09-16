"use client";

import { useState } from "react";

interface ReplayStep {
  id: string;
  label: string;
  headline: string;
  body: string;
  detail: string;
  committed: number;
  highlight: number | null;
  log: { offset: number; event: string }[];
}

const STEPS: ReplayStep[] = [
  {
    id: "caught-up",
    label: "Live",
    headline: "Inventory is caught up",
    body: "Partition 0 has three OrderPlaced events. Group inventory committed offset 3 — next read starts at 3.",
    detail: "Committed offset means “I am done through 2; give me 3 next.”",
    committed: 3,
    highlight: null,
    log: [
      { offset: 0, event: "OrderPlaced · order-8841" },
      { offset: 1, event: "OrderPlaced · order-9912" },
      { offset: 2, event: "OrderPlaced · order-2201" },
    ],
  },
  {
    id: "bug",
    label: "Bug",
    headline: "Stock reservation had a bug",
    body: "order-9912 (offset 1) reserved the wrong warehouse. The fact in Kafka is still correct — your handler was wrong.",
    detail: "You do not ask the Order API to republish. You move the bookmark back and re-read.",
    committed: 3,
    highlight: 1,
    log: [
      { offset: 0, event: "OrderPlaced · order-8841" },
      { offset: 1, event: "OrderPlaced · order-9912  ← bad side effect" },
      { offset: 2, event: "OrderPlaced · order-2201" },
    ],
  },
  {
    id: "reset",
    label: "Reset",
    headline: "Reset group inventory to offset 1",
    body: "Stop consumers. Reset the committed offset for partition 0 to 1 (or earliest). Restart the group.",
    detail: "Replay is intentional: change the bookmark, then consume again. Retention must still hold those bytes.",
    committed: 1,
    highlight: 1,
    log: [
      { offset: 0, event: "OrderPlaced · order-8841" },
      { offset: 1, event: "OrderPlaced · order-9912" },
      { offset: 2, event: "OrderPlaced · order-2201" },
    ],
  },
  {
    id: "replay",
    label: "Replay",
    headline: "Re-read 1, then 2 — fixed handler",
    body: "Inventory processes offset 1 and 2 again with the fixed warehouse logic, then commits 3.",
    detail: "Duplicates are expected. Upsert by orderId so a second pass does not double-reserve forever.",
    committed: 3,
    highlight: 2,
    log: [
      { offset: 0, event: "OrderPlaced · order-8841" },
      { offset: 1, event: "OrderPlaced · order-9912  ← reprocessed" },
      { offset: 2, event: "OrderPlaced · order-2201  ← reprocessed" },
    ],
  },
];

export default function KafkaReplayLab() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Replay lab</p>
        <p className="mt-1 text-[15px] text-[var(--fg-2)]">
          The log does not change. You move the bookmark and read again.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStepIndex(i)}
              className={[
                "rounded-md border px-3 py-1.5 text-sm transition-colors",
                i === stepIndex
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
              ].join(" ")}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
        <div className="border-b border-[var(--line)] px-4 py-5 sm:px-6 lg:border-b-0 lg:border-r">
          <p className="font-mono-xs text-[var(--muted)]">
            Partition 0 · group inventory
          </p>
          <div className="mt-3 space-y-2">
            {step.log.map((row) => {
              const active = step.highlight === row.offset;
              const done = row.offset < step.committed;
              return (
                <div
                  key={row.offset}
                  className={[
                    "rounded-lg border px-3 py-2 font-mono-xs transition-colors",
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : done
                        ? "border-[var(--line)] text-[var(--fg-2)]"
                        : "border-[var(--line)] text-[var(--muted)]",
                  ].join(" ")}>
                  <span className="text-[var(--muted)]">[{row.offset}]</span>{" "}
                  {row.event}
                </div>
              );
            })}
          </div>
          <p className="mt-4 font-mono-xs text-[var(--accent)]">
            committed offset → {step.committed}
          </p>
        </div>

        <div className="flex flex-col px-4 py-5 sm:px-6">
          <p className="font-mono-xs text-[var(--accent)]">
            Step {stepIndex + 1} / {STEPS.length}
          </p>
          <h4 className="mt-2 font-display text-xl text-[var(--fg)]">
            {step.headline}
          </h4>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg-2)]">
            {step.body}
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">{step.detail}</p>

          <div className="mt-auto flex gap-2 pt-6">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((i) => i - 1)}
              className="flex-1 rounded-md border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)] disabled:opacity-30">
              ← Prev
            </button>
            <button
              type="button"
              disabled={stepIndex === STEPS.length - 1}
              onClick={() => setStepIndex((i) => i + 1)}
              className="flex-1 rounded-md border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-2 text-sm font-medium text-[var(--accent)] disabled:opacity-30">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
