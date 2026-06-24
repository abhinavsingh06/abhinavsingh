"use client";

import { useEffect, useState } from "react";
import { dispatchLikeSync, LIKE_SYNC_EVENT, type LikeSyncDetail } from "./LikeButton";

interface HeartLikeProps {
  postId: string;
  initialLikes?: number;
  className?: string;
  variant?: "inline" | "dock";
}

function getUserId(): string {
  let userId = localStorage.getItem("user-id");
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem("user-id", userId);
  }
  return userId;
}

export default function HeartLike({
  postId,
  initialLikes = 0,
  className = "",
  variant = "inline",
}: HeartLikeProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joyful, setJoyful] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadLikes() {
      try {
        const userId = getUserId();
        const res = await fetch(
          `/api/likes/${encodeURIComponent(postId)}?userId=${encodeURIComponent(userId)}`
        );
        if (res.ok) {
          const data = (await res.json()) as { likes: number; liked: boolean };
          if (!cancelled) {
            setLikes(data.likes);
            setLiked(data.liked);
            dispatchLikeSync({ postId, likes: data.likes, liked: data.liked });
          }
        }
      } catch {
        // keep initial
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLikes();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  useEffect(() => {
    const handler = (event: Event) => {
      const { detail } = event as CustomEvent<LikeSyncDetail>;
      if (detail.postId === postId) {
        setLikes(detail.likes);
        setLiked(detail.liked);
      }
    };

    window.addEventListener(LIKE_SYNC_EVENT, handler);
    return () => window.removeEventListener(LIKE_SYNC_EVENT, handler);
  }, [postId]);

  const playJoy = () => {
    setJoyful(false);
    requestAnimationFrame(() => {
      setJoyful(true);
      setTimeout(() => setJoyful(false), 520);
    });
  };

  const handleClick = async () => {
    if (loading) return;

    const prevLiked = liked;
    const prevLikes = likes;
    const nextLiked = !liked;
    const nextLikes = liked ? Math.max(0, likes - 1) : likes + 1;

    setLiked(nextLiked);
    setLikes(nextLikes);
    playJoy();

    try {
      const userId = getUserId();
      const res = await fetch(`/api/likes/${encodeURIComponent(postId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        const data = (await res.json()) as { likes: number; liked: boolean };
        setLikes(data.likes);
        setLiked(data.liked);
        dispatchLikeSync({ postId, likes: data.likes, liked: data.liked });
      } else {
        setLiked(prevLiked);
        setLikes(prevLikes);
      }
    } catch {
      setLiked(prevLiked);
      setLikes(prevLikes);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={
        liked
          ? `You liked this post. ${likes} likes. Click to unlike.`
          : `Like this post. ${likes} likes.`
      }
      className={`heart-like heart-like--${variant} ${liked ? "heart-like--active" : ""} ${
        joyful ? "heart-like--joy" : ""
      } ${className}`}>
      <svg
        className="heart-like-icon"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        aria-hidden>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span className="heart-like-meta">
        <span className="heart-like-count tabular-nums">{likes.toLocaleString()}</span>
      </span>
    </button>
  );
}
