---
title: Sliding Window Technique — Complete Reference with Animations
excerpt: A friendly, step-by-step guide to sliding windows — from your first two-pointer problem to monotonic deques, production rate limiters, and the at-most-K trick. Interactive animations included.
date: 2025-06-25
category: Algorithms
featured: true
---

# Sliding Window Technique — Complete Reference with Animations

Imagine you're looking through a train window at a row of houses. You don't jump from house 1 to house 50 — you slide forward, one house entering view as another leaves. The **sliding window** technique does exactly that with arrays and strings.

Instead of checking every possible subarray from scratch (slow), you keep a "window" of elements and slide it across the data (fast). It's one of the most useful patterns in coding interviews **and** in real systems like rate limiters and monitoring dashboards.

This guide starts from zero and builds up to advanced patterns. Use the animations to step through each move — they'll make the logic click whether you're solving your first window problem or designing a production pipeline.

---

## The Problem It Solves

Say you have an array `[2, 1, 5, 1, 3, 2]` and want the maximum sum of any **3 consecutive numbers**.

The slow way: check every group of 3, one by one.

```
[2, 1, 5] → sum 8
[1, 5, 1] → sum 7
[5, 1, 3] → sum 9  ← best
[1, 3, 2] → sum 6
```

That works, but for an array of 1 million elements, you're doing a lot of repeated work. Every group re-adds numbers you already counted.

The fast way: compute the first group, then **slide** — subtract the element that left, add the element that entered. Each number is touched at most twice. That's **O(n)** instead of **O(n²)**.

---

## The Core Idea — Two Pointers

Every sliding window uses two pointers:

- **Left (`L`)** — where the window starts
- **Right (`R`)** — where the window ends

The window covers everything from `L` to `R`, inclusive.

```
Array:  [ 2,  1,  5,  1,  3,  2 ]
Index:    0   1   2   3   4   5
              L──────────R
              window = [1, 5, 1]
```

You only ever do three things:

1. **Expand** — move `R` right, include a new element
2. **Shrink** — move `L` right, remove an element
3. **Slide** — expand and shrink at the same time (fixed-size windows)

Both pointers only move forward, never backward. That's why the whole thing stays fast.

---

## Pattern 1 — Fixed-Size Window

Use this when the problem says "subarray of size **k**" or "every consecutive group of **k** elements."

**How it works:**

1. Build the first window of size `k`
2. Record the answer
3. Slide one step: drop the leftmost element, add the new rightmost element
4. Repeat until you reach the end

Watch it happen on `[2, 1, 5, 1, 3, 2]` with `k = 3`:

[SLIDING-WINDOW:fixed-k]

Notice: when sliding from `[2, 1, 5]` to `[1, 5, 1]`, we don't re-add all three numbers. We just subtract `2` and add `1`.

Every code example below has **JavaScript**, **TypeScript**, and **Go** tabs — switch between them to see the same logic in your language.

[CODE-TABS]
```javascript
function maxSumSubarray(arr, k) {
  let windowSum = 0;
  let maxSum = -Infinity;

  for (let i = 0; i < k; i++) windowSum += arr[i];
  maxSum = windowSum;

  for (let right = k; right < arr.length; right++) {
    windowSum += arr[right] - arr[right - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

maxSumSubarray([2, 1, 5, 1, 3, 2], 3); // 9
```
```typescript
function maxSumSubarray(arr: number[], k: number): number {
  let windowSum = 0;
  let maxSum = -Infinity;

  for (let i = 0; i < k; i++) windowSum += arr[i];
  maxSum = windowSum;

  for (let right = k; right < arr.length; right++) {
    windowSum += arr[right] - arr[right - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

maxSumSubarray([2, 1, 5, 1, 3, 2], 3); // 9
```
```go
func maxSumSubarray(arr []int, k int) int {
	windowSum := 0
	maxSum := arr[0]

	for i := 0; i < k; i++ {
		windowSum += arr[i]
	}
	maxSum = windowSum

	for right := k; right < len(arr); right++ {
		windowSum += arr[right] - arr[right-k]
		if windowSum > maxSum {
			maxSum = windowSum
		}
	}

	return maxSum
}

// maxSumSubarray([]int{2, 1, 5, 1, 3, 2}, 3) // 9
```

