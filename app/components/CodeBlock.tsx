"use client";

import { useMemo, useState } from "react";
import Prism from "prismjs";
import { useToast } from "./ToastProvider";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markup";

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const normalizedLanguage = language.toLowerCase() || "javascript";
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  // Highlight code - Prism is safe to use in useMemo as it's deterministic
  const highlightedCode = useMemo(() => {
    try {
      const grammar =
        Prism.languages[normalizedLanguage] || Prism.languages.javascript;
      return Prism.highlight(code, grammar, normalizedLanguage);
    } catch {
      // Fallback to plain text if highlighting fails
      return code;
    }
  }, [code, normalizedLanguage]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.showToast("Code copied to clipboard! ✨", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
      toast.showToast("Failed to copy code", "error");
    }
  };

  return (
    <div className="code-block-wrapper my-8 group px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-xl bg-[#1e1e1e] shadow-2xl transition-all duration-300 hover:shadow-blue-500/20 hover:scale-[1.01]">
        {/* VS Code-like header */}
        <div className="flex items-center gap-2 bg-[#252526] px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-sm"></div>
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-sm"></div>
            <div className="h-3 w-3 rounded-full bg-[#27c93f] shadow-sm"></div>
          </div>
          <div className="ml-3 flex-1 text-center">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {normalizedLanguage}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="ml-auto flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:bg-[#3e3e3e] hover:text-slate-200 active:scale-95"
            title="Copy code">
            {copied ? (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        {/* Code content */}
        <div className="overflow-x-auto bg-[#1e1e1e]">
          <pre
            className="m-0 px-8 py-6 sm:px-10 sm:py-8 text-sm leading-relaxed"
            suppressHydrationWarning>
            <code
              className={`language-${normalizedLanguage}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
              suppressHydrationWarning
            />
          </pre>
        </div>
      </div>
    </div>
  );
}
