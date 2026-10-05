/* Term 2 Conference (folder: end-of-term-2) — sync helper. Reuses the SAME Cloudflare Worker and the
   same generic /sync endpoint every quest page already uses (group/kid/week
   -> arbitrary state JSON) — no Worker changes needed. Each EOT2 record
   just uses a synthetic "week" value instead of a real quest week:
     term2-self-assessment-self | -jeran | -nishitha | -blessy | -consolidated
     term2-term-reflection
     term2-mom
   That keeps every EOT2 record in the same KV store, addressed the same
   way, with zero backend risk to the live quest sync data. */
window.EOT2_WORKER_URL = 'https://risers-term2-digital-quests-progress.highergrade.workers.dev';
window.EOT2_SITE_KEY = 'RsmI8VwuJZ-IIieNmVss5JyChP2nf7y8mVYU5ReJLYM';

function eot2SyncUrl(group, kid, weekKey) {
  var base = window.EOT2_WORKER_URL.replace(/\/$/, '');
  return base + '/sync?group=' + encodeURIComponent(group) + '&kid=' + encodeURIComponent(kid) + '&week=' + encodeURIComponent(weekKey);
}

/* Resolves to { state, updatedAt } or null if nothing saved yet / unreachable. */
window.eot2Fetch = function (group, kid, weekKey) {
  return fetch(eot2SyncUrl(group, kid, weekKey), { headers: { 'X-Site-Key': window.EOT2_SITE_KEY } })
    .then(function (r) { return r.ok ? r.json() : { found: false }; })
    .then(function (data) { return (data.found && data.data) ? data.data : null; })
    .catch(function () { return null; });
};

/* Resolves to { ok, updatedAt } — ok:false on any network/HTTP failure so
   callers can show a real "not synced" state instead of a false "Saved". */
window.eot2Save = function (group, kid, weekKey, state) {
  return fetch(eot2SyncUrl(group, kid, weekKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Site-Key': window.EOT2_SITE_KEY },
    body: JSON.stringify({ group: group, kid: kid, week: weekKey, state: state })
  })
    .then(function (r) { return r.json().then(function (data) { return { ok: r.ok && !!data.ok, updatedAt: data.updatedAt }; }); })
    .catch(function () { return { ok: false }; });
};

function eot2LocalKey(weekKey, kidSlug) { return 'eot2::' + weekKey + '::' + kidSlug; }
window.eot2LoadLocal = function (weekKey, kidSlug) {
  try {
    var raw = localStorage.getItem(eot2LocalKey(weekKey, kidSlug));
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
};
window.eot2SaveLocal = function (weekKey, kidSlug, state) {
  try { localStorage.setItem(eot2LocalKey(weekKey, kidSlug), JSON.stringify(state)); } catch (e) {}
};
