import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-40 border-t border-[var(--line)] bg-[var(--bg)]">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono-xs mb-6 text-[var(--muted)]">
              <span className="dot-live mr-2 inline-block translate-y-[1px]" />
              Open to interesting problems
            </p>
            <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)]">
              Let&apos;s build
              <br />
              <span className="text-[var(--accent)]">something good.</span>
            </h2>
            <a
              href="mailto:hello@abhinavsingh.online"
              className="btn btn-primary mt-10">
              hello@abhinavsingh.online
              <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-10">
              <div>
                <p className="font-mono-xs mb-4 text-[var(--muted)]">
                  / Elsewhere
                </p>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://github.com/abhinavsingh"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-arrow font-mono-sm">
                      GitHub <span className="arrow">↗</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://twitter.com/"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-arrow font-mono-sm">
                      Twitter <span className="arrow">↗</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com/"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-arrow font-mono-sm">
                      LinkedIn <span className="arrow">↗</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://read.cv/"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-arrow font-mono-sm">
                      Read.cv <span className="arrow">↗</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-mono-xs mb-4 text-[var(--muted)]">/ Site</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="link-arrow font-mono-sm">
                      Index <span className="arrow">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="link-arrow font-mono-sm">
                      Writing <span className="arrow">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#about" className="link-arrow font-mono-sm">
                      About <span className="arrow">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#newsletter" className="link-arrow font-mono-sm">
                      Newsletter <span className="arrow">→</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Massive watermark wordmark */}
        <div className="mt-20 select-none overflow-hidden">
          <p
            className="font-display whitespace-nowrap text-[clamp(4rem,18vw,18rem)] leading-[0.85] tracking-[-0.06em] text-[var(--bg-elev)]"
            aria-hidden>
            ABHINAV<span className="text-[var(--accent)]">.</span>
          </p>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center">
          <p className="font-mono-xs text-[var(--muted)]">
            © {year} — Made with care · No cookies, no tracking pixels
          </p>
          <p className="font-mono-xs text-[var(--muted)]">
            ABHINAV / v2.0 / {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
