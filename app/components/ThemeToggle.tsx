"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch - this is a necessary pattern for theme toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Show placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className="h-10 w-10 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        suppressHydrationWarning
      />
    );
  }

  // Determine if dark mode is active
  // Use resolvedTheme if available, otherwise check the HTML element
  const isDark =
    resolvedTheme === "dark" ||
    (typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    // Always set explicit theme (not system) when toggling
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);

    // Force apply the class immediately as a fallback
    // This ensures the class is applied even if next-themes has a delay
    if (typeof window !== "undefined") {
      const html = document.documentElement;
      if (newTheme === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-600 dark:hover:bg-slate-800"
      aria-label="Toggle theme">
      {/* Sun Icon */}
      <svg
        className={`absolute h-5 w-5 text-yellow-500 transition-all duration-500 ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Moon Icon */}
      <svg
        className={`absolute h-5 w-5 text-blue-400 transition-all duration-500 ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>

      {/* Animated background circle */}
      <span
        className={`absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400/20 to-blue-400/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
          isDark ? "from-blue-400/20 to-purple-400/20" : ""
        }`}
      />
    </button>
  );
}
