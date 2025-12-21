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

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
      {/* Main Content */}
      <div>
        <BlogContent content={content} onHeadingsExtracted={setHeadings} />
      </div>

      {/* Table of Contents Sidebar */}
      <div className="hidden lg:block">
        <TableOfContents headings={headings} />
      </div>
    </div>
  );
}
