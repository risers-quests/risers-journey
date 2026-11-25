/* Risers Journey sign-in gate. Vercel runs this before every request:
   pages, pictures, scripts and the Skill Check API alike, on every
   address the site answers to (risers.lifehub.in and the .vercel.app one).

   Switched by the Vercel setting RJ_AUTH:
     on   the gate is up: nothing but the sign-in page opens without a
          set-up device and a signed-in Riser or facilitator
     off  (or not set) the site behaves exactly as before the sign-in
   With RJ_AUTH=on and AUTH_SECRET missing, nothing opens at all (closed,
   not open, when something is wrong).

   Once someone is in:
     a Riser can't open staff pages, staff views (?view=staff and the
     like) or another Riser's quest pages, and can only list their own
     Skill Check reports; a facilitator can open everything. */
import { readSession, userCookies, isKid, Claims } from './lib/rj-auth.js';

export const config = { runtime: 'edge' };

// Never served: the code behind the site, notes, setup files.
const HIDDEN = [
  /^\/(lib|worker|diagnostic-tool|admin-tool|node_modules|\.vercel|\.git)(\/|$)/,
  /\.(ts|tsx|md|gs|map)$/i,
  /^\/(package(-lock)?\.json|vercel\.json|\.gitignore|\.vercelignore|tsconfig\.json)$/
];

// Open to anyone: the sign-in page and what it needs to draw itself.
const OPEN = [
  /^\/signin(\/|$)/,
  // The parents' form (no sign-in) and the questionnaire files it runs.
  // They hold questions only; answers go through /api/auth/parent.
  /^\/parents(\/|$)/,
  /^\/term-3\/grade10\/(grade10\.js|grade10\.css|grade10-data\.js)$/,
  /^\/term-3\/next-year\/next-year-data\.js$/,
  /^\/end-of-term-2\/shared\/eot2\.css$/,
  /^\/api\/auth(\/|$)/,
  /^\/assets\/(lifehub\.css|mobile\.css|lifehub-logo\.png|lifehub-mark\.png|icon-192\.png|icon-512\.png|session\.js)$/,
  /^\/(staff\/)?manifest\.webmanifest$/,
  /^\/(favicon\.ico|robots\.txt)$/
];

// Facilitators only.
const STAFF_ONLY = [
  /^\/staff(\/|$)/,
  // Parents' answers (filled in from /parents/): staff only.
  /^\/term-3\/(grade10|next-year)(\/|$)/,
  /^\/end-of-term-2\/(staff|consolidate)(\/|$)/
];

// One Riser's own tools (the same list as home.js OWN_TILES).
const OWN_TOOLS: [RegExp, string][] = [[/^\/tools\/sound-desk(\/|$)/, 'karis']];

function pass(setCookies?: string[]): Response {
  const headers = new Headers({ 'x-middleware-next': '1' });
  (setCookies || []).forEach((c) => headers.append('set-cookie', c));
  return new Response(null, { headers });
}

function isPage(request: Request, path: string): boolean {
  if (request.method !== 'GET') return false;
  const dest = request.headers.get('sec-fetch-dest');
  if (dest) return dest === 'document';
  return /\/$|\.html$/.test(path) || (request.headers.get('accept') || '').includes('text/html');
}

function toSignIn(request: Request, url: URL, path: string): Response {
  if (!isPage(request, path) || path.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'signed out' }), { status: 401, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
  }
  const next = path + url.search;
  return Response.redirect(new URL('/signin/?next=' + encodeURIComponent(next), url), 302);
}

function home(url: URL): Response {
  return Response.redirect(new URL('/', url), 302);
}

/* What a Riser may not open. Returns true when it's someone else's or staff's. */
function kidBlocked(user: Claims, path: string, url: URL): boolean {
  const me = String(user.k);
  if (STAFF_ONLY.some((r) => r.test(path))) return true;
  for (const [r, owner] of OWN_TOOLS) if (r.test(path) && owner !== me) return true;
  // A quest's per-Riser page: /group-00-week-01-…/eva/
  const quest = /^\/group-\d\d-week-\d\d-[^/]+\/([a-z]+)(\/|$)/.exec(path);
  if (quest && isKid(quest[1]) && quest[1] !== me) return true;
  // Staff views of shared pages.
  const q = url.searchParams;
  if (q.get('view') === 'staff' || q.has('editAs') || (q.has('rater') && q.get('rater') !== 'self')) return true;
  // Skill Check: only their own list of reports.
  const reports = /^\/api\/diagnostic\/children\/([^/]+)\//.exec(path);
  if (reports && decodeURIComponent(reports[1]).toLowerCase() !== me) return true;
  return false;
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // Every page is a folder (…/index.html). Without the closing slash the
  // page loads but its own scripts and styles don't, so add it.
  if (request.method === 'GET' && !url.pathname.startsWith('/api/') && !/\/$|\.[a-z0-9]+$/i.test(url.pathname)) {
    return Response.redirect(new URL(url.pathname + '/' + url.search, url), 308);
  }

  if (process.env.RJ_AUTH !== 'on') return pass();

  let path = url.pathname;
  try { path = decodeURIComponent(path); } catch { /* keep as is */ }
  path = path.replace(/\/{2,}/g, '/');

  if (HIDDEN.some((r) => r.test(path))) return new Response('Not found', { status: 404 });
  if (OPEN.some((r) => r.test(path))) return pass();

  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    return new Response('Risers Journey is being set up. Please try again soon.', { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }

  const { device, user } = await readSession(secret, request.headers.get('cookie'));
  if (!device || !user) return toSignIn(request, url, path);

  // The old personal links (eva-misty-bramble/ and the like) are retired.
  const oldLink = /^\/([a-z]+)-[a-z]+-[a-z]+\/?(index\.html)?$/.exec(path);
  if (oldLink && isKid(oldLink[1])) return home(url);

  // A quest page's Facilitator View (?fac=1) is for staff: a Riser gets the page without it.
  if (user.r === 'kid' && url.searchParams.has('fac')) {
    url.searchParams.delete('fac');
    return Response.redirect(url, 302);
  }

  if (user.r === 'kid' && kidBlocked(user, path, url)) {
    if (path.startsWith('/api/') || !isPage(request, path)) {
      return new Response(JSON.stringify({ error: 'not yours' }), { status: 403, headers: { 'content-type': 'application/json' } });
    }
    return home(url);
  }

  // Opening a page counts as activity: a fresh 15 minutes.
  if (isPage(request, path)) {
    return pass(await userCookies(secret, String(device.d), user.r as 'kid' | 'staff', String(user.k)));
  }
  return pass();
}
