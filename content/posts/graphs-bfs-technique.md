---
title: Graphs BFS — Shortest Hops, Queues, and Grids
excerpt: Breadth-first search on graphs and grids — visited set, unweighted shortest path, and multi-source BFS, with step-through animations.
date: 2026-09-29
category: Algorithms
featured: true
---

An order has to reach shipping. Two routes exist: Order → Notify → Shipping, or Order → Inventory → Packing → Shipping. You want the **fewest hops**, not the first path a depth-first walk happens to find.

That is **breadth-first search**. A queue expands one distance at a time. The first time you touch a node, you already have a shortest path in an unweighted graph.

This continues after [Binary Trees](/blog/binary-trees-technique) — level-order on a tree is BFS with no extra edges. On a graph, the same queue works, plus a **visited** set so cycles do not loop forever. [Stacks & Queues](/blog/stacks-queues-technique) is the queue.

> **BFS visits by distance. The first time you reach a node, that distance is minimal — if every edge costs 1.**

[POLL:Where do you want BFS to click?|Shortest path on a graph|Grid / matrix problems|Multi-source (rotting, nearest 0)]

## Core patterns

[GRAPH-BFS-PATTERNS]

## The graph

Store an **adjacency list**: each node maps to its neighbors.

```text
order      → inventory, notify
inventory  → packing
notify     → shipping
packing    → shipping
```

Undirected edges are stored both ways. A tree is a graph that happens to have no cycles and one parent each. BFS does not care — the visited set is what keeps a cycle from enqueueing the same node forever.

## Walk it

Start at Order. Watch the queue, the distance labels, and which path lights up when Shipping is first reached.

[GRAPH-BFS:services]

Notify wins. Inventory’s route is longer. DFS might have walked the long way first and still been “correct” about reachability — wrong about **fewest hops**.

## The template

```text
queue = [start]
visited = {start}
dist[start] = 0

while queue:
  node = queue.pop_front()
  for nei in adj[node]:
    if nei in visited: continue
    visited.add(nei)          # mark on enqueue
    dist[nei] = dist[node] + 1
    parent[nei] = node
    queue.push(nei)
```

Mark **when you enqueue**, not when you dequeue. If you wait until dequeue, the same neighbor can sit in the queue twice and you blow the O(V + E) bound.

[CODE-TABS]
```javascript
function bfs(start, adj) {
  const queue = [start];
  const visited = new Set([start]);
  const dist = new Map([[start, 0]]);
  const parent = new Map([[start, null]]);

  for (let i = 0; i < queue.length; i++) {
    const node = queue[i];
    for (const nei of adj.get(node) ?? []) {
      if (visited.has(nei)) continue;
      visited.add(nei);
      dist.set(nei, dist.get(node) + 1);
      parent.set(nei, node);
      queue.push(nei);
    }
  }

  return { dist, parent };
}
```
```typescript
function bfs(
  start: string,
  adj: Map<string, string[]>
): {
  dist: Map<string, number>;
  parent: Map<string, string | null>;
} {
  const queue = [start];
  const visited = new Set([start]);
  const dist = new Map<string, number>([[start, 0]]);
  const parent = new Map<string, string | null>([[start, null]]);

  for (let i = 0; i < queue.length; i++) {
    const node = queue[i];
    for (const nei of adj.get(node) ?? []) {
      if (visited.has(nei)) continue;
      visited.add(nei);
      dist.set(nei, (dist.get(node) ?? 0) + 1);
      parent.set(nei, node);
      queue.push(nei);
    }
  }

  return { dist, parent };
}
```
```go
func bfs(start string, adj map[string][]string) (map[string]int, map[string]string) {
	queue := []string{start}
	dist := map[string]int{start: 0}
	parent := map[string]string{}

	for len(queue) > 0 {
		node := queue[0]
		queue = queue[1:]
		for _, nei := range adj[node] {
			if _, seen := dist[nei]; seen {
				continue
			}
			dist[nei] = dist[node] + 1
			parent[nei] = node
			queue = append(queue, nei)
		}
	}
	return dist, parent
}
```

Reconstruct the path by walking `parent` from the target back to the start, then reverse it.

## Grids are graphs

Each open cell is a node. Edges go up, down, left, right (sometimes 8 directions). A wall is a missing node.

