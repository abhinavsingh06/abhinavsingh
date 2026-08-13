---
title: Stacks & Queues — Complete Guide with Interactive Walkthroughs
excerpt: Master LIFO stacks, FIFO queues, and monotonic deques — parentheses matching, adjacent duplicates, recent calls, daily temperatures, and sliding window maximum. Animations included.
date: 2026-08-06
category: Algorithms
featured: true
---


A **stack** is an ordered collection where you only add and remove from the **same end** — **LIFO** (last in, first out). Think of a stack of plates, or browser history: visit A → B → C, then back removes C first.

A **queue** adds and removes from **opposite ends** — **FIFO** (first in, first out). Think of a line at a restaurant, or jobs on a first-come printer.

Both are **abstract interfaces**, not a single implementation. Arrays make great stacks; efficient queues usually need a **deque** or doubly linked list.

This guide continues the series after [Linked Lists](/blog/linked-list-technique) and pairs with [Sliding Window](/blog/sliding-window-technique) and [Hashing](/blog/hashing-technique).


## Core Patterns

[STACK-QUEUE-PATTERNS]


## Stacks — LIFO

**Push** inserts, **pop** removes, **peek** looks at the top without removing. With a dynamic array: `push` / `pop` are **O(1)** amortized; search is **O(n)**.

Stacks and **recursion** are close cousins — call frames are pushed and popped on a call stack.

**When to reach for a stack:** the problem has a **LIFO** shape — matching openers with the most recent unclosed item, undoing the latest action, or processing “most recent unresolved” indices first.

### Language sketch

| Language | Stack |
|----------|-------|
| JavaScript / TS | `array.push` / `array.pop` |
| Python | `list.append` / `list.pop` |
| Go | slice append + truncate |
| Java | `Deque` / `ArrayDeque` as stack |


## String Problems with Stacks

Iterate the string, push characters (or openers), and compare the **top** with the current character. The stack stores **history**.

### Example 1 — Valid Parentheses

[LeetCode 20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)

Open brackets must close in the reverse order they opened. That is pure LIFO.

Map each opener to its closer. On `'('`, `'{'`, `'['` — push. On a closer — pop and check the match. Stack must be empty at the end.

[STACK-QUEUE:parentheses]

[CODE-TABS]
```javascript
function isValid(s) {
  const pairs = { ")": "(", "}": "{", "]": "[" };
  const stack = [];

  for (const ch of s) {
    if (ch === "(" || ch === "{" || ch === "[") {
      stack.push(ch);
    } else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }

  return stack.length === 0;
}
```
```typescript
function isValid(s: string): boolean {
  const pairs: Record<string, string> = { ")": "(", "}": "{", "]": "[" };
  const stack: string[] = [];

  for (const ch of s) {
    if (ch === "(" || ch === "{" || ch === "[") {
      stack.push(ch);
    } else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }

  return stack.length === 0;
}
```
```go
func isValid(s string) bool {
	pairs := map[byte]byte{')': '(', '}': '{', ']': '['}
	stack := []byte{}

	for i := 0; i < len(s); i++ {
		ch := s[i]
		if ch == '(' || ch == '{' || ch == '[' {
			stack = append(stack, ch)
		} else {
			if len(stack) == 0 || stack[len(stack)-1] != pairs[ch] {
				return false
			}
			stack = stack[:len(stack)-1]
		}
	}
	return len(stack) == 0
}
```

**Complexity:** **O(n)** time and space.

### Example 2 — Remove Adjacent Duplicates

[LeetCode 1047](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/)

Keep deleting pairs of equal neighbors until none remain. Deletions unlock later pairs — order is LIFO (`"abccba"` deletes c → b → a).

Push each char; if it equals the top, pop instead.

[STACK-QUEUE:duplicates]

[CODE-TABS]
```javascript
function removeDuplicates(s) {
  const stack = [];
  for (const ch of s) {
    if (stack.length && stack[stack.length - 1] === ch) stack.pop();
    else stack.push(ch);
  }
  return stack.join("");
}
```
```typescript
function removeDuplicates(s: string): string {
  const stack: string[] = [];
  for (const ch of s) {
    if (stack.length && stack[stack.length - 1] === ch) stack.pop();
    else stack.push(ch);
  }
  return stack.join("");
}
```
```go
func removeDuplicates(s string) string {
	stack := []byte{}
	for i := 0; i < len(s); i++ {
		ch := s[i]
		if len(stack) > 0 && stack[len(stack)-1] == ch {
			stack = stack[:len(stack)-1]
		} else {
			stack = append(stack, ch)
		}
	}
	return string(stack)
}
```

