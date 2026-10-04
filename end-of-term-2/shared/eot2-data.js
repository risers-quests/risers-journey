/* End of Term 2 — shared roster + rater list.
   Kid-safe: slug, display name, group only (same shape dashboard/roster.js
   already uses for routing). Kept separate from dashboard/roster.js since
   that file is quest-topic data; this is just who's who for EOT2 forms. */
/* ageBand: '8-10' | '11-13' | null. Null means "not set yet" — Term
   Reflection falls back to asking on the page until the real age list
   comes in; fill these in once we have it instead of guessing. */
window.EOT2_KIDS = [
  { slug: 'eva', name: 'Eva', group: 'group-00', ageBand: null },
  { slug: 'gabby', name: 'Gabby', group: 'group-00', ageBand: null },
  { slug: 'elyon', name: 'Elyon', group: 'group-00', ageBand: null },
  { slug: 'chris', name: 'Chris', group: 'group-01', ageBand: null },
  { slug: 'yokesh', name: 'Yokesh', group: 'group-01', ageBand: null },
  { slug: 'zach', name: 'Zach', group: 'group-01', ageBand: null },
  { slug: 'owen', name: 'Owen', group: 'group-02', ageBand: null },
  { slug: 'pranavi', name: 'Pranavi', group: 'group-02', ageBand: null },
  { slug: 'shalom', name: 'Shalom', group: 'group-03', ageBand: null },
  { slug: 'michael', name: 'Michael', group: 'group-03', ageBand: null },
  { slug: 'karis', name: 'Karis', group: 'group-03', ageBand: null },
  { slug: 'benjamin', name: 'Benjamin', group: 'group-04', ageBand: null }
];

/* The three staff raters plus the manually-authored consolidated copy.
   "self" (the kid's own copy) is handled separately, not listed here —
   it's reached through the kid-facing page, not the staff rater picker. */
window.EOT2_STAFF_RATERS = [
  { id: 'jeran', label: 'Jeran' },
  { id: 'nishitha', label: 'Nishitha' },
  { id: 'blessy', label: 'Blessy' },
  { id: 'consolidated', label: 'Consolidated (final)' }
];

window.EOT2_findKid = function (slug) {
  return window.EOT2_KIDS.filter(function (k) { return k.slug === slug; })[0] || null;
};
window.EOT2_findKidByName = function (name) {
  var needle = String(name || '').trim().toLowerCase();
  return window.EOT2_KIDS.filter(function (k) { return k.name.toLowerCase() === needle; })[0] || null;
};
