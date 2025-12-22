"use client";

import { useState } from "react";
import BlogContent from "./BlogContent";
import TableOfContents from "./TableOfContents";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface BlogPostContentProps {
  content: string;
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [showMobileTOC, setShowMobileTOC] = useState(false);

  return (
    <>
      {/* Mobile TOC Toggle Button */}
      {headings.length > 0 && (
        <button
          onClick={() => setShowMobileTOC(!showMobileTOC)}
          className="lg:hidden mb-6 w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition-all hover:border-blue-400 hover:bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/50">
          {showMobileTOC ? "Hide" : "Show"} Table of Contents
        </button>
      )}

      {/* Mobile TOC */}
      {showMobileTOC && headings.length > 0 && (
        <div className="lg:hidden mb-6 rounded-lg border border-blue-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-950/50">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Table of Contents
          </h3>
          <nav className="space-y-1.5 max-h-64 overflow-y-auto">
            {headings.map((heading) => {
              const indentClass =
                heading.level === 1
                  ? "pl-0 text-sm"
                  : heading.level === 2
                  ? "pl-3 text-sm"
                  : "pl-6 text-xs";

              return (
                <button
                  key={heading.id}
                  onClick={() => {
                    const element = document.getElementById(heading.id);
                    if (element) {
                      const offset = 100;
                      const elementPosition =
                        element.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                      setShowMobileTOC(false);
                    }
                  }}
                  className={`block w-full text-left transition-all duration-200 ${indentClass} text-blue-700/80 hover:text-blue-600 dark:text-blue-300/80 dark:hover:text-blue-400`}>
                  {heading.text}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        {/* Main Content */}
        <div className="px-0">
          <BlogContent content={content} onHeadingsExtracted={setHeadings} />
        </div>

        {/* Table of Contents Sidebar */}
        <div className="hidden lg:block">
          <TableOfContents headings={headings} />
        </div>
      </div>
    </>
  );
}
