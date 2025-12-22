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
  // Start with default values to avoid hydration mismatch
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [animating, setAnimating] = useState(false);

  // Load from localStorage only on client after hydration
  useEffect(() => {
    // Defer to next tick to avoid hydration mismatch
    setTimeout(() => {
      const stored = localStorage.getItem(`like-${postId}`);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setLiked(data.liked || false);
          setLikes(data.likes || 0);
        } catch {
          // Keep default values if parsing fails
        }
      }
    }, 0);
  }, [postId]);

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (liked) {
      // Unlike
      setLikes((prev: number) => Math.max(0, prev - 1));
      setLiked(false);
    } else {
      // Like
      setLikes((prev: number) => prev + 1);
      setLiked(true);
      setAnimating(true);
      setTimeout(() => setAnimating(false), 600);
    }

    // Save to localStorage with unique user identifier
    // Generate a unique user ID if it doesn't exist
    let userId = localStorage.getItem("user-id");
    if (!userId) {
      userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("user-id", userId);
    }

    // Store like data with user ID to ensure uniqueness
    const likeData = {
      liked: !liked,
      likes: liked ? likes - 1 : likes + 1,
      userId: userId,
      timestamp: Date.now(),
    };

    localStorage.setItem(`like-${postId}`, JSON.stringify(likeData));

    // Also store in a global likes object to track all user likes
    const allLikes = JSON.parse(localStorage.getItem("all-likes") || "{}");
    allLikes[postId] = likeData;
    localStorage.setItem("all-likes", JSON.stringify(allLikes));
  };

  return (
    <button
      onClick={handleLike}
      type="button"
      className={`group inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 rounded-full px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-5 md:py-3 transition-all duration-300 cursor-pointer pointer-events-auto relative z-[100] touch-manipulation ${
        liked
          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/40 scale-105"
          : "bg-gradient-to-r from-blue-400 to-cyan-400 text-white hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-blue-400/30 hover:shadow-lg hover:shadow-blue-500/40"
      } ${animating ? "scale-110" : "hover:scale-110 active:scale-95"}`}
      aria-label={liked ? "Unlike this post" : "Like this post"}>
      <svg
        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-6 md:w-6 transition-all duration-300 flex-shrink-0 ${
          animating ? "animate-bounce" : ""
        } ${liked ? "fill-current" : ""}`}
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2.5}
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">
        {likes}
      </span>
    </button>
  );
}
