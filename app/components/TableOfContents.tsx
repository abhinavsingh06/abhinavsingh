"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-100px 0px -66%" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <aside className="sticky top-32 hidden lg:block">
      <p className="font-mono-xs mb-4 text-[var(--muted)]">/ On this page</p>
      <nav className="space-y-1 border-l border-[var(--line)] pl-4">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const indent =
            heading.level === 1
              ? "pl-0"
              : heading.level === 2
              ? "pl-3"
              : "pl-6";
          return (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`group flex w-full items-start gap-2 text-left text-[13px] leading-snug transition-colors ${indent} ${
                isActive
                  ? "text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--fg)]"
              }`}>
              {isActive && (
                <span className="mt-1 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent-glow)]" />
              )}
              <span>{heading.text}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
