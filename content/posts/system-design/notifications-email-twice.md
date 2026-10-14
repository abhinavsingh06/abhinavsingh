---
title: The Shipping Email Went Out Twice.
excerpt: order-9912 shipped once. The customer got two emails. The second one was the same fact, delivered again.
date: 2026-10-15
category: System Design
featured: true
---

`order-9912` shipped once. The pallet left. The customer got two emails, an hour apart, both saying the same thing.

Checkout did not place the order twice. The warehouse did not ship twice. Notifications received **Shipped** twice and treated both as new. The second copy is the one from [the pile draining](/blog/kafka-duplicate-reserve): inventory did the work, crashed before the bookmark moved, and the record came back.

The inbox does not care why the fact was delivered again.

> **One shipped order, one email. The second delivery of the same fact sends nothing.**

[POLL:The same Shipped event shows up again. What leaves the building?|Another email|Nothing|A different subject line so they notice]

## Watch the second delivery

[SD-EMAIL-DEDUPE]

The key is not “we sent something recently.” The key is `order-9912` plus `shipped`. A later **Delivered** email is a different key and should still go out.

## The only write that matters

```sql
insert into sends (order_id, kind, sent_at)
values ('order-9912', 'shipped', now())
on conflict (order_id, kind) do nothing;
```

If the insert changes a row, send the email. If it does not, return. Do not send and then record. A crash between those two steps is how the second email gets born: the message left, the row did not, the event comes around again.

Checkout should not call the email provider on the request that places the order. The customer is waiting on stock and a confirmation page, not on a mailbox. Notifications is its own consumer group on the order log, the same split as [inventory and email](/blog/kafka-consumer-groups-replay). It reads when it can. The unique row is what makes “when it can” safe to retry.

| Field | Why |
| ----- | --- |
| `order_id` + `kind` | The send. Unique together. |
| `sent_at` | Ops, when someone asks why an email exists. |
| provider id | Optional. For the vendor’s retry, not for yours. |

Volume is whatever checkout already publishes. You do not need a new cluster because a customer got two emails. You need the second insert to lose.

A template change (`shipped` vs `shipped_v2`) is a new kind. That is a product decision, and it will email them again. Say that out loud before you rename the key.
