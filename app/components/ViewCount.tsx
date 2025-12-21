"use client";

import { useEffect, useState } from "react";

interface ViewCountProps {
  postId: string;
}

export default function ViewCount({ postId }: ViewCountProps) {
  const [views, setViews] = useState(0);

  useEffect(() => {
    // Load views from localStorage
    const stored = localStorage.getItem(`views-${postId}`);
    if (stored) {
      setViews(parseInt(stored, 10));
    } else {
      // Initialize with random views for demo (in production, fetch from API)
      const initialViews = Math.floor(Math.random() * 500) + 100;
      setViews(initialViews);
      localStorage.setItem(`views-${postId}`, initialViews.toString());
    }

    // Increment view count (only once per session)
    const sessionKey = `viewed-${postId}-${new Date().toDateString()}`;
    if (!sessionStorage.getItem(sessionKey)) {
      setViews((prev) => {
        const newViews = prev + 1;
        localStorage.setItem(`views-${postId}`, newViews.toString());
        sessionStorage.setItem(sessionKey, "true");
        return newViews;
      });
    }
  }, [postId]);

  return (
    <div className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400">
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <span className="font-medium">{views.toLocaleString()}</span>
    </div>
  );
}
