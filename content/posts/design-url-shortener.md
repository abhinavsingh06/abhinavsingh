---
title: URL Shortener Design — When One Link Goes Viral
excerpt: One tracking link gets shared a million times. Design the two APIs — and the cache — so the redirect holds when a single code is on fire.
date: 2026-09-24
category: System Design
featured: true
---

Picture an order confirmation email. The line item links to a 180-character tracking URL full of query params. Nobody pastes that into Slack. They want `https://short.example/aB3xK9` — six characters that still open the real page.

You paste a long URL. The service returns a short one. Later someone clicks it. Their browser gets a **302** and lands on the long URL in tens of milliseconds.

That is the entire product: **two requests**. Create once. Redirect many times.

The trap in interviews is treating this like a startup pitch — custom domains, QR codes, A/B tests, dashboards. The trap in production is the opposite: you ship the two APIs, then a single shipping-status link from a big order email gets forwarded a million times, and suddenly your “simple” system is a distributed systems problem wearing a tiny URL.

> **Create once. Redirect many times. Never make the click wait on anything optional.**

[POLL:Which part do you want to nail first?|The two APIs|Capacity gut-check|Surviving a viral link]

## Step 1 — Ask before you draw

Jumping to “CDN + Kafka + Cassandra” is how designs lose the room. Three questions give the design a spine. Each answer changes what you optimize first.

[SD-URL-CLARIFY]

We will design for the common case: **generated codes**, **mostly clicks**, **analytics off the hot path**.

If the interviewer wants custom aliases (`/launch`), treat them as a **second write path** — uniqueness, reserved words, abuse — and park them. Generated codes keep the redirect story clean.

## Step 2 — Feel the size (so you know what “viral” means)

You do not need perfect math. You need creates/sec, redirects/sec, and which one wins. Pick a world:

[SD-URL-CAPACITY]

What those numbers buy you:

- **Writes** → can one DB take creates, or do you need ID ranges later?
- **Reads** → is cache optional or mandatory? If redirects are 100× creates, say it: “I optimize GET first.”
- **Storage** → usually boring. Hundreds of bytes per row. **Hot keys and QPS** kill you before disk does.

The punchline of capacity estimation is not the spreadsheet. It is permission to ignore half the whiteboard until the numbers force your hand.

## Step 3 — The whole schema is a dictionary

```http
POST /shorten
{ "url": "https://example.com/…" }

→ 201 { "code": "aB3xK9", "shortUrl": "https://short.example/aB3xK9" }
```

```http
GET /aB3xK9
→ 302 Location: https://example.com/…
```

Optional later: delete, stats, custom alias. Not day one.

| Field        | Why it exists                                      |
| ------------ | -------------------------------------------------- |
| `code`       | Unique key. What sits after `/`.                   |
| `long_url`   | Destination. Validate `https` on write.            |
| `created_at` | Ops, expiry, debugging.                            |
| `expires_at` | Optional. Redirect returns 410/404 when past.      |
| `owner_id`   | Optional. “My links” — after the redirect works.   |

Access pattern: **get by code**. A SQL primary-key lookup or a **key-value (KV) get** — systems like Redis or DynamoDB where you ask for a key and get a value back, no joins. If your schema needs a join to redirect, you overbuilt.

**301 vs 302:** 302 if you care about accurate counts or changing destinations; 301 if the mapping is forever and browsers may cache it. When analytics matter, **302** is the safer default — say why and move on.

## Step 4 — Sequence: watch the asymmetry

Do not memorize a wall of arrows. Walk **one hop** — who sends what — then the next.

Finish **Create**, then switch to **Redirect**. Notice cache appears only on the read path. That asymmetry *is* the design.

[SD-URL-SEQUENCE]

Create ends at 201. Redirect ends at **302 now** — click charts and Kafka *after* the Location header. Same discipline as [Why Kafka Exists](/blog/why-kafka-exists): the person tracking a package should not wait on your dashboard.

## Step 5 — Birth of a code (and the bug that sinks you)

Base62 (`0-9A-Za-z`), ~7 characters → ~3.5 trillion slots. Plenty for interview scale. Shorter looks nicer and collides sooner.

Pick a strategy. **Name the failure mode out loud** — that sentence is what interviewers listen for.

[SD-URL-CODE-GEN]

**Hash + truncate.** Same long URL can share a code (dedupe). Collisions happen — unique index + retry (more bits / salt). Pretending they do not is the fail.

**Counter → base62.** Unique if the counter is unique. One hot `INCR` under create bursts — **pre-allocate ID ranges** per app instance so creates do not serialize on a single key.

Random codes work too: generate, insert, retry on unique violation. Interviewers want the plan, not a new encoding paper.

## Step 6 — Day one is boring on purpose

Load balancer → app → primary database (Postgres is fine) **or** a key-value store if you prefer `code` as the only lookup key. That is enough to explain both APIs correctly.

Then you wait for pain. Not for a blog post about microservices.

| Pain                         | Move                                              |
| ---------------------------- | ------------------------------------------------- |
| Viral link hammers DB        | Cache by `code`                                   |
| App CPU maxed, DB fine       | More app replicas                                 |
| Counter hotspot on create    | Range-allocate IDs                                |
| Reads still crush one DB     | Lean on cache; read replicas if needed            |
| Click charts / abuse scores  | Async log / queue — never on the 302              |
| Multi-region latency         | Edge/regional cache + replicated mappings         |

Cache contract in one breath: key = code, value = URL (+ expiry). On update, **overwrite or invalidate**. Hot key in Redis is fine; stampeding the DB when TTL expires is the real danger — staggered TTLs or single-flight fill if you have seen it.

Failures without drama: missing → 404; expired → 410/404; DB down → creates fail closed, redirects degrade if cache still holds hot codes.

## Step 7 — The night one link goes viral

This is where dull designs end and strong ones start.

An order confirmation goes out. One short tracking link lands in Slack, Twitter, a group chat. Creates are still a trickle. Redirects are a firehose aimed at **one key**.

Most candidates draw a bigger database. The machine that is dying is the **read path for a single code**.

Prove you can diagnose under pressure:

[SD-URL-PRESSURE]

If you can pick the right move for each symptom, you are not memorizing a template — you are running a **read-dominated key-value system** with a tiny public API. That skill transfers: session stores, feature-flag lookups, config-by-key, “pastebin” metadata, anything that is mostly `GET by id`.

SQL table vs key-value store? Either works if `code` is the key. CDN vs Redis? CDN helps edges; **application cache** is the usual answer for `code → url`. Consistency? Create durable before you show the short link; redirects stay fresh by invalidating on change — not by praying.

Abuse is real on a public shortener: rate-limit creates, validate destinations, block known-bad hosts. Mention it once so the design feels like a product, not a toy.

## Close the whiteboard in sixty seconds

Do not recite a checklist. Tell a story with a spine:

1. Two APIs — shorten and redirect.  
2. One row — `code → long_url`.  
3. Reads crush writes — cache the redirect; 302 before analytics.  
4. Codes — hash-retry or counter-with-ranges; say the risk.  
5. Scale — replicas, then cache, then async side effects — **only when a metric forces you**.

Then the line that sticks:

> **A URL shortener is not a URL product. It is a discipline product: protect the hot read, defer everything optional, grow boxes only when your own QPS story demands it.**

That is the interview. That is also how you keep an order-tracking link alive on the worst Monday of the quarter.

---

Next in System Design: **pastebin / file link** — same dictionary shape, except the value is a blob and the pain moves from redirects to storage and download bandwidth.
