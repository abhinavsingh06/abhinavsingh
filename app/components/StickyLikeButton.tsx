"use client";

import { useEffect, useState } from "react";
import LikeButton from "./LikeButton";

interface StickyLikeButtonProps {
  postId: string;
}

export default function StickyLikeButton({ postId }: StickyLikeButtonProps) {
  const [rightOffset, setRightOffset] = useState(24); // Default px-6 (24px)
  const [topOffset, setTopOffset] = useState(120); // Default comfortable position

  useEffect(() => {
    const calculatePosition = () => {
      // Find the content card element
      const contentCard = document.querySelector(".ocean-card");
      if (!contentCard) return;

      const cardRect = contentCard.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const navHeight = 80; // Approximate nav height + padding

      // Calculate distance from right edge of viewport to right edge of card
      const distanceFromRight = viewportWidth - cardRect.right;

      // Set offset to align with card, with some padding
      setRightOffset(Math.max(24, distanceFromRight + 16)); // 16px padding from card edge

      // Align vertically with the header area (title/excerpt region)
      // Position it to align with the title area where fish cursor typically appears
      // This creates visual alignment between fish cursor and like button
      const headerElement = contentCard.querySelector("header");
      if (headerElement) {
        const headerRect = headerElement.getBoundingClientRect();
        // Position button to align with middle of header (where title is)
        setTopOffset(headerRect.top + headerRect.height * 0.3); // Align with top 30% of header (title area)
      } else {
        // Fallback: position below nav at comfortable height
        setTopOffset(navHeight + 100);
      }
    };

    // Calculate on mount and resize
    calculatePosition();
    window.addEventListener("resize", calculatePosition);

    // Also calculate after a short delay to ensure content is rendered
    const timeout = setTimeout(calculatePosition, 100);

    return () => {
      window.removeEventListener("resize", calculatePosition);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className="fixed z-50 animate-fade-in-up transition-all duration-300 pointer-events-auto"
      style={{
        right: `${rightOffset}px`,
        top: `${topOffset}px`,
      }}>
      <div className="ocean-card rounded-2xl p-3 shadow-2xl backdrop-blur-md bg-white/95 dark:bg-blue-950/95 border-2 border-blue-300/50 dark:border-blue-600/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:scale-105 pointer-events-auto">
        <div className="flex flex-col items-center gap-2 pointer-events-auto">
          <LikeButton postId={postId} />
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider opacity-80">
            Like
          </span>
        </div>
      </div>
    </div>
  );
}
