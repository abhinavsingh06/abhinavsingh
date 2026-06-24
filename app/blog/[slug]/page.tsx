import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { getViewCount } from "@/lib/views";
import { getLikeCount } from "@/lib/likes";
import Newsletter from "../../components/Newsletter";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import BlogPostShell from "../../components/BlogPostShell";
import HeartLike from "../../components/HeartLike";
import PostHeartLikeDock from "../../components/PostHeartLikeDock";
import ReadingProgress from "../../components/ReadingProgress";
import ViewCount from "../../components/ViewCount";
import SpotlightCard from "../../components/SpotlightCard";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const allPosts = getAllPosts();
  const idx = allPosts.findIndex((p) => p.slug === post.slug);
  const prev = idx > 0 ? allPosts[idx - 1] : null;
  const next = idx < allPosts.length - 1 ? allPosts[idx + 1] : null;

  const likeCount = getLikeCount(post.slug);
  const viewCount = getViewCount(post.slug);

  return (
    <div className="blog-post-page relative min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <ReadingProgress />
      <PostHeartLikeDock postId={post.slug} initialLikes={likeCount} />
      <SiteHeader />

      <div className="blog-post-page-inner">
        <header className="blog-post-header">
          <Link
            href="/blog"
            className="link-arrow font-mono-sm inline-flex text-[var(--muted)]">
            <span className="arrow rotate-180 inline-block">→</span> All writing
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="chip chip-accent">{post.category}</span>
            <span className="font-mono-xs text-[var(--muted)]">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="font-mono-xs text-[var(--muted)]">·</span>
            <span className="font-mono-xs text-[var(--muted)]">
              {post.readTime}
            </span>
            <span className="font-mono-xs text-[var(--muted)]">·</span>
            <ViewCount
              postId={post.slug}
              initialViews={viewCount}
              trackView
            />
          </div>

          <h1 className="blog-post-title font-display reveal reveal-1 mt-8">
            {post.title}
          </h1>

          <p className="blog-post-excerpt reveal reveal-2">{post.excerpt}</p>

          <div className="reveal reveal-3 mt-8 hidden md:block">
            <HeartLike postId={post.slug} initialLikes={likeCount} variant="inline" />
          </div>
        </header>

        <article className="blog-post-body">
          <BlogPostShell content={post.content} />
        </article>
      </div>

      {(prev || next) && (
        <section className="blog-post-page-inner border-t border-[var(--line)] py-12">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {prev ? (
              <SpotlightCard as="a" href={`/blog/${prev.slug}`} className="group p-6">
                <div className="relative z-10">
                  <p className="font-mono-xs mb-3 text-[var(--muted)]">
                    ← Previous
                  </p>
                  <p className="font-display text-2xl leading-tight transition-colors group-hover:text-[var(--accent)] sm:text-3xl">
                    {prev.title}
                  </p>
                </div>
              </SpotlightCard>
            ) : (
              <div />
            )}
            {next ? (
              <SpotlightCard
                as="a"
                href={`/blog/${next.slug}`}
                className="group p-6 md:text-right">
                <div className="relative z-10">
                  <p className="font-mono-xs mb-3 text-[var(--muted)]">
                    Next →
                  </p>
                  <p className="font-display text-2xl leading-tight transition-colors group-hover:text-[var(--accent)] sm:text-3xl">
                    {next.title}
                  </p>
                </div>
              </SpotlightCard>
            ) : (
              <div />
            )}
          </div>
        </section>
      )}

      <section className="blog-post-page-inner pt-16 pb-8 sm:pt-24">
        <Newsletter />
      </section>

      <SiteFooter />
    </div>
  );
}
