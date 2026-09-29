---
title: The Deploy Paused Inventory. Orders Piled Up.
excerpt: Inventory went green. Checkout never stopped. Two hundred orders were already in the log, and nobody had read them.
date: 2026-10-01
category: Distributed Systems
featured: true
---

14:02. You roll inventory. Both pods restart. The dashboard goes green.

14:07. Packing asks where `order-9912` is. Checkout returned 201. The customer has a confirmation. Inventory has never reserved the stock.

Nothing crashed on the way back up. The group spent a few seconds with **nobody assigned to its partitions**. Checkout kept appending `OrderPlaced` the whole time. Those orders are sitting in the log, past the last offset inventory committed. That gap is the page. The green deploy is not.

> **The process is up. The orders from the restart window are not read.**

If you have the group picture from [consumer groups and replay](/blog/kafka-consumer-groups-replay), this is that group going empty while the producer stays rude.

[POLL:Fourteen minutes after a green deploy, what do you open?|Error rate|This group’s lag|Broker CPU]

## The number that was climbing while you watched pods

[KAFKA-LAG-STORY]

Checkout does not wait for a rebalance. A rebalance is only Kafka taking partitions away from members who left and handing them to members who are in the group now. Committed offsets stay put. Records are not deleted. Reading stops. Writing does not.

## Paste this in the incident channel

Same local broker as [the first producer](/blog/kafka-first-producer-consumer). Stop the `inventory` consumer, keep producing, start it again with the **same** `--group inventory`, then describe the group:

```bash
docker exec -it $(docker compose ps -q kafka) \
  /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 \
  --group inventory \
  --describe
```

This is the screenshot that explains 14:07:

```text
GROUP      TOPIC   PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG
inventory  orders  0          1042            1180            138
inventory  orders  1          980             1104            124
inventory  orders  2          1101            1101            0
```

Partition 2 never fell behind. Zero and one did. **262 orders** are published and not committed by inventory. `LOG-END-OFFSET` is how far checkout got. `CURRENT-OFFSET` is how far this group admitted it got. Lag is the subtraction, per partition.

Now describe group `email` on the same topic. It can be all zeros. The topic is not “behind.” Inventory is. If you glance at the wrong group, you will close the incident while packing is still waiting.

When the workers rejoin, they must continue **after the last commit**. A brand-new group id, or a consumer that starts at latest, skips the pile and marks the incident healed. The stock is still not reserved. `order-9912` is in that skipped range.

## Both pods, same second

One inventory worker dying is boring. The other worker still owns its partitions. Only the dead one’s partitions move.

You restarted **both**. For a moment the group was empty. A rolling restart that overlaps does the same thing: the old pod is gone, the new one has not joined, checkout does not care.

Roll one. Wait until it is in the group and that lag column is not rising. Then roll the next.

There is a nastier version, where the pods never all die. `reserveStock` sometimes takes two minutes. The consumer does not poll Kafka in that time. Kafka decides the member left, pulls its partitions, and the pile grows because your own timeout declared you gone.

```javascript
await consumer.run({
  eachMessage: async ({ message }) => {
    const orderId = message.key?.toString();
    await reserveStock(orderId);
  },
});
```

That `await` sits inside the poll loop. `max.poll.interval.ms` is how long Kafka will believe you are still here. Either the reserve finishes inside it, or the slow work leaves this loop. And you commit **after** the reserve succeeds. Commit before, and lag falls to zero while the warehouse still has nothing for `order-9912`.

## Before you wake anyone else

Email’s lag at zero does not mean inventory’s is. A replay you triggered on purpose also jumps lag — that is the bookmark you moved in the last post, not this deploy. Lag that sits still while checkout has stopped publishing is a quiet afternoon. Lag that rises while orders are still being placed is 14:07.

Inventory will come back and read all 262. Some of those reserves will run twice. That is the next outage, and it starts the moment this pile drains.
