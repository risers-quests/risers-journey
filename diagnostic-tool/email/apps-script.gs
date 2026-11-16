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
 *   EMAIL_EVA, EMAIL_ZACH, ...   one per child: EMAIL_ + first name in capitals
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
    var childTo = props.getProperty(key);

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

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run this once from the editor to grant the "send email as you" permission. */
function authorise() {
  MailApp.getRemainingDailyQuota();
}
