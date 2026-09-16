"use client";

import { useState } from "react";

type Mode = "fanout" | "scale";

interface PartitionBox {
  id: number;
  records: string[];
}

const PARTITIONS: PartitionBox[] = [
  { id: 0, records: ["order-100", "order-400"] },
  { id: 1, records: ["order-200", "order-500"] },
  { id: 2, records: ["order-300"] },
];

export default function KafkaConsumerGroups() {
  const [mode, setMode] = useState<Mode>("fanout");

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Consumer groups — two jobs</p>
        <p className="mt-1 text-[15px] text-[var(--fg-2)]">
          Same topic. Different group ids = independent readers. Same group id =
          workers sharing partitions.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("fanout")}
            className={[
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              mode === "fanout"
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
            ].join(" ")}>
            Two teams (fan-out)
          </button>
          <button
            type="button"
            onClick={() => setMode("scale")}
            className={[
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              mode === "scale"
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
            ].join(" ")}>
            One team (scale out)
          </button>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6">
        <p className="font-mono-xs text-[var(--muted)]">Topic · orders · 3 partitions</p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {PARTITIONS.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-[var(--line)] bg-[var(--bg)] p-3">
              <p className="font-mono-xs text-[var(--accent)]">P{p.id}</p>
              <ul className="mt-2 space-y-1 font-mono-xs text-[var(--fg-2)]">
                {p.records.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {mode === "fanout" ? (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] p-4">
              <p className="font-mono-xs text-[var(--accent)]">group · inventory</p>
              <p className="mt-2 text-sm text-[var(--fg)]">
                Reads <span className="font-mono-xs">all</span> partitions.
                Own committed offsets.
              </p>
              <p className="mt-3 font-mono-xs text-[var(--muted)]">
                P0 · P1 · P2 → reserve stock
              </p>
            </div>
            <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
              <p className="font-mono-xs text-[var(--muted)]">group · email</p>
              <p className="mt-2 text-sm text-[var(--fg-2)]">
                Also reads <span className="font-mono-xs">all</span> partitions.
                Separate bookmarks.
              </p>
              <p className="mt-3 font-mono-xs text-[var(--muted)]">
                P0 · P1 · P2 → send confirmation
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] p-4">
              <p className="font-mono-xs text-[var(--accent)]">
                inventory · worker A
              </p>
              <p className="mt-2 text-sm text-[var(--fg)]">
                Assigned <span className="font-mono-xs">P0, P1</span>
              </p>
              <p className="mt-3 font-mono-xs text-[var(--muted)]">
                order-100, 400, 200, 500
              </p>
            </div>
            <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
              <p className="font-mono-xs text-[var(--muted)]">
                inventory · worker B
              </p>
              <p className="mt-2 text-sm text-[var(--fg-2)]">
                Assigned <span className="font-mono-xs">P2</span>
              </p>
              <p className="mt-3 font-mono-xs text-[var(--muted)]">order-300</p>
            </div>
          </div>
        )}

        <p className="mt-5 text-[15px] leading-relaxed text-[var(--fg-2)]">
          <span className="text-[var(--fg)]">Sticky. </span>
          {mode === "fanout"
            ? "Different group ids = every team gets every OrderPlaced. That is fan-out — the reason Kafka beats a single queue that deletes after one ack."
            : "Same group id = partitions are split across workers. One partition → one consumer in the group. Three partitions, three workers is the usual ceiling for parallelism in that group."}
        </p>
      </div>
    </div>
  );
}
