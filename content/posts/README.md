# Blog Posts Directory

This directory contains all blog posts in Markdown format.

## Adding a New Blog Post

1. Create a new `.md` file in this directory
2. Use the filename as the slug (e.g., `my-new-post.md` will have slug `my-new-post`)
3. Add frontmatter at the top of the file with the following format:

```markdown
---
title: Your Post Title
excerpt: A brief description of your post
date: YYYY-MM-DD
category: Category Name
featured: true
---

# Your Post Title

Your content here...
```

## Frontmatter Fields

- **title** (required): The title of your blog post
- **excerpt** (required): A short description shown in post listings
- **date** (required): Publication date in YYYY-MM-DD format
- **category** (required): The category (e.g., "JavaScript", "Git", "React")
- **featured** (optional): Set to `true` to feature the post, `false` or omit to not feature

## Content Formatting

- Use standard Markdown syntax
- Code blocks with triple backticks: \`\`\`language
- Lists (both numbered and bulleted) are supported
- Headers use # for H1, ## for H2, ### for H3

## Example

```markdown
---
title: My Awesome Post
excerpt: This is a great post about something interesting
date: 2024-12-21
category: JavaScript
featured: true
---

# My Awesome Post

This is the content of my post.

## Section 1

Some content here.

\`\`\`javascript
console.log("Hello, World!");
\`\`\`
```

## Notes

- The read time is automatically calculated based on word count
- Posts are automatically sorted by date (newest first)
- The slug is derived from the filename (without .md extension)
