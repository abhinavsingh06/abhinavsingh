import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { use } from "react";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { getSeriesInfo } from "@/lib/algorithm-series";
import { siteName, siteUrl } from "@/lib/site";
import { getViewCountSync } from "@/lib/views";
import { getLikeCountSync } from "@/lib/likes";
import Newsletter from "../../components/Newsletter";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import BlogPostShell from "../../components/BlogPostShell";
import PostHeartLikeDock from "../../components/PostHeartLikeDock";
import ReadingProgress from "../../components/ReadingProgress";
import ViewCount from "../../components/ViewCount";
import SpotlightCard from "../../components/SpotlightCard";
import AlgorithmSeriesReadNext from "../../components/AlgorithmSeriesReadNext";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${siteUrl}/blog/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [siteName],
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: { canonical: url },
  };
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
  const series = getSeriesInfo(post.slug);
  const idx = allPosts.findIndex((p) => p.slug === post.slug);
  const prev = idx > 0 ? allPosts[idx - 1] : null;
  const next = idx < allPosts.length - 1 ? allPosts[idx + 1] : null;

  const likeCount = getLikeCountSync(post.slug);
  const viewCount = getViewCountSync(post.slug);

  return (
    <div className="blog-post-page relative min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <ReadingProgress />
      <PostHeartLikeDock postId={post.slug} initialLikes={likeCount} />
      <SiteHeader />

      <div className="blog-post-page-inner">
        <header className="blog-post-header">
          <Link
            href="/blog"
            className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)]">
            ← Writing
          </Link>

          <div className="mt-6 text-sm text-[var(--muted)]">
            {series ? (
              <span>
                {series.part}/{series.total}
              </span>
            ) : (
              <span>{post.category}</span>
            )}
            <span className="mx-2">·</span>
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="mx-2">·</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="blog-post-title font-display reveal reveal-1 mt-6">
            {post.title}
          </h1>

          <p className="blog-post-excerpt reveal reveal-2">{post.excerpt}</p>
        </header>

        <article className="blog-post-body">
          <ViewCount
            postId={post.slug}
            initialViews={viewCount}
            trackView
            className="sr-only"
          />
          <BlogPostShell content={post.content} />
        </article>
      </div>

      {series ? (
        <AlgorithmSeriesReadNext
          currentSlug={post.slug}
          nextPost={
            series.next
              ? { slug: series.next.slug, label: series.next.shortTitle }
              : null
          }
          prevPost={
            series.prev
              ? { slug: series.prev.slug, label: series.prev.shortTitle }
              : null
          }
          showArchiveLink={!series.next}
        />
      ) : (
        (prev || next) && (
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
        )
      )}

      <section className="blog-post-page-inner pt-16 pb-8 sm:pt-24">
        <Newsletter />
      </section>

      <SiteFooter />
    </div>
  );
}
