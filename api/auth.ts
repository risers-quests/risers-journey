/* Risers Journey sign-in API: /api/auth/... (vercel.json sends every
   /api/auth/... request here). Works whether or not the gate (RJ_AUTH) is
   on, so PINs can be set up before it's switched on.

   PINs, device codes and wrong-try counts are kept by the data store (the
   Cloudflare Worker's /auth, which only answers this server). This file
   checks who's asking and hands out the signed cookies (lib/rj-auth.ts).

     GET  state            what the sign-in page should show
     POST device/email     email a 6-digit code to highergrade@lifehub.in
     POST device/verify    {code}  -> this device is set up
     POST device/code      {code}  a code made on the staff page, or the
                           set-up code (RJ_SETUP_CODE) -> set up
     POST signin           {role, id, pin}
     POST first-pin        {id, setupCode, pin}  a facilitator's first PIN
     POST ping             still here: a fresh 15 minutes
     POST signout          {device?: true} also forget this device
   Facilitators only:
     GET  pins             who has a PIN
     POST pin              {role, id, pin}  set or reset a PIN
     POST device-code      make a one-use code to set up another device
     GET  blocked          the data store's recent refusals
     GET  parent-form      the parents' link, and which forms each child gets
   The parents' form (no sign-in):
     GET  parent           the Risers; with ?kid=, which forms are open
     GET  parent/record    ?kid=&week=  whether that form is open
     POST parent/record    {kid, week, state}  a submitted form */
import {
  KIDS, STAFF, KID_PIN_LENGTH, STAFF_PIN_LENGTH, IDLE_MINUTES,
  readSession, userCookies, signedOutCookies, deviceCookie, clearCookie, cookie,
  sign, verify, readCookie, randomId, serverToken, isKid, isStaff, Role
} from '../lib/rj-auth.js';

const STORE_URL = (process.env.RJ_STORE_URL || 'https://risers-data.highergrade.workers.dev').replace(/\/$/, '');
const STAFF_EMAIL = 'highergrade@lifehub.in';

type Req = { method?: string; url?: string; headers: Record<string, string | string[] | undefined>; body?: any };
type Res = { status(code: number): Res; setHeader(name: string, value: string | string[]): void; json(body: unknown): void; end(): void };

function send(res: Res, status: number, body: unknown, cookies?: string[]) {
  res.setHeader('Cache-Control', 'no-store');
  if (cookies && cookies.length) res.setHeader('Set-Cookie', cookies);
  res.status(status).json(body);
}

function header(req: Req, name: string): string {
  const v = req.headers[name];
  return Array.isArray(v) ? v[0] : v || '';
}

async function store(secret: string, op: string, body: Record<string, unknown> = {}): Promise<any> {
  const r = await fetch(STORE_URL + '/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Site-Key': await serverToken(secret) },
    body: JSON.stringify(Object.assign({ op }, body))
  });
  let data: any = null;
  try { data = await r.json(); } catch { /* not JSON */ }
  if (!r.ok && !(data && typeof data === 'object' && 'ok' in data)) {
    throw new Error('data store ' + r.status + (data && data.error ? ': ' + data.error : ''));
  }
  return data;
}

function pinOk(role: Role, pin: unknown): pin is string {
  const n = role === 'kid' ? KID_PIN_LENGTH : STAFF_PIN_LENGTH;
  return typeof pin === 'string' && new RegExp('^\\d{' + n + '}$').test(pin);
}

/* RJ_SETUP_CODE (a Vercel setting, 12 letters and numbers) sets up any
   device, and lets a facilitator with no PIN yet make one. */
function isSetupCode(code: string): boolean {
  const want = (process.env.RJ_SETUP_CODE || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (want.length < 12 || code.length !== want.length) return false;
  let d = 0;
  for (let i = 0; i < want.length; i++) d |= want.charCodeAt(i) ^ code.charCodeAt(i);
  return d === 0;
}

function lockedMessage(wait: number) {
  const m = Math.max(1, Math.ceil(wait / 60000));
  return 'Too many wrong tries. Try again in ' + m + ' minute' + (m === 1 ? '' : 's') + '.';
}

async function emailCode(code: string): Promise<boolean> {
  const url = process.env.DIAGNOSTIC_MAIL_URL, secret = process.env.DIAGNOSTIC_MAIL_SECRET;
  if (!url || !secret) return false;
  const html =
    '<div style="font-family:Arial,sans-serif;font-size:15px;color:#1e2a33">' +
    '<p>Someone is setting up a device for Risers Journey.</p>' +
    '<p style="font-size:28px;font-weight:bold;letter-spacing:6px;margin:18px 0">' + code + '</p>' +
    '<p>Type this code on that device within 10 minutes. If nobody at LifeHub asked for it, ignore this email: without the code nothing happens.</p></div>';
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret, childName: '', child: { subject: '', html: '' }, staff: { subject: 'Risers Journey device code: ' + code, html } }),
      redirect: 'follow'
    });
    const out: any = await r.json().catch(() => null);
    return !!(out && out.staff);
  } catch {
    return false;
  }
}


