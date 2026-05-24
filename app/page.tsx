import Link from "next/link";
import { getAllPosts, getCategories } from "@/lib/posts";
import Newsletter from "./components/Newsletter";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import SpotlightCard from "./components/SpotlightCard";
import NumberTicker from "./components/NumberTicker";
import LiveClock from "./components/LiveClock";
import ScrambleText from "./components/ScrambleText";

export default function Home() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 4);
  const categories = getCategories();
  const totalPosts = posts.length;
  const year = new Date().getFullYear();
  const yearsCoding = year - 2017;

  const marqueeWords = [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Go",
    "Postgres",
    "Redis",
    "Distributed Systems",
    "Developer Tools",
    "Design Engineering",
    "Performance",
  ];

  const techStack = [
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind",
    "Node.js",
    "Postgres",
    "Redis",
    "Docker",
  ];

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <SiteHeader />

      {/* ──────────────── HERO ──────────────── */}
      <section className="relative mx-auto max-w-[1400px] px-5 pt-10 sm:px-8 sm:pt-16">
        <div className="grid grid-cols-12 gap-3 sm:gap-4">
          {/* Big headline card */}
          <div className="col-span-12 row-span-2 lg:col-span-8">
            <SpotlightCard className="reveal h-full p-8 sm:p-12">
              <div className="relative z-10 flex h-full flex-col justify-between gap-12">
                <div>
                  <p className="font-mono-xs mb-6 text-[var(--muted)]">
                    <span className="dot-live mr-3 inline-block translate-y-[1px]" />
                    Portfolio / Field Notes · INDEX {year}
                  </p>
                  <h1 className="font-display text-[clamp(2.75rem,7vw,6.5rem)]">
                    Building things <br />
                    <span className="text-[var(--accent)]">
                      that don&apos;t
                    </span>
                    <br />
                    fall apart.
                  </h1>
                </div>

                <div className="flex flex-col gap-6">
                  <p className="max-w-xl text-base leading-[1.55] text-[var(--fg-2)] sm:text-[17px]">
                    I&apos;m Abhinav — a software engineer based in India. I
                    write code, ship products, and keep field notes on the
                    craft. This is where I think out loud.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href="/blog" className="btn btn-primary">
                      Read the writing <span aria-hidden>→</span>
                    </Link>
                    <Link href="#about" className="btn btn-ghost">
                      About me
                    </Link>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Avatar / status card */}
          <div className="col-span-6 lg:col-span-4">
            <SpotlightCard className="reveal reveal-1 h-full p-6">
              <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                <div className="flex items-center justify-between">
                  <p className="font-mono-xs text-[var(--muted)]">/ Operator</p>
                  <span className="dot-live" />
                </div>

                <div className="relative">
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-[var(--bg-elev-2)] to-[var(--bg-elev)] ring-1 ring-[var(--line-strong)]">
                    <div className="flex h-full w-full items-center justify-center">
                      <span
                        className="font-display text-[clamp(5rem,12vw,9rem)] leading-none text-[var(--accent)]"
                        aria-hidden>
                        AS
                      </span>
                    </div>
                  </div>
                  <span className="absolute -bottom-2 -right-2 inline-flex items-center gap-2 rounded-full border border-[var(--accent)] bg-[var(--bg)] px-3 py-1.5">
                    <span className="font-mono-xs text-[var(--accent)]">
                      ONLINE
                    </span>
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="font-mono-xs text-[var(--muted)]">Identifier</p>
                  <p className="font-mono-sm">
                    <ScrambleText text="@abhinavsingh" />
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Stat: years */}
          <div className="col-span-6 lg:col-span-2">
            <SpotlightCard className="reveal reveal-2 h-full p-6">
              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <p className="font-mono-xs text-[var(--muted)]">/ Tenure</p>
                <p className="font-display text-6xl leading-none">
                  <NumberTicker value={yearsCoding} />
                  <span className="ml-1 text-[var(--accent)]">y</span>
                </p>
                <p className="font-mono-xs text-[var(--muted)]">
                  Years writing code
                </p>
              </div>
            </SpotlightCard>
          </div>

          {/* Stat: posts */}
          <div className="col-span-6 lg:col-span-2">
            <SpotlightCard className="reveal reveal-3 h-full p-6">
              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <p className="font-mono-xs text-[var(--muted)]">/ Essays</p>
                <p className="font-display text-6xl leading-none">
                  <NumberTicker value={totalPosts} />
                </p>
                <Link
                  href="/blog"
                  className="link-arrow font-mono-xs text-[var(--accent)]">
                  Browse <span className="arrow">→</span>
                </Link>
              </div>
            </SpotlightCard>
          </div>

          {/* Location / clock */}
          <div className="col-span-12 lg:col-span-4">
            <SpotlightCard className="reveal reveal-4 h-full p-6">
              <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono-xs text-[var(--muted)]">/ Locale</p>
                  <p className="font-mono-xs text-[var(--accent)]">28.6°N 77.2°E</p>
                </div>
                <p className="font-display text-4xl">India</p>
                <div className="flex items-end justify-between border-t border-[var(--line)] pt-4">
                  <p className="font-mono-xs text-[var(--muted)]">Local time</p>
                  <p className="text-[var(--accent)]">
                    <LiveClock />
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Tech stack inline */}
        <div className="reveal reveal-5 mt-6 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ──────────────── MARQUEE ──────────────── */}
      <section className="relative mt-24 border-y border-[var(--line)] py-6">
        <div className="marquee marquee-fast">
          <div className="marquee-track font-display text-4xl sm:text-6xl">
            {[...marqueeWords, ...marqueeWords].map((w, i) => (
              <span key={i} className="flex items-center gap-10">
                {w}
                <span className="text-[var(--accent)]">★</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── WRITING ──────────────── */}
      <section
        id="writing"
        className="relative mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 sm:pt-36">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label-tag mb-4">/ 01 — Recent writing</p>
            <h2 className="font-display text-5xl sm:text-7xl">
              Notes &amp; <span className="text-[var(--accent)]">essays</span>
            </h2>
          </div>
          <Link href="/blog" className="link-arrow font-mono-sm">
            All {totalPosts} posts <span className="arrow">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {recentPosts.map((post, i) => (
            <SpotlightCard
              key={post.slug}
              as="a"
              href={`/blog/${post.slug}`}
              className={`reveal group block p-6 sm:p-8 ${
                i === 0 ? "sm:col-span-2 sm:row-span-1" : ""
              }`}>
              <div className="relative z-10 flex h-full flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="chip chip-accent">{post.category}</span>
                    <span className="font-mono-xs text-[var(--muted)]">
                      {post.readTime}
                    </span>
                  </div>
                  <span className="font-mono-xs text-[var(--muted)]">
                    {String(i + 1).padStart(2, "0")} / {recentPosts.length}
                  </span>
                </div>

                <h3
                  className={`font-display leading-[1.05] transition-colors group-hover:text-[var(--accent)] ${
                    i === 0 ? "text-4xl sm:text-6xl" : "text-3xl sm:text-4xl"
                  }`}>
                  {post.title}
                </h3>

                <p className="text-[15px] leading-relaxed text-[var(--fg-2)]">
                  {post.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-[var(--line)] pt-4">
                  <span className="font-mono-xs text-[var(--muted)]">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </span>
                  <span className="link-arrow font-mono-sm text-[var(--accent)]">
                    Read <span className="arrow">→</span>
                  </span>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ──────────────── TOPICS ──────────────── */}
      <section
        id="topics"
        className="relative mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 sm:pt-36">
        <p className="label-tag mb-4">/ 02 — Topics</p>
        <h2 className="font-display mb-12 text-5xl sm:text-7xl">
          What I think <span className="text-[var(--accent)]">about</span>
        </h2>

        <ul className="flex flex-wrap gap-2 sm:gap-3">
          {categories.map((cat) => (
            <li key={cat}>
              <Link
                href={`/blog?category=${encodeURIComponent(cat)}`}
                className="group inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--bg-elev)] px-5 py-2.5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]">
                <span className="text-sm font-medium transition-colors group-hover:text-[var(--accent)]">
                  {cat}
                </span>
                <span className="font-mono-xs text-[var(--muted)] transition-colors group-hover:text-[var(--accent)]">
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ──────────────── REVERSE MARQUEE ──────────────── */}
      <section className="relative mt-28 border-y border-[var(--line)] py-5">
        <div className="marquee marquee-reverse">
          <div className="marquee-track font-mono-sm text-[var(--muted)]">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                BUILD · SHIP · WRITE · REPEAT
                <span className="text-[var(--accent)]">✦</span>
                {year} EDITION
                <span className="text-[var(--accent)]">✦</span>
                CRAFTED IN INDIA
                <span className="text-[var(--accent)]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── ABOUT ──────────────── */}
      <section
        id="about"
        className="relative mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 sm:pt-36">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <p className="label-tag mb-4">/ 03 — About</p>
            <h2 className="font-display text-5xl sm:text-6xl">
              Operator&apos;s
              <br />
              <span className="text-[var(--accent)]">manual.</span>
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <SpotlightCard className="p-6">
                <p className="font-mono-xs mb-3 text-[var(--muted)]">
                  / Background
                </p>
                <p className="text-base leading-relaxed text-[var(--fg-2)]">
                  I&apos;m a software engineer with{" "}
                  <NumberTicker value={yearsCoding} suffix="+ years" /> of
                  experience building web apps, developer tools, and the
                  unglamorous middle layers that keep systems honest.
                </p>
              </SpotlightCard>

              <SpotlightCard className="p-6">
                <p className="font-mono-xs mb-3 text-[var(--muted)]">/ Care about</p>
                <ul className="space-y-2 text-sm text-[var(--fg-2)]">
                  <li className="flex items-baseline gap-3">
                    <span className="text-[var(--accent)]">›</span>
                    Performance &amp; correctness over speed of shipping
                  </li>
                  <li className="flex items-baseline gap-3">
                    <span className="text-[var(--accent)]">›</span>
                    Honest design — no dark patterns, no tracking pixels
                  </li>
                  <li className="flex items-baseline gap-3">
                    <span className="text-[var(--accent)]">›</span>
                    Writing clearly about complicated things
                  </li>
                  <li className="flex items-baseline gap-3">
                    <span className="text-[var(--accent)]">›</span>
                    The boring parts that make things last
                  </li>
                </ul>
              </SpotlightCard>

              <SpotlightCard className="p-6 sm:col-span-2">
                <p className="font-mono-xs mb-4 text-[var(--muted)]">/ Currently</p>
                <p className="text-lg leading-relaxed">
                  Writing software for a living. Writing about software for
                  myself. Reading too much. Available for{" "}
                  <span className="stroke-accent">interesting problems</span>{" "}
                  and the right kind of trouble.
                </p>
                <a
                  href="mailto:hello@abhinavsingh.online"
                  className="btn btn-primary mt-6">
                  Say hello <span aria-hidden>↗</span>
                </a>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── NEWSLETTER ──────────────── */}
      <section
        id="newsletter"
        className="relative mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 sm:pt-36">
        <Newsletter />
      </section>

      <SiteFooter />
    </div>
  );
}
