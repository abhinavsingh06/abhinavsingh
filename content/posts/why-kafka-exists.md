---
title: Why Kafka Exists
excerpt: What problem Kafka solves — durable logs, decoupled services, and replay — and when a simple HTTP call is still the right answer.
date: 2026-08-29
category: Distributed Systems
featured: true
---

Imagine placing an order: reserve stock → send confirmation → book shipping.

The naive version chains HTTP calls. The Order API calls Inventory. Inventory calls Notifications. Inventory calls Shipping. One slow service stalls the whole response. One service down and checkout fails — even when the email could wait.

> **Kafka exists so services can react to what happened without standing in each other's way.**

This is the first post in the Kafka series. We start with _why_ before brokers, partitions, or consumer groups.

[POLL:Have you used Kafka in production?|Yes, regularly|Tried locally / tutorials|Heard of it, never used]

## Remember this one line

**Kafka is a durable log that many readers can consume at their own pace.**

Not “a faster queue.” Not “free microservices.” A **log** — append events, keep them, let different teams read when they’re ready.

## The pain direct calls create

Three problems show up again and again in growing systems:

1. **Tight coupling in time** — Service A cannot finish until B, C, and D respond.
2. **Tight coupling in shape** — Every new downstream step means editing the producer.
3. **No memory** — If a new team needs yesterday’s events, there is nothing to replay.

Sync HTTP is fine for “I need an answer now.” It gets expensive when ten teams need to hear that something happened.

[KAFKA-FLOW-COMPARE]

**Sticky idea:** Events decouple _when_ work happens. The Order API can return fast while email catches up later.

## What Kafka actually gives you

| Idea           | Plain English                                              |
| -------------- | ---------------------------------------------------------- |
| **Producer**   | Writes an event to a topic (“order-8841 placed”)           |
| **Topic**      | Named stream of events — like a folder of logs             |
| **Consumer**   | Reads events and does work (reserve stock, send email)     |
| **Durability** | Events sit on disk; they survive restarts                 |
| **Replay**     | A new consumer can read from the beginning (within retention) |

You do not need every detail yet. Hold one picture: **write once, read many, later if needed.**

## Why not just a message queue?

Classic queues often **delete** a message after one consumer acks it. That is great for job distribution — one worker takes the task.

Kafka’s default mental model is different: **keep the log**. Multiple consumer groups can each read the same events. New services can catch up. Reporting can lag behind real time without blocking new orders.

**Sticky idea:** Queues distribute work. Kafka **remembers** what happened.

## When Kafka is the wrong tool

Kafka is not free complexity. Brokers, partitions, consumer lag, and rebalances are real ops.

Skip Kafka (for now) when:

- The user is **waiting on screen** for the answer (login, live stock check)
- You have **two services** and low traffic — Postgres + HTTP is enough
- You need **one global order** for all events everywhere — Kafka orders per partition, not magically worldwide
- Payloads are tiny and latency must be **sub-millisecond** between two boxes

[KAFKA-FIT-CHECKER]

## A sane mental model for beginners

Think of Kafka as the **company bulletin board**:

- Someone pins a note: “Order #9912 placed.”
- Billing reads it when they can.
- Packing reads it when they can.
- A new reporting team can read **old notes** still on the board (retention permitting).

Nobody has to call everyone by phone while the customer waits.

## For experienced readers

If you already run Kafka, the design question underneath this post is:

**Are you using it as a durable event log, or as a distributed RPC bus with extra steps?**

Anti-patterns that look like “Kafka everywhere”:

- Request/response disguised as topic ping-pong
- One giant topic with no key strategy → ordering surprises
- Consumers that cannot tolerate replay → fragile at-least-once reality

The durable-log model shines when **producers stay dumb** (append facts) and **consumers own side effects** (idempotent, replay-safe).

## Try this

1. Draw your last feature as boxes and arrows. Circle every synchronous HTTP call on the critical path.
2. For each arrow, ask: “Does the user need to wait for this?” If no, it might be an event.
3. List who else might care about the same fact in six months. That is your consumer list.
4. Run Kafka locally (`docker compose` with Apache Kafka) and send one message with the console producer — next post we build on that.
5. Name one workflow where replay would save you during a bug fix. That is your Kafka ROI story.

## Take these home

1. Kafka solves **decoupling in time** — producers and consumers do not have to be ready at the same instant.
2. It is a **durable log**, not just a pipe that forgets.
3. **Replay** and **multiple readers** are first-class — plan for them.
4. **Sync APIs** still belong on the critical path; Kafka shines on side effects and fan-out.
5. **Partition-level ordering** comes later — global order is not Kafka’s default superpower.
6. Introduce Kafka when **coupling or volume** hurts — not because diagrams look modern.

---

Next in the series: core vocabulary — broker, topic, partition, offset — without the jargon wall.