### Example 3 — Backspace String Compare

[LeetCode 844](https://leetcode.com/problems/backspace-string-compare/)

`'#'` deletes the most recently typed character — again LIFO. Simulate both strings with stacks (guard empty pops), then compare.

[STACK-QUEUE:backspace]

[CODE-TABS]
```javascript
function build(s) {
  const stack = [];
  for (const ch of s) {
    if (ch === "#") stack.pop();
    else stack.push(ch);
  }
  return stack.join("");
}

function backspaceCompare(s, t) {
  return build(s) === build(t);
}
```
```typescript
function build(s: string): string {
  const stack: string[] = [];
  for (const ch of s) {
    if (ch === "#") stack.pop();
    else stack.push(ch);
  }
  return stack.join("");
}

function backspaceCompare(s: string, t: string): boolean {
  return build(s) === build(t);
}
```
```go
func build(s string) string {
	stack := []byte{}
	for i := 0; i < len(s); i++ {
		if s[i] == '#' {
			if len(stack) > 0 {
				stack = stack[:len(stack)-1]
			}
		} else {
			stack = append(stack, s[i])
		}
	}
	return string(stack)
}

func backspaceCompare(s string, t string) bool {
	return build(s) == build(t)
}
```


## Queues — FIFO

Enqueue at one end, dequeue at the other. A plain array that shifts from the front is **O(n)** — use a **deque** (or doubly linked list with head/tail) for **O(1)** ends.

A **deque** (double-ended queue) supports add/remove on **both** ends. Queues alone are rarer in interviews than stacks; their star role is **BFS** (coming in trees & graphs). Still useful for streams with expiry.

[STACK-QUEUE-VS]

### Example — Number of Recent Calls

[LeetCode 933](https://leetcode.com/problems/number-of-recent-calls/)

`ping(t)` records a call and returns how many calls fall in `[t - 3000, t]`. Times only increase — drop outdated values from the **front** of a queue.

[STACK-QUEUE:recent-calls]

[CODE-TABS]
```javascript
class RecentCounter {
  constructor() {
    this.q = [];
  }

  ping(t) {
    this.q.push(t);
    while (this.q[0] < t - 3000) this.q.shift();
    return this.q.length;
  }
}
```
```typescript
class RecentCounter {
  private q: number[] = [];

  ping(t: number): number {
    this.q.push(t);
    while (this.q[0] < t - 3000) this.q.shift();
    return this.q.length;
  }
}
```
```go
type RecentCounter struct {
	q []int
}

func Constructor() RecentCounter {
	return RecentCounter{q: []int{}}
}

func (this *RecentCounter) Ping(t int) int {
	this.q = append(this.q, t)
	for this.q[0] < t-3000 {
		this.q = this.q[1:]
	}
	return len(this.q)
}
```

With an efficient front removal, each call is amortized **O(1)**.


## Monotonic Stacks & Queues

**Monotonic** means the structure stays sorted (non-increasing or non-decreasing). Before pushing `x`, pop anything that would break the order.

```
stack = []
for num in nums:
    while stack not empty AND stack.top violates order with num:
        stack.pop()
    // problem-specific logic here
    stack.push(num)
```

Despite the nested loop, time is still **O(n)** — each element is pushed and popped **at most once**.

Use them for **next greater/smaller** problems, or to track **max/min in a moving window**.

### Example 1 — Daily Temperatures

[LeetCode 739](https://leetcode.com/problems/daily-temperatures/)

For each day, how many days until a warmer temperature? Brute force is **O(n²)**. Keep a **monotonically decreasing** stack of **indices**. When you see a warmer day, pop colder days and fill `answer[j] = i - j`.

[STACK-QUEUE:daily-temps]

[CODE-TABS]
```javascript
function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = Array(n).fill(0);
  const stack = []; // indices, decreasing temps

  for (let i = 0; i < n; i++) {
    while (
      stack.length &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      const j = stack.pop();
      answer[j] = i - j;
    }
    stack.push(i);
  }

  return answer;
}
```
```typescript
function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const answer = Array(n).fill(0);
  const stack: number[] = [];

  for (let i = 0; i < n; i++) {
    while (
      stack.length &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      const j = stack.pop()!;
      answer[j] = i - j;
    }
    stack.push(i);
  }

  return answer;
}
```
```go
func dailyTemperatures(temperatures []int) []int {
	n := len(temperatures)
	answer := make([]int, n)
	stack := []int{}

	for i := 0; i < n; i++ {
		for len(stack) > 0 && temperatures[i] > temperatures[stack[len(stack)-1]] {
			j := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			answer[j] = i - j
		}
		stack = append(stack, i)
	}
	return answer
}
```

Strictly speaking this stack is **monotonically non-increasing** (equals allowed). Use `>=` / `<=` if you must forbid ties.

### Example 2 — Sliding Window Maximum

[LeetCode 239](https://leetcode.com/problems/sliding-window-maximum/)

Window of size `k` slides across `nums`; return the max in each window. When the max leaves, you need the next-best — a **monotonic decreasing deque** of indices:

- Pop from the **right** while the new value is larger (smaller values can never be max again)
- Pop from the **left** when the index falls outside the window
- Front of the deque is always the current max

[STACK-QUEUE:window-max]

[CODE-TABS]
```javascript
function maxSlidingWindow(nums, k) {
  const deque = []; // indices, decreasing values
  const out = [];

  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) out.push(nums[deque[0]]);
  }

  return out;
}
```
```typescript
function maxSlidingWindow(nums: number[], k: number): number[] {
  const deque: number[] = [];
  const out: number[] = [];

  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) out.push(nums[deque[0]]);
  }

  return out;
}
```
```go
func maxSlidingWindow(nums []int, k int) []int {
	deque := []int{}
	out := []int{}

	for i := 0; i < len(nums); i++ {
		for len(deque) > 0 && deque[0] <= i-k {
			deque = deque[1:]
		}
		for len(deque) > 0 && nums[deque[len(deque)-1]] <= nums[i] {
			deque = deque[:len(deque)-1]
		}
		deque = append(deque, i)
		if i >= k-1 {
			out = append(out, nums[deque[0]])
		}
	}
	return out
}
```

**Complexity:** **O(n)** time, **O(k)** space.

### Example 3 — Longest Subarray with Abs Diff ≤ Limit

[LeetCode 1438](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/)

Longest subarray where `max − min ≤ limit`. Classic [sliding window](/blog/sliding-window-technique) plus **two** monotonic deques — one increasing (min at front), one decreasing (max at front). Shrink `left` while `max − min > limit`.

Window length = `right − left + 1`. Overall **O(n)**.


## Complexity Cheat Sheet

[STACK-QUEUE-COMPLEXITY]


## Common Mistakes

**Using array `shift` as a queue in hot loops** without a real deque — becomes **O(n²)** accidentally.

**Forgetting empty-stack pops** on backspace or mismatched closers.

**Storing values instead of indices** when you need distance or window bounds (temperatures, window max).

**Thinking nested `while` is O(n²)** — if each element enters/leaves once, it is still **O(n)**.

**Strict vs non-strict monotonic** — know whether equal elements are allowed (`>` vs `>=`).

**Skipping the LIFO recognition step** — if “most recent unmatched X” matters, try a stack first.


## Practice Problems (Easiest → Hardest)

[STACK-QUEUE-PRACTICE]


## Quick Reference — Pattern Picker

[STACK-QUEUE-QUICK-REF]


## Key Takeaways

1. **Stack = LIFO** (same end). **Queue = FIFO** (opposite ends). **Deque** does both.
2. Spot **LIFO** in matching, undo, and “most recent unresolved” problems.
3. String stacks: push openers / chars; pop on match, duplicate, or backspace.
4. Efficient queues need **O(1)** front removal — use a deque, not `shift` in a tight loop.
5. **Monotonic stack** → next greater / daily temperatures.
6. **Monotonic deque** → sliding window max (and min+max constraints).
7. Nested pop loops stay **O(n)** when each element is processed once.
8. Queues shine even more in **BFS** — next up in trees & graphs.

Pair this with [Sliding Window](/blog/sliding-window-technique) for window problems, [Hashing](/blog/hashing-technique) for bracket maps, and [Linked Lists](/blog/linked-list-technique) for deque implementations under the hood.
