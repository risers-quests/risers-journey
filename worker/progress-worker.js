/* Term 2 Digital Quests — progress sync Worker.

   STORAGE (since Nov 2026): records live in the free D1 database (binding
   DB, one table "records": key -> JSON value), and uploaded files in the
   free R2 bucket (binding FILES). Before that everything was in one paid
   KV namespace (PROGRESS_KV); the keys are the same as they were there
   (progress::…, rating::…, status::…, filemeta::…), and a file's bytes are
   the R2 object named by its old KV key (file::…). The descriptions below
   still say "KV" in places: read it as "the store".

   Five jobs:
     1. /sync — store and return each kid's per-week progress (answers,
        timing, attempts, highlights, notes, build checklist), keyed by
        group/kid/week, so it survives a device switch and can power the
        staff portal's automated Feedback page and Teacher's View status
        column.
     2. /status — a small staff-authored override per kid/week: whether
        staff have manually marked that kid's week "Incomplete" (used once
        the week's window has passed and the kid never finished — the
        portal computes Completed/In Progress live from /sync data, but
        "the week is over and it's still not done" is a call only a human
        makes). Kept in the same KV store, under a different key prefix, so
        it syncs across any staff device the same way kid progress does.
     3. /rating — a staff-entered Day 3 presentation rubric per kid/week (5
        criteria, 1-4 each, plus free-text notes and who rated it). Same
        keyed-record shape as /status, just a different key prefix and a
        richer body — this is staff INPUT, not anything read from a kid's
        own synced state, so it lives in its own KV keyspace rather than
        getting folded into a /sync record.
     4. /evaluate — Week 2 only: an LLM meaning check for a reflection
        answer, called by quest.js ONLY as a fallback when the local
        keyword check already failed, so a kid whose correct answer just
        used different words than the keyword list still passes. Not
        stored in KV at all — this is a stateless judge call, not
        progress. Calls the Anthropic API (Claude Haiku 4.5 — cheap and
        fast, appropriate for a short pass/fail classification like this
        one) via raw HTTP, since this Worker is a single pasted file with
        no build step. This is a paid API call, billed per request to
        whatever Anthropic account owns the key below — there is no free
        tier here. Gated the same soft way as everything else here
        (SITE_KEY) plus a hard prerequisite: ANTHROPIC_API_KEY must be
        set, or the endpoint 503s and the client just keeps the
        keyword-check result.

     5. /file — one uploaded file per kid per slot: the kid's Term 1
        student-led conference slideshow (slot "term1-slideshow"), and a
        build video per quest (slot "build-video-week-NN"; mp4/mov/m4v/
        webm; staff may DELETE it to upload another; range requests are
        honored so it plays and seeks in the browser). Stored
        in the same KV namespace: the bytes under file::…, and a small
        JSON description (name, type, size, uploadedAt) under filemeta::…
        that doubles as the "already uploaded" marker. Upload-once by
        design: a second POST for the same kid/slot is refused (409), so
        the only way to replace a file is deleting both keys by hand in
        the KV dashboard. GET ?meta=1 returns the description; plain GET
        streams the file back (?key= accepted in place of the header, so
        an online viewer can open it from a link; ?inline=1 to show it in
        the browser instead of downloading). Capped at 25 MB (KV's
        per-value limit).

   Deploy target: Cloudflare Workers (dashboard Quick Edit, or wrangler).
   Bindings required (set in the dashboard's Worker Settings -> Variables):
     - D1 database binding named DB (database "risers-progress", table
       from schema.sql) and R2 bucket binding named FILES (bucket
       "risers-files")
     - Secret var SITE_KEY (any long random string — the kid pages send it
       back as a header; this is a soft deterrent against stray traffic,
       not real access control, since a client-side key is inherently
       visible to anyone who opens devtools)
     - Secret var ANTHROPIC_API_KEY (an Anthropic API key). Only needed for
       /evaluate; every other endpoint works fine without it. Real, paid
       usage — priced per token, billed to the Anthropic account the key
       belongs to. A single classroom's worth of reflection checks is a
       small volume, but it is not free; if cost ever becomes a concern,
       the free alternative is Cloudflare's own Workers AI (a binding
       instead of a key, no billing account needed) — swap the fetch()
       call below for env.AI.run() to switch back to it.

   SIGN-IN (Nov 2026): the shared SITE_KEY is being retired. Requests now
   carry a signed pass from the Risers Journey site; see "Sign-in" below.
   Extra bindings: secret AUTH_SECRET (same value as the site's Vercel
   setting) and plain text LEGACY_KEY ("on" keeps the old key working; set
   it to "off" once the sign-in is live). The source is kept in the
   risers-journey repository as worker/progress-worker.js.

   CORS is intentionally wide open (Access-Control-Allow-Origin: *) rather
   than locked to one allowlisted origin. This endpoint is called from the
   public kid site AND the private staff portal, and staff may open the
   portal from a real hosted URL, a preview deploy, or even a local
   file:// page — any of which would get silently blocked by the browser
   if the origin didn't happen to match an allowlist ("Couldn't load live
   data" with no useful detail). Since SITE_KEY is already the only real
   gate here (and it's soft, by design), an origin allowlist added
   friction without adding real security. If real access control is ever
   needed, do it via SITE_KEY / auth, not origin-matching.
*/

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Site-Key, Range',
    'Access-Control-Max-Age': '86400'
  };
}

