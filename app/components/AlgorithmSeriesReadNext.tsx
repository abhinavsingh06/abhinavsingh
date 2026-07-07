"use client";

import Link from "next/link";
import { trackSeriesContinue } from "@/lib/analytics";

interface NavPost {
  slug: string;
  label: string;
}

interface AlgorithmSeriesReadNextProps {
  currentSlug: string;
  nextPost: NavPost | null;
  prevPost: NavPost | null;
  showArchiveLink?: boolean;
}

export default function AlgorithmSeriesReadNext({
  currentSlug,
  nextPost,
  prevPost,
  showArchiveLink = false,
}: AlgorithmSeriesReadNextProps) {
  if (!prevPost && !nextPost && !showArchiveLink) return null;

  return (
    <nav
      className="blog-post-page-inner mt-10 flex items-center justify-between gap-6 text-sm"
      aria-label="Series navigation">
      {prevPost ? (
        <Link
          href={`/blog/${prevPost.slug}`}
          onClick={() =>
            trackSeriesContinue(currentSlug, prevPost.slug, "series_prev")
          }
          className="text-[var(--muted)] transition-colors hover:text-[var(--fg)]">
          ← {prevPost.label}
        </Link>
      ) : (
        <span />
      )}

      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          onClick={() =>
            trackSeriesContinue(currentSlug, nextPost.slug, "read_next")
          }
          className="text-[var(--fg)] transition-colors hover:text-[var(--accent)]">
          {nextPost.label} →
        </Link>
      ) : showArchiveLink ? (
        <Link
          href="/blog?category=Algorithms"
          onClick={() =>
            trackSeriesContinue(
              currentSlug,
              "algorithms-index",
              "series_complete"
            )
          }
          className="ml-auto text-[var(--muted)] transition-colors hover:text-[var(--fg)]">
          All guides →
        </Link>
      ) : null}
    </nav>
  );
}
