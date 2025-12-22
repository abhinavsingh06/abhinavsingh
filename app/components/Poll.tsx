"use client";

import { useState, useEffect } from "react";

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
    // Defer state updates to avoid synchronous setState in effect
    setTimeout(() => {
      // Check if user has already voted
      const voted = localStorage.getItem(`poll-${pollId}`);
      if (voted) {
        setHasVoted(true);
        setSelected(voted);
        // Load saved results
        const saved = localStorage.getItem(`poll-results-${pollId}`);
        if (saved) {
          setOptions(JSON.parse(saved));
        }
      }
    }, 0);
  }, [pollId]);

  const handleVote = (optionId: string) => {
    if (hasVoted) return;

    setSelected(optionId);
    setHasVoted(true);

    // Update votes
    const updated = options.map((opt) =>
      opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
    );
    setOptions(updated);

    // Save to localStorage
    localStorage.setItem(`poll-${pollId}`, optionId);
    localStorage.setItem(`poll-results-${pollId}`, JSON.stringify(updated));
  };

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="ocean-card my-6 sm:my-8 rounded-xl p-4 sm:p-6 shadow-lg">
      <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">
        {question}
      </h3>
      <div className="space-y-2 sm:space-y-3">
        {options.map((option) => {
          const percentage =
            totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          const isSelected = selected === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted}
              className={`w-full rounded-lg border-2 p-3 sm:p-4 text-left transition-all duration-300 ${
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                  : "border-blue-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50 dark:hover:bg-blue-900/30"
              } ${hasVoted ? "cursor-default" : "cursor-pointer"}`}>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-sm sm:text-base font-medium ${
                    isSelected
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-blue-800 dark:text-blue-200"
                  }`}>
                  {option.text}
                </span>
                {hasVoted && (
                  <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0">
                    {percentage.toFixed(1)}%
                  </span>
                )}
              </div>
              {hasVoted && (
                <div className="mt-2 h-1.5 sm:h-2 overflow-hidden rounded-full bg-blue-200 dark:bg-blue-900">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {hasVoted && (
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-600 dark:text-blue-400">
          {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
        </p>
      )}
    </div>
  );
}
