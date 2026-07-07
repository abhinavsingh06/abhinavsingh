---
title: Binary Search — Complete Guide with Interactive Walkthroughs
excerpt: Master binary search on sorted arrays and answer spaces — classic templates, lower/upper bounds, 2D matrix tricks, and O(n log k) feasibility checks. Animations included.
date: 2026-07-08
category: Algorithms
featured: true
---

# Binary Search — Complete Guide with Interactive Walkthroughs

**Binary search** runs in **O(log n)** on a search space of size **n**. It needs **sorted order** (or a **monotonic** yes/no predicate). Each step halves the space — that is why logarithmic time feels almost instant compared to linear scans.

This guide follows the same format as [Two Pointers](/blog/two-pointers-technique), [Sliding Window](/blog/sliding-window-technique), [Prefix Sum](/blog/prefix-sum-technique), and [Hashing](/blog/hashing-technique): core concepts, interactive walkthroughs, code in three languages, and a practice ladder.

---

## What Binary Search Does

On a **sorted array** and target **x**, binary search in **O(log n)** time and **O(1)** space can:

- Find the **index** of `x` if it exists
- Find the **insertion index** to keep the array sorted if it does not

The idea: check the **middle** element. If it is too small, discard the left half; if too large, discard the right half. Repeat until found or the search space is empty.

```
arr = [-1, 0, 3, 5, 9, 12], target = 9

Step 1: mid = 3, arr[3] = 5 < 9  → search right half
Step 2: mid = 4, arr[4] = 9 = 9  → found ✓
```

You have used this in real life — opening a dictionary near the middle and flipping left or right based on the first letter.

---

## Core Patterns

[BINARY-SEARCH-PATTERNS]

---

## Classic Template (No Duplicates)

```
left = 0, right = n - 1
while left <= right:
    mid = (left + right) // 2
    if arr[mid] == target: return mid
    if arr[mid] > target: right = mid - 1
    else: left = mid + 1
return -1   // or return left for insert position
```

[BINARY-SEARCH:classic]

[CODE-TABS]
```javascript
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] > target) right = mid - 1;
    else left = mid + 1;
  }

  return -1;
}

binarySearch([-1, 0, 3, 5, 9, 12], 9); // 4
```
```typescript
function binarySearch(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] > target) right = mid - 1;
    else left = mid + 1;
  }

  return -1;
}
```
```go
func binarySearch(nums []int, target int) int {
	left, right := 0, len(nums)-1
	for left <= right {
		mid := left + (right-left)/2
		if nums[mid] == target {
			return mid
		}
		if nums[mid] > target {
			right = mid - 1
		} else {
			left = mid + 1
		}
	}
	return -1
}
```

**Overflow note:** In Java/C++, use `left + (right - left) / 2` instead of `(left + right) / 2`. JavaScript and Python integers do not overflow in practice.

---

## Duplicate Elements — Lower & Upper Bound

If the array has **duplicates**, the classic template finds *some* index of `target`, not necessarily the first or last.

| Template | Finds |
|----------|-------|
| **Lower bound** | First index `i` where `arr[i] >= target` |
| **Upper bound** | First index `i` where `arr[i] > target` |

If `target` is missing, **`left`** ends at the correct **insertion index** (same as classic search).

[BINARY-SEARCH:lower-bound]

[CODE-TABS]
```javascript
// First index where arr[i] >= target
function lowerBound(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] >= target) right = mid - 1;
    else left = mid + 1;
  }

  return left;
}

lowerBound([1, 2, 2, 2, 3], 2); // 1
```
```typescript
function lowerBound(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] >= target) right = mid - 1;
    else left = mid + 1;
  }

  return left;
}
```
```go
func lowerBound(nums []int, target int) int {
	left, right := 0, len(nums)-1
	for left <= right {
		mid := left + (right-left)/2
		if nums[mid] >= target {
			right = mid - 1
		} else {
			left = mid + 1
		}
	}
	return left
}
```

**First and last position of target:** run lower bound for `target` and upper bound for `target + 1` (or lower bound for `target` and `target + 1`).

---

## Binary Search vs Linear Scan

| Approach | When it wins |
|----------|--------------|
| **Linear scan** | Unsorted data, single pass already, tiny `n` |
| **Binary search** | Sorted array, many queries, huge answer spaces |

[BINARY-SEARCH-VS-LINEAR]

**Rule of thumb:** Anytime the problem gives you **sorted** input or asks for **min/max** with a feasibility check — think binary search.

---

## On Arrays

`left` and `right` bound the **current subarray**. `mid` is the middle index. Sometimes you binary search for the answer directly; sometimes binary search is a tool inside a larger algorithm.

