# Plant & Animal Cell — Group 1 (Discovery, Level 0)

Prepared for **Yokesh, Zach, and Chris**. This is a **Discovery**-format
quest (per the Term 2 Quests Design & Framework Guidelines), not the Quests
format used for Group 3 — no scenario/decision framing here. Discovery is
structured like real scientific practice: a full reading, then a real build
that produces a genuine, defensible result.

Core skill target for this level: **Observation & Description** — every
reflection prompt asks a kid to notice a real detail and describe it
accurately, not weigh a trade-off under pressure.

## Approach A: same journey, three different investigations

All three kids read the identical full topic — what every cell shares, what
only a plant cell has, and why — at identical depth. What differs is the
*angle* and the physical build, per the framework's Approach A rule (no two
kids may share both a lens and an output format):

| Kid | Lens | Day 2 build | Day 3 output |
|---|---|---|---|
| Yokesh | 🏙️ Cell City Planner | Builds one real cell as a labeled city, every organelle matched to a piece of city infrastructure (nucleus = City Hall, mitochondria = power plant, ribosomes = factories, membrane = checkpoint gate) | City plan report, defended live |
| Zach | 🫀 Body Connector | Builds one real cell as a labeled body-map, every organelle matched to a body part (nucleus = brain, mitochondria = stomach, ribosomes = muscles, membrane = skin) | Body-map report, defended live |
| Chris | 🔎 Twin Spotter | Builds a real flip-card identification kit distinguishing shared "family resemblance" marks from plant-only "identifying marks," then tests it by classifying 4 mystery cell-sample descriptions and scoring the real result | Case file with a real classification score |

These lenses are a deliberate creative pass, same as Group 0's — the
underlying rule (same content, genuinely different framing + build + real
defensible output) is followed exactly; Chris's build in particular swaps
the craft-model pattern for a real classification test, giving Group 1 a
build type not used by Yokesh or Zach.

## What's identical across all three (full topic coverage)

- The 5 organelles every plant and animal cell shares: cell membrane,
  cytoplasm, nucleus, mitochondria, ribosomes
- The 3 organelles only a plant cell has: cell wall, chloroplast, permanent
  vacuole
- Why the differences exist (a plant can't move, so it needs a permanent
  rigid structure and its own food source; an animal needs to move and
  flex, so it stays wall-free)
- Full comparison table (plant vs. animal, all 5 shared + 3 plant-only
  features)
- **History (mandatory):** Hooke 1665 (names "cells"), Leeuwenhoek 1670s
  (first living cells observed), Schleiden & Schwann 1838–39 (Cell Theory),
  Virchow 1855 (every cell comes from an existing cell)
- **Real-world application (mandatory):** cellulose as a real structural
  material, chloroplasts as the base of food chains, Cell Theory underlying
  modern medical diagnosis

## Invisible evaluation — rotated, not repeated

Per the framework's explicit warning against reusing one mechanism
throughout, this quest rotates the same four mechanisms Group 0 used across
Day 1, plus a fifth on Day 2:

1. **Explain-the-error** (refl-1) — a flawed statement claims the rigid cell
   wall is shared by every cell; the kid corrects it.
2. **Evidence-sourcing** (refl-2) — a described cell's type, with the
   specific evidence cited.
3. **Teach-it-forward** (refl-3) — explaining why the cell wall/chloroplast
   only exist in plant cells, simply enough for a trainee to repeat back.
4. **Compare-two-cases** (refl-4) — two described cells, matched to plant or
   animal with reasoning.
5. **Self-check reflection** (refl-5, Day 2) — same "what might someone
   misunderstand" pattern used across the project, applied to each kid's own
   build.

The keyword groups behind refl-1 through refl-4 are identical across all
three kids (same facts, same required ideas) — only the callout framing and
reread-section labels differ per lens, matching how Group 0 and Group 3's
shared questions worked across their own lenses.

## Framework compliance notes

- No internal labels ("Level 0," "Discovery," week numbers beyond the
  folder name) leak into kid-facing text — the format pill reads "Discovery
  Quest."
- Materials are a pool with checkboxes, never a fixed list, with an
  isolated tear-off print slip (`#print-slip-page`, isolated via
  `@media print`) — same mechanism already built and tested for Groups 0
  and 3.
- Chris's Day 2 produces a genuine, measurable result (a real classification
  score against real mystery samples), matching the framework's explicit
  rejection of purely symbolic or decorative builds.
- No hinge-and-reveal or other fine-motor/abstract construction mechanisms
  were used, per the framework's specific Level 0 age-appropriateness
  warning.

## What's reused vs. new

The entire engine (`js/quest.js`, `css/styles.css`) is a direct copy of
Group 0's, unmodified apart from three new lens color palettes
(`.lens-yokesh`, `.lens-zach`, `.lens-chris`). It's fully generic — the
highlighter, notes drawer, reflection/writing checks, progress bar,
materials pool, build checklist, and one-tap gate all work identically here
since none of it is topic-specific; only the HTML content is new.

No Day 1 game was added — the framework's mandatory-components list for
every Quest does not include one, so this stays a Discovery-only build.

## Verified

Gate (one-tap confirm + cross-kid isolation), materials pool → print slip,
model 3D rotation/pause, reflection checks (content + writing-check
pipeline), and progress bar — tested end-to-end on all three kid pages via
headless browser before this was pushed.