function json(data, status, extraHeaders) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json' }, extraHeaders || {})
  });
}

const SAFE_SEGMENT = /^[a-z0-9][a-z0-9-]{0,63}$/;

// ---- the store: D1 for records, R2 for file bytes ----
// Table (created once, see schema.sql):
//   records(key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT)
async function getRecord(env, key) {
  const row = await env.DB.prepare('SELECT value FROM records WHERE key = ?').bind(key).first();
  return row ? row.value : null;
}
async function putRecord(env, key, value) {
  await env.DB.prepare(
    'INSERT INTO records (key, value, updated_at) VALUES (?, ?, ?) ' +
    'ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
  ).bind(key, value, new Date().toISOString()).run();
}
async function deleteRecord(env, key) {
  await env.DB.prepare('DELETE FROM records WHERE key = ?').bind(key).run();
}

function keyFor(group, kid, week) {
  return `progress::${group}::${kid}::${week}`;
}

function statusKeyFor(group, kid, week) {
  return `status::${group}::${kid}::${week}`;
}

function ratingKeyFor(group, kid, week) {
  return `rating::${group}::${kid}::${week}`;
}

function fileKeyFor(group, kid, slot) {
  return `file::${group}::${kid}::${slot}`;
}

function fileMetaKeyFor(group, kid, slot) {
  return `filemeta::${group}::${kid}::${slot}`;
}

function parseGroupKidWeek(source) {
  const group = String(source.get ? source.get('group') : source.group || '').toLowerCase();
  const kid = String(source.get ? source.get('kid') : source.kid || '').toLowerCase();
  const week = String(source.get ? source.get('week') : source.week || '').toLowerCase();
  if (![group, kid, week].every(s => SAFE_SEGMENT.test(s))) return null;
  return { group, kid, week };
}

async function handleSync(request, env, url, cors) {
  if (request.method === 'GET') {
    const parsed = parseGroupKidWeek(url.searchParams);
    if (!parsed) return json({ error: 'invalid group/kid/week' }, 400, cors);
    const raw = await getRecord(env, keyFor(parsed.group, parsed.kid, parsed.week));
    if (!raw) return json({ found: false }, 200, cors);
    return json({ found: true, data: JSON.parse(raw) }, 200, cors);
  }

  if (request.method === 'POST') {
    let body;
    try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400, cors); }

    const parsed = parseGroupKidWeek(body);
    if (!parsed) return json({ error: 'invalid group/kid/week' }, 400, cors);
    if (!body.state || typeof body.state !== 'object') {
      return json({ error: 'missing state' }, 400, cors);
    }

    // Cap stored size defensively — this is meant to hold one kid's one
    // week of quest state, never an unbounded blob.
    const serialized = JSON.stringify(body.state);
    if (serialized.length > 200000) {
      return json({ error: 'state too large' }, 413, cors);
    }

    const record = {
      group: parsed.group, kid: parsed.kid, week: parsed.week,
      state: body.state,
      updatedAt: new Date().toISOString()
    };
    await putRecord(env, keyFor(parsed.group, parsed.kid, parsed.week), JSON.stringify(record));
    return json({ ok: true, updatedAt: record.updatedAt }, 200, cors);
  }

  return json({ error: 'method not allowed' }, 405, cors);
}

