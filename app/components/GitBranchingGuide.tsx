"use client";

import { useState } from "react";

interface Scenario {
  id: string;
  emoji: string;
  question: string;
  technique: string;
  commands: string[];
  tip: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "new-feature",
    emoji: "🌿",
    question: "Start a new feature",
    technique: "Feature branch",
    commands: [
      "git checkout main && git pull origin main",
      "git checkout -b feature/my-feature",
      "git add . && git commit -m 'Add feature'",
      "git push -u origin feature/my-feature",
    ],
    tip: "Always branch from up-to-date main. Open a PR when ready.",
  },
  {
    id: "sync-main",
    emoji: "🔄",
    question: "Main moved ahead — sync my branch",
    technique: "Pull + rebase or merge",
    commands: [
      "git checkout feature/my-feature",
      "git fetch origin",
      "git rebase origin/main    # cleaner history (solo branch)",
      "# OR: git merge origin/main   # safer with collaborators",
      "git push --force-with-lease  # only after rebase",
    ],
    tip: "Rebase if it's your branch alone. Merge if teammates share it.",
  },
  {
    id: "combine-work",
    emoji: "🔀",
    question: "Merge my feature into main",
    technique: "Merge",
    commands: [
      "git checkout main && git pull origin main",
      "git merge feature/my-feature",
      "git push origin main",
      "git branch -d feature/my-feature",
    ],
    tip: "On GitHub, merging the PR does this for you.",
  },
  {
    id: "conflict",
    emoji: "⚡",
    question: "Fix a merge conflict",
    technique: "Manual resolution",
    commands: [
      "# Open file — remove <<<<<<< ======= >>>>>>> markers",
      "git add conflicted-file.js",
      'git commit -m "Resolve conflict"',
    ],
    tip: "git status tells you which files need fixing.",
  },
  {
    id: "park-work",
    emoji: "📦",
    question: "Switch tasks mid-work",
    technique: "Stash",
    commands: [
      "git stash push -m 'WIP'",
      "git checkout main",
      "# ... do other work ...",
      "git checkout feature/my-feature",
      "git stash pop",
    ],
    tip: "Stash for quick switches. Commit if you'll be away more than a day.",
  },
  {
    id: "undo-local",
    emoji: "↩️",
    question: "Undo my last commit (not pushed)",
    technique: "Reset",
    commands: [
      "git reset --soft HEAD~1   # undo commit, keep staged",
      "git reset HEAD~1          # undo commit, keep unstaged",
      "git restore <file>        # discard uncommitted changes",
    ],
    tip: "Never reset commits that others have already pulled.",
  },
  {
    id: "undo-pushed",
    emoji: "🛡️",
    question: "Undo a commit already on main",
    technique: "Revert",
    commands: [
      "git revert abc1234",
      "git push origin main",
    ],
    tip: "Revert adds a new commit that undoes the bad one. Safe for shared branches.",
  },
  {
    id: "hotfix",
    emoji: "🚨",
    question: "Urgent production fix",
    technique: "Hotfix branch",
    commands: [
      "git checkout main && git pull",
      "git checkout -b hotfix/critical-bug",
      "git add . && git commit -m 'Fix production bug'",
      "git push -u origin hotfix/critical-bug",
      "# Merge PR to main immediately",
    ],
    tip: "Cut hotfix from main, fix, merge back, deploy.",
  },
  {
    id: "clean-pr",
    emoji: "✨",
    question: "Clean up commits before PR",
    technique: "Interactive rebase",
    commands: [
      "git rebase -i HEAD~3",
      "# pick = keep, squash = combine, reword = edit message",
      "git push --force-with-lease",
    ],
    tip: "Squash WIP commits into one clear commit before review.",
  },
  {
    id: "daily-start",
    emoji: "☀️",
    question: "Start my work day",
    technique: "Daily sync",
    commands: [
      "git checkout main && git pull origin main",
      "git checkout feature/my-feature",
      "git merge main   # or: git rebase main",
      "git status",
    ],
    tip: "Always pull main first. Resolve conflicts early, not at PR time.",
  },
];

export default function GitBranchingGuide() {
  const [selected, setSelected] = useState<string | null>(null);
  const scenario = SCENARIOS.find((s) => s.id === selected);

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-5 py-4 sm:px-6">
        <h3 className="font-display text-lg text-[var(--fg)]">
          What do you want to do?
        </h3>
        <p className="mt-1 text-sm text-[var(--fg-2)]">
          Daily Git situations — pick one for the commands.
        </p>
      </div>

      <div className="grid gap-2 p-4 sm:grid-cols-2 sm:p-6">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id === selected ? null : s.id)}
            className={[
              "rounded-lg border p-4 text-left transition-all",
              selected === s.id
                ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-[0_0_20px_var(--accent-glow)]"
                : "border-[var(--line)] bg-[var(--bg)] hover:border-[var(--accent)]/50",
            ].join(" ")}>
            <span className="text-xl">{s.emoji}</span>
            <p className="mt-2 font-medium text-[var(--fg)]">{s.question}</p>
            <p className="mt-1 font-mono-xs text-[var(--muted)]">{s.technique}</p>
          </button>
        ))}
      </div>

      {scenario && (
        <div className="border-t border-[var(--line)] bg-[var(--bg)] p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{scenario.emoji}</span>
            <span className="font-mono-xs text-[var(--muted)]">{scenario.technique}</span>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--bg-elev-2)] p-4 font-mono text-xs leading-relaxed text-[var(--fg-2)] sm:text-sm">
            {scenario.commands.join("\n")}
          </pre>
          <p className="mt-4 rounded-lg border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--fg-2)]">
            <strong className="text-[var(--accent)]">Tip: </strong>
            {scenario.tip}
          </p>
        </div>
      )}
    </div>
  );
}
