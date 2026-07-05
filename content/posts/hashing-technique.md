---
title: Hashing — Complete Guide with Interactive Walkthroughs
excerpt: Master hash maps and sets for O(1) lookups — existence checks, frequency counting, prefix + frequency patterns, and grouping. The most important data structure in interview prep. Animations included.
date: 2026-07-05
category: Algorithms
featured: true
---

# Hashing — Complete Guide with Interactive Walkthroughs

If you could only master **one** data structure for coding interviews, make it the **hash map**. Hash maps (and their sibling **sets**) give you **O(1)** average-time add, remove, and lookup — turning nested **O(n²)** loops into single-pass **O(n)** algorithms over and over again.

This guide follows the same format as [Two Pointers](/blog/two-pointers-technique), [Sliding Window](/blog/sliding-window-technique), and [Prefix Sum](/blog/prefix-sum-technique): core concepts, interactive walkthroughs, code in three languages, and a practice ladder. Focus on the **interface** — how to use built-in maps and sets — not implementing hash tables from scratch.

---

## Interface vs Implementation

A data structure has two parts:

- **Interface** — what operations you can perform and what they return (`set`, `get`, `has`, `delete`)
- **Implementation** — how it works under the hood (hash function, collision handling, resizing)

In interviews you use the **built-in** hash map of your language. You won't be asked to implement one — but you should know what it gives you: **key → value** storage with fast lookup.

| Language | Hash Map | Hash Set |
|----------|----------|----------|
| JavaScript | `Map` / `Object` | `Set` |
| TypeScript | `Map<K, V>` | `Set<T>` |
| Go | `map[K]V` | `map[K]struct{}` |
| Python | `dict` | `set` |

**Keys must be immutable** (or hashable). Arrays are mutable — convert to a tuple, sorted string, or delimited string before using as a key.

---

## What Is Hashing?

A **hash function** converts any input (string, number, object) into an integer within a fixed range. The same key always maps to the same bucket.

```
key  →  hash(key) % tableSize  →  bucket index
```

Combined with an array, this creates a **hash map**: map **keys** to **values** without requiring integer indices.

**Hash map** — stores key-value pairs. Duplicate keys overwrite.

**Hash set** — stores keys only (no values). Adding the same element twice does nothing.

Five patterns cover most interview problems:

[HASHING-PATTERNS]

---

## Hash Map vs Array

| Operation | Hash Map / Set | Array (unsorted) |
|-----------|----------------|------------------|
| Check if element exists | **O(1)** avg | **O(n)** |
| Add with lookup | **O(1)** avg | **O(1)** append, **O(n)** search |
| Two Sum on n elements | **O(n)** | **O(n²)** |

**Tradeoffs:** Hash maps have constant-factor overhead and can use more memory. For tiny inputs, a plain array scan can be faster. For unknown key ranges (e.g. value `999999999`), a hash map is safer than sizing a giant array.

[HASHING-VS-ARRAYS]

**Note:** "O(1) hash map operations" are O(1) relative to map **size n**. Hashing a string of length **m** costs **O(m)**.

---

## Pattern 1 — Checking for Existence

Anytime you write `if (x in arr)` inside a loop, consider a **set** or **map** for **O(1)** lookup.

### Example 1 — Two Sum

