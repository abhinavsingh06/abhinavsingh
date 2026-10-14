---
title: The Pile Drained. order-9912 Was Reserved Twice.
excerpt: Lag hit zero. Packing still paged. Inventory had reserved the same order twice.
date: 2026-10-10
category: Distributed Systems
featured: true
---

14:22. Lag on group `inventory` is 0. The deploy incident looks closed.

14:31. The warehouse says `order-9912` holds two pallets. A later order cannot ship. Nothing new was published. Checkout did not retry. The second hold happened while inventory was catching up on the 262 it had missed.

> **Kafka forgot nothing. The handler did the work twice.**

This is the pile from [the green deploy](/blog/kafka-lag-rebalance) draining. The first reserve succeeded. The offset never got committed. Kafka handed the same record back.

[POLL:The second time order-9912 shows up, what should inventory do?|Reserve again|Skip if that orderId is already held|Fail the message and page someone]

## One order, two memories

[KAFKA-DUPLICATE-RESERVE]

Kafka’s memory is the committed offset. The warehouse’s memory is the pallet. Those are not the same write.

The gap is the crash window: side effect done, bookmark not moved. A rebalance, a replay, or a process kill all reopen that window. At-least-once is the default. The log will show you the record again. That is not a Kafka bug. It is the contract you already accepted in [the first consumer](/blog/kafka-first-producer-consumer).

**Sticky idea:** If the effect and the “I did this” note are two steps, a crash between them is a duplicate or a skip.

## The boring fix is one row

Do not keep a side list of “processed ids” and then call the warehouse. The reservation **is** the note.

```sql
insert into reservations (order_id, pallet)
values ('order-9912', 1)
on conflict (order_id) do nothing;
```

First delivery inserts the row. The pallet is held. Second delivery hits the unique key and changes nothing. Then you commit the offset. There is no moment where the warehouse moved and the “already done” bit did not.

If `reserveStock` is an HTTP call you do not own, send `order-9912` as the idempotency key and let that system no-op the second call. Your database unique key only protects **your** database.

## What the handler should look like

Commit happens when `eachMessage` returns without throwing. Swallow the error and Kafka will treat a failed reserve as done.

[CODE-TABS]
```javascript
await consumer.run({
  eachMessage: async ({ message }) => {
    const orderId = message.key?.toString();
    if (!orderId) return;

    const inserted = await reserveOnce(orderId);
    if (!inserted) return;
  },
});

async function reserveOnce(orderId) {
  const { rowCount } = await db.query(
    `insert into reservations (order_id)
     values ($1)
     on conflict (order_id) do nothing`,
    [orderId]
  );
  return rowCount === 1;
}
```
```typescript
await consumer.run({
  eachMessage: async ({ message }) => {
    const orderId = message.key?.toString();
    if (!orderId) return;

    const inserted = await reserveOnce(orderId);
    if (!inserted) return;
  },
});

async function reserveOnce(orderId: string): Promise<boolean> {
  const { rowCount } = await db.query(
    `insert into reservations (order_id)
     values ($1)
     on conflict (order_id) do nothing`,
    [orderId]
  );
  return rowCount === 1;
}
```
```go
func reserveOnce(ctx context.Context, orderID string) (bool, error) {
	tag, err := db.Exec(ctx, `
		insert into reservations (order_id)
		values ($1)
		on conflict (order_id) do nothing`, orderID)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() == 1, nil
}
```

`rowCount === 1` means this delivery did the work. `0` means an earlier delivery already did. Both are success. Throw only when you do **not** know — the database was down, the unique check never ran. Then Kafka retries. A caught error that you log and ignore is how `order-9912` gets marked read with no pallet at all.

Marking a row in `processed_orders` **before** the reserve is the mirror bug. Crash after the mark and the redelivery skips a reserve that never happened. One statement, or one transaction, that both holds the pallet and claims the id.

## Replay is the same bug on purpose

[Resetting the group](/blog/kafka-consumer-groups-replay) to fix a bad warehouse choice re-reads history. Email will want to send again unless “already emailed `order-9912`” is the same kind of unique key. Fan-out does not share that key. Inventory being safe does not make email safe.

Exactly-once settings exist. They do not fix a warehouse API that holds a second pallet when it sees the same body twice. Make the handler boring first.

## Before you close the lag page

Lag at zero means the group caught up. It does not mean each order was reserved once. Open the reservation table for an id from the pile. Two rows, or a quantity of 2, means the handler treated a redelivery as a new order.

## Take these home

1. **At-least-once redelivers.** A crash after the side effect and before the commit is a second read, not a lost message.
2. **The effect should be the idempotency key.** A unique `order_id` on the reservation beats a separate “done” flag you can forget to write.
3. **Commit only after you know.** Throw when the check failed. Return when the row was already there.
4. **Each group needs its own key.** Replay and fan-out both run the handler again. Email does not inherit inventory’s unique constraint.
5. **Lag zero is not “once.”** It is “the bookmark caught the log.”
