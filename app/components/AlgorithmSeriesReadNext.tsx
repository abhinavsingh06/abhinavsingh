"use client";

import Link from "next/link";
import { trackSeriesContinue } from "@/lib/analytics";
import SpotlightCard from "./SpotlightCard";

interface PostPreview {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
}

interface AlgorithmSeriesReadNextProps {
  currentSlug: string;
  seriesTitle: string;
  part: number;
  total: number;
  nextPost: PostPreview | null;
  prevPost: PostPreview | null;
}

export default function AlgorithmSeriesReadNext({
  currentSlug,
  seriesTitle,
  part,
  total,
  nextPost,
  prevPost,
}: AlgorithmSeriesReadNextProps) {
  const isLast = part === total;

  return (
    <section
      className="blog-post-page-inner border-t border-[var(--line)] py-12"
      aria-label="Continue the series">
      <p className="label-tag mb-4">/ Continue the series</p>
      <h2 className="font-display text-2xl sm:text-3xl">
        {isLast ? (
          <>
            More in{" "}
            <span className="text-[var(--accent)]">{seriesTitle}</span> coming
            soon
          </>
        ) : (
          <>
            Up next in{" "}
            <span className="text-[var(--accent)]">{seriesTitle}</span>
          </>
        )}
      </h2>

      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          onClick={() =>
            trackSeriesContinue(currentSlug, nextPost.slug, "read_next")
          }
          className="group mt-6 block">
          <SpotlightCard className="p-6 sm:p-8">
            <div className="relative z-10">
              <p className="font-mono-xs mb-2 text-[var(--accent)]">
                Guide {part + 1} of {total} →
              </p>
              <p className="font-display text-2xl leading-tight transition-colors group-hover:text-[var(--accent)] sm:text-3xl">
                {nextPost.title}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--fg-2)]">
                {nextPost.excerpt}
              </p>
              <p className="font-mono-xs mt-4 text-[var(--muted)]">
                {nextPost.readTime} · Read next →
              </p>
            </div>
          </SpotlightCard>
        </Link>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/blog?category=Algorithms"
            onClick={() =>
              trackSeriesContinue(
                currentSlug,
                "algorithms-index",
                "series_complete"
              )
            }
            className="group block">
            <SpotlightCard className="h-full p-6">
              <div className="relative z-10">
                <p className="font-mono-xs mb-2 text-[var(--accent)]">
                  Series complete
                </p>
                <p className="font-display text-xl transition-colors group-hover:text-[var(--accent)] sm:text-2xl">
                  Browse all algorithm guides
                </p>
              </div>
            </SpotlightCard>
          </Link>
          {prevPost && (
            <Link
              href={`/blog/${prevPost.slug}`}
              onClick={() =>
                trackSeriesContinue(currentSlug, prevPost.slug, "review_prev")
              }
              className="group block">
              <SpotlightCard className="h-full p-6">
                <div className="relative z-10">
                  <p className="font-mono-xs mb-2 text-[var(--muted)]">
                    Review
                  </p>
                  <p className="font-display text-xl transition-colors group-hover:text-[var(--accent)] sm:text-2xl">
                    {prevPost.title}
                  </p>
                </div>
              </SpotlightCard>
            </Link>
          )}
        </div>
      )}

      {prevPost && nextPost && (
        <Link
          href={`/blog/${prevPost.slug}`}
          onClick={() =>
            trackSeriesContinue(currentSlug, prevPost.slug, "series_prev")
          }
          className="link-arrow font-mono-sm mt-6 inline-flex text-[var(--muted)]">
          <span className="arrow rotate-180 inline-block">→</span> Previous:{" "}
          {prevPost.title}
        </Link>
      )}
    </section>
  );
}