[LeetCode 1. Two Sum](https://leetcode.com/problems/two-sum/)

Given `nums` and `target`, return indices of two numbers that add to `target`.

**Brute force:** nested loops → **O(n²)**.

**Hash map:** at index `i`, check if `target - nums[i]` is already in the map. Store `nums[i] → i` as you go.

[HASHING:two-sum]

[CODE-TABS]
```javascript
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}

twoSum([2, 7, 11, 15], 9); // [0, 1]
```
```typescript
function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need)!, i];
    seen.set(nums[i], i);
  }
  return [];
}
```
```go
func twoSum(nums []int, target int) []int {
	seen := map[int]int{}
	for i, num := range nums {
		if j, ok := seen[target-num]; ok {
			return []int{j, i}
		}
		seen[num] = i
	}
	return nil
}
```

**Why a map, not a set?** We need **indices**, not just whether a pair exists.

**Complexity:** **O(n)** time, **O(n)** space.

---

### Example 2 — First Letter to Appear Twice

[LeetCode 2351](https://leetcode.com/problems/first-letter-to-appear-twice/)

Return the first character in `s` that appears twice.

**Brute force:** for each position, scan earlier characters → **O(n²)**.

**Set:** if `c` is already in the set, return `c`. Otherwise add it.

[HASHING:first-letter]

[CODE-TABS]
```javascript
function repeatedCharacter(s) {
  const seen = new Set();
  for (const c of s) {
    if (seen.has(c)) return c;
    seen.add(c);
  }
  return "";
}

repeatedCharacter("abccba"); // "c"
```
```typescript
function repeatedCharacter(s: string): string {
  const seen = new Set<string>();
  for (const c of s) {
    if (seen.has(c)) return c;
    seen.add(c);
  }
  return "";
}
```
```go
func repeatedCharacter(s string) byte {
	seen := map[byte]bool{}
	for i := 0; i < len(s); i++ {
		if seen[s[i]] {
			return s[i]
		}
		seen[s[i]] = true
	}
	return 0
}
```

**Space:** **O(m)** where **m** is the number of possible characters (26 for lowercase English — often called **O(1)** in interviews).

---

### Example 3 — Isolated Numbers

Return all `x` in `nums` where **neither** `x + 1` nor `x - 1` exists in `nums`. Each valid `x` appears once in the answer.

**Pre-process** `nums` into a set, then check neighbors in **O(1)** per element.

[CODE-TABS]
```javascript
function findIsolated(nums) {
  const set = new Set(nums);
  const ans = [];
  for (const x of nums) {
    if (!set.has(x + 1) && !set.has(x - 1) && !ans.includes(x)) {
      ans.push(x);
    }
  }
  return ans;
}

findIsolated([1, 2, 3, 5, 8]); // [5, 8]
```
```typescript
function findIsolated(nums: number[]): number[] {
  const set = new Set(nums);
  const ans: number[] = [];
  const added = new Set<number>();
  for (const x of nums) {
    if (!set.has(x + 1) && !set.has(x - 1) && !added.has(x)) {
      ans.push(x);
      added.add(x);
    }
  }
  return ans;
}
```
```go
func findIsolated(nums []int) []int {
	set := map[int]bool{}
	for _, x := range nums {
		set[x] = true
	}
	seen := map[int]bool{}
	ans := []int{}
	for _, x := range nums {
		if set[x+1] || set[x-1] || seen[x] {
			continue
		}
		ans = append(ans, x)
		seen[x] = true
	}
	return ans
}
```

**Rule of thumb:** `if (... in ...)` inside a loop → try a hash set or map.

---

## Pattern 2 — Counting Frequencies

Use a **map key → count** whenever you need to track how often something appears.

### Example 4 — At Most K Distinct Characters

Given string `s` and integer `k`, find the length of the longest substring with **at most k distinct** characters.

This is a **sliding window** problem — but the constraint involves **multiple** characters, so an integer counter isn't enough. Use `counts: Map<char, number>`.

- `counts.size` = number of distinct characters in the window
- Shrink from the left when `counts.size > k`

[HASHING:k-distinct]

[CODE-TABS]
```javascript
function longestKDistinct(s, k) {
  const counts = new Map();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    counts.set(s[right], (counts.get(s[right]) ?? 0) + 1);

    while (counts.size > k) {
      const c = s[left];
      counts.set(c, counts.get(c) - 1);
      if (counts.get(c) === 0) counts.delete(c);
      left++;
    }

    best = Math.max(best, right - left + 1);
  }

  return best;
}

longestKDistinct("eceba", 2); // 3
```
```typescript
function longestKDistinct(s: string, k: number): number {
  const counts = new Map<string, number>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    counts.set(s[right], (counts.get(s[right]) ?? 0) + 1);

    while (counts.size > k) {
      const c = s[left];
      counts.set(c, counts.get(c)! - 1);
      if (counts.get(c) === 0) counts.delete(c);
      left++;
    }

    best = Math.max(best, right - left + 1);
  }

  return best;
}
```
```go
func longestKDistinct(s string, k int) int {
	counts := map[byte]int{}
	left, best := 0, 0
	for right := 0; right < len(s); right++ {
		counts[s[right]]++
		for len(counts) > k {
			counts[s[left]]--
			if counts[s[left]] == 0 {
				delete(counts, s[left])
			}
			left++
		}
		if right-left+1 > best {
			best = right - left + 1
		}
	}
	return best
}
```

**Complexity:** **O(n)** time, **O(k)** space for the map.

---

### Example 5 — Intersection of Multiple Arrays

[LeetCode 2248](https://leetcode.com/problems/intersection-of-multiple-arrays/)

Each inner array has **distinct** integers. Return sorted numbers that appear in **all** arrays.

A number appears in all `n` arrays ⟺ its count equals `n`.

[CODE-TABS]
```javascript
function intersection(nums) {
  const n = nums.length;
  const counts = new Map();
  for (const arr of nums) {
    for (const x of arr) {
      counts.set(x, (counts.get(x) ?? 0) + 1);
    }
  }
  const ans = [];
  for (const [x, c] of counts) {
    if (c === n) ans.push(x);
  }
  return ans.sort((a, b) => a - b);
}

intersection([[3,1,2,4,5],[1,2,3,4],[3,4,5,6]]); // [3, 4]
```
```typescript
function intersection(nums: number[][]): number[] {
  const n = nums.length;
  const counts = new Map<number, number>();
  for (const arr of nums) {
    for (const x of arr) {
      counts.set(x, (counts.get(x) ?? 0) + 1);
    }
  }
  const ans: number[] = [];
  for (const [x, c] of counts) {
    if (c === n) ans.push(x);
  }
  return ans.sort((a, b) => a - b);
}
```
```go
func intersection(nums [][]int) []int {
	n := len(nums)
	counts := map[int]int{}
	for _, arr := range nums {
		for _, x := range arr {
			counts[x]++
		}
	}
	ans := []int{}
	for x, c := range counts {
		if c == n {
			ans = append(ans, x)
		}
	}
	sort.Ints(ans)
	return ans
}
```

**Why not an array?** If max element is `1000`, you'd need a size-1001 array mostly empty. A hash map handles sparse keys efficiently.

---

### Example 6 — Equal Character Frequencies

[LeetCode 1941](https://leetcode.com/problems/check-if-all-characters-have-equal-number-of-occurrences/)

Return `true` if every character in `s` appears the same number of times.

Count frequencies in a map, put all counts in a **set**, check `set.size === 1`.

[CODE-TABS]
```javascript
function areOccurrencesEqual(s) {
  const counts = new Map();
  for (const c of s) counts.set(c, (counts.get(c) ?? 0) + 1);
  return new Set(counts.values()).size === 1;
}

areOccurrencesEqual("abacbc"); // true
areOccurrencesEqual("aaabb");  // false
```
```typescript
function areOccurrencesEqual(s: string): boolean {
  const counts = new Map<string, number>();
  for (const c of s) counts.set(c, (counts.get(c) ?? 0) + 1);
  return new Set(counts.values()).size === 1;
}
```
```go
func areOccurrencesEqual(s string) bool {
	counts := map[byte]int{}
	for i := 0; i < len(s); i++ {
		counts[s[i]]++
	}
	freqs := map[int]bool{}
	for _, c := range counts {
		freqs[c] = true
	}
	return len(freqs) == 1
}
```

---

## Pattern 3 — Prefix Sum + Frequency Map

For **exact** subarray constraints (sum = K, exactly K odds), sliding window alone isn't enough. Combine **prefix sums** with a hash map counting how often each prefix has appeared.

**Key idea:** at index `i`, `curr` = prefix sum up to `i`. A subarray ending at `i` with sum `k` exists iff prefix `curr - k` was seen before.

```
ans += counts[curr - k]
counts[curr]++
```

Always initialize `counts[0] = 1` (empty prefix).

### Example 7 — Subarray Sum Equals K

[LeetCode 560](https://leetcode.com/problems/subarray-sum-equals-k/)

[HASHING:subarray-sum-k]

[CODE-TABS]
```javascript
function subarraySum(nums, k) {
  const counts = new Map([[0, 1]]);
  let curr = 0;
  let ans = 0;

  for (const num of nums) {
    curr += num;
    ans += counts.get(curr - k) ?? 0;
    counts.set(curr, (counts.get(curr) ?? 0) + 1);
  }

  return ans;
}

subarraySum([1, 2, 1, 2, 1], 3); // 4
```
```typescript
function subarraySum(nums: number[], k: number): number {
  const counts = new Map<number, number>([[0, 1]]);
  let curr = 0;
  let ans = 0;

  for (const num of nums) {
    curr += num;
    ans += counts.get(curr - k) ?? 0;
    counts.set(curr, (counts.get(curr) ?? 0) + 1);
  }

  return ans;
}
```
```go
func subarraySum(nums []int, k int) int {
	counts := map[int]int{0: 1}
	curr, ans := 0, 0
	for _, num := range nums {
		curr += num
		ans += counts[curr-k]
		counts[curr]++
	}
	return ans
}
```

**Why a map, not a set?** With negative numbers, the same prefix sum can occur multiple times — each occurrence is a valid start point.

**Complexity:** **O(n)** time and space.

---

### Example 8 — Count Nice Subarrays (Exactly K Odds)

[LeetCode 1248](https://leetcode.com/problems/count-number-of-nice-subarrays/)

Count subarrays with **exactly k** odd numbers. Same pattern — but `curr` tracks **odd count** instead of sum:

```javascript
curr += num % 2;
ans += counts.get(curr - k) ?? 0;
```

The code differs by literally `% 2` from the sum version.

---

## Pattern 4 — Grouping by Signature

When items belong to the same group if they share a property (anagrams, digit sum, row pattern), use a **canonical key**:

| Problem | Signature key |
|---------|---------------|
| Group Anagrams | Sorted string (`"eat"` → `"aet"`) |
| Digit sum pairs | Sum of digits |
| Row/column pairs | Tuple or string of row values |

### Example 9 — Group Anagrams

[LeetCode 49](https://leetcode.com/problems/group-anagrams/)

[HASHING:group-anagrams]

[CODE-TABS]
```javascript
function groupAnagrams(strs) {
  const groups = new Map();
  for (const word of strs) {
    const key = [...word].sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return [...groups.values()];
}

groupAnagrams(["eat","tea","tan","ate","nat","bat"]);
// [["eat","tea","ate"], ["tan","nat"], ["bat"]]
```
```typescript
function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const word of strs) {
    const key = [...word].sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(word);
  }
  return [...groups.values()];
}
```
```go
func groupAnagrams(strs []string) [][]string {
	groups := map[string][]string{}
	for _, word := range strs {
		runes := []rune(word)
		sort.Slice(runes, func(i, j int) bool { return runes[i] < runes[j] })
		key := string(runes)
		groups[key] = append(groups[key], word)
	}
	ans := [][]string{}
	for _, g := range groups {
		ans = append(ans, g)
	}
	return ans
}
```

**Alternative key:** length-26 frequency tuple — **O(n·m)** vs **O(n·m log m)** for sorting.

---

### Example 10 — Shortest Subarray With Duplicate

[LeetCode 2260](https://leetcode.com/problems/minimum-consecutive-cards-to-pick-up/)

Find shortest subarray containing a duplicate. Track **most recent index** per value — only store the last index, not all indices.

[CODE-TABS]
```javascript
function minimumCardPickup(cards) {
  const last = new Map();
  let best = Infinity;

  for (let i = 0; i < cards.length; i++) {
    if (last.has(cards[i])) {
      best = Math.min(best, i - last.get(cards[i]) + 1);
    }
    last.set(cards[i], i);
  }

  return best === Infinity ? -1 : best;
}

minimumCardPickup([1, 2, 6, 2, 1]); // 3
```
```typescript
function minimumCardPickup(cards: number[]): number {
  const last = new Map<number, number>();
  let best = Infinity;

  for (let i = 0; i < cards.length; i++) {
    if (last.has(cards[i])) {
      best = Math.min(best, i - last.get(cards[i])! + 1);
    }
    last.set(cards[i], i);
  }

  return best === Infinity ? -1 : best;
}
```
```go
func minimumCardPickup(cards []int) int {
	last := map[int]int{}
	best := math.MaxInt
	for i, x := range cards {
		if j, ok := last[x]; ok {
			if i-j+1 < best {
				best = i - j + 1
			}
		}
		last[x] = i
	}
	if best == math.MaxInt {
		return -1
	}
	return best
}
```

---

### Example 11 — Equal Row and Column Pairs

[LeetCode 2352](https://leetcode.com/problems/equal-row-and-column-pairs/)

Count pairs `(R, C)` where row `R` equals column `C` as 1D arrays. Convert rows/columns to **immutable tuple keys** (string or joined values), count occurrences, multiply matching counts.

**Complexity:** **O(n²)** for an n×n grid.

---

## Complexity Cheat Sheet

[HASHING-COMPLEXITY]

---

## Common Mistakes

**Using an array when keys are sparse.** `[1, 2, 1000]` doesn't mean you need an array of size 1000.

**Forgetting `counts[0] = 1`** in prefix-frequency problems — you lose subarrays that start at index 0.

**Using a set when you need frequencies.** Duplicate prefix sums require counting, not just existence.

**Mutable keys.** Don't use arrays as map keys directly — sort/join/tuple first.

**Assuming hash map order.** Iteration order is not sorted (in most languages).

**Ignoring O(m) string hashing.** Hashing a string of length m is not O(1).

---

## Practice Problems (Easiest → Hardest)

[HASHING-PRACTICE]

---

## Quick Reference — Pattern Picker

[HASHING-QUICK-REF]

---

## Key Takeaways

1. **Hash map = O(1) lookup** — the single biggest time-complexity upgrade in interviews.
2. **`if (x in arr)` in a loop** → use a set or map.
3. **Count frequencies** with `map[key]++` — windows, intersections, anagrams.
4. **Two Sum pattern:** search for `target - num`, not pairs of loops.
5. **Prefix + freq map:** `counts[curr - k]` counts exact subarray constraints.
6. **Group by signature:** sorted string, digit sum, or tuple as map key.
7. **Sets don't track frequency** — adding the same key 100 times still yields size 1.
8. **Step through the animations** — if you can narrate each map update, you can code it.

Hash maps appear in almost every topic from here on. Pair this guide with [Prefix Sum](/blog/prefix-sum-technique) for the prefix-frequency pattern, and [Sliding Window](/blog/sliding-window-technique) when the constraint lives inside a contiguous window.
