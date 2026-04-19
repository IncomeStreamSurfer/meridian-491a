const RESEND_API = 'https://api.resend.com/emails';

const apiKey =
  (import.meta.env.RESEND_API_KEY as string | undefined) ??
  (typeof process !== 'undefined' ? process.env.RESEND_API_KEY : undefined) ??
  '';

export interface SendEmailArgs {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

/**
 * Send an email via Resend REST API. Returns { ok, id?, error? }.
 * Non-throwing — callers handle the ok boolean.
 */
export async function sendEmail(args: SendEmailArgs): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY not configured' };

  const body = {
    from: args.from || 'Meridian <onboarding@resend.dev>',
    to: Array.isArray(args.to) ? args.to : [args.to],
    subject: args.subject,
    html: args.html,
    text: args.text,
    reply_to: args.replyTo,
  };

  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    const json: any = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: json?.message || `Resend HTTP ${res.status}` };
    return { ok: true, id: json?.id };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Resend network error' };
  }
}

export function waitlistWelcomeEmail(email: string): { subject: string; html: string; text: string } {
  const subject = 'You’re on the Meridian list — welcome';
  const text = `Thanks for joining Meridian.\n\nYou're on the waitlist. We open orders soon. Before then you'll get one short letter from the farm, and one email the morning we go live.\n\nNo spam. No noise. Just two or three notes worth reading.\n\n— The Meridian team\n`;
  const html = `<!doctype html>\n<html>\n  <head><meta charset="utf-8"/></head>\n  <body style="background:#f5f1ea;margin:0;padding:40px 16px;font-family:Georgia,serif;color:#17130f;">\n    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#f5f1ea;">\n      <tr><td>\n        <p style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#b87333;margin:0 0 28px;">Meridian — Vol. 01</p>\n\n        <h1 style="font-family:Georgia,serif;font-weight:400;font-size:36px;line-height:1.1;margin:0 0 24px;">\n          You're on the list.\n        </h1>\n\n        <p style="font-size:16px;line-height:1.7;color:#2a211a;margin:0 0 18px;">\n          Thanks for stepping in, ${email.split('@')[0]}.\n        </p>\n\n        <p style="font-size:16px;line-height:1.7;color:#2a211a;margin:0 0 18px;">\n          Meridian is a small specialty coffee label — single-origin lots, roasted the day before they ship, with printed brew notes in every box. We open orders soon, and waitlist members get in first.\n        </p>\n\n        <p style="font-size:16px;line-height:1.7;color:#2a211a;margin:0 0 18px;">\n          Between now and launch you'll hear from us twice: once with a short letter from the farm we're debuting with, and once the morning we go live. That's it.\n        </p>\n\n        <hr style="border:none;border-top:1px solid #d4c9b7;margin:32px 0;" />\n\n        <p style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#8a7a65;margin:0 0 6px;">What's next</p>\n        <p style="font-size:15px;line-height:1.7;color:#2a211a;margin:0 0 18px;">\n          Keep an eye out for a plain-text note from us in a few weeks. No marketing machinery — just the founders, writing from the cupping table.\n        </p>\n\n        <p style="font-size:15px;line-height:1.7;color:#2a211a;margin:32px 0 0;">— Meridian</p>\n\n        <p style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#8a7a65;margin:48px 0 0;">Coffee at the intersection of origin and craft</p>\n      </td></tr>\n    </table>\n  </body>\n</html>`;
  return { subject, html, text };
}
