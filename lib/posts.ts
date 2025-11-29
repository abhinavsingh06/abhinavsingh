export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "building-modern-web-apps",
    title: "Building Modern Web Applications in 2024",
    excerpt:
      "Exploring the latest trends, tools, and techniques for building scalable and performant web applications.",
    content: `# Building Modern Web Applications in 2024

The landscape of web development continues to evolve at a rapid pace. In this post, I'll share my insights on the latest trends and best practices for building modern web applications.

## The Foundation

Modern web applications require a solid foundation. This includes:

- **Performance**: Fast load times and smooth interactions
- **Accessibility**: Ensuring everyone can use your application
- **Responsive Design**: Works seamlessly across all devices
- **Security**: Protecting user data and preventing vulnerabilities

## Key Technologies

### React and Next.js

React continues to dominate the frontend landscape, and Next.js provides an excellent framework for building production-ready applications. The App Router introduced in Next.js 13+ brings server components and improved performance.

### TypeScript

Type safety is no longer optional. TypeScript helps catch errors early and makes codebases more maintainable.

### Tailwind CSS

Utility-first CSS frameworks like Tailwind CSS enable rapid development while maintaining consistency.

## Best Practices

1. **Component Architecture**: Build reusable, composable components
2. **State Management**: Choose the right tool for the job
3. **Testing**: Write tests that give you confidence
4. **Documentation**: Document your code and decisions

## Conclusion

Building modern web applications requires staying current with the latest tools and practices while maintaining focus on the fundamentals: performance, accessibility, and user experience.`,
    date: "2024-01-15",
    category: "Web Development",
    readTime: "5 min read",
    featured: true,
  },
  {
    slug: "understanding-react-server-components",
    title: "Understanding React Server Components",
    excerpt:
      "A deep dive into React Server Components and how they're changing the way we build React applications.",
    content: `# Understanding React Server Components

React Server Components represent a fundamental shift in how we think about React applications. Let's explore what they are and why they matter.

## What Are Server Components?

Server Components are React components that run exclusively on the server. They can access backend resources directly and send less JavaScript to the client.

## Benefits

- **Reduced Bundle Size**: Less JavaScript sent to the client
- **Direct Backend Access**: Access databases and file systems directly
- **Better Security**: Keep sensitive logic on the server
- **Improved Performance**: Faster initial page loads

## How They Work

Server Components are rendered on the server and their output is sent to the client. They can be mixed with Client Components, which run in the browser.

## Use Cases

- Data fetching
- Accessing backend resources
- Keeping sensitive information secure
- Reducing client-side JavaScript

## Conclusion

Server Components are a powerful addition to React that enable new patterns and better performance. Understanding when and how to use them is crucial for modern React development.`,
    date: "2024-01-10",
    category: "React",
    readTime: "6 min read",
    featured: true,
  },
  {
    slug: "the-art-of-code-review",
    title: "The Art of Code Review",
    excerpt:
      "Best practices for conducting effective code reviews that improve code quality and team collaboration.",
    content: `# The Art of Code Review

Code review is one of the most important practices in software development. It's not just about finding bugs—it's about sharing knowledge and maintaining code quality.

## Why Code Reviews Matter

Code reviews serve multiple purposes:

- **Quality Assurance**: Catch bugs before they reach production
- **Knowledge Sharing**: Team members learn from each other
- **Consistency**: Maintain coding standards across the team
- **Mentorship**: Help junior developers grow

## Best Practices

### Be Constructive

Focus on the code, not the person. Provide specific, actionable feedback.

### Ask Questions

Instead of demanding changes, ask questions that help the author think through the problem.

### Balance Speed and Thoroughness

Find the right balance between quick reviews and thorough examination.

### Review for Multiple Aspects

- Functionality: Does it work?
- Performance: Is it efficient?
- Security: Are there vulnerabilities?
- Maintainability: Will it be easy to maintain?

## Common Pitfalls

- Being too nitpicky about style
- Not explaining the "why" behind suggestions
- Taking too long to review
- Being defensive when receiving feedback

## Conclusion

Effective code review is a skill that improves with practice. By following these best practices, you can make code reviews a positive experience that benefits the entire team.`,
    date: "2024-01-05",
    category: "Engineering",
    readTime: "4 min read",
    featured: false,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured);
}
