---
title: Kafka Core Vocabulary — Broker, Topic, Partition, Offset
excerpt: Follow one OrderPlaced event from write to read — broker, topic, partition, and offset in plain English, with interactives.
date: 2026-09-01
category: Distributed Systems
featured: true
---

`order-8841` just checked out. The Order API published `OrderPlaced` and returned 201.

Inventory was down for twenty minutes.

When it came back, nothing was lost — the event was still in the log, waiting at a known position. That is the whole game: **where** a fact lives, and **how** a reader finds it again.

If you read [Why Kafka Exists](/blog/why-kafka-exists), you already know the why. This post names the five words on every whiteboard — and the mistakes that hide behind them.

> **Topic = named log. Partition = parallel slice of that log. Offset = your bookmark in one slice.**

[POLL:Which term still feels fuzzy?|Broker|Partition|Offset|All of them]

## Follow the message

Click through producer → broker → topic → partition → offset → consumer. Same `order-8841` the whole way.

[KAFKA-MESSAGE-TRACE]

That path is the post. Everything below is what people usually get wrong when they skip a step.

## Broker

A **broker** is a Kafka server with disks attached. It receives writes, stores them, serves reads.

A **cluster** is several brokers working together — more than one machine so a single disk failure does not erase your events. You connect to the cluster; the client library finds the right broker for the partition you are writing to or reading from. Application code never publishes to “broker 3.” It publishes to a **topic**.

On most diagrams, “broker” hides **partition leadership**. Each partition has one leader broker that takes writes; followers replicate. When a broker dies, leadership moves. Outages often feel like “Kafka is down” when one hot partition lost its leader.

## Topic

A **topic** is the name producers and consumers agree on — `orders`, `payments`, `notifications`.

```text
orders          → checkout facts (OrderPlaced, OrderCancelled)
payments        → charges and refunds
notifications   → email and SMS triggers
```

Topics are **contracts**. Everyone who reads `orders` expects a certain shape of event. Rename fields or change meaning without a version strategy and you break consumers you have never met.

Name topics after **facts** (`orders`), not teams (`inventory-queue`). Put event names in the payload (`OrderPlaced`), not service-specific verbs (`call-inventory`).

Topic count × partition count × replication factor is your disk and network budget. “One topic per microservice” often means hundreds of idle streams. Merge by **business fact**; split only when retention, access, or schema truly diverge.

## Partition

A topic is split into **partitions** — separate ordered logs that run in parallel.

More partitions → more write/read parallelism. The limit most teams hit first is not broker CPU — it is **key skew**. A million events keyed by `order-8841` still land in **one** partition. Ten partitions do not help if one key owns the traffic.

When order matters for a single order, every event shares the same **key**. Same key → same partition → `OrderPlaced` before `StockReserved` before `Shipped`.

[KAFKA-PARTITION-KEYS]

No key? Records round-robin across partitions. Fine for click metrics. Wrong for an order lifecycle.

Raising partition count later does **not** reshuffle old data. Plan keys and partition count before production traffic, not after the first hot-partition alert.

## Offset

An **offset** is a position in one partition’s log: 0, 1, 2, … growing with every append. It is how far a reader has gotten — replay means reading from an older position again.

```text
Partition 2:  … [1041] [1042] ← OrderPlaced landed here
```

Inventory’s bookmark said 1041. It woke up, read 1042, reserved stock, committed 1043. The customer already had their confirmation — no one re-ran checkout.

Kafka is **at-least-once** by default. A consumer can process 1042, crash before committing, and see 1042 again after restart. Handlers need to tolerate duplicates — idempotency keys, upserts, “already processed” tables. Exactly-once semantics exist; they cost complexity. Idempotent consumers win more often than exotic producer settings.

Offsets are scoped to **partition** and **consumer group** — how multiple services read the same topic without stealing each other’s progress (Post 4).

## Producer and consumer

**Producer** appends a record:

```text
topic=orders  key=order-8841  value={"event":"OrderPlaced","orderId":"order-8841"}
```

**Consumer** subscribes to `orders`, fetches from partition 2 starting at offset 1042, runs business logic, **commits** the new offset.

The Order API did not call Inventory over HTTP. It left a fact; Inventory pulled when ready. These terms are just the coordinates of that fact on disk.

Watch for **Kafka as RPC** — request on topic A, reply on topic B, timeout in the producer. That is HTTP with extra steps and worse stack traces. Kafka shines when producers append **immutable facts** and consumers own side effects.

## The full address

| Piece | For `order-8841` | One-line job |
| ----- | ---------------- | ------------ |
| **Broker** | `kafka-2` (leader for this partition) | Stores bytes on disk |
| **Topic** | `orders` | Shared stream name |
| **Partition** | `2` | Parallel ordered log |
| **Offset** | `1042` | Position in that log |
| **Key** | `order-8841` | Routes + orders related events |

Draw this for a real event in your system before the next design review. If you cannot label all five, partition sizing and lag debugging will stay guesswork.

## Four questions worth asking

1. **Are producers publishing facts or commands?** Commands age badly; facts replay cleanly.
2. **Does any hot key dominate a partition?** Check per-partition byte rate, not just topic totals.
3. **Can every consumer survive a duplicate?** If not, offset commits will eventually hurt you.
4. **Is Kafka on a synchronous user-facing path?** It usually should not be.

## What to remember

Broker stores it. Topic names it. Partition parallelizes it. Offset bookmarks it. Key keeps one order in line.

Mis-keyed events, vague topic sprawl, and non-idempotent consumers cause most “Kafka is unreliable” war stories. The log is honest; the application contract has to be honest too.

Next post we stop drawing boxes: Docker up, one producer, one consumer, one message on `orders`. You will watch offset `0` appear for real.
