---
title: DFS Found a Path. It Was the Long One.
excerpt: Inventory’s route to shipping is three hops. Notify’s is two. The search that dives deep still says it found shipping — and hands you the slow path.
date: 2026-09-29
category: Algorithms
featured: true
---

An order has to reach shipping. Two routes exist.

Order → Inventory → Packing → Shipping. Three hops.

Order → Notify → Shipping. Two hops.

A depth-first walk can take the long route, arrive, and stop. It found a path. It did not find the **fewest hops**. That is the bug hiding inside “I reached the node, so I’m done.”

Step it. The short path lights up the first time Shipping is touched.

[GRAPH-BFS:services]

Notify wins. The long route is still valid. It is just late. The search that expands **one hop at a time** cannot reach Shipping before every closer node is already done. That search is breadth-first search — a queue, plus a visited set so a cycle cannot enqueue the same node forever.

> **The first time you reach a node, the distance is minimal — if every edge costs 1.**

This sits after [Binary Trees](/blog/binary-trees-technique), where level-order was the same queue on a tree with no extra edges, and after [Stacks & Queues](/blog/stacks-queues-technique).

[POLL:Which path would you have shipped?|The first path I found|The one with fewer hops|I would have counted both]

## The one line that keeps it correct

Mark a node **when you enqueue it**, not when you dequeue it. Wait until dequeue and the same neighbor sits in the queue twice. The hop count lies, and the run stops being O(V + E).

```text
order      → inventory, notify
inventory  → packing
notify     → shipping
packing    → shipping
```

## What else uses the same queue

[GRAPH-BFS-PATTERNS]

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

The long path was real. It was the wrong one to ship. Expand one hop at a time, mark on enqueue, and stop trusting “I found the node” when the question was “how soon.”

Weights that are not all 1 break this. A cheap edge hiding behind a long chain of 1s needs Dijkstra, not a louder queue.

Next: the failure DFS is for — a cycle that keeps the same order in flight, so diving deep is the point.
