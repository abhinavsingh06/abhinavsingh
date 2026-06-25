/**
 * HTML email templates — matches site theme (After Dark / electric lime).
 * Inline styles only for email client compatibility.
 */

import type { BlogPost } from "./posts";
import { DEFAULT_CONTACT_EMAIL } from "./email";

const SITE_URL = "https://abhinavsingh.online";

const C = {
  bg: "#0a0a0a",
  bgElev: "#111111",
  bgElev2: "#161616",
  fg: "#ededec",
  fg2: "#cfcfca",
  muted: "#8a8a85",
  line: "rgba(255,255,255,0.1)",
  accent: "#d4ff3a",
  accentSoft: "rgba(212,255,58,0.12)",
  accentGlow: "rgba(212,255,58,0.25)",
  onAccent: "#0a0a0a",
} as const;

const FONT_SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
const FONT_MONO =
  "ui-monospace,'SF Mono',SFMono-Regular,Menlo,Monaco,Consolas,monospace";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function monoLabel(text: string): string {
  return `<span style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted};">${escapeHtml(text)}</span>`;
}

function emailButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${C.accent};color:${C.onAccent};text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;font-family:${FONT_SANS};box-shadow:0 8px 32px -8px ${C.accentGlow};">${escapeHtml(label)}</a>`;
}

function emailLink(href: string, label: string): string {
  return `<a href="${href}" style="color:${C.accent};text-decoration:none;font-weight:500;">${escapeHtml(label)}</a>`;
}

interface EmailShellOptions {
  title: string;
  eyebrow: string;
  headline: string;
  subhead?: string;
  bodyHtml: string;
  footerExtraLinks?: Array<{ href: string; label: string }>;
}

