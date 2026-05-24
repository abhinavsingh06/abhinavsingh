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
      const accessKey = "50d76527-8aaa-4be3-9610-af0ea18a4abe";
      const successUrl = "https://abhinavsingh.online/subscribe";

      const formData = new URLSearchParams();
      formData.append("access_key", accessKey);
      formData.append("email", email);
      formData.append("subject", "New Newsletter Subscription");
      formData.append("from_name", "Blog Newsletter");
      formData.append("message", `New newsletter subscription from: ${email}`);
      formData.append("success_url", successUrl);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error("Invalid response from server");
      }

      if (data.success === true) {
        try {
          await fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
        } catch (error) {
          console.error("Subscribe API error:", error);
        }

        setStatus("success");
        setMessage("You're in. Check your inbox.");
        setEmail("");
        toast.showToast("Successfully subscribed", "success");
      } else {
        setStatus("error");
        const errorMsg =
          data.message || "Something went wrong. Please try again.";
        setMessage(errorMsg);
        toast.showToast(errorMsg, "error");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      toast.showToast("Something went wrong. Please try again.", "error");
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
