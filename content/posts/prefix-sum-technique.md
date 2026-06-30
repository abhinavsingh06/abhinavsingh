---
title: Prefix Sum — Complete Guide with Interactive Walkthroughs
excerpt: Master prefix sums for O(1) subarray range queries — build the array, answer queries in constant time, split arrays in one pass, and optimize to O(1) space. Step-through animations included.
date: 2026-06-28
category: Algorithms
featured: true
---

# Prefix Sum — Complete Guide with Interactive Walkthroughs

**Prefix sum** is a preprocessing technique for arrays of numbers. You build an auxiliary array once in **O(n)**, then answer **any subarray sum query in O(1)**. That single trick turns naive **O(n)** per query into **O(n + m)** when you have **m** queries — and collapses **O(n²)** brute-force splits into **O(n)**.

This guide follows the same format as the [Two Pointers](/blog/two-pointers-technique) and [Sliding Window](/blog/sliding-window-technique) references: we introduce the idea, walk through classic examples **with interactive animations**, and close with a pattern picker and practice ladder. The walkthrough problems are for learning — you don't need to solve them cold on first read.

---

## What Is a Prefix Sum?

Given `nums = [5, 2, 1, 6, 3, 8]`, the **prefix sum array** is:

```
index:   0   1   2   3   4   5
nums:    5   2   1   6   3   8
prefix:  5   7   8  14  17  25
```

`prefix[i]` is the sum of all elements from index `0` through `i` (inclusive).

A subarray that starts at index `0` is called a **prefix** of the array. The prefix sum array stores the sum of every prefix — hence the name.

There are four main families you'll use in interviews:

[PREFIX-SUM-PATTERNS]

---

## Pattern 1 — Build the Prefix Array

Start with the first element, then accumulate:

```
prefix = [nums[0]]
for i from 1 to nums.length - 1:
    prefix.append(nums[i] + prefix[last])
```

At each step, `prefix[last]` is the sum of all elements before index `i`. Add `nums[i]` to extend the prefix by one element.

Watch it build on `nums = [5, 2, 1, 6, 3, 8]`:

[PREFIX-SUM:build]

[CODE-TABS]
```javascript
function buildPrefix(nums) {
  const prefix = [nums[0]];
  for (let i = 1; i < nums.length; i++) {
    prefix.push(nums[i] + prefix[prefix.length - 1]);
  }
  return prefix;
}

function rangeSum(prefix, i, j) {
  if (i === 0) return prefix[j];
  return prefix[j] - prefix[i - 1];
}

const nums = [5, 2, 1, 6, 3, 8];
const prefix = buildPrefix(nums);
rangeSum(prefix, 2, 4); // 10
```
```typescript
function buildPrefix(nums: number[]): number[] {
  const prefix = [nums[0]];
  for (let i = 1; i < nums.length; i++) {
    prefix.push(nums[i] + prefix[prefix.length - 1]);
  }
  return prefix;
}

function rangeSum(prefix: number[], i: number, j: number): number {
  if (i === 0) return prefix[j];
  return prefix[j] - prefix[i - 1];
}

const nums = [5, 2, 1, 6, 3, 8];
const prefix = buildPrefix(nums);
rangeSum(prefix, 2, 4); // 10
```
```go
func buildPrefix(nums []int) []int {
	prefix := []int{nums[0]}
	for i := 1; i < len(nums); i++ {
		prefix = append(prefix, nums[i]+prefix[len(prefix)-1])
	}
	return prefix
}

func rangeSum(prefix []int, i, j int) int {
	if i == 0 {
		return prefix[j]
	}
	return prefix[j] - prefix[i-1]
}

nums := []int{5, 2, 1, 6, 3, 8}
prefix := buildPrefix(nums)
rangeSum(prefix, 2, 4) // 10
```

**Complexity:** **O(n)** time to build, **O(n)** space for the prefix array.

**Tip:** Many solutions pad with `prefix[0] = 0` and define `prefix[i+1] = prefix[i] + nums[i]`. Then `sum(i, j) = prefix[j+1] - prefix[i]` with no special case for `i = 0`. Either convention works — pick one and stay consistent.

