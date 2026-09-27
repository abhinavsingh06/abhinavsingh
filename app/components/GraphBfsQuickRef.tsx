"use client";

const STEPS = [
  {
    q: "Do you need the fewest edges (or steps on a grid)?",
    a: "BFS. Mark visited when you enqueue, not when you dequeue.",
  },
  {
    q: "Are edge weights all 1 (or absent)?",
    a: "Plain BFS. If weights differ and stay positive, use Dijkstra — BFS will lie.",
  },
  {
    q: "Many sources at distance 0?",
    a: "Put every source in the queue before the loop. That is multi-source BFS.",
  },
  {
    q: "Only exploring reachability or a cycle?",
    a: "DFS is enough. Save BFS for distance.",
  },
];

export default function GraphBfsQuickRef() {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Pattern picker</p>
      </div>
      <ol className="divide-y divide-[var(--line)]">
        {STEPS.map((s, i) => (
          <li key={s.q} className="px-4 py-4 sm:px-6">
            <p className="font-mono-xs text-[var(--accent)]">{i + 1}</p>
            <p className="mt-1 text-[15px] text-[var(--fg)]">{s.q}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--fg-2)]">{s.a}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
