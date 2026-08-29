"use client";

import { useState } from "react";

interface Step {
  id: string;
  label: string;
  direct: string;
  kafka: string;
}

const STEPS: Step[] = [
  {
    id: "order",
    label: "Customer places order",
    direct:
      "Order API receives POST /orders. Nothing else runs until the handler returns.",
    kafka:
      "Order API saves the order, publishes OrderPlaced, returns 201. Downstream work happens later.",
  },
  {
    id: "stock",
    label: "Reserve stock",
    direct:
      "Order API calls Inventory over HTTP. If Inventory is slow or down, checkout waits or fails.",
    kafka:
      "Inventory reads OrderPlaced, reserves stock, publishes StockReserved. Order API is already done.",
  },
  {
    id: "email",
    label: "Send confirmation",
    direct:
      "Order API (or Inventory) calls Notifications. Another sync hop. Timeouts stack up.",
    kafka:
      "Notifications reads StockReserved and sends email. Add Shipping later — same event, no Order API change.",
  },
  {
    id: "scale",
    label: "Sale-day traffic spike",
    direct:
      "Every service must handle peak load at once. One slow dependency backs up the whole chain.",
    kafka:
      "Producers stay fast. Consumers read at their own pace. Scale readers independently.",
  },
];

export default function KafkaFlowCompare() {
  const [mode, setMode] = useState<"direct" | "kafka">("direct");
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <p className="text-sm text-[var(--muted)]">
          Same story, two architectures
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("direct")}
            className={[
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              mode === "direct"
                ? "border-[var(--fg)] text-[var(--fg)]"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
            ].join(" ")}>
            Direct HTTP chain
          </button>
          <button
            type="button"
            onClick={() => setMode("kafka")}
            className={[
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              mode === "kafka"
                ? "border-[var(--fg)] text-[var(--fg)]"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
            ].join(" ")}>
            Events via Kafka
          </button>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6">
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
              {i + 1}
            </button>
          ))}
        </div>

        <h4 className="mt-5 font-display text-xl text-[var(--fg)] sm:text-2xl">
          {step.label}
        </h4>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
          {mode === "direct" ? step.direct : step.kafka}
        </p>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-4">
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((i) => i - 1)}
            className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)] disabled:opacity-30">
            ← Previous
          </button>
          <span className="text-sm text-[var(--muted)]">
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
    </div>
  );
}
