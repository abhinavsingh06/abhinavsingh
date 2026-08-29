import type { BlogPost } from "./posts";
import { siteName, siteUrl } from "./site";

export function getPostUrl(slug: string): string {
  return `${siteUrl}/blog/${slug}`;
}

export function getPostOgImageUrl(slug: string): string {
  return `${siteUrl}/blog/${slug}/opengraph-image`;
}

export function buildPostJsonLd(post: BlogPost) {
  const url = getPostUrl(post.slug);
  const image = getPostOgImageUrl(post.slug);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: siteName,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    image: [image],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    articleSection: post.category,
    inLanguage: "en-US",
  };
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildRssItem(post: BlogPost): string {
  const url = getPostUrl(post.slug);
  const image = getPostOgImageUrl(post.slug);

  return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(post.category)}</category>
      <enclosure url="${escapeXml(image)}" type="image/png" />
    </item>`;
}
