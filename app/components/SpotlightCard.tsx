"use client";

import { useRef, ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "a" | "article" | "section";
  href?: string;
}

export default function SpotlightCard({
  children,
  className = "",
  as = "div",
  href,
}: SpotlightCardProps) {
  const ref = useRef<HTMLElement | null>(null);

  const handleMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  };

  const cls = `card spotlight card-draw ${className}`;

  if (as === "a" && href) {
    return (
      <a
        href={href}
        ref={(node) => {
          ref.current = node;
        }}
        onPointerMove={handleMove}
        className={cls}>
        {children}
      </a>
    );
  }

  if (as === "article") {
    return (
      <article
        ref={(node) => {
          ref.current = node;
        }}
        onPointerMove={handleMove}
        className={cls}>
        {children}
      </article>
    );
  }

  if (as === "section") {
    return (
      <section
        ref={(node) => {
          ref.current = node;
        }}
        onPointerMove={handleMove}
        className={cls}>
        {children}
      </section>
    );
  }

  return (
    <div
      ref={(node) => {
        ref.current = node;
      }}
      onPointerMove={handleMove}
      className={cls}>
      {children}
    </div>
  );
}
