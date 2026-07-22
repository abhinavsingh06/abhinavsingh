---
title: Linked Lists — Complete Guide with Interactive Walkthroughs
excerpt: Master linked list mechanics, fast and slow pointers, and in-place reversal — insert/delete, cycle detection, k-th from end, and swap pairs without cheating into an array. Animations included.
date: 2026-07-22
category: Algorithms
featured: true
---

# Linked Lists — Complete Guide with Interactive Walkthroughs

A **linked list** stores an ordered sequence like an array — but as **node objects** connected by pointers, not contiguous memory. Each node holds a value and a `next` reference to the following node. That single idea unlocks **O(1)** insert/delete when you already hold the right pointer, plus elegant **O(1)-space** algorithms that interviewers love.

This guide follows the same format as [Two Pointers](/blog/two-pointers-technique), [Hashing](/blog/hashing-technique), and [Binary Search](/blog/binary-search-technique): concepts, interactive walkthroughs, code in three languages, and a practice ladder.

You should know basic OOP (classes, objects, fields) before continuing.

---

## Nodes vs Array Elements

An array like `[1, 2, 3]` stores values **contiguously**. Indexing `arr[6]` jumps straight to an address — **O(1)** random access.

A linked list stores the same logical sequence as **nodes**:

```
[1|•] → [2|•] → [3|•] → null
 head
```

Each node is an object: `val` plus `next`. There is **no** `list[150000]` — finding the 150,000th element means walking from the head **150,000 times**.

Keep a reference to the **head**. It is the only node from which you can reach every element. Lose the head and you lose the list.

---

## Core Patterns

[LINKED-LIST-PATTERNS]

---

## Building a List

[LINKED-LIST:build]

[CODE-TABS]
```javascript
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

const head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
// 1 → 2 → 3 → null
```
```typescript
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

const head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
```
```go
type ListNode struct {
	Val  int
	Next *ListNode
}

head := &ListNode{Val: 1}
head.Next = &ListNode{Val: 2}
head.Next.Next = &ListNode{Val: 3}
```

---

## Linked List vs Array

| | Linked list | Array |
|--|-------------|-------|
| Access index `i` | **O(n)** | **O(1)** |
| Insert/delete with pointer | **O(1)** | **O(n)** |
| Contiguous memory | No | Yes |
| Overhead | Extra pointers | Packed |

[LINKED-LIST-VS-ARRAYS]

For interviews: the list is usually **given as input**. You rarely choose list vs array — you choose **how to move pointers** without dumping into an array (that almost always fails the interview).

---

## Mechanics — Assignment, Traversal, `.next`

**Assignment:** `ptr = head` makes `ptr` refer to the **same object**. Changing `head = head.next` does **not** move `ptr` — only `ptr = something` moves it.

**Chaining:** `head.next.next` means “the `next` of (`head.next`)”. On `1 → 2 → 3`, that is `2.next` (the node `3`).

**Traversal:**

```
curr = head
while curr:
    // use curr.val
    curr = curr.next
```

When `curr` is the last node, `curr.next` is `null` and the loop ends.

Use a **dummy pointer** for traversal so you never overwrite your only reference to `head`.

---

## Insert and Delete (Singly Linked)

To insert or delete at position `i`, you normally need a pointer to the node at **`i − 1`** (`prev`).

[LINKED-LIST:insert]

[LINKED-LIST:delete]

[CODE-TABS]
```javascript
function insertAfter(prev, val) {
  const node = new ListNode(val);
  node.next = prev.next;
  prev.next = node;
}

function deleteAfter(prev) {
  if (!prev.next) return;
  prev.next = prev.next.next;
}
```
```typescript
function insertAfter(prev: ListNode, val: number): void {
  const node = new ListNode(val);
  node.next = prev.next;
  prev.next = node;
}

function deleteAfter(prev: ListNode): void {
  if (!prev.next) return;
  prev.next = prev.next.next;
}
```
```go
func insertAfter(prev *ListNode, val int) {
	node := &ListNode{Val: val, Next: prev.Next}
	prev.Next = node
}

func deleteAfter(prev *ListNode) {
	if prev.Next == nil {
		return
	}
	prev.Next = prev.Next.Next
}
```

**Order matters:** set `newNode.next = prev.next` **before** `prev.next = newNode`, or you lose the rest of the list.

Without a `prev` reference, finding position `i` is **O(n)** from the head.

### Doubly linked lists

Each node also has `prev`. You only need a reference to the node at `i` (not `i − 1`), but you must update **both** `next` and `prev` links.

### Sentinel (dummy) nodes

Sentinel **head** / **tail** nodes sit outside the real list. Real head is `sentinel.next`. They simplify edge cases (empty list, delete last node) and give **O(1)** operations at both ends when you keep a sentinel tail.

---

## Fast and Slow Pointers

Same idea as [Two Pointers](/blog/two-pointers-technique), but on a list: usually **fast** moves two steps, **slow** moves one.

```
slow = head
fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
```

Check `fast.next` so you never do `null.next`.

### Middle of the list

When fast reaches the end, slow is in the middle — half the speed, half the distance.

[LINKED-LIST:middle]

[CODE-TABS]
```javascript
function middleNode(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}
```
```typescript
function middleNode(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }

  return slow;
}
```
```go
func middleNode(head *ListNode) *ListNode {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
	}
	return slow
}
```

### Cycle detection — LC 141

On a straight path, fast finishes first. On a **cycle**, fast eventually **laps** slow. If they meet (after the start), there is a cycle.

[LINKED-LIST:cycle]

