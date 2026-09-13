"use client";

import { useState } from "react";

type Mode = "create" | "redirect";

interface SeqMessage {
  from: number;
  to: number;
  label: string;
  note: string;
  dashed?: boolean;
}

interface SeqScene {
  id: Mode;
  label: string;
  actors: string[];
  messages: SeqMessage[];
  takeaway: string;
}

const SCENES: SeqScene[] = [
  {
    id: "create",
    label: "Create",
    actors: ["Client", "App", "DB"],
    messages: [
      {
        from: 0,
        to: 1,
        label: "POST /shorten { url }",
        note: "User pastes a long URL — often from an order confirmation or campaign page.",
      },
      {
        from: 1,
        to: 1,
        label: "Mint short code",
        note: "Hash or counter → base62. App owns uniqueness; the database only stores the mapping.",
      },
      {
        from: 1,
        to: 2,
        label: "INSERT code → long_url",
        note: "Unique index on code. Collision? Retry with a new code — do not return a half-created link.",
      },
      {
        from: 2,
        to: 1,
        label: "ok / unique violation",
        dashed: true,
        note: "Success continues. Unique violation loops back to mint. Say this failure mode out loud.",
      },
      {
        from: 1,
        to: 0,
        label: "201 { shortUrl }",
        dashed: true,
        note: "Create ends here. Cache is optional on writes — redirects are where it pays for itself.",
      },
    ],
    takeaway:
      "Create is a write: validate → mint unique code → persist → return.",
  },
  {
    id: "redirect",
    label: "Redirect",
    actors: ["Client", "App", "Cache", "DB"],
    messages: [
      {
        from: 0,
        to: 1,
        label: "GET /aB3xK9",
        note: "Hottest path in the system. Latency and availability matter more here than on create.",
      },
      {
        from: 1,
        to: 2,
        label: "GET code",
        note: "Check cache first. Viral links almost always hit — that is the whole point of the cache.",
      },
      {
        from: 2,
        to: 1,
        label: "miss (hit → skip DB)",
        dashed: true,
        note: "Hit? Jump to the 302. Miss? Continue to the database. Do not pretend every request is a miss.",
      },
      {
        from: 1,
        to: 3,
        label: "SELECT by code",
        note: "Primary-key / KV lookup. Missing or expired → 404. No joins.",
      },
      {
        from: 3,
        to: 1,
        label: "long_url",
        dashed: true,
        note: "App has the destination. Warm the cache, then redirect — in that order of thinking.",
      },
      {
        from: 1,
        to: 2,
        label: "SET code → url (TTL)",
        note: "Next click skips the database. Invalidate this key if the destination ever changes.",
      },
      {
        from: 1,
        to: 0,
        label: "302 Location: …",
        dashed: true,
        note: "Return now. Log the click async if you need charts — never block the 302 on analytics.",
      },
    ],
    takeaway:
      "Redirect is a read: cache → DB on miss → 302. Side effects after the response.",
  },
];

const ACTOR_W = 70;
const ACTOR_H = 32;
const LANE_GAP = 150;
const PAD_X = 48;
const SVG_H = 200;
const Y_ARROW = 118;

function viewWidth(count: number): number {
  return PAD_X * 2 + Math.max((count - 1) * LANE_GAP, LANE_GAP);
}

function laneX(index: number, count: number): number {
  const track = (count - 1) * LANE_GAP;
  const origin = (viewWidth(count) - track) / 2;
  return origin + index * LANE_GAP;
}

