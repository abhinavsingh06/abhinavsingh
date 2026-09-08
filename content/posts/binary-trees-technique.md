---
title: Binary Trees & BSTs — Complete Guide with Interactive Walkthroughs
excerpt: Binary trees, BST search and insert, DFS vs BFS, inorder, validate, and LCA — with step-through animations and a practice ladder.
date: 2026-09-08
category: Algorithms
featured: true
---


A **binary tree** is a hierarchy: each node holds a value and up to two children — `left` and `right`. That shape shows up in file systems, expression parsers, and half of medium interview problems.

A **binary search tree (BST)** adds one rule: every value in the left subtree is **less** than the node; every value on the right is **greater**. Search and insert become comparisons that discard half the tree when the tree stays balanced — the same idea as [Binary Search](/blog/binary-search-technique), but the “array” is linked by pointers.

This guide continues after [Stacks & Queues](/blog/stacks-queues-technique) and [Linked Lists](/blog/linked-list-technique). Queues power **level-order** traversal; linked-list pointer care maps directly onto `left` / `right`.


## Core Patterns

[BINARY-TREE-PATTERNS]


## Anatomy of a Node

```
class TreeNode {
  val
  left  → TreeNode | null
  right → TreeNode | null
}
```

The **root** is the only node you are given. Lose it and you lose the tree — same discipline as keeping the head of a list.

**Height / depth:** longest root-to-leaf path (counting nodes or edges — pick one definition and stick to it). Interview code usually returns **node count**: a single node has depth `1`.

**Leaf:** both children `null`.


## Binary Tree vs Sorted Array

[BINARY-TREE-VS-ARRAYS]

Use a BST when you need **ordered inserts and deletes** without shifting an array. Use a sorted array when the data is mostly static and you lean on binary search.


## BST Search

Compare the target to the current node. Go left or right. Stop on match or `null`.

[BINARY-TREE:bst-search]

[CODE-TABS]
```javascript
function searchBST(root, val) {
  let cur = root;
  while (cur) {
    if (cur.val === val) return cur;
    cur = val < cur.val ? cur.left : cur.right;
  }
  return null;
}
```
```typescript
function searchBST(
  root: TreeNode | null,
  val: number
): TreeNode | null {
  let cur = root;
  while (cur) {
    if (cur.val === val) return cur;
    cur = val < cur.val ? cur.left : cur.right;
  }
  return null;
}
```
```go
func searchBST(root *TreeNode, val int) *TreeNode {
	for root != nil {
		if root.Val == val {
			return root
		}
		if val < root.Val {
			root = root.Left
		} else {
			root = root.Right
		}
	}
	return nil
}
```

Time is **O(h)**. Balanced ≈ **O(log n)**. A linked-list-shaped tree is **O(n)** — that is why production trees rebalance (AVL, red-black, B-trees).


## BST Insert

Walk like search. When you hit a `null` child slot, attach the new node there.

[BINARY-TREE:bst-insert]

[CODE-TABS]
```javascript
function insertIntoBST(root, val) {
  if (!root) return new TreeNode(val);

  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else root.right = insertIntoBST(root.right, val);

  return root;
}
```
```typescript
function insertIntoBST(
  root: TreeNode | null,
  val: number
): TreeNode {
  if (!root) return new TreeNode(val);

  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else root.right = insertIntoBST(root.right, val);

  return root;
}
```
```go
func insertIntoBST(root *TreeNode, val int) *TreeNode {
	if root == nil {
		return &TreeNode{Val: val}
	}
	if val < root.Val {
		root.Left = insertIntoBST(root.Left, val)
	} else {
		root.Right = insertIntoBST(root.Right, val)
	}
	return root
}
```


## Traversals

| Order | Visit sequence | Classic use |
|-------|----------------|-------------|
| **Preorder** | node → left → right | Serialize / clone shape |
| **Inorder** | left → node → right | Sorted values from a BST |
| **Postorder** | left → right → node | Delete tree, evaluate expression |
| **Level order** | BFS by depth | Level averages, zigzag |

[BINARY-TREE:inorder]

Inorder on a BST prints values in sorted order. That is the cheapest mental check for “is this a BST?” — and the seed of the inorder-validation trick.


## Maximum Depth (DFS)

```
depth(null) = 0
depth(node) = 1 + max(depth(left), depth(right))
```

[BINARY-TREE:max-depth]

[CODE-TABS]
```javascript
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```
```typescript
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```
```go
func maxDepth(root *TreeNode) int {
	if root == nil {
		return 0
	}
	l := maxDepth(root.Left)
	r := maxDepth(root.Right)
	if l > r {
		return l + 1
	}
	return r + 1
}
```

