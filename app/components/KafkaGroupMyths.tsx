"use client";

import { useState } from "react";

interface Myth {
  id: string;
  claim: string;
  truth: string;
  why: string;
}

const MYTHS: Myth[] = [
  {
    id: "steal",
    claim: "If email joins orders, inventory stops getting messages.",
    truth: "False — different group ids do not steal.",
    why: "Each group keeps its own committed offsets. Inventory and email both see every OrderPlaced.",
  },
  {
    id: "workers",
    claim: "Start 10 inventory consumers on a 3-partition topic for 10× speed.",
    truth: "False — extras sit idle.",
    why: "In one group, at most one consumer owns a partition. Three partitions → three busy workers. The rest wait for a rebalance.",
  },
  {
    id: "replay",
    claim: "Replay means ask the producer to send the event again.",
    truth: "False — move the offset, re-read the log.",
    why: "Kafka still has the bytes (within retention). Reset the group’s bookmark and consume. Fix the handler; do not rewrite history from the Order API.",
  },
  {
    id: "rebalance",
    claim: "A rebalance is always a cluster outage.",
    truth: "False — it is partition reassignment.",
    why: "Members join/leave the group; Kafka reassigns partitions. Brief pause, then work continues. Scale and deploys cause rebalances — plan for them in Post 6.",
  },
];

export default function KafkaGroupMyths() {
  const [activeId, setActiveId] = useState(MYTHS[0].id);
  const [open, setOpen] = useState<Record<string, boolean>>({ steal: false });
  const active = MYTHS.find((m) => m.id === activeId) ?? MYTHS[0];

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Check the myth</p>
        <p className="mt-1 text-[15px] text-[var(--fg-2)]">
          Tap a claim. Reveal what actually happens.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="border-b border-[var(--line)] lg:border-b-0 lg:border-r">
          {MYTHS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveId(m.id)}
              className={[
                "block w-full border-b border-[var(--line)] px-4 py-3.5 text-left text-sm leading-snug last:border-b-0 sm:px-5",
                activeId === m.id
                  ? "bg-[var(--accent-soft)] text-[var(--fg)]"
                  : "text-[var(--fg-2)] hover:bg-[var(--bg)]",
              ].join(" ")}>
              {m.claim}
            </button>
          ))}
        </div>

        <div className="px-4 py-5 sm:px-6">
          {!open[active.id] ? (
            <button
              type="button"
              onClick={() =>
                setOpen((prev) => ({ ...prev, [active.id]: true }))
              }
              className="rounded-md border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)]">
              Reveal →
            </button>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] p-4">
                <p className="font-mono-xs text-[var(--accent)]">Truth</p>
                <p className="mt-2 text-[15px] font-medium text-[var(--fg)]">
                  {active.truth}
                </p>
              </div>
              <p className="text-[15px] leading-relaxed text-[var(--fg-2)]">
                {active.why}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
