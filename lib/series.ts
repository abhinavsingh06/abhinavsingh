import {
  getSeriesInfo as getAlgorithmSeriesInfo,
  ALGORITHM_SERIES,
  type SeriesInfo as AlgorithmSeriesInfo,
  type SeriesPostRef,
} from "./algorithm-series";
import {
  getKafkaSeriesInfo,
  KAFKA_SERIES,
  type KafkaSeriesInfo,
} from "./kafka-series";
import {
  getSystemDesignSeriesInfo,
  SYSTEM_DESIGN_SERIES,
  type SystemDesignSeriesInfo,
} from "./system-design-series";
import { getFeaturedPosts, getPostBySlug, type BlogPost } from "./posts";

export type {
  SeriesPostRef,
  AlgorithmSeriesInfo,
  KafkaSeriesInfo,
  SystemDesignSeriesInfo,
};

export type SeriesInfo =
  | AlgorithmSeriesInfo
  | KafkaSeriesInfo
  | SystemDesignSeriesInfo;

export interface SeriesCatalogEntry {
  id: string;
  title: string;
  description: string;
  archiveCategory: string;
  posts: SeriesPostRef[];
  startHereSlug?: string;
}

export const ALL_SERIES: SeriesCatalogEntry[] = [
  {
    ...KAFKA_SERIES,
    posts: [...KAFKA_SERIES.posts],
    startHereSlug: "why-kafka-exists",
  },
  {
    ...ALGORITHM_SERIES,
    posts: [...ALGORITHM_SERIES.posts],
    startHereSlug: "two-pointers-technique",
  },
  {
    ...SYSTEM_DESIGN_SERIES,
    posts: [...SYSTEM_DESIGN_SERIES.posts],
  },
];

export function getSeriesInfo(slug: string): SeriesInfo | null {
  return (
    getAlgorithmSeriesInfo(slug) ??
    getKafkaSeriesInfo(slug) ??
    getSystemDesignSeriesInfo(slug)
  );
}

export function getAllSeries(): SeriesCatalogEntry[] {
  return ALL_SERIES;
}

export function getSeriesById(id: string): SeriesCatalogEntry | undefined {
  return ALL_SERIES.find((series) => series.id === id);
}

export function getStartHerePost(): BlogPost | undefined {
  for (const series of ALL_SERIES) {
    if (!series.startHereSlug) continue;
    const post = getPostBySlug(series.startHereSlug);
    if (post) return post;
  }

  return getFeaturedPosts()[0];
}

export function getSeriesForPost(slug: string): SeriesCatalogEntry | undefined {
  return ALL_SERIES.find((series) =>
    series.posts.some((post) => post.slug === slug)
  );
}
