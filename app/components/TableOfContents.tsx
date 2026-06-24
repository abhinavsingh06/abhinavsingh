"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  variant?: "sidebar" | "embedded";
}

export default function TableOfContents({
  headings,
  variant = "sidebar",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-96px 0px -60%" }
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
      const offset = 96;
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (headings.length === 0) return null;

  const isSidebar = variant === "sidebar";

  return (
    <nav className={isSidebar ? "blog-toc-sidebar" : ""}>
      <p
        className={`font-mono-xs text-[var(--muted)] ${
          isSidebar ? "mb-5 text-[11px] uppercase tracking-[0.14em]" : "mb-3"
        }`}>
        {isSidebar ? "On this page" : "/ Contents"}
      </p>
      <ol
        className={`space-y-0.5 ${
          isSidebar ? "border-l border-[var(--line)]" : ""
        }`}>
        {headings
          .filter((h) => h.level <= 3)
          .map((heading) => {
            const isActive = activeId === heading.id;
            const indent =
              heading.level === 1
                ? "pl-0"
                : heading.level === 2
                  ? isSidebar
                    ? "pl-4"
                    : "pl-3"
                  : isSidebar
                    ? "pl-7"
                    : "pl-6";

            return (
              <li key={heading.id} className={indent}>
                <button
                  type="button"
                  onClick={() => scrollToHeading(heading.id)}
                  className={`group flex w-full items-start gap-2 rounded-md py-1.5 text-left leading-snug transition-colors ${
                    isSidebar ? "pl-4 -ml-px border-l-2" : ""
                  } ${
                    isActive
                      ? isSidebar
                        ? "border-[var(--accent)] text-[var(--accent)]"
                        : "text-[var(--accent)]"
                      : isSidebar
                        ? "border-transparent text-[var(--muted)] hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
                        : "text-[var(--muted)] hover:text-[var(--fg)]"
                  } ${isSidebar ? "text-[13px]" : "text-sm"}`}>
                  {!isSidebar && isActive && (
                    <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                  )}
                  <span>{heading.text}</span>
                </button>
              </li>
            );
          })}
      </ol>
    </nav>
  );
}
