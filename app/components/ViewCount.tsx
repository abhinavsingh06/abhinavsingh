"use client";

import { useEffect, useState } from "react";

interface ViewCountProps {
  postId: string;
}

export default function ViewCount({ postId }: ViewCountProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem(`views-${postId}`);
      let current: number;
      if (stored) {
        current = parseInt(stored, 10);
      } else {
        current = Math.floor(Math.random() * 500) + 100;
        localStorage.setItem(`views-${postId}`, current.toString());
      }

      const sessionKey = `viewed-${postId}-${new Date().toDateString()}`;
      if (!sessionStorage.getItem(sessionKey)) {
        current += 1;
        localStorage.setItem(`views-${postId}`, current.toString());
        sessionStorage.setItem(sessionKey, "true");
      }

      setViews(current);
    }, 0);
  }, [postId]);

  return (
    <span className="font-mono-xs inline-flex items-center gap-1.5 tabular-nums text-[var(--muted)]">
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8">
        <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {views === null ? "—" : views.toLocaleString()}
    </span>
  );
}
