"use client";

import SpotlightCard from "./SpotlightCard";
import { trackStartHereClick } from "@/lib/analytics";

interface StartHereCardProps {
  slug: string;
  title: string;
  excerpt: string;
  seriesTitle?: string;
  seriesId?: string;
}

export default function StartHereCard({
  slug,
  title,
  excerpt,
  seriesTitle,
  seriesId,
}: StartHereCardProps) {
  return (
    <SpotlightCard
      as="a"
      href={`/blog/${slug}`}
      onClick={() => trackStartHereClick(slug, seriesId)}
      className="reveal group block border border-[var(--accent)] bg-[var(--accent-soft)] p-6 sm:p-8">
      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="chip chip-accent">Start here</span>
            {seriesTitle ? (
              <span className="font-mono-xs text-[var(--muted)]">
                {seriesTitle} series
              </span>
            ) : null}
          </div>
          <h3 className="font-display text-3xl leading-tight text-[var(--accent)] sm:text-5xl">
            {title}
          </h3>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--fg-2)]">
            {excerpt}
          </p>
        </div>
        <span className="link-arrow shrink-0 font-mono-sm text-[var(--fg)] group-hover:text-[var(--accent)]">
          Read guide <span className="arrow">→</span>
        </span>
      </div>
    </SpotlightCard>
  );
}
