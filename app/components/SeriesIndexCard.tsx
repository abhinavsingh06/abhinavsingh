"use client";

import SpotlightCard from "./SpotlightCard";
import { trackSeriesHubClick } from "@/lib/analytics";

interface SeriesIndexCardProps {
  id: string;
  title: string;
  description: string;
  guideCount: number;
}

export default function SeriesIndexCard({
  id,
  title,
  description,
  guideCount,
}: SeriesIndexCardProps) {
  return (
    <SpotlightCard
      as="a"
      href={`/series/${id}`}
      onClick={() => trackSeriesHubClick(id, "series_index")}
      className="group block p-6 sm:p-8">
      <div className="relative z-10 flex h-full flex-col gap-4">
        <span className="font-mono-xs text-[var(--muted)]">
          {guideCount} {guideCount === 1 ? "guide" : "guides"}
        </span>
        <h2 className="font-display text-3xl leading-tight transition-colors group-hover:text-[var(--accent)] sm:text-4xl">
          {title}
        </h2>
        <p className="text-[15px] leading-relaxed text-[var(--fg-2)]">
          {description}
        </p>
        <span className="link-arrow mt-auto font-mono-sm text-[var(--accent)]">
          View series <span className="arrow">→</span>
        </span>
      </div>
    </SpotlightCard>
  );
}