**When to use:** "Max sum of size k", "average of every k elements", "find all anagrams of a pattern" (window size = pattern length).

---

## Pattern 2 — Variable-Size Window (Grow & Shrink)

Use this when the window size isn't fixed — you're looking for the **shortest** or **longest** subarray that meets some rule.

Think of it like adjusting a zoom lens:
- **Expand** (`R` moves right) when the window is too small or doesn't meet the rule yet
- **Shrink** (`L` moves right) when the window meets the rule and you want to find a smaller/better answer

### Finding the shortest subarray with sum ≥ 7

Array: `[2, 3, 1, 2, 4, 3]`, target = 7

[SLIDING-WINDOW:variable-shrink]

The window grows until the sum is big enough, then shrinks to find the shortest valid window.

[CODE-TABS]
```javascript
function minSubarrayLen(target, arr) {
  let left = 0, sum = 0, minLen = Infinity;

  for (let right = 0; right < arr.length; right++) {
    sum += arr[right];
    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= arr[left++];
    }
  }

  return minLen === Infinity ? 0 : minLen;
}

minSubarrayLen(7, [2, 3, 1, 2, 4, 3]); // 3
```
```typescript
function minSubarrayLen(target: number, arr: number[]): number {
  let left = 0, sum = 0, minLen = Infinity;

  for (let right = 0; right < arr.length; right++) {
    sum += arr[right];
    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= arr[left++];
    }
  }

  return minLen === Infinity ? 0 : minLen;
}

minSubarrayLen(7, [2, 3, 1, 2, 4, 3]); // 3
```
```go
func minSubarrayLen(target int, arr []int) int {
	left, sum := 0, 0
	minLen := 1 << 30

	for right := 0; right < len(arr); right++ {
		sum += arr[right]
		for sum >= target {
			if right-left+1 < minLen {
				minLen = right - left + 1
			}
			sum -= arr[left]
			left++
		}
	}

	if minLen == 1<<30 {
		return 0
	}
	return minLen
}

// minSubarrayLen(7, []int{2, 3, 1, 2, 4, 3}) // 3
```

**Window length** = `right - left + 1`. This trips up a lot of people — remember the `+ 1`.

### Finding the longest substring without repeating characters

Same idea, different direction: expand to grow the window, shrink when you hit a duplicate.

[SLIDING-WINDOW:longest-unique]

[CODE-TABS]
```javascript
function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    if (lastSeen.has(s[right]) && lastSeen.get(s[right]) >= left) {
      left = lastSeen.get(s[right]) + 1;
    }
    lastSeen.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

lengthOfLongestSubstring("abcabcbb"); // 3
```
```typescript
function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch)! >= left) {
      left = lastSeen.get(ch)! + 1;
    }
    lastSeen.set(ch, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

lengthOfLongestSubstring("abcabcbb"); // 3
```
```go
func lengthOfLongestSubstring(s string) int {
	lastSeen := make(map[byte]int)
	left, maxLen := 0, 0

	for right := 0; right < len(s); right++ {
		ch := s[right]
		if idx, ok := lastSeen[ch]; ok && idx >= left {
			left = idx + 1
		}
		lastSeen[ch] = right
		if right-left+1 > maxLen {
			maxLen = right - left + 1
		}
	}

	return maxLen
}

// lengthOfLongestSubstring("abcabcbb") // 3
```

**Why jump instead of shrinking one step at a time?** If `'a'` was last seen at index 2, any window starting before index 3 will always contain that duplicate `'a'`. Jumping `left` to 3 skips useless work.

---

## How to Recognize a Sliding Window Problem

Ask yourself three questions:

1. **Is it about a contiguous chunk?** Subarrays and substrings are contiguous. Sub*sequences* are not — those usually need different techniques.
2. **Can you update the answer incrementally?** When one element enters or leaves, can you update your sum/count in O(1) instead of rescanning?
3. **Does the problem mention size k, or shortest/longest?** That's a strong signal.

