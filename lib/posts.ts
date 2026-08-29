import fs from "fs";
import path from "path";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  updated?: string;
  category: string;
  readTime: string;
  featured?: boolean;
  draft?: boolean;
}

const postsDirectory = path.join(process.cwd(), "content/posts");

function parseMarkdownFile(fileContent: string, filename: string): BlogPost {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    throw new Error(`Invalid markdown file format: ${filename}`);
  }

  const frontmatter = match[1];
  const content = match[2].trim();

  const metadata: Record<string, string> = {};
  frontmatter.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line
        .substring(colonIndex + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      metadata[key] = value;
    }
  });

  const slug = filename.replace(/\.md$/, "");
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  return {
    slug,
    title: metadata.title || "",
    excerpt: metadata.excerpt || "",
    content,
    date: metadata.date || "",
    updated: metadata.updated || undefined,
    category: metadata.category || "",
    readTime: `${readTime} min read`,
    featured: metadata.featured === "true",
    draft: metadata.draft === "true",
  };
}

const excludedFiles = ["README.md", ".DS_Store", "INTERACTIVE_FEATURES.md"];

function shouldExcludeFile(filename: string): boolean {
  return (
    excludedFiles.includes(filename) ||
    filename.startsWith("_") ||
    filename.startsWith(".")
  );
}

function isPublished(post: BlogPost): boolean {
  return !post.draft;
}

export function getAllPosts(): BlogPost[] {
  try {
    const filenames = fs.readdirSync(postsDirectory);
    const posts = filenames
      .filter(
        (filename) => filename.endsWith(".md") && !shouldExcludeFile(filename)
      )
      .map((filename) => {
        try {
          const filePath = path.join(postsDirectory, filename);
          const fileContent = fs.readFileSync(filePath, "utf8");
          return parseMarkdownFile(fileContent, filename);
        } catch (error) {
          console.error(`Error parsing ${filename}:`, error);
          return null;
        }
      })
      .filter((post): post is BlogPost => post !== null)
      .filter(isPublished)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
  } catch (error) {
    console.error("Error reading posts:", error);
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  try {
    const filename = `${slug}.md`;

    if (shouldExcludeFile(filename)) {
      return undefined;
    }

    const filePath = path.join(postsDirectory, filename);
    if (!fs.existsSync(filePath)) {
      return undefined;
    }
    const fileContent = fs.readFileSync(filePath, "utf8");
    const post = parseMarkdownFile(fileContent, filename);
    if (!isPublished(post)) {
      return undefined;
    }
    return post;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return undefined;
  }
}

export function getCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories).sort();
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.featured);
}
