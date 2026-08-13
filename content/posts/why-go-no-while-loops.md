---
title: Why Go Doesn't Have While Loops
excerpt: if, switch, for, break, continue, labels, and defer — and why Go replaced while, do-while, and foreach with a single loop word.
date: 2026-08-13
category: Languages
featured: true
---


Open a Go file looking for `while`. You won’t find it.

That’s not an accident. C, Java, and JavaScript give you *while*, *do-while*, *for*, and often *foreach*. Go kept one loop: **`for`**. Leave pieces out and it becomes “while.” Leave them all out and it runs forever. Add `range` and it walks a collection.

> **Fewer loop words. Same jobs. One shape to remember.**

The rest of control flow follows the same taste: required braces, no ternary, switch that doesn’t fall through, and `defer` so cleanup sits next to setup.

Also read: [Why Go Doesn't Let Variables Stay Uninitialized](/blog/why-go-variables-uninitialized) and [Why Simple Code Beats Clever Code](/blog/why-simple-code-beats-clever-code).

[POLL:Did you miss while when you first wrote Go?|Yes — felt wrong|Quickly got used to for|Never thought about it]


## Remember this one line

**`for` is the only loop.** Condition-only `for` is while. Empty `for` is forever. `range` is foreach.

`if`, `switch`, `break`, `continue`, labels, and `defer` are the rest of the steering wheel.


## if, switch, for, break, labels, defer

[GO-CONTROL-FLOW]


## How other loops map onto `for`

[GO-FOR-SHAPES]


## Why this design choice exists

[GO-WHILE-DEBATE]


## In real code

### Fail fast, keep the happy path flat

```go
f, err := os.Open(path)
if err != nil {
    return err
}
defer f.Close()

return parse(f)
```

No `else` wrapping the whole function. Check, return, continue. `defer` promises the close even if `parse` fails.

**Sticky idea:** Setup and cleanup share a zip code. The rest of the function can forget about the file.

### `switch` instead of an `else if` ladder

```go
switch {
case code >= 500:
    return "server"
case code >= 400:
    return "client"
default:
    return "ok"
}
```

No expression on `switch` means each case is a boolean. Cases don’t fall through — you can read one without skimming the next.

**Sticky idea:** A tagless switch is a labeled list of conditions, not a fall-through trap.

### Waiting is still a loop — just spelled `for`

```go
for attempts < max && err != nil {
    err = send()
    attempts++
}
```

That’s a while loop. Go didn’t delete the idea. It deleted the extra keyword.

**Sticky idea:** If you can say it with `for`, Go already has a word for it.

### Nested loops: aim `break` with a label

```go
Found:
for r, row := range grid {
    for c, cell := range row {
        if cell == needle {
            fmt.Println(r, c)
            break Found
        }
    }
}
```

A bare `break` would only leave the inner loop. The label names the loop you actually want to exit.

**Sticky idea:** Labels are a last resort for nested break — not a second `goto`.

### Don’t `defer` inside a tight loop

```go
// piles up until the function returns — usually wrong
for _, path := range paths {
    f, err := os.Open(path)
    if err != nil {
        return err
    }
    defer f.Close()
    read(f)
}
```

`defer` is tied to the **function**, not the block. Close in the loop, or wrap each file in a small helper so defer runs when *that* helper returns.

**Sticky idea:** defer means “when this function exits,” not “when this `}` is hit.”


## Try this

1. Rewrite a `while` from another language as `for condition { }`. Read it out loud.
2. Find an `else if` chain and try a tagless `switch`.
3. Search for `break` inside `switch` inside `for`. Does it leave the loop you think it does?
4. Find `defer` in a loop. If the function is long-lived, that’s a leak — fix it.
5. Walk a slice with `for _, v := range` and try mutating `v`. Notice the slice doesn’t change.


## Take these home

1. **No `while`** — condition-only `for` is the same idea.
2. **`if` has no parens and no ternary** — braces always; declare in the condition when it stays local.
3. **`switch` does not fall through** — `fallthrough` is opt-in and rare.
4. **`break` / `continue` target the inner loop or switch** — labels when nested loops would lie.
5. **`defer` runs at function return, LIFO** — keep it next to setup, out of hot loops.
6. **One loop keyword** is governance: fewer dialects, same power.


Other languages hang extra loop words on the wall like spare keys. Go leaves one key on the hook: `for`. You still get while, foreach, and forever — you just stop arguing about which key to pick.
