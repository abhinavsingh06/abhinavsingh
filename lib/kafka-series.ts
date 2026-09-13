export interface SeriesPostRef {
  slug: string;
  shortTitle: string;
  topic?: string;
}

export const KAFKA_SERIES = {
  id: "kafka",
  title: "Kafka",
  description:
    "From first message to production confidence — learn Kafka by following a message, not memorizing jargon.",
  archiveCategory: "Distributed Systems",
  posts: [
    {
      slug: "why-kafka-exists",
      shortTitle: "Why Kafka Exists",
      topic: "Foundations",
    },
    {
      slug: "kafka-core-vocabulary",
      shortTitle: "Core Vocabulary",
      topic: "Foundations",
    },
    {
      slug: "kafka-first-producer-consumer",
      shortTitle: "First Produce & Consume",
      topic: "Hands-on",
    },
  ] satisfies SeriesPostRef[],
} as const;

export interface KafkaSeriesInfo {
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

export function getKafkaSeriesInfo(slug: string): KafkaSeriesInfo | null {
  const index = KAFKA_SERIES.posts.findIndex((p) => p.slug === slug);
  if (index === -1) return null;

  const current = KAFKA_SERIES.posts[index];

  return {
    ...KAFKA_SERIES,
    posts: [...KAFKA_SERIES.posts],
    slug,
    index,
    part: index + 1,
    total: KAFKA_SERIES.posts.length,
    topic: current.topic ?? null,
    prev: index > 0 ? KAFKA_SERIES.posts[index - 1] : null,
    next:
      index < KAFKA_SERIES.posts.length - 1
        ? KAFKA_SERIES.posts[index + 1]
        : null,
  };
}

export function isInKafkaSeries(slug: string): boolean {
  return getKafkaSeriesInfo(slug) !== null;
}