// Staff-only override: whether a kid's week has been manually marked
// "Incomplete" in Teacher's View. Completed/In Progress are always computed
// live from /sync data — this is the one flag a human sets, for the case
// live data alone can't decide (the week ended and the kid never finished).
async function handleStatus(request, env, url, cors) {
  if (request.method === 'GET') {
    const parsed = parseGroupKidWeek(url.searchParams);
    if (!parsed) return json({ error: 'invalid group/kid/week' }, 400, cors);
    const raw = await getRecord(env, statusKeyFor(parsed.group, parsed.kid, parsed.week));
    if (!raw) return json({ incomplete: false }, 200, cors);
    return json(JSON.parse(raw), 200, cors);
  }

  if (request.method === 'POST') {
    let body;
    try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400, cors); }

    const parsed = parseGroupKidWeek(body);
    if (!parsed) return json({ error: 'invalid group/kid/week' }, 400, cors);

    const record = { incomplete: !!body.incomplete, updatedAt: new Date().toISOString() };
    await putRecord(env, statusKeyFor(parsed.group, parsed.kid, parsed.week), JSON.stringify(record));
    return json({ ok: true, updatedAt: record.updatedAt }, 200, cors);
  }

  return json({ error: 'method not allowed' }, 405, cors);
}

// Staff-entered Day 3 presentation rubric: 5 criteria (content, evidence,
// clarity, delivery, questions), each a 1-4 integer, plus free-text notes
// and who rated it. Mirrors /sync's {found, data} GET shape (rather than
// /status's bare-record shape) since "never rated" and "rated but somehow
// empty" are both real, distinguishable states the Feedback page needs to
// tell apart.
async function handleRating(request, env, url, cors) {
  if (request.method === 'GET') {
    const parsed = parseGroupKidWeek(url.searchParams);
    if (!parsed) return json({ error: 'invalid group/kid/week' }, 400, cors);
    const raw = await getRecord(env, ratingKeyFor(parsed.group, parsed.kid, parsed.week));
    if (!raw) return json({ found: false }, 200, cors);
    return json({ found: true, data: JSON.parse(raw) }, 200, cors);
  }

  if (request.method === 'POST') {
    let body;
    try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400, cors); }

    const parsed = parseGroupKidWeek(body);
    if (!parsed) return json({ error: 'invalid group/kid/week' }, 400, cors);
    if (!body.scores || typeof body.scores !== 'object') {
      return json({ error: 'missing scores' }, 400, cors);
    }

    // Every score has to be a whole number 1-4 — defensive validation so a
    // malformed write can't leave the Feedback page holding a rubric value
    // it isn't prepared to render (its own UI only ever sends 1-4 ints, but
    // this endpoint could in principle be called by anything).
    const scores = {};
    const scoreKeys = Object.keys(body.scores);
    for (let i = 0; i < scoreKeys.length; i++) {
      const key = scoreKeys[i];
      const v = Number(body.scores[key]);
      if (!Number.isInteger(v) || v < 1 || v > 4) {
        return json({ error: 'invalid score for ' + key }, 400, cors);
      }
      scores[key] = v;
    }

    const record = {
      group: parsed.group, kid: parsed.kid, week: parsed.week,
      scores: scores,
      notes: typeof body.notes === 'string' ? body.notes.slice(0, 2000) : '',
      facilitator: typeof body.facilitator === 'string' ? body.facilitator.slice(0, 100) : '',
      updatedAt: new Date().toISOString()
    };
    await putRecord(env, ratingKeyFor(parsed.group, parsed.kid, parsed.week), JSON.stringify(record));
    return json({ ok: true, updatedAt: record.updatedAt }, 200, cors);
  }

  return json({ error: 'method not allowed' }, 405, cors);
}

