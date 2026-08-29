"use client";

import { useState, useEffect } from "react";
import { postSlugFromPollId, trackPollVote } from "@/lib/analytics";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollProps {
  question: string;
  options: PollOption[];
  pollId: string;
}

export default function Poll({
  question,
  options: initialOptions,
  pollId,
}: PollProps) {
  const [options, setOptions] = useState(initialOptions);
  const [selected, setSelected] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    setOptions(initialOptions);
    setSelected(null);
    setHasVoted(false);

    const voted = localStorage.getItem(`poll-${pollId}`);
    if (!voted) return;

    const saved = localStorage.getItem(`poll-results-${pollId}`);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as PollOption[];
      const sameShape =
        parsed.length === initialOptions.length &&
        parsed.every((opt, i) => opt.text === initialOptions[i]?.text);
      if (sameShape) {
        setOptions(parsed);
        setHasVoted(true);
        setSelected(voted);
      }
    } catch {
      // ignore corrupt local storage
    }
  }, [pollId, initialOptions]);

  const handleVote = (optionId: string) => {
    if (hasVoted) return;

    setSelected(optionId);
    setHasVoted(true);

    const updated = options.map((opt) =>
      opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
    );
    setOptions(updated);

    localStorage.setItem(`poll-${pollId}`, optionId);
    localStorage.setItem(`poll-results-${pollId}`, JSON.stringify(updated));

    const optionText = options.find((opt) => opt.id === optionId)?.text ?? optionId;
    trackPollVote(postSlugFromPollId(pollId), pollId, optionText);
  };

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="my-8 min-w-0 max-w-full rounded-xl border border-[var(--line)] bg-[var(--bg-2)] p-4 sm:p-6">
      <p className="font-mono-xs mb-2 text-[var(--muted)]">Quick poll</p>
      <h3 className="font-display text-xl text-[var(--fg)] sm:text-2xl">
        {question}
      </h3>
      <div className="mt-4 space-y-2">
        {options.map((option) => {
          const percentage =
            totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          const isSelected = selected === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleVote(option.id)}
              disabled={hasVoted}
              className={[
                "w-full rounded-lg border p-3 text-left transition-colors sm:p-4",
                isSelected
                  ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                  : "border-[var(--line)] bg-[var(--bg)] hover:border-[var(--fg)]",
                hasVoted ? "cursor-default" : "cursor-pointer",
              ].join(" ")}>
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`text-sm sm:text-base ${
                    isSelected ? "text-[var(--fg)]" : "text-[var(--fg-2)]"
                  }`}>
                  {option.text}
                </span>
                {hasVoted ? (
                  <span className="shrink-0 font-mono-xs text-[var(--muted)]">
                    {percentage.toFixed(0)}%
                  </span>
                ) : null}
              </div>
              {hasVoted ? (
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--line)]">
                  <div
                    className="h-full bg-[var(--accent)] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
      {hasVoted ? (
        <p className="mt-3 font-mono-xs text-[var(--muted)]">
          {totalVotes} {totalVotes === 1 ? "vote" : "votes"} · local to your
          browser
        </p>
      ) : (
        <p className="mt-3 font-mono-xs text-[var(--muted)]">
          Tap an option — results stay on this device only.
        </p>
      )}
    </div>
  );
}
