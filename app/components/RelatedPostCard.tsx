"use client";

import type { BlogPost } from "@/lib/posts";
import { trackRelatedPostClick } from "@/lib/analytics";
import SpotlightCard from "./SpotlightCard";

interface RelatedPostCardProps {
  fromSlug: string;
  post: BlogPost;
}

export default function RelatedPostCard({
  fromSlug,
  post,
}: RelatedPostCardProps) {
  return (
    <SpotlightCard
      as="a"
      href={`/blog/${post.slug}`}
      onClick={() => trackRelatedPostClick(fromSlug, post.slug)}
      className="group block p-5">
      <div className="relative z-10 flex h-full flex-col gap-4">
        <span className="chip chip-accent w-fit">{post.category}</span>
        <h3 className="font-display text-xl leading-tight transition-colors group-hover:text-[var(--accent)]">
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--fg-2)] line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </SpotlightCard>
  );
}
