interface PostOgThumbnailProps {
  slug: string;
  title: string;
  className?: string;
  priority?: boolean;
}

export default function PostOgThumbnail({
  slug,
  title,
  className = "",
  priority = false,
}: PostOgThumbnailProps) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--bg-elev)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/blog/${slug}/opengraph-image`}
        alt=""
        aria-hidden
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="aspect-[1200/630] h-full w-full object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.02]"
      />
      <span className="sr-only">{title}</span>
    </div>
  );
}
