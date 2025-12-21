"use client";

import { useState, useMemo } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";

interface CodeRunnerProps {
  code: string;
  language: string;
}

export default function CodeRunner({ code, language }: CodeRunnerProps) {
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const normalizedLanguage = language.toLowerCase() || "javascript";

  // Highlight code
  const highlightedCode = useMemo(() => {
    try {
      const grammar =
        Prism.languages[normalizedLanguage] || Prism.languages.javascript;
      return Prism.highlight(code, grammar, normalizedLanguage);
    } catch {
      return code;
    }
  }, [code, normalizedLanguage]);

  const runCode = () => {
    setIsRunning(true);
    setError("");
    setOutput("");

    try {
      if (language === "javascript" || language === "js") {
        // Capture console.log output
        const logs: string[] = [];
        const originalLog = console.log;
        const originalError = console.error;

        console.log = (...args: any[]) => {
          logs.push(
            args
              .map((arg) => {
                if (typeof arg === "object") {
                  try {
                    return JSON.stringify(arg, null, 2);
                  } catch {
                    return String(arg);
                  }
                }
                return String(arg);
              })
              .join(" ")
          );
        };

        console.error = (...args: any[]) => {
          logs.push("ERROR: " + args.map((arg) => String(arg)).join(" "));
        };

        try {
          // Use Function constructor for safer execution
          const func = new Function(code);
          const result = func();

          console.log = originalLog;
          console.error = originalError;

          if (result !== undefined) {
            setOutput(
              logs.join("\n") + (logs.length > 0 ? "\n" : "") + String(result)
            );
          } else {
            setOutput(logs.join("\n") || "Code executed successfully!");
          }
        } catch (err: any) {
          console.log = originalLog;
          console.error = originalError;
          setError(err.message || "An error occurred");
        }
      } else {
        setError(`Code execution for ${language} is not yet supported.`);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="my-8 overflow-hidden rounded-xl border-2 border-blue-200/50 dark:border-blue-800/50 bg-[#1e1e1e] shadow-xl">
      {/* Header with Run button */}
      <div className="flex items-center justify-between border-b border-slate-700 bg-[#252526] px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {language}
        </span>
        <button
          onClick={runCode}
          disabled={isRunning}
          className="ocean-button rounded px-4 py-1.5 text-xs font-semibold text-white transition-all disabled:opacity-50">
          {isRunning ? "Running..." : "▶ Run Code"}
        </button>
      </div>

      {/* Code display */}
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

      {/* Output section */}
      {(output || error) && (
        <div className="border-t border-slate-700 bg-[#252526] p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Output:
          </div>
          <pre
            className={`overflow-x-auto rounded bg-[#1e1e1e] p-4 text-sm ${
              error ? "text-red-400" : "text-green-400"
            }`}>
            {error || output}
          </pre>
        </div>
      )}
    </div>
  );
}
