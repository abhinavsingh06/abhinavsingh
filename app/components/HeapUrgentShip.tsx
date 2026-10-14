"use client";

import { useState } from "react";

const ORDERS = [
  { id: "order-100", label: "Ordinary", priority: 1 },
  { id: "order-200", label: "Ordinary", priority: 1 },
  { id: "order-8841", label: "Same-day", priority: 9 },
];

const FRAMES = [
  {
    label: "Line",
    headline: "They arrived in this order",
    body: "order-100, then order-200, then the same-day shipment. A line ships whoever has been waiting longest.",
    mode: "fifo" as const,
    next: "order-100",
  },
  {
    label: "FIFO",
    headline: "The urgent one is still at the back",
    body: "order-100 leaves first. order-8841 has not moved. Fair to the line. Wrong for the truck that leaves in an hour.",
    mode: "fifo" as const,
    next: "order-100",
  },
  {
    label: "Heap",
    headline: "Rank by how soon it must leave",
    body: "Same three orders. The highest priority sits at the front of the heap, no matter when it arrived.",
    mode: "heap" as const,
    next: "order-8841",
  },
  {
    label: "Ship",
    headline: "Same-day goes out",
    body: "Pull the top. order-8841 ships. The ordinary orders stay. That pull is what a heap is for.",
    mode: "heap" as const,
    next: "order-8841",
  },
];

export default function HeapUrgentShip() {
  const [step, setStep] = useState(0);
  const frame = FRAMES[step];
  const ordered =
    frame.mode === "heap"
      ? [...ORDERS].sort((a, b) => b.priority - a.priority)
      : ORDERS;

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3 sm:px-6">
        <p className="text-sm text-[var(--muted)]">
          {frame.mode === "heap" ? "Priority heap" : "First-in line"}
        </p>
        <p className="font-mono-xs text-[var(--accent)]">
          {step + 1} / {FRAMES.length}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-b border-[var(--line)] px-4 py-5 sm:px-6 lg:border-b-0 lg:border-r">
          <div className="space-y-2">
            {ordered.map((order, i) => {
              const shipping = order.id === frame.next && step > 0;
              return (
                <div
                  key={order.id}
                  className={[
                    "flex items-center justify-between gap-3 rounded-lg border px-3 py-3",
                    shipping
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--line)] bg-[var(--bg)]",
                  ].join(" ")}>
                  <div>
                    <p className={shipping ? "font-mono-xs text-[var(--accent)]" : "font-mono-xs text-[var(--fg)]"}>
                      {order.id}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{order.label}</p>
                  </div>
                  <p className="font-mono-xs text-[var(--muted)]">
                    {i === 0 ? "next" : `p${order.priority}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col px-4 py-5 sm:px-6">
          <p className="font-mono-xs text-[var(--accent)]">{frame.label}</p>
          <h4 className="mt-2 font-display text-xl text-[var(--fg)]">{frame.headline}</h4>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg-2)]">{frame.body}</p>
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
              disabled={step === FRAMES.length - 1}
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