Common phrases that point to sliding window:

- "Maximum/minimum sum of subarray of size k"
- "Longest/shortest subarray where..."
- "Subarray with at most k distinct elements"
- "Longest substring without repeating characters"

---

## The Reusable Template

Most variable-size problems follow one of two shapes. Pick **one** — mixing them is the most common bug.

[CODE-TABS]
```javascript
function slidingWindow(arr) {
  let left = 0;
  let result = INITIAL_ANSWER;
  let state = {}; // sum, frequency map, etc.

  for (let right = 0; right < arr.length; right++) {
    addToWindow(state, arr[right]);

    // Shape A — shortest valid window
    while (windowIsValid(state)) {
      result = recordBest(result, left, right);
      removeFromWindow(state, arr[left++]);
    }

    // Shape B — longest valid window
    while (!windowIsValid(state)) {
      removeFromWindow(state, arr[left++]);
    }
    result = recordBest(result, left, right);
  }

  return result;
}
```
```typescript
function slidingWindow<T>(arr: T[]): number {
  let left = 0;
  let result = INITIAL_ANSWER;
  const state: WindowState = {};

  for (let right = 0; right < arr.length; right++) {
    addToWindow(state, arr[right]);

    // Shape A — shortest valid window
    while (windowIsValid(state)) {
      result = recordBest(result, left, right);
      removeFromWindow(state, arr[left++]);
    }

    // Shape B — longest valid window
    while (!windowIsValid(state)) {
      removeFromWindow(state, arr[left++]);
    }
    result = recordBest(result, left, right);
  }

  return result;
}
```
```go
func slidingWindow(arr []int) int {
	left := 0
	result := initialAnswer()
	state := newWindowState()

	for right := 0; right < len(arr); right++ {
		addToWindow(state, arr[right])

		// Shape A — shortest valid window
		for windowIsValid(state) {
			result = recordBest(result, left, right)
			removeFromWindow(state, arr[left])
			left++
		}

		// Shape B — longest valid window
		for !windowIsValid(state) {
			removeFromWindow(state, arr[left])
			left++
		}
		result = recordBest(result, left, right)
	}

	return result
}
```

**Shape A — shortest valid window**
- Shrink when the window **is** valid
- Record the answer **during** shrinking

**Shape B — longest valid window**
- Shrink when the window **isn't** valid
- Record the answer **after** shrinking

---

## Going Deeper — Loop Invariants

*If you're new to this term: a **loop invariant** is a rule that stays true every time through the loop. It's your safety check — if the rule holds, your code is correct.*

### Fixed window

> After each step, the window has exactly `k` elements, and `windowSum` is their total.

Simple: you build a window of size `k`, then each slide removes one and adds one. Size never changes.

### Shortest window (Shape A)

> After the `while` loop, the window is **invalid** — it no longer meets the rule. The best answer was recorded just before it became invalid.

### Longest window (Shape B)

> After the `while` loop, the window is **valid**. You record the answer here.

Stating the invariant before you code helps you catch off-by-one errors and pick Shape A vs Shape B correctly.

---

## Going Deeper — Why Is It O(n)?

A common question: "There's a `while` loop inside a `for` loop — isn't that O(n²)?"

[CODE-TABS]
```javascript
for (let right = 0; right < n; right++) {
  while (windowIsInvalid) {
    left++;
  }
}
```
```typescript
for (let right = 0; right < n; right++) {
  while (windowIsInvalid()) {
    left++;
  }
}
```
```go
for right := 0; right < n; right++ {
	for windowIsInvalid() {
		left++
	}
}
```

No — it's still O(n). Here's why in plain terms:

- `right` visits each index at most once
- `left` also only moves forward — it **never** goes back
- Over the entire run, `left` moves at most `n` times total

So each element enters the window once and leaves once. Two passes over the data = **O(n)**.

---

## Advanced — Minimum Window Substring

This is the classic hard problem: given string `s` and string `t`, find the **smallest** substring of `s` that contains every character in `t`.

Example: `s = "abdbca"`, `t = "abc"` → answer is `"bca"`

