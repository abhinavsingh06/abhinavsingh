---
title: JavaScript Variables and Data Types
excerpt: const, let, typeof, primitives, null vs undefined — the parts of JavaScript that show up in every file, explained without the textbook tone.
date: 2019-07-10
updated: 2026-08-29
category: JavaScript
featured: false
---

Open almost any JavaScript file and you will see the same building blocks: a name, a value, and rules about what you are allowed to do next.

JavaScript is **dynamically typed** — a variable does not lock to one type at declaration. You can assign a number, then later assign a string. That flexibility is a feature and a footgun.

> **A variable is a labeled box. The type is whatever you put in it today.**

If you are coming from Go, read [Why Go Doesn't Let Variables Stay Uninitialized](/blog/why-go-variables-uninitialized) for the opposite design: types fixed early, zero values by default.

[POLL:When you declare a variable, which keyword do you use most?|const|let|var]

## Remember this one line

**Default to `const`. Use `let` when you reassign. Avoid `var`.**

Everything else — types, `typeof`, null, undefined — hangs off that habit.

## const, let, and var

Three keywords, three different sets of rules. Not interchangeable.

[JS-DECL-COMPARE]

**Sticky idea:** Block scope (`const` / `let`) matches how you read code — what you declare inside an `if` stays inside that `if`.

## The main types

JavaScript has seven primitive types plus objects. You do not need every edge case on day one — you need the ones that show up in bugs.

[JS-TYPES-LAB]

**Sticky idea:** `typeof` is a quick check, not a contract. For real safety, use TypeScript or validate at boundaries.

## null vs undefined

Both mean “no useful value” in conversation. In code they tell different stories.

[JS-NULL-UNDEFINED]

## typeof in practice

```javascript
typeof 42           // "number"
typeof "hello"      // "string"
typeof true         // "boolean"
typeof undefined    // "undefined"
typeof null         // "object"  ← historic quirk
typeof {}           // "object"
typeof []           // "object"
typeof (() => {})   // "function"
```

Use `typeof` for quick debugging. For production checks, prefer strict equality and schema validation at API edges.

## In real code

### Prefer const until you cannot

```javascript
const userId = session.id
const items = await fetchCart(userId)
let total = 0

for (const item of items) {
  total += item.price * item.qty
}
```

`userId` and `items` never get reassigned — `const`. `total` grows — `let`.

**Sticky idea:** If you never reassign, `const` documents intent for the next reader.

### Do not use truthiness for business rules

```javascript
// risky — 0 and "" are falsy
if (discount) {
  apply(discount)
}

// clearer
if (discount != null && discount > 0) {
  apply(discount)
}
```

**Sticky idea:** Falsy is not the same as “invalid input.” Be explicit when zero or empty string are valid.

### Objects hold shape; primitives hold values

```javascript
const order = {
  id: "ord_9912",
  qty: 2,
  shipped: false,
}

order.shipped = true       // ok — mutating property
// order = {}              // error if order is const
```

**Sticky idea:** `const` stops rebinding the variable. It does not freeze the object inside.

### Template literals beat concatenation

```javascript
const name = "Ada"
const greeting = `Hello, ${name}!`
```

Backticks when you embed values. Regular quotes for plain strings.

## Try this

1. Rewrite one `var` in an old file as `const` or `let`. Notice scope differences.
2. Log `typeof null` and `typeof []`. Remember both say `"object"`.
3. Write a function that returns nothing — log the result. That is `undefined`.
4. Set a variable to `null` on purpose. Explain in a comment why null fits better than undefined.
5. Run `0.1 + 0.2` in the console. See why money often uses integer cents.

## Take these home

1. **`const` by default** — reassign only with `let`.
2. **Avoid `var`** — function scope leaks in ways block scope does not.
3. **Dynamic typing** — the type lives in the value, not the declaration.
4. **`undefined` = never set / missing** · **`null` = intentionally empty**.
5. **`typeof null` is `"object"`** — use `=== null` when you mean null.
6. **Truthy/falsy** is convenient in `if` — dangerous for domain rules without explicit checks.

JavaScript gives you a small toolkit and a lot of rope. Names (`const` / `let`), types (primitives and objects), and the null/undefined split are the knots worth learning first — everything else in the language tends to hang off them.
