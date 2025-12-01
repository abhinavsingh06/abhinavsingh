import Link from "next/link";
import { getFeaturedPosts, getCategories } from "@/lib/posts";
import Newsletter from "./components/Newsletter";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  const featuredPosts = getFeaturedPosts();
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
                className="text-sm font-medium text-slate-600 transition-all hover:text-blue-600 hover:scale-105 dark:text-slate-400 dark:hover:text-blue-400">
                Blog
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-slate-600 transition-all hover:text-blue-600 hover:scale-105 dark:text-slate-400 dark:hover:text-blue-400">
                About
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-2 text-sm text-slate-600 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Available for opportunities
          </div> */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-slate-100 animate-fade-in-up">
            Hi, I&apos;m{" "}
            <span className="text-gradient-animated">Abhinav Singh</span>
          </h1>
          <p
            className="mb-8 text-xl text-slate-600 sm:text-2xl dark:text-slate-400 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}>
            Software Engineer & Tech Enthusiast
          </p>
          <p
            className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-500 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}>
            Welcome to my personal tech blog where I share insights on software
            engineering, web development, and the latest in technology. Join me
            as I explore the ever-evolving world of code.
          </p>
          <div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}>
            <Link
              href="/blog"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50">
              <span className="relative z-10">Read My Blog</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100"></span>
            </Link>
            <Link
              href="#about"
              className="group rounded-full border-2 border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-700 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-slate-800">
              Learn More
              <svg
                className="ml-2 inline h-4 w-4 transition-transform group-hover:translate-y-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
          </div>
        </div>
        {/* Enhanced decorative elements */}
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl animate-float"></div>
        <div
          className="absolute right-1/4 bottom-20 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}></div>
        <div
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-400/10 blur-3xl animate-float"
          style={{ animationDelay: "4s" }}></div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </div>
      </section>

      {/* Articles and Tutorials */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">
              Articles and Tutorials
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Latest thoughts and insights from my journey
            </p>
          </div>

          <div className="space-y-12">
            {featuredPosts.map((post, index) => (
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
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400 sm:text-3xl">
                    {post.title}
                  </h3>
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

          <div className="mt-16 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-600 dark:hover:bg-slate-800">
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

      {/* Browse By Category */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
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

      {/* About Section */}
      <section id="about" className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-12">
            {/* Decorative gradient */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl transition-all duration-500 group-hover:scale-150"></div>

            <div className="relative z-10">
              <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">
                About Me
              </h2>
              <div className="prose prose-slate max-w-none dark:prose-invert">
                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  I&apos;m a passionate software engineer with a love for
                  building beautiful, functional, and user-friendly
                  applications. My journey in tech has been driven by curiosity
                  and a desire to solve complex problems with elegant solutions.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  Through this blog, I share my experiences, learnings, and
                  insights about software development, emerging technologies,
                  and best practices. Whether you&apos;re a fellow developer or
                  someone curious about tech, I hope you find something valuable
                  here.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {[
                    "JavaScript",
                    "TypeScript",
                    "React",
                    "Next.js",
                    "Node.js",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="group/tech rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:scale-110 hover:shadow-md dark:from-slate-800 dark:to-slate-700 dark:text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
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