[SLIDING-WINDOW:min-window]

**Strategy:** Expand until all characters of `t` are covered. Then shrink from the left to make the window as small as possible. Repeat.

[CODE-TABS]
```javascript
function minWindow(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);

  let left = 0, formed = 0;
  const required = need.size;
  let minLen = Infinity, minStart = 0;
  const window = new Map();

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window.set(c, (window.get(c) || 0) + 1);
    if (need.has(c) && window.get(c) === need.get(c)) formed++;

    while (formed === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }
      const leftChar = s[left];
      window.set(leftChar, window.get(leftChar) - 1);
      if (need.has(leftChar) && window.get(leftChar) < need.get(leftChar)) formed--;
      left++;
    }
  }

  return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen);
}

minWindow("abdbca", "abc"); // "bca"
```
```typescript
function minWindow(s: string, t: string): string {
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);

  let left = 0, formed = 0;
  const required = need.size;
  let minLen = Infinity, minStart = 0;
  const window = new Map<string, number>();

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window.set(c, (window.get(c) ?? 0) + 1);
    if (need.has(c) && window.get(c) === need.get(c)) formed++;

    while (formed === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }
      const leftChar = s[left];
      window.set(leftChar, window.get(leftChar)! - 1);
      if (need.has(leftChar) && window.get(leftChar)! < need.get(leftChar)!) formed--;
      left++;
    }
  }

  return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen);
}

minWindow("abdbca", "abc"); // "bca"
```
```go
func minWindow(s, t string) string {
	need := make(map[byte]int)
	for i := 0; i < len(t); i++ {
		need[t[i]]++
	}

	left, formed := 0, 0
	required := len(need)
	minLen, minStart := 1<<30, 0
	window := make(map[byte]int)

	for right := 0; right < len(s); right++ {
		ch := s[right]
		window[ch]++
		if count, ok := need[ch]; ok && window[ch] == count {
			formed++
		}

		for formed == required {
			if right-left+1 < minLen {
				minLen = right - left + 1
				minStart = left
			}
			leftChar := s[left]
			window[leftChar]--
			if count, ok := need[leftChar]; ok && window[leftChar] < count {
				formed--
			}
			left++
		}
	}

	if minLen == 1<<30 {
		return ""
	}
	return s[minStart : minStart+minLen]
}

// minWindow("abdbca", "abc") // "bca"
```

**Performance tip:** Track `formed` (how many unique characters are satisfied) instead of comparing the entire frequency map on every step.

---

## Advanced — Monotonic Deque (Max in a Window)

So far we've tracked **sums** — easy to update by adding and subtracting. But what if you need the **maximum** value in every window of size k?

You can't just subtract the old max when it leaves — the new max might have been hiding inside the window all along.

**Solution:** Keep a **deque** (double-ended queue) of indices, sorted by value — largest at the front. Think of it as a "leaderboard" of candidates for maximum.

[SLIDING-WINDOW:monotonic-deque]

**Rules:**
1. Before adding a new index, remove smaller values from the back — they'll never be the max while the new value is around
2. Remove indices from the front when they fall outside the window
3. The front of the deque is always the current maximum

[CODE-TABS]
```javascript
function maxSlidingWindow(nums, k) {
  const deque = [];
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && nums[deque.at(-1)] <= nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }

  return result;
}

maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3);
// [3, 3, 5, 5, 6, 7]
```
```typescript
function maxSlidingWindow(nums: number[], k: number): number[] {
  const deque: number[] = [];
  const result: number[] = [];

  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && nums[deque.at(-1)!] <= nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }

  return result;
}

maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3);
// [3, 3, 5, 5, 6, 7]
```
```go
func maxSlidingWindow(nums []int, k int) []int {
	deque := []int{}
	result := []int{}

	for i := 0; i < len(nums); i++ {
		for len(deque) > 0 && deque[0] <= i-k {
			deque = deque[1:]
		}
		for len(deque) > 0 && nums[deque[len(deque)-1]] <= nums[i] {
			deque = deque[:len(deque)-1]
		}
		deque = append(deque, i)
		if i >= k-1 {
			result = append(result, nums[deque[0]])
		}
	}

	return result
}

// maxSlidingWindow([]int{1, 3, -1, -3, 5, 3, 6, 7}, 3)
// []int{3, 3, 5, 5, 6, 7}
```

