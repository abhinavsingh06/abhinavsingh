"use client";

import { useEffect, useState } from "react";

export default function ReadingCelebration() {
  const [show, setShow] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;

      // Show celebration when 95% scrolled
      if (scrollPercentage >= 0.95 && !hasShown) {
        setShow(true);
        setHasShown(true);
        setTimeout(() => {
          setShow(false);
        }, 3000);
      }
    };

    window.addEventListener("scroll", checkScroll);
    checkScroll(); // Check on mount

    return () => window.removeEventListener("scroll", checkScroll);
  }, [hasShown]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
      <div className="animate-fade-in-up">
        <div className="ocean-card rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4">
          <div className="mb-4 text-6xl animate-float">🎉</div>
          <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
            <span className="text-gradient-animated">Congratulations!</span>
          </h3>
          <p className="text-blue-700 dark:text-blue-300">
            You've finished reading this post! Great job! 🐠
          </p>
        </div>
      </div>
    </div>
  );
}