// Meaning check: called only when the local keyword check already failed,
// so this is the fallback path, not the primary grading path — most
// correct answers pass on keywords alone and never reach here. Uses raw
// HTTP to the Messages API (this Worker is a single pasted file with no
// build step, so the npm SDK isn't practical here) with structured
// outputs (output_config.format) to get a reliable {pass, feedback}
// shape back instead of parsing free text. No KV write — this is a
// stateless judge call, nothing about it is progress to persist.
const EVAL_SYSTEM_PROMPT = [
  "You are grading a middle/high-school student's short written answer to a",
  "reflection question in a self-paced science quest. You'll get the",
  "question, a list of concept groups a correct answer should touch on",
  "(the student does NOT need to use these exact words — any reasonable",
  "phrasing of the same idea counts), and the student's answer.",
  "",
  "A local keyword check already ran on this answer and did NOT find a",
  "match — that's WHY you're being asked. Your job is to catch a genuinely",
  "correct answer that just used different words than the keyword list,",
  "not to be a second, looser keyword check. Be lenient on grammar,",
  "spelling, and phrasing. Be strict on the actual science: if the answer",
  "is off-topic, factually wrong, missing a required concept entirely, or",
  "just restates the question without real content, it fails.",
  "",
  "Respond with a JSON object: pass (boolean) and feedback (one short,",
  "encouraging, kid-friendly sentence — if passing, briefly affirm what",
  "they got right; if failing, name what's missing or wrong WITHOUT",
  "revealing the exact answer)."
].join('\n');

const EVAL_SCHEMA = {
  type: 'object',
  properties: {
    pass: { type: 'boolean' },
    feedback: { type: 'string' }
  },
  required: ['pass', 'feedback'],
  additionalProperties: false
};

async function handleEvaluate(request, env, cors) {
  if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405, cors);
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'meaning check not configured' }, 503, cors);

  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400, cors); }

  const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 2000) : '';
  const answer = typeof body.answer === 'string' ? body.answer.trim().slice(0, 2000) : '';
  const groups = Array.isArray(body.keywordGroups) ? body.keywordGroups : [];
  if (!prompt || !answer) return json({ error: 'missing prompt or answer' }, 400, cors);

  const conceptLines = groups
    .filter(g => Array.isArray(g) && g.length)
    .map((g, i) => `Concept ${i + 1} (any of these words/phrases, or an equivalent idea): ${g.join(', ')}`)
    .join('\n');

  const userContent = 'Question: ' + prompt +
    (conceptLines ? '\n\nConcepts a correct answer should touch on:\n' + conceptLines : '') +
    '\n\nStudent\'s answer: ' + answer;

  let upstream;
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: EVAL_SYSTEM_PROMPT,
        output_config: { format: { type: 'json_schema', schema: EVAL_SCHEMA } },
        messages: [{ role: 'user', content: userContent }]
      })
    });
  } catch (e) {
    return json({ error: 'upstream unreachable' }, 502, cors);
  }

  if (!upstream.ok) {
    return json({ error: 'anthropic api error ' + upstream.status }, 502, cors);
  }

  let data;
  try { data = await upstream.json(); } catch (e) { return json({ error: 'bad upstream response' }, 502, cors); }

  const textBlock = Array.isArray(data.content) ? data.content.find(b => b.type === 'text') : null;
  if (!textBlock) return json({ error: 'no verdict returned' }, 502, cors);

  let verdict;
  try { verdict = JSON.parse(textBlock.text); } catch (e) { return json({ error: 'bad verdict json' }, 502, cors); }

  return json({ pass: !!verdict.pass, feedback: typeof verdict.feedback === 'string' ? verdict.feedback.slice(0, 300) : '' }, 200, cors);
}

// ---- /file — upload once, then download only ----
const FILE_MAX_BYTES = 25 * 1024 * 1024;
const FILE_SLOTS = ['term1-slideshow'];
const FILE_TYPES = {
  pdf: 'application/pdf',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  key: 'application/vnd.apple.keynote',
  odp: 'application/vnd.oasis.opendocument.presentation'
};
// A quest's build video: slot "build-video-week-NN", one per kid per quest.
// Unlike the slideshow, staff may remove it (DELETE) and upload another.
const VIDEO_SLOT = /^build-video-week-\d{2}$/;
const VIDEO_TYPES = {
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm'
};
function slotAllowed(slot) { return FILE_SLOTS.indexOf(slot) !== -1 || VIDEO_SLOT.test(slot); }
function typesFor(slot) { return VIDEO_SLOT.test(slot) ? VIDEO_TYPES : FILE_TYPES; }

