---
title: Is Git Confusing? A Git Crash Course to Get You Started!
excerpt: An interactive Git crash course — step-through animations for daily workflows, branching strategies you can play through, and a scenario picker for everyday situations.
date: 2024-12-21
category: Git
featured: true
---

# Is Git Confusing? A Git Crash Course to Get You Started!

Git might seem confusing at first — branches, merges, rebases, conflicts. But underneath it all, Git is just a **time machine for your code**. This guide is interactive: step through the animations, play through branching strategies, and use the scenario picker when you're stuck.

---

## What is Git?

Git tracks every snapshot (commit) of your code. Don't like the latest version? Go back to any earlier one.

[POLL:Have you used Git before?|Yes, daily|A few times|Never — this is new]

---

## Git's 5 Staging Areas

1. **Working Directory** — where you edit files
2. **Staging** — preview of your next snapshot
3. **Commit Tree** — saved history
4. **Stash** — temporary storage
5. **Remote** — GitHub / GitLab in the cloud

### Interactive: Add → Commit → Push

[GIT-WORKFLOW:workflow]

### Interactive: Stash & Pop

[GIT-WORKFLOW:stash]

---

## Daily Git Commands

These are the commands you'll actually use every day.

```bash
git status                    # what changed?
git diff                      # show line-by-line changes
git add .                     # stage everything
git commit -m "message"       # save snapshot
git push origin main          # upload to remote
git pull origin main          # download + merge latest
git checkout -b feature/name  # create + switch branch
git switch main               # switch branch (modern)
git stash / git stash pop     # park & restore work
git log --oneline --graph     # visual history
```

---

## Branching — Your Superpower

Branches let you work on features without touching main.

### Interactive: Create a Feature Branch

[GIT-BRANCHING:feature-branch]

```bash
git branch -a                 # list all branches
git checkout -b feature/login # create + switch
git push -u origin feature/login
```

---

## Branching Strategies — Interactive Walkthrough

Different teams organize branches differently. **Step through each strategy** below — watch how work flows from branch to production.

[GIT-STRATEGIES]

### Quick comparison

**GitHub Flow** — one `main` branch, feature branches, PRs. Best for most web teams shipping daily.

**Git Flow** — `main` + `develop` + feature/release/hotfix branches. Best when releases are scheduled (mobile, desktop).

**Trunk-Based** — everyone integrates to `main` frequently, branches live hours. Best for large teams with strong CI and feature flags.

### Which should you pick?

- **Solo / startup / web app** → GitHub Flow
- **Scheduled releases (v1.0, v2.0)** → Git Flow
- **Large team, continuous deploy + feature flags** → Trunk-based

---

## Merging — Combining Branches

### Interactive: Merge

[GIT-BRANCHING:merge]

```bash
git checkout main
git pull origin main
git merge feature/login
git push origin main
```

### Interactive: Merge Conflicts

[GIT-BRANCHING:conflict]

```bash
<<<<<<< HEAD
Hello Friend
=======
Hello World
>>>>>>> feature-branch
```

Fix: edit file → remove markers → `git add` → `git commit`.

---

## Rebasing — Sync With Main

Replay your commits on top of latest main. Use this on **your own feature branch** before opening a PR.

### Interactive: Rebase

[GIT-BRANCHING:rebase]

```bash
git checkout feature/my-feature
git fetch origin
git rebase origin/main
# conflicts? fix → git add . → git rebase --continue
git push --force-with-lease
```

### Merge vs Rebase — daily rule

| Situation | Use |
|---|---|
| Merging a PR to main | **Merge** (or squash merge on GitHub) |
| Syncing your solo feature branch | **Rebase** for clean history |
| Shared feature branch with teammates | **Merge** main into your branch |
| Already on main | **Never rebase** — use revert instead |

### Squash merge (common on GitHub)

Combines all PR commits into one clean commit on main. Great for messy WIP history.

```bash
git rebase -i HEAD~3   # locally: squash before pushing
```

---

## Daily Scenario Picker

Pick your situation — get the commands you need right now.

[GIT-GUIDE]

---

## Your Typical Day With Git

```bash
# Morning — sync up
git checkout main && git pull origin main
git checkout feature/my-feature
git merge main                    # bring in overnight changes

# During the day — commit often
git add .
git commit -m "Add checkout step"
git push

# Before PR — clean up (optional)
git rebase -i HEAD~3              # squash WIP commits
git push --force-with-lease

# After PR merged — clean up locally
git checkout main && git pull
git branch -d feature/my-feature
```

---

## Complete Feature Workflow

```bash
git clone https://github.com/username/project.git
cd project
git checkout -b add-user-profile

# work, commit, push
git add . && git commit -m "Add user profile page"
git push -u origin add-user-profile

# open PR on GitHub → review → merge
git checkout main && git pull
git branch -d add-user-profile
```

---

## Undo Cheat Sheet (daily)

| I want to… | Command |
|---|---|
| Discard uncommitted changes | `git restore <file>` |
| Unstage a file | `git restore --staged <file>` |
| Undo last commit (keep code) | `git reset --soft HEAD~1` |
| Undo last commit (discard code) | `git reset --hard HEAD~1` |
| Undo a pushed commit on main | `git revert <sha>` then push |

---

## Tips That Save You Daily

1. **Commit often** — small commits are easier to review and revert
2. **Branch for everything** — never commit directly to main
3. **Pull main before you start** — sync at the start of the day
4. **Read `git status`** — it tells you what to do next
5. **Use PRs** — even solo, PRs give you a review checkpoint
6. **Delete merged branches** — keep your repo tidy

[POLL:What do you find hardest about Git?|Branching|Merge conflicts|Rebasing|Remembering commands|Nothing — I'm ready!]

---

## Key Takeaways

- **add → commit → push** is your daily loop
- **Branch for every change** — merge via PR
- **Pick a strategy** — GitHub Flow for most teams
- **Rebase your own branch** to stay current with main
- **Merge conflicts** are normal — fix, add, commit
- **Use the interactive tools** — strategies animation + scenario picker

Happy coding!
