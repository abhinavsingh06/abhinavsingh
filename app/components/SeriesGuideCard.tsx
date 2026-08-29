"use client";

import SpotlightCard from "./SpotlightCard";
import { trackSeriesPostClick } from "@/lib/analytics";

interface SeriesGuideCardProps {
  seriesId: string;
  slug: string;
  part: number;
  total: number;
  topic?: string;
  category: string;
  title: string;
  excerpt: string;
}

export default function SeriesGuideCard({
  seriesId,
  slug,
  part,
  total,
  topic,
  category,
  title,
  excerpt,
}: SeriesGuideCardProps) {
  return (
    <SpotlightCard
      as="a"
      href={`/blog/${slug}`}
      onClick={() => trackSeriesPostClick(seriesId, slug)}
      className="group block p-6 sm:p-8">
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="font-mono-xs text-[var(--muted)]">
              {String(part).padStart(2, "0")} / {total}
            </span>
            {topic ? (
              <>
                <span className="text-[var(--muted)]">·</span>
                <span className="font-mono-xs text-[var(--muted)]">{topic}</span>
              </>
            ) : null}
            <span className="chip chip-accent">{category}</span>
          </div>
          <h2 className="font-display text-3xl leading-tight transition-colors group-hover:text-[var(--accent)] sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--fg-2)]">
            {excerpt}
          </p>
        </div>
        <span className="link-arrow shrink-0 font-mono-sm text-[var(--accent)]">
          Read <span className="arrow">→</span>
        </span>
      </div>
    </SpotlightCard>
  );
}