function HopSvg({
  actors,
  from,
  to,
  label,
  dashed,
}: {
  actors: string[];
  from: number;
  to: number;
  label: string;
  dashed?: boolean;
}) {
  const n = actors.length;
  const w = viewWidth(n);
  const self = from === to;
  const x1 = laneX(from, n);
  const x2 = laneX(to, n);
  const markerId = `arrow-${from}-${to}-${dashed ? "d" : "s"}-${n}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${SVG_H}`}
      width="100%"
      className="mx-auto block h-auto"
      style={{ maxHeight: 240 }}
      role="img"
      aria-label={`${actors[from]} to ${actors[to]}: ${label}`}>
      <defs>
        <marker
          id={markerId}
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
          markerUnits="userSpaceOnUse">
          <path d="M0,0 L10,5 L0,10 Z" fill="var(--accent)" />
        </marker>
      </defs>

      {actors.map((actor, i) => {
        const x = laneX(i, n);
        const on = i === from || i === to;
        return (
          <g key={actor}>
            <rect
              x={x - ACTOR_W / 2}
              y={16}
              width={ACTOR_W}
              height={ACTOR_H}
              rx={7}
              fill={on ? "var(--accent-soft)" : "var(--bg-2)"}
              stroke={on ? "var(--accent)" : "var(--line-strong)"}
              strokeWidth={on ? 1.75 : 1}
            />
            <text
              x={x}
              y={16 + ACTOR_H / 2 + 4}
              textAnchor="middle"
              fill={on ? "var(--accent)" : "var(--muted)"}
              style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}>
              {actor}
            </text>
            <line
              x1={x}
              y1={16 + ACTOR_H + 8}
              x2={x}
              y2={SVG_H - 20}
              stroke="var(--line)"
              strokeDasharray="5 6"
              strokeWidth={1.25}
            />
          </g>
        );
      })}

      {self ? (
        <g>
          <path
            d={`M ${x1} ${Y_ARROW - 18} H ${x1 + 42} V ${Y_ARROW + 18} H ${x1}`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2.25}
            markerEnd={`url(#${markerId})`}
          />
          <text
            x={x1 + 50}
            y={Y_ARROW + 5}
            fill="var(--accent)"
            style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}>
            {label}
          </text>
        </g>
      ) : (
        <g>
          <text
            x={(x1 + x2) / 2}
            y={Y_ARROW - 16}
            textAnchor="middle"
            fill="var(--accent)"
            style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}>
            {label}
          </text>
          <line
            x1={x1}
            y1={Y_ARROW}
            x2={x2 > x1 ? x2 - 3 : x2 + 3}
            y2={Y_ARROW}
            stroke="var(--accent)"
            strokeWidth={2.25}
            strokeDasharray={dashed ? "7 6" : undefined}
            markerEnd={`url(#${markerId})`}
          />
        </g>
      )}
    </svg>
  );
}

export default function SdUrlSequence() {
  const [mode, setMode] = useState<Mode>("create");
  const [step, setStep] = useState(0);

  const scene = SCENES.find((s) => s.id === mode) ?? SCENES[0];
  const msg = scene.messages[step];

  const switchMode = (next: Mode) => {
    setMode(next);
    setStep(0);
  };

  return (
    <div className="my-8 min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Sequence — one hop</p>
        <div className="flex gap-2">
          {SCENES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => switchMode(s.id)}
              className={[
                "rounded-md border px-3 py-1.5 text-sm transition-colors",
                mode === s.id
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-2)]",
              ].join(" ")}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Full-width diagram — never squeezed into a half column */}
      <div className="border-b border-[var(--line)] bg-[var(--bg)] px-3 py-6 sm:px-8 sm:py-8">
        <HopSvg
          key={`${mode}-${step}`}
          actors={scene.actors}
          from={msg.from}
          to={msg.to}
          label={msg.label}
          dashed={msg.dashed}
        />
      </div>

      <div className="px-4 py-5 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-mono-xs text-[var(--accent)]">
            {scene.label} · {step + 1} / {scene.messages.length}
          </p>
          <p className="font-mono-xs text-[var(--muted)]">
            {scene.actors[msg.from]} → {scene.actors[msg.to]}
          </p>
        </div>
        <h4 className="mt-2 font-display text-xl text-[var(--fg)]">
          {msg.label}
        </h4>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--fg-2)]">
          {msg.note}
        </p>
        {step === scene.messages.length - 1 ? (
          <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
            {scene.takeaway}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {scene.messages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                aria-label={`Hop ${i + 1}`}
                className={[
                  "min-w-[1.75rem] rounded-md border px-2 py-1 font-mono-xs transition-colors",
                  i === step
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : i < step
                      ? "border-[var(--line)] text-[var(--fg-2)]"
                      : "border-[var(--line)] text-[var(--muted)]",
                ].join(" ")}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
              className="rounded-md border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)] disabled:opacity-30">
              ← Prev
            </button>
            {step < scene.messages.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="rounded-md border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)]">
                Next hop →
              </button>
            ) : mode === "create" ? (
              <button
                type="button"
                onClick={() => switchMode("redirect")}
                className="rounded-md border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)]">
                Now redirect →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchMode("create")}
                className="rounded-md border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]">
                Replay create
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
