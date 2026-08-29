# Example domain (author-only)

Use **plain, concrete language** in examples. Readers should understand the scenario in one read — no fictional company, no invented jargon.

## Default story (reuse across posts)

Someone **places an order** → you **reserve stock** → you **notify packing** → you **book shipping**.

Same order IDs when helpful: `order-8841`, `order-9912`.

## Clear service names

| Service | Does |
|---------|------|
| **Order API** | Accepts orders, returns fast |
| **Inventory** | Reserves or releases stock |
| **Notifications** | Email/SMS to customer or team |
| **Shipping** | Books carrier, prints label |

## Clear event names (Kafka)

- `OrderPlaced`, `StockReserved`, `Packed`, `Shipped`
- Partition by `order_id` when order matters

## Clear Go examples

- Count items: `var total int` + `for _, item := range items`
- Missing config: `if v, ok := cfg["min_stock"]; ok`
- Retry loop: `err = bookShipping()`
- Open file: `os.Open(path)` — path can be `"orders.json"` if context helps

## Do

- Use words a junior dev knows: order, stock, email, shipping, retry, config
- One short scenario in the intro, then teach the concept
- Keep algorithm sections generic (`[]int`, strings) once the pattern is clear

## Don't

- Invent brands (Northline) or vague nouns (line, manifest, intake, floor)
- Say "retail", "warehouse", "supply chain" unless the post is about that
- Force every algorithm problem into orders and SKUs
