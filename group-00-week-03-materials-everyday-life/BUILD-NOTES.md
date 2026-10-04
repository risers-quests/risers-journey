# Build notes — group-00-week-03-materials-everyday-life

Quest 3 ("Materials in Everyday Life") for Eva, Elyon, and Gabby, built from the
`group-00-week-02-solar-system` reference for the same three kids.

## Convention match

- Read `eva/index.html`, `gabby/index.html`, and `elyon/index.html` from
  `group-00-week-02-solar-system` in full before writing anything.
- Confirmed those three pages carry **no job-persona/"lens" framing** — no
  Detective/Engineer/City-Planner role-play, no `.lens-pill` element anywhere
  in any of the three files. `lens-eva` / `lens-gabby` / `lens-elyon` in the
  CSS/`<body>` class are a naming holdover for an accent-color-only mechanism
  (the CSS file says so directly in its own comment) — there is no persona
  attached to it. This new quest follows the same pattern: no personas, no
  lens-pill, plain direct address ("you," "today you'll learn…").
- Matched sentence length, vocabulary, and structure: short, concrete
  sentences (2-4 per paragraph), direct explanations, no role-play voice.
- Confirmed via diff that Eva/Gabby/Elyon's Week 2 pages share the same
  `sec-*`/`refl-N` ids and are ~95% identical, differing mainly in kid name
  and light phrasing (Day 2's build differed per kid in Week 2, but the task
  instructions for this new quest asked for **one shared build** across all
  three — see below). Built Week 3 the same way: one shared reading, one
  shared build, differing only in kid name, accent color/emoji, and two
  lightly reworded intro sentences.

## Mechanics matched exactly

- `js/quest.js` copied **verbatim** (`diff` confirms byte-identical to the
  Week 2 file) — not modified.
- **Reflection ids are a hard constraint, not just a style choice.**
  `quest.js`'s `initProgressBar` hardcodes the Day-1 progress-bar candidate
  list to exactly `refl-1, refl-2, refl-3, refl-4, refl-6, refl-7, refl-8,
  refl-9, refl-10, refl-11` (refl-5 deliberately skipped, per that function's
  own comment — it used to be a 6th Day-2 check that was removed). Using any
  id outside that list would silently drop it from the Day-1 progress bar.
  All three pages use exactly that same 10-id set, split across the 4 reading
  sections (3 + 2 + 3 + 2), and the `initReflectionChecks` config block is
  **byte-identical** across all three pages (confirmed by hash).
- `initBuildChecklist`'s Day-2 total is hardcoded to `5` in `quest.js` — all
  three pages have exactly 5 `.build-check-item`s.
- `sec-plan`'s `justify-table` has exactly 4 data rows (5 `<tr>` including
  the header), per the task's "4-row" requirement.
- `model3d-wrap` 6-face rotating cube used in Day 2, matching the reference
  (all three Week-2 kid pages used one).
- `prep-form` Day 3 fields (i–vii) kept word-for-word identical to the
  reference — the reference did not simplify this wording differently per
  kid, so neither did this quest.
- `QUEST_SYNC_URL`, `QUEST_SYNC_KEY`, `initProgressSync(kidSlug, 'group-00',
  'week-03')`, and the full `QuestUI.init*` call sequence match the
  reference pages' order and arguments exactly (just `'week-02'` →
  `'week-03'`).

## Shared ids and keyword groups (identical across all 3 kids)

`sec-` ids: `sec-what-materials-are`, `sec-material-types`, `sec-right-job`,
`sec-reduce-reuse-recycle` (plus `sec-plan` on Day 2).

