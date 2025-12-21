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
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -66%",
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-28 hidden lg:block">
      <div className="rounded-lg border border-blue-200/50 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-950/50">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Table of Contents
        </h3>
        <nav className="space-y-1.5">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            const indentClass =
              heading.level === 1
                ? "pl-0 text-sm"
                : heading.level === 2
                ? "pl-3 text-sm"
                : "pl-6 text-xs";

            return (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full text-left transition-all duration-200 ${indentClass} ${
                  isActive
                    ? "font-semibold text-blue-600 dark:text-blue-400"
                    : "text-blue-700/80 hover:text-blue-600 dark:text-blue-300/80 dark:hover:text-blue-400"
                }`}>
                <span
                  className={`inline-block transition-all ${
                    isActive
                      ? "translate-x-0.5 border-l-2 border-blue-500 pl-2 text-blue-600 dark:text-blue-400"
                      : "hover:translate-x-0.5"
                  }`}>
                  {heading.text}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
