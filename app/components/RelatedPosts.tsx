import { getRelatedPosts } from "@/lib/related-posts";
import RelatedPostCard from "./RelatedPostCard";

interface RelatedPostsProps {
  slug: string;
}

export default function RelatedPosts({ slug }: RelatedPostsProps) {
  const related = getRelatedPosts(slug, 3);
  if (related.length === 0) return null;

  return (
    <section className="blog-post-page-inner border-t border-[var(--line)] py-10">
      <p className="font-mono-xs mb-5 text-[var(--muted)]">Related reading</p>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        {related.map((post) => (
          <RelatedPostCard key={post.slug} fromSlug={slug} post={post} />
        ))}
      </div>
    </section>
  );
}
