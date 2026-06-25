---
title: Two Pointers — Complete Guide with Interactive Walkthroughs
excerpt: Master the two pointers technique for arrays and strings — opposite ends, merge walk, palindrome checks, two sum on sorted input, and subsequence matching. Step-through animations included.
date: 2025-06-26
category: Algorithms
featured: true
---

# Two Pointers — Complete Guide with Interactive Walkthroughs

**Two pointers** is one of the most common patterns in coding interviews. You keep two integer indices moving along an array or string — usually called `left`/`right` or `i`/`j` — and make **O(1)** work per step. Done right, the whole algorithm stays **linear**.

This guide follows the same format as a structured algorithms course: we introduce the idea, then walk through classic examples **with interactive animations**. The walkthrough problems are for learning — you don't need to solve them cold on first read.

---

## What Is Two Pointers?

Two pointers means using **two index variables** that move along an iterable (array or string). They never jump randomly — each step advances at least one pointer in a controlled way, which is why runtime stays **O(n)** (or **O(n + m)** for two inputs).

There are two main families:

[TWO-POINTERS-PATTERNS]

---

## Pattern 1 — Opposite Ends (Move Inward)

Start one pointer at the first index and one at the last. Loop until they meet:

```
function fn(arr):
    left = 0
    right = arr.length - 1

    while left < right:
        # problem-specific logic
        # then: left++, or right--, or both
```

**Why it's O(n):** the pointers start `n` apart and move closer every iteration — at most **O(n)** loop iterations. If inner work is **O(1)**, total time is **O(n)** and space is **O(1)**.

---

## Example 1 — Valid Palindrome

A string is a **palindrome** if it reads the same forward and backward (`"racecar"`, `"abcdcba"`).

After reversing, the first character must equal the last, the second must equal the second-last, and so on. Two pointers check pairs from both ends:

[TWO-POINTERS:palindrome]

[CODE-TABS]
```javascript
function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }

  return true;
}

isPalindrome("racecar"); // true
isPalindrome("abcde");   // false
```
```typescript
function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }

  return true;
}
```
```go
func isPalindrome(s string) bool {
	left, right := 0, len(s)-1
	for left < right {
		if s[left] != s[right] {
			return false
		}
		left++
		right--
	}
	return true
}
```

**Complexity:** **O(n)** time, **O(1)** space — only two integers no matter how long the string.

---

## Example 2 — Two Sum on a Sorted Array

Given a **sorted** array of unique integers and a `target`, return whether **any pair** sums to `target`. (LeetCode [167. Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/).)

Brute force checks every pair: **O(n²)**. Because the array is sorted, opposite-end pointers do better:

- If `nums[left] + nums[right] > target` → sum too big → `right--`
- If sum `< target` → sum too small → `left++`
- If sum `=== target` → found

[TWO-POINTERS:two-sum-sorted]

**Why moving `right` is safe when sum is too large:** `nums[left]` is the smallest value we can pair with `nums[right]`. If even that sum exceeds `target`, no smaller partner for `nums[right]` exists — so `right` can never be part of a solution. Symmetric logic applies when the sum is too small.

[CODE-TABS]
```javascript
function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return true;
    if (sum > target) right--;
    else left++;
  }

  return false;
}

twoSumSorted([1, 2, 4, 6, 8, 9, 14, 15], 13); // true (4 + 9)
```
```typescript
function twoSumSorted(nums: number[], target: number): boolean {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return true;
    if (sum > target) right--;
    else left++;
  }

  return false;
}
```
```go
func twoSumSorted(nums []int, target int) bool {
	left, right := 0, len(nums)-1
	for left < right {
		sum := nums[left] + nums[right]
		if sum == target {
			return true
		}
		if sum > target {
			right--
		} else {
			left++
		}
	}
	return false
}
```

**Complexity:** **O(n)** time, **O(1)** space.

---

## Pattern 2 — Parallel Scan (Two Inputs)

When you have **two sorted arrays** (or a pattern + text), start `i` and `j` at index 0 and advance one or both:

```
function fn(arr1, arr2):
    i = j = 0
    while i < arr1.length AND j < arr2.length:
        # compare arr1[i] vs arr2[j]
        # advance i, j, or both

    # exhaust leftovers if needed
```

At most **n + m** pointer moves → **O(n + m)** when inner work is **O(1)**.

---

## Example 3 — Merge Two Sorted Arrays

Combine two sorted arrays into one sorted array.

Naive approach: concatenate + sort → **O((n+m) log(n+m))**. Two pointers merge in **O(n + m)**:

