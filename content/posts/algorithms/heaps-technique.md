---
title: The Urgent Shipment Waited Behind Ordinary Orders.
excerpt: order-8841 had to leave today. The line shipped two ordinary orders first because they had been waiting longer.
date: 2026-10-13
category: Algorithms
featured: true
---

Three orders hit the dock.

`order-100`, ordinary. `order-200`, ordinary. Then `order-8841`, same-day, the truck leaves in an hour.

The dock is a line. First in, first out. `order-100` gets the label. The same-day shipment is still at the back when the truck pulls out.

Nothing was unfair to the line. The line was the wrong structure. You needed the order that must leave soonest, not the one that arrived first.

> **A heap keeps the most urgent item at the front, no matter when it showed up.**

[POLL:The same-day order arrives last. Who ships next?|Whoever has waited longest|Whoever must leave soonest|Whichever pallet is closest]

## Same three orders

[HEAP-URGENT-SHIP]

The line’s next item is `order-100`. The heap’s next item is `order-8841`. Same arrivals. Different question.

## The pull

Store orders so the highest priority is always at index 0. When one ships, move the last order into the hole and sift it down until a parent is at least as urgent as its children.

```javascript
function shipNext(heap) {
  const top = heap[0];
  const last = heap.pop();
  if (heap.length && last) {
    heap[0] = last;
    siftDown(heap, 0);
  }
  return top;
}

function siftDown(heap, i) {
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  let urgent = i;
  if (left < heap.length && heap[left].priority > heap[urgent].priority) urgent = left;
  if (right < heap.length && heap[right].priority > heap[urgent].priority) urgent = right;
  if (urgent === i) return;
  [heap[i], heap[urgent]] = [heap[urgent], heap[i]];
  siftDown(heap, urgent);
}
```

Insert does the opposite: put the order at the end and sift up while it is more urgent than its parent. Both are O(log n). Scanning the whole dock to find the maximum every time is O(n), and the dock gets longer on purpose.

Priority here is “how soon it must leave,” not “how long it has waited.” If two orders share a priority, break the tie however you like, and say so. The heap does not invent fairness. It answers the comparison you gave it.

A complete binary tree is the usual picture: parent at `i`, children at `2i+1` and `2i+2`. You do not need pointer nodes. An array is the tree.

Next: the customer who got the shipping email twice, because the fact arrived twice and the sender treated both as new.
