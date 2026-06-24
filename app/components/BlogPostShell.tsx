"use client";

import { useState } from "react";
import BlogContent from "./BlogContent";
import TableOfContents from "./TableOfContents";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface BlogPostShellProps {
  content: string;
}

export default function BlogPostShell({ content }: BlogPostShellProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [showMobileTOC, setShowMobileTOC] = useState(false);

  return (
    <div className="blog-post-shell">
      {headings.length > 0 && (
        <nav className="blog-toc-mobile lg:hidden" aria-label="Table of contents">
          <button
            type="button"
            onClick={() => setShowMobileTOC(!showMobileTOC)}
            className="font-mono-sm mb-6 inline-flex w-full items-center justify-between rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elev)] px-4 py-3 text-[var(--fg)] transition-colors hover:border-[var(--accent)]">
            <span>Table of Contents</span>
            <span className="text-[var(--muted)]">{showMobileTOC ? "−" : "+"}</span>
          </button>

          {showMobileTOC && (
            <div className="mb-8 rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elev)] p-5">
              <TableOfContents headings={headings} variant="embedded" />
            </div>
          )}
        </nav>
      )}

      <div className="blog-post-grid">
        <div className="blog-post-main min-w-0">
          <BlogContent content={content} onHeadingsExtracted={setHeadings} />
        </div>

        {headings.length > 0 && (
          <aside className="blog-post-aside hidden lg:block" aria-label="On this page">
            <TableOfContents headings={headings} variant="sidebar" />
          </aside>
        )}
      </div>
    </div>
  );
}
