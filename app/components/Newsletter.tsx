"use client";

import { useState } from "react";
import { useToast } from "./ToastProvider";
import Confetti from "./Confetti";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Thanks for subscribing! Check your email to confirm.");
        setEmail("");
        setShowConfetti(true);
        toast.showToast("Successfully subscribed! 🎉", "success");
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        toast.showToast(
          data.error || "Something went wrong. Please try again.",
          "error"
        );
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      toast.showToast("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <>
      <Confetti trigger={showConfetti} />
      <section className="ocean-card mx-auto max-w-2xl rounded-2xl p-8 shadow-sm sm:p-12 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <div className="text-center">
          <h2 className="mb-3 text-2xl font-bold text-blue-900 sm:text-3xl dark:text-blue-100">
            Stay Updated
          </h2>
          <p className="mb-6 text-blue-700 dark:text-blue-300">
            Get the latest posts and insights delivered straight to your inbox.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === "loading"}
              className="flex-1 rounded-lg border border-blue-300 bg-white px-4 py-3 text-blue-900 placeholder-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-100 dark:placeholder-blue-400 dark:focus:border-blue-400 relative z-10"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="ocean-button rounded-lg px-6 py-3 font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:whitespace-nowrap relative z-10">
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {message && (
            <p
              className={`mt-4 text-sm ${
                status === "success"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-red-600 dark:text-red-400"
              }`}>
              {message}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
