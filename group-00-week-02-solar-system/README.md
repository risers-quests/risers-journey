# Solar System — Group 0 (Discovery, Level 0)

Prepared for **Eva, Gabby, and Elyon**. This is a **Discovery**-format quest
(per the Term 2 Quests Design & Framework Guidelines) — a full reading, then
a real build that produces a genuine, defensible result.

## No lens/persona framing

Earlier drafts gave each kid a fictional role (Cosmic Detective, Planet
Diarist, Orbit Engineer) with matching "case file"/"witness statement"/
"suspect" vocabulary throughout the reading. That framing was removed —
it didn't add learning value, and it made the reading harder to follow for
this age group. Day 1's reading is now plain, direct language, and is
**word-for-word identical across all three kids** (same facts, same
headings, same reflection prompts) — see `js/quest.js`'s
`initReflectionChecks` calls in each kid's own `index.html` to confirm.

What still differs per kid, per the framework's Approach A rule (no two
kids may share both a lens and an output format), is the **Day 2 build**:

| Kid | Day 2 build | Real measured result |
|---|---|---|
| Eva | A real, to-scale model of the Sun and eight planets along a measured track | The actual measured distances, and the scale used |
| Gabby | A planet ball resting in a stand, marked with 4 points around its middle, turned by hand (never the light) past a completely still light source | How many of her 4 predictions (Day or Night at each point) matched the real test |
| Elyon | A stationary Sun anchor with a fixed-length string to a planet piece, moved by hand around a drawn circle path | How many steps it took to go all the way around, and whether the string stayed taut the whole time |

## Builds are stationary, not spinning or swinging — and the light never moves

Earlier drafts had Gabby spin a foam ball on a skewer to simulate rotation,
and Elyon swing a ball on a string to simulate an orbit. Both were replaced
with builds that don't require spinning or swinging a physical model — too
advanced a fine-motor/coordination task for this age group — while keeping
each build hands-on and each result genuinely measured.

Gabby's build went through a second correction: the first stationary
redesign kept her planet fixed and moved the *flashlight* around it to 3
spots instead. That's a real physics error, not just a simplification —
Day 1 explicitly teaches that day and night happen because a planet
rotates while the Sun stays still, and a build where the light does the
moving quietly teaches the opposite (a Sun that circles the planet). The
fix keeps the light source completely still and has Gabby turn her
*planet* by hand, in small steps, to 4 marked points — the same underlying
motion Day 1 describes, just slow and hand-turned instead of spun on a
mounted skewer. Elyon's design was never at risk of this — the string is
what stands in for gravity, and the planet piece was always what moves.

## Reading level and content

Day 1's reading was rewritten at a simpler (grade-1-friendly) reading
level — short sentences, common words, plain explanations. The freed-up
complexity budget was used to add more real content rather than to cut
facts: a second diagram (rocky planets vs. gas giants), a third diagram
(day side / night side), dwarf planets (Pluto), moon counts across the
other planets, retrograde rotation (Venus/Uranus spinning backwards), and
a couple of extra Sun facts (surface/core temperature).

## Day 2 no longer has a self-review question

The "Diary/Case/Pitch Review — self-check" reflection that used to close
out Day 2 asked for an opinion ("what might someone misunderstand...")
rather than a checkable answer, so the evaluation there had no clear
standard. It was removed; Day 2's 5 checks are now all real build-checklist
steps. `js/quest.js`'s progress bar and the staff portal's `roster.js` were
both updated to match (Day 2 is now "X/5", not "X/6").

## Facilitator-approved pass: masked PIN + reason picker

The old flow was a single `window.prompt()` for a PIN shared with every
other group — a plain text box, visible to anyone standing nearby as it's
typed. It's now a proper modal: a masked (password-style) PIN field, and
Group 0 has its own PIN (`1234` — see `js/quest.js`'s `FACILITATOR_PIN`),
distinct from other groups. Once the PIN is right, the modal asks for the
facilitator's name (defaults to Blessy, editable) and one or more reasons
(logic right/wrong, spelling wrong, grammar wrong, partially right, needed
a hint, full pass). Every grant is logged (`imm-l3-w2-passlog::<kid>`,
synced as `state.passLog`) so the staff Feedback page can show a real
per-facilitator count, not just an anonymous flag.

## Video watch limit

The Day 1 video can be watched twice; a third play attempt pauses
immediately behind a lock overlay, since every answer a kid needs is
already in the reading, not the video. Implemented via the YouTube IFrame
API (`initVideoWatchLimit` in `js/quest.js`) — it only counts a *fresh*
start (from unstarted/ended/cued) as a new watch, so pausing and resuming
mid-video never burns a count.

## Double-click glossary lookup

Scientific/harder words in the reading (star, orbit, gravity, rotation,
axis, rocky planet, gas giant, asteroid belt, comet, moon, dwarf planet)
are wrapped in `<span class="gloss-word" data-term="...">`. Double-clicking
one opens the existing side glossary drawer and scrolls straight to that
word's definition, briefly highlighted.

## Local storage is now namespaced per week

Every kid-progress storage key in this quest's copy of `js/quest.js` is
prefixed `imm-l3-w2-` (was the unscoped `imm-l3-` shared with every other
week/group quest on the same site origin). Before this fix, a kid's Week 1
answers, highlights, and time-on-task could still show up on their Week 2
page on first load, since `localStorage` is scoped by origin, not by URL
path, and Week 2 pages hadn't yet synced anything to overwrite the stale
local cache. Week 1's copy of `js/quest.js` keeps its own original
`imm-l3-` prefix, so the two no longer collide.

## What's reused vs. new

The engine (`js/quest.js`, `css/styles.css`) started as a copy of Group 0
Week 1's, then picked up this week's fixes and features above (all scoped
to this copy only, unless noted). The materials pool, build checklist,
one-tap gate, progress bar, section/day locking, and printable slip all
work the same way as every other Discovery quest on this site.
