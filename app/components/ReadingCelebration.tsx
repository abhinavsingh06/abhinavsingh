"use client";

import { useEffect, useState } from "react";

export default function ReadingCelebration() {
  const [show, setShow] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [bubbles, setBubbles] = useState<
    Array<{
      id: number;
      size: number;
      left: number;
      top: number;
      delay: number;
      duration: number;
    }>
  >([]);

  useEffect(() => {
    const checkScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;

      // Show celebration when 95% scrolled
      if (scrollPercentage >= 0.95 && !hasShown) {
        // Generate fewer, larger bubbles for smooth, elegant effect
        const newBubbles = Array.from({ length: 20 }, (_, i) => ({
          id: i,
          size: Math.random() * 40 + 30,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 0.5,
          duration: Math.random() * 1 + 3,
        }));
        setBubbles(newBubbles);
        setShow(true);
        setHasShown(true);
        // Vanish after 5 seconds for smooth, gradual fade
        setTimeout(() => {
          setShow(false);
          setBubbles([]);
        }, 5000);
      }
    };

    window.addEventListener("scroll", checkScroll);
    checkScroll(); // Check on mount

    return () => window.removeEventListener("scroll", checkScroll);
  }, [hasShown]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {/* Full-page animated bubbles burst */}
      <div className="absolute inset-0">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full border-2 border-blue-300/50 dark:border-blue-500/50"
            style={{
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animation: `bubble-burst ${bubble.duration}s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
              animationDelay: `${bubble.delay}s`,
              background:
                "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.15))",
              boxShadow: "0 0 10px rgba(59, 130, 246, 0.15)",
            }}
          />
        ))}
      </div>

      {/* Subtle wave formations */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none">
          <path
            d="M0,300 Q300,250 600,300 T1200,300 L1200,600 L0,600 Z"
            fill="rgba(59, 130, 246, 0.15)"
            className="animate-wave-burst"
          />
          <path
            d="M0,400 Q300,350 600,400 T1200,400 L1200,600 L0,600 Z"
            fill="rgba(6, 182, 212, 0.12)"
            className="animate-wave-burst"
            style={{ animationDelay: "0.5s" }}
          />
          <path
            d="M0,500 Q300,450 600,500 T1200,500 L1200,600 L0,600 Z"
            fill="rgba(20, 184, 166, 0.1)"
            className="animate-wave-burst"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>
    </div>
  );
}
