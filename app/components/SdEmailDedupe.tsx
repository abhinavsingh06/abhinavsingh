"use client";

import { useState } from "react";

const FRAMES = [
  {
    label: "First",
    headline: "Shipped email for order-9912",
    body: "Notifications receives one fact: this order shipped. It sends the email and records the key.",
    sent: 1,
    key: "new" as const,
  },
  {
    label: "Again",
    headline: "The same fact arrives again",
    body: "Inventory’s duplicate, a retry, or a second consumer. The payload is identical. The customer must not get a second email.",
    sent: 1,
    key: "seen" as const,
  },
  {
    label: "Skip",
    headline: "The key is already there",
    body: "order-9912 + shipped hits the unique row. No insert. No send. The second delivery is a no-op.",
    sent: 1,
    key: "skip" as const,
  },
];

export default function SdEmailDedupe() {
  const [step, setStep] = useState(0);
  const frame = FRAMES[step];

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3 sm:px-6">
        <p className="text-sm text-[var(--muted)]">One customer, one shipped email</p>
        <p className="font-mono-xs text-[var(--accent)]">
          {step + 1} / {FRAMES.length}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="space-y-3 border-b border-[var(--line)] px-4 py-5 sm:px-6 lg:border-b-0 lg:border-r">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-3">
            <p className="font-mono-xs text-[var(--muted)]">Incoming</p>
            <p className="mt-1 text-sm text-[var(--fg)]">order-9912 · shipped</p>
          </div>
          <div
            className={[
              "rounded-lg border px-3 py-3",
              frame.key === "skip"
                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--line)] bg-[var(--bg)]",
            ].join(" ")}>
            <p className="font-mono-xs text-[var(--muted)]">sends row</p>
            <p className="mt-1 font-mono-xs text-[var(--fg)]">order-9912:shipped</p>
            <p className="mt-2 text-sm text-[var(--fg-2)]">
              {frame.key === "new"
                ? "Inserted. Email goes out."
                : frame.key === "seen"
                  ? "Already stored from the first delivery."
                  : "Conflict. Insert skipped. Inbox stays at one."}
            </p>
          </div>
          <p className="font-mono-xs text-[var(--accent)]">Emails in the inbox: {frame.sent}</p>
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
