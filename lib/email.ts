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

    const senderEmail = options.fromEmail || "abhinavsingh9986@gmail.com";
    const senderName = options.fromName || "Abhinav Singh";
    const replyToEmail = options.replyTo || "abhinavsingh9986@gmail.com";

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
        error: responseData,
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
 * Fetch subscriber emails from a Brevo contact list (fallback for legacy subscribers).
 */
export async function getBrevoListEmails(): Promise<string[]> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;
  if (!brevoApiKey || !listId) return [];

  const emails = new Set<string>();
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await fetch(
      `https://api.brevo.com/v3/contacts/lists/${listId}/contacts?limit=${limit}&offset=${offset}`,
      {
        headers: {
          "api-key": brevoApiKey,
          accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const body = await response.text();
      console.error("[brevo] list contacts failed:", response.status, body);
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
