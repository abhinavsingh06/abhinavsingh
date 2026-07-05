import { track } from "@vercel/analytics";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Push a GTM dataLayer event for GA4 conversion tags. */
function pushDataLayerEvent(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/** Fire on a new newsletter signup (not duplicate emails). */
export function trackNewsletterSignup(source = "newsletter_form") {
  pushDataLayerEvent({
    event: "newsletter_signup",
    newsletter_source: source,
  });

  if (process.env.NODE_ENV === "production") {
    track("newsletter_signup", { source });
  }
}

/** Fire when a reader continues an algorithm series. */
export function trackSeriesContinue(
  fromSlug: string,
  toSlug: string,
  placement: "read_next" | "series_prev" | "series_complete" | "review_prev"
) {
  pushDataLayerEvent({
    event: "series_continue",
    series_from: fromSlug,
    series_to: toSlug,
    series_placement: placement,
  });

  if (process.env.NODE_ENV === "production") {
    track("series_continue", { from: fromSlug, to: toSlug, placement });
  }
}
