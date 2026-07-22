---
name: algorithm-post
description: >-
  Add new interactive algorithm guide posts to abhinavsingh.online — markdown,
  series registration, React components, BlogContent placeholders, and publish
  checklist. Use when writing a new algorithm blog post, adding to the Algorithms
  series, or creating animation/pattern/practice components for a technique guide.
---

# Algorithm Post Workflow

Follow this checklist when adding a new guide to the **Algorithms** series.

## Checklist

```
- [ ] 1. Register in lib/algorithm-series.ts
- [ ] 2. Create content/posts/{slug}.md
- [ ] 3. Build interactive components (if new technique)
- [ ] 4. Wire placeholders in app/components/BlogContent.tsx
- [ ] 5. Cross-link prior series posts in intro
- [ ] 6. npm run build
- [ ] 7. Publish (newsletter fires via GitHub workflow)
```

---

## 1. Register in the series

Append to `posts` in `lib/algorithm-series.ts`:

```typescript
{
  slug: "binary-search-technique",      // must match filename without .md
  shortTitle: "Binary Search",          // pill label in series banner
  topic: "Search",                      // optional — shown as secondary label
},
```

- Series umbrella title stays **Algorithms** (not per-topic).
- `topic` groups guides (e.g. `"Arrays & Strings"`, `"Trees"`, `"Search"`).
- Guide count, banner pills, and read-next nav update automatically from array order.
- Order matters — put posts in the reading order you want.

---

## 2. Create the markdown post

File: `content/posts/{slug}.md`

```markdown
---
title: Binary Search — Complete Guide with Interactive Walkthroughs
excerpt: One-line summary for listings and SEO.
date: YYYY-MM-DD
category: Algorithms
featured: true
---

# Binary Search — Complete Guide with Interactive Walkthroughs

Intro paragraph. Link to earlier guides in the series:
[Two Pointers](/blog/two-pointers-technique), [Sliding Window](/blog/sliding-window-technique), …

## Section

Content + placeholders (see section 4).

| Col A | Col B |
|-------|-------|
| …     | …     |
```

**Conventions (match existing guides):**
- `category: Algorithms` — required for `/blog?category=Algorithms` filter.
- Same depth as `hashing-technique.md`, `prefix-sum-technique.md`: concepts, patterns, interactive walkthroughs, JS/TS/Go/Python code, practice ladder, complexity, comparison tables.
- Use markdown tables (BlogContent parses them).
- Slug = filename without `.md`.

---

## 3. Interactive components

For a **new technique**, create components under `app/components/` following existing patterns:

| Component | Example | Purpose |
|-----------|---------|---------|
| `{Technique}Animation.tsx` | `HashingAnimation.tsx` | Step-by-step presets via `[TECHNIQUE:preset-id]` |
| `{Technique}PatternOverview.tsx` | `HashingPatternOverview.tsx` | Pattern cards overview |
| `{Technique}QuickRef.tsx` | `HashingQuickRef.tsx` | Decision flowchart / quick reference |
| `{Technique}PracticeLadder.tsx` | `HashingPracticeLadder.tsx` | LeetCode-style practice tiers |
| `{Technique}ComplexitySheet.tsx` | `HashingComplexitySheet.tsx` | Time/space complexity table |
| `{Technique}Vs{Other}.tsx` | `HashingVsArrays.tsx` | Comparison with related technique |

**Animation preset pattern:** export a `PRESETS` record keyed by preset id; accept `preset` prop; use `"use client"`.

Reference implementations:
- `app/components/HashingAnimation.tsx` — map/set step animations
- `app/components/PrefixSumAnimation.tsx` — array prefix walkthroughs
- `app/components/TwoPointersAnimation.tsx` — pointer movement
- `app/components/SlidingWindowAnimation.tsx` — window expansion/shrink

Reuse existing components when the new post is an extension of an existing technique rather than a new one.

---

## 4. Wire placeholders in BlogContent

In `app/components/BlogContent.tsx`:

1. Import new components at top.
2. Add placeholder handlers in the line loop (same pattern as hashing/prefix-sum):

**Static blocks:**
```
[BINARY-SEARCH-PATTERNS]
[BINARY-SEARCH-PRACTICE]
[BINARY-SEARCH-QUICK-REF]
[BINARY-SEARCH-COMPLEXITY]
[BINARY-SEARCH-VS-OTHERS]
```

**Animation presets:**
```
[BINARY-SEARCH:classic]
[BINARY-SEARCH:rotated]
```

Naming convention: `UPPERCASE-TECHNIQUE-NAME` with hyphens, matching the prefix used in components.

**Also supported globally:**
- `[CODE-TABS]` — multi-language code blocks (see existing posts)
- `[DIAGRAM:Title]` + JSON nodes on following lines

---

## 5. Series UI (automatic)

No changes needed if slug is in `algorithm-series.ts`:

- `AlgorithmSeriesReadNext` — bottom prev/next links
- `app/blog/[slug]/page.tsx` — detects series via `getSeriesInfo()`

Analytics: read-next clicks fire `trackSeriesContinue()` from `lib/analytics.ts`.

---

## 6. Verify

```bash
npm run build
```

Fix any TypeScript errors, broken imports, or layout issues in flowcharts (check QuickRef node positions).

---

## 7. Publish & newsletter

- Push to main — post appears automatically.
- Newsletter sends via `.github/workflows/newsletter.yml` → `https://www.abhinavsingh.online/api/auto-newsletter`.
- Webhook URL must use **www** (non-www 307 breaks the workflow).

---

## Adding to an existing technique

If extending hashing/two-pointers/etc. instead of a new technique:

1. Add animation preset to existing `{Technique}Animation.tsx` `PRESETS`.
2. Use existing placeholder prefix in markdown: `[HASHING:new-preset]`.
3. Optionally add problems to existing `PracticeLadder`.
4. Only register in `algorithm-series.ts` if it's a **new standalone post** (new slug file).

---

## File map

| Area | Path |
|------|------|
| Series config | `lib/algorithm-series.ts` |
| Post content | `content/posts/*.md` |
| Placeholder router | `app/components/BlogContent.tsx` |
| Series banner / read-next | `app/components/AlgorithmSeriesBanner.tsx`, `AlgorithmSeriesReadNext.tsx` |
| Post page | `app/blog/[slug]/page.tsx` |
| Analytics | `lib/analytics.ts` |
| Newsletter | `.github/workflows/newsletter.yml` |