Shortest path from the start to the target, stepping around `#`:

[GRAPH-BFS:grid]

Same algorithm. The adjacency list is implicit: `r±1, c` and `r, c±1`, skipping walls and out-of-bounds cells.

[CODE-TABS]
```javascript
function shortestGrid(grid, sr, sc, tr, tc) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [[sr, sc]];
  const seen = new Set([`${sr},${sc}`]);
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let steps = 0;

  while (queue.length) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift();
      if (r === tr && c === tc) return steps;
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr},${nc}`;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] === "#" || seen.has(key)) continue;
        seen.add(key);
        queue.push([nr, nc]);
      }
    }
    steps++;
  }
  return -1;
}
```
```typescript
function shortestGrid(
  grid: string[][],
  sr: number,
  sc: number,
  tr: number,
  tc: number
): number {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue: [number, number][] = [[sr, sc]];
  const seen = new Set([`${sr},${sc}`]);
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let steps = 0;

  while (queue.length) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift()!;
      if (r === tr && c === tc) return steps;
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr},${nc}`;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] === "#" || seen.has(key)) continue;
        seen.add(key);
        queue.push([nr, nc]);
      }
    }
    steps++;
  }
  return -1;
}
```
```go
func shortestGrid(grid [][]byte, sr, sc, tr, tc int) int {
	rows, cols := len(grid), len(grid[0])
	type cell struct{ r, c int }
	q := []cell{{sr, sc}}
	seen := map[[2]int]bool{{sr, sc}: true}
	dirs := []cell{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
	steps := 0

	for len(q) > 0 {
		size := len(q)
		for i := 0; i < size; i++ {
			cur := q[0]
			q = q[1:]
			if cur.r == tr && cur.c == tc {
				return steps
			}
			for _, d := range dirs {
				nr, nc := cur.r+d.r, cur.c+d.c
				key := [2]int{nr, nc}
				if nr < 0 || nc < 0 || nr >= rows || nc >= cols {
					continue
				}
				if grid[nr][nc] == '#' || seen[key] {
					continue
				}
				seen[key] = true
				q = append(q, cell{nr, nc})
			}
		}
		steps++
	}
	return -1
}
```

The inner `size` loop is how you count **levels** (minutes, hops) without storing a distance on every cell. Either style is fine if you stay consistent.

## Multi-source

Sometimes distance 0 is a **set** of nodes, not one start. Rotting oranges: every rotten cell is already in the queue at minute 0. Nearest 0 in a matrix: every 0 starts in the queue. Then one BFS fills distances outward. Do not run a separate BFS from each source — that repeats work.

## BFS vs DFS

[GRAPH-BFS-VS-DFS]

DFS is the next post. Use it for cycles, topological order, and “does a path exist?” when length does not matter. Use BFS when the question says **minimum**, **nearest**, **fewest steps**, or **level**.

## Complexity

[GRAPH-BFS-COMPLEXITY]

Space is the queue plus the visited set — worst case every node. On a grid that is the whole matrix.

## Mistakes that fail interviews

**Visited on dequeue.** Neighbors get queued many times. Slow, and distance can be recorded wrong if you are careless.

**Using BFS on weighted edges.** A 1-then-100 path can be dequeued before a direct edge of weight 5. Fewest edges is not smallest weight. That is Dijkstra (or 0-1 BFS when weights are only 0 and 1).

**Forgetting the start is visited.** The start’s neighbor list often points back. Without the initial mark you enqueue the start again.

**Level size captured too late.** If you measure “this wave” after pushing children, the wave mixes two distances. Snapshot `size = queue.length` at the start of the wave.

## Practice

[GRAPH-BFS-PRACTICE]

## Pattern picker

[GRAPH-BFS-QUICK-REF]

## Takeaways

1. BFS = **queue + visited**. Expand in order of increasing distance.
2. Mark visited **when you enqueue**.
3. On an unweighted graph or grid, the first visit is a **shortest path**.
4. Grids are graphs with implicit 4-direction edges. Walls are missing nodes.
5. Multi-source BFS seeds the queue with every distance-0 node in one pass.
6. Weights that are not all 1 break plain BFS — switch algorithms instead of forcing the queue.

Next in the series: **graphs DFS** — cycles, components, and topological order, when diving deep beats expanding by level.
