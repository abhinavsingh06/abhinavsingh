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
      // Web3Forms must be called from client-side (browser) to avoid Cloudflare protection
      const accessKey = "50d76527-8aaa-4be3-9610-af0ea18a4abe";
      const successUrl = "https://abhinavsingh.online/subscribe";

      // Create form data
      const formData = new URLSearchParams();
      formData.append("access_key", accessKey);
      formData.append("email", email);
      formData.append("subject", "New Newsletter Subscription");
      formData.append("from_name", "Blog Newsletter");
      formData.append("message", `New newsletter subscription from: ${email}`);
      formData.append("success_url", successUrl);

      // Call Web3Forms directly from client
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        // If response is not JSON, it might be an error
        throw new Error("Invalid response from server");
      }

      if (data.success === true) {
        // Store subscriber locally and send welcome email (handled server-side)
        try {
          const subscribeResponse = await fetch("/api/subscribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          const subscribeData = await subscribeResponse
            .json()
            .catch(() => ({}));

          if (!subscribeResponse.ok) {
            console.error("Subscribe API error:", {
              status: subscribeResponse.status,
              data: subscribeData,
            });
          } else {
            console.log(
              "Subscriber added and welcome email sent:",
              subscribeData
            );
          }
        } catch (error) {
          console.error("Error storing subscriber:", error);
        }

        setStatus("success");
        setMessage(
          "Thanks for subscribing! Check your email for a welcome message! 🎉"
        );
        setEmail("");
        setShowConfetti(true);
        toast.showToast("Successfully subscribed! 🎉", "success");
        setTimeout(() => setShowConfetti(false), 3000);
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
    <>
      <Confetti trigger={showConfetti} />
      <section className="ocean-card mx-auto max-w-2xl rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 shadow-sm transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <div className="text-center">
          <h2 className="mb-3 text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100">
            Stay Updated
          </h2>
          <p className="mb-4 sm:mb-6 text-sm sm:text-base text-blue-700 dark:text-blue-300 px-2">
            Get the latest posts and insights delivered straight to your inbox.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:gap-4 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === "loading"}
              className="flex-1 rounded-lg border border-blue-300 bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-blue-900 placeholder-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-100 dark:placeholder-blue-400 dark:focus:border-blue-400 relative z-10"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="ocean-button rounded-lg px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:whitespace-nowrap relative z-10">
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {message && (
            <p
              className={`mt-3 sm:mt-4 text-xs sm:text-sm ${
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
