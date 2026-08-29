"use client";

import { useEffect, useRef } from "react";
import {
  SCROLL_DEPTHS,
  trackArticleComplete,
  trackArticleScroll,
  trackPostView,
  type PostAnalyticsContext,
} from "@/lib/analytics";

interface PostAnalyticsProps {
  context: PostAnalyticsContext;
}

export default function PostAnalytics({ context }: PostAnalyticsProps) {
  const viewed = useRef(false);
  const scrollFired = useRef<Set<number>>(new Set());
  const completed = useRef(false);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    trackPostView(context);
  }, [context]);

  useEffect(() => {
    const update = () => {
      const { scrollHeight, clientHeight } = document.documentElement;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) return;

      const pct = (window.scrollY / maxScroll) * 100;

      for (const depth of SCROLL_DEPTHS) {
        if (pct < depth || scrollFired.current.has(depth)) continue;
        scrollFired.current.add(depth);
        trackArticleScroll(context, depth);
        if (depth >= 90 && !completed.current) {
          completed.current = true;
          trackArticleComplete(context);
        }
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [context]);

  return null;
}
