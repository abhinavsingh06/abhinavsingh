import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { use } from "react";
import { getAllSeries, getSeriesById } from "@/lib/series";
import { getPostBySlug } from "@/lib/posts";
import { siteUrl } from "@/lib/site";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import SeriesGuideCard from "../../components/SeriesGuideCard";

export function generateStaticParams() {
  return getAllSeries().map((series) => ({ id: series.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const series = getSeriesById(id);
  if (!series) return {};

  const url = `${siteUrl}/series/${id}`;

  return {
    title: `${series.title} — Series`,
    description: series.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${series.title} — Series`,
      description: series.description,
    },
  };
}

export default function SeriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const series = getSeriesById(id);
  if (!series) notFound();

  const posts = series.posts
    .map((ref, index) => {
      const post = getPostBySlug(ref.slug);
      if (!post) return null;
      return { ref, post, part: index + 1 };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <SiteHeader />

      <section className="mx-auto max-w-[1400px] px-5 pt-16 pb-10 sm:px-8 sm:pt-24">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono-xs text-[var(--muted)]">
          <Link
            href="/blog"
            className="transition-colors hover:text-[var(--fg)]">
            Writing
          </Link>
          <span aria-hidden>/</span>
          <Link
            href="/series"
            className="transition-colors hover:text-[var(--fg)]">
            Series
          </Link>
          <span aria-hidden>/</span>
          <span className="text-[var(--fg)]">{series.title}</span>
        </nav>
        <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)]">
          {series.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--fg-2)] sm:text-lg">
          {series.description}
        </p>
        <p className="mt-4 font-mono-xs text-[var(--muted)]">
          {posts.length} {posts.length === 1 ? "guide" : "guides"}
        </p>
      </section>

      <main className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-8">
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {posts.map(({ ref, post, part }) => (
            <SeriesGuideCard
              key={post.slug}
              seriesId={series.id}
              slug={post.slug}
              part={part}
              total={series.posts.length}
              topic={ref.topic}
              category={post.category}
              title={post.title}
              excerpt={post.excerpt}
            />
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
