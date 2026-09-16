---
title: Kafka Consumer Groups & Replay
excerpt: Two teams read the same OrderPlaced events without stealing — then reset an offset and fix a bad stock reservation from the log.
date: 2026-09-17
category: Distributed Systems
featured: true
---

You can produce to `orders` and consume as group `inventory`. That was [Post 3](/blog/kafka-first-producer-consumer).

Tonight is the reason teams pick Kafka over a queue that forgets:

1. **Email** and **Inventory** both need every `OrderPlaced` — without fighting over who “owns” the message.
2. Inventory reserved the wrong warehouse for `order-9912` — you **replay** from the log instead of asking checkout to happen twice.

> **Same topic, different group ids = fan-out. Same group id = workers sharing partitions. Replay = move the bookmark, read again.**

Prior reading: [Why Kafka Exists](/blog/why-kafka-exists) · [Core Vocabulary](/blog/kafka-core-vocabulary) · [First Produce & Consume](/blog/kafka-first-producer-consumer)

[POLL:Which one do you need tonight?|Two services on one topic|Scale consumers in one team|Replay after a bug]

## The two jobs of a consumer group

A **consumer group** is a named team of readers (`inventory`, `email`, `analytics`). Kafka tracks **committed offsets per group per partition**.

That one sentence unlocks two designs that look the same in code and mean opposite things:

| You want | Group ids | What happens |
| -------- | --------- | ------------ |
| Every team gets every event | `inventory` **and** `email` | Fan-out — independent bookmarks |
| One team processes faster | Several processes, **same** `inventory` | Partitions split across workers |

Click both modes. Same three partitions. Different story.

[KAFKA-CONSUMER-GROUPS]

**Sticky idea:** Queues often delete after one ack. Kafka **keeps** the log so many groups can read it. Inside one group, partitions are the unit of parallelism — not “spawn infinite pods and hope.”

## Try fan-out on your laptop

Use the same Docker broker from Post 3. Topic `orders` with a few messages already in it (produce a couple if the log is empty).

**Terminal A — Inventory:**

```bash
docker exec -it $(docker compose ps -q kafka) \
  /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic orders \
  --from-beginning \
  --property print.key=true \
  --property key.separator=: \
  --group inventory
```

**Terminal B — Email** (new group, same topic):

```bash
docker exec -it $(docker compose ps -q kafka) \
  /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic orders \
  --from-beginning \
  --property print.key=true \
  --property key.separator=: \
  --group email
```

Both terminals print the same keys. Neither steals from the other. That is fan-out with real bytes.

Produce one more line in a third terminal while both consumers run. Both should show it. Two bookmarks advanced independently.

## Scale one team (same group id)

Create (or recreate) the topic with **three partitions** so assignment is visible:

```bash
docker exec -it $(docker compose ps -q kafka) \
  /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --create --topic orders-scaled \
  --partitions 3 --replication-factor 1
```

Start **two** consumers with the **same** `--group inventory-scaled` on `orders-scaled`. Produce several messages with different keys (`order-1`, `order-2`, …). Watch which terminal prints which keys — each partition sticks to one member of the group.

Add a **third** consumer in the same group. Kafka **rebalances**: partitions are reassigned so work is shared again. A fourth consumer on a three-partition topic sits idle until someone leaves. More pods than partitions does not mean more throughput for that group.

In code the only new idea is the shared `groupId`:

