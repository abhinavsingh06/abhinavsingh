---
title: One Cycle, and the Same Order Never Finished.
excerpt: Packing’s next step pointed back at the order it was already in. The walk never reached a last step.
date: 2026-10-06
category: Algorithms
featured: true
---

`order-8841` is in packing. Packing’s checklist says the next step is the order itself.

The status never becomes done. The same three steps keep coming back: order, reserve, pack, order. Nothing is slow. The path has no end.

> **A cycle is a step that points at something already on the path you are walking.**

Breadth-first search from [the long path](/blog/graphs-bfs-technique) would also notice the node again. It would not tell you the chain you are currently inside. Depth-first search keeps that chain on a stack. A neighbor still on the stack is the cycle.

[POLL:Pack points back at Order. What do you do?|Ship it anyway|Stop and name the cycle|Start the order over]

## Walk it

[GRAPH-DFS-CYCLE]

Order is gray, meaning “on the current path,” when Pack tries to enter it. That is the back edge. A node you have fully left (every neighbor already explored) is safe to see again. A node you have not finished is not.

## The three marks

```text
white  never entered
gray   on the stack — this path
black  finished — every neighbor done
```

```javascript
function hasCycle(start, adj) {
  const color = new Map();

  function dfs(node) {
    color.set(node, "gray");
    for (const next of adj.get(node) ?? []) {
      const seen = color.get(next);
      if (seen === "gray") return true;
      if (seen === "black") continue;
      if (dfs(next)) return true;
    }
    color.set(node, "black");
    return false;
  }

  return dfs(start);
}
```

`order-8841` returns true at Pack → Order. You stop the workflow. You do not enqueue it again and hope.

On a directed graph this is enough. On an undirected graph, ignore the edge back to the parent you just came from, or every step looks like a cycle of length two.

## What this is not

Finding the shortest route was the last post. A cycle does not care about hop count. Diving is the point: you need the path that is still open. When the question is “can this finish?” or “is there a loop in these steps?”, walk deep and mark gray before you look at neighbors.

Next: the shipment that should have left first, sitting behind two ordinary orders.
