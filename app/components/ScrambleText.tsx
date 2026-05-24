"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyz0123456789";

interface ScrambleTextProps {
  text: string;
  className?: string;
  trigger?: "hover" | "mount";
}

export default function ScrambleText({
  text,
  className = "",
  trigger = "mount",
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number | null>(null);
  const frameRef = useRef(0);
  const queue = useRef<
    Array<{ from: string; to: string; start: number; end: number; char?: string }>
  >([]);

  const scramble = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const oldText = display;
    const newText = text;
    const length = Math.max(oldText.length, newText.length);
    const q: typeof queue.current = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 30);
      const end = start + Math.floor(Math.random() * 30) + 15;
      q.push({ from, to, start, end });
    }
    queue.current = q;
    frameRef.current = 0;
    update();
  };

  const update = () => {
    let output = "";
    let complete = 0;
    const q = queue.current;
    for (let i = 0; i < q.length; i++) {
      const { from, to, start, end } = q[i];
      let char = q[i].char;
      if (frameRef.current >= end) {
        complete++;
        output += to;
      } else if (frameRef.current >= start) {
        if (!char || Math.random() < 0.28) {
          char = CHARS[Math.floor(Math.random() * CHARS.length)];
          q[i].char = char;
        }
        output += `<span style="color: var(--accent); opacity: 0.85;">${char}</span>`;
      } else {
        output += from;
      }
    }
    setDisplay(output);
    if (complete < q.length) {
      frameRef.current++;
      rafRef.current = requestAnimationFrame(update);
    }
  };

  useEffect(() => {
    if (trigger === "mount") {
      const t = setTimeout(scramble, 200);
      return () => {
        clearTimeout(t);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span
      className={className}
      onMouseEnter={trigger === "hover" ? scramble : undefined}
      dangerouslySetInnerHTML={{ __html: display }}
    />
  );
}
