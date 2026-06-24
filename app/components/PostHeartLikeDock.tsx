"use client";

import { useEffect, useState } from "react";
import HeartLike from "./HeartLike";

interface PostHeartLikeDockProps {
  postId: string;
  initialLikes?: number;
}

export default function PostHeartLikeDock({
  postId,
  initialLikes = 0,
}: PostHeartLikeDockProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop — margin dock */}
      <div
        className={`post-heart-dock post-heart-dock--desktop transition-all duration-500 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
        aria-hidden={!visible}>
        <div className="post-heart-dock-panel">
          <HeartLike
            postId={postId}
            initialLikes={initialLikes}
            variant="dock"
          />
        </div>
      </div>

      {/* Mobile — bottom thumb dock */}
      <div
        className={`post-heart-dock post-heart-dock--mobile transition-all duration-500 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0"
        }`}
        aria-hidden={!visible}>
        <div className="post-heart-dock-panel post-heart-dock-panel--mobile">
          <HeartLike
            postId={postId}
            initialLikes={initialLikes}
            variant="dock"
          />
        </div>
      </div>
    </>
  );
}