| id | topic | keyword groups (all must be hit) |
|---|---|---|
| refl-1 | Fix the mistake (testing ≠ looking at color) | [press/touch/feel/squeeze/hands/hold] + [wrong/not color/isn't color] |
| refl-6 | Name two tests | [any test word: hard/soft/bend/bendy/stiff/see-through/floats/sinks/heavy/light/press/touch] |
| refl-7 | Stiff vs. bendy | [stiff/rigid/straight/doesn't bend] + [bendy/bend/flexible/folds/curve] |
| refl-2 | Name the material (metal) | [metal] + [shiny/cold/strong/hard/heavy] |
| refl-8 | Glass vs. fabric | [glass/see-through/hard/breaks] + [fabric/cloth/soft/bendy] |
| refl-3 | Why glass for windows | [see-through/clear/light] + [wood/solid/can't see/blocks] |
| refl-9 | Why wood/metal for chairs | [strong/sturdy/hold/support/stiff] + [fabric/soft/wouldn't hold] |
| refl-10 | Why fabric for shirts | [soft/bendy/comfortable/stretch] + [metal/glass/hard/stiff] |
| refl-4 | Reuse vs. recycle | [reuse/reusing/again/jar] + [recycl/melt/broken down] |
| refl-11 | Why reuse/recycle matters | [save/less trash/less waste/reduce] + [new material/dug up/reuse/recycle] |

## Videos

Found via web search, titles/URLs cross-checked against search results
before embedding (all three are real, existing YouTube videos):

- **`0aUUuJ3LRUE`** — "Properties of Materials | Science for Kids" (Day 1,
  section 1).
- **`JCKSMsbpn1Y`** — "Materials for Kids | Materials and their Properties |
  What are Things Made From | Science for Kids" (Day 1, section 2).
- **`Fex-wvrOZf4`** — "Recycling for Kids | Learn how to Reduce, Reuse, and
  Recycle" (Day 1, section 4).

**Open question / not fully verified:** I confirmed these video IDs and
titles are real via web search (title + URL match), matching the same
verification depth the Week 2 reference appears to have used. I could not
actually play the videos in this sandboxed environment (outbound requests to
`youtube.com` are blocked by the environment's egress proxy), so I could not
confirm each video is still embeddable (not age-restricted / owner hasn't
disabled embedding) or watch its exact content end-to-end. If any of the
three turns out to be blocked or off-topic on review, swap it for another
result from the same search (several near-duplicate "Materials and Their
Properties for Kids"-style videos turned up and would work as drop-in
replacements) or replace the `<div class="video-card">` with a
`<div class="video-card video-placeholder">` block.

## Build chosen (Day 2, identical across all three kids)

**Test and sort real household objects by material property.** Gather at
least 5 objects made of different materials (wood, metal, plastic, glass,
fabric) and run the same 4 simple tests from Day 1 on each: hard/soft (press
it), bendy/stiff (bend it a little), see-through/not (hold to light),
floats/sinks (drop gently in a bowl of water). Results go in a 4-row table
(`Object | What material? | Hard/soft, bendy/stiff? | What I found`).

This is simpler than Week 2's per-kid scale-model/orbit-model builds by
design — Week 2's Day 2 builds differ substantially between Eva, Gabby, and
Elyon, but the task instructions for this quest explicitly asked for **one**
build shared across all three kids ("Design one simple, real, safe
hands-on build/test..."), matching the spirit of Week 2's Day 1 (which *is*
shared) rather than Week 2's Day 2 (which isn't). Chose the
object-sorting/testing option from the two suggested in the brief because it
is safer (no assembly, no sharp tools), more directly testable/checkable
than a structure-building option, and reuses the exact same 4 property tests
already taught on Day 1 — so Day 2 is a direct, hands-on application of Day
1's reading rather than a new topic.

## Facts I researched and am fairly confident are accurate

- Bronze Age copper+tin alloying, c. 3300 BCE (real, well-documented; exact
  date given as an approximate era marker, as the reference did with
  "c." for the Bronze Age equivalent history entries).
- Leo Baekeland invented Bakelite in 1907 — one of the first fully synthetic
  plastics, widely cited.
- The first Earth Day (1970, USA) is broadly credited with helping launch the
  modern US recycling movement — this is a simplification for a young
  audience (recycling programs existed earlier in some places, and the
  causal link is not perfectly linear), but the fact itself (first Earth Day
  in 1970; it energized environmental/recycling awareness) is accurate and
  appropriately simple for this age group.

## Things I had to guess at / judgment calls

- **Palette**: no existing precedent for this specific group's Week 3
  colors, so I picked 3 new hues distinct from Week 2's amber/sky-blue/green:
  Eva = teal (`#0d9488`), Gabby = rose (`#e11d48`), Elyon = violet
  (`#7c3aed`), following the same CSS-variable-block pattern already in
  `styles.css`.
- **Cover watermark emoji**: 🧱 (Eva), 🧵 (Gabby), 🔍 (Elyon) — no reference
  precedent for this topic, chosen to loosely echo each kid's build/reading
  emphasis without introducing any persona.
- **3 of 5 material types got `info-card`s** (Wood, Metal, Glass); Plastic
  and Fabric are covered in prose only, since the task explicitly asked for
  "a card-grid of 3 info-cards" (singular instance) while the content spec
  asked for 5 material types — resolved by using cards for 3 and prose for
  all 5.
- **Diagram SVGs** are original, simple, abstract (numbered-dot-and-legend,
  and three labeled rounded rectangles for window/chair/shirt) rather than
  literal pictograms, matching the reference's own preference for
  abstract/geometric diagrams over detailed illustrations.

## Verification performed

1. `node --check` on every inline `<script>` block on all 3 pages — all pass.
2. Every `refl-N` id in the HTML has a matching `initReflectionChecks` entry
   and vice versa, on all 3 pages (scripted check, exact match).
3. Rendered all 3 pages with Playwright (Chromium), with `localStorage`
   pre-set to the matching kid name and `/sync`+`/evaluate` calls mocked:
   - Kid gate unlocks correctly for the matching name; `<main>` renders.
   - Full end-to-end run on Eva's page: answered all 10 reflections with
     real prose hitting the designed keyword groups → all 10 passed on the
     first attempt (`success: true`), Day 1 progress bar correctly showed
     `10/10`, section-lock and day-lock unlocked Day 2 as expected, checked
     all 5 build-checklist items → Day 2 progress bar showed `5/5`, the
     8-pair Word Match game rendered all 16 tiles, the glossary drawer
     opened with all 12 terms, and the dynamically-built "Complete My Quest"
     section appeared with its finish button enabled. No JS errors.
   - Confirmed (via diff/hash) that Gabby's and Elyon's pages carry
     byte-identical reflection-check configs and unchanged reading-content
     keyword language, so the same interaction flow applies to them.
   - Screenshots taken of all 3 pages (full-page, initial load and Eva's
     fully-completed run) for a visual sanity check — layout, diagrams,
     tables, and per-kid accent colors all rendered as intended.

## Files

- `css/styles.css` — copied from Week 2, per-kid accent block recolored.
- `js/quest.js` — copied verbatim from Week 2, unmodified.
- `index.html` — hub/name-gate page, retexted for this topic.
- `eva/index.html`, `elyon/index.html`, `gabby/index.html` — full quest
  pages.