---

## Pattern 2 — Range Sum in O(1)

Want the sum of elements from index `i` to `j` (inclusive)?

```
sum(i, j) = prefix[j] - prefix[i - 1]
```

When `i = 0`, use `prefix[j]` directly (or treat `prefix[-1] = 0`).

**Why it works:** `prefix[j]` is the sum of everything up to `j`. `prefix[i - 1]` is the sum of everything *before* `i`. Subtracting leaves exactly the subarray from `i` to `j`.

Think of it as a **green line** (sum through `j`) minus a **red line** (sum before `i`):

[PREFIX-SUM:range-query]

Every code example below has **JavaScript**, **TypeScript**, and **Go** tabs — switch between them to see the same logic in your language.

---

## Preprocessing — Pay Once, Query Fast

Building a prefix sum is **preprocessing**: you invest **O(n)** upfront so the main logic runs faster.

| Approach | Build | Per query | m queries |
|----------|-------|-----------|-----------|
| Brute force (re-sum each range) | O(1) | O(n) | **O(n × m)** |
| Prefix sum | O(n) | O(1) | **O(n + m)** |

Whenever a problem involves **many subarray sum questions** on a **static array**, prefix sums are the first technique to consider.

---

## Example 1 — Range Queries Under a Limit

Given an integer array `nums`, an array `queries` where `queries[i] = [x, y]`, and an integer `limit`, return a boolean array: for each query, is the sum of the subarray from `x` to `y` **strictly less than** `limit`?

**Input:** `nums = [1, 6, 3, 2, 7, 2]`, `queries = [[0, 3], [2, 5], [2, 4]]`, `limit = 13`

**Output:** `[true, false, true]` — subarray sums are `[12, 14, 12]`.

### Approach

1. Build the prefix sum — **O(n)**
2. For each query `[x, y]`, compute `sum = prefix[y] - prefix[x - 1]` in **O(1)**
3. Compare to `limit`

Step through all three queries:

[PREFIX-SUM:queries]

[CODE-TABS]
```javascript
function answerQueries(nums, queries, limit) {
  const prefix = [nums[0]];
  for (let i = 1; i < nums.length; i++) {
    prefix.push(nums[i] + prefix[prefix.length - 1]);
  }

  return queries.map(([x, y]) => {
    const sum = x === 0 ? prefix[y] : prefix[y] - prefix[x - 1];
    return sum < limit;
  });
}

answerQueries(
  [1, 6, 3, 2, 7, 2],
  [[0, 3], [2, 5], [2, 4]],
  13
); // [true, false, true]
```
```typescript
function answerQueries(
  nums: number[],
  queries: number[][],
  limit: number
): boolean[] {
  const prefix = [nums[0]];
  for (let i = 1; i < nums.length; i++) {
    prefix.push(nums[i] + prefix[prefix.length - 1]);
  }

  return queries.map(([x, y]) => {
    const sum = x === 0 ? prefix[y] : prefix[y] - prefix[x - 1];
    return sum < limit;
  });
}
```
```go
func answerQueries(nums []int, queries [][]int, limit int) []bool {
	prefix := []int{nums[0]}
	for i := 1; i < len(nums); i++ {
		prefix = append(prefix, nums[i]+prefix[len(prefix)-1])
	}

	ans := make([]bool, len(queries))
	for qi, q := range queries {
		x, y := q[0], q[1]
		sum := prefix[y]
		if x > 0 {
			sum -= prefix[x-1]
		}
		ans[qi] = sum < limit
	}
	return ans
}
```

**Complexity:** **O(n + m)** time, **O(n)** space — where `m = queries.length`.

Without prefix sums, each query costs **O(n)** → **O(n × m)** total. The preprocessing investment pays off as soon as you have more than a handful of queries.

---

## Example 2 — Number of Ways to Split Array

