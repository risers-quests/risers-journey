# Pollination & Seed Dispersal — Group 0 (Discovery, Level 0)

Prepared for **Eva, Gabby, and Elyon**. This is a **Discovery**-format quest
(per the Term 2 Quests Design & Framework Guidelines), not the Quests
format used for Group 3 — no scenario/decision framing here. Discovery is
structured like real scientific practice: a full reading, then a real,
physical Day 2 build or experiment that produces a genuine report.

Core skill target for this level: **Observation & Description** — every
reflection prompt asks a kid to notice a real detail and describe it
accurately, not weigh a trade-off under pressure.

## Approach A: same journey, three different investigations

All three kids read the identical full topic — flower → pollination →
seed → dispersal — at identical depth. What differs is the *angle* and the
physical build, per the framework's Approach A rule (no two kids may share
both a lens and an output format):

| Kid | Lens | Day 2 build | Day 3 output |
|---|---|---|---|
| Eva | 🔍 Pollinator Detective | A labeled "evidence board" flower model, matched to a real pollinator, every feature justified | Case File Report |
| Gabby | 🌱 Seed Explorer | Becomes one real seed; builds and **physically tests** its real dispersal mechanism (drop-tested airtime, or float-tested in water) — a real measured result, not a description | Travel Diary (first-person, includes her real numbers) |
| Elyon | 💡 Nature's Inventor | Copies one real dispersal mechanism (burr hooks, maple spin, pod launch) into an invention built for a different job, then tests whether it actually works | Invention Pitch |

These lenses are a deliberate departure from the framework doc's own
worked example for this exact topic (Field Scientist / Storyteller /
Engineer) — the user explicitly invited a more creative pass rather than
reusing the generic labels. The underlying rule (same content, genuinely
different framing + build + output, real physical results) is followed
exactly; only the specific identities are new.

## What's identical across all three (full topic coverage)

- Flower anatomy (stamen/anther/filament, pistil/stigma/style/ovary)
- Pollination vs. cross-pollination, and why cross-pollination is favored
- Biotic pollinators and their real adaptations (bees/UV patterns, butterflies/red,
  hummingbirds/red-tube-no-scent-needed, moths & bats/pale-and-night-scented,
  flies & beetles/carrion mimicry)
- Abiotic pollination (wind — small, dull, scentless, huge light pollen output;
  water — rare, aquatic)
- Fertilization, and how an ovule becomes a seed while the ovary becomes a fruit
  (including non-kitchen "fruits": pea pods, maple keys, dandelion puffs)
- Why seeds disperse at all (competition with the parent for light/water/nutrients)
- All five real dispersal mechanisms: wind, water, animal-hitchhiking,
  animal-eaten, explosive/self-dispersal — with real named examples
  (dandelion, maple, coconut, mangrove, burdock, berries, pea pods)
- **History (mandatory):** Sprengel 1793, Darwin's orchid/moth prediction
  1862 (confirmed 1992), de Mestral inventing Velcro from burrs, 1941/1955
- **Real-world application (mandatory):** bee-dependent agriculture and
  colony collapse as a food-security issue, hand-pollinated vanilla,
  Velcro as a real biomimicry product, dispersal mechanisms in invasive
  weed spread

## Invisible evaluation — rotated, not repeated

Per the framework's explicit warning against reusing one mechanism
throughout, this quest rotates four different mechanisms across Day 1,
plus a fifth on Day 2:

1. **Explain-the-error** (refl-1) — a flawed statement claims a
   nectar-rich red tube flower is wind-pollinated; the kid corrects it.
2. **Evidence-sourcing** (refl-2) — a night-blooming pale flower's
   pollinator, with the specific evidence cited.
3. **Teach-it-forward** (refl-3) — explaining why seeds disperse, simply
   enough for a younger Riser to repeat back.
4. **Compare-two-cases** (refl-4) — two described seeds, matched to their
   real dispersal method with reasoning.
5. **Self-check reflection** (refl-5, Day 2) — same "what might someone
   misunderstand" pattern used across the project, applied to each kid's
   own build. Removed for Eva (2026-09-03) — it asks for an opinion, not a
   checkable answer, so her Day 2 total dropped from 6 to 5 (just the
   build-checklist steps). Gabby and Elyon still have theirs, but as of
   2026-09-02 it accepts any non-empty answer (`groups: []`) instead of
   keyword-checking it — same reasoning as Eva's removal, it's an opinion
   about their own build, not a checkable fact; writing mechanics/spelling
   checks still run as normal. `js/quest.js`'s progress bar detects
   per-page whether `#refl-5` actually exists rather than assuming a fixed
   count, since this one file is shared by all three kids' pages.

The keyword groups behind refl-1 through refl-4 are identical across all
three kids (same facts, same required ideas) — only the callout framing
and reread-section labels differ per lens, matching how Group 3's shared
questions worked across its own three lenses.

## Framework compliance notes

- No internal labels ("Level 0," "Discovery," week numbers beyond the
  folder name) leak into kid-facing text — the format pill reads
  "Discovery Quest," matching the framework's explicit rule 11.
- Materials are a pool with checkboxes, never a fixed list, with an
  isolated tear-off print slip (`#print-slip-page`, isolated via
  `@media print`) — same mechanism already built and tested for Group 3.
- All three Day 2 builds produce a genuine physical, measurable result —
  none are symbolic or purely decorative, matching the framework's
  explicit rejection of "simulating wind dispersal by blowing on cotton
  wool."
- No hinge-and-reveal or other fine-motor/abstract construction mechanisms
  were used, per the framework's specific Level 0 age-appropriateness
  warning (8-year-olds).

## What's reused vs. new

The entire engine (`js/quest.js`, `css/styles.css`) is a direct copy of
Group 3's, unmodified apart from three new lens color palettes
(`.lens-eva`, `.lens-gabby`, `.lens-elyon`) and removing dead CSS that
referenced the wrong kid names. It's fully generic — the highlighter,
notes drawer, reflection/writing checks, progress bar, materials pool,
build checklist, and one-tap gate all work identically here since none of
it is Immune-System-specific; only the HTML content is new.

No Day 1 game was added — the framework's mandatory-components list for
every Quest does not include one, so this stays a Discovery-only build,
not an assumption that every feature from Group 3 should carry over.

## Verified

Gate (one-tap confirm + cross-kid isolation), materials pool → print slip,
build checklist, reflection checks (content + writing-check pipeline),
progress bar, and hub routing — tested end-to-end on all three kid pages
via headless browser before this was pushed.
