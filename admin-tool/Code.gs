/**
 * LifeHub Admin console (Jeran only).
 *
 * A Google Apps Script bound to the "LifeHub Admin 2026-27" Google Sheet,
 * deployed as a web app that only its owner can open. All the data stays in
 * that Sheet and in Gmail; this code holds none of it, so it can live in
 * the public repo. See SETUP.md.
 *
 * What it does:
 *  - Needs a reply: parents' emails, and any senders listed in Settings
 *    ("Watch: ..."), where the last message in the thread isn't ours.
 *  - Fees: each child's balance (worked out from the Payments ledger), last
 *    payment and last reminder.
 *  - Record a payment: adds one row to Payments.
 *  - Draft reminders: one Gmail draft per family, from the wording in
 *    Settings. Nothing is ever sent; Jeran reviews and sends from Gmail.
 */

function doGet() {
  var me = Session.getEffectiveUser().getEmail();
  var viewer = Session.getActiveUser().getEmail();
  if (viewer && me && viewer.toLowerCase() !== me.toLowerCase()) {
    return HtmlService.createHtmlOutput('This page is only for the LifeHub admin account.');
  }
  return HtmlService.createTemplateFromFile('Console')
    .evaluate()
    .setTitle('LifeHub Admin')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** In the Sheet: an Admin menu with a link to the console. */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Admin').addItem('Open the Admin console', 'showConsoleLink').addToUi();
}

function showConsoleLink() {
  var url = ScriptApp.getService().getUrl();
  var html = url
    ? '<p style="font-family:sans-serif"><a href="' + url + '" target="_blank">Open the Admin console</a></p>'
    : '<p style="font-family:sans-serif">Deploy the console first (see SETUP.md).</p>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(320).setHeight(90), 'LifeHub Admin');
}

// ------------------------------------------------------------------ data

function sheet_(name) {
  var sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh) throw new Error('The Sheet has no "' + name + '" tab.');
  return sh;
}

/** A tab's rows as objects keyed by the header row. */
function rows_(name) {
  var v = sheet_(name).getDataRange().getValues();
  var head = v.shift().map(function (h) { return String(h).trim(); });
  return v
    .filter(function (r) { return r.some(function (x) { return x !== ''; }); })
    .map(function (r) {
      var o = {};
      head.forEach(function (h, i) { o[h] = r[i]; });
      return o;
    });
}

function setting_(key) {
  var row = rows_('Settings').filter(function (r) { return r.Setting === key; })[0];
  return row ? row.Value : '';
}

function fmtDate_(d) {
  return d instanceof Date ? Utilities.formatDate(d, Session.getScriptTimeZone(), 'd MMM yyyy') : '';
}

function rupees_(n) {
  return Math.round(n).toLocaleString('en-IN');
}

function students_() {
  return rows_('Students').filter(function (s) { return s.Code && s.Code !== 'Total'; });
}

function emailsOf_(s) {
  return String(s['Parent emails'] || '')
    .split(/[,;\s]+/)
    .filter(function (e) { return e.indexOf('@') > 0; });
}

/** Everything the Fees part of the console shows. Dates go out as text (Apps Script can't return Dates). */
function getOverview() {
  var pays = rows_('Payments');
  var paid = {}, lastPay = {}, lastRem = {};
  pays.forEach(function (p) {
    if (p.For !== 'School fees' || !p.Code) return;
    paid[p.Code] = (paid[p.Code] || 0) + (Number(p.Amount) || 0);
    if (p.Date instanceof Date && (!lastPay[p.Code] || p.Date > lastPay[p.Code])) lastPay[p.Code] = p.Date;
  });
  rows_('Reminders').forEach(function (r) {
    if (!(r.Drafted instanceof Date)) return;
    String(r.Codes).split(/,\s*/).forEach(function (c) {
      if (!lastRem[c] || r.Drafted > lastRem[c]) lastRem[c] = r.Drafted;
    });
  });

  var students = students_().map(function (s) {
    var expected = s.Expected === '' ? null : Number(s.Expected) || 0;
    var p = paid[s.Code] || 0;
    return {
      code: s.Code,
      child: String(s.Child).trim(),
      group: s.Group || '',
      expected: expected,
      paid: p,
      balance: expected === null ? null : expected - p,
      lastPay: fmtDate_(lastPay[s.Code]),
      lastReminder: fmtDate_(lastRem[s.Code]),
      hasEmail: emailsOf_(s).length > 0,
      notes: s.Notes || ''
    };
  });

  var past = rows_('Past dues')
    .map(function (p) {
      var t = p['Timeline from parents'];
      return { id: p.ID, year: p.Year, child: String(p.Child).trim(), balance: Number(p.Balance) || 0, timeline: t instanceof Date ? fmtDate_(t) : String(t || '') };
    })
    .filter(function (p) { return p.balance > 0; });

  var recent = pays
    .filter(function (p) { return p.Date instanceof Date; })
    .sort(function (a, b) { return b.Date - a.Date; })
    .slice(0, 12)
    .map(function (p) { return { date: fmtDate_(p.Date), child: p.Child, for: p.For, amount: Number(p.Amount) || 0, mode: p.Mode || '' }; });

  return { students: students, past: past, recent: recent, sheetUrl: SpreadsheetApp.getActive().getUrl() };
}

// ------------------------------------------------------------------ actions