/* ---- The parents' form: one open link, no sign-in ----
   /parents/ lists the Risers; a parent picks their child and gets the
   questionnaires switched on for that child (the staff "OK" and family
   list on each questionnaire's staff page). Anyone with the link can send,
   so it only ever writes: it never shows saved answers, drafts aren't
   kept, and a second submission keeps the earlier one (in _earlier). */
const PARENT_FORMS: { id: string; week: string; approval: string; title: string; desc: string }[] = [
  { id: 'next-year', week: 'term3-next-year', approval: 'next-year-approval', title: 'Next year at LifeHub', desc: 'Your plans for next academic year (2027–28). About 3 minutes.' },
  { id: 'grade10', week: 'term3-grade10', approval: 'grade10-approval', title: '10th Boards: Before We Meet', desc: 'Where you are now on the 10th boards, before our meeting.' }
];

async function storeGet(secret: string, group: string, kid: string, week: string): Promise<any> {
  const q = new URLSearchParams({ group, kid, week });
  const r = await fetch(STORE_URL + '/sync?' + q, { headers: { 'X-Site-Key': await serverToken(secret) } });
  if (!r.ok) throw new Error('data store ' + r.status);
  return r.json();
}
async function storePut(secret: string, group: string, kid: string, week: string, state: unknown): Promise<any> {
  const r = await fetch(STORE_URL + '/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Site-Key': await serverToken(secret) },
    body: JSON.stringify({ group, kid, week, state })
  });
  return r.json().catch(() => ({ ok: false }));
}
/* Is this questionnaire switched on for this family? */
async function formOpen(secret: string, form: { approval: string }, kid: string): Promise<boolean> {
  const r = await storeGet(secret, 'term-3', 'staff', form.approval);
  const ap = r && r.found && r.data && r.data.state;
  return !!(ap && ap.approved && (ap.kids || []).indexOf(kid) !== -1);
}

