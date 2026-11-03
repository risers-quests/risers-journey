/* Term 3 — who facilitates what, for the staff Facilitators view
   (schedule.js). Each facilitator's week is worked out from the Risers'
   usual-week schedules with these rules; anything else (STEM, Drama,
   Carpentry, Music, Tamil, Snack, Lunch, Thursday and Friday Negotiable
   Time …) is someone else's, or not assigned. */
window.T3_FACILITATORS = {
  names: ['Jeran', 'Nishitha', 'Blessy'],
  // Days each one works (all five unless listed).
  days: { Nishitha: ['Mon', 'Tue', 'Wed'] },
  // Core Skills (and Progress Board) by Riser.
  core: {
    Jeran: ['chris', 'zach', 'yokesh', 'benjamin', 'karis', 'shalom', 'michael'],
    Blessy: ['gabby', 'elyon', 'eva', 'owen', 'pranavi']
  },
  // A block's name → who runs it. day is Mon … Fri.
  who: function (t, slug, day) {
    var F = window.T3_FACILITATORS;
    if (/set up/i.test(t)) return [];
    if (/core skills|progress board/i.test(t)) return F.core.Jeran.indexOf(slug) !== -1 ? ['Jeran'] : F.core.Blessy.indexOf(slug) !== -1 ? ['Blessy'] : [];
    if (/catch-up/i.test(t)) return ['Jeran', 'Nishitha', 'Blessy'];
    if (/daring/i.test(t)) return ['Nishitha'];
    if (/^\s*sel\s*$/i.test(t)) return ['Jeran'];
    if (/negotiable/i.test(t)) return day === 'Thu' || day === 'Fri' ? [] : ['Nishitha'];
    if (/global exploration/i.test(t)) return ['Blessy'];
    if (/garden/i.test(t)) return ['Blessy'];
    if (/skill builder/i.test(t)) return ['Blessy'];
    if (/riser recess/i.test(t)) return day === 'Thu' ? ['Jeran', 'Blessy'] : ['Jeran', 'Blessy', 'Nishitha'];
    return [];
  }
};
