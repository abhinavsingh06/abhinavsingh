import Link from "next/link";
import { getAllPosts, getCategories } from "@/lib/posts";
import Newsletter from "../components/Newsletter";
import ThemeToggle from "../components/ThemeToggle";
import NatureGraphics from "../components/NatureGraphics";
import AnimatedParticles from "../components/AnimatedParticles";
import ScrollReveal from "../components/ScrollReveal";
import BackgroundFish from "../components/BackgroundFish";
import LikeButton from "../components/LikeButton";
import ViewCount from "../components/ViewCount";

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-cyan-50/20 to-teal-50/30 dark:from-blue-950/30 dark:via-cyan-950/20 dark:to-teal-950/30 relative overflow-hidden">
      <BackgroundFish />
      <AnimatedParticles />
      <NatureGraphics />
      {/* Navigation */}
      <nav className="fixed top-[4px] left-0 right-0 z-50 border-b border-blue-200/30 bg-white/70 backdrop-blur-md dark:border-blue-900/30 dark:bg-blue-950/70">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-lg sm:text-xl font-bold text-blue-900 transition-all hover:scale-105 dark:text-blue-100">
              <span className="text-gradient-animated">Abhinav Singh</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/blog"
                className="group relative px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-blue-700 transition-all hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                <span className="relative z-10">Blog</span>
                <span className="absolute inset-0 rounded-lg bg-blue-100/50 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-blue-900/30"></span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/#about"
                className="group relative px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-blue-700 transition-all hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hidden sm:block">
                <span className="relative z-10">About</span>
                <span className="absolute inset-0 rounded-lg bg-blue-100/50 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-blue-900/30"></span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="relative overflow-hidden px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <h1 className="mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 dark:text-blue-100">
              <span className="text-gradient-animated">Blog</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-base sm:text-lg text-blue-700 dark:text-blue-300 px-4">
              Thoughts, tutorials, and insights on software development
            </p>
          </ScrollReveal>
        </div>
        {/* Ocean decorative elements */}
        <div className="absolute left-1/4 top-10 h-64 w-64 organic-blob bg-blue-400/15 blur-3xl animate-wave-float"></div>
        <div
          className="absolute right-1/4 bottom-10 h-80 w-80 organic-blob bg-cyan-400/15 blur-3xl animate-wave-float"
          style={{ animationDelay: "2s" }}></div>
        <div
          className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 organic-blob bg-teal-400/10 blur-3xl animate-ocean-pulse"
          style={{ animationDelay: "4s" }}></div>
      </header>

      {/* Posts List */}
      <main className="px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-8 sm:space-y-12">
            {posts.map((post, index) => (
              <ScrollReveal key={post.slug} delay={index * 100} direction="up">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block transform transition-all duration-300 hover:scale-[1.02]">
                  <article className="ocean-card wild-border relative overflow-hidden rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg bg-white/95 dark:bg-blue-950/95 backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:-translate-y-1 group-hover:rotate-1">
                    <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="rounded-full bg-blue-100 px-2 sm:px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {post.category}
                      </span>
                      <time className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hidden sm:inline">
                        •
                      </span>
                      <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                        {post.readTime}
                      </span>
                      <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hidden sm:inline">
                        •
                      </span>
                      <ViewCount postId={post.slug} />
                    </div>
                    <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-blue-900 transition-all duration-300 group-hover:text-blue-600 group-hover:translate-x-1 dark:text-blue-100 dark:group-hover:text-blue-400">
                      {post.title}
                    </h2>
                    <p className="mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed text-blue-800/80 transition-opacity duration-300 group-hover:text-blue-900/90 dark:text-blue-200/80 dark:group-hover:text-blue-100/90">
                      {post.excerpt}
                    </p>
                    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <LikeButton postId={post.slug} />
                        <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                          Show appreciation
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 transition-all duration-300 group-hover:text-blue-700 group-hover:gap-3 dark:text-blue-400 dark:group-hover:text-blue-300">
                        Read more
                        <svg
                          className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </main>

      {/* Browse By Category */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-100">
              Browse By Category
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog?category=${encodeURIComponent(category)}`}
                className="group rounded-lg border border-blue-200 bg-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-blue-700 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/50">
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <Newsletter />
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-200/50 bg-white/70 px-4 sm:px-6 py-8 sm:py-12 dark:border-blue-900/50 dark:bg-blue-950/70">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300">
            © {new Date().getFullYear()} Abhinav Singh. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
