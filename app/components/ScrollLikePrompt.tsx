"use client";

import { useEffect, useState } from "react";
import LikeButton, { LIKE_SYNC_EVENT, type LikeSyncDetail } from "./LikeButton";

interface ScrollLikePromptProps {
  postId: string;
  initialLikes?: number;
}

function getScrollProgress(): number {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  if (documentHeight <= windowHeight) return 100;
  return Math.min(
    100,
    Math.max(0, (window.scrollY / (documentHeight - windowHeight)) * 100)
  );
}

export default function ScrollLikePrompt({
  postId,
  initialLikes = 0,
}: ScrollLikePromptProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const dismissedKey = `like-prompt-dismissed-${postId}`;
    if (sessionStorage.getItem(dismissedKey)) {
      setDismissed(true);
    }

    const onSync = (event: Event) => {
      const { detail } = event as CustomEvent<LikeSyncDetail>;
      if (detail.postId === postId && detail.liked) {
        setLiked(true);
        setVisible(false);
      }
    };

    window.addEventListener(LIKE_SYNC_EVENT, onSync);
    return () => window.removeEventListener(LIKE_SYNC_EVENT, onSync);
  }, [postId]);

  useEffect(() => {
    if (dismissed || liked) return;

    const onScroll = () => {
      const value = getScrollProgress();
      setProgress(value);
      if (value >= 82) setVisible(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed, liked]);

  const dismiss = () => {
    sessionStorage.setItem(`like-prompt-dismissed-${postId}`, "1");
    setDismissed(true);
    setVisible(false);
  };

  if (!visible || dismissed || liked) return null;

  const message =
    progress >= 95
      ? "You made it to the end — worth a ♥?"
      : "Almost done — tap ♥ if this helped";

  return (
    <div
      className="like-prompt-enter fixed bottom-5 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2"
      role="dialog"
      aria-label="Like this post">
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--line-strong)] bg-[var(--bg-elev)]/95 px-4 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--accent-soft)] bg-[var(--accent-soft)]"
          aria-hidden>
          <svg
            className="h-4 w-4 text-[var(--accent)] animate-heart-beat"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-mono-xs text-[var(--muted)]">
            {Math.round(progress)}% read
          </p>
          <p className="mt-0.5 text-sm leading-snug text-[var(--fg)]">
            {message}
          </p>
        </div>

        <LikeButton
          postId={postId}
          initialLikes={initialLikes}
          compact
          highlighted
          onLiked={() => setVisible(false)}
        />

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded-full p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--bg-elev-2)] hover:text-[var(--fg)]">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
