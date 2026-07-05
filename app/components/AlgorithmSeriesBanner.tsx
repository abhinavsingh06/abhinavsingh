import Link from "next/link";
import { getSeriesInfo } from "@/lib/algorithm-series";

interface AlgorithmSeriesBannerProps {
  slug: string;
}

export default function AlgorithmSeriesBanner({
  slug,
}: AlgorithmSeriesBannerProps) {
  const series = getSeriesInfo(slug);
  if (!series) return null;

  return (
    <nav
      className="reveal reveal-2 mt-8 rounded-xl border border-[var(--line)] bg-[var(--bg-2)] p-4 sm:p-5"
      aria-label={`${series.title} series — guide ${series.part} of ${series.total}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="font-mono-xs text-[var(--muted)]">Series</p>
        <p className="font-mono-xs font-semibold text-[var(--accent)]">
          {series.title}
        </p>
        <span className="font-mono-xs text-[var(--muted)]">·</span>
        <p className="font-mono-xs text-[var(--muted)]">
          Guide {series.part} of {series.total}
        </p>
        {series.topic && (
          <>
            <span className="font-mono-xs text-[var(--muted)]">·</span>
            <p className="font-mono-xs text-[var(--fg-2)]">{series.topic}</p>
          </>
        )}
      </div>

      <p className="mt-2 text-sm text-[var(--fg-2)]">{series.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {series.posts.map((part, i) => {
          const isCurrent = part.slug === slug;
          const isPast = i < series.index;

          return (
            <Link
              key={part.slug}
              href={`/blog/${part.slug}`}
              className={[
                "rounded-full border px-3 py-1 font-mono-xs transition-colors",
                isCurrent
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] font-semibold text-[var(--accent)]"
                  : isPast
                    ? "border-[var(--line)] text-[var(--fg-2)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
              ].join(" ")}
              aria-current={isCurrent ? "page" : undefined}>
              {part.shortTitle}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
