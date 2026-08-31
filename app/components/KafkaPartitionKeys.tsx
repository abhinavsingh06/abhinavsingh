"use client";

import { useMemo, useState } from "react";

const ORDER_KEYS = [
  { id: "order-8841", label: "order-8841" },
  { id: "order-9912", label: "order-9912" },
  { id: "order-2201", label: "order-2201" },
] as const;

const PARTITION_COUNT = 3;

function partitionForKey(key: string, count: number): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return hash % count;
}

export default function KafkaPartitionKeys() {
  const [keyId, setKeyId] = useState<(typeof ORDER_KEYS)[number]["id"]>(
    "order-8841"
  );

  const partition = useMemo(
    () => partitionForKey(keyId, PARTITION_COUNT),
    [keyId]
  );

  const routing = useMemo(() => {
    const map = new Map<string, number>();
    for (const order of ORDER_KEYS) {
      map.set(order.id, partitionForKey(order.id, PARTITION_COUNT));
    }
    return map;
  }, []);

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Partition keys in practice</p>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--fg-2)]">
          Same key → same partition → events for one order stay in order.
        </p>
      </div>

      <div className="px-4 py-5 sm:px-6">
        <p className="font-mono-xs text-[var(--muted)]">Pick an order id (key)</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ORDER_KEYS.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => setKeyId(order.id)}
              className={[
                "rounded-md border px-3 py-1.5 font-mono-xs transition-colors",
                keyId === order.id
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
              ].join(" ")}>
              {order.label}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
          <p className="font-mono-xs text-[var(--muted)]">Topic · orders</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {Array.from({ length: PARTITION_COUNT }, (_, p) => (
              <div
                key={p}
                className={[
                  "min-h-[88px] rounded-lg border p-3 transition-colors",
                  p === partition
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--line)]",
                ].join(" ")}>
                <p
                  className={[
                    "font-mono-xs",
                    p === partition ? "text-[var(--accent)]" : "text-[var(--muted)]",
                  ].join(" ")}>
                  Partition {p}
                </p>
                {p === partition ? (
                  <p className="mt-2 text-sm text-[var(--fg)]">{keyId}</p>
                ) : (
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    {ORDER_KEYS.filter((o) => routing.get(o.id) === p)
                      .map((o) => o.label)
                      .join(", ") || "—"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[var(--fg-2)]">
          <span className="text-[var(--fg)]">Routing rule. </span>
          Kafka hashes the key and picks a partition. All events for{" "}
          <code className="text-[var(--accent)]">{keyId}</code> land in partition{" "}
          <code className="text-[var(--accent)]">{partition}</code> — so
          OrderPlaced → StockReserved → Shipped stay ordered for that order.
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">
          No key? Records round-robin across partitions — fine for metrics, risky
          when order per entity matters.
        </p>
      </div>
    </div>
  );
}
