import type { BlogPost } from "@/lib/posts";
import { buildPostJsonLd } from "@/lib/post-seo";

interface PostJsonLdProps {
  post: BlogPost;
}

export default function PostJsonLd({ post }: PostJsonLdProps) {
  const schema = buildPostJsonLd(post);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
