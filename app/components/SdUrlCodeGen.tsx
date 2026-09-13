"use client";

import { useState } from "react";

type Choice = "hash" | "counter";

export default function SdUrlCodeGen() {
  const [choice, setChoice] = useState<Choice>("counter");

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <p className="text-sm text-[var(--muted)]">One decision: how codes are born</p>
      </div>

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setChoice("hash")}
          className={[
            "border-b px-4 py-5 text-left transition-colors sm:border-b-0 sm:border-r sm:px-6",
            choice === "hash"
              ? "border-[var(--line)] bg-[var(--accent-soft)]"
              : "border-[var(--line)] bg-transparent hover:bg-[var(--bg)]",
          ].join(" ")}>
          <p
            className={[
              "font-mono-xs",
              choice === "hash" ? "text-[var(--accent)]" : "text-[var(--muted)]",
            ].join(" ")}>
            Option A
          </p>
          <p className="mt-2 font-display text-xl text-[var(--fg)]">
            Hash the URL
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--fg-2)]">
            Take a hash, keep 7 characters. Same URL can get the same code.
            Collision? Lengthen or retry.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setChoice("counter")}
          className={[
            "px-4 py-5 text-left transition-colors sm:px-6",
            choice === "counter" ? "bg-[var(--accent-soft)]" : "hover:bg-[var(--bg)]",
          ].join(" ")}>
          <p
            className={[
              "font-mono-xs",
              choice === "counter"
                ? "text-[var(--accent)]"
                : "text-[var(--muted)]",
            ].join(" ")}>
            Option B
          </p>
          <p className="mt-2 font-display text-xl text-[var(--fg)]">
            Counter → base62
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--fg-2)]">
            Increment an ID, encode it. Unique if the counter is unique.
            Watch the counter become a hotspot at high create QPS.
          </p>
        </button>
      </div>

      <div className="border-t border-[var(--line)] bg-[var(--bg)] px-4 py-4 sm:px-6">
        <p className="text-[15px] leading-relaxed text-[var(--fg-2)]">
          <span className="text-[var(--fg)]">Say this out loud. </span>
          {choice === "hash"
            ? "“I’ll hash and truncate; on unique-index conflict I retry with more bits or a salt.”"
            : "“I’ll use a counter encoded in base62; I’ll allocate ID ranges so one row isn’t locked by every create.”"}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          {choice === "hash"
            ? "Nice side effect: identical long URLs can share a code if you want dedupe. Bad side effect: truncation shrinks the hash space — always plan the retry."
            : "Nice side effect: codes are unique by construction. Bad side effect: predictable codes (enumerable). Rate-limit GETs or use opaque random IDs if that worries you."}
        </p>
      </div>
    </div>
  );
}
