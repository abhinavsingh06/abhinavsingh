"use client";

import { useState } from "react";

interface Pitfall {
  id: string;
  title: string;
  symptom: string;
  cause: string;
  fix: string;
}

const PITFALLS: Pitfall[] = [
  {
    id: "advertised",
    title: "Can't connect from host",
    symptom:
      "Producer times out or “Connection to node -1” from your laptop.",
    cause:
      "Advertised listener is the container hostname, not localhost — clients get the wrong address after metadata.",
    fix: "Set advertised listeners to localhost:9092 for local Docker. Match port maps to what clients use.",
  },
  {
    id: "from-beginning",
    title: "Consumer prints nothing",
    symptom: "You produced messages, then started a consumer — empty output.",
    cause:
      "New consumer groups default to latest. They only see records written *after* they start.",
    fix: "Use --from-beginning for learning, or produce again after the consumer is running.",
  },
  {
    id: "key-format",
    title: "Key looks wrong / null",
    symptom: "Console consumer shows null keys even though you typed a key.",
    cause: "Console producer needs parse.key + key.separator — otherwise the whole line is the value.",
    fix: 'Pass --property parse.key=true --property key.separator=: and send order-8841:{"event":"OrderPlaced"}.',
  },
  {
    id: "group-id",
    title: "Two terminals steal messages",
    symptom: "Two consumers with the same group id — each message goes to only one of them.",
    cause: "Same group = competing consumers on a partition. That is intentional for scale-out.",
    fix: "Different group ids to both read the full log (fan-out). Same group to share load. Post 4 digs in.",
  },
];

export default function KafkaLocalPitfalls() {
  const [activeId, setActiveId] = useState(PITFALLS[0].id);
  const active = PITFALLS.find((p) => p.id === activeId) ?? PITFALLS[0];

  return (
    <div className="my-10 min-w-0 max-w-full border-t border-[var(--line)] pt-10">
      <p className="text-sm text-[var(--muted)]">When local Kafka fights back</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {PITFALLS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveId(p.id)}
            className={[
              "rounded-md border px-3 py-1.5 text-left text-sm transition-colors",
              activeId === p.id
                ? "border-[var(--fg)] text-[var(--fg)]"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
            ].join(" ")}>
            {p.title}
          </button>
        ))}
      </div>

      <article className="mt-8 max-w-2xl min-w-0">
        <h3 className="font-display text-2xl text-[var(--fg)] sm:text-3xl">
          {active.title}
        </h3>
        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
          <p>
            <span className="text-[var(--fg)]">Symptom. </span>
            {active.symptom}
          </p>
          <p className="border-t border-[var(--line)] pt-6">
            <span className="text-[var(--fg)]">Cause. </span>
            {active.cause}
          </p>
          <p className="border-t border-[var(--line)] pt-6">
            <span className="text-[var(--fg)]">Fix. </span>
            {active.fix}
          </p>
        </div>
      </article>
    </div>
  );
}