function emailShell({
  title,
  eyebrow,
  headline,
  subhead,
  bodyHtml,
  footerExtraLinks = [],
}: EmailShellOptions): string {
  const year = new Date().getFullYear();
  const extraFooter =
    footerExtraLinks.length > 0
      ? footerExtraLinks
          .map(
            (link, i) =>
              `${i > 0 ? `<span style="color:${C.line};margin:0 10px;">|</span>` : ""}${emailLink(link.href, link.label)}`
          )
          .join("")
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};font-family:${FONT_SANS};-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.bg};border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;border-collapse:collapse;background:${C.bgElev};border:1px solid ${C.line};border-radius:12px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:${C.bgElev2};border-bottom:1px solid ${C.line};padding:28px 32px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding-bottom:16px;">
                    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${C.accent};margin-right:8px;vertical-align:middle;"></span>
                    ${monoLabel(eyebrow)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <h1 style="margin:0;color:${C.fg};font-size:26px;font-weight:700;line-height:1.25;letter-spacing:-0.02em;">
                      ${escapeHtml(headline)}
                    </h1>
                    ${
                      subhead
                        ? `<p style="margin:10px 0 0;color:${C.muted};font-size:15px;line-height:1.5;">${escapeHtml(subhead)}</p>`
                        : ""
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;background:${C.bgElev};color:${C.fg2};font-size:15px;line-height:1.65;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${C.bg};border-top:1px solid ${C.line};padding:24px 32px;text-align:center;">
              <p style="margin:0 0 14px;color:${C.muted};font-size:13px;line-height:1.6;">
                You're receiving this because you subscribed at ${emailLink(SITE_URL, "abhinavsingh.online")}
              </p>
              ${
                extraFooter
                  ? `<p style="margin:0 0 14px;font-size:13px;">${extraFooter}</p>`
                  : ""
              }
              <p style="margin:0;color:${C.muted};font-size:11px;font-family:${FONT_MONO};letter-spacing:0.08em;text-transform:uppercase;">
                © ${year} Abhinav Singh · Software / Writing
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function divider(): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0;border-collapse:collapse;"><tr><td style="height:1px;background:${C.line};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;
}

function quoteBox(content: string): string {
  return `<div style="margin:24px 0;padding:16px 20px;border-left:3px solid ${C.accent};background:${C.accentSoft};border-radius:0 8px 8px 0;color:${C.fg2};font-size:15px;line-height:1.7;font-style:italic;">${content}</div>`;
}

function signatureBlock(): string {
  return `<p style="margin:32px 0 0;color:${C.fg2};font-size:15px;line-height:1.7;">
    —<br>
    <strong style="color:${C.fg};font-size:16px;">Abhinav Singh</strong><br>
    <span style="color:${C.muted};font-size:13px;">Software Engineer · India</span>
  </p>`;
}

export function getWelcomeEmailHTML(): string {
  const bodyHtml = `
    <p style="margin:0 0 16px;color:${C.fg};font-size:16px;">Hi there,</p>
    <p style="margin:0 0 20px;">
      Thanks for subscribing. You'll get new posts on software engineering, algorithms, and whatever I'm building — straight to your inbox.
    </p>

    ${divider()}

    <p style="margin:0 0 12px;color:${C.fg};font-weight:600;">What to expect</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      ${[
        "New blog posts — deep dives, tutorials, field notes",
        "Practical patterns — algorithms, system design, tooling",
        "Honest write-ups from real projects and experiments",
      ]
        .map(
          (item) => `
      <tr>
        <td style="padding:8px 0;color:${C.fg2};font-size:15px;line-height:1.6;">
          <span style="color:${C.accent};margin-right:8px;">→</span>${escapeHtml(item)}
        </td>
      </tr>`
        )
        .join("")}
    </table>

    ${quoteBox('"Building things that don&apos;t fall apart."')}

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0;border-collapse:collapse;">
      <tr><td align="center">${emailButton(SITE_URL, "Read the writing →")}</td></tr>
    </table>

    <p style="margin:0;color:${C.muted};font-size:14px;">
      Reply anytime — I read every message.
    </p>

    ${signatureBlock()}
  `;

  return emailShell({
    title: "Welcome — Abhinav Singh",
    eyebrow: "Newsletter",
    headline: "You're on the list.",
    subhead: "Field notes from the craft, delivered to your inbox.",
    bodyHtml,
    footerExtraLinks: [
      { href: SITE_URL, label: "Visit blog" },
      { href: `mailto:${DEFAULT_CONTACT_EMAIL}`, label: "Contact" },
    ],
  });
}

export function getNewsletterPostEmailHTML(post: BlogPost): string {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const metaPill = (label: string) =>
    `<span style="display:inline-block;margin:0 8px 8px 0;padding:5px 10px;background:${C.bgElev2};border:1px solid ${C.line};border-radius:6px;font-family:${FONT_MONO};font-size:11px;color:${C.muted};letter-spacing:0.04em;">${escapeHtml(label)}</span>`;

  const bodyHtml = `
    <h2 style="margin:0 0 16px;color:${C.fg};font-size:22px;font-weight:700;line-height:1.3;letter-spacing:-0.02em;">
      ${escapeHtml(post.title)}
    </h2>

    <div style="margin-bottom:20px;">
      ${metaPill(formattedDate)}
      ${metaPill(post.readTime)}
      ${metaPill(post.category)}
    </div>

    ${quoteBox(escapeHtml(post.excerpt))}

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0;border-collapse:collapse;">
      <tr><td align="center">${emailButton(postUrl, "Read full article →")}</td></tr>
    </table>

    <p style="margin:0;color:${C.muted};font-size:14px;text-align:center;">
      Thanks for reading. Questions or feedback? Just reply to this email.
    </p>

    ${signatureBlock()}
  `;

  return emailShell({
    title: `New post: ${post.title}`,
    eyebrow: "New post",
    headline: "Fresh writing is live.",
    subhead: "A new article just dropped on the blog.",
    bodyHtml,
    footerExtraLinks: [
      { href: postUrl, label: "Read article" },
      { href: SITE_URL, label: "Visit blog" },
      {
        href: `mailto:${DEFAULT_CONTACT_EMAIL}?subject=Unsubscribe`,
        label: "Unsubscribe",
      },
    ],
  });
}

export function getNewsletterPostSubject(post: BlogPost): string {
  return `New post: ${post.title}`;
}

export function getWelcomeEmailSubject(): string {
  return "You're on the list — Abhinav Singh";
}
