"use client";

import { useEffect, useState } from "react";

interface ViewCountProps {
  postId: string;
  initialViews?: number;
  trackView?: boolean;
  className?: string;
}

export default function ViewCount({
  postId,
  initialViews = 0,
  trackView = false,
  className,
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
    <span className={className ?? "tabular-nums text-inherit"}>
      {views === null ? "—" : views.toLocaleString()}
    </span>
  );
}
