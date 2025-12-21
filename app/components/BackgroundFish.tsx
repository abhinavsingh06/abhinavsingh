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
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize fishes
    const initialFishes: Fish[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x:
        Math.random() *
        (typeof window !== "undefined" ? window.innerWidth : 1200),
      y:
        Math.random() *
        (typeof window !== "undefined" ? window.innerHeight : 800),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 60 + 80,
      direction: Math.random() > 0.5 ? 0 : 180,
      tailPhase: Math.random() * Math.PI * 2,
    }));

    setFishes(initialFishes);

    const animate = () => {
      setFishes((prevFishes) =>
        prevFishes.map((fish) => {
          let newX = fish.x + fish.vx;
          let newY = fish.y + fish.vy;
          let newDirection = fish.direction;
          let newTailPhase = fish.tailPhase + 0.1;

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

  const renderFish = (fish: Fish) => {
    const tailOffset = Math.sin(fish.tailPhase) * 3;
    const finOffset = Math.sin(fish.tailPhase * 1.5) * 2;

    return (
      <div
        key={fish.id}
        className="absolute pointer-events-none opacity-30 dark:opacity-20"
        style={{
          left: `${fish.x}px`,
          top: `${fish.y}px`,
          transform: `translate(-50%, -50%) scaleX(${
            fish.direction === 180 ? -1 : 1
          })`,
          transition: "opacity 0.3s ease",
        }}>
        <svg
          width={fish.size}
          height={fish.size * 0.7}
          viewBox="0 0 32 32"
          style={{
            filter: "drop-shadow(0 1px 2px rgba(59, 130, 246, 0.2))",
          }}>
          {/* Fish tail - animated */}
          <path
            d={`M 6 16 Q ${2 - tailOffset} ${12 - tailOffset} ${
              2 - tailOffset
            } 16 Q ${2 - tailOffset} ${20 + tailOffset} 6 16`}
            fill="url(#bgFishGradient)"
          />

          {/* Fish body */}
          <ellipse cx="16" cy="16" rx="10" ry="6" fill="url(#bgFishGradient)" />

          {/* Fish eye */}
          <circle cx="20" cy="14" r="2" fill="#1e3a8a" opacity="0.6" />
          <circle cx="21" cy="13.5" r="0.8" fill="white" opacity="0.8" />

          {/* Fish fin (top) */}
          <path
            d={`M 12 ${10 - finOffset} Q 10 ${8 - finOffset} 12 ${
              6 - finOffset
            } Q 14 ${8 - finOffset} 12 ${10 - finOffset}`}
            fill="url(#bgFishGradient)"
            opacity="0.7"
          />

          {/* Fish fin (bottom) */}
          <path
            d={`M 12 ${22 + finOffset} Q 10 ${24 + finOffset} 12 ${
              26 + finOffset
            } Q 14 ${24 + finOffset} 12 ${22 + finOffset}`}
            fill="url(#bgFishGradient)"
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
    );
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {fishes.map((fish) => (
        <div
          key={fish.id}
          className="absolute pointer-events-none opacity-25 dark:opacity-15"
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
            style={{
              filter: "drop-shadow(0 1px 2px rgba(59, 130, 246, 0.2))",
            }}>
            {/* Fish tail - animated */}
            <path
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