/** Add one payment to the ledger. p: {date: 'yyyy-mm-dd', code, for, amount, mode, note} */
function recordPayment(p) {
  var amount = Number(p.amount);
  if (!(amount > 0)) throw new Error('Enter an amount above 0.');
  if (!p.code) throw new Error('Choose who paid.');
  var forWhat = p.for === 'Past dues' ? 'Past dues' : 'School fees';
  var name = '';
  if (forWhat === 'Past dues') {
    var pd = rows_('Past dues').filter(function (r) { return r.ID === p.code; })[0];
    if (!pd) throw new Error('No past-dues row ' + p.code + '.');
    name = String(pd.Child).trim();
  } else {
    var s = students_().filter(function (r) { return r.Code === p.code; })[0];
    if (!s) throw new Error('No student ' + p.code + '.');
    name = String(s.Child).trim();
  }
  var date = p.date ? new Date(p.date + 'T00:00:00') : new Date();
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_('Payments').appendRow([date, p.code, name, forWhat, amount, p.mode || '', p.note || '', new Date()]);
  } finally {
    lock.releaseLock();
  }
  return name + ': ₹' + rupees_(amount) + ' recorded.';
}

/**
 * One Gmail draft per family (children who share parent emails get one
 * email). Never sends. Returns what was drafted and what was skipped, why.
 */
function draftReminders(codes) {
  var o = getOverview();
  var byCode = {};
  o.students.forEach(function (s) { byCode[s.code] = s; });
  var contacts = {};
  students_().forEach(function (s) { contacts[s.Code] = { emails: emailsOf_(s), parents: String(s['Parents (for greeting)'] || '').trim() }; });

  var families = {}, skipped = [];
  (codes || []).forEach(function (c) {
    var s = byCode[c], k = contacts[c];
    if (!s) return;
    if (!(s.balance > 0)) return skipped.push(s.child + ': nothing owing');
    if (!k.emails.length) return skipped.push(s.child + ': no parent email in Students');
    var key = k.emails.map(function (e) { return e.toLowerCase(); }).sort().join(',');
    families[key] = families[key] || { emails: k.emails, parents: k.parents, kids: [] };
    families[key].kids.push(s);
  });

  var subject = String(setting_('Reminder subject') || 'LifeHub: Fee balance');
  var body = String(setting_('Reminder body') || 'Dear {parents},\n\nThe fee balance for {children} is ₹{balance}.');
  var log = sheet_('Reminders');
  var drafted = 0;
  Object.keys(families).forEach(function (key) {
    var f = families[key];
    var names = f.kids.map(function (s) { return s.child; });
    var children = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0];
    var total = f.kids.reduce(function (a, s) { return a + s.balance; }, 0);
    var text = body
      .replace(/\{parents\}/g, f.parents || 'Parents')
      .replace(/\{children\}/g, children)
      .replace(/\{balance\}/g, rupees_(total));
    GmailApp.createDraft(f.emails.join(','), subject, text);
    log.appendRow([new Date(), f.kids.map(function (s) { return s.code; }).join(', '), children, f.emails.join(', '), total, subject]);
    drafted++;
  });
  return { drafted: drafted, skipped: skipped };
}

// ------------------------------------------------------------------ inbox

/** Threads in the inbox, newest first, where the last message isn't from us. */
function waiting_(query, me, limit) {
  return GmailApp.search(query, 0, limit || 25)
    .map(function (t) {
      var msgs = t.getMessages();
      var last = msgs[msgs.length - 1];
      if (String(last.getFrom()).toLowerCase().indexOf(me) >= 0) return null;
      var body = last.getPlainBody().replace(/\s+/g, ' ').trim();
      var text = t.getFirstMessageSubject() + ' ' + body;
      return {
        subject: t.getFirstMessageSubject() || '(no subject)',
        from: String(last.getFrom()).replace(/<.*>/, '').replace(/"/g, '').trim(),
        date: fmtDate_(last.getDate()),
        snippet: body.slice(0, 170),
        url: 'https://mail.google.com/mail/u/0/#inbox/' + t.getId(),
        payment: /\b(paid|payment|transferred|screenshot|gpay|neft|upi|receipt)\b/i.test(text) || last.getAttachments().length > 0
      };
    })
    .filter(Boolean);
}

function getInbox() {
  var me = Session.getEffectiveUser().getEmail().toLowerCase();
  var days = Number(setting_('Look back (days)')) || 21;
  var seen = {};
  var parents = [];
  students_().forEach(function (s) {
    emailsOf_(s).forEach(function (e) {
      e = e.toLowerCase();
      if (!seen[e]) { seen[e] = 1; parents.push(e); }
    });
  });
  var groups = [];
  if (parents.length) {
    groups.push({ title: 'Parents', items: waiting_('in:inbox newer_than:' + days + 'd {' + parents.map(function (e) { return 'from:' + e; }).join(' ') + '}', me) });
  }
  // Other senders to watch, from Settings: "Watch: <title>" = a Gmail search (e.g. from:someone@example.com).
  rows_('Settings').forEach(function (r) {
    var m = /^Watch:\s*(.+)$/.exec(String(r.Setting));
    if (m && String(r.Value).trim()) groups.push({ title: m[1], items: waiting_('in:inbox newer_than:' + days + 'd ' + r.Value, me) });
  });
  return groups;
}
