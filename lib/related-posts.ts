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
  const seriesSlugs = new Set(series?.posts.map((p) => p.slug) ?? []);

  for (const candidate of all) {
    if (related.length >= limit) break;
    if (seriesSlugs.has(candidate.slug) || seen.has(candidate.slug)) continue;
    if (candidate.category !== post.category) continue;
    related.push(candidate);
    seen.add(candidate.slug);
  }

  return related;
}
