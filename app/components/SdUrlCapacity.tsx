"use client";

import { useMemo, useState } from "react";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 100) / 10}K`;
  return String(Math.round(n));
}

/** Presets beat four mystery sliders — one clear story each. */
const PRESETS = [
  {
    id: "startup",
    label: "Startup",
    urlsPerMonthM: 10,
    readsPerWrite: 50,
    blurb: "Small write rate. One DB often fine; still cache hot links.",
  },
  {
    id: "mid",
    label: "Growing product",
    urlsPerMonthM: 100,
    readsPerWrite: 100,
    blurb: "Classic interview case. Reads crush writes — cache redirects first.",
  },
  {
    id: "huge",
    label: "Viral scale",
    urlsPerMonthM: 500,
    readsPerWrite: 200,
    blurb: "App replicas + cache are mandatory. Plan DB growth and hot keys.",
  },
] as const;

export default function SdUrlCapacity() {
  const [presetId, setPresetId] = useState<(typeof PRESETS)[number]["id"]>(
    "mid"
  );
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[1];

  const math = useMemo(() => {
    const writesPerMonth = preset.urlsPerMonthM * 1_000_000;
    const writeQps = writesPerMonth / (30 * 24 * 3600);
    const readQps = writeQps * preset.readsPerWrite;
    const storage5yGb =
      (writesPerMonth * 12 * 5 * 500) / (1024 * 1024 * 1024);
    return { writeQps, readQps, storage5yGb };
  }, [preset]);

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Rough size — pick a world</p>
        <p className="mt-1 text-[15px] text-[var(--fg-2)]">
          You do not need perfect math. You need write QPS, read QPS, and which is bigger.
        </p>
      </div>

      <div className="px-4 py-5 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPresetId(p.id)}
              className={[
                "rounded-md border px-3 py-1.5 text-sm transition-colors",
                presetId === p.id
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
              ].join(" ")}>
              {p.label}
            </button>
          ))}
        </div>

        <p className="mt-4 font-mono-xs text-[var(--muted)]">
          {preset.urlsPerMonthM}M new URLs / month · {preset.readsPerWrite}:1
          reads:writes
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
            <p className="font-mono-xs text-[var(--muted)]">Creates</p>
            <p className="mt-2 font-display text-3xl text-[var(--fg)]">
              ~{formatNumber(math.writeQps)}
              <span className="ml-1 text-base text-[var(--muted)]">/s</span>
            </p>
          </div>
          <div className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] p-4">
            <p className="font-mono-xs text-[var(--accent)]">Redirects</p>
            <p className="mt-2 font-display text-3xl text-[var(--accent)]">
              ~{formatNumber(math.readQps)}
              <span className="ml-1 text-base text-[var(--muted)]">/s</span>
            </p>
          </div>
          <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
            <p className="font-mono-xs text-[var(--muted)]">Storage ~5y</p>
            <p className="mt-2 font-display text-3xl text-[var(--fg)]">
              ~{math.storage5yGb < 10
                ? math.storage5yGb.toFixed(1)
                : Math.round(math.storage5yGb)}
              <span className="ml-1 text-base text-[var(--muted)]">GB</span>
            </p>
          </div>
        </div>

        <p className="mt-5 text-[15px] leading-relaxed text-[var(--fg-2)]">
          <span className="text-[var(--fg)]">Takeaway. </span>
          {preset.blurb}
        </p>
      </div>
    </div>
  );
}
