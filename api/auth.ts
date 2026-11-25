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
     GET  blocked          the data store's recent refusals */
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
    if (method === 'GET' && path === 'state') {
      return send(res, 200, {
        configured: true,
        gate: process.env.RJ_AUTH === 'on',
        device: !!device,
        user: user ? { role: user.r, id: user.k } : null,
        idleMinutes: IDLE_MINUTES,
        kids: device ? KIDS.map((k) => ({ id: k.id, name: k.name })) : [],
        staff: device ? STAFF : [],
        mail: !!(process.env.DIAGNOSTIC_MAIL_URL && process.env.DIAGNOSTIC_MAIL_SECRET)
      });
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
      if (!device) return send(res, 401, { error: 'This device isn’t set up yet.' });
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
      if (!device) return send(res, 401, { error: 'This device isn’t set up yet.' });
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

    if (method === 'GET' && path === 'blocked') {
      const out = await store(secret, 'denied-list');
      return send(res, 200, out);
    }

    return send(res, 404, { error: 'not found' });
  } catch (e) {
    return send(res, 502, { error: 'The data store didn’t answer. Try again in a moment.', detail: String((e as Error).message || e) });
  }
}
