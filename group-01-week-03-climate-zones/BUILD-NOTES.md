# Build notes — Group 01, Week 03: Climate Zones

New quest for Chris, Yokesh, and Zach, built from the
`group-01-week-02-atomic-structure-periodic-table` template (same QuestUI
mechanics, same HTML skeleton, `js/quest.js` copied verbatim/unmodified).

## Personas / lenses

- **Chris — Climate Detective** (`chris/index.html`, `body.lens-chris`,
  accent amber `#d97706` / `#92400e` / `#fffbeb`). Evidence/comparison
  framing, standard reading register (not simplified), carried forward from
  his "Atom Detective" persona.
- **Yokesh — Climate City Planner** (`yokesh/index.html`, `body.lens-yokesh`,
  accent teal `#0d9488` / `#115e59` / `#f0fdfa`). Zoning-map framing, grade-4
  register (short sentences, simple vocabulary, full factual depth),
  carried forward from "Atom City Planner."
- **Zach — Climate Body Connector** (`zach/index.html`, `body.lens-zach`,
  accent blue `#2563eb` / `#1e3a8a` / `#eff6ff`). Body-regulation framing
  (circulation/sweat/core-skin gradient mapped to ocean currents/rain
  cycle/equator-pole gradient), grade-4 register, carried forward from
  "Atom Body Connector."

Lens colors are new and distinct from both each other and from the Week 2
atomic-structure set (magenta/slate/rose), per the task's instruction to
keep them visually separate from the prior week.

## Shared structure (identical across all three kids)

Four shared `sec-` ids map to the same four underlying concepts, reframed
per persona but never renumbered or split differently:

1. `sec-latitude` — what actually determines a location's climate (latitude,
   sun angle, why the equator is hottest/poles coldest).
2. `sec-zones` — the five simplified-Köppen climate zones (tropical, arid,
   temperate, continental, polar) and what defines each.
3. `sec-modifiers` — what else modifies climate beyond latitude (elevation,
   ocean currents, distance from the ocean/continentality).
4. `sec-system` — how climate zones shape biomes and human life
   (agriculture, settlement), unnumbered heading, matching the reference
   template's un-numbered final Day-1 section.

`sec-plan` (Day 2 "Log your build" table) is also shared as an id, per kid.

### Reflection ids + keyword groups (identical across all three pages)

Same 8 ids (within the allowed `refl-1`–`refl-19` range, reusing the
reference set `refl-1,2,3,4,6,7,8,9`) and identical keyword-group logic on
all three kids' pages — only the surrounding prompt wording/persona framing
differs, exactly like the Week 2 template:

| id | Section | Groups (all must be present) |
|---|---|---|
| `refl-6` | sec-latitude | `[equator]`, `[angle/direct/steep/straight]` |
| `refl-2` | sec-zones | `[tropical]`, `[rain/rainfall/precipitation/wet]` |
| `refl-7` | sec-zones | `[precipitation/rain/rainfall/water/moisture]`, `[hot/cold/both/either]` |
| `refl-1` | sec-zones | `[cold/not always/isn't always/can be cold]`, `[precipitation/rain/water/dry]` |
| `refl-3` | sec-modifiers | `[elevation/altitude/height/mountain]`, `[cold/colder/drop/decrease]` |
| `refl-8` | sec-modifiers | `[current/currents/ocean]`, `[warm/cold/heat/temperature]` |
| `refl-4` | sec-system | `[tropical]`, `[polar]` |
| `refl-9` | sec-system | `[no/different/not the same/not necessarily]`, `[precipitation/rain/water/moisture/elevation/current/ocean]` |

Verified programmatically that every `refl-N` id used in each page's HTML
has exactly one matching `initReflectionChecks` entry on that same page, and
vice versa (see verification section below).

### Glossary / match game

