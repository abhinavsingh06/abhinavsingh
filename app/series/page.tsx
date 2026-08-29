import Link from "next/link";
import { getAllSeries } from "@/lib/series";
import { siteUrl } from "@/lib/site";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import SpotlightCard from "../components/SpotlightCard";

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
          <SpotlightCard
            key={series.id}
            as="a"
            href={`/series/${series.id}`}
            className="group block p-6 sm:p-8">
            <div className="relative z-10 flex h-full flex-col gap-4">
              <span className="font-mono-xs text-[var(--muted)]">
                {series.posts.length}{" "}
                {series.posts.length === 1 ? "guide" : "guides"}
              </span>
              <h2 className="font-display text-3xl leading-tight transition-colors group-hover:text-[var(--accent)] sm:text-4xl">
                {series.title}
              </h2>
              <p className="text-[15px] leading-relaxed text-[var(--fg-2)]">
                {series.description}
              </p>
              <span className="link-arrow mt-auto font-mono-sm text-[var(--accent)]">
                View series <span className="arrow">→</span>
              </span>
            </div>
          </SpotlightCard>
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}
