"use client";

import { useState } from "react";

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
  // Lazy initialization from localStorage
  const getInitialState = () => {
    if (typeof window === "undefined") {
      return { liked: initialLiked, likes: initialLikes };
    }
    const stored = localStorage.getItem(`like-${postId}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        return { liked: data.liked || false, likes: data.likes || 0 };
      } catch {
        return { liked: initialLiked, likes: initialLikes };
      }
    }
    return { liked: initialLiked, likes: initialLikes };
  };

  const initialState = getInitialState();
  const [liked, setLiked] = useState(initialState.liked);
  const [likes, setLikes] = useState(initialState.likes);
  const [animating, setAnimating] = useState(false);

  const handleLike = () => {
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

    // Save to localStorage
    localStorage.setItem(
      `like-${postId}`,
      JSON.stringify({ liked: !liked, likes: liked ? likes - 1 : likes + 1 })
    );
  };

  return (
    <button
      onClick={handleLike}
      className={`group inline-flex items-center gap-2 rounded-full px-5 py-3 transition-all duration-300 cursor-pointer ${
        liked
          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/40 scale-105"
          : "bg-gradient-to-r from-blue-400 to-cyan-400 text-white hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-blue-400/30 hover:shadow-lg hover:shadow-blue-500/40"
      } ${animating ? "scale-110" : "hover:scale-110 active:scale-95"}`}>
      <svg
        className={`h-6 w-6 transition-all duration-300 ${
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
      <span className="font-bold text-base">{likes}</span>
    </button>
  );
}
