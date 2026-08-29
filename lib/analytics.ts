import { track } from "@vercel/analytics";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type AnalyticsParams = Record<
  string,
  string | number | boolean | undefined
>;

export interface PostAnalyticsContext {
  post_slug: string;
  post_category: string;
  series_id?: string;
}

export type NewsletterPlacement = "homepage" | "blog_index" | "post_footer";

export type SharePlatform = "linkedin" | "x" | "copy";

export type SeriesPlacement =
  | "read_next"
  | "series_prev"
  | "series_complete"
  | "review_prev";

export type SeriesHubPlacement = "series_index" | "homepage";

const SCROLL_DEPTHS = [25, 50, 75, 90] as const;
export type ScrollDepth = (typeof SCROLL_DEPTHS)[number];

function pushDataLayerEvent(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

function pagePath(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.location.pathname;
}

/** Central analytics entry — GTM dataLayer + Vercel Analytics (production). */
export function trackEvent(event: string, params: AnalyticsParams = {}) {
  const payload: Record<string, unknown> = {
    event,
    page_path: pagePath(),
    ...params,
  };

  pushDataLayerEvent(payload);

  if (process.env.NODE_ENV !== "production") return;

  const vercelParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) vercelParams[key] = String(value);
  }
  track(event, vercelParams);
}

export function postContextParams(
  ctx: PostAnalyticsContext
): AnalyticsParams {
  return {
    post_slug: ctx.post_slug,
    post_category: ctx.post_category,
    series_id: ctx.series_id,
  };
}

/** Once per post page load. */
export function trackPostView(ctx: PostAnalyticsContext) {
  trackEvent("post_view", postContextParams(ctx));
}

/** Scroll milestones — fires once per depth per page load. */
export function trackArticleScroll(
  ctx: PostAnalyticsContext,
  depth: ScrollDepth
) {
  trackEvent("article_scroll", {
    ...postContextParams(ctx),
    scroll_depth: depth,
  });
}

/** Reader reached ~90% scroll depth. */
export function trackArticleComplete(ctx: PostAnalyticsContext) {
  trackEvent("article_complete", postContextParams(ctx));
}

export function trackNewsletterSignup(
  placement: NewsletterPlacement = "post_footer"
) {
  trackEvent("newsletter_signup", { newsletter_source: placement });
}

export function trackPostShare(slug: string, platform: SharePlatform) {
  trackEvent("post_share", {
    post_slug: slug,
    share_platform: platform,
  });
}

export function trackSeriesContinue(
  fromSlug: string,
  toSlug: string,
  placement: SeriesPlacement
) {
  trackEvent("series_continue", {
    series_from: fromSlug,
    series_to: toSlug,
    series_placement: placement,
  });
}

export function trackStartHereClick(postSlug: string, seriesId?: string) {
  trackEvent("start_here_click", {
    post_slug: postSlug,
    series_id: seriesId,
  });
}

export function trackRelatedPostClick(fromSlug: string, toSlug: string) {
  trackEvent("related_post_click", {
    post_slug: fromSlug,
    related_post_slug: toSlug,
  });
}

export function trackPollVote(
  postSlug: string,
  pollId: string,
  optionText: string
) {
  trackEvent("poll_vote", {
    post_slug: postSlug,
    poll_id: pollId,
    poll_option: optionText,
  });
}

export function trackPostLike(postSlug: string, liked: boolean) {
  trackEvent("post_like", {
    post_slug: postSlug,
    liked,
  });
}

export function trackSeriesHubClick(
  seriesId: string,
  placement: SeriesHubPlacement
) {
  trackEvent("series_hub_click", {
    series_id: seriesId,
    hub_placement: placement,
  });
}

export function trackSeriesPostClick(seriesId: string, postSlug: string) {
  trackEvent("series_post_click", {
    series_id: seriesId,
    post_slug: postSlug,
  });
}

export function postSlugFromPollId(pollId: string): string {
  const marker = "-poll-";
  const index = pollId.indexOf(marker);
  if (index === -1) return pollId;
  return pollId.slice(0, index);
}

export { SCROLL_DEPTHS };
