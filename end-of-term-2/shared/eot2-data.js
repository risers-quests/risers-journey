/* End of Term 2 — shared roster + rater list.
   Kid-safe: slug, display name, group only (same shape dashboard/roster.js
   already uses for routing). Kept separate from dashboard/roster.js since
   that file is quest-topic data; this is just who's who for EOT2 forms. */
/* ageBand: '8-10' | '11-13' — purely internal, picks which Term Reflection
   question set a kid gets. Never shown on the page in any form. */
window.EOT2_KIDS = [
  { slug: 'eva', name: 'Eva', group: 'group-00', ageBand: '8-10' },
  { slug: 'gabby', name: 'Gabby', group: 'group-00', ageBand: '8-10' },
  { slug: 'elyon', name: 'Elyon', group: 'group-00', ageBand: '8-10' },
  { slug: 'chris', name: 'Chris', group: 'group-01', ageBand: '8-10' },
  { slug: 'yokesh', name: 'Yokesh', group: 'group-01', ageBand: '8-10' },
  { slug: 'zach', name: 'Zach', group: 'group-01', ageBand: '8-10' },
  { slug: 'owen', name: 'Owen', group: 'group-02', ageBand: '11-13' },
  { slug: 'pranavi', name: 'Pranavi', group: 'group-02', ageBand: '11-13' },
  { slug: 'shalom', name: 'Shalom', group: 'group-03', ageBand: '11-13' },
  { slug: 'michael', name: 'Michael', group: 'group-03', ageBand: '11-13' },
  { slug: 'karis', name: 'Karis', group: 'group-03', ageBand: '11-13' },
  { slug: 'benjamin', name: 'Benjamin', group: 'group-04', ageBand: '11-13' }
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
