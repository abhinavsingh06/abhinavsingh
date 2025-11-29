import Link from "next/link";
import { getFeaturedPosts } from "@/lib/posts";

export default function Home() {
  const featuredPosts = getFeaturedPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Abhinav Singh
            </Link>
            <div className="flex gap-6">
              <Link
                href="/blog"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                Blog
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-2 text-sm text-slate-600 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Available for opportunities
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-slate-100">
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Abhinav Singh
            </span>
          </h1>
          <p className="mb-8 text-xl text-slate-600 sm:text-2xl dark:text-slate-400">
            Software Engineer & Tech Enthusiast
          </p>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-500">
            Welcome to my personal tech blog where I share insights on software
            engineering, web development, and the latest in technology. Join me
            as I explore the ever-evolving world of code.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/blog"
              className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              Read My Blog
            </Link>
            <Link
              href="#about"
              className="rounded-full border-2 border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800">
              Learn More
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-20 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl"></div>
      </section>

      {/* Featured Posts */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">
              Featured Posts
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Latest thoughts and insights from my journey
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {post.category}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {post.readTime}
                  </span>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                  {post.title}
                </h3>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  Read more
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
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
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-base font-semibold text-slate-700 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
              View all posts
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-12">
            <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">
              About Me
            </h2>
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                I&apos;m a passionate software engineer with a love for building
                beautiful, functional, and user-friendly applications. My
                journey in tech has been driven by curiosity and a desire to
                solve complex problems with elegant solutions.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Through this blog, I share my experiences, learnings, and
                insights about software development, emerging technologies, and
                best practices. Whether you&apos;re a fellow developer or
                someone curious about tech, I hope you find something valuable
                here.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  JavaScript
                </span>
                <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  TypeScript
                </span>
                <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  React
                </span>
                <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Next.js
                </span>
                <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Node.js
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} Abhinav Singh. All rights reserved.
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
