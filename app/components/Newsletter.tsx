"use client";

import { useState } from "react";
import { useToast } from "./ToastProvider";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setStatus("success");
      setMessage(
        data.message === "Email already subscribed"
          ? "You're already subscribed."
          : "You're in. Check your inbox for a welcome email."
      );
      setEmail("");
      toast.showToast("Successfully subscribed", "success");
    } catch (error) {
      setStatus("error");
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setMessage(errorMsg);
      toast.showToast(errorMsg, "error");
      console.error("Newsletter subscription error:", error);
    }
  };

  return (
    <div className="card spotlight relative overflow-hidden p-8 sm:p-12">
      <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label-tag mb-6">/ Stay in the loop</p>
          <h2 className="font-display text-4xl sm:text-6xl">
            Get the next one in <br />
            your <span className="text-[var(--accent)]">inbox.</span>
          </h2>
          <p className="mt-6 max-w-md text-base text-[var(--fg-2)]">
            New essays and field notes sent only when there&apos;s something
            worth sending. No tracking, no spam, easy unsubscribe.
          </p>
        </div>

        <div className="lg:col-span-5 lg:self-end">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="font-mono-xs text-[var(--muted)]">/ Email</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@somewhere.com"
                required
                disabled={status === "loading"}
                className="flex-1 rounded-lg border border-[var(--line-strong)] bg-[var(--bg)] px-4 py-3 text-base text-[var(--fg)] placeholder:text-[var(--muted-2)] outline-none transition-colors focus:border-[var(--accent)]"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-60">
                {status === "loading" ? "Subscribing…" : "Subscribe"}
                {status !== "loading" && <span aria-hidden>↗</span>}
              </button>
            </div>
            {message && (
              <p
                className={`mt-1 text-sm ${
                  status === "success"
                    ? "text-[var(--accent)]"
                    : "text-[var(--danger)]"
                }`}>
                {message}
              </p>
            )}
            <p className="font-mono-xs mt-2 text-[var(--muted)]">
              Join · No spam · One-click unsubscribe
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
