"use client";

import { useCallback, useState } from "react";
import { trackPostShare } from "@/lib/analytics";

interface PostShareProps {
  slug: string;
  title: string;
  url: string;
  compact?: boolean;
}

function shareUrl(platform: "linkedin" | "x", postUrl: string, title: string) {
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(title);

  if (platform === "linkedin") {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  }

  return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
}

export default function PostShare({
  slug,
  title,
  url,
  compact = false,
}: PostShareProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackPostShare(slug, "copy");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [slug, url]);

  const openShare = (platform: "linkedin" | "x") => {
    trackPostShare(slug, platform);
    window.open(shareUrl(platform, url, title), "_blank", "noopener,noreferrer");
  };

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-mono-xs text-[var(--muted)]">Share</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openShare("linkedin")}
            className="text-sm text-[var(--fg-2)] transition-colors hover:text-[var(--fg)]">
            LinkedIn
          </button>
          <span className="text-[var(--line)]" aria-hidden>
            ·
          </span>
          <button
            type="button"
            onClick={() => openShare("x")}
            className="text-sm text-[var(--fg-2)] transition-colors hover:text-[var(--fg)]">
            X
          </button>
          <span className="text-[var(--line)]" aria-hidden>
            ·
          </span>
          <button
            type="button"
            onClick={copyLink}
            className="text-sm text-[var(--fg-2)] transition-colors hover:text-[var(--fg)]">
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 min-w-0 border-y border-[var(--line)] py-6">
      <p className="font-mono-xs mb-4 text-[var(--muted)]">Share this post</p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => openShare("linkedin")}
          className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--fg-2)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)]">
          LinkedIn
        </button>
        <button
          type="button"
          onClick={() => openShare("x")}
          className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--fg-2)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)]">
          X
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--fg-2)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)]">
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