[TWO-POINTERS:merge-sorted]

[CODE-TABS]
```javascript
function mergeSorted(arr1, arr2) {
  const ans = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) ans.push(arr1[i++]);
    else ans.push(arr2[j++]);
  }

  while (i < arr1.length) ans.push(arr1[i++]);
  while (j < arr2.length) ans.push(arr2[j++]);

  return ans;
}

mergeSorted([1, 3, 5], [2, 4, 6]); // [1,2,3,4,5,6]
```
```typescript
function mergeSorted(arr1: number[], arr2: number[]): number[] {
  const ans: number[] = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) ans.push(arr1[i++]);
    else ans.push(arr2[j++]);
  }

  while (i < arr1.length) ans.push(arr1[i++]);
  while (j < arr2.length) ans.push(arr2[j++]);

  return ans;
}
```
```go
func mergeSorted(arr1, arr2 []int) []int {
	ans := []int{}
	i, j := 0, 0
	for i < len(arr1) && j < len(arr2) {
		if arr1[i] <= arr2[j] {
			ans = append(ans, arr1[i])
			i++
		} else {
			ans = append(ans, arr2[j])
			j++
		}
	}
	for i < len(arr1) {
		ans = append(ans, arr1[i])
		i++
	}
	for j < len(arr2) {
		ans = append(ans, arr2[j])
		j++
	}
	return ans
}
```

---

## Example 4 — Is Subsequence

Given strings `s` and `t`, return whether `s` is a **subsequence** of `t` (LeetCode [392](https://leetcode.com/problems/is-subsequence/)).

`"ace"` is a subsequence of `"abcde"` — letters appear in order with gaps allowed. `"aec"` is not (wrong order).

Walk `t` with `j`. When `s[i] === t[j]`, you "found" the next character of `s` → `i++`. Always `j++`. Success when `i === s.length`.

[TWO-POINTERS:subsequence]

[CODE-TABS]
```javascript
function isSubsequence(s, t) {
  let i = 0;
  let j = 0;

  while (i < s.length && j < t.length) {
    if (s[i] === t[j]) i++;
    j++;
  }

  return i === s.length;
}

isSubsequence("ace", "abcde"); // true
isSubsequence("aec", "abcde"); // false
```
```typescript
function isSubsequence(s: string, t: string): boolean {
  let i = 0;
  let j = 0;

  while (i < s.length && j < t.length) {
    if (s[i] === t[j]) i++;
    j++;
  }

  return i === s.length;
}
```
```go
func isSubsequence(s, t string) bool {
	i, j := 0, 0
	for i < len(s) && j < len(t) {
		if s[i] == t[j] {
			i++
		}
		j++
	}
	return i == len(s)
}
```

**Complexity:** **O(|s| + |t|)** time, **O(1)** space.

---

## Two Pointers vs Sliding Window

Both use two indices, but the **intent** differs:

[TWO-POINTERS-VS-SW]

Many problems blur the line — that's fine. The label matters less than recognizing **linear movement with O(1) per step**.

---

## When the Template Shifts

The patterns above are **guidelines**, not laws:

- Sometimes both pointers start at index **0** and move forward on the **same** array (e.g. remove duplicates in-place).
- Sometimes you need **three pointers** (3Sum extends two sum with a fixed outer index).
- Sorted input is often required for the opposite-ends trick; unsorted two sum needs a hash map instead.

Stay flexible — if the iterable structure suggests pairing ends or scanning two sequences in parallel, try two pointers first.

---

## Complexity Cheat Sheet

[TWO-POINTERS-COMPLEXITY]

---

## Practice Problems (Easiest → Hardest)

[TWO-POINTERS-PRACTICE]

---

## Quick Reference — Pattern Picker

[TWO-POINTERS-QUICK-REF]

---

## Key Takeaways

1. **Two indices, linear moves.** Each pointer advances in a controlled way — that's the O(n) guarantee.
2. **Opposite ends** when comparing pairs from both sides or the input is **sorted**.
3. **Parallel scan** when merging or matching across **two sequences**.
4. **Decide which pointer moves** before you code — write the rule in plain English first.
5. **Sorted input unlocks opposite ends** for two sum; unsorted two sum needs a hash map.
6. **3Sum = sort + outer index + two pointers** — a natural extension of pattern 1.
7. **Step through the animations.** If you can narrate each pointer move, you can implement it.

If this helped, pair it with the [Sliding Window Technique](/blog/sliding-window-technique) guide for contiguous subarray problems.