**Where you'll see this in real life:** rolling peak latency in monitoring, max throughput in a time bucket, any "highest value in the last N minutes" dashboard.

---

## Advanced — The "At Most K" Trick

Some problems ask for **exactly** K distinct elements. That's awkward with a single window. The trick:

```
answer for exactly K  =  (count with at most K)  −  (count with at most K−1)
```

Why? Every subarray with exactly K distinct elements is counted in "at most K" but *not* in "at most K−1". Subtracting removes the overlap.

"At most K" is a standard sliding window:

[CODE-TABS]
```javascript
function subarraysWithKDistinct(nums, k) {
  return atMost(nums, k) - atMost(nums, k - 1);
}

function atMost(nums, k) {
  let left = 0, count = 0;
  const freq = new Map();

  for (let right = 0; right < nums.length; right++) {
    freq.set(nums[right], (freq.get(nums[right]) || 0) + 1);

    while (freq.size > k) {
      const l = nums[left++];
      freq.set(l, freq.get(l) - 1);
      if (freq.get(l) === 0) freq.delete(l);
    }

    count += right - left + 1;
  }

  return count;
}
```
```typescript
function subarraysWithKDistinct(nums: number[], k: number): number {
  return atMost(nums, k) - atMost(nums, k - 1);
}

function atMost(nums: number[], k: number): number {
  let left = 0, count = 0;
  const freq = new Map<number, number>();

  for (let right = 0; right < nums.length; right++) {
    freq.set(nums[right], (freq.get(nums[right]) ?? 0) + 1);

    while (freq.size > k) {
      const l = nums[left++];
      freq.set(l, freq.get(l)! - 1);
      if (freq.get(l) === 0) freq.delete(l);
    }

    count += right - left + 1;
  }

  return count;
}
```
```go
func subarraysWithKDistinct(nums []int, k int) int {
	return atMost(nums, k) - atMost(nums, k-1)
}

func atMost(nums []int, k int) int {
	left, count := 0, 0
	freq := make(map[int]int)

	for right := 0; right < len(nums); right++ {
		freq[nums[right]]++

		for len(freq) > k {
			l := nums[left]
			left++
			freq[l]--
			if freq[l] == 0 {
				delete(freq, l)
			}
		}

		count += right - left + 1
	}

	return count
}
```

**Why `count += right - left + 1`?** For a fixed `right`, every starting position from `left` to `right` gives a valid subarray ending at `right`. That's `right - left + 1` subarrays in one step.

---

## Which Technique Should I Use?

```
Is it about a contiguous subarray or substring?
├── No  → Probably not sliding window (try DP or prefix sums)
└── Yes
    ├── Window size k is fixed?
    │   ├── Tracking sum/count/average → Fixed window
    │   └── Tracking max/min → Monotonic deque
    ├── Need shortest or longest window?
    │   ├── Shortest → Shape A (shrink while valid)
    │   ├── Longest  → Shape B (shrink while invalid)
    │   └── Exactly K of something → atMost(K) − atMost(K−1)
    ├── All numbers positive?
    │   ├── Yes → Sum-based window works
    │   └── No  → Sum trick breaks; try prefix sums instead
    └── Count ALL valid subarrays?
        → Shape B + add (right − left + 1) each step
```

---

## When Sliding Window Won't Work

Knowing the limits is just as important as knowing the pattern.

**Non-contiguous subsequence** — Window must be contiguous. Use dynamic programming instead.

**Negative numbers in sum problems** — Sum isn't monotonic; the window can flip valid/invalid. Use prefix sums + hash map.

**Circular arrays** — Linear windows can't wrap. Double the array or use modulo arithmetic.

**Out-of-order event streams** — Pointers assume ordered input. Use watermarking or buffering.

---

## Real-World Uses (Beyond Interviews)

