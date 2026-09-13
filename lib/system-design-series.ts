export interface SeriesPostRef {
  slug: string;
  shortTitle: string;
  topic?: string;
}

export const SYSTEM_DESIGN_SERIES = {
  id: "system-design",
  title: "System Design",
  description:
    "One problem at a time — clarify, estimate, design, and trade off like you would in an interview.",
  archiveCategory: "System Design",
  posts: [
    {
      slug: "design-url-shortener",
      shortTitle: "URL Shortener",
      topic: "Storage & redirects",
    },
  ] satisfies SeriesPostRef[],
} as const;

export interface SystemDesignSeriesInfo {
  id: string;
  title: string;
  description: string;
  archiveCategory: string;
  posts: SeriesPostRef[];
  slug: string;
  index: number;
  part: number;
  total: number;
  topic: string | null;
  prev: SeriesPostRef | null;
  next: SeriesPostRef | null;
}

export function getSystemDesignSeriesInfo(
  slug: string
): SystemDesignSeriesInfo | null {
  const index = SYSTEM_DESIGN_SERIES.posts.findIndex((p) => p.slug === slug);
  if (index === -1) return null;

  const current = SYSTEM_DESIGN_SERIES.posts[index];

  return {
    ...SYSTEM_DESIGN_SERIES,
    posts: [...SYSTEM_DESIGN_SERIES.posts],
    slug,
    index,
    part: index + 1,
    total: SYSTEM_DESIGN_SERIES.posts.length,
    topic: current.topic ?? null,
    prev: index > 0 ? SYSTEM_DESIGN_SERIES.posts[index - 1] : null,
    next:
      index < SYSTEM_DESIGN_SERIES.posts.length - 1
        ? SYSTEM_DESIGN_SERIES.posts[index + 1]
        : null,
  };
}

export function isInSystemDesignSeries(slug: string): boolean {
  return getSystemDesignSeriesInfo(slug) !== null;
}
