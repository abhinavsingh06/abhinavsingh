"use client";

import { useMemo, useState } from "react";

interface LogRecord {
  offset: number;
  key: string;
  value: string;
}

interface LabStep {
  id: string;
  label: string;
  headline: string;
  body: string;
  detail: string;
  log: LogRecord[];
  consumerOnline: boolean;
  consumerOffset: number | null;
  highlightOffset?: number;
}

const STEPS: LabStep[] = [
  {
    id: "empty",
    label: "Start",
    headline: "Topic `orders` is empty",
    body: "Broker is up. No producers have written yet. Consumer is not running.",
    detail: "Offset has not started — the log is a blank file waiting for the first append.",
    log: [],
    consumerOnline: false,
    consumerOffset: null,
  },
  {
    id: "produce",
    label: "Produce",
    headline: "Producer sends OrderPlaced",
    body: 'Order API appends key `order-8841`, value `{"event":"OrderPlaced"}`.',
    detail: "Kafka assigns offset 0. The producer can return; Inventory does not need to be awake.",
    log: [
      {
        offset: 0,
        key: "order-8841",
        value: '{"event":"OrderPlaced"}',
      },
    ],
    consumerOnline: false,
    consumerOffset: null,
    highlightOffset: 0,
  },
  {
    id: "consume",
    label: "Consume",
    headline: "Consumer starts and reads offset 0",
    body: "Inventory comes online, joins group `inventory`, reads from earliest (or committed) offset.",
    detail: "It processes OrderPlaced, then commits — bookmark moves to “next is 1.”",
    log: [
      {
        offset: 0,
        key: "order-8841",
        value: '{"event":"OrderPlaced"}',
      },
    ],
    consumerOnline: true,
    consumerOffset: 1,
    highlightOffset: 0,
  },
  {
    id: "down",
    label: "Down",
    headline: "Stop the consumer — keep producing",
    body: "Inventory crashes (or you Ctrl+C). Order API still publishes order-9912 and order-2201.",
    detail: "Messages pile up in the log. Nothing is lost. The consumer’s last commit stays at 1.",
    log: [
      {
        offset: 0,
        key: "order-8841",
        value: '{"event":"OrderPlaced"}',
      },
      {
        offset: 1,
        key: "order-9912",
        value: '{"event":"OrderPlaced"}',
      },
      {
        offset: 2,
        key: "order-2201",
        value: '{"event":"OrderPlaced"}',
      },
    ],
    consumerOnline: false,
    consumerOffset: 1,
  },
  {
    id: "catchup",
    label: "Catch up",
    headline: "Consumer returns — reads 1, then 2",
    body: "Inventory restarts. It resumes after the last committed offset and drains the backlog.",
    detail: "That is the Post 1 story in real bytes: down for a while, still caught up from the log.",
    log: [
      {
        offset: 0,
        key: "order-8841",
        value: '{"event":"OrderPlaced"}',
      },
      {
        offset: 1,
        key: "order-9912",
        value: '{"event":"OrderPlaced"}',
      },
      {
        offset: 2,
        key: "order-2201",
        value: '{"event":"OrderPlaced"}',
      },
    ],
    consumerOnline: true,
    consumerOffset: 3,
    highlightOffset: 2,
  },
];

export default function KafkaProduceConsumeLab() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  const lag = useMemo(() => {
    if (step.consumerOffset === null) return step.log.length;
    return Math.max(0, step.log.length - step.consumerOffset);
  }, [step]);

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Produce → log → consume</p>
        <p className="mt-1 font-mono-xs text-[var(--accent)]">
          topic · orders · one partition
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
                {s.label}
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono-xs text-[var(--muted)]">Partition 0 log</p>
            <p className="font-mono-xs text-[var(--muted)]">
              consumer{" "}
              <span
                className={
                  step.consumerOnline
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted)]"
                }>
                {step.consumerOnline ? "online" : "offline"}
              </span>
              {step.consumerOffset !== null ? (
                <>
                  {" "}
                  · next offset{" "}
                  <span className="text-[var(--fg)]">{step.consumerOffset}</span>
                </>
              ) : null}
              {lag > 0 ? (
                <>
                  {" "}
                  · lag <span className="text-[var(--accent)]">{lag}</span>
                </>
              ) : null}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {step.log.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[var(--line)] px-3 py-8 text-center font-mono-xs text-[var(--muted)]">
                empty log
              </div>
            ) : (
              step.log.map((record) => {
                const isHighlight = step.highlightOffset === record.offset;
                const consumed =
                  step.consumerOffset !== null &&
                  record.offset < step.consumerOffset;
                return (
                  <div
                    key={record.offset}
                    className={[
                      "rounded-lg border px-3 py-2 font-mono-xs transition-colors",
                      isHighlight
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : consumed
                          ? "border-[var(--line)] text-[var(--muted)]"
                          : "border-[var(--line)] text-[var(--fg-2)]",
                    ].join(" ")}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[var(--accent)]">
                        offset {record.offset}
                      </span>
                      <span className="text-[var(--muted)]">·</span>
                      <span>key={record.key}</span>
                    </div>
                    <p className="mt-1 break-all text-[var(--fg)]">
                      {record.value}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