[CODE-TABS]
```javascript
// npm i kafkajs
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "inventory-worker",
  brokers: ["localhost:9092"],
});

// Same groupId on every Inventory replica
const consumer = kafka.consumer({ groupId: "inventory" });
await consumer.connect();
await consumer.subscribe({ topic: "orders", fromBeginning: false });

await consumer.run({
  eachMessage: async ({ partition, message }) => {
    const orderId = message.key?.toString();
    // reserve stock — must tolerate duplicates (at-least-once)
    console.log({ partition, offset: message.offset, orderId });
  },
});
```
```typescript
// npm i kafkajs
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "inventory-worker",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "inventory" });
await consumer.connect();
await consumer.subscribe({ topic: "orders", fromBeginning: false });

await consumer.run({
  eachMessage: async ({ partition, message }) => {
    const orderId = message.key?.toString();
    console.log({ partition, offset: message.offset, orderId });
  },
});
```
```go
// go get github.com/segmentio/kafka-go
package main

import (
	"context"
	"fmt"

	"github.com/segmentio/kafka-go"
)

func main() {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{"localhost:9092"},
		Topic:    "orders",
		GroupID:  "inventory", // same on every Inventory replica
		MinBytes: 1,
		MaxBytes: 10e6,
	})
	defer r.Close()

	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			break
		}
		fmt.Printf("partition=%d offset=%d key=%s\n", m.Partition, m.Offset, string(m.Key))
	}
}
```

Email is a **different** `groupId` (`email`). Same topic subscription. Separate progress.

## Replay — when the handler was wrong

The log is the source of truth for **what happened**. Your consumer is responsible for **what you did about it**. When side effects are wrong, you fix the code and read the facts again.

Walk the lab:

[KAFKA-REPLAY-LAB]

### Reset offsets with the CLI

Stop the consumers in that group first (or you will fight live commits).

```bash
docker exec -it $(docker compose ps -q kafka) \
  /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 \
  --group inventory \
  --describe
```

You should see partitions, committed offsets, and lag.

Reset partition 0 to a specific offset (example: re-read from offset `1`):

```bash
docker exec -it $(docker compose ps -q kafka) \
  /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 \
  --group inventory \
  --topic orders:0 \
  --reset-offsets --to-offset 1 \
  --execute
```

Or jump to the start of retained data:

```bash
docker exec -it $(docker compose ps -q kafka) \
  /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 \
  --group inventory \
  --topic orders \
  --reset-offsets --to-earliest \
  --execute
```

Then start the consumer again **without** inventing new produce traffic. You are reading history you already have.

**Retention matters.** If the segment aged out, replay cannot invent bytes back. Know your topic retention before you promise “we can always rebuild.”

**Idempotency matters.** Replay re-delivers. Upsert by `orderId`, ignore duplicate emails, use an “already processed” store — something that makes a second pass safe. Exactly-once tooling exists; most teams win first with boring idempotent handlers (we go deep on that later in the series).

## Rebalances in one paragraph

When a member joins or leaves a group (deploy, crash, scale), Kafka **reassigns partitions** among remaining members. That pause is a **rebalance**, not “Kafka is down.” Consumers stop briefly, get new assignments, resume from committed offsets. Hot partitions, sticky assignors, and lag spikes during deploys are Post 6. Tonight: expect rebalances when you change group membership; do not treat them as mystical outages.

## Myths that waste a night

[KAFKA-GROUP-MYTHS]

## What this taught you

| You did | Kafka idea |
| ------- | ---------- |
| `--group inventory` and `--group email` | Independent bookmarks on one topic |
| Two processes, same group, 3 partitions | Parallelism capped by partition count |
| `--reset-offsets` | Replay = move bookmark |
| Re-read after a bug | Log remembers; handler must tolerate duplicates |

## Habits worth keeping

1. **Name groups after the workload** — `inventory`, `email`, not `consumer-1`.
2. **Size partitions for the busiest group’s parallelism** — fan-out groups do not multiply partition need the same way.
3. **Reset only when consumers in that group are stopped** — live commits race your reset.
4. **Design for replay on day one** — idempotent side effects beat heroic “exactly once” settings.

## What to remember

Consumer groups turn one durable log into many independent readers — or into a scaled worker pool — depending on whether the **group id** matches.

Replay is not “please send it again.” It is “I moved my bookmark; give me those offsets again.”

Next: **Kafka vs HTTP / RabbitMQ / SQS** — when the durable log is the right tool, and when a queue or a plain POST is enough.
