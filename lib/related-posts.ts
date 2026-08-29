import type { BlogPost } from "./posts";
import { getAllPosts, getPostBySlug } from "./posts";
import { getSeriesInfo } from "./series";

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];

  const all = getAllPosts().filter((p) => p.slug !== slug);
  const related: BlogPost[] = [];
  const seen = new Set<string>();

  const series = getSeriesInfo(slug);
  if (series) {
    for (const ref of series.posts) {
      if (ref.slug === slug || seen.has(ref.slug)) continue;
      const match = all.find((p) => p.slug === ref.slug);
      if (match) {
        related.push(match);
        seen.add(match.slug);
      }
    }
  }

  for (const candidate of all) {
    if (related.length >= limit) break;
    if (candidate.category !== post.category || seen.has(candidate.slug)) continue;
    related.push(candidate);
    seen.add(candidate.slug);
  }

  return related.slice(0, limit);
}
