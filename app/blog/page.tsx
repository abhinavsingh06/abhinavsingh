import Link from "next/link";
import { getAllPosts, getCategories } from "@/lib/posts";
import Newsletter from "../components/Newsletter";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import SpotlightCard from "../components/SpotlightCard";
import ViewCount from "../components/ViewCount";

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <SiteHeader />

      {/* ──────────────── HEADER ──────────────── */}
      <section className="mx-auto max-w-[1400px] px-5 pt-16 pb-10 sm:px-8 sm:pt-24">
        <p className="label-tag reveal mb-6">/ Index — Writing</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display reveal reveal-1 text-[clamp(3rem,9vw,8rem)]">
            The <span className="text-[var(--accent)]">archive.</span>
          </h1>
          <div className="reveal reveal-2 flex items-center gap-6">
            <div>
              <p className="font-mono-xs text-[var(--muted)]">Total essays</p>
              <p className="font-display mt-1 text-3xl">
                {String(posts.length).padStart(2, "0")}
              </p>
            </div>
            <div className="h-12 w-px bg-[var(--line)]" />
            <div>
              <p className="font-mono-xs text-[var(--muted)]">Topics</p>
              <p className="font-display mt-1 text-3xl">
                {String(categories.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
        <p className="reveal reveal-3 mt-8 max-w-2xl text-base text-[var(--fg-2)]">
          Field notes, essays, and tutorials on engineering, design-engineering,
          and the slow work of making software last. Newest first.
        </p>
      </section>

      {/* ──────────────── TOPIC RAIL ──────────────── */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-2 border-y border-[var(--line)] py-5">
          <p className="font-mono-xs mr-4 text-[var(--muted)]">FILTER /</p>
          <Link href="/blog" className="chip chip-accent">
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/blog?category=${encodeURIComponent(category)}`}
              className="chip">
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* ──────────────── POSTS ──────────────── */}
      <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <SpotlightCard
              key={post.slug}
              as="a"
              href={`/blog/${post.slug}`}
              className="group block p-6">
              <div className="relative z-10 flex h-full flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="chip chip-accent">{post.category}</span>
                  <span className="font-mono-xs text-[var(--muted)]">
                    {String(posts.length - i).padStart(3, "0")}
                  </span>
                </div>

                <h2 className="font-display text-2xl leading-[1.1] transition-colors group-hover:text-[var(--accent)] sm:text-3xl">
                  {post.title}
                </h2>

                <p className="text-[14.5px] leading-relaxed text-[var(--fg-2)] line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-[var(--line)] pt-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-xs text-[var(--muted)]">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </span>
                    <span className="font-mono-xs text-[var(--muted)]">·</span>
                    <span className="font-mono-xs text-[var(--muted)]">
                      {post.readTime}
                    </span>
                  </div>
                  <ViewCount postId={post.slug} />
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </main>

      {/* ──────────────── NEWSLETTER ──────────────── */}
      <section className="mx-auto max-w-[1400px] px-5 pt-20 sm:px-8 sm:pt-28">
        <Newsletter />
      </section>

      <SiteFooter />
    </div>
  );
}