The same skeleton solves **invert tree** (swap children after recursing), **same tree** (compare pairs of nodes), and **diameter** (track longest path while returning height).


## Level Order (BFS)

Put the root in a queue. For each level, dequeue everyone currently in the queue, enqueue their children. Pair with [Stacks & Queues](/blog/stacks-queues-technique) — this is the queue pattern on a tree.

[BINARY-TREE:level-order]

[CODE-TABS]
```javascript
function levelOrder(root) {
  if (!root) return [];
  const out = [];
  const q = [root];

  while (q.length) {
    const size = q.length;
    const level = [];
    for (let i = 0; i < size; i++) {
      const node = q.shift();
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    out.push(level);
  }

  return out;
}
```
```typescript
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const out: number[][] = [];
  const q: TreeNode[] = [root];

  while (q.length) {
    const size = q.length;
    const level: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = q.shift()!;
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    out.push(level);
  }

  return out;
}
```
```go
func levelOrder(root *TreeNode) [][]int {
	if root == nil {
		return nil
	}
	var out [][]int
	q := []*TreeNode{root}
	for len(q) > 0 {
		size := len(q)
		level := make([]int, 0, size)
		for i := 0; i < size; i++ {
			node := q[0]
			q = q[1:]
			level = append(level, node.Val)
			if node.Left != nil {
				q = append(q, node.Left)
			}
			if node.Right != nil {
				q = append(q, node.Right)
			}
		}
		out = append(out, level)
	}
	return out
}
```

In hot paths, prefer a deque / index pointer over `shift` so front removal stays **O(1)**.


## Validate BST

Comparing each node only to its parent is **not** enough. A classic counterexample: `5` with left child `1`, and `1` has right child `6`. Parent checks pass; BST rule fails — `6` sits in the left subtree of `5`.

Pass **(lo, hi)** bounds down the recursion. Left child inherits `(lo, node.val)`; right inherits `(node.val, hi)`.

[BINARY-TREE:validate-bst]

[CODE-TABS]
```javascript
function isValidBST(root) {
  function ok(node, lo, hi) {
    if (!node) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
  }
  return ok(root, -Infinity, Infinity);
}
```
```typescript
function isValidBST(root: TreeNode | null): boolean {
  function ok(
    node: TreeNode | null,
    lo: number,
    hi: number
  ): boolean {
    if (!node) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
  }
  return ok(root, -Infinity, Infinity);
}
```
```go
func isValidBST(root *TreeNode) bool {
	var ok func(*TreeNode, int64, int64) bool
	ok = func(node *TreeNode, lo, hi int64) bool {
		if node == nil {
			return true
		}
		v := int64(node.Val)
		if v <= lo || v >= hi {
			return false
		}
		return ok(node.Left, lo, v) && ok(node.Right, v, hi)
	}
	return ok(root, math.MinInt64, math.MaxInt64)
}
```

Alternate: inorder walk and ensure each value is **strictly greater** than the previous.


## Lowest Common Ancestor (BST)

In a BST, walk from the root:

- If both values are **less** than the node → go left  
- If both are **greater** → go right  
- Otherwise this node is the split — the LCA  

No need to build full parent paths when the ordering holds.


## Complexity Cheat Sheet

[BINARY-TREE-COMPLEXITY]


## Common Mistakes

**Forgetting the null base case** — every recursive tree function starts with `if (!node) return …`.

**Parent-only BST checks** — use bounds or inorder.

**Mutating during traversal without a plan** — invert is fine (swap after recurse); deleting while iterating needs care.

**Assuming balance** — interview BSTs can be skewed unless the problem says “balanced.”

**Confusing preorder / inorder / postorder** when rebuilding from two arrays — the first preorder element is the root; inorder splits left/right sizes.


## Practice Problems (Easiest → Hardest)

[BINARY-TREE-PRACTICE]


## Quick Reference — Pattern Picker

[BINARY-TREE-QUICK-REF]


## Key Takeaways

1. A binary tree is `val` + `left` + `right`. A **BST** adds the ordering invariant.
2. **DFS recursion** is the default template for depth, invert, diameter, and path problems.
3. **BFS + queue** owns level-order and “by depth” questions.
4. BST search / insert is **O(h)** — balance decides whether that is log or linear.
5. Validate BST with **(lo, hi)** bounds or a strictly increasing inorder pass.
6. LCA in a BST is a single walk: diverge left/right until the split node.

Next in the series: **heaps** — priority queues built on complete binary trees, where parent–child order replaces the full BST invariant.
