"use client";

import { useMemo, useEffect } from "react";
import CodeBlock from "./CodeBlock";
import Poll from "./Poll";
import CodeRunner from "./CodeRunner";
import InteractiveDiagram from "./InteractiveDiagram";
import SlidingWindowAnimation from "./SlidingWindowAnimation";
import MultiLangCodeBlock from "./MultiLangCodeBlock";
import PracticeProblemsLadder from "./PracticeProblemsLadder";
import SlidingWindowQuickRef from "./SlidingWindowQuickRef";
import GitWorkflowAnimation from "./GitWorkflowAnimation";
import GitBranchingAnimation from "./GitBranchingAnimation";
import GitBranchingGuide from "./GitBranchingGuide";
import GitBranchingStrategies from "./GitBranchingStrategies";
import TwoPointersAnimation from "./TwoPointersAnimation";
import TwoPointersQuickRef from "./TwoPointersQuickRef";
import TwoPointersPracticeLadder from "./TwoPointersPracticeLadder";
import TwoPointersComplexitySheet from "./TwoPointersComplexitySheet";
import TwoPointersPatternOverview from "./TwoPointersPatternOverview";
import TwoPointersVsSlidingWindow from "./TwoPointersVsSlidingWindow";
import PrefixSumAnimation from "./PrefixSumAnimation";
import PrefixSumQuickRef from "./PrefixSumQuickRef";
import PrefixSumPracticeLadder from "./PrefixSumPracticeLadder";
import PrefixSumComplexitySheet from "./PrefixSumComplexitySheet";
import PrefixSumPatternOverview from "./PrefixSumPatternOverview";
import PrefixSumVsOthers from "./PrefixSumVsOthers";
import HashingAnimation from "./HashingAnimation";
import HashingQuickRef from "./HashingQuickRef";
import HashingPracticeLadder from "./HashingPracticeLadder";
import HashingComplexitySheet from "./HashingComplexitySheet";
import HashingPatternOverview from "./HashingPatternOverview";
import HashingVsArrays from "./HashingVsArrays";

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

    const processInline = (text: string) =>
      text
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/`(.+?)`/g, "<code>$1</code>");

    const isTableRow = (text: string) =>
      text.startsWith("|") && text.endsWith("|") && text.split("|").length > 2;

    const isTableSeparator = (text: string) =>
      /^\|[\s:|\-]+\|$/.test(text);

    const parseTableCells = (text: string) =>
      text.slice(1, -1).split("|").map((c) => c.trim());

    const renderMarkdownTable = (tableLines: string[]) => {
      if (tableLines.length < 2 || !isTableSeparator(tableLines[1])) return null;

      const headers = parseTableCells(tableLines[0]);
      const rows = tableLines.slice(2).map(parseTableCells);

      return (
        <div
          key={keyCounter++}
          className="my-6 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--bg)]">
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className="px-4 py-3 font-mono-xs font-semibold uppercase tracking-wide text-[var(--muted)] sm:px-5"
                      dangerouslySetInnerHTML={{ __html: processInline(header) }}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((cells, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={`border-b border-[var(--line)] last:border-b-0 ${
                      rowIdx % 2 === 0 ? "bg-transparent" : "bg-[var(--bg)]/40"
                    } hover:bg-[var(--accent-soft)]/20`}>
                    {headers.map((_, colIdx) => (
                      <td
                        key={colIdx}
                        className="px-4 py-3.5 text-sm text-[var(--fg-2)] sm:px-5"
                        dangerouslySetInnerHTML={{
                          __html: processInline(cells[colIdx] ?? ""),
                        }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    const flushParagraph = () => {
      if (paragraphContent.length > 0) {
        const text = paragraphContent.join(" ");
        const processed = processInline(text);
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

      if (trimmed === "[GIT-STRATEGIES]") {
        flushParagraph();
        flushList();
        elements.push(<GitBranchingStrategies key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[GIT-GUIDE]") {
        flushParagraph();
        flushList();
        elements.push(<GitBranchingGuide key={keyCounter++} />);
        continue;
      }

      if (trimmed.startsWith("[GIT-WORKFLOW:")) {
        flushParagraph();
        flushList();
        const match = trimmed.match(/\[GIT-WORKFLOW:(.+?)\]/);
        if (match) {
          elements.push(
            <GitWorkflowAnimation key={keyCounter++} preset={match[1].trim()} />
          );
        }
        continue;
      }

      if (trimmed.startsWith("[GIT-BRANCHING:")) {
        flushParagraph();
        flushList();
        const match = trimmed.match(/\[GIT-BRANCHING:(.+?)\]/);
        if (match) {
          elements.push(
            <GitBranchingAnimation key={keyCounter++} preset={match[1].trim()} />
          );
        }
        continue;
      }

      if (trimmed === "[PRACTICE-PROBLEMS]") {
        flushParagraph();
        flushList();
        elements.push(<PracticeProblemsLadder key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[TWO-POINTERS-PRACTICE]") {
        flushParagraph();
        flushList();
        elements.push(<TwoPointersPracticeLadder key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[QUICK-REF]") {
        flushParagraph();
        flushList();
        elements.push(<SlidingWindowQuickRef key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[TWO-POINTERS-QUICK-REF]") {
        flushParagraph();
        flushList();
        elements.push(<TwoPointersQuickRef key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[TWO-POINTERS-PATTERNS]") {
        flushParagraph();
        flushList();
        elements.push(<TwoPointersPatternOverview key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[TWO-POINTERS-VS-SW]") {
        flushParagraph();
        flushList();
        elements.push(<TwoPointersVsSlidingWindow key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[TWO-POINTERS-COMPLEXITY]") {
        flushParagraph();
        flushList();
        elements.push(<TwoPointersComplexitySheet key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[CODE-TABS]") {
        flushParagraph();
        flushList();
        const snippets: { language: string; code: string }[] = [];
        let j = i + 1;
        while (j < lines.length && lines[j].trim().startsWith("```")) {
          const lang = lines[j].trim().substring(3).trim() || "javascript";
          j++;
          const codeLines: string[] = [];
          while (j < lines.length && !lines[j].trim().startsWith("```")) {
            codeLines.push(lines[j]);
            j++;
          }
          if (codeLines.length > 0) {
            snippets.push({
              language: lang,
              code: codeLines.join("\n").trim(),
            });
          }
          if (j < lines.length && lines[j].trim().startsWith("```")) j++;
        }
        if (snippets.length > 0) {
          elements.push(
            <MultiLangCodeBlock key={keyCounter++} snippets={snippets} />
          );
        }
        i = j - 1;
        continue;
      }

      if (trimmed.startsWith("[SLIDING-WINDOW:")) {
        flushParagraph();
        flushList();
        const swMatch = trimmed.match(/\[SLIDING-WINDOW:(.+?)\]/);
        if (swMatch) {
          const preset = swMatch[1].trim();
          elements.push(
            <SlidingWindowAnimation key={keyCounter++} preset={preset} />
          );
        }
        continue;
      }

      if (trimmed.startsWith("[TWO-POINTERS:")) {
        flushParagraph();
        flushList();
        const tpMatch = trimmed.match(/\[TWO-POINTERS:(.+?)\]/);
        if (tpMatch) {
          const preset = tpMatch[1].trim();
          elements.push(
            <TwoPointersAnimation key={keyCounter++} preset={preset} />
          );
        }
        continue;
      }

      if (trimmed === "[PREFIX-SUM-PATTERNS]") {
        flushParagraph();
        flushList();
        elements.push(<PrefixSumPatternOverview key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[PREFIX-SUM-PRACTICE]") {
        flushParagraph();
        flushList();
        elements.push(<PrefixSumPracticeLadder key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[PREFIX-SUM-QUICK-REF]") {
        flushParagraph();
        flushList();
        elements.push(<PrefixSumQuickRef key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[PREFIX-SUM-COMPLEXITY]") {
        flushParagraph();
        flushList();
        elements.push(<PrefixSumComplexitySheet key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[PREFIX-SUM-VS-OTHERS]") {
        flushParagraph();
        flushList();
        elements.push(<PrefixSumVsOthers key={keyCounter++} />);
        continue;
      }

      if (trimmed.startsWith("[PREFIX-SUM:")) {
        flushParagraph();
        flushList();
        const psMatch = trimmed.match(/\[PREFIX-SUM:(.+?)\]/);
        if (psMatch) {
          const preset = psMatch[1].trim();
          elements.push(
            <PrefixSumAnimation key={keyCounter++} preset={preset} />
          );
        }
        continue;
      }

      if (trimmed === "[HASHING-PATTERNS]") {
        flushParagraph();
        flushList();
        elements.push(<HashingPatternOverview key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[HASHING-PRACTICE]") {
        flushParagraph();
        flushList();
        elements.push(<HashingPracticeLadder key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[HASHING-QUICK-REF]") {
        flushParagraph();
        flushList();
        elements.push(<HashingQuickRef key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[HASHING-COMPLEXITY]") {
        flushParagraph();
        flushList();
        elements.push(<HashingComplexitySheet key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[HASHING-VS-ARRAYS]") {
        flushParagraph();
        flushList();
        elements.push(<HashingVsArrays key={keyCounter++} />);
        continue;
      }

      if (trimmed.startsWith("[HASHING:")) {
        flushParagraph();
        flushList();
        const hashMatch = trimmed.match(/\[HASHING:(.+?)\]/);
        if (hashMatch) {
          const preset = hashMatch[1].trim();
          elements.push(
            <HashingAnimation key={keyCounter++} preset={preset} />
          );
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

      if (isTableRow(trimmed)) {
        flushParagraph();
        flushList();
        const tableLines: string[] = [trimmed];
        let j = i + 1;
        while (j < lines.length && isTableRow(lines[j].trim())) {
          tableLines.push(lines[j].trim());
          j++;
        }
        const table = renderMarkdownTable(tableLines);
        if (table) {
          elements.push(table);
        } else {
          paragraphContent.push(...tableLines);
        }
        i = j - 1;
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
