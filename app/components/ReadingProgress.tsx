"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [nearEnd, setNearEnd] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progressValue = (scrollTop / (documentHeight - windowHeight)) * 100;
      const clamped = Math.min(100, Math.max(0, progressValue));
      setProgress(clamped);
      setNearEnd(clamped >= 88);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none">
      <div
        className={`h-full bg-[var(--accent)] transition-[width,box-shadow] duration-100 ease-out ${
          nearEnd ? "shadow-[0_0_16px_var(--accent-glow)]" : "shadow-[0_0_12px_var(--accent-glow)]"
        }`}
        style={{ width: `${progress}%` }}
      />
      {nearEnd && (
        <div
          className="absolute top-0 -translate-y-1/2 transition-opacity duration-300"
          style={{ left: `calc(${progress}% - 6px)` }}
          aria-hidden>
          <svg
            className="h-3 w-3 text-[var(--accent)] animate-heart-beat drop-shadow-[0_0_6px_var(--accent-glow)]"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      )}
    </div>
  );
}