13 shared terms (Climate, Weather, Latitude, Equator, Sun angle, Tropical
zone, Arid zone, Temperate zone, Continental zone, Polar zone, Elevation,
Ocean current, Biome), identical definitions across all three kids except
minor "precipitation" → "rain" wording simplification for Yokesh/Zach. Used
1:1 as both the glossary-drawer content and the Day-1 match-game pairs
(matches the reference template's pattern).

## Builds (Day 2) — genuinely distinct per kid

- **Chris — Sun-Angle Evidence Rig.** A physical light-and-protractor rig:
  mount a flashlight on a fixed stand, shine it through a steep angle
  (~90°, "equator") and a shallow angle (~30°, "near-pole") onto grid
  paper, trace and measure the two light patches, and record which one
  concentrates more light per square inch. Materials pool: stand/base,
  light source, angle guide, recording surface, labels/log (5 columns).
  Real measurable outcome: patch-area comparison. Final checklist step
  (like his Week 2 "identify the unknown atoms") has him ID 4 mystery
  locations from temperature/precipitation data using his reference chart.
- **Yokesh — Climate Zoning Strip.** A full physical equator-to-pole strip
  map with all five zones in order, each segment colored/textured to match
  its real climate, tagged with an index-card "zoning permit" stating its
  real temperature/rain rules. Materials pool: strip base, tropical/dry
  materials, temperate/continental materials, polar materials, tags &
  assembly (5 columns). Measurable/checkable outcome: correct zone order +
  factually correct tags, checked against the reference chart. Final step:
  zone-permit 4 mystery locations onto the strip.
- **Zach — Body-Earth Regulation Model.** A body outline with three marked
  regulation spots (circulation, sweat/evaporation, core-to-skin gradient)
  each connected by a labeled string to a small five-zone Earth strip,
  matching the body process to the Earth process that does a similar job
  (circulation↔ocean currents, sweat↔rain cycle, core-skin gradient↔
  equator-pole gradient). Materials pool: body outline base, circulation
  materials, sweat/hydration materials, Earth strip & zone materials,
  labels/assembly (5 columns). Measurable outcome: three justified matches
  + correct zone order on the mini strip. Final step: match 4 mystery
  locations onto the correct zone.

All three builds use the same climate-zone reference chart/content and all
three converge on the same Day-3 presentation structure (7-field prep-form,
identical across kids in mechanics, persona-framed in wording).

## Videos

Researched via web search and cross-checked against multiple independent
sources before embedding (never guessed an ID):

- `Kp7ZhvJXrMc` — **"Climate Zones for Kids | Learn about the 3 Main
  Climate Zones of the Earth"** (Learn Bright, published 2021-03-16).
  Confirmed real and on-topic across several independent search results
  (Seesaw classroom-activity integration, video summarizer sites). Used
  after `sec-zones` on all three pages.
- `SDfc8SBYNnM` — **"Why is Equator Hot but Poles are Cold? + more videos"**
  (AumSum Kids). Confirmed real and on-topic (kids' science-explainer
  channel, matches latitude/sun-angle content). Used after `sec-latitude`
  on all three pages.
- **Placeholder (no video embedded):** an ocean-currents-and-climate video
  for `sec-modifiers`. Search results surfaced generic ocean-current/
  climate-zone reference pages (NOAA, meteoblue, etc.) but no single
  kid-appropriate YouTube video I could verify with the same confidence as
  the two above — rather than guess an ID, all three pages use a
  `.video-card.video-placeholder` block there, clearly marked as an open
  item for a facilitator to fill in. This is the one open question from
  this build: **someone should verify and add a real ocean-currents video
  ID to the placeholder block in all three `index.html` files** (search
  "for kids") before this quest goes live, if a video is wanted there.

## Facts and history — confidence notes

All content was researched/verified via web search rather than written from
memory alone:

- Simplified 5-zone Köppen system (A/tropical, B/dry, C/temperate,
  D/continental, E/polar) and the temperature/precipitation definitions
  used per zone: confirmed via Britannica, NOAA, and university geography
  course sources.
- Sun-angle mechanism for equator-vs-pole heating: confirmed via Hong Kong
  Observatory and multiple science-education sources.
- Elevation lapse rate (~6.5°C per 1,000 m) and the Kilimanjaro example:
  standard, well-established atmospheric science fact.
- History timeline — all four milestones independently verified:
  - **1817** — Alexander von Humboldt's first isotherm map (Library of
    Congress "Worlds Revealed" blog, Smithsonian Magazine, and a
    peer-reviewed climatology-writings article all confirm the 1817 date
    and that it was the first evidence latitude alone doesn't determine
    climate).
  - **1884** — Köppen's early climate-vegetation sketch ("Die Wärmezonen
    der Erde").
  - **1900 / 1918** — Köppen's first full classification system (1900),
    revised 1918 — confirmed via Britannica and multiple geography
    textbooks.
  - **1936** — Köppen–Geiger's refined, mapped classification (with Rudolf
    Geiger) — confirmed via Britannica.
