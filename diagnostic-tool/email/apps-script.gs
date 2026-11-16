/**
 * LifeHub Maths Diagnostic: report emails.
 *
 * Runs as highergrade@lifehub.in. The diagnostic server posts both reports
 * here when a test finishes; this script checks the passphrase, looks up
 * the child's email address by name, and sends:
 *   - the child's report to the child
 *   - the staff report to STAFF_EMAIL (highergrade@lifehub.in)
 *
 * The children's addresses live only in this script's Script properties,
 * never in the website's code. Setup: see SETUP.md next to this file.
 *
 * Script properties (Project Settings -> Script properties):
 *   SECRET        a long passphrase; the same one goes into Vercel
 *   STAFF_EMAIL   highergrade@lifehub.in
 *   EMAILS        all the children at once, one per line or comma:
 *                   Eva = eva@example.com, Zach = zach@example.com, ...
 *   (or one property per child: EMAIL_EVA, EMAIL_ZACH, ...)
 */
function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var out = { ok: false, child: false, staff: false };
  try {
    var data = JSON.parse(e.postData.contents);
    if (!data.secret || data.secret !== props.getProperty('SECRET')) {
      out.error = 'wrong passphrase';
      return reply(out);
    }
    var staffTo = props.getProperty('STAFF_EMAIL') || 'highergrade@lifehub.in';
    var key = 'EMAIL_' + String(data.childName || '').trim().toUpperCase().replace(/[^A-Z]/g, '');
    var childTo = props.getProperty(key) || fromList(props.getProperty('EMAILS'), data.childName);

    MailApp.sendEmail({ to: staffTo, subject: data.staff.subject, htmlBody: data.staff.html, name: 'LifeHub Maths Diagnostic' });
    out.staff = true;
    if (childTo) {
      MailApp.sendEmail({ to: childTo, subject: data.child.subject, htmlBody: data.child.html, name: 'LifeHub Maths Diagnostic', replyTo: staffTo });
      out.child = true;
    } else {
      out.error = 'no email saved for ' + data.childName + ' (add ' + key + ')';
    }
    out.ok = true;
  } catch (err) {
    out.error = String(err);
  }
  return reply(out);
}

/** Finds "Name = address" in the EMAILS property (lines or commas). */
function fromList(list, name) {
  if (!list || !name) return null;
  var want = String(name).trim().toLowerCase();
  var entries = String(list).split(/[\n,;]+/);
  for (var i = 0; i < entries.length; i++) {
    var parts = entries[i].split('=');
    if (parts.length === 2 && parts[0].trim().toLowerCase() === want) return parts[1].trim();
  }
  return null;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run this once from the editor to grant the "send email as you" permission. */
function authorise() {
  MailApp.getRemainingDailyQuota();
}