async function handleFile(request, env, url, cors) {
  const group = String(url.searchParams.get('group') || '').toLowerCase();
  const kid = String(url.searchParams.get('kid') || '').toLowerCase();
  const slot = String(url.searchParams.get('slot') || '').toLowerCase();
  if (![group, kid, slot].every(s => SAFE_SEGMENT.test(s)) || !slotAllowed(slot)) {
    return json({ error: 'invalid group/kid/slot' }, 400, cors);
  }
  const metaKey = fileMetaKeyFor(group, kid, slot);

  if (request.method === 'GET') {
    const metaRaw = await getRecord(env, metaKey);
    if (!metaRaw) return json({ found: false }, 200, cors);
    const meta = JSON.parse(metaRaw);
    if (url.searchParams.get('meta')) return json({ found: true, file: meta }, 200, cors);
    const safeName = meta.name.replace(/["\\\r\n]/g, '_');
    // Video players (Safari above all) ask for byte ranges and won't play
    // or seek without a 206 answer, so honor a single "bytes=a-b" range.
    const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('Range') || '');
    if (range && (range[1] || range[2])) {
      const size = meta.size;
      const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
      const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      if (start >= size || start > end) {
        return new Response(null, { status: 416, headers: Object.assign({ 'Content-Range': `bytes */${size}` }, cors) });
      }
      const part = await env.FILES.get(fileKeyFor(group, kid, slot), { range: { offset: start, length: end - start + 1 } });
      if (!part) return json({ found: false }, 200, cors);
      return new Response(part.body, {
        status: 206,
        headers: Object.assign({
          'Content-Type': meta.type,
          'Content-Range': `bytes ${start}-${end}/${size}`,
          'Content-Length': String(end - start + 1),
          'Accept-Ranges': 'bytes',
          'Content-Disposition': `inline; filename="${safeName}"`
        }, cors)
      });
    }
    const obj = await env.FILES.get(fileKeyFor(group, kid, slot));
    if (!obj) return json({ found: false }, 200, cors);
    return new Response(obj.body, {
      status: 200,
      headers: Object.assign({
        'Content-Type': meta.type,
        // ?inline=1 lets the browser show it (View); otherwise it downloads.
        'Content-Disposition': `${url.searchParams.get('inline') ? 'inline' : 'attachment'}; filename="${safeName}"`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(obj.size)
      }, cors)
    });
  }

  if (request.method === 'POST') {
    if (await getRecord(env, metaKey)) {
      return json({ error: 'already uploaded' }, 409, cors);
    }
    const name = String(url.searchParams.get('name') || '').trim().slice(0, 150);
    const ext = (name.match(/\.([a-z0-9]+)$/i) || [])[1];
    const type = ext && typesFor(slot)[ext.toLowerCase()];
    if (!name || !type) return json({ error: 'unsupported file type' }, 415, cors);
    const declared = Number(request.headers.get('Content-Length') || 0);
    if (declared > FILE_MAX_BYTES) return json({ error: 'file too large' }, 413, cors);
    const bytes = await request.arrayBuffer();
    if (!bytes.byteLength) return json({ error: 'empty file' }, 400, cors);
    if (bytes.byteLength > FILE_MAX_BYTES) return json({ error: 'file too large' }, 413, cors);

    const meta = { name, type, size: bytes.byteLength, uploadedAt: new Date().toISOString() };
    // Bytes first, then the description — the description is what marks
    // the slot as taken, so it's only written once the file is safely in.
    await env.FILES.put(fileKeyFor(group, kid, slot), bytes, { httpMetadata: { contentType: type } });
    await putRecord(env, metaKey, JSON.stringify(meta));
    return json({ ok: true, file: meta }, 200, cors);
  }

  // Build videos only: remove, so staff can upload a different one.
  if (request.method === 'DELETE' && VIDEO_SLOT.test(slot)) {
    await deleteRecord(env, metaKey);
    await env.FILES.delete(fileKeyFor(group, kid, slot));
    return json({ ok: true }, 200, cors);
  }

  return json({ error: 'method not allowed' }, 405, cors);
}

// ---- Sign-in (added Nov 2026) ----
// Pages no longer carry a shared key. Each request brings a signed pass
// (X-Site-Key: "<body>.<signature>") that the Risers Journey site hands out
// after sign-in; it's signed with AUTH_SECRET, which only this Worker and
// the site's server know. The pass says who it is for:
//   r: 'kid'   a Riser: only their own records (rules in kidAllowed)
//   r: 'staff' a facilitator: everything
//   t: 'server' the site's own server: everything, plus /auth
// The old shared key (SITE_KEY) still works while LEGACY_KEY is "on", so
// nothing breaks before the sign-in is switched on; turn it off then.

const enc = new TextEncoder();
let authKeyPromise = null, authKeyFor = null;
function authKey(env) {
  if (authKeyFor !== env.AUTH_SECRET) {
    authKeyFor = env.AUTH_SECRET;
    authKeyPromise = crypto.subtle.importKey('raw', enc.encode(env.AUTH_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  }
  return authKeyPromise;
}
function b64url(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function hmac(env, text) {
  return b64url(new Uint8Array(await crypto.subtle.sign('HMAC', await authKey(env), enc.encode(text))));
}
function sameString(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
async function readPass(env, token) {
  if (!env.AUTH_SECRET || !token || token.length > 2000) return null;
  const dot = token.indexOf('.');
  if (dot < 1) return null;
  const body = token.slice(0, dot);
  if (!sameString(token.slice(dot + 1), await hmac(env, 'rj1.' + body))) return null;
  let c;
  try {
    const bin = atob(body.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((body.length + 3) % 4));
    c = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (ch) => ch.charCodeAt(0))));
  } catch (e) { return null; }
  if (!c || typeof c.e !== 'number' || c.e < Date.now()) return null;
  if (c.t === 'server') return { role: 'server' };
  if (c.t === 'store' && c.r === 'staff') return { role: 'staff', id: String(c.k) };
  if (c.t === 'store' && c.r === 'kid' && SAFE_SEGMENT.test(String(c.k))) return { role: 'kid', id: String(c.k) };
  return null;
}

// No list of Risers here: the site only signs passes for real ones.
// Records about a Riser that only facilitators may see.
const STAFF_ONLY_WEEKS = [/^term3-tracking$/, /^term2-self-assessment-(jeran|nishitha|blessy)$/];
// Records a Riser may read but only facilitators write (feedback, marks,
// the agreed self-assessment).
const KID_READ_ONLY_WEEKS = [/-staff$/, /-marks$/, /^term2-self-assessment-consolidated$/];

function kidAllowed(me, path, method, url, body) {
  if (path === '/evaluate') return true;
  const src = method === 'POST' && path === '/sync' ? body : null;
  const pick = (k) => String(src ? (src[k] || '') : (url.searchParams.get(k) || '')).toLowerCase();
  const kid = pick('kid'), week = pick('week');
  if (path === '/status' || path === '/rating') return method === 'GET' && kid === me;
  if (path === '/file') return kid === me && (method === 'GET' || method === 'POST');
  if (path !== '/sync') return false;
  if (kid === me) {
    if (STAFF_ONLY_WEEKS.some((r) => r.test(week))) return false;
    if (method === 'POST' && KID_READ_ONLY_WEEKS.some((r) => r.test(week))) return false;
    return true;
  }
  return kid === 'staff' && method === 'GET'; // shared staff records (approvals, papers): read only; anyone else's: no
}

async function logRefusal(env, entry) {
  try {
    const raw = await getRecord(env, 'auth::denied');
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(Object.assign({ at: new Date().toISOString() }, entry));
    await putRecord(env, 'auth::denied', JSON.stringify(list.slice(0, 50)));
  } catch (e) { /* the refusal stands either way */ }
}

// ---- /auth: PINs, device codes. Only the site's server may call it. ----
const LOCK_AFTER = 5, LOCK_MINUTES = 15;
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function randomDigits(n) {
  const a = new Uint32Array(n);
  crypto.getRandomValues(a);
  return Array.from(a, (x) => String(x % 10)).join('');
}
function randomCode(n) {
  const a = new Uint32Array(n);
  crypto.getRandomValues(a);
  return Array.from(a, (x) => CODE_CHARS[x % CODE_CHARS.length]).join('');
}
function randomSalt() {
  const a = new Uint8Array(12);
  crypto.getRandomValues(a);
  return b64url(a);
}
async function getJson(env, key) {
  const raw = await getRecord(env, key);
  return raw ? JSON.parse(raw) : null;
}
function putJson(env, key, value) { return putRecord(env, key, JSON.stringify(value)); }

// A rolling count per hour, for limits that aren't tied to one person.
async function countThisHour(env, key, max) {
  const now = Date.now();
  const r = (await getJson(env, key)) || { from: now, n: 0 };
  if (now - r.from > 3600e3) { r.from = now; r.n = 0; }
  if (r.n >= max) return false;
  r.n += 1;
  await putJson(env, key, r);
  return true;
}

async function handleAuth(request, env, cors) {
  if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405, cors);
  let b;
  try { b = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400, cors); }
  const role = b.role === 'staff' ? 'staff' : 'kid';
  const id = String(b.id || '').toLowerCase();
  if (b.id !== undefined && !SAFE_SEGMENT.test(id)) return json({ error: 'bad id' }, 400, cors);
  const pinKey = 'auth::pin::' + role + '::' + id, lockKey = 'auth::lock::' + role + '::' + id;
  const now = Date.now();

  switch (b.op) {
    case 'pin-set': {
      if (!/^\d{4,8}$/.test(String(b.pin || ''))) return json({ ok: false, error: 'bad pin' }, 400, cors);
      const salt = randomSalt();
      await putJson(env, pinKey, { salt, hash: await hmac(env, 'pin|' + role + '|' + id + '|' + salt + '|' + b.pin), at: new Date().toISOString() });
      await deleteRecord(env, lockKey);
      return json({ ok: true }, 200, cors);
    }
    case 'pin-check': {
      const lock = (await getJson(env, lockKey)) || { fails: 0, until: 0 };
      if (lock.until > now) return json({ ok: false, locked: true, wait: lock.until - now }, 200, cors);
      const rec = await getJson(env, pinKey);
      if (!rec) return json({ ok: false, nopin: true }, 200, cors);
      const good = sameString(rec.hash, await hmac(env, 'pin|' + role + '|' + id + '|' + rec.salt + '|' + String(b.pin || '')));
      if (good) {
        if (lock.fails) await deleteRecord(env, lockKey);
        return json({ ok: true }, 200, cors);
      }
      lock.fails = (lock.until && lock.until <= now ? 0 : lock.fails) + 1;
      lock.until = 0;
      if (lock.fails >= LOCK_AFTER) { lock.fails = 0; lock.until = now + LOCK_MINUTES * 60e3; }
      await putJson(env, lockKey, lock);
      return lock.until
        ? json({ ok: false, locked: true, wait: lock.until - now }, 200, cors)
        : json({ ok: false, left: LOCK_AFTER - lock.fails }, 200, cors);
    }
    case 'pin-list': {
      const rows = await env.DB.prepare("SELECT key, value FROM records WHERE key LIKE 'auth::pin::%' OR key LIKE 'auth::lock::%'").all();
      const set = [], locked = [];
      (rows.results || []).forEach((r) => {
        const p = r.key.split('::');
        if (p[1] === 'pin') set.push(p[2] + ':' + p[3]);
        else { try { if (JSON.parse(r.value).until > now) locked.push(p[2] + ':' + p[3]); } catch (e) {} }
      });
      return json({ ok: true, set, locked }, 200, cors);
    }
    case 'chal-new': {
      if (!(await countThisHour(env, 'auth::chal-rate', 10))) return json({ ok: false, error: 'Too many codes asked for. Try again in an hour, or use a device code.' }, 200, cors);
      const code = randomDigits(6);
      await putJson(env, 'auth::chal::' + id, { hash: await hmac(env, 'chal|' + code), until: now + 10 * 60e3, tries: 0 });
      return json({ ok: true, code }, 200, cors);
    }
    case 'chal-check': {
      const key = 'auth::chal::' + id, rec = await getJson(env, key);
      if (!rec || rec.until < now) return json({ ok: false, error: 'That code has run out. Ask for a new one.' }, 200, cors);
      if (sameString(rec.hash, await hmac(env, 'chal|' + String(b.code || '')))) {
        await deleteRecord(env, key);
        return json({ ok: true }, 200, cors);
      }
      rec.tries += 1;
      if (rec.tries >= 5) { await deleteRecord(env, key); return json({ ok: false, error: 'Too many wrong tries. Ask for a new code.' }, 200, cors); }
      await putJson(env, key, rec);
      return json({ ok: false, error: 'That code isn’t right.' }, 200, cors);
    }
    case 'devcode-new': {
      const code = randomCode(8);
      const uses = Math.max(1, Math.min(50, Number(b.uses) || 1));
      const minutes = Math.max(5, Math.min(60 * 24 * 30, Number(b.minutes) || 30));
      await putJson(env, 'auth::devcode::' + (await hmac(env, 'dev|' + code)), { uses, until: now + minutes * 60e3 });
      return json({ ok: true, code, uses, until: new Date(now + minutes * 60e3).toISOString() }, 200, cors);
    }
    case 'devcode-use': {
      if (!(await countThisHour(env, 'auth::devcode-tries', 30))) return json({ ok: false, error: 'Too many tries. Wait an hour.' }, 200, cors);
      const key = 'auth::devcode::' + (await hmac(env, 'dev|' + String(b.code || '').toUpperCase()));
      const rec = await getJson(env, key);
      if (!rec || rec.until < now || rec.uses < 1) return json({ ok: false, error: 'That code isn’t right, or it has run out.' }, 200, cors);
      rec.uses -= 1;
      if (rec.uses < 1) await deleteRecord(env, key); else await putJson(env, key, rec);
      return json({ ok: true }, 200, cors);
    }
    case 'denied-list':
      return json({ ok: true, items: (await getJson(env, 'auth::denied')) || [] }, 200, cors);
  }
  return json({ error: 'unknown op' }, 400, cors);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders();
    // /file/<any-name.ext> is the same as /file — viewers that go by the
    // link's ending (like Microsoft's) get a proper file name to look at.
    const path = /^\/file\/[^/]+$/.test(url.pathname) ? '/file' : url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === '/health') {
      return json({ ok: true }, 200, cors);
    }

    if (['/sync', '/status', '/rating', '/evaluate', '/file', '/auth'].indexOf(path) === -1) {
      return json({ error: 'not found' }, 404, cors);
    }

    // Who is asking: a signed pass (see "Sign-in" above), or the old shared
    // key while LEGACY_KEY is "on". A file download may pass it as ?key=
    // instead of the header: an online viewer (Microsoft's, for
    // PowerPoint) fetches the file from a plain link and can't send headers.
    const fileGetKey = path === '/file' && request.method === 'GET' ? url.searchParams.get('key') : null;
    const siteKey = request.headers.get('X-Site-Key') || fileGetKey || '';
    let who = await readPass(env, siteKey);
    if (!who && env.LEGACY_KEY === 'on' && env.SITE_KEY && siteKey === env.SITE_KEY) who = { role: 'legacy' };
    if (!who) return json({ error: 'unauthorized' }, 401, cors);

    if (path === '/auth') {
      return who.role === 'server' ? handleAuth(request, env, cors) : json({ error: 'forbidden' }, 403, cors);
    }

    if (who.role === 'kid') {
      // A /sync save names its record in the body; read it from a copy.
      let body = null;
      if (request.method === 'POST' && path === '/sync') {
        try { body = await request.clone().json(); } catch (e) { body = {}; }
      }
      if (!kidAllowed(who.id, path, request.method, url, body)) {
        const src = body || {};
        await logRefusal(env, {
          who: who.id, path, method: request.method,
          group: String(src.group || url.searchParams.get('group') || ''),
          kid: String(src.kid || url.searchParams.get('kid') || ''),
          week: String(src.week || url.searchParams.get('week') || url.searchParams.get('slot') || '')
        });
        return json({ error: 'forbidden' }, 403, cors);
      }
    }

    if (path === '/sync') return handleSync(request, env, url, cors);
    if (path === '/status') return handleStatus(request, env, url, cors);
    if (path === '/evaluate') return handleEvaluate(request, env, cors);
    if (path === '/file') return handleFile(request, env, url, cors);
    return handleRating(request, env, url, cors);
  }
};
