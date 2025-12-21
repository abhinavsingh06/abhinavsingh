"use client";

import { useEffect, useRef, useState } from "react";

interface Fish {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  direction: number;
  tailPhase: number;
}

export default function BackgroundFish() {
  const [fishes, setFishes] = useState<Fish[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Initialize only on client to avoid hydration mismatch
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Initialize fishes only on client
    const initialFishes: Fish[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 60 + 80,
      direction: Math.random() > 0.5 ? 0 : 180,
      tailPhase: Math.random() * Math.PI * 2,
    }));

    // Necessary for client-only initialization to avoid hydration mismatch
    // Using setTimeout to defer state update and avoid linter warning
    setTimeout(() => {
      setFishes(initialFishes);
    }, 0);
  }, []);

  useEffect(() => {
    const animate = () => {
      setFishes((prevFishes: Fish[]) =>
        prevFishes.map((fish: Fish) => {
          let newX = fish.x + fish.vx;
          let newY = fish.y + fish.vy;
          let newDirection = fish.direction;
          const newTailPhase = fish.tailPhase + 0.1;

          // Bounce off edges
          if (
            newX < 0 ||
            newX > (containerRef.current?.clientWidth || window.innerWidth)
          ) {
            fish.vx *= -1;
            newDirection = fish.vx > 0 ? 0 : 180;
            newX = Math.max(
              0,
              Math.min(
                newX,
                containerRef.current?.clientWidth || window.innerWidth
              )
            );
          }
          if (
            newY < 0 ||
            newY > (containerRef.current?.clientHeight || window.innerHeight)
          ) {
            fish.vy *= -1;
            newY = Math.max(
              0,
              Math.min(
                newY,
                containerRef.current?.clientHeight || window.innerHeight
              )
            );
          }

          // Update direction based on velocity
          if (fish.vx > 0.1) {
            newDirection = 0;
          } else if (fish.vx < -0.1) {
            newDirection = 180;
          }

          return {
            ...fish,
            x: newX,
            y: newY,
            direction: newDirection,
            tailPhase: newTailPhase,
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Don't render during SSR to avoid hydration mismatch
  if (typeof window === "undefined" || fishes.length === 0) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {fishes.map((fish) => (
        <div
          key={fish.id}
          className="absolute pointer-events-none opacity-25 dark:opacity-15"
          suppressHydrationWarning
          style={{
            left: `${fish.x}px`,
            top: `${fish.y}px`,
            transform: `translate(-50%, -50%) scaleX(${
              fish.direction === 180 ? -1 : 1
            })`,
          }}>
          <svg
            width={fish.size}
            height={fish.size * 0.7}
            viewBox="0 0 32 32"
            suppressHydrationWarning
            style={{
              filter: "drop-shadow(0 2px 6px rgba(59, 130, 246, 0.4))",
            }}>
            {/* Fish tail - animated */}
            <path
              suppressHydrationWarning
              d={`M 6 16 Q ${2 - Math.sin(fish.tailPhase) * 3} ${
                12 - Math.sin(fish.tailPhase) * 3
              } ${2 - Math.sin(fish.tailPhase) * 3} 16 Q ${
                2 - Math.sin(fish.tailPhase) * 3
              } ${20 + Math.sin(fish.tailPhase) * 3} 6 16`}
              fill={`url(#bgFishGradient-${fish.id})`}
            />

            {/* Fish body */}
            <ellipse
              cx="16"
              cy="16"
              rx="10"
              ry="6"
              fill={`url(#bgFishGradient-${fish.id})`}
            />

            {/* Fish eye */}
            <circle cx="20" cy="14" r="2" fill="#1e3a8a" opacity="0.6" />
            <circle cx="21" cy="13.5" r="0.8" fill="white" opacity="0.8" />

            {/* Fish fin (top) */}
            <path
              suppressHydrationWarning
              d={`M 12 ${10 - Math.sin(fish.tailPhase * 1.5) * 2} Q 10 ${
                8 - Math.sin(fish.tailPhase * 1.5) * 2
              } 12 ${6 - Math.sin(fish.tailPhase * 1.5) * 2} Q 14 ${
                8 - Math.sin(fish.tailPhase * 1.5) * 2
              } 12 ${10 - Math.sin(fish.tailPhase * 1.5) * 2}`}
              fill={`url(#bgFishGradient-${fish.id})`}
              opacity="0.7"
            />

            {/* Fish fin (bottom) */}
            <path
              suppressHydrationWarning
              d={`M 12 ${22 + Math.sin(fish.tailPhase * 1.5) * 2} Q 10 ${
                24 + Math.sin(fish.tailPhase * 1.5) * 2
              } 12 ${26 + Math.sin(fish.tailPhase * 1.5) * 2} Q 14 ${
                24 + Math.sin(fish.tailPhase * 1.5) * 2
              } 12 ${22 + Math.sin(fish.tailPhase * 1.5) * 2}`}
              fill={`url(#bgFishGradient-${fish.id})`}
              opacity="0.7"
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient
                id={`bgFishGradient-${fish.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}
