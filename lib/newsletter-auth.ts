import type { NextRequest } from "next/server";

export function isNewsletterAuthorized(request: NextRequest): boolean {
  const secrets = [
    process.env.NEWSLETTER_SECRET,
    process.env.CRON_SECRET,
  ].filter((value): value is string => Boolean(value?.trim()));

  if (secrets.length === 0) {
    return process.env.NODE_ENV !== "production";
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length);
    if (secrets.includes(token)) return true;
  }

  const secretParam = new URL(request.url).searchParams.get("secret");
  return secretParam !== null && secrets.includes(secretParam);
}
