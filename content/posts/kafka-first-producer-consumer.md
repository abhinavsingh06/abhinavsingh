---
title: Your First Kafka Producer and Consumer
excerpt: Docker up, one topic, one OrderPlaced message — produce, consume, then watch the log survive when the consumer is down.
date: 2026-09-10
category: Distributed Systems
featured: true
---

You know why Kafka exists. You know broker, topic, partition, and offset.

Tonight we stop drawing boxes.

One Docker broker. Topic `orders`. Key `order-8841`. Value `OrderPlaced`. A consumer that reads it — then we kill the consumer, keep producing, and watch it catch up.

> **If you can send one record and read it back, the rest of Kafka is scale and failure modes — not magic.**

Prior reading: [Why Kafka Exists](/blog/why-kafka-exists) · [Core Vocabulary](/blog/kafka-core-vocabulary)

[POLL:Have you run Kafka locally before?|Yes — Docker or install|Tried, got stuck|Not yet]

## What you will see

Click through the same story the terminal will tell you: empty log → produce → consume → consumer down → catch up.

[KAFKA-PRODUCE-CONSUME-LAB]

That lag number is the whole point of a durable log. HTTP retries hope the other side is up. Kafka keeps the fact until a reader is ready.

## Run a broker

You need Docker. Create `docker-compose.yml`:

```yaml
services:
  kafka:
    image: apache/kafka:3.9.0
    ports:
      - "9092:9092"
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@localhost:9093
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
```

Start it:

```bash
docker compose up -d
```

Wait ~10 seconds. `localhost:9092` is your bootstrap server — the address producers and consumers use to find the cluster.

`KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092` matters. If Kafka advertises a hostname only the container understands, your laptop connects once, gets metadata, then fails on the real produce. Most “Kafka won't connect” nights are advertised listeners, not Kafka itself.

## Create the topic

```bash
docker exec -it $(docker compose ps -q kafka) \
  /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --create --topic orders \
  --partitions 1 --replication-factor 1
```

One partition keeps the demo honest: every record lands in the same ordered log. Production topics often use more partitions — start with one so offsets are obvious (`0`, `1`, `2`…).

Check it:

```bash
docker exec -it $(docker compose ps -q kafka) \
  /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --list
```

You should see `orders`.

## Produce one message

Open a producer (leave it open):

```bash
docker exec -it $(docker compose ps -q kafka) \
  /opt/kafka/bin/kafka-console-producer.sh \
  --bootstrap-server localhost:9092 \
  --topic orders \
  --property parse.key=true \
  --property key.separator=:
```

Type this line and press Enter:

```text
order-8841:{"event":"OrderPlaced","orderId":"order-8841"}
```

Key left of `:`, JSON right of `:`. That key is how related events for one order stay on the same partition when you scale out later.

Nothing flashy happens in this terminal. Append succeeded. The log on disk now has **offset 0**.

## Consume it

New terminal:

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

You should see:

```text
order-8841:{"event":"OrderPlaced","orderId":"order-8841"}
```

`--from-beginning` matters for learning. A brand-new consumer group defaults to **latest** — it only sees records written *after* it starts. Produce first, then consume without `--from-beginning`, and you get silence. That is not a broken broker. That is offset policy.

`--group inventory` names the consumer group. Kafka stores this group's committed offsets. Restart the same group and it resumes where it left off (unless you reset offsets).

## Break the consumer on purpose

1. Stop the consumer (`Ctrl+C`).
2. In the producer, send two more lines:

```text
order-9912:{"event":"OrderPlaced","orderId":"order-9912"}
order-2201:{"event":"OrderPlaced","orderId":"order-2201"}
```

3. Start the consumer again with the **same** `--group inventory` (drop `--from-beginning` this time, or keep it — committed offsets win for an existing group).

Those two messages appear. Inventory was offline. The facts waited. That is [Post 1](/blog/why-kafka-exists) with real bytes.

## Same path in code

Console tools prove the cluster. Application code is the same contract: bootstrap servers, topic, key, value.

[CODE-TABS]
```javascript
// npm i kafkajs
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "order-api",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
await producer.connect();
await producer.send({
  topic: "orders",
  messages: [
    {
      key: "order-8841",
      value: JSON.stringify({
        event: "OrderPlaced",
        orderId: "order-8841",
      }),
    },
  ],
});
await producer.disconnect();
```
```typescript
// npm i kafkajs
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "order-api",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
await producer.connect();
await producer.send({
  topic: "orders",
  messages: [
    {
      key: "order-8841",
      value: JSON.stringify({
        event: "OrderPlaced",
        orderId: "order-8841",
      }),
    },
  ],
});
await producer.disconnect();
```
```go
// go get github.com/segmentio/kafka-go
package main

import (
	"context"
	"time"

	"github.com/segmentio/kafka-go"
)

func main() {
	w := kafka.NewWriter(kafka.WriterConfig{
		Brokers:  []string{"localhost:9092"},
		Topic:    "orders",
		Balancer: &kafka.Hash{},
	})
	defer w.Close()

	_ = w.WriteMessages(context.Background(), kafka.Message{
		Key:   []byte("order-8841"),
		Value: []byte(`{"event":"OrderPlaced","orderId":"order-8841"}`),
		Time:  time.Now(),
	})
}
```

Consumer sketch (Node):

```javascript
const consumer = kafka.consumer({ groupId: "inventory" });
await consumer.connect();
await consumer.subscribe({ topic: "orders", fromBeginning: true });

await consumer.run({
  eachMessage: async ({ partition, message }) => {
    console.log({
      partition,
      offset: message.offset,
      key: message.key?.toString(),
      value: message.value?.toString(),
    });
    // reserve stock, then let the client commit
  },
});
```

Treat handlers as **at-least-once**: process, then commit. If you crash after side effects but before commit, you may see the message again. Idempotent writes (upsert by `orderId`) beat pretending duplicates never happen.

## When local Kafka fights back

[KAFKA-LOCAL-PITFALLS]

## What this taught you

| You did | Kafka idea |
| ------- | ---------- |
| `docker compose up` | Broker process |
| `--create --topic orders` | Named log |
| Produce with a key | Record address starts with topic + key → partition |
| Consumer prints the line | Read by offset |
| Kill consumer, keep producing | Durability + lag |
| Same `--group` | Committed offsets per group |

You did not need ZooKeeper, Schema Registry, or exactly-once settings. Those show up when teams grow. Day one is append and read.

## Four habits worth keeping

1. **Advertise an address your client can dial** — localhost for laptop Docker; real DNS in prod.
2. **Key by the entity that must stay ordered** — `orderId`, not a random UUID per event.
3. **Decide from-beginning vs latest on purpose** — silence is often offset policy.
4. **Assume duplicates** — design Inventory to tolerate a second `OrderPlaced` for the same id.

## What to remember

Produce appends to a topic. Consume reads from an offset. If the consumer is down, the log holds the backlog until it returns.

Next: **consumer groups** — why two services can both read `orders` without stealing each other's messages, and what a rebalance actually does.
