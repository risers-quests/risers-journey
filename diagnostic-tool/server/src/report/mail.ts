/**
 * Sends the two report emails through a small Google Apps Script web app
 * that runs as highergrade@lifehub.in (see diagnostic-tool/email/). The
 * script holds the children's email addresses, so they never appear in
 * this public repo or on the site: we send the child's *name*, and it
 * looks the address up.
 *
 * Needs two Vercel environment variables on the risers-journey project:
 *   DIAGNOSTIC_MAIL_URL     the Apps Script web app URL
 *   DIAGNOSTIC_MAIL_SECRET  the same passphrase saved in the script
 */
export interface MailResult {
  at: string;
  child: boolean;
  staff: boolean;
  note?: string;
}

export async function sendReports(childName: string, child: { subject: string; html: string }, staff: { subject: string; html: string }): Promise<MailResult> {
  const at = new Date().toISOString();
  const url = process.env.DIAGNOSTIC_MAIL_URL;
  const secret = process.env.DIAGNOSTIC_MAIL_SECRET;
  if (!url || !secret) return { at, child: false, staff: false, note: "Email isn't set up yet" };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, childName, child, staff }),
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    const text = await res.text();
    let out: { ok?: boolean; child?: boolean; staff?: boolean; error?: string } = {};
    try {
      out = JSON.parse(text);
    } catch {
      return { at, child: false, staff: false, note: `Unexpected reply from the email script (${res.status})` };
    }
    return { at, child: !!out.child, staff: !!out.staff, note: out.error };
  } catch (e) {
    return { at, child: false, staff: false, note: `Couldn't reach the email script: ${e instanceof Error ? e.message : e}` };
  }
}
