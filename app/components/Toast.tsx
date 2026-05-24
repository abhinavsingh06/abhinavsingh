"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "info",
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const dotColor = {
    success: "var(--accent)",
    error: "var(--danger)",
    info: "var(--info)",
  }[type];

  return (
    <div
      role="status"
      className="reveal fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elev)] py-3 pl-4 pr-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{
          background: dotColor,
          boxShadow: `0 0 12px ${dotColor}`,
        }}
      />
      <span className="text-sm text-[var(--fg)]">{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--bg-elev-2)] hover:text-[var(--fg)]">
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8">
          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
