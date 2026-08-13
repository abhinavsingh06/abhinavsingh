---
title: Why Go Doesn't Let Variables Stay Uninitialized
excerpt: Variables, types, constants, zero values, and := — explained simply. Why every Go variable starts with a real value, and how that stops a whole class of bugs.
date: 2026-08-09
category: Languages
featured: true
---


In many languages, a new variable can be empty in a dangerous way: “I exist, but nobody put anything in me yet.” Read that variable and you might get random junk from memory.

Go says no to that.

> **Every variable starts with a real value.** Either you set it — or Go sets a safe default called the **zero value**.

Forget “what is int?” for a second. The sticky question is:

> **Why does every variable already have a value — and how does that stop bugs?**

Also read: [Why Simple Code Beats Clever Code](/blog/why-simple-code-beats-clever-code) and [Why Google Invented Go](/blog/why-google-created-go).

[POLL:Have you been bitten by an uninitialized variable in another language?|Yes — C/C++/others|Not sure / never noticed|Mostly high-level languages]


## Remember this one line

**If a variable exists in Go, it already has a value.**

No ghosts. No “maybe garbage.” No surprise crashes from unread memory.

`var`, types, `const`, and `:=` all live under that rule.


## Variables, types, constants, zeros, and `:=`

[GO-VAR-BASICS]


## What each zero value really means

`int` starts at `0`. Easy. The harder part is knowing **which zeros are safe to use** — and which ones blow up.

[GO-ZERO-VALUE-LAB]


## `var`, `:=`, and `const`

Same job, different tools.

[GO-DECL-COMPARE]


## Why this design choice exists

[GO-UNINIT-DEBATE]


## In real code

### Counting is free

```go
var sum int
for _, n := range values {
    sum += n
}
```

You don’t write `sum = 0`. Zero is already the right place to start adding.

**Sticky idea:** Go’s default often matches the math you wanted.

### Zero is not the same as “missing”

```go
func port(cfg map[string]int) int {
    if p, ok := cfg["port"]; ok {
        return p
    }
    return 8080
}
```

Is `0` a real port, or did someone forget to set one? If both are possible, **don’t make `0` mean “I forgot.”** Ask the map: “was this key there?”

**Sticky idea:** Empty ≠ missing. Say missing out loud in code.

### Good types work on day zero

```go
var mu sync.Mutex
mu.Lock()
defer mu.Unlock()
```

No `NewMutex()`. It just works. When you invent a type, ask: *can someone write `var t T` and use it safely?*

**Sticky idea:** The best Go types are ready before you “set them up.”

### `:=` is fast — and sneaky

```go
f, err := os.Open(path)
if err != nil {
    return err
}
defer f.Close()

b, err := io.ReadAll(f) // same err, new b — allowed
if err != nil {
    return err
}
```

`:=` creates what’s new and reuses what’s old. Handy. Also easy to accidentally create a *second* `err` inside an `if` and wonder why the outer one never updates.

**Sticky idea:** Always glance at the left side of `:=`.


## Try this

1. Find a `var` with no `=`. Say its starting value out loud. Is that a good start?
2. Find a place where `0` or `""` means “not set.” Fix it so “missing” is clear.
3. Build a tiny type that works with `var t T` — no constructor needed.
4. Search for `:=` inside `if`. Check you didn’t hide `err` by accident.
5. Print a nil slice and an empty slice as JSON. Notice `null` vs `[]`.


## Take these home

1. **No empty ghosts** — every variable starts with a value.
2. **Types are rules** — they tell the compiler what you’re allowed to do.
3. **`const` is frozen at build time** — not a variable you promise not to change.
4. **`:=` for quick locals** · **`var` when you want the zero (or package scope).**
5. **Zero stops random bugs** — it does not stop “I used 0 to mean missing.”
6. **Design for the default** — make `var t T` safe when you can.


Picture a blank form that somehow still has random scribbles in the boxes. That’s uninitialized memory.

Go hands you a clean form every time — zeros filled in. Your job is simpler: write the real answers, and when “blank” and “missing” are different things, say so in the code.
