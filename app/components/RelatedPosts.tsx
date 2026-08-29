import Link from "next/link";
import { getRelatedPosts } from "@/lib/related-posts";
import SpotlightCard from "./SpotlightCard";

interface RelatedPostsProps {
  slug: string;
}

export default function RelatedPosts({ slug }: RelatedPostsProps) {
  const related = getRelatedPosts(slug, 3);
  if (related.length === 0) return null;

  return (
    <section className="blog-post-page-inner border-t border-[var(--line)] py-12">
      <p className="font-mono-xs mb-6 text-[var(--muted)]">Related reading</p>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        {related.map((post) => (
          <SpotlightCard
            key={post.slug}
            as="a"
            href={`/blog/${post.slug}`}
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
        ))}
      </div>
    </section>
  );
}
