/* Risers Journey sign-in: shared pieces for the gate (middleware.ts) and
   the sign-in API (api/auth.ts). Plain Web Crypto, so the same file runs
   in Vercel's Edge middleware and in a Node function.

   How sign-in works (see SIGN-IN.md for the whole picture):
     rj_dev    this device has been set up by a facilitator (60 days)
     rj_user   who is using it right now: a Riser or a facilitator; ends
               after 15 minutes without activity, or on "Log out"
     rj_store  a short pass for the data store (the Cloudflare Worker),
               readable by the pages; the Worker checks it and only lets a
               Riser touch their own records
     rj_who    "kid:eva" / "staff:jeran", for the pages to show names
   The first three are signed with AUTH_SECRET (a Vercel setting, never in
   the code), so they can't be made up or changed. */

export const KIDS: { id: string; name: string; group: string }[] = [
  { id: 'eva', name: 'Eva', group: 'group-00' },
  { id: 'gabby', name: 'Gabby', group: 'group-00' },
  { id: 'elyon', name: 'Elyon', group: 'group-00' },
  { id: 'chris', name: 'Chris', group: 'group-01' },
  { id: 'yokesh', name: 'Yokesh', group: 'group-01' },
  { id: 'zach', name: 'Zach', group: 'group-01' },
  { id: 'owen', name: 'Owen', group: 'group-02' },
  { id: 'pranavi', name: 'Pranavi', group: 'group-02' },
  { id: 'shalom', name: 'Shalom', group: 'group-03' },
  { id: 'michael', name: 'Michael', group: 'group-03' },
  { id: 'karis', name: 'Karis', group: 'group-03' },
  { id: 'benjamin', name: 'Benjamin', group: 'group-04' }
];

export const STAFF: { id: string; name: string }[] = [
  { id: 'jeran', name: 'Jeran' },
  { id: 'nishitha', name: 'Nishitha' },
  { id: 'blessy', name: 'Blessy' }
];

export type Role = 'kid' | 'staff';

export const DEVICE_DAYS = 60;
export const IDLE_MINUTES = 15;
export const STORE_HOURS = 12;
export const KID_PIN_LENGTH = 4;
export const STAFF_PIN_LENGTH = 6;

export function isKid(id: string): boolean { return KIDS.some((k) => k.id === id); }
export function isStaff(id: string): boolean { return STAFF.some((s) => s.id === id); }

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64url(s: string): Uint8Array {
  const pad = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

const keyCache = new Map<string, Promise<CryptoKey>>();
function hmacKey(secret: string): Promise<CryptoKey> {
  let k = keyCache.get(secret);
  if (!k) {
    k = crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    keyCache.set(secret, k);
  }
  return k;
}

export async function hmac(secret: string, text: string): Promise<string> {
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(text));
  return b64url(new Uint8Array(sig));
}

function sameString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

/* A token is base64url(JSON) "." base64url(HMAC). The Worker checks the
   same format (its copy of verify is in its own code). */
export interface Claims { t: string; e: number; [k: string]: unknown }

export async function sign(secret: string, claims: Claims): Promise<string> {
  const body = b64url(enc.encode(JSON.stringify(claims)));
  return body + '.' + (await hmac(secret, 'rj1.' + body));
}

export async function verify(secret: string, token: string | undefined | null, type: string): Promise<Claims | null> {
  if (!token || token.length > 2000) return null;
  const dot = token.indexOf('.');
  if (dot < 1) return null;
  const body = token.slice(0, dot), sig = token.slice(dot + 1);
  if (!sameString(sig, await hmac(secret, 'rj1.' + body))) return null;
  let claims: Claims;
  try { claims = JSON.parse(new TextDecoder().decode(fromB64url(body))); } catch { return null; }
  if (!claims || claims.t !== type || typeof claims.e !== 'number' || claims.e < Date.now()) return null;
  return claims;
}

export function randomId(bytes = 16): string {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return b64url(a);
}

export function readCookie(header: string | null | undefined, name: string): string | null {
  if (!header) return null;
  const parts = header.split(/;\s*/);
  for (const p of parts) {
    const i = p.indexOf('=');
    if (i > 0 && p.slice(0, i) === name) {
      try { return decodeURIComponent(p.slice(i + 1)); } catch { return null; }
    }
  }
  return null;
}

export function cookie(name: string, value: string, maxAgeSeconds: number, httpOnly: boolean): string {
  return name + '=' + encodeURIComponent(value) + '; Path=/; Max-Age=' + Math.max(0, Math.floor(maxAgeSeconds)) +
    '; Secure; SameSite=Lax' + (httpOnly ? '; HttpOnly' : '');
}

export function clearCookie(name: string, httpOnly: boolean): string {
  return cookie(name, '', 0, httpOnly);
}

export interface Session { device: Claims | null; user: Claims | null }

/* Reads the device and user cookies; the user only counts on the device
   it was signed in on. */
export async function readSession(secret: string, cookieHeader: string | null | undefined): Promise<Session> {
  const device = await verify(secret, readCookie(cookieHeader, 'rj_dev'), 'dev');
  let user = device ? await verify(secret, readCookie(cookieHeader, 'rj_user'), 'user') : null;
  if (user && user.d !== device!.d) user = null;
  if (user && !(user.r === 'kid' ? isKid(String(user.k)) : user.r === 'staff' ? isStaff(String(user.k)) : false)) user = null;
  return { device, user };
}

/* The cookies for a signed-in person: a fresh 15-minute window, a fresh
   data-store pass, and the readable "who". Sent on sign-in, on every page
   they open, and on the pages' activity pings. */
export async function userCookies(secret: string, deviceId: string, role: Role, id: string): Promise<string[]> {
  const now = Date.now();
  const user = await sign(secret, { t: 'user', r: role, k: id, d: deviceId, e: now + IDLE_MINUTES * 60e3 });
  const store = await sign(secret, { t: 'store', r: role, k: id, e: now + STORE_HOURS * 3600e3 });
  return [
    cookie('rj_user', user, IDLE_MINUTES * 60, true),
    cookie('rj_store', store, STORE_HOURS * 3600, false),
    cookie('rj_who', role + ':' + id, STORE_HOURS * 3600, false)
  ];
}

export function signedOutCookies(): string[] {
  return [clearCookie('rj_user', true), clearCookie('rj_store', false), clearCookie('rj_who', false)];
}

export async function deviceCookie(secret: string): Promise<string> {
  const token = await sign(secret, { t: 'dev', d: randomId(12), e: Date.now() + DEVICE_DAYS * 86400e3 });
  return cookie('rj_dev', token, DEVICE_DAYS * 86400, true);
}

/* A short pass for the server's own calls to the Worker (PIN checks,
   device codes, the Skill Check's saved sessions). */
export function serverToken(secret: string): Promise<string> {
  return sign(secret, { t: 'server', e: Date.now() + 5 * 60e3 });
}
