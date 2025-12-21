"use client";

import { useEffect, useState, useRef } from "react";

export default function FishCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [fishRotation, setFishRotation] = useState({
    horizontal: 0,
    vertical: 0,
  });
  const [tailAnimation, setTailAnimation] = useState(0);
  const animationRef = useRef<number>();
  const smoothRotationRef = useRef({ horizontal: 0, vertical: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number;

    const updatePosition = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;

      // Calculate velocity with smoothing
      const deltaX = newX - lastPositionRef.current.x;
      const deltaY = newY - lastPositionRef.current.y;

      // Smooth velocity calculation
      velocityRef.current.x = velocityRef.current.x * 0.7 + deltaX * 0.3;
      velocityRef.current.y = velocityRef.current.y * 0.7 + deltaY * 0.3;

      // Update position immediately
      setPosition({ x: newX, y: newY });
      lastPositionRef.current = { x: newX, y: newY };
    };

    // Smooth rotation update using requestAnimationFrame
    const updateRotation = () => {
      const velocity = velocityRef.current;
      const speed = Math.sqrt(
        velocity.x * velocity.x + velocity.y * velocity.y
      );

      // Only update if there's meaningful movement (threshold to prevent flicker)
      if (speed > 1) {
        // Calculate horizontal direction (left/right) with threshold
        let targetHorizontal = smoothRotationRef.current.horizontal;
        if (velocity.x > 1.5) {
          targetHorizontal = 0; // Facing right
        } else if (velocity.x < -1.5) {
          targetHorizontal = 180; // Facing left
        }

        // Smooth horizontal transition
        smoothRotationRef.current.horizontal =
          smoothRotationRef.current.horizontal * 0.8 + targetHorizontal * 0.2;

        // Calculate vertical rotation based on velocity
        const angle =
          Math.atan2(velocity.y, Math.abs(velocity.x)) * (180 / Math.PI);
        const targetVertical = Math.max(-25, Math.min(25, angle * 0.5));

        // Smooth vertical transition with lerp
        smoothRotationRef.current.vertical =
          smoothRotationRef.current.vertical * 0.85 + targetVertical * 0.15;
      } else {
        // Gradually return to neutral when not moving
        smoothRotationRef.current.vertical *= 0.9;
      }

      setFishRotation({
        horizontal: Math.round(smoothRotationRef.current.horizontal),
        vertical: smoothRotationRef.current.vertical,
      });

      rafId = requestAnimationFrame(updateRotation);
    };

    updateRotation();

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add hover detection for interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, [role='button'], .code-block-wrapper"
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    window.addEventListener("mousemove", updatePosition);

    // Animate tail
    const animateTail = () => {
      setTailAnimation((prev) => (prev + 0.1) % (Math.PI * 2));
      animationRef.current = requestAnimationFrame(animateTail);
    };
    animateTail();

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const tailOffset = Math.sin(tailAnimation) * 3;
  const finOffset = Math.sin(tailAnimation * 1.5) * 2;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) scaleX(${
          fishRotation.horizontal === 180 ? -1 : 1
        }) rotate(${fishRotation.vertical}deg)`,
        transition: "transform 0.15s ease-out",
      }}>
      <svg
        width={isHovering ? "96" : "80"}
        height={isHovering ? "64" : "56"}
        viewBox="0 0 32 32"
        className="transition-all duration-300"
        style={{
          filter: "drop-shadow(0 2px 6px rgba(59, 130, 246, 0.4))",
        }}>
        {/* Fish tail - animated */}
        <path
          d={`M 6 16 Q ${2 - tailOffset} ${12 - tailOffset} ${
            2 - tailOffset
          } 16 Q ${2 - tailOffset} ${20 + tailOffset} 6 16`}
          fill="url(#fishGradient)"
          style={{
            transition: "d 0.1s ease-out",
          }}
        />

        {/* Fish body */}
        <ellipse cx="16" cy="16" rx="10" ry="6" fill="url(#fishGradient)" />

        {/* Fish eye */}
        <circle cx="20" cy="14" r="2.5" fill="#1e3a8a" />
        <circle cx="21" cy="13.5" r="1" fill="white" />
        <circle cx="21.2" cy="13.3" r="0.5" fill="#1e3a8a" />

        {/* Fish fin (top) - animated */}
        <path
          d={`M 12 ${10 - finOffset} Q 10 ${8 - finOffset} 12 ${
            6 - finOffset
          } Q 14 ${8 - finOffset} 12 ${10 - finOffset}`}
          fill="url(#fishGradient)"
          opacity="0.8"
          style={{
            transition: "d 0.1s ease-out",
          }}
        />

        {/* Fish fin (bottom) - animated */}
        <path
          d={`M 12 ${22 + finOffset} Q 10 ${24 + finOffset} 12 ${
            26 + finOffset
          } Q 14 ${24 + finOffset} 12 ${22 + finOffset}`}
          fill="url(#fishGradient)"
          opacity="0.8"
          style={{
            transition: "d 0.1s ease-out",
          }}
        />

        {/* Fish scales pattern */}
        <ellipse
          cx="14"
          cy="16"
          rx="3"
          ry="2"
          fill="url(#scaleGradient)"
          opacity="0.3"
        />

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="fishGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient
            id="scaleGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {/* Swimming trail bubbles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/50"
            style={{
              width: `${3 - i * 0.5}px`,
              height: `${3 - i * 0.5}px`,
              left: `${-12 - i * 4}px`,
              top: `${Math.sin(i * 0.8) * 5}px`,
              animation: `bubble-rise ${1.5 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
