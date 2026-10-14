"use client";

import { useState } from "react";

const STEPS = [
  {
    id: "first",
    label: "First read",
    headline: "The reserve lands. The offset does not.",
    body: "Inventory holds a pallet for order-9912. The process dies before the group commits that offset.",
    holds: 1,
    committed: false,
    delivery: "1st",
    note: "The warehouse moved. Kafka’s bookmark did not. That split is the whole bug.",
  },
  {
    id: "again",
    label: "Redelivery",
    headline: "The same record comes back",
    body: "The worker rejoins and starts after the last commit. order-9912 is still uncommitted, so it is read again. Nothing new was ordered.",
    holds: 1,
    committed: false,
    delivery: "2nd",
    note: "Redelivery is normal. The handler has to expect a second look at an order it already touched.",
  },
  {
    id: "naive",
    label: "Naive handler",
    headline: "It reserves again",
    body: "The code only knows how to call reserveStock. A second call holds a second pallet. Lag can still fall to zero.",
    holds: 2,
    committed: true,
    delivery: "2nd",
    note: "Lag zero means the bookmark caught up. It does not mean the side effect happened once.",
  },
  {
    id: "once",
    label: "Unique key",
    headline: "The second insert changes nothing",
    body: "reservations.order_id is unique. The second insert conflicts and does nothing. One pallet stays held. Then you commit.",
    holds: 1,
    committed: true,
    delivery: "2nd",
    note: "The row is both the hold and the proof you already did it. No second step to crash between.",
  },
];

export default function KafkaDuplicateReserve() {
  const [step, setStep] = useState(0);
  const frame = STEPS[step];

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Same order, second time</p>
        <p className="font-mono-xs text-[var(--accent)]">
          {step + 1} / {STEPS.length}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-b border-[var(--line)] px-4 py-5 sm:px-6 lg:border-b-0 lg:border-r">
          <p className="font-mono-xs text-[var(--muted)]">order-9912</p>
          <p className="mt-1 font-display text-4xl text-[var(--fg)]">
            {frame.holds} pallet{frame.holds === 1 ? "" : "s"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-md border border-[var(--line)] px-2 py-1 font-mono-xs text-[var(--fg-2)]">
              delivery {frame.delivery}
            </span>
            <span
              className={[
                "rounded-md border px-2 py-1 font-mono-xs",
                frame.committed
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--line)] text-[var(--muted)]",
              ].join(" ")}>
              {frame.committed ? "offset committed" : "offset not committed"}
            </span>
          </div>
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