[CODE-TABS]
```javascript
function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }

  return false;
}
```
```typescript
function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }

  return false;
}
```
```go
func hasCycle(head *ListNode) bool {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
		if slow == fast {
			return true
		}
	}
	return false
}
```

**Why fast can't skip slow forever:** after entering the cycle, each iteration closes the gap by exactly one step.

Hashing visited nodes also works, but uses **O(n)** space — Floyd uses **O(1)**.

### k-th node from the end

Advance `fast` by `k`, then move both together. When fast hits the end, slow is `k` behind.

[LINKED-LIST:kth-end]

[CODE-TABS]
```javascript
function kthFromEnd(head, k) {
  let slow = head;
  let fast = head;

  for (let i = 0; i < k; i++) {
    fast = fast.next;
  }

  while (fast) {
    slow = slow.next;
    fast = fast.next;
  }

  return slow;
}
```
```typescript
function kthFromEnd(head: ListNode, k: number): ListNode {
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  for (let i = 0; i < k; i++) {
    fast = fast!.next;
  }

  while (fast) {
    slow = slow!.next;
    fast = fast.next;
  }

  return slow!;
}
```
```go
func kthFromEnd(head *ListNode, k int) *ListNode {
	slow, fast := head, head
	for i := 0; i < k; i++ {
		fast = fast.Next
	}
	for fast != nil {
		slow = slow.Next
		fast = fast.Next
	}
	return slow
}
```

---

## Reversing a Linked List

To reverse `1 → 2 → 3 → 4`, at each `curr` you need `curr.next = prev` — but then you lose the original next. Use **three pointers**: `prev`, `curr`, `nextNode`.

[LINKED-LIST:reverse]

[CODE-TABS]
```javascript
function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr) {
    const nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }

  return prev; // new head
}
```
```typescript
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;

  while (curr) {
    const nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }

  return prev;
}
```
```go
func reverseList(head *ListNode) *ListNode {
	var prev *ListNode
	curr := head
	for curr != nil {
		nextNode := curr.Next
		curr.Next = prev
		prev = curr
		curr = nextNode
	}
	return prev
}
```

**Thought process:** need previous → store `prev` → need original next before flipping → store `nextNode` → advance. Elegant solutions come from listing requirements, then ordering the pointer moves.

### Swap Nodes in Pairs — LC 24

`1 → 2 → 3 → 4 → 5 → 6` → `2 → 1 → 4 → 3 → 6 → 5`.

Break the work down: save the rest of the list, flip `B → A`, connect previous pair to `D`, use a **dummy** so you still return the new head (`B`). Handle odd length by linking the leftover single node.

[LINKED-LIST:swap-pairs]

[CODE-TABS]
```javascript
function swapPairs(head) {
  const dummy = new ListNode(0, head);
  let prev = dummy;

  while (head && head.next) {
    const a = head;
    const b = head.next;
    const nextPair = b.next;

    b.next = a;
    a.next = nextPair;
    prev.next = b;

    prev = a;
    head = nextPair;
  }

  return dummy.next;
}
```
```typescript
function swapPairs(head: ListNode | null): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev = dummy;

  while (head && head.next) {
    const a = head;
    const b = head.next;
    const nextPair = b.next;

    b.next = a;
    a.next = nextPair;
    prev.next = b;

    prev = a;
    head = nextPair;
  }

  return dummy.next;
}
```
```go
func swapPairs(head *ListNode) *ListNode {
	dummy := &ListNode{Next: head}
	prev := dummy

	for head != nil && head.Next != nil {
		a, b := head, head.Next
		nextPair := b.Next

		b.Next = a
		a.Next = nextPair
		prev.Next = b

		prev = a
		head = nextPair
	}
	return dummy.Next
}
```

### Reversal as a tool — Twin Sum

[LC 2130. Maximum Twin Sum](https://leetcode.com/problems/maximum-twin-sum-of-a-linked-list/): find middle (fast/slow) → reverse second half → walk both halves for pair sums. Patterns **compose**.

---

## Complexity Cheat Sheet

[LINKED-LIST-COMPLEXITY]

---

## Common Mistakes

**Losing the head.** Always keep a stable reference or a dummy; traverse with a copy.

**Wrong order when splicing.** Link the new node to the rest **before** updating `prev.next`.

**`null.next`.** Guard with `while (fast && fast.next)` (or `curr`) before chaining.

**Array cheat.** Pushing every value into an array “solves” middle / k-th / reverse — and fails the point of the interview.

**Forgetting dummy on head changes.** Swap pairs, remove head, reverse — dummy simplifies return value.

**Updating only one link in a doubly list.** Both `next` and `prev` must stay consistent.

---

## Practice Problems (Easiest → Hardest)

[LINKED-LIST-PRACTICE]

---

## Quick Reference — Pattern Picker

[LINKED-LIST-QUICK-REF]

---

## Key Takeaways

1. **Nodes + `next`** — ordered sequence without contiguous memory; **no random access**.
2. **Keep the head** (or a sentinel) — it is your only entry point.
3. **Insert/delete is O(1)** only with a pointer to the right place; otherwise **O(n)** to find it.
4. **Fast & slow** — middle, cycles, k-th from end in **O(n)** time / **O(1)** space.
5. **Reverse** — `prev` / `curr` / `nextNode`; save next before flipping.
6. **Dummy nodes** — clean edge cases when the real head moves.
7. **Break problems into pointer steps** — list requirements, then order the assignments.
8. **Compose patterns** — middle + reverse half unlocks twin sum, reorder list, and more.

Linked lists train pointer discipline more than trivia. Pair this with [Two Pointers](/blog/two-pointers-technique) for the speed/gap intuition, and [Hashing](/blog/hashing-technique) when a set-based cycle check is acceptable.
