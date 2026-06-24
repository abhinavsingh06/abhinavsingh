"use client";

import { useEffect, useState } from "react";

interface ViewCountProps {
  postId: string;
  initialViews?: number;
  trackView?: boolean;
}

export default function ViewCount({
  postId,
  initialViews = 0,
  trackView = false,
}: ViewCountProps) {
  const [views, setViews] = useState<number | null>(initialViews);

  useEffect(() => {
    let cancelled = false;

    async function loadViews() {
      try {
        const sessionKey = `viewed-${postId}-${new Date().toDateString()}`;
        const alreadyViewed = sessionStorage.getItem(sessionKey);

        if (trackView && !alreadyViewed) {
          const res = await fetch(`/api/views/${encodeURIComponent(postId)}`, {
            method: "POST",
          });
          if (res.ok) {
            const data = (await res.json()) as { views: number };
            if (!cancelled) setViews(data.views);
            sessionStorage.setItem(sessionKey, "true");
            return;
          }
        }

        const res = await fetch(`/api/views/${encodeURIComponent(postId)}`);
        if (res.ok) {
          const data = (await res.json()) as { views: number };
          if (!cancelled) setViews(data.views);
        }
      } catch {
        if (!cancelled) setViews(initialViews);
      }
    }

    loadViews();
    return () => {
      cancelled = true;
    };
  }, [postId, trackView, initialViews]);

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