[LeetCode 2270. Number of Ways to Split Array](https://leetcode.com/problems/number-of-ways-to-split-array/)

Given an integer array `nums`, count how many ways you can split the array into two **non-empty** parts so that the **left sum ≥ right sum**.

**Input:** `nums = [10, 4, -8, 7]` → **Answer:** `2`

### Brute force — O(n²)

For each split index `i`, sum the left section (0 to `i`) and the right section (`i+1` to end) with nested loops.

### Prefix sum — O(n)

1. Build prefix sum; `total = prefix[n - 1]`
2. For each split index `i` from `0` to `n - 2`:
   - `leftSum = prefix[i]`
   - `rightSum = total - prefix[i]`
3. Count if `leftSum >= rightSum`

[PREFIX-SUM:split-array]

[CODE-TABS]
```javascript
function waysToSplitArray(nums) {
  const n = nums.length;
  const prefix = [nums[0]];
  for (let i = 1; i < n; i++) {
    prefix.push(nums[i] + prefix[prefix.length - 1]);
  }

  const total = prefix[n - 1];
  let count = 0;

  for (let i = 0; i < n - 1; i++) {
    const left = prefix[i];
    const right = total - left;
    if (left >= right) count++;
  }

  return count;
}

waysToSplitArray([10, 4, -8, 7]); // 2
```
```typescript
function waysToSplitArray(nums: number[]): number {
  const n = nums.length;
  const prefix = [nums[0]];
  for (let i = 1; i < n; i++) {
    prefix.push(nums[i] + prefix[prefix.length - 1]);
  }

  const total = prefix[n - 1];
  let count = 0;

  for (let i = 0; i < n - 1; i++) {
    const left = prefix[i];
    const right = total - left;
    if (left >= right) count++;
  }

  return count;
}
```
```go
func waysToSplitArray(nums []int) int {
	n := len(nums)
	prefix := []int{nums[0]}
	for i := 1; i < n; i++ {
		prefix = append(prefix, nums[i]+prefix[len(prefix)-1])
	}

	total := prefix[n-1]
	count := 0
	for i := 0; i < n-1; i++ {
		left := prefix[i]
		right := total - left
		if left >= right {
			count++
		}
	}
	return count
}
```

**Complexity:** **O(n)** time, **O(n)** space.

---

## Pattern 3 — Running Sum (O(1) Space)

In the split-array problem, we access prefix values **in order** as `i` increments: `prefix[0]`, `prefix[1]`, `prefix[2]`, …

We never need random access to earlier prefix values after we've moved past them. So we can replace the array with a **running sum**:

```
leftSection = 0
total = sum of entire array

for i from 0 to n - 2:
    leftSection += nums[i]
    rightSection = total - leftSection
    if leftSection >= rightSection: count++
```

Each `leftSection` value is still a prefix sum — we just store it in a single integer instead of an array.

[PREFIX-SUM:running-sum]

[CODE-TABS]
```javascript
function waysToSplitArrayOptimized(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  let left = 0;
  let count = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    left += nums[i];
    const right = total - left;
    if (left >= right) count++;
  }

  return count;
}
```
```typescript
function waysToSplitArrayOptimized(nums: number[]): number {
  const total = nums.reduce((a, b) => a + b, 0);
  let left = 0;
  let count = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    left += nums[i];
    const right = total - left;
    if (left >= right) count++;
  }

  return count;
}
```
```go
func waysToSplitArrayOptimized(nums []int) int {
	total := 0
	for _, v := range nums {
		total += v
	}
	left, count := 0, 0
	for i := 0; i < len(nums)-1; i++ {
		left += nums[i]
		right := total - left
		if left >= right {
			count++
		}
	}
	return count
}
```

**Complexity:** **O(n)** time, **O(1)** space.

**When to keep the full array:** You need arbitrary range queries (`sum(i, j)` for any `i`, `j`) or you revisit earlier prefix values out of order.

---

## Pattern 4 — Prefix Sum + Hash Map

The next level: count subarrays with a **target property** in **O(n)**.

For [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) (LC 560), the key insight is:

```
prefix[j] - prefix[i] = K   ⟺   subarray (i+1..j) sums to K
```

As you scan, maintain a hash map of **how many times each prefix sum has appeared**. At index `j`, add `count[prefix[j] - K]` to the answer.

[CODE-TABS]
```javascript
function subarraySum(nums, k) {
  const count = new Map([[0, 1]]);
  let prefix = 0;
  let ans = 0;

  for (const num of nums) {
    prefix += num;
    ans += count.get(prefix - k) ?? 0;
    count.set(prefix, (count.get(prefix) ?? 0) + 1);
  }

  return ans;
}

subarraySum([1, 1, 1], 2); // 2
```
```typescript
function subarraySum(nums: number[], k: number): number {
  const count = new Map<number, number>([[0, 1]]);
  let prefix = 0;
  let ans = 0;

  for (const num of nums) {
    prefix += num;
    ans += count.get(prefix - k) ?? 0;
    count.set(prefix, (count.get(prefix) ?? 0) + 1);
  }

  return ans;
}
```
```go
func subarraySum(nums []int, k int) int {
	count := map[int]int{0: 1}
	prefix, ans := 0, 0
	for _, num := range nums {
		prefix += num
		ans += count[prefix-k]
		count[prefix]++
	}
	return ans
}
```

**Complexity:** **O(n)** time, **O(n)** space for the map.

Same pattern powers [Subarray Sums Divisible by K](https://leetcode.com/problems/subarray-sums-divisible-by-k/) — store prefix `% K` counts instead.

---

## Prefix Sum vs Sliding Window vs Two Pointers

All three can touch subarray problems — but they shine in different situations:

[PREFIX-SUM-VS-OTHERS]

Many problems blur the line — that's fine. The label matters less than recognizing **when you need fast range sums** vs **when you need to optimize window length**.

---

## 2D Prefix Sums (Bonus)

The same idea extends to matrices. `prefix[r][c]` stores the sum of all cells in the rectangle from `(0, 0)` to `(r, c)`. A submatrix sum uses **inclusion-exclusion** with four prefix lookups — still **O(1)** per query after **O(rows × cols)** preprocessing.

Useful for [Range Sum Query 2D](https://leetcode.com/problems/range-sum-query-2d-immutable/) and grid-based DP.

---

## Complexity Cheat Sheet

[PREFIX-SUM-COMPLEXITY]

---

## Common Mistakes

**Off-by-one on `prefix[i - 1]`.** When `i = 0`, there is no `prefix[-1]`. Handle it explicitly or pad with `prefix[0] = 0` and shift indices.

**Using prefix sum on a mutating array.** Prefix sums are for **static** input. If the array changes between queries, rebuild or use a different structure.

**Building prefix but still re-summing in the loop.** If you're iterating `j` from `i` to `end` inside another loop, you haven't gained anything — use the subtraction formula.

**Forgetting the right section formula.** `rightSum = total - leftSum` only works when left and right partition the entire array with no overlap.

**Skipping the running-sum optimization** when you only need `prefix[i]` in increasing order — you can drop the array and save **O(n)** space.

**Assuming sliding window works with negative numbers.** `[-1, 2, -3, 4]` with target 2 will break a naive sum-based window. Use prefix sums (often + hash map) instead.

---

## Practice Problems (Easiest → Hardest)

[PREFIX-SUM-PRACTICE]

---

## Quick Reference — Pattern Picker

[PREFIX-SUM-QUICK-REF]

---

## Key Takeaways

1. **Prefix[i] = sum of nums[0..i].** Build once in O(n).
2. **Range sum in O(1):** `prefix[j] - prefix[i - 1]` (handle `i = 0`).
3. **Preprocessing pays off** when you have many queries — O(n + m) beats O(n × m).
4. **Right section = total − left** when splitting the full array.
5. **Running sum** replaces the array when you only need incremental prefix values.
6. **Negative numbers are fine** — prefix sums don't require monotonicity like sliding windows do.
7. **Prefix + hash map** unlocks "count subarrays with sum K" in O(n).
8. **Step through the animations.** If you can narrate each green/red line move, you can implement it.

This completes the core array patterns alongside [Two Pointers](/blog/two-pointers-technique) and [Sliding Window](/blog/sliding-window-technique). Use the pattern picker when a new problem lands — and reach for prefix sums whenever the question is really about **sums over ranges**.
