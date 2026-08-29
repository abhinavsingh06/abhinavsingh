import Link from "next/link";
import { getAllSeries } from "@/lib/series";
import { siteUrl } from "@/lib/site";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import SeriesIndexCard from "../components/SeriesIndexCard";

export const metadata = {
  title: "Series",
  description: "Multi-part guides on algorithms, distributed systems, and more.",
  alternates: { canonical: `${siteUrl}/series` },
};

export default function SeriesIndexPage() {
  const seriesList = getAllSeries();

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
          <span className="text-[var(--fg)]">Series</span>
        </nav>
        <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)]">
          Multi-part <span className="text-[var(--accent)]">guides</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base text-[var(--fg-2)]">
          Longer topics split into readable chapters — with interactives where
          they help.
        </p>
      </section>

      <main className="mx-auto max-w-[1400px] grid grid-cols-1 gap-3 px-5 pb-20 sm:grid-cols-2 sm:gap-4 sm:px-8">
        {seriesList.map((series) => (
          <SeriesIndexCard
            key={series.id}
            id={series.id}
            title={series.title}
            description={series.description}
            guideCount={series.posts.length}
          />
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}
