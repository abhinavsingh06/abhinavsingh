"use client";

import { useMemo, useEffect } from "react";
import CodeBlock from "./CodeBlock";
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
          <p
            key={keyCounter++}
            dangerouslySetInnerHTML={{ __html: processed }}
          />
        );
        paragraphContent = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        const items = listItems.map((item, idx) => {
          const processed = item
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/`(.+?)`/g, "<code>$1</code>");
          return (
            <li
              key={idx}
              dangerouslySetInnerHTML={{ __html: processed }}
            />
          );
        });
        if (listType === "ol") {
          elements.push(<ol key={keyCounter++}>{items}</ol>);
        } else {
          elements.push(<ul key={keyCounter++}>{items}</ul>);
        }
        listItems = [];
        inList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

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
            <Poll
              key={keyCounter++}
              question={question}
              options={pollOptions}
              pollId={`poll-${keyCounter}`}
            />
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
          let runnerCode = "";
          let j = i + 1;
          while (j < lines.length && !lines[j].trim().startsWith("```")) j++;
          if (j < lines.length) {
            j++;
            while (j < lines.length && !lines[j].trim().startsWith("```")) {
              runnerCode += lines[j] + "\n";
              j++;
            }
            if (runnerCode.trim()) {
              elements.push(
                <CodeRunner
                  key={keyCounter++}
                  code={runnerCode.trim()}
                  language={language}
                />
              );
            }
            i = j;
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
              <InteractiveDiagram
                key={keyCounter++}
                nodes={nodes}
                title={title}
              />
            );
            i = j - 1;
          } catch {
            const defaultNodes = [
              { id: "1", label: "Start", x: 50, y: 150, connections: ["2"] },
              { id: "2", label: "Process", x: 200, y: 150, connections: ["3"] },
              { id: "3", label: "End", x: 350, y: 150 },
            ];
            elements.push(
              <InteractiveDiagram
                key={keyCounter++}
                nodes={defaultNodes}
                title={title}
              />
            );
          }
        }
        continue;
      }

      if (trimmed.startsWith("```")) {
        if (inCodeBlock) {
          flushParagraph();
          flushList();
          const codeContent = codeBlockContent.join("\n").trim();
          if (codeContent) {
            elements.push(
              <CodeBlock
                key={keyCounter++}
                code={codeContent}
                language={codeBlockLanguage || "javascript"}
              />
            );
          }
          codeBlockContent = [];
          codeBlockLanguage = "";
          inCodeBlock = false;
        } else {
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

      if (trimmed.startsWith("# ")) {
        flushParagraph();
        flushList();
        const text = trimmed.substring(2);
        const id = generateId(text);
        headings.push({ id, text, level: 1 });
        elements.push(
          <h1 key={keyCounter++} id={id} className="scroll-mt-24">
            {text}
          </h1>
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
          <h2 key={keyCounter++} id={id} className="scroll-mt-24">
            {text}
          </h2>
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
          <h3 key={keyCounter++} id={id} className="scroll-mt-24">
            {text}
          </h3>
        );
        continue;
      }

      const numberedListMatch = trimmed.match(/^\d+\.\s+(.+)$/);
      if (numberedListMatch) {
        flushParagraph();
        if (!inList || listType !== "ol") {
          if (inList) flushList();
          inList = true;
          listType = "ol";
        }
        listItems.push(numberedListMatch[1]);
        continue;
      }

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        flushParagraph();
        if (!inList || listType !== "ul") {
          if (inList) flushList();
          inList = true;
          listType = "ul";
        }
        listItems.push(trimmed.substring(2));
        continue;
      }

      if (inList && trimmed === "") {
        flushList();
        continue;
      }

      if (trimmed === "") {
        flushParagraph();
        flushList();
        continue;
      }

      if (inList) flushList();

      paragraphContent.push(trimmed);
    }

    flushParagraph();
    flushList();

    if (inCodeBlock && codeBlockContent.length > 0) {
      const codeContent = codeBlockContent.join("\n").trim();
      if (codeContent) {
        elements.push(
          <CodeBlock
            key={keyCounter++}
            code={codeContent}
            language={codeBlockLanguage || "javascript"}
          />
        );
      }
    }

    return { elements, headings };
  }, [content]);

  useEffect(() => {
    if (onHeadingsExtracted) {
      onHeadingsExtracted(headings);
    }
  }, [headings, onHeadingsExtracted]);

  return <div className="prose">{elements}</div>;
}
