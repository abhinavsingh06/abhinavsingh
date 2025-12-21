"use client";

import { useEffect, useState } from "react";

interface ConfettiProps {
  trigger: boolean;
}

export default function Confetti({ trigger }: ConfettiProps) {
  const [confetti, setConfetti] = useState<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
    }>
  >([]);

  useEffect(() => {
    if (trigger) {
      const colors = [
        "#3b82f6",
        "#06b6d4",
        "#14b8a6",
        "#8b5cf6",
        "#ec4899",
        "#f59e0b",
      ];
      const newConfetti = Array.from({ length: 50 }, () => ({
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
      }));

      // Defer state update to avoid synchronous setState in effect
      setTimeout(() => {
        setConfetti(newConfetti);
      }, 0);

      const interval = setInterval(() => {
        setConfetti((prev) =>
          prev
            .map((c) => ({
              ...c,
              x: c.x + c.vx,
              y: c.y + c.vy,
              vy: c.vy + 0.1, // gravity
            }))
            .filter((c) => c.y < window.innerHeight + 100)
        );
      }, 16);

      setTimeout(() => {
        clearInterval(interval);
        setConfetti([]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [trigger]);

  if (confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {confetti.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${c.x}px`,
            top: `${c.y}px`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            backgroundColor: c.color,
            transform: `rotate(${c.x * 0.1}deg)`,
          }}
        />
      ))}
    </div>
  );
}