export default async function handler(req: Req, res: Res) {
  const secret = process.env.AUTH_SECRET || '';
  const path = new URL(req.url || '/', 'http://x').pathname.replace(/^\/api\/auth\/?/, '').replace(/\/$/, '');
  const method = req.method || 'GET';

  if (secret.length < 32) return send(res, 503, { error: 'not set up', configured: false });

  // Only this site may post here (cookies are SameSite=Lax too).
  if (method !== 'GET') {
    const origin = header(req, 'origin');
    if (origin && new URL(origin).host !== header(req, 'host')) return send(res, 403, { error: 'wrong site' });
  }

  const cookieHeader = header(req, 'cookie');
  const { device, user } = await readSession(secret, cookieHeader);
  const body = (req.body && typeof req.body === 'object') ? req.body : {};

  try {
    // No setting up devices: each browser just gets its own id the first
    // time it opens the sign-in page (a sign-in only counts in the browser
    // it was made in).
    if (method === 'GET' && path === 'state') {
      return send(res, 200, {
        configured: true,
        gate: process.env.RJ_AUTH === 'on',
        device: true,
        user: user ? { role: user.r, id: user.k } : null,
        idleMinutes: IDLE_MINUTES,
        kids: KIDS.map((k) => ({ id: k.id, name: k.name })),
        staff: STAFF
      }, device ? [] : [await deviceCookie(secret)]);
    }

    if (method === 'POST' && path === 'device/email') {
      const id = randomId(12);
      const out = await store(secret, 'chal-new', { id });
      if (!out.ok) return send(res, 429, { error: out.error || 'Too many codes asked for. Try again in a while.' });
      if (!(await emailCode(out.code))) return send(res, 502, { error: 'The email couldn’t be sent. Use a device code from a facilitator’s Sign-in page instead.' });
      const chal = await sign(secret, { t: 'chal', c: id, e: Date.now() + 10 * 60e3 });
      return send(res, 200, { ok: true, to: STAFF_EMAIL }, [cookie('rj_chal', chal, 600, true)]);
    }

    if (method === 'POST' && path === 'device/verify') {
      const chal = await verify(secret, readCookie(cookieHeader, 'rj_chal'), 'chal');
      if (!chal) return send(res, 400, { error: 'That code has run out. Ask for a new one.' });
      const code = String(body.code || '').replace(/\D/g, '');
      const out = await store(secret, 'chal-check', { id: chal.c, code });
      if (!out.ok) return send(res, 400, { error: out.error || 'That code isn’t right.' });
      return send(res, 200, { ok: true }, [await deviceCookie(secret), clearCookie('rj_chal', true)].concat(signedOutCookies()));
    }

    if (method === 'POST' && path === 'device/code') {
      const code = String(body.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (code.length < 8) return send(res, 400, { error: 'A device code has 8 letters and numbers.' });
      if (isSetupCode(code)) return send(res, 200, { ok: true }, [await deviceCookie(secret)].concat(signedOutCookies()));
      const out = await store(secret, 'devcode-use', { code });
      if (!out.ok) return send(res, 400, { error: out.error || 'That code isn’t right, or it has been used.' });
      return send(res, 200, { ok: true }, [await deviceCookie(secret)].concat(signedOutCookies()));
    }

    if (method === 'POST' && path === 'signin') {
      if (!device) return send(res, 401, { error: 'Please reload the page and try again.' });
      const role: Role = body.role === 'staff' ? 'staff' : 'kid';
      const id = String(body.id || '').toLowerCase();
      if (!(role === 'kid' ? isKid(id) : isStaff(id))) return send(res, 400, { error: 'Unknown name.' });
      if (!pinOk(role, body.pin)) return send(res, 400, { error: 'Type your ' + (role === 'kid' ? KID_PIN_LENGTH : STAFF_PIN_LENGTH) + '-digit PIN.' });
      const out = await store(secret, 'pin-check', { role, id, pin: body.pin });
      if (out.ok) return send(res, 200, { ok: true, role, id }, await userCookies(secret, String(device.d), role, id));
      if (out.nopin) return send(res, 400, { nopin: true, error: role === 'kid' ? 'You don’t have a PIN yet. Ask a facilitator to set one.' : 'You don’t have a PIN yet.' });
      if (out.locked) return send(res, 429, { error: lockedMessage(out.wait) });
      return send(res, 400, { error: 'That PIN isn’t right.' + (out.left ? ' ' + out.left + ' tr' + (out.left === 1 ? 'y' : 'ies') + ' left.' : '') });
    }

    // First time only: a facilitator with no PIN yet makes their own, with
    // the set-up code (RJ_SETUP_CODE) as proof. Once they have one, this
    // refuses; a forgotten PIN is reset by a colleague on the staff page.
    if (method === 'POST' && path === 'first-pin') {
      if (!device) return send(res, 401, { error: 'Please reload the page and try again.' });
      const id = String(body.id || '').toLowerCase();
      if (!isStaff(id)) return send(res, 400, { error: 'Unknown name.' });
      if (!isSetupCode(String(body.setupCode || '').toUpperCase().replace(/[^A-Z0-9]/g, ''))) {
        await store(secret, 'devcode-use', { code: 'WRONGSETUP' }); // counts towards the hourly try limit
        return send(res, 400, { error: 'That set-up code isn’t right.' });
      }
      if (!pinOk('staff', body.pin)) return send(res, 400, { error: 'Your PIN is ' + STAFF_PIN_LENGTH + ' digits.' });
      const list = await store(secret, 'pin-list');
      if ((list.set || []).indexOf('staff:' + id) !== -1) return send(res, 400, { error: 'You already have a PIN. If you forgot it, ask a colleague to reset it on the Sign-in & PINs page.' });
      const out = await store(secret, 'pin-set', { role: 'staff', id, pin: body.pin });
      if (!out.ok) return send(res, 400, { error: out.error || 'Not saved.' });
      return send(res, 200, { ok: true, role: 'staff', id }, await userCookies(secret, String(device.d), 'staff', id));
    }

    if (method === 'POST' && path === 'ping') {
      if (!device || !user) return send(res, 401, { error: 'signed out' });
      return send(res, 200, { ok: true }, await userCookies(secret, String(device.d), user.r as Role, String(user.k)));
    }

    if (method === 'POST' && path === 'signout') {
      const cookies = signedOutCookies();
      if (body.device) cookies.push(clearCookie('rj_dev', true));
      return send(res, 200, { ok: true }, cookies);
    }

    // ---- the parents' form (no sign-in) ----
    if (path === 'parent' || path === 'parent/record') {
      const sp = new URL(req.url || '/', 'http://x').searchParams;
      const kidId = String((method === 'GET' ? sp.get('kid') : body.kid) || '').toLowerCase();
      if (method === 'GET' && path === 'parent' && !kidId) {
        return send(res, 200, { ok: true, kids: KIDS.map((k) => ({ slug: k.id, name: k.name, group: k.group })) });
      }
      const kid = KIDS.filter((k) => k.id === kidId)[0];
      if (!kid) return send(res, 404, { error: 'Unknown child.' });
      if (method === 'GET' && path === 'parent') {
        const forms = [];
        for (const form of PARENT_FORMS) if (await formOpen(secret, form, kid.id)) forms.push({ id: form.id, title: form.title, desc: form.desc });
        return send(res, 200, { ok: true, kid: { slug: kid.id, name: kid.name, group: kid.group }, forms });
      }
      const week = String(method === 'GET' ? sp.get('week') : body.week || '');
      const form = PARENT_FORMS.filter((x) => x.week === week || x.approval === week)[0];
      if (!form) return send(res, 403, { error: 'not this one' });
      const open = await formOpen(secret, form, kid.id);
      if (method === 'GET') {
        // Whether it's on for this child (not who else it's for); saved answers are never shown here.
        if (week === form.approval) return send(res, 200, { found: true, data: { state: { approved: open, kids: open ? [kid.id] : [] } } });
        return send(res, 200, { found: false });
      }
      if (!open) return send(res, 403, { error: 'This form isn’t open right now.' });
      const state = body.state;
      if (method !== 'POST' || week !== form.week || !state || typeof state !== 'object') return send(res, 400, { error: 'bad request' });
      if (!state._sent) return send(res, 200, { ok: true, updatedAt: new Date().toISOString() }); // drafts aren't kept
      const old = await storeGet(secret, kid.group, kid.id, form.week);
      const prev = old && old.found && old.data && old.data.state;
      const earlier = (prev && prev._earlier) || [];
      if (prev && prev._sent) earlier.unshift({ answers: prev.answers || {}, _sent: prev._sent, via: prev._via || '' });
      const record = { answers: state.answers || {}, _sent: new Date().toISOString(), _via: 'parents link', _earlier: earlier.slice(0, 5) };
      return send(res, 200, await storePut(secret, kid.group, kid.id, form.week, record));
    }

    // ---- facilitators only ----
    if (!device || !user || user.r !== 'staff') return send(res, 403, { error: 'Facilitators only.' });

    if (method === 'GET' && path === 'pins') {
      const out = await store(secret, 'pin-list');
      return send(res, 200, { ok: true, kids: KIDS, staff: STAFF, set: out.set || [], locked: out.locked || [] });
    }

    if (method === 'POST' && path === 'pin') {
      const role: Role = body.role === 'staff' ? 'staff' : 'kid';
      const id = String(body.id || '').toLowerCase();
      if (!(role === 'kid' ? isKid(id) : isStaff(id))) return send(res, 400, { error: 'Unknown name.' });
      if (!pinOk(role, body.pin)) return send(res, 400, { error: 'A ' + (role === 'kid' ? 'Riser' : 'facilitator') + '’s PIN is ' + (role === 'kid' ? KID_PIN_LENGTH : STAFF_PIN_LENGTH) + ' digits.' });
      const out = await store(secret, 'pin-set', { role, id, pin: body.pin });
      return send(res, out.ok ? 200 : 400, out);
    }

    if (method === 'POST' && path === 'device-code') {
      const out = await store(secret, 'devcode-new', { uses: 1, minutes: 30 });
      return send(res, out.ok ? 200 : 400, out);
    }

    if (method === 'GET' && path === 'parent-form') {
      const out = [];
      for (const k of KIDS) {
        const forms = [];
        for (const form of PARENT_FORMS) if (await formOpen(secret, form, k.id)) forms.push(form.title);
        out.push({ id: k.id, name: k.name, forms });
      }
      return send(res, 200, { ok: true, link: 'https://' + header(req, 'host') + '/parents/', kids: out });
    }

    if (method === 'GET' && path === 'blocked') {
      const out = await store(secret, 'denied-list');
      return send(res, 200, out);
    }

    return send(res, 404, { error: 'not found' });
  } catch (e) {
    return send(res, 502, { error: 'The data store didn’t answer. Try again in a moment.', detail: String((e as Error).message || e) });
  }
}