- I am reasonably but not 100% certain of the precise wording Humboldt used
  in his own 1817 publication (search results described it secondhand
  rather than quoting the original abstract directly) — the date and
  substance (first isotherm map, first evidence against latitude-only
  climate) are corroborated by multiple independent sources, so I'm
  confident in the fact as stated on the page, just flagging that I did not
  read Humboldt's original 1817 paper directly.

## Things a facilitator/reviewer may want to double-check

1. The ocean-currents video placeholder (see "Videos" above) — the one
   genuinely open item from this build.
2. The ocean-current diagram SVGs on all three pages are simplified/
   schematic (a mountain + a single curved arrow), not geographically
   accurate current maps — intentional simplification to keep the diagram
   legible at this size, same style as the reference template's diagrams.
3. Latitude bands on the "five zones" diagram are ordered correctly
   (tropical → arid → temperate → continental → polar, equator to pole)
   but drawn as equal-height bars for legibility, not to scale with real
   degree ranges — the data table underneath gives the real approximate
   ranges instead.

## Verification performed before commit

- `node --check` passed on `js/quest.js` (copied verbatim from Week 2,
  unmodified) and on every inline `<script>` block extracted from all four
  HTML pages (hub `index.html`, `chris/`, `yokesh/`, `zach/`).
- Programmatic check confirmed, for each of the three kid pages, that the
  set of `refl-N` ids present in the HTML (`textarea` ids) exactly equals
  the set of ids passed to that page's `initReflectionChecks(...)` call —
  no orphaned textareas, no orphaned checks.
- Programmatic check confirmed 13 glossary-drawer entries and 13
  match-game pairs on each page (1:1, same as the reference template).
- Rendered all three kid pages with Playwright (both normal mode with a
  pre-set `localStorage.imm-l3-kid` and a mocked `/sync` fetch, and with
  `?fac=1` facilitator mode to bypass section/day locks for a full visual
  pass) — zero `pageerror` JS exceptions on any page in either mode. Visual
  spot-checks confirmed: cover section renders with correct lens color per
  kid, sun-angle SVG diagram, five-zone band SVG diagram + data table,
  video cards (embeds + the one placeholder) render, Day 2 reference
  diagrams (light-patch comparison for Chris, zoning-strip preview for
  Yokesh, body-Earth match diagram for Zach), rotating 3D build cubes, and
  build checklists all render without errors. (The one console warning
  seen — `ERR_CERT_AUTHORITY_INVALID` — is the sandboxed test environment's
  proxy blocking the Google Fonts/YouTube network calls, not a defect in
  the pages themselves; fonts fall back gracefully and this does not
  reflect how the pages behave once actually deployed/served online.)

## Files not touched

Nothing outside `group-01-week-03-climate-zones/` was modified — no other
group folder, no `dashboard/`, no root `README.md`.
