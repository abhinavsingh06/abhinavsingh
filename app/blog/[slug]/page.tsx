import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import Newsletter from "../../components/Newsletter";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import BlogPostContent from "../../components/BlogPostContent";
import ReadingProgress from "../../components/ReadingProgress";
import ViewCount from "../../components/ViewCount";
import LikeButton from "../../components/LikeButton";
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

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <ReadingProgress />
      <SiteHeader />

      {/* ──────────────── HEADER ──────────────── */}
      <header className="relative mx-auto max-w-[1400px] px-5 pt-10 sm:px-8 sm:pt-16">
        <Link
          href="/blog"
          className="link-arrow font-mono-sm inline-flex text-[var(--muted)]">
          <span className="arrow rotate-180 inline-block">→</span> All writing
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3">
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
          <ViewCount postId={post.slug} />
        </div>

        <h1 className="font-display reveal reveal-1 mt-8 max-w-5xl text-[clamp(2.5rem,7vw,6rem)]">
          {post.title}
        </h1>

        <p className="reveal reveal-2 mt-8 max-w-3xl text-[18px] leading-[1.55] text-[var(--fg-2)]">
          {post.excerpt}
        </p>

        <div className="reveal reveal-3 mt-10 flex items-center gap-3">
          <LikeButton postId={post.slug} />
          <span className="font-mono-xs text-[var(--muted)]">
            Like this if it&apos;s useful
          </span>
        </div>

        <div className="mt-14 h-px bg-[var(--line)]" />
      </header>

      {/* ──────────────── BODY ──────────────── */}
      <article className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9">
            <BlogPostContent content={post.content} />

            {/* Post footer */}
            <div className="mt-16 border-t border-[var(--line)] pt-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <LikeButton postId={post.slug} />
                  <span className="font-mono-xs text-[var(--muted)]">
                    Thanks for reading.
                  </span>
                </div>
                <Link href="/blog" className="link-arrow font-mono-sm">
                  More writing <span className="arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* ──────────────── PREV / NEXT ──────────────── */}
      {(prev || next) && (
        <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-3 border-t border-[var(--line)] py-12 sm:gap-4 md:grid-cols-2">
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

      {/* ──────────────── NEWSLETTER ──────────────── */}
      <section className="mx-auto max-w-[1400px] px-5 pt-16 sm:px-8 sm:pt-24">
        <Newsletter />
      </section>

      <SiteFooter />
    </div>
  );
}
