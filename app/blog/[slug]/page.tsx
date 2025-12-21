import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import Newsletter from "../../components/Newsletter";
import ThemeToggle from "../../components/ThemeToggle";
import NatureGraphics from "../../components/NatureGraphics";
import BlogPostContent from "../../components/BlogPostContent";
import ReadingProgress from "../../components/ReadingProgress";
import AnimatedParticles from "../../components/AnimatedParticles";
import ScrollReveal from "../../components/ScrollReveal";
import BackgroundFish from "../../components/BackgroundFish";
import ReadingCelebration from "../../components/ReadingCelebration";
import ViewCount from "../../components/ViewCount";
import StickyLikeButton from "../../components/StickyLikeButton";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-cyan-50/20 to-teal-50/30 dark:from-blue-950/30 dark:via-cyan-950/20 dark:to-teal-950/30 relative overflow-hidden">
      <ReadingProgress />
      <BackgroundFish />
      <AnimatedParticles />
      <NatureGraphics />
      {/* Sticky Like Button - Always visible while scrolling */}
      <StickyLikeButton postId={post.slug} />
      {/* Navigation */}
      <nav className="fixed top-[4px] left-0 right-0 z-50 border-b border-blue-200/30 bg-white/70 backdrop-blur-md dark:border-blue-900/30 dark:bg-blue-950/70">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold text-blue-900 transition-all hover:scale-105 dark:text-blue-100">
              <span className="text-gradient-animated">Abhinav Singh</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/blog"
                className="group relative px-4 py-2 text-sm font-semibold text-blue-700 transition-all hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                <span className="relative z-10">Blog</span>
                <span className="absolute inset-0 rounded-lg bg-blue-100/50 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-blue-900/30"></span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/#about"
                className="group relative px-4 py-2 text-sm font-semibold text-blue-700 transition-all hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                <span className="relative z-10">About</span>
                <span className="absolute inset-0 rounded-lg bg-blue-100/50 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-blue-900/30"></span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="px-6 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-5xl">
          {/* Content Card */}
          <div className="ocean-card rounded-2xl p-8 sm:p-12 shadow-lg relative z-10">
            {/* Back link */}
            <Link
              href="/blog"
              className="group mb-8 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800 hover:scale-105 hover:shadow-md dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/50 relative z-10">
              <svg
                className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to blog
            </Link>

            {/* Header */}
            <ScrollReveal>
              <header className="mb-12">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-400">
                    {post.category}
                  </span>
                  <time className="text-sm text-blue-600 dark:text-blue-400">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    •
                  </span>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    {post.readTime}
                  </span>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    •
                  </span>
                  <ViewCount postId={post.slug} />
                </div>
                <h1 className="mb-6 text-4xl font-bold leading-tight text-blue-900 sm:text-5xl dark:text-blue-100">
                  <span className="text-gradient-animated">{post.title}</span>
                </h1>
                <p className="text-xl leading-relaxed text-blue-800/80 dark:text-blue-200/80">
                  {post.excerpt}
                </p>

                {/* Decorative ocean line */}
                <div className="mt-8 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent dark:via-blue-700"></div>
              </header>
            </ScrollReveal>

            {/* Content */}
            <BlogPostContent content={post.content} />

            {/* Reading Celebration */}
            <ReadingCelebration />

            {/* Footer */}
            <div className="mt-12 border-t border-blue-200 pt-8 dark:border-blue-800">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-6 py-3 text-base font-semibold text-blue-600 transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg hover:scale-105 hover:shadow-blue-500/20 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400 dark:hover:border-blue-500 dark:hover:bg-blue-900/50 relative z-10">
                <svg
                  className="h-5 w-5 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to all posts
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Newsletter Section */}
      <section className="px-6 py-16 sm:py-24">
        <Newsletter />
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-200/50 bg-white/70 px-6 py-12 dark:border-blue-900/50 dark:bg-blue-950/70">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-blue-700 dark:text-blue-300">
            © {new Date().getFullYear()} Abhinav Singh. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
