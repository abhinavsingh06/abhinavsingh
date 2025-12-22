"use client";

import { useEffect, useState } from "react";
import LikeButton from "./LikeButton";

interface StickyLikeButtonProps {
  postId: string;
}

export default function StickyLikeButton({ postId }: StickyLikeButtonProps) {
  const [rightOffset, setRightOffset] = useState(24); // Default px-6 (24px)
  const [topOffset, setTopOffset] = useState(120); // Default comfortable position
  const [showOnMobile, setShowOnMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const calculatePosition = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const navHeight = 80; // Approximate nav height + padding
      const mobileCheck = viewportWidth < 768; // md breakpoint

      setIsMobile(mobileCheck);

      // Find the content card element
      const contentCard = document.querySelector(".ocean-card");
      if (!contentCard) {
        // If no card found on mobile, set default position
        if (mobileCheck) {
          setRightOffset(12); // Smaller offset on mobile
          setTopOffset(viewportHeight - 80); // Bottom of screen
        }
        return;
      }

      const cardRect = contentCard.getBoundingClientRect();

      if (mobileCheck) {
        // On mobile, position at bottom-right corner, less intrusive
        setRightOffset(12); // Smaller offset from edge
        // Position at bottom of viewport, with some padding
        setTopOffset(viewportHeight - 80);

        // Show button only after user has scrolled down a bit (read some content)
        const scrollY = window.scrollY;
        const shouldShow = scrollY > 300; // Show after scrolling 300px
        setShowOnMobile(shouldShow);
        return;
      }

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

    // On mobile, also listen to scroll to show/hide button
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        const scrollY = window.scrollY;
        setShowOnMobile(scrollY > 300);
        // Recalculate position on scroll for mobile
        calculatePosition();
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Also calculate after a short delay to ensure content is rendered
    const timeout = setTimeout(calculatePosition, 100);

    return () => {
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const shouldShow = !isMobile || showOnMobile;

  if (!shouldShow) return null;

  return (
    <div
      className={`fixed z-40 md:z-50 transition-all duration-300 pointer-events-auto ${
        isMobile ? "animate-fade-in-up" : "animate-fade-in-up"
      }`}
      style={{
        right: `${rightOffset}px`,
        top: isMobile ? "auto" : `${topOffset}px`,
        bottom: isMobile ? "20px" : "auto",
      }}>
      <div
        className={`ocean-card rounded-lg md:rounded-xl lg:rounded-2xl shadow-xl md:shadow-2xl backdrop-blur-md bg-white/90 md:bg-white/95 dark:bg-blue-950/90 md:dark:bg-blue-950/95 border border-blue-300/40 md:border-2 md:border-blue-300/50 dark:border-blue-600/40 md:dark:border-blue-600/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:scale-105 pointer-events-auto ${
          isMobile ? "p-1.5" : "p-2 md:p-3"
        }`}>
        <div
          className={`flex flex-col items-center pointer-events-auto ${
            isMobile ? "gap-0.5" : "gap-1 md:gap-2"
          }`}>
          <LikeButton postId={postId} />
          <span
            className={`font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider opacity-80 hidden md:block ${
              isMobile ? "text-[7px]" : "text-[9px] lg:text-[10px]"
            }`}>
            Like
          </span>
        </div>
      </div>
    </div>
  );
}
