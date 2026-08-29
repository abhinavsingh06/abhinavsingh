"use client";

import { useState } from "react";

type Verdict = "good" | "maybe" | "skip";

interface Scenario {
  id: string;
  title: string;
  context: string;
  verdict: Verdict;
  why: string;
  alternative: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "analytics",
    title: "Many services need the same event",
    context:
      "Order placed → billing, email, inventory, fraud checks, and analytics all need to react.",
    verdict: "good",
    why: "Publish once, many independent consumers. Add a new subscriber without touching the producer.",
    alternative:
      "HTTP fan-out from one service creates a god-service and brittle coupling.",
  },
  {
    id: "replay",
    title: "New service needs yesterday's data",
    context:
      "You launch a reporting service and need to reprocess the last 30 days of orders.",
    verdict: "good",
    why: "Kafka keeps a durable log. Consumers can rewind and replay — if retention allows.",
    alternative:
      "Replaying from DB exports or rebuilding from scratch is painful at scale.",
  },
  {
    id: "rpc",
    title: "User waits for an immediate answer",
    context:
      "Login must return yes/no in under 200ms. The browser is blocked on the response.",
    verdict: "skip",
    why: "Request/response belongs on HTTP or gRPC. Kafka is async — great for side effects, not for the critical path answer.",
    alternative:
      "Use sync API for the question; publish events for audit or analytics after.",
  },
  {
    id: "tiny",
    title: "Side project, two services, low traffic",
    context:
      "You and a friend ship a weekend app. Postgres + a REST call between two services.",
    verdict: "skip",
    why: "Kafka adds brokers, topics, consumer groups, and ops you don't need yet.",
    alternative: "Start simple. Introduce Kafka when coupling or volume hurts.",
  },
  {
    id: "burst",
    title: "Spiky writes, steady processing",
    context:
      "Orders flood in when a sale opens at midnight; reports run all morning.",
    verdict: "good",
    why: "Kafka absorbs bursts. Producers stay fast; consumers drain the backlog at their pace.",
    alternative: "Sync chains force every service to peak together.",
  },
  {
    id: "ordering",
    title: "Strict global order for everything",
    context:
      "Every event in the company must be processed in one worldwide sequence.",
    verdict: "maybe",
    why: "Kafka orders per partition, not globally. One partition = one pipe. Global order is expensive and often wrong.",
    alternative:
      "Partition by key (order id, user id) when order matters locally.",
  },
];

const VERDICT_STYLE: Record<Verdict, string> = {
  good: "border-[var(--accent)] text-[var(--accent)]",
  maybe: "border-[var(--line)] text-[var(--fg-2)]",
  skip: "border-[var(--line)] text-[var(--muted)]",
};

const VERDICT_LABEL: Record<Verdict, string> = {
  good: "Kafka fits well",
  maybe: "Kafka can work — design carefully",
  skip: "Probably not Kafka",
};

export default function KafkaFitChecker() {
  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const active = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0];

  return (
    <div className="my-10 min-w-0 max-w-full border-t border-[var(--line)] pt-10">
      <p className="text-sm text-[var(--muted)]">When Kafka fits</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveId(s.id)}
            className={[
              "rounded-md border px-3 py-1.5 text-left text-sm transition-colors",
              activeId === s.id
                ? "border-[var(--fg)] text-[var(--fg)]"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
            ].join(" ")}>
            {s.title}
          </button>
        ))}
      </div>

      <article className="mt-8 max-w-2xl min-w-0">
        <h3 className="font-display text-2xl text-[var(--fg)] sm:text-3xl">
          {active.title}
        </h3>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
          {active.context}
        </p>
        <span
          className={`mt-6 inline-flex rounded-full border px-3 py-1 font-mono-xs font-semibold ${VERDICT_STYLE[active.verdict]}`}>
          {VERDICT_LABEL[active.verdict]}
        </span>
        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-[var(--fg-2)] sm:text-base">
          <p>
            <span className="text-[var(--fg)]">Why. </span>
            {active.why}
          </p>
          <p className="border-t border-[var(--line)] pt-6">
            <span className="text-[var(--fg)]">Instead. </span>
            {active.alternative}
          </p>
        </div>
      </article>
    </div>
  );
}