Sliding window isn't just a puzzle trick. You'll find it in production systems:

**API rate limiting** — "Allow 100 requests per 60 seconds." A fixed window slides across timestamps. Same pattern as max-sum-of-size-k, but time is the axis instead of array indices.

[CODE-TABS]
```javascript
class RateLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.timestamps = [];
  }

  allow() {
    const now = Date.now();
    while (this.timestamps.length && this.timestamps[0] <= now - this.windowMs) {
      this.timestamps.shift();
    }
    if (this.timestamps.length >= this.limit) return false;
    this.timestamps.push(now);
    return true;
  }
}
```
```typescript
class RateLimiter {
  private limit: number;
  private windowMs: number;
  private timestamps: number[] = [];

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  allow(): boolean {
    const now = Date.now();
    while (this.timestamps.length && this.timestamps[0] <= now - this.windowMs) {
      this.timestamps.shift();
    }
    if (this.timestamps.length >= this.limit) return false;
    this.timestamps.push(now);
    return true;
  }
}
```
```go
type RateLimiter struct {
	limit      int
	windowMs   int64
	timestamps []int64
}

func NewRateLimiter(limit int, windowMs int64) *RateLimiter {
	return &RateLimiter{limit: limit, windowMs: windowMs}
}

func (r *RateLimiter) Allow() bool {
	now := time.Now().UnixMilli()
	for len(r.timestamps) > 0 && r.timestamps[0] <= now-r.windowMs {
		r.timestamps = r.timestamps[1:]
	}
	if len(r.timestamps) >= r.limit {
		return false
	}
	r.timestamps = append(r.timestamps, now)
	return true
}
```

**Rolling metrics** — P99 latency over the last 5 minutes, error rate in the last 1000 requests. Fixed windows with incremental sum/count updates.

**Log alerting** — "Fire an alert if more than 5 errors appear in the last 100 log lines." Variable-size window on a stream.

**Session tracking** — Group user events into sessions separated by 30+ minutes of inactivity. Expand the window until the gap is too large, then close the session.

---

## Complexity at a Glance

- **Brute force** — O(n²) time, O(1) space. Good for understanding the problem.
- **Fixed window** — O(n) time, O(1) space. Size-k sums, averages, anagrams.
- **Variable window** — O(n) time, O(1)–O(Σ) space. Shortest/longest subarrays.
- **Monotonic deque** — O(n) time, O(k) space. Max/min in each window.
- **atMost(K) subtraction** — O(n) time, O(K) space. Exactly K distinct elements.

*Σ = alphabet size or number of distinct values you track.*

---

## Common Mistakes

**Using Shape A and Shape B together.** They're different strategies. Shortest window? Shrink while valid. Longest window? Shrink while invalid. Pick one.

**Forgetting `+ 1` in window length.** Length = `right - left + 1`, not `right - left`.

**Recomputing the whole window each step.** If you're summing all elements from scratch every slide, you've missed the point. Update incrementally.

**Assuming sliding window works with negative numbers.** `[-1, 2, -3, 4]` with target 2 will break a naive sum-based approach. Use prefix sums instead.

**Not handling the "no answer" case.** Return `0`, `""`, or `-1` when no valid window exists — not `Infinity` or an empty uninitialized variable.

**Comparing full frequency maps every step.** In minimum window substring, track a `formed` counter instead.

---

## Practice Problems (Easiest → Hardest)

[PRACTICE-PROBLEMS]

---

## Quick Reference — Pattern Picker

[QUICK-REF]

---

## Key Takeaways

1. **Slide, don't restart.** The whole point is reusing work from the previous window.
2. **Two pointers, always forward.** That's what makes it O(n).
3. **Fixed vs variable.** Fixed when `k` is given. Variable when you're optimizing length.
4. **Shape A vs Shape B.** Shortest = shrink while valid. Longest = shrink while invalid.
5. **Not everything is a sum.** Max/min needs a monotonic deque.
6. **"Exactly K" = subtract two "at most" counts.** A powerful trick worth memorizing.
7. **Step through the animations.** If you can explain each move out loud, you can code it.

Happy sliding.
