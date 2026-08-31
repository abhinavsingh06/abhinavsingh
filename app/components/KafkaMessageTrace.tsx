"use client";

import { useMemo, useState } from "react";

interface TraceStep {
  id: string;
  term: string;
  headline: string;
  body: string;
  detail: string;
}

const STEPS: TraceStep[] = [
  {
    id: "producer",
    term: "Producer",
    headline: "Order API publishes a fact",
    body:
      'The Order API finishes checkout and sends one record: topic `orders`, key `order-8841`, value `{"event":"OrderPlaced"}`.',
    detail:
      "Producers only append. They do not wait for Inventory or email to finish.",
  },
  {
    id: "broker",
    term: "Broker",
    headline: "A broker receives the write",
    body:
      "The record lands on a Kafka broker — a server that stores topic data on disk and serves reads.",
    detail:
      "A cluster has multiple brokers for fault tolerance. You talk to the cluster; Kafka picks where replicas live.",
  },
  {
    id: "topic",
    term: "Topic",
    headline: "The record goes to the `orders` topic",
    body:
      "A topic is a named stream of events. Producers write to a topic name; consumers subscribe by name.",
    detail:
      "Think folder of logs: `orders`, `payments`, `shipments` — not one giant mixed file.",
  },
  {
    id: "partition",
    term: "Partition",
    headline: "Kafka picks partition 2",
    body:
      "Topics are split into partitions — parallel logs. The key `order-8841` always routes to the same partition so events for one order stay ordered.",
    detail:
      "More partitions = more parallel consumers. Ordering is per partition, not across the whole topic.",
  },
  {
    id: "offset",
    term: "Offset",
    headline: "The record gets offset 1042",
    body:
      "An offset is a monotonic position inside that partition's log — like line 1042 in a file. It never decreases for new writes.",
    detail:
      "Consumers track their offset: \"I've processed up to 1041, next read 1042.\" That bookmark is how replay works.",
  },
  {
    id: "consumer",
    term: "Consumer",
    headline: "Inventory reads at its own pace",
    body:
      "Inventory subscribes to `orders`, reads partition 2 from offset 1042, reserves stock, and commits its new offset when done.",
    detail:
      "Many consumer groups can read the same topic independently — each keeps its own offsets.",
  },
];

function partitionForKey(key: string, count: number): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return hash % count;
}

export default function KafkaMessageTrace() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const partition = partitionForKey("order-8841", 3);

  const activeParts = useMemo(() => {
    const set = new Set<string>();
    if (["topic", "partition", "offset", "consumer"].includes(step.id)) {
      set.add("topic");
    }
    if (["partition", "offset", "consumer"].includes(step.id)) {
      set.add("partition");
    }
    if (["offset", "consumer"].includes(step.id)) {
      set.add("offset");
    }
    if (step.id === "consumer") set.add("consumer");
    if (step.id === "broker" || step.id === "producer") set.add("broker");
    if (step.id === "producer") set.add("producer");
    return set;
  }, [step.id]);

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Follow one message</p>
        <p className="mt-1 font-mono-xs text-[var(--accent)]">
          OrderPlaced · order-8841
        </p>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
        <div className="border-b border-[var(--line)] px-4 py-5 sm:px-6 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStepIndex(i)}
                className={[
                  "rounded-full border px-3 py-1 font-mono-xs transition-colors",
                  i === stepIndex
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
                ].join(" ")}>
                {s.term}
              </button>
            ))}
          </div>

          <h4 className="mt-5 font-display text-xl text-[var(--fg)] sm:text-2xl">
            {step.headline}
          </h4>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg-2)]">
            {step.body}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            {step.detail}
          </p>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-4">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((i) => i - 1)}
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)] disabled:opacity-30">
              ← Previous
            </button>
            <span className="font-mono-xs text-[var(--muted)]">
              {stepIndex + 1} / {STEPS.length}
            </span>
            <button
              type="button"
              disabled={stepIndex === STEPS.length - 1}
              onClick={() => setStepIndex((i) => i + 1)}
              className="text-sm text-[var(--fg-2)] transition-colors hover:text-[var(--fg)] disabled:opacity-30">
              Next →
            </button>
          </div>
        </div>

        <div className="bg-[var(--bg)] px-4 py-5 sm:px-6">
          <p className="font-mono-xs text-[var(--muted)]">Live picture</p>
          <div className="mt-4 space-y-3 font-mono-xs">
            <div
              className={[
                "rounded-lg border px-3 py-2 transition-colors",
                activeParts.has("producer")
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--line)] text-[var(--muted)]",
              ].join(" ")}>
              Producer → Order API
            </div>
            <div
              className={[
                "rounded-lg border px-3 py-2 transition-colors",
                activeParts.has("broker")
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--line)] text-[var(--muted)]",
              ].join(" ")}>
              Broker · kafka-1
            </div>
            <div
              className={[
                "rounded-lg border px-3 py-2 transition-colors",
                activeParts.has("topic")
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg)]"
                  : "border-[var(--line)] text-[var(--muted)]",
              ].join(" ")}>
              Topic · orders
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((p) => (
                <div
                  key={p}
                  className={[
                    "rounded-lg border px-2 py-2 text-center transition-colors",
                    activeParts.has("partition") && p === partition
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--line)] text-[var(--muted)]",
                  ].join(" ")}>
                  P{p}
                  {activeParts.has("offset") && p === partition ? (
                    <div className="mt-1 text-[10px] text-[var(--fg-2)]">
                      …1041
                      <br />
                      <span className="text-[var(--accent)]">→1042</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <div
              className={[
                "rounded-lg border px-3 py-2 transition-colors",
                activeParts.has("consumer")
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--line)] text-[var(--muted)]",
              ].join(" ")}>
              Consumer · Inventory @ offset 1042
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