### Example 1 — Binary Search

[LeetCode 704. Binary Search](https://leetcode.com/problems/binary-search/)

Sorted `nums`, find `target` or return `-1`. Brute force linear scan is **O(n)**; binary search is **O(log n)**.

See the animation above — same template, no extra space.

### Example 2 — Search a 2D Matrix

[LeetCode 74. Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/)

Each row is sorted left-to-right. The first element of each row is greater than the last element of the previous row. Treat the matrix as **one sorted array** of length `m * n`:

```
flat index i  →  row = i // n,  col = i % n
```

[BINARY-SEARCH:matrix]

[CODE-TABS]
```javascript
function searchMatrix(matrix, target) {
  const m = matrix.length;
  const n = matrix[0].length;
  let left = 0;
  let right = m * n - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const row = Math.floor(mid / n);
    const col = mid % n;
    const val = matrix[row][col];

    if (val === target) return true;
    if (val > target) right = mid - 1;
    else left = mid + 1;
  }

  return false;
}
```
```typescript
function searchMatrix(matrix: number[][], target: number): boolean {
  const m = matrix.length;
  const n = matrix[0].length;
  let left = 0;
  let right = m * n - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const val = matrix[Math.floor(mid / n)][mid % n];
    if (val === target) return true;
    if (val > target) right = mid - 1;
    else left = mid + 1;
  }

  return false;
}
```
```go
func searchMatrix(matrix [][]int, target int) bool {
	m, n := len(matrix), len(matrix[0])
	left, right := 0, m*n-1
	for left <= right {
		mid := left + (right-left)/2
		val := matrix[mid/n][mid%n]
		if val == target {
			return true
		}
		if val > target {
			right = mid - 1
		} else {
			left = mid + 1
		}
	}
	return false
}
```

**Complexity:** **O(log(m·n))** time, **O(1)** space.

### Example 3 — Successful Pairs of Spells and Potions

[LeetCode 2300. Successful Pairs of Spells and Potions](https://leetcode.com/problems/successful-pairs-of-spells-and-potions/)

For spell strength `x`, a potion `y` succeeds if `x * y >= success`, i.e. `y >= success / x`. Sort `potions`, binary search for the **first index** where `potions[i] >= success / x`. If that index is `i`, there are **`m - i`** valid potions.

[BINARY-SEARCH:spells]

Brute force all pairs: **O(n·m)**. Sort + binary search per spell: **O((n + m) log m)**.

[CODE-TABS]
```javascript
function successfulPairs(spells, potions, success) {
  potions.sort((a, b) => a - b);
  const m = potions.length;

  return spells.map((spell) => {
    const need = success / spell;
    let left = 0;
    let right = m - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (potions[mid] >= need) right = mid - 1;
      else left = mid + 1;
    }

    return m - left;
  });
}
```
```typescript
function successfulPairs(
  spells: number[],
  potions: number[],
  success: number
): number[] {
  potions.sort((a, b) => a - b);
  const m = potions.length;

  return spells.map((spell) => {
    const need = success / spell;
    let left = 0;
    let right = m - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (potions[mid] >= need) right = mid - 1;
      else left = mid + 1;
    }

    return m - left;
  });
}
```
```go
func successfulPairs(spells []int, potions []int, success int64) []int {
	sort.Ints(potions)
	m := len(potions)
	ans := make([]int, len(spells))

	for i, spell := range spells {
		need := float64(success) / float64(spell)
		left, right := 0, m-1
		for left <= right {
			mid := left + (right-left)/2
			if float64(potions[mid]) >= need {
				right = mid - 1
			} else {
				left = mid + 1
			}
		}
		ans[i] = m - left
	}
	return ans
}
```

---

## On Solution Spaces

Binary search also works on an **answer** `k` when:

1. You can **`check(k)`** in **O(n)** or better
2. Feasibility is **monotonic** — if `k` works, all larger (or smaller) values work too

There are two zones split by a **threshold**: impossible on one side, possible on the other.

```
Impossible | Possible
-----------|----------
   ...     |   ...
           ↑ threshold (min or max answer)
```

Set `left` and `right` to the min and max possible answer, binary search on `k`, run `check(mid)`, and halve the space.

### Example 1 — Koko Eating Bananas

[LeetCode 875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)

Find **minimum** eating speed `k` so Koko finishes all piles within `h` hours. If speed `k` works, any **faster** speed also works → binary search for the **minimum feasible** `k`.

`check(k)`: for each pile, hours += `ceil(pile / k)`. Sum ≤ `h`?

Bounds: `left = 1`, `right = max(piles)`.

[BINARY-SEARCH:koko]

[CODE-TABS]
```javascript
function minEatingSpeed(piles, h) {
  const canFinish = (k) => {
    let hours = 0;
    for (const pile of piles) {
      hours += Math.ceil(pile / k);
    }
    return hours <= h;
  };

  let left = 1;
  let right = Math.max(...piles);

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (canFinish(mid)) right = mid - 1;
    else left = mid + 1;
  }

  return left;
}
```
```typescript
function minEatingSpeed(piles: number[], h: number): number {
  const canFinish = (k: number) =>
    piles.reduce((sum, pile) => sum + Math.ceil(pile / k), 0) <= h;

  let left = 1;
  let right = Math.max(...piles);

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (canFinish(mid)) right = mid - 1;
    else left = mid + 1;
  }

  return left;
}
```
```go
func minEatingSpeed(piles []int, h int) int {
	canFinish := func(k int) bool {
		hours := 0
		for _, pile := range piles {
			hours += (pile + k - 1) / k
		}
		return hours <= h
	}

	left, right := 1, 0
	for _, p := range piles {
		if p > right {
			right = p
		}
	}

	for left <= right {
		mid := left + (right-left)/2
		if canFinish(mid) {
			right = mid - 1
		} else {
			left = mid + 1
		}
	}
	return left
}
```

**Complexity:** **O(n log k)** where `k = max(piles)`.

### Example 2 — Path With Minimum Effort

[LeetCode 1631. Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/)

Binary search on **effort** `e`. `check(e)`: DFS/BFS from `(0,0)` to `(m-1, n-1)` using edges with difference ≤ `e`. Minimum effort = 0, maximum = max cell value.

**Complexity:** **O(m·n log k)** time, **O(m·n)** space for the traversal.

### Example 3 — Minimum Speed to Arrive on Time

[LeetCode 1870. Minimum Speed to Arrive on Time](https://leetcode.com/problems/minimum-speed-to-arrive-on-time/)

Similar to Koko: binary search on train **speed**. Each leg takes `ceil(dist[i] / speed)` except the last leg (no wait for another train). Trains depart on **integer hours** — round up between legs.

If `dist.length > floor(hour)`, impossible even at infinite speed → return `-1`.

When the problem gives a max answer (e.g. `10^7`), that hints at binary search. If not, use a large `right` like `10^10` — log is still tiny.

---

## Min vs Max — Return `left` or `right`?

| Searching for | When loop ends | Return |
|---------------|----------------|--------|
| **Minimum** feasible | `left > right` | **`left`** |
| **Maximum** feasible | `left > right` | **`right`** |

When searching for a **minimum**, a successful `check(mid)` moves `right = mid - 1` to hunt smaller — the answer ends up at **`left`**.

When searching for a **maximum**, a successful `check(mid)` moves `left = mid + 1` — the answer ends up at **`right`**.

---

## Complexity Cheat Sheet

[BINARY-SEARCH-COMPLEXITY]

---

## Common Mistakes

**Wrong loop condition.** `left < right` vs `left <= right` depends on the template — copy a proven template instead of reinventing each time.

**Infinite loops.** If you use `left = mid` or `right = mid` without `+1`/`-1`, the range may never shrink.

**Off-by-one on bounds.** `right = n - 1` for indices, or `right = n` for half-open upper-bound templates — know which you are using.

**Forgetting sorted precondition.** Binary search on unsorted data is wrong unless you sort first (**O(n log n)** setup).

**Using binary search when `n` is tiny.** A linear scan on 10 elements is fine — do not over-engineer.

**Max-answer problems returning `left`.** If you need the **maximum** feasible value, return **`right`**, not `left`.

---

## Practice Problems (Easiest → Hardest)

[BINARY-SEARCH-PRACTICE]

---

## Quick Reference — Pattern Picker

[BINARY-SEARCH-QUICK-REF]

---

## Key Takeaways

1. **Halve the search space each step** → **O(log n)** on `n` elements or answer range `k`.
2. **Sorted array** → classic `left`/`right` on indices; missing element → insert at `left`.
3. **Duplicates** → lower bound (first `≥ x`) and upper bound (first `> x`).
4. **2D sorted matrix** → flatten to one index space: `row = i // n`, `col = i % n`.
5. **Sort + binary search** beats nested loops (spells & potions pattern).
6. **Answer space** → `check(mid)` + monotonic feasibility; min → return `left`, max → return `right`.
7. **Copy templates** for interviews — do not debate `mid ± 1` under pressure.
8. **Pair with [Hashing](/blog/hashing-technique)** when the subproblem is counting, not position.

Binary search is one of the highest-leverage optimizations in interviews — anytime you see sorted input or a min/max optimization with a greedy check, reach for it.
