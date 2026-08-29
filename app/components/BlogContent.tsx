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
import BinarySearchAnimation from "./BinarySearchAnimation";
import BinarySearchQuickRef from "./BinarySearchQuickRef";
import BinarySearchPracticeLadder from "./BinarySearchPracticeLadder";
import BinarySearchComplexitySheet from "./BinarySearchComplexitySheet";
import BinarySearchPatternOverview from "./BinarySearchPatternOverview";
import BinarySearchVsLinear from "./BinarySearchVsLinear";
import LinkedListAnimation from "./LinkedListAnimation";
import LinkedListQuickRef from "./LinkedListQuickRef";
import LinkedListPracticeLadder from "./LinkedListPracticeLadder";
import LinkedListComplexitySheet from "./LinkedListComplexitySheet";
import LinkedListPatternOverview from "./LinkedListPatternOverview";
import LinkedListVsArrays from "./LinkedListVsArrays";
import StackQueueAnimation from "./StackQueueAnimation";
import StackQueueQuickRef from "./StackQueueQuickRef";
import StackQueuePracticeLadder from "./StackQueuePracticeLadder";
import StackQueueComplexitySheet from "./StackQueueComplexitySheet";
import StackQueuePatternOverview from "./StackQueuePatternOverview";
import StackQueueVsComparison from "./StackQueueVsComparison";
import GoOriginTimeline from "./GoOriginTimeline";
import GoOmittedFeatures from "./GoOmittedFeatures";
import GoVsCppSheet from "./GoVsCppSheet";
import GoWhenToUse from "./GoWhenToUse";
import GoPhilosophyPillars from "./GoPhilosophyPillars";
import GoCleverVsSimple from "./GoCleverVsSimple";
import GoBoringCodeDebate from "./GoBoringCodeDebate";
import GoVarBasics from "./GoVarBasics";
import GoZeroValueLab from "./GoZeroValueLab";
import GoDeclCompare from "./GoDeclCompare";
import GoUninitDebate from "./GoUninitDebate";
import GoControlFlowTopics from "./GoControlFlowTopics";
import GoForShapes from "./GoForShapes";
import GoWhileDebate from "./GoWhileDebate";
import KafkaFlowCompare from "./KafkaFlowCompare";
import KafkaFitChecker from "./KafkaFitChecker";

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
    let skippedDuplicateTitle = false;

    const generateId = (text: string): string => {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    const processInline = (text: string) => {
      const slots: string[] = [];
      const park = (html: string) => {
        slots.push(html);
        return `\u0000${slots.length - 1}\u0000`;
      };

      let out = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
        const safeHref = href.trim();
        const allowed =
          safeHref.startsWith("/") ||
          safeHref.startsWith("https://") ||
          safeHref.startsWith("http://") ||
          safeHref.startsWith("#") ||
          safeHref.startsWith("mailto:");
        if (!allowed) return label;
        const isExternal = /^https?:\/\//.test(safeHref);
        const attrs = isExternal
          ? ` href="${safeHref}" target="_blank" rel="noopener noreferrer"`
          : ` href="${safeHref}"`;
        return park(`<a${attrs}>${label}</a>`);
      });

      out = out.replace(/`([^`]+)`/g, (_match, code: string) =>
        park(`<code>${code}</code>`)
      );
      out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      out = out.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>");
      out = out.replace(/\u0000(\d+)\u0000/g, (_match, idx: string) => slots[Number(idx)] ?? "");
      return out;
    };

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
          const processed = processInline(item);
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

      if (trimmed === "[BINARY-SEARCH-PATTERNS]") {
        flushParagraph();
        flushList();
        elements.push(<BinarySearchPatternOverview key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[BINARY-SEARCH-PRACTICE]") {
        flushParagraph();
        flushList();
        elements.push(<BinarySearchPracticeLadder key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[BINARY-SEARCH-QUICK-REF]") {
        flushParagraph();
        flushList();
        elements.push(<BinarySearchQuickRef key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[BINARY-SEARCH-COMPLEXITY]") {
        flushParagraph();
        flushList();
        elements.push(<BinarySearchComplexitySheet key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[BINARY-SEARCH-VS-LINEAR]") {
        flushParagraph();
        flushList();
        elements.push(<BinarySearchVsLinear key={keyCounter++} />);
        continue;
      }

      if (trimmed.startsWith("[BINARY-SEARCH:")) {
        flushParagraph();
        flushList();
        const bsMatch = trimmed.match(/\[BINARY-SEARCH:(.+?)\]/);
        if (bsMatch) {
          const preset = bsMatch[1].trim();
          elements.push(
            <BinarySearchAnimation key={keyCounter++} preset={preset} />
          );
        }
        continue;
      }

      if (trimmed === "[LINKED-LIST-PATTERNS]") {
        flushParagraph();
        flushList();
        elements.push(<LinkedListPatternOverview key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[LINKED-LIST-PRACTICE]") {
        flushParagraph();
        flushList();
        elements.push(<LinkedListPracticeLadder key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[LINKED-LIST-QUICK-REF]") {
        flushParagraph();
        flushList();
        elements.push(<LinkedListQuickRef key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[LINKED-LIST-COMPLEXITY]") {
        flushParagraph();
        flushList();
        elements.push(<LinkedListComplexitySheet key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[LINKED-LIST-VS-ARRAYS]") {
        flushParagraph();
        flushList();
        elements.push(<LinkedListVsArrays key={keyCounter++} />);
        continue;
      }

      if (trimmed.startsWith("[LINKED-LIST:")) {
        flushParagraph();
        flushList();
        const llMatch = trimmed.match(/\[LINKED-LIST:(.+?)\]/);
        if (llMatch) {
          const preset = llMatch[1].trim();
          elements.push(
            <LinkedListAnimation key={keyCounter++} preset={preset} />
          );
        }
        continue;
      }

      if (trimmed === "[STACK-QUEUE-PATTERNS]") {
        flushParagraph();
        flushList();
        elements.push(<StackQueuePatternOverview key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[STACK-QUEUE-PRACTICE]") {
        flushParagraph();
        flushList();
        elements.push(<StackQueuePracticeLadder key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[STACK-QUEUE-QUICK-REF]") {
        flushParagraph();
        flushList();
        elements.push(<StackQueueQuickRef key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[STACK-QUEUE-COMPLEXITY]") {
        flushParagraph();
        flushList();
        elements.push(<StackQueueComplexitySheet key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[STACK-QUEUE-VS]") {
        flushParagraph();
        flushList();
        elements.push(<StackQueueVsComparison key={keyCounter++} />);
        continue;
      }

      if (trimmed.startsWith("[STACK-QUEUE:")) {
        flushParagraph();
        flushList();
        const sqMatch = trimmed.match(/\[STACK-QUEUE:(.+?)\]/);
        if (sqMatch) {
          const preset = sqMatch[1].trim();
          elements.push(
            <StackQueueAnimation key={keyCounter++} preset={preset} />
          );
        }
        continue;
      }

      if (trimmed === "[GO-ORIGIN-TIMELINE]") {
        flushParagraph();
        flushList();
        elements.push(<GoOriginTimeline key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[GO-OMITTED-FEATURES]") {
        flushParagraph();
        flushList();
        elements.push(<GoOmittedFeatures key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[GO-VS-CPP]") {
        flushParagraph();
        flushList();
        elements.push(<GoVsCppSheet key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[GO-WHEN-TO-USE]") {
        flushParagraph();
        flushList();
        elements.push(<GoWhenToUse key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[GO-PHILOSOPHY-PILLARS]") {
        flushParagraph();
        flushList();
        elements.push(<GoPhilosophyPillars key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[GO-CLEVER-VS-SIMPLE]") {
        flushParagraph();
        flushList();
        elements.push(<GoCleverVsSimple key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[GO-BORING-CODE-DEBATE]") {
        flushParagraph();
        flushList();
        elements.push(<GoBoringCodeDebate key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[GO-VAR-BASICS]") {
        flushParagraph();
        flushList();
        elements.push(<GoVarBasics key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[GO-ZERO-VALUE-LAB]") {
        flushParagraph();
        flushList();
        elements.push(<GoZeroValueLab key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[GO-DECL-COMPARE]") {
        flushParagraph();
        flushList();
        elements.push(<GoDeclCompare key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[GO-UNINIT-DEBATE]") {
        flushParagraph();
        flushList();
        elements.push(<GoUninitDebate key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[GO-CONTROL-FLOW]") {
        flushParagraph();
        flushList();
        elements.push(<GoControlFlowTopics key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[GO-FOR-SHAPES]") {
        flushParagraph();
        flushList();
        elements.push(<GoForShapes key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[GO-WHILE-DEBATE]") {
        flushParagraph();
        flushList();
        elements.push(<GoWhileDebate key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[KAFKA-FLOW-COMPARE]") {
        flushParagraph();
        flushList();
        elements.push(<KafkaFlowCompare key={keyCounter++} />);
        continue;
      }

      if (trimmed === "[KAFKA-FIT-CHECKER]") {
        flushParagraph();
        flushList();
        elements.push(<KafkaFitChecker key={keyCounter++} />);
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

      if (trimmed.startsWith(">")) {
        flushParagraph();
        flushList();
        const quoteLines: string[] = [];
        let j = i;
        while (j < lines.length) {
          const quoteTrimmed = lines[j].trim();
          if (!quoteTrimmed.startsWith(">")) break;
          // Ignore git conflict markers accidentally starting with >
          if (/^>{7}/.test(quoteTrimmed)) break;
          quoteLines.push(quoteTrimmed.replace(/^>\s?/, ""));
          j++;
        }
        if (quoteLines.length > 0) {
          const quoteHtml = processInline(quoteLines.join(" "));
          elements.push(
            <blockquote
              key={keyCounter++}
              dangerouslySetInnerHTML={{ __html: quoteHtml }}
            />
          );
          i = j - 1;
          continue;
        }
      }

      if (trimmed.startsWith("# ")) {
        flushParagraph();
        flushList();
        // Page template already renders the post title — skip the duplicate markdown H1
        if (!skippedDuplicateTitle) {
          skippedDuplicateTitle = true;
          continue;
        }
        const text = trimmed.substring(2);
        const id = generateId(text.replace(/[*`[\]]/g, ""));
        headings.push({ id, text: text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1"), level: 1 });
        elements.push(
          <h1
            key={keyCounter++}
            id={id}
            className="scroll-mt-24"
            dangerouslySetInnerHTML={{ __html: processInline(text) }}
          />
        );
        continue;
      }
      if (trimmed.startsWith("## ")) {
        flushParagraph();
        flushList();
        const text = trimmed.substring(3);
        const id = generateId(text.replace(/[*`[\]]/g, ""));
        headings.push({ id, text: text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1"), level: 2 });
        elements.push(
          <h2
            key={keyCounter++}
            id={id}
            className="scroll-mt-24"
            dangerouslySetInnerHTML={{ __html: processInline(text) }}
          />
        );
        continue;
      }
      if (trimmed.startsWith("### ")) {
        flushParagraph();
        flushList();
        const text = trimmed.substring(4);
        const id = generateId(text.replace(/[*`[\]]/g, ""));
        headings.push({ id, text: text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1"), level: 3 });
        elements.push(
          <h3
            key={keyCounter++}
            id={id}
            className="scroll-mt-24"
            dangerouslySetInnerHTML={{ __html: processInline(text) }}
          />
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

      // Markdown `---` / `***` / `___` — never print as text; headings already separate sections
      if (/^([-*_])\1{2,}$/.test(trimmed)) {
        flushParagraph();
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
