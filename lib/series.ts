import {
  getSeriesInfo as getAlgorithmSeriesInfo,
  type SeriesInfo as AlgorithmSeriesInfo,
} from "./algorithm-series";
import {
  getKafkaSeriesInfo,
  type KafkaSeriesInfo,
} from "./kafka-series";

export type SeriesInfo = AlgorithmSeriesInfo | KafkaSeriesInfo;

export function getSeriesInfo(slug: string): SeriesInfo | null {
  return getAlgorithmSeriesInfo(slug) ?? getKafkaSeriesInfo(slug);
}
