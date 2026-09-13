"use client";

import { useState } from "react";

interface PressureCase {
  id: string;
  label: string;
  symptom: string;
  wrong: string;
  right: string;
  why: string;
}

const CASES: PressureCase[] = [
  {
    id: "viral",
    label: "One link goes viral",
    symptom:
      "One tracking link from a big order email goes everywhere. DB CPU pegs. Creates still fine.",
    wrong: "Shard the database tonight",
    right: "Cache that code → URL. The write path is innocent.",
    why: "This is a hot-key read storm. Redis (or similar) turns millions of identical lookups into memory hits. Sharding a healthy write path is expensive theater.",
  },
  {
    id: "creates",
    label: "Create API is timing out",
    symptom:
      "Marketing batch-creates 2M short links. Redirects are fine. Create API timeouts spike.",
    wrong: "Add a CDN in front of GET",
    right: "Fix code minting: range-allocate IDs or retry-on-conflict random codes.",
    why: "CDN does nothing for POST /shorten. The pain is uniqueness under write burst — counter hotspot or collision retries.",
  },
  {
    id: "analytics",
    label: "Redirects got slow after charts",
    symptom:
      "Product wants live click charts. p99 redirect jumps from 12ms to 180ms after the change.",
    wrong: "Buy a bigger app instance",
    right: "302 first. Enqueue the click. Charts can lag a second.",
    why: "You put optional work on the critical path. The user clicking a shipping link should never wait on a dashboard.",
  },
  {
    id: "stale",
    label: "Updated URL, users see old page",
    symptom:
      "Ops updates a destination URL. Some users still land on the old page for minutes.",
    wrong: "Switch everything to 301 forever",
    right: "Invalidate or overwrite the cache key on update. Prefer 302 if destinations change.",
    why: "Stale Location is a cache-coherence bug (and sometimes browsers caching 301). Fix the write → cache contract.",
  },
];

export default function SdUrlPressure() {
  const [activeId, setActiveId] = useState(CASES[0].id);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({
    viral: false,
  });
  const active = CASES.find((c) => c.id === activeId) ?? CASES[0];
  const open = revealed[active.id] ?? false;

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Pressure test</p>
        <p className="mt-1 text-[15px] text-[var(--fg-2)]">
          Something is on fire. Pick the symptom — then the move that actually helps.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="border-b border-[var(--line)] lg:border-b-0 lg:border-r">
          {CASES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveId(c.id);
                setRevealed((prev) => ({ ...prev, [c.id]: prev[c.id] ?? false }));
              }}
              className={[
                "block w-full border-b border-[var(--line)] px-4 py-3.5 text-left text-sm leading-snug transition-colors last:border-b-0 sm:px-5",
                activeId === c.id
                  ? "bg-[var(--accent-soft)] text-[var(--fg)]"
                  : "text-[var(--fg-2)] hover:bg-[var(--bg)]",
              ].join(" ")}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="px-4 py-5 sm:px-6">
          <p className="font-mono-xs text-[var(--muted)]">Symptom</p>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--fg)]">
            {active.symptom}
          </p>

          {!open ? (
            <button
              type="button"
              onClick={() =>
                setRevealed((prev) => ({ ...prev, [active.id]: true }))
              }
              className="mt-5 rounded-md border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)]">
              Show the move →
            </button>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
                <p className="font-mono-xs text-[var(--muted)]">Trap</p>
                <p className="mt-2 text-[15px] text-[var(--fg-2)] line-through decoration-[var(--muted)]">
                  {active.wrong}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] p-4">
                <p className="font-mono-xs text-[var(--accent)]">Move</p>
                <p className="mt-2 text-[15px] font-medium text-[var(--fg)]">
                  {active.right}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--fg-2)]">
                  {active.why}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
