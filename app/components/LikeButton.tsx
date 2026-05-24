"use client";

import { useState, useEffect } from "react";

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
  initialLiked?: boolean;
}

export default function LikeButton({
  postId,
  initialLikes = 0,
  initialLiked = false,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem(`like-${postId}`);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setLiked(data.liked || false);
          setLikes(data.likes || 0);
        } catch {}
      }
    }, 0);
  }, [postId]);

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const nextLiked = !liked;
    const nextLikes = liked ? Math.max(0, likes - 1) : likes + 1;

    setLiked(nextLiked);
    setLikes(nextLikes);

    if (nextLiked) {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }

    let userId = localStorage.getItem("user-id");
    if (!userId) {
      userId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem("user-id", userId);
    }

    const likeData = {
      liked: nextLiked,
      likes: nextLikes,
      userId,
      timestamp: Date.now(),
    };
    localStorage.setItem(`like-${postId}`, JSON.stringify(likeData));

    const allLikes = JSON.parse(localStorage.getItem("all-likes") || "{}");
    allLikes[postId] = likeData;
    localStorage.setItem("all-likes", JSON.stringify(allLikes));
  };

  return (
    <button
      onClick={handleLike}
      type="button"
      aria-label={liked ? "Unlike this post" : "Like this post"}
      className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
        liked
          ? "border-[var(--accent)] bg-[var(--accent)] text-black shadow-[0_0_20px_var(--accent-glow)]"
          : "border-[var(--line-strong)] bg-[var(--bg-elev)] text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
      } ${pulse ? "scale-105" : ""}`}>
      <svg
        className={`h-4 w-4 transition-transform ${pulse ? "scale-125" : ""}`}
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="font-mono-sm tabular-nums">{likes}</span>
    </button>
  );
}
