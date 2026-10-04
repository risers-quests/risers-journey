# Circulatory System — Group 4 (Quests, Level 4)

Prepared for **Benjamin**, the only kid at Level 4. This is a **Quests**-format
quest — scenario-driven with real stakes, not a lab-report frame — and, per
the framework's ladder table, a **5-day** quest, not 3.

This folder previously held a Reproductive System rotation; it was fully
replaced with a Circulatory System rotation, sourced directly from a
parent-supplied Class 8 Concise Biology textbook chapter ("The Circulatory
System"). The folder itself was renamed from
`group-04-week-01-reproductive-system` to `group-04-week-01-circulatory-system`
to match — every reference across both repos (roster.js, Teacher's View,
this group's own answer key) was updated to match the new path.

## The scenario

Benjamin is framed as a **Heart Health Educator** on a week-long rotation
in Pulse General Hospital's Community Wellness Program, under mentor **Dr.
Priya Vasquez**. The week builds toward Friday's real, in-narrative event —
the hospital's **Community Heart Health Fair** — rather than a medical
emergency: a Day 4 blood-drive info card to prepare (compatibility-checking
donor and recipient blood groups correctly, modeled on the source
textbook's own case-study format) and a Day 5 booth explainer to write —
correctly distinguishing a heart attack from a cardiac arrest and naming
the right first-aid response, so fairgoers walk away actually informed.
The content itself — the mechanisms, the conditions, the first-aid steps —
is identical to a disease-framed version; only the narrative lens changed,
from crisis response to public health education.

## Full topic coverage (mirrors the source chapter's own syllabus exactly)

- Internal heart structure: four chambers (2 atria, 2 ventricles), the
  septum, all four valves (tricuspid, bicuspid/mitral, both semilunar
  valves), the pericardium/pericardial fluid, the SA node/natural
  pacemaker, and artificial pacemakers
- Blood vessels: arteries/veins/capillaries and their real differences,
  plus the specific named vessels — venae cavae, pulmonary
  trunk/arteries/veins, aorta, coronary artery/veins
- Double circulation: pulmonary circulation + systemic circulation as one
  continuous two-loop system
- The lymphatic system as a parallel network: tissue fluid, lymph
  composition and functions, lymph nodes, spleen, tonsils, thymus, the
  thoracic duct
- Blood groups: the ABO system, antigens, universal donor (O) and
  universal recipient (AB), full transfusion compatibility
- Heart-related conditions: palpitations, hypertension, heart attack,
  cardiac arrest — including the real mechanism distinction between the
  last two, and correct first-aid/CPR response
- **History (mandatory):** William Harvey 1628 (*De Motu Cordis*, the
  first accurate closed-loop circulation model), René Laennec 1816 (the
  stethoscope), Karl Landsteiner 1900 (the ABO blood group system —
  dated to match the source textbook exactly), Willem Einthoven 1903
  (the first practical ECG), Rune Elmqvist & Åke Senning 1958 (the first
  implanted artificial pacemaker)
- **Real-world application (mandatory):** blood pressure cuffs,
  stethoscopes, ECG machines, coronary angioplasty/bypass surgery, blood
  donation and blood banks, and the ABO compatibility chart every real
  transfusion is checked against

## What makes this genuinely richer than a 3-day quest

- **9 numbered reading sections across 5 days** (vs. 4–5 sections used in
  the 3-day Discovery/Quests groups), each gated behind the section before
  it via the shared section-lock engine.
- **Two distinct games**, not one: the existing term-matching engine on
  Day 1 (`initMatchGame`), plus a genuinely new game type on Day 2 — a
  click-the-steps-in-order sequence game (`initSequenceGame`, new function,
  added locally to this folder's copy of `quest.js` only) where Benjamin
  traces the 8-stop double-circulation loop in the correct order. A wrong
  click just shakes, no penalty — misses (not moves) drive the star rating.
- **A real, substantial physical build** — not the flimsy version: a
  three-color (red/blue/yellow) tube-and-heart model of double circulation
  PLUS the lymphatic system running alongside it, with every stop actually
  named, not just color-coded. This directly extends the source chapter's
  own official end-of-chapter project ("using coloured Red and Blue tubes,
  develop a model of pulmonary circulation and systemic circulation with
  heart in the middle") — yellow was added for the lymphatic system to
  match Fig. 6.1's own color key from the same chapter, and a 6-item build
  checklist (vs. 5 elsewhere) keeps it appropriately demanding.
- **Two evidence-based case questions**, each requiring a full paragraph
  that cites the actual mechanism, not opinion: the Day 4 blood-drive info
  card (refl-7) and the Day 5 booth explainer (refl-8).
- **13 total invisible-evaluation checks plus a 6-item physical build**,
  5 of which require a full paragraph.

## Invisible evaluation — rotated across all 5 days

1. **Explain-the-error** (refl-1, Day 1) — a flawed claim about blood
   mixing between the heart's two sides.
2. **Full-sequence paragraph** (refl-2, Day 1) — all four heart valves,
   in order.
3. **Quick check** (refl-9, Day 1) — the SA node/natural pacemaker.
4. **Two-part comparison** (refl-3, Day 2) — artery vs. vein, both
   pressure/speed AND valves.
5. **Quick check** (refl-10, Day 2) — the coronary artery.
6. **Full-sequence paragraph** (refl-4, Day 2) — the double-circulation
   loop, both directions.
7. **Quick check** (refl-5, Day 3) — two real functions of lymph.
8. **Self-check reflection** (refl-11, Day 3) — on the physical build.
9. **Quick check** (refl-6, Day 4) — universal donor/recipient mechanism.
10. **Case judgment / paragraph** (refl-7, Day 4) — the blood-drive info
    card.
11. **Case judgment / paragraph** (refl-8, Day 5) — the booth explainer,
    the week's centerpiece.
12. **Teach-it-forward** (refl-12, Day 5) — explaining the whole system to
    a "new volunteer," the Level 4-specific pre-presentation mandate.
13. **Self-check reflection, final** (refl-13, Day 5) — on the whole week
    and the booth explainer's own weak point.

## Videos — five embedded, one placeholder

One video was verified during the initial build via web search across
multiple corroborating results: Amoeba Sisters' **"Circulatory System and
Pathway of Blood Through the Heart"** (`_vZ0lefPg_0`), on Day 1. The
parent supplied four more real links directly, now embedded and
watch-gated: **Blood Vessels — Structure & Function** (`v43ej5lCeBo`, Day
2, gates Section 6), **Pulmonary & Systemic Circulation** (`NDk8fmIl9V8`,
Day 2, gates Section 7/Day 3), **The Lymphatic System** (`I7orwMgTQ5I`,
Day 3, gates Section 8/Day 4), and **Blood Types & Transfusion
Compatibility** (`xfZhb6lmxjk`, Day 4, gates Section 9/Day 5). Day 5's
heart-attack-vs-cardiac-arrest video is still a `.video-placeholder` card
(no link supplied for that topic yet) — swapping it in only needs the
`.video-card.video-placeholder` block replaced with the normal
`.video-embed-wrap` + `<iframe data-gate-video="...">` pattern (see
"Video watch-gate" below) used for the other four.

### Video watch-gate

A gated video (`data-gate-video="<youtube-id>"` on its `.video-card`) has
to actually play through before the section it's in counts as done — the
same section-lock that already gates reflection questions now also
checks watch state, so the NEXT section stays blurred/locked until the
video is genuinely watched, not just present on the page. "Watched" is
tracked as real accumulated play time via the YouTube IFrame Player
API (polled once a second), not just reaching the visual end — a big
scrubber jump toward the end isn't credited, only steady forward
playback is, so dragging straight to the end doesn't fake completion.
Like the rest of the site's gating, this is a soft, client-side check
(localStorage-based, bypassable via devtools by a technically determined
kid) meant to stop casual skipping, not to be tamper-proof. New engine
function `initVideoGate`, local to this folder's `js/quest.js` only.

## The Day 3 build

See "What makes this genuinely richer" above — full materials-pool →
tear-off-slip → justify-table → build-checklist → results structure, same
as every other group, themed with a `model3d-stage` rotating through six
previews of the finished three-color model.

## Engine changes (local to this folder only)

`js/quest.js` adds one new function, `initSequenceGame`, immediately after
`initMatchGame` and exported the same way — a second, generically reusable
game type for path/order content, not specific to this topic. Nothing
else in the shared engine (section lock, day lock, Complete My Quest, the
topics-based itemized-hint reflection engine) needed to change; this
folder already carried its own generalized `initProgressBar` (from the
original build) and continues to use it unmodified. `styles.css` adds
`.seq-game`/`.seq-tile`/`.seq-trail` etc. (new, additive, mirrors the
existing `.match-game` component family) and `.video-placeholder` /
`.video-placeholder-box` (new, additive) for the un-filled video slots.

## Verified

Gate (one-tap confirm), all 13 reflection checks (content + itemized-hint
paragraph checks) across all 5 days, both games end-to-end (match game
completion + sequence game correct-order completion), the 6-item build
checklist, the 5-segment progress bar, section lock + day lock (including
the fix that folds bonus/non-numbered headings and both games into the
correct preceding numbered section's lock scope), and the Complete My
Quest finish button — tested end-to-end via headless browser before this
was pushed. Div/section balance, refl-id consistency between the HTML and
the reflection-check config, and every `reread` anchor were all verified
by script, not by eye.

## Narrative reframe: health, not disease

The quest was originally built around a dramatized emergency-response
narrative (a "Cardiac Response Cadet" fielding a transfusion emergency and
a "Code Blue"). It was reframed to lead with health and prevention rather
than crisis: Benjamin is now a **Heart Health Educator** helping prepare
for a real community event (a health fair), and the two case questions
became an info-card draft and a booth explainer instead of live emergency
calls. Every fact, mechanism, and first-aid step from the source chapter —
including the heart attack/cardiac arrest distinction and correct CPR
response — is still covered in full; only the framing device changed. The
facilitator-view button was also removed from this and every other kid
page, since Teacher's View now links directly to each kid's facilitator
URL from the staff-data repo.
