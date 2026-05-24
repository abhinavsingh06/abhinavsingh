"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-8 w-14 rounded-full border border-[var(--line-strong)]"
        suppressHydrationWarning
      />
    );
  }

  const isDark = resolvedTheme !== "light";

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="group relative h-8 w-14 rounded-full border border-[var(--line-strong)] bg-[var(--bg-elev)] transition-colors hover:border-[var(--accent)]">
      <span
        className={`absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[var(--accent)] transition-all duration-500 shadow-[0_0_12px_var(--accent-glow)] ${
          isDark ? "left-[3px]" : "left-[27px]"
        }`}
      />
      <span className="font-mono-xs absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted)]">
        {isDark ? "" : "☀"}
      </span>
      <span className="font-mono-xs absolute left-2 top-1/2 -translate-y-1/2 text-[var(--muted)]">
        {isDark ? "☾" : ""}
      </span>
    </button>
  );
}
