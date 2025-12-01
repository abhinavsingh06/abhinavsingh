import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import Newsletter from "../../components/Newsletter";
import ThemeToggle from "../../components/ThemeToggle";

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
                href="/#about"
                className="text-sm font-medium text-slate-600 transition-all hover:text-blue-600 hover:scale-105 dark:text-slate-400 dark:hover:text-blue-400">
                About
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="group mb-8 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400">
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
          <header className="mb-12 animate-fade-in-up">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-400">
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
            <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl dark:text-slate-100">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {post.title}
              </span>
            </h1>
            <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-400">
              {post.excerpt}
            </p>

            {/* Decorative line */}
            <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700"></div>
          </header>

          {/* Content */}
          <div className="prose prose-lg prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-headings:leading-tight prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-semibold prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-pre:bg-slate-900 dark:prose-pre:bg-slate-800">
            <div
              dangerouslySetInnerHTML={{
                __html: (() => {
                  const lines = post.content.split("\n");
                  const html: string[] = [];
                  let inList = false;

                  for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    const trimmed = line.trim();

                    // Handle headers
                    if (trimmed.startsWith("# ")) {
                      if (inList) {
                        html.push("</ul>");
                        inList = false;
                      }
                      html.push(`<h1>${trimmed.substring(2)}</h1>`);
                      continue;
                    }
                    if (trimmed.startsWith("## ")) {
                      if (inList) {
                        html.push("</ul>");
                        inList = false;
                      }
                      html.push(`<h2>${trimmed.substring(3)}</h2>`);
                      continue;
                    }
                    if (trimmed.startsWith("### ")) {
                      if (inList) {
                        html.push("</ul>");
                        inList = false;
                      }
                      html.push(`<h3>${trimmed.substring(4)}</h3>`);
                      continue;
                    }

                    // Handle list items
                    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                      if (!inList) {
                        html.push("<ul>");
                        inList = true;
                      }
                      let content = trimmed.substring(2);
                      content = content.replace(
                        /\*\*(.+?)\*\*/g,
                        "<strong>$1</strong>"
                      );
                      content = content.replace(/`(.+?)`/g, "<code>$1</code>");
                      html.push(`<li>${content}</li>`);
                      continue;
                    }

                    // Close list if we were in one
                    if (inList && trimmed === "") {
                      html.push("</ul>");
                      inList = false;
                      continue;
                    }

                    // Handle regular paragraphs
                    if (trimmed === "") {
                      if (inList) {
                        html.push("</ul>");
                        inList = false;
                      }
                      html.push("<br />");
                      continue;
                    }

                    if (inList) {
                      html.push("</ul>");
                      inList = false;
                    }

                    // Convert **bold** to <strong>
                    let processed = trimmed.replace(
                      /\*\*(.+?)\*\*/g,
                      "<strong>$1</strong>"
                    );
                    // Convert `code` to <code>
                    processed = processed.replace(
                      /`(.+?)`/g,
                      "<code>$1</code>"
                    );
                    html.push(`<p>${processed}</p>`);
                  }

                  if (inList) {
                    html.push("</ul>");
                  }

                  return html.join("");
                })(),
              }}
            />
          </div>

          {/* Footer */}
          <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-blue-600 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-blue-400 dark:hover:border-blue-600 dark:hover:bg-slate-800">
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
      </article>

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
