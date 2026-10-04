# Build notes — Quest 3: Hydrocarbons, Plastics & Fossils (group-03, week-03)

## Flagged assumption: same structure for all three kids (departs from Quest 2)

In Quest 2 (`group-03-week-02-space-gravity-concepts`), Shalom ran a different structure
(a 3-part "Mission Control" calc-quest built on `QuestUI.initCalcQuest`) from Karis and
Michael (who shared a near-identical 5-part reading+mission+build structure). **For this
quest I deliberately gave all three kids the same underlying reading-based structure**
(the generic `group-02-week-02-soil-formation` template: Day 1 reading with 4 numbered
`sec-` subsections, Day 2 build, Day 3 present), instead of carrying the calc-quest split
forward. Rationale, per the task brief: hydrocarbons/fossils/plastics is chemistry and
earth science, not a physics-calculation topic, so there's no natural "six numeric legs"
mission to build a calc-quest around the way orbital mechanics had. This is a real
departure from the Quest 2 pattern and is called out here as requested. If a facilitator
wants Shalom to keep a distinct calc-quest-style structure going forward, that would need
a follow-up pass.

## Shared structure across all three pages

- **Same 4 `sec-` ids on every page**, same substance, same order:
  - `sec-1` — What hydrocarbons are (carbon + hydrogen only; found in crude oil, natural
    gas, coal)
  - `sec-2` — How fossils and fossil fuels actually form (marine plankton → kerogen →
    oil/gas via burial + heat + pressure; swamp plants → coal via a separate path;
    millions-of-years timescale; fossil vs. fossil fuel distinction)
  - `sec-3` — What plastics are (synthetic polymers from petrochemical monomers;
    polyethylene/polypropylene/PVC; why plastic is useful)
  - `sec-4` — Put together as a system, with the environmental trade-off (durability =
    usefulness = pollution risk; recycling's real limits)
- **Same `refl-N` ids and the same `checkKeywordGroups` keyword groups on every page**
  (only the surrounding scenario/callout label differs per kid, same pattern as
  Karis/Michael's Quest 2 pages): `refl-1, refl-2, refl-3, refl-4, refl-6, refl-7,
  refl-8, refl-9, refl-10, refl-11`, plus a per-kid `refl-b1` for the Day 2 build
  (same id on all three pages, but a different question/keyword-groups each, since the
  three builds are genuinely different).
  - **`refl-5` is deliberately skipped on all three pages.** `quest.js`'s
    `initProgressBar()` treats the presence of `#refl-5` anywhere on the page as a signal
    that there's a Day 2 "self-review" question, and inflates `day2Total` to 6 to match.
    Since quest.js is copied verbatim and can't be edited, and none of my reading
    questions are actually a Day 2 self-review item, using `refl-5` would have silently
    broken the Day 2 progress bar (`X/6` with only 5 real checkable items). Skipping
    straight from `refl-4` to `refl-6` avoids that trap. All ids used stay inside the
    `refl-1`–`refl-19` candidate range `initProgressBar` already recognizes.
  - Keyword groups (identical across all 3 kids):
    - `refl-1`: `[['carbon'], ['hydrogen']]`
    - `refl-2`: `[['oil'/'petroleum'/'crude oil'], ['natural gas'/'gas'], ['coal']]`
    - `refl-3`: `[['million'/'millions'], ['non-renewable'/... /'faster than']]`
    - `refl-4`: `[['plant'/'plants'/'swamp'/'forest'], ['plankton'/'marine'/'ocean'/'algae'/'sea']]`
    - `refl-6`: `[['fossil'/'bone'/... ], ['fuel'/'energy'/'burn'/...]]`
    - `refl-7`: `[['synthetic'/'human-made'/...], ['polymer'/'monomer'/'hydrocarbon'/'oil'/'petrochemical'/'refin']]`
    - `refl-8`: `[['durable'/'lightweight'/'light'/'cheap'/... ]]`
    - `refl-9`: `[['fossil fuel'/'oil'/...], ['hydrocarbon'], ['plastic'/'polymer']]`
    - `refl-10`: `[['recycl'], ['degrade'/'quality'/'downcycle'/...]]`
    - `refl-11`: `[['durable'/"doesn't break down"/...], ['pollution'/'waste'/'environment'/...]]`
- Glossary (10 terms), Word Match game (8 pairs), and the sec-2 burial-layer diagram SVG
  are byte-identical across all three pages — only the callout label icons/scenarios,
  cover, build, and footer differ per lens, matching the site's own established pattern
  (see Karis vs. Michael in Quest 2, whose sec-1..sec-4 prose is near-verbatim across
  pages).

## Each kid's distinct Day 2 build

- **Shalom — Resource Mission Director — Burial-Layer Model.** A real 3-layer model in a
  clear container (dark organic-rich material at the bottom → sand/gravel sediment in the
  middle → coarser gravel on top, oldest-at-the-bottom, matching real burial order), with
  a heavy weight placed on top to model underground pressure, then measured in cm and
  logged in a build-log table (real stage / model layer / material / why it fits).
- **Michael — Energy Resource Analyst — Real Hydrocarbon Molecule Models.** Ball-and-stick
  physical models of methane (CH₄) and a longer chain (butane C₄H₁₀ or octane C₈H₁₈),
  built with two ball colors (carbon/hydrogen) and a bond connector, with the real
  chemical formula counted and recorded for each.
- **Karis — Materials & Fuel Analyst — Resin-Code Sort.** At least 5 real, clean household
  plastic items sorted and labeled by their actual resin identification code (1–7, the
  number inside the recycling triangle), cross-checked against the household's real
  recycling guidelines, logged in a build-log table (item / resin code / real property /
  recyclable locally). This uses only clean, empty household plastics — no chemistry
  experiments, no cutting/melting/heating anything — verified as an activity type real
  classrooms already use for recycling education.

All three builds are hands-on, real, and household-safe (no actual chemistry with real
plastic/petroleum, per the brief), each with its own 5-step `build-checklist` and its own
build-log table.

## Videos used

Found via web search and cross-checked for a real, matching video ID before embedding —
no placeholders were needed, all three are believed to be real, on-topic, existing
YouTube videos:

- `sec-1` (hydrocarbons): **1UE3hZ7cOP0** — "Hydrocarbons | #aumsum #kids #science
  #education #children" (AumSum's kids-science channel).
- `sec-2` (fossil fuel formation): **JasIvS7oYw4** — "Fossil Fuels for Kids | Learn all
  about fossil fuels, what they are, and where they come from."
- `sec-3` (plastics from oil): **sIuUcJ72wWY** — "From Crude Oil to Plastic" (published
  2024, matched search result title/channel).

I was not able to actually play these videos in this sandboxed environment (network
egress to youtube.com is proxied/blocked here), so this is search-result-title
confidence, not first-hand playback confirmation — a facilitator should do a quick spot
check before the first live session, same as with any newly-added video.

## Facts I'm not fully certain of / had to hedge or simplify

- **Coal's exact elemental composition** — I describe coal as "still carbon-rich, but not
  a clean hydrocarbon mixture the way oil and gas are, carrying other elements like
  sulfur and nitrogen." This is broadly correct (coal is a fossil fuel but is a complex
  carbon-rich macromolecule, not a pure hydrocarbon mixture) but I simplified rather than
  giving exact composition ranges, which vary a lot by coal rank/deposit.
- **Real-world share of oil/gas that becomes plastic vs. fuel** — I deliberately left this
  number out of the reading entirely (only said "a large share of plastic waste still
  isn't recycled" and described the durability trade-off qualitatively) rather than
  citing a specific % of global oil production that goes to petrochemicals, or a specific
  global plastic-recycling rate, since I've seen different figures in different sources
  and didn't want to state a precise number I couldn't verify to my own satisfaction in
  this session. If a precise "less than X% of plastic is ever recycled" statistic is
  wanted, it should be sourced and added deliberately (a widely-cited figure is ~9%,
  Geyer et al. 2017, but I did not independently verify it here).
- **Geologic timescales for oil/gas formation** — I used "millions of years" throughout
  rather than citing a specific range (real oil-window formation varies enormously by
  basin, commonly cited in tens to low hundreds of millions of years), since a specific
  number would imply more precision than is actually true across "oil and gas" as a
  category.
- **Carboniferous Period date (~300 mya)** used in the timeline is a standard, safe
  approximation (the period runs roughly 359–299 million years ago); I used "~300 mya" as
  a simple anchor rather than the full range.

## CSS / colors

Copied `group-03-week-02-space-gravity-concepts/css/styles.css` verbatim (it already had
a workable 3-kid lens-color pattern plus `model3d-wrap`, `diagram-card`, `build-checklist`,
`hook-box`, `prep-form`, etc. — effectively a superset of the atomic-structure/soil
templates). **Deliberate choice:** I kept Shalom/Karis/Michael's existing accent colors
from Quest 1 and Quest 2 (`--accent: #b91c1c` red / `#0f766e` teal / `#1d4ed8` blue)
rather than picking new ones. Checking every other group's CSS, each kid on this site
keeps one consistent personal accent color across all of their own quests (Owen is always
teal, Yokesh always slate, Zach always rose, etc.) — Shalom/Karis/Michael already
established red/teal/blue across their own Quest 1 and Quest 2 pages, so reusing those
colors here (rather than picking three different, unclaimed colors) matches that
established site-wide convention. The unused `.calc-quest-*` CSS rules from the Quest 2
stylesheet are still present in the copied file (harmless dead weight — no build/bundle
step to strip them, and removing them wasn't asked for).

## Runtime engine

`js/quest.js` is a byte-identical copy of `group-02-week-02-soil-formation/js/quest.js`
(verified with `diff`) — the generic reading+build template engine, not the calc-quest
one. Not modified.

## Verification performed before commit

- `node --check` on `js/quest.js` and on every inline `<script>` block extracted from
  `index.html`, `shalom/index.html`, `michael/index.html`, `karis/index.html` — all pass.
- Every `refl-N` id used in each page's HTML has exactly one matching entry in that page's
  `initReflectionChecks(...)` call, and vice versa (checked programmatically) — no
  mismatches on any of the 3 pages.
- HTML well-formedness (tag balance) and duplicate-id checks via Python's `html.parser` —
  clean on all 4 pages (hub + 3 kid pages).
- Rendered all 3 kid pages with Playwright (Chromium), with `/sync` and `/evaluate`
  network calls mocked and `localStorage['imm-l3-kid']` pre-set to each kid's name before
  load: the per-kid gate unlocks correctly, `<main>` becomes visible, all 4 `sec-` ids are
  present, 5 build-checklist items and 11 reflection textareas (10 reading + 1 build) are
  present, and 3 video iframes load per page. Screenshots taken of each cover and of Day 2
  (Day 2 correctly shows as locked-until-Day-1-complete via `initSectionLock`/
  `initDayLock` — expected behavior, not a bug, matching Owen's page).

## What was not touched

Only files under `group-03-week-03-hydrocarbons-plastics-fossils/` were created. No other
group folder, the staff `dashboard/`, or the repo root `README.md` were modified.
