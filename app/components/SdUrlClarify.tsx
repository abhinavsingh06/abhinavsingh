"use client";

import { useState } from "react";

interface ClarifyQuestion {
  id: string;
  prompt: string;
  whyAsk: string;
  options: { id: string; label: string; means: string }[];
}

const QUESTIONS: ClarifyQuestion[] = [
  {
    id: "traffic",
    prompt: "Do people create links, or mostly click them?",
    whyAsk: "This decides whether you optimize writes or the redirect path first.",
    options: [
      {
        id: "read-heavy",
        label: "Mostly clicks",
        means: "Design for fast GET /:code. Cache will matter more than fancy writes.",
      },
      {
        id: "balanced",
        label: "Both a lot",
        means: "Still protect redirects; also watch code generation under create load.",
      },
    ],
  },
  {
    id: "custom",
    prompt: "Can users pick the short code (like /launch)?",
    whyAsk: "Custom aliases add uniqueness fights, abuse, and reserved words.",
    options: [
      {
        id: "no",
        label: "No — we generate codes",
        means: "Simpler. Hash or counter both work. Good default for v1.",
      },
      {
        id: "yes",
        label: "Yes — custom aliases",
        means: "Extra uniqueness checks + moderation. Mention it; ship generated codes first if you can.",
      },
    ],
  },
  {
    id: "analytics",
    prompt: "Do we need click counts on day one?",
    whyAsk: "If yes, they must not sit on the redirect critical path.",
    options: [
      {
        id: "none",
        label: "Not for v1",
        means: "Redirect = lookup + 302. Cleanest interview answer.",
      },
      {
        id: "async",
        label: "Yes, but later is fine",
        means: "Return 302 first; log the click async (queue / Kafka). Never wait on analytics.",
      },
    ],
  },
];

export default function SdUrlClarify() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    traffic: "read-heavy",
    custom: "no",
    analytics: "none",
  });

  const q = QUESTIONS[step];
  const selected =
    q.options.find((o) => o.id === answers[q.id]) ?? q.options[0];
  const done = step >= QUESTIONS.length - 1;

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted)]">Ask before you draw</p>
          <p className="font-mono-xs text-[var(--muted)]">
            {step + 1} / {QUESTIONS.length}
          </p>
        </div>
        <div className="mt-3 flex gap-1.5">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={[
                "h-1 flex-1 rounded-full",
                i <= step ? "bg-[var(--accent)]" : "bg-[var(--line)]",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6">
        <h4 className="font-display text-2xl text-[var(--fg)]">{q.prompt}</h4>
        <p className="mt-2 text-sm text-[var(--muted)]">{q.whyAsk}</p>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {q.options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() =>
                setAnswers((prev) => ({ ...prev, [q.id]: o.id }))
              }
              className={[
                "rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                answers[q.id] === o.id
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg)]"
                  : "border-[var(--line)] text-[var(--fg-2)] hover:border-[var(--fg)]",
              ].join(" ")}>
              {o.label}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
          <p className="font-mono-xs text-[var(--accent)]">What that means</p>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--fg-2)]">
            {selected.means}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)] disabled:opacity-30">
            ← Back
          </button>
          {!done ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)]">
              Next question →
            </button>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Good — now estimate traffic, then design the two APIs.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
