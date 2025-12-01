import Link from "next/link";
import { getAllPosts, getCategories } from "@/lib/posts";
import Newsletter from "../components/Newsletter";
import ThemeToggle from "../components/ThemeToggle";

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold text-slate-900 transition-all hover:scale-105 dark:text-slate-100">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Abhinav Singh
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/blog"
                className="text-sm font-medium text-blue-600 transition-all hover:scale-105 dark:text-blue-400">
                Blog
              </Link>
              <Link
                href="/#about"
                className="text-sm font-medium text-slate-600 transition-all hover:text-blue-600 hover:scale-105 dark:text-slate-400 dark:hover:text-blue-400">
                About
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl dark:text-slate-100 animate-fade-in-up">
            <span className="text-gradient-animated">Blog</span>
          </h1>
          <p
            className="text-lg text-slate-600 dark:text-slate-400 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}>
            Thoughts, tutorials, and insights on software development
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl animate-float"></div>
        <div
          className="absolute right-1/4 bottom-10 h-80 w-80 rounded-full bg-purple-400/10 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}></div>
      </header>

      {/* Posts List */}
      <main className="px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-12">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block">
                <article
                  className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 sm:p-10 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {post.category}
                    </span>
                    <time className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      •
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="mb-4 text-2xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400 sm:text-3xl">
                    {post.title}
                  </h2>
                  <p className="mb-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    {post.excerpt}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                    Read more
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Browse By Category */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">
              Browse By Category
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog?category=${encodeURIComponent(category)}`}
                className="group rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-600 dark:hover:bg-slate-800">
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-6 py-16 sm:py-24">
        <Newsletter />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} Abhinav Singh. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
