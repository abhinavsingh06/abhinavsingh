import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import LiveClock from "./LiveClock";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur-md">
      {/* Top utility strip */}
      <div className="border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-2 sm:px-8">
          <div className="font-mono-xs flex items-center gap-3 text-[var(--muted)]">
            <span className="dot-live" />
            <span>Currently available · INDIA</span>
          </div>
          <div className="font-mono-xs hidden items-center gap-4 text-[var(--muted)] sm:flex">
            <LiveClock />
            <span>·</span>
            <span>v2.0</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--line-strong)] bg-[var(--bg-elev)] font-mono-sm font-semibold text-[var(--accent)] transition-transform group-hover:rotate-[-8deg]">
            ⌘
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-semibold tracking-tight">Abhinav Singh</span>
            <span className="font-mono-xs mt-1 text-[var(--muted)]">
              Software / Writing
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="font-mono-sm rounded-lg px-3 py-1.5 text-[var(--fg-2)] transition-colors hover:bg-[var(--bg-elev)] hover:text-[var(--accent)]">
            Index
          </Link>
          <Link
            href="/blog"
            className="font-mono-sm rounded-lg px-3 py-1.5 text-[var(--fg-2)] transition-colors hover:bg-[var(--bg-elev)] hover:text-[var(--accent)]">
            Writing
          </Link>
          <Link
            href="/#about"
            className="font-mono-sm hidden rounded-lg px-3 py-1.5 text-[var(--fg-2)] transition-colors hover:bg-[var(--bg-elev)] hover:text-[var(--accent)] sm:inline-flex">
            About
          </Link>
          <a
            href="mailto:hello@abhinavsingh.online"
            className="font-mono-sm ml-2 hidden rounded-lg border border-[var(--line-strong)] px-3 py-1.5 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:inline-flex">
            Contact
          </a>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
