"use client";

import { useEffect, useRef, useState } from "react";
import LikeButton, { LIKE_SYNC_EVENT, type LikeSyncDetail } from "./LikeButton";

interface ReadingEndReactionProps {
  postId: string;
  initialLikes?: number;
}

export default function ReadingEndReaction({
  postId,
  initialLikes = 0,
}: ReadingEndReactionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const onSync = (event: Event) => {
      const { detail } = event as CustomEvent<LikeSyncDetail>;
      if (detail.postId === postId) setLiked(detail.liked);
    };

    window.addEventListener(LIKE_SYNC_EVENT, onSync);
    return () => window.removeEventListener(LIKE_SYNC_EVENT, onSync);
  }, [postId]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`mt-16 rounded-2xl border pt-10 transition-all duration-700 ${
        inView
          ? "border-[var(--accent)] bg-[var(--accent-soft)] px-6 pb-8 sm:px-8"
          : "border-[var(--line)] px-0 pb-0"
      }`}>
      <div
        className={`flex flex-wrap items-center justify-between gap-4 transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-70"
        }`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <LikeButton
            postId={postId}
            initialLikes={initialLikes}
            highlighted={inView && !liked}
          />
          <div>
            <p
              className={`text-sm transition-colors duration-500 ${
                inView ? "text-[var(--fg)]" : "font-mono-xs text-[var(--muted)]"
              }`}>
              {liked
                ? "Thanks — that means a lot."
                : inView
                  ? "You scrolled all the way here. Save a ♥ if it was useful."
                  : "Thanks for reading."}
            </p>
            {inView && !liked && (
              <p className="font-mono-xs mt-1 text-[var(--muted)]">
                One tap. No account needed.
              </p>
            )}
          </div>
        </div>
        <a href="/blog" className="link-arrow font-mono-sm shrink-0">
          More writing <span className="arrow">→</span>
        </a>
      </div>
    </div>
  );
}
