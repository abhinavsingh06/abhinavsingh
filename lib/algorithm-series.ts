export interface SeriesPostRef {
  slug: string;
  shortTitle: string;
  /** Optional topic label — e.g. "Arrays & Strings", "Trees" */
  topic?: string;
}

export const ALGORITHM_SERIES = {
  id: "algorithms",
  title: "Algorithms",
  description:
    "Interactive pattern guides for interview prep and CS fundamentals — new topics added over time.",
  posts: [
    {
      slug: "two-pointers-technique",
      shortTitle: "Two Pointers",
      topic: "Arrays & Strings",
    },
    {
      slug: "sliding-window-technique",
      shortTitle: "Sliding Window",
      topic: "Arrays & Strings",
    },
    {
      slug: "prefix-sum-technique",
      shortTitle: "Prefix Sum",
      topic: "Arrays & Strings",
    },
    {
      slug: "hashing-technique",
      shortTitle: "Hashing",
      topic: "Arrays & Strings",
    },
    {
      slug: "binary-search-technique",
      shortTitle: "Binary Search",
      topic: "Search",
    },
  ] satisfies SeriesPostRef[],
} as const;

export interface SeriesInfo {
  id: string;
  title: string;
  description: string;
  posts: SeriesPostRef[];
  slug: string;
  index: number;
  part: number;
  total: number;
  topic: string | null;
  prev: SeriesPostRef | null;
  next: SeriesPostRef | null;
}

export function getSeriesInfo(slug: string): SeriesInfo | null {
  const index = ALGORITHM_SERIES.posts.findIndex((p) => p.slug === slug);
  if (index === -1) return null;

  const current = ALGORITHM_SERIES.posts[index];

  return {
    ...ALGORITHM_SERIES,
    posts: [...ALGORITHM_SERIES.posts],
    slug,
    index,
    part: index + 1,
    total: ALGORITHM_SERIES.posts.length,
    topic: current.topic ?? null,
    prev: index > 0 ? ALGORITHM_SERIES.posts[index - 1] : null,
    next:
      index < ALGORITHM_SERIES.posts.length - 1
        ? ALGORITHM_SERIES.posts[index + 1]
        : null,
  };
}

export function isInAlgorithmSeries(slug: string): boolean {
  return getSeriesInfo(slug) !== null;
}

/** Append new guides here as you publish them. */
export function getAlgorithmSeriesPostSlugs(): string[] {
  return ALGORITHM_SERIES.posts.map((p) => p.slug);
}
