"use client";

import { useMemo, useEffect } from "react";
import CodeBlock from "./CodeBlock";
import ScrollReveal from "./ScrollReveal";
import Poll from "./Poll";
import CodeRunner from "./CodeRunner";
import InteractiveDiagram from "./InteractiveDiagram";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface BlogContentProps {
  content: string;
  onHeadingsExtracted?: (headings: Heading[]) => void;
}

export default function BlogContent({
  content,
  onHeadingsExtracted,
}: BlogContentProps) {
  const { elements, headings } = useMemo(() => {
    // Unescape backticks in content
    const unescapedContent = content
      .replace(/\\`\\`\\`/g, "```")
      .replace(/\\`/g, "`");
    const lines = unescapedContent.split("\n");
    const elements: React.ReactElement[] = [];
    const headings: Heading[] = [];
    let inList = false;
    let listType: "ul" | "ol" = "ul";
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLanguage = "";
    let listItems: string[] = [];
    let paragraphContent: string[] = [];
    let keyCounter = 0;

    const generateId = (text: string): string => {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    const flushParagraph = () => {
      if (paragraphContent.length > 0) {
        const text = paragraphContent.join(" ");
        const processed = text
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/`(.+?)`/g, "<code>$1</code>");
        elements.push(
          <ScrollReveal key={keyCounter++} delay={50}>
            <p dangerouslySetInnerHTML={{ __html: processed }} />
          </ScrollReveal>
        );
        paragraphContent = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        if (listType === "ol") {
          elements.push(
            <ol key={keyCounter++} className="list-decimal pl-6">
              {listItems.map((item, idx) => {
                const processed = item
                  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                  .replace(/`(.+?)`/g, "<code>$1</code>");
                return (
                  <li
                    key={idx}
                    className="my-2"
                    dangerouslySetInnerHTML={{ __html: processed }}
                  />
                );
              })}
            </ol>
          );
        } else {
          elements.push(
            <ul key={keyCounter++} className="list-disc pl-6">
              {listItems.map((item, idx) => {
                const processed = item
                  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                  .replace(/`(.+?)`/g, "<code>$1</code>");
                return (
                  <li
                    key={idx}
                    className="my-2"
                    dangerouslySetInnerHTML={{ __html: processed }}
                  />
                );
              })}
            </ul>
          );
        }
        listItems = [];
        inList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Handle special directives
      if (trimmed.startsWith("[POLL:")) {
        flushParagraph();
        flushList();
        const pollMatch = trimmed.match(/\[POLL:(.+?)\]/);
        if (pollMatch) {
          const parts = pollMatch[1].split("|");
          const question = parts[0];
          const pollOptions = parts.slice(1).map((opt, idx) => ({
            id: `opt-${idx}`,
            text: opt.trim(),
            votes: 0,
          }));
          elements.push(
            <ScrollReveal key={keyCounter++} delay={100}>
              <Poll
                question={question}
                options={pollOptions}
                pollId={`poll-${keyCounter}`}
              />
            </ScrollReveal>
          );
        }
        continue;
      }

      if (trimmed.startsWith("[CODE-RUNNER:")) {
        flushParagraph();
        flushList();
        const runnerMatch = trimmed.match(/\[CODE-RUNNER:(.+?)\]/);
        if (runnerMatch) {
          const language = runnerMatch[1].trim();
          // Look ahead for the code block
          let runnerCode = "";
          let j = i + 1;
          while (j < lines.length && !lines[j].trim().startsWith("```")) {
            j++;
          }
          if (j < lines.length) {
            j++; // Skip opening ```
            while (j < lines.length && !lines[j].trim().startsWith("```")) {
              runnerCode += lines[j] + "\n";
              j++;
            }
            if (runnerCode.trim()) {
              elements.push(
                <ScrollReveal key={keyCounter++} delay={100}>
                  <CodeRunner code={runnerCode.trim()} language={language} />
                </ScrollReveal>
              );
            }
            i = j; // Skip processed lines
          }
        }
        continue;
      }

      if (trimmed.startsWith("[DIAGRAM:")) {
        flushParagraph();
        flushList();
        const diagramMatch = trimmed.match(/\[DIAGRAM:(.+?)\]/);
        if (diagramMatch) {
          const title = diagramMatch[1].trim();
          // Look ahead for JSON structure
          const jsonLines: string[] = [];
          let j = i + 1;
          while (j < lines.length && !lines[j].trim().startsWith("```")) {
            jsonLines.push(lines[j]);
            j++;
          }
          try {
            const jsonStr = jsonLines.join("\n");
            const nodes = JSON.parse(jsonStr);
            elements.push(
              <ScrollReveal key={keyCounter++} delay={100}>
                <InteractiveDiagram nodes={nodes} title={title} />
              </ScrollReveal>
            );
            i = j - 1; // Skip processed lines
          } catch {
            // If JSON parsing fails, create a simple default diagram
            const defaultNodes = [
              { id: "1", label: "Start", x: 50, y: 150, connections: ["2"] },
              { id: "2", label: "Process", x: 200, y: 150, connections: ["3"] },
              { id: "3", label: "End", x: 350, y: 150 },
            ];
            elements.push(
              <ScrollReveal key={keyCounter++} delay={100}>
                <InteractiveDiagram nodes={defaultNodes} title={title} />
              </ScrollReveal>
            );
          }
        }
        continue;
      }

      // Handle code blocks
      if (trimmed.startsWith("```")) {
        if (inCodeBlock) {
          // End code block
          flushParagraph();
          flushList();
          const codeContent = codeBlockContent.join("\n").trim();
          if (codeContent) {
            elements.push(
              <ScrollReveal key={keyCounter++} delay={100}>
                <CodeBlock
                  code={codeContent}
                  language={codeBlockLanguage || "javascript"}
                />
              </ScrollReveal>
            );
          }
          codeBlockContent = [];
          codeBlockLanguage = "";
          inCodeBlock = false;
        } else {
          // Start code block
          flushParagraph();
          flushList();
          codeBlockLanguage = trimmed.substring(3).trim() || "javascript";
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // Handle headers
      if (trimmed.startsWith("# ")) {
        flushParagraph();
        flushList();
        const text = trimmed.substring(2);
        const id = generateId(text);
        headings.push({ id, text, level: 1 });
        elements.push(
          <ScrollReveal key={keyCounter++} delay={0}>
            <h1
              id={id}
              className="mb-4 mt-8 text-3xl font-bold text-blue-900 dark:text-blue-100 sm:text-4xl scroll-mt-24">
              <span className="text-gradient-animated">{text}</span>
            </h1>
          </ScrollReveal>
        );
        continue;
      }
      if (trimmed.startsWith("## ")) {
        flushParagraph();
        flushList();
        const text = trimmed.substring(3);
        const id = generateId(text);
        headings.push({ id, text, level: 2 });
        elements.push(
          <ScrollReveal key={keyCounter++} delay={0}>
            <h2
              id={id}
              className="mb-3 mt-6 text-2xl font-bold text-blue-900 dark:text-blue-100 sm:text-3xl scroll-mt-24">
              <span className="text-gradient-animated">{text}</span>
            </h2>
          </ScrollReveal>
        );
        continue;
      }
      if (trimmed.startsWith("### ")) {
        flushParagraph();
        flushList();
        const text = trimmed.substring(4);
        const id = generateId(text);
        headings.push({ id, text, level: 3 });
        elements.push(
          <ScrollReveal key={keyCounter++} delay={0}>
            <h3
              id={id}
              className="mb-2 mt-4 text-xl font-bold text-blue-900 dark:text-blue-100 sm:text-2xl scroll-mt-24">
              <span className="text-gradient-animated">{text}</span>
            </h3>
          </ScrollReveal>
        );
        continue;
      }

      // Handle numbered list items (1. 2. 3. etc.)
      const numberedListMatch = trimmed.match(/^\d+\.\s+(.+)$/);
      if (numberedListMatch) {
        flushParagraph();
        if (!inList || listType !== "ol") {
          if (inList) {
            flushList();
          }
          inList = true;
          listType = "ol";
        }
        listItems.push(numberedListMatch[1]);
        continue;
      }

      // Handle bullet list items
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        flushParagraph();
        if (!inList || listType !== "ul") {
          if (inList) {
            flushList();
          }
          inList = true;
          listType = "ul";
        }
        listItems.push(trimmed.substring(2));
        continue;
      }

      // Close list if we were in one and hit empty line
      if (inList && trimmed === "") {
        flushList();
        continue;
      }

      // Handle regular paragraphs
      if (trimmed === "") {
        flushParagraph();
        flushList();
        continue;
      }

      if (inList) {
        flushList();
      }

      paragraphContent.push(trimmed);
    }

    flushParagraph();
    flushList();

    // Handle unclosed code block at end of content
    if (inCodeBlock && codeBlockContent.length > 0) {
      const codeContent = codeBlockContent.join("\n").trim();
      if (codeContent) {
        elements.push(
          <ScrollReveal key={keyCounter++} delay={100}>
            <CodeBlock
              code={codeContent}
              language={codeBlockLanguage || "javascript"}
            />
          </ScrollReveal>
        );
      }
    }

    return { elements, headings };
  }, [content]);

  // Notify parent of extracted headings
  useEffect(() => {
    if (onHeadingsExtracted) {
      onHeadingsExtracted(headings);
    }
  }, [headings, onHeadingsExtracted]);

  return (
    <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-blue-900 dark:prose-headings:text-blue-100 prose-headings:leading-tight prose-p:text-blue-800/90 dark:prose-p:text-blue-200/90 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-semibold prose-strong:text-blue-900 dark:prose-strong:text-blue-100 prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-li:text-blue-800/90 dark:prose-li:text-blue-200/90">
      {elements}
    </div>
  );
}
