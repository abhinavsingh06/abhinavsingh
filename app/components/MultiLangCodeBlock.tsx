"use client";

import { useMemo, useState } from "react";
import Prism from "prismjs";
import { useToast } from "./ToastProvider";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-go";

export interface CodeSnippet {
  language: string;
  code: string;
}

interface MultiLangCodeBlockProps {
  snippets: CodeSnippet[];
}

const LANG_ORDER = ["javascript", "typescript", "go"];

const LANG_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  go: "Go",
};

function sortSnippets(snippets: CodeSnippet[]): CodeSnippet[] {
  return [...snippets].sort((a, b) => {
    const ai = LANG_ORDER.indexOf(a.language.toLowerCase());
    const bi = LANG_ORDER.indexOf(b.language.toLowerCase());
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

export default function MultiLangCodeBlock({
  snippets,
}: MultiLangCodeBlockProps) {
  const ordered = useMemo(() => sortSnippets(snippets), [snippets]);
  const [activeLang, setActiveLang] = useState(
    ordered[0]?.language.toLowerCase() ?? "javascript"
  );
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const active =
    ordered.find((s) => s.language.toLowerCase() === activeLang) ?? ordered[0];

  const highlightedCode = useMemo(() => {
    if (!active) return "";
    const lang = active.language.toLowerCase();
    try {
      const grammar =
        Prism.languages[lang] || Prism.languages.javascript;
      return Prism.highlight(active.code, grammar, lang);
    } catch {
      return active.code;
    }
  }, [active]);

  const handleCopy = async () => {
    if (!active) return;
    try {
      await navigator.clipboard.writeText(active.code);
      setCopied(true);
      toast.showToast("Code copied to clipboard! ✨", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
      toast.showToast("Failed to copy code", "error");
    }
  };

  if (!active) return null;

  return (
    <div className="code-block-wrapper my-6 sm:my-8 group">
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-[#1e1e1e] shadow-2xl transition-all duration-300 hover:shadow-blue-500/20">
        <div className="flex items-center gap-1 sm:gap-2 bg-[#252526] px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex gap-1 sm:gap-1.5 flex-shrink-0">
            <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-[#27c93f]" />
          </div>

          <div className="ml-1 flex flex-1 gap-1 overflow-x-auto">
            {ordered.map((snippet) => {
              const lang = snippet.language.toLowerCase();
              const isActive = lang === activeLang;
              return (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={[
                    "rounded px-2.5 py-1 font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-[#3e3e3e] text-slate-100"
                      : "text-slate-500 hover:text-slate-300",
                  ].join(" ")}>
                  {LANG_LABELS[lang] ?? lang}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCopy}
            className="ml-auto flex items-center gap-1 sm:gap-2 rounded px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-slate-400 transition-all hover:bg-[#3e3e3e] hover:text-slate-200 active:scale-95 flex-shrink-0"
            title="Copy code">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="overflow-x-auto bg-[#1e1e1e]">
          <pre
            className="m-0 px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 text-xs sm:text-sm leading-relaxed"
            suppressHydrationWarning>
            <code
              className={`language-${active.language.toLowerCase()}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
              suppressHydrationWarning
            />
          </pre>
        </div>
      </div>
    </div>
  );
}
