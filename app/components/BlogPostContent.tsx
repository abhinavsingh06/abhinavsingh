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
      {headings.length > 0 && (
        <button
          onClick={() => setShowMobileTOC(!showMobileTOC)}
          className="font-mono-sm lg:hidden mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--bg-elev)] px-4 py-2 text-[var(--fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
          {showMobileTOC ? "Hide" : "Show"} contents
        </button>
      )}

      {showMobileTOC && headings.length > 0 && (
        <div className="lg:hidden mb-8 rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elev)] p-5">
          <p className="font-mono-xs mb-3 text-[var(--muted)]">/ On this page</p>
          <nav className="space-y-1.5 max-h-72 overflow-y-auto">
            {headings.map((heading) => {
              const indent =
                heading.level === 1
                  ? "pl-0"
                  : heading.level === 2
                  ? "pl-3"
                  : "pl-6";
              return (
                <button
                  key={heading.id}
                  onClick={() => {
                    const el = document.getElementById(heading.id);
                    if (el) {
                      const top =
                        el.getBoundingClientRect().top + window.pageYOffset - 100;
                      window.scrollTo({ top, behavior: "smooth" });
                      setShowMobileTOC(false);
                    }
                  }}
                  className={`block w-full text-left text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)] ${indent}`}>
                  {heading.text}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_240px]">
        <div>
          <BlogContent content={content} onHeadingsExtracted={setHeadings} />
        </div>
        <div className="hidden lg:block">
          <TableOfContents headings={headings} />
        </div>
      </div>
    </>
  );
}
