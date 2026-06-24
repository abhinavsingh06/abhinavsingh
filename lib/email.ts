/**
 * Email sending utility using Brevo (formerly Sendinblue)
 * Server-side email sending for welcome emails and newsletters
 */

interface SendEmailOptions {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
}

export const DEFAULT_CONTACT_EMAIL = "singh.abhinav6996@gmail.com";

export function getBrevoSender(): {
  email: string;
  name: string;
  replyTo: string;
} {
  const email =
    process.env.BREVO_SENDER_EMAIL?.trim() || DEFAULT_CONTACT_EMAIL;
  const name = process.env.BREVO_SENDER_NAME?.trim() || "Abhinav Singh";
  const replyTo = process.env.BREVO_REPLY_TO_EMAIL?.trim() || email;
  return { email, name, replyTo };
}

function formatBrevoError(error: unknown): string {
  if (!error) return "Unknown Brevo error";
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    const record = error as Record<string, unknown>;
    const message = record.message ?? record.text;
    const code = record.code;
    if (message && code) return `${code}: ${message}`;
    if (message) return String(message);
    return JSON.stringify(error);
  }
  return String(error);
}

/**
 * Send email via Brevo API
 */
export async function sendEmailViaBrevo(
  options: SendEmailOptions
): Promise<{ success: boolean; error?: any }> {
  try {
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      console.error("Brevo API key not configured");
      return {
        success: false,
        error:
          "Brevo API key not configured. Set BREVO_API_KEY environment variable.",
      };
    }

    const sender = getBrevoSender();
    const senderEmail = options.fromEmail || sender.email;
    const senderName = options.fromName || sender.name;
    const replyToEmail = options.replyTo || sender.replyTo;

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email: options.to,
            name: options.toName || "Subscriber",
          },
        ],
        subject: options.subject,
        htmlContent: options.htmlContent,
        replyTo: {
          email: replyToEmail,
          name: senderName,
        },
      }),
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { text: responseText, status: response.status };
    }

    if (!response.ok) {
      console.error("Brevo API error:", {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        email: options.to,
      });
      return {
        success: false,
        error: formatBrevoError(responseData),
      };
    }

    console.log("Email sent successfully via Brevo to:", options.to);
    return { success: true };
  } catch (error) {
    console.error("Error sending email via Brevo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Add contact to Brevo
 */
export async function addContactToBrevo(
  email: string,
  listIds?: number[]
): Promise<{ success: boolean; error?: any }> {
  try {
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      console.error("Brevo API key not configured");
      return {
        success: false,
        error: "Brevo API key not configured",
      };
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        email: email,
        listIds: listIds || [],
        updateEnabled: true, // Update if contact already exists
      }),
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { text: responseText, status: response.status };
    }

    if (!response.ok) {
      // If contact already exists (409), that's okay
      if (response.status === 409) {
        console.log("Contact already exists in Brevo:", email);
        return { success: true };
      }

      console.error("Brevo contact creation error:", {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        email: email,
      });
      return {
        success: false,
        error: responseData,
      };
    }

    console.log("Contact added to Brevo successfully:", email);
    return { success: true };
  } catch (error) {
    console.error("Error adding contact to Brevo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Check if Brevo is configured
 */
export function isBrevoConfigured(): boolean {
  return !!process.env.BREVO_API_KEY;
}

/**
 * Fetch subscriber emails from Brevo (list if configured, otherwise all contacts).
 */
export async function getBrevoListEmails(): Promise<string[]> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) return [];

  const listId = process.env.BREVO_LIST_ID?.trim();
  const baseUrl = listId
    ? `https://api.brevo.com/v3/contacts/lists/${listId}/contacts`
    : "https://api.brevo.com/v3/contacts";

  const emails = new Set<string>();
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await fetch(`${baseUrl}?limit=${limit}&offset=${offset}`, {
      headers: {
        "api-key": brevoApiKey,
        accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("[brevo] contacts fetch failed:", response.status, body);
      break;
    }

    const data = (await response.json()) as {
      contacts?: Array<{ email?: string }>;
    };

    const batch = data.contacts ?? [];
    if (batch.length === 0) break;

    for (const contact of batch) {
      if (contact.email) emails.add(contact.email.toLowerCase());
    }

    if (batch.length < limit) break;
    offset += limit;
  }

  return [...emails];
}

export async function getBrevoSenderStatus(): Promise<{
  configured: boolean;
  senderEmail: string;
  verified: boolean | null;
  senders: Array<{ email: string; active: boolean }>;
  hint?: string;
}> {
  const sender = getBrevoSender();
  const brevoApiKey = process.env.BREVO_API_KEY;

  if (!brevoApiKey) {
    return {
      configured: false,
      senderEmail: sender.email,
      verified: null,
      senders: [],
      hint: "Set BREVO_API_KEY in Vercel environment variables.",
    };
  }

  const response = await fetch("https://api.brevo.com/v3/senders", {
    headers: {
      "api-key": brevoApiKey,
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    return {
      configured: true,
      senderEmail: sender.email,
      verified: null,
      senders: [],
      hint: `Brevo sender lookup failed (${response.status}): ${body}`,
    };
  }

  const data = (await response.json()) as {
    senders?: Array<{ email?: string; active?: boolean }>;
  };

  const senders = (data.senders ?? [])
    .filter((entry) => entry.email)
    .map((entry) => ({
      email: entry.email!.toLowerCase(),
      active: Boolean(entry.active),
    }));

  const match = senders.find(
    (entry) => entry.email === sender.email.toLowerCase()
  );

  return {
    configured: true,
    senderEmail: sender.email,
    verified: match ? match.active : false,
    senders,
    hint: match?.active
      ? "Sender is verified in Brevo."
      : `Verify ${sender.email} in Brevo → Senders, or set BREVO_SENDER_EMAIL to a verified sender.`,
  };
}
