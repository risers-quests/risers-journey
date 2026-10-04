# Skeletal & Muscular Systems — Group 2 (Discovery, Level 2)

Prepared for **Owen and Pranavi**. This is a **Discovery**-format quest (per
the Term 2 Quests Design & Framework Guidelines) — a reading builds full
topic knowledge, then a hands-on Day 2 produces a genuine, measured result.

Core skill target for this level: **Quantitative Reasoning** — real numbers
(angles, weights, timed trials) have to be measured and used as genuine
evidence, never decorative. Both kids' Day 2 builds are designed specifically
around that skill.

Note on the Math Thread: the topic coverage sheet for this group lists a
"Multi-Digit Division + HCF, LCM" math thread. Per the user's standing
direction to defer cross-curricular math-thread integration, this quest does
NOT teach or embed that specific division/HCF/LCM content — it fulfills the
level's own locked "Quantitative Reasoning" skill target (Section 5 of the
framework doc) through real measurement, timing, and comparison instead,
which is a distinct requirement from the math-thread line item.

## Approach A: same journey, two different investigations

Both kids read the identical full topic — the skeletal system, joints, the
muscular system, and how they work together as a lever — at identical
depth. What differs is the *angle* and the physical build, per the
framework's Approach A rule (no two kids may share both a lens and an
output format):

| Kid | Lens | Day 2 build | Day 3 output |
|---|---|---|---|
| Owen | ⚙️ Motion Engineer | Builds a real working cardboard lever-joint model (bone = cardboard strip, joint = brass-fastener pivot, muscle = string/rubber band), pulls it three times, and measures the real bend angle and weight lifted each trial | Design report defended live, with three real angle measurements |
| Pranavi | 📊 Movement Data Analyst | Runs a real timed test on her own body (wall-sit endurance or a joint's measured range of motion) across three trials with controlled rest between them, then calculates her average and the trial-1-to-trial-3 difference | Data report defended live, with a real three-trial dataset |

These lenses give Group 2 a build type not used by any Discovery group so
far — Pranavi's "build" is a controlled, repeated self-measurement rather
than a constructed model, which is exactly what the Quantitative Reasoning
skill target calls for, and keeps her output genuinely different in kind
from Owen's.

## What's identical across both (full topic coverage)

- The skeletal system's four jobs (support, protection, movement, blood
  cell production) and four bone shapes (long, short, flat, irregular)
- The real bone-count fact: 206 adult bones vs. ~270 at birth, with the
  drop explained by fusion during growth
- All five joint types with real examples: hinge, ball-and-socket, pivot,
  gliding, saddle
- Ligaments (bone-to-bone) vs. tendons (muscle-to-bone)
- The three muscle types (skeletal, smooth, cardiac) and why skeletal
  muscle must work in antagonistic pairs
- The joint-bone-muscle system as a real lever (pivot / lever arm / force)
- **History (mandatory):** Vesalius 1543 (first accurate human anatomy
  atlas), Duchenne 1830s–1860s (electrical mapping of muscle function),
  Röntgen 1895 (X-rays)
- **Real-world application (mandatory):** X-ray/CT fracture diagnosis,
  physiotherapy and biomechanics, prosthetics engineering, ergonomic
  design, sport-specific muscle training

## Invisible evaluation — rotated, not repeated

Same four Day-1 mechanisms used across every group so far, plus a fifth on
Day 2:

1. **Explain-the-error** (refl-1) — a flawed data-sheet claim that bone is
   dead, unchanging material; the kid corrects it.
2. **Evidence-sourcing** (refl-2) — a one-plane, door-like joint identified
   by name and evidence.
3. **Teach-it-forward** (refl-3) — explaining why muscles must work in
   antagonistic pairs, simply enough for a trainee to repeat back.
4. **Compare-two-cases** (refl-4) — two described joints matched to hinge
   or ball-and-socket with reasoning.
5. **Self-check reflection** (refl-5, Day 2) — same "what might someone
   misunderstand / which measurement am I least sure of" pattern used
   across the project, applied to each kid's own real data.

Keyword groups behind refl-1 through refl-4 are identical across both kids
— only the callout framing and reread-section labels differ per lens.

## Framework compliance notes

- No internal labels ("Level 2," "Discovery," week numbers beyond the
  folder name) leak into kid-facing text.
- Materials are a pool with checkboxes, never a fixed list, with an
  isolated tear-off print slip (`#print-slip-page`, isolated via
  `@media print`) — same mechanism used across every group so far.
- Both Day 2 activities produce a genuine, measured, non-symbolic result —
  Owen's is a physically built and tested lever; Pranavi's is a real
  three-trial timed dataset — matching the framework's explicit rejection
  of decorative builds.
- No hinge-and-reveal or other fine-motor/abstract construction mechanisms
  beyond the simple brass-fastener pivot, which two 4th/5th-level Risers
  can manage without difficulty.

## What's reused vs. new

The entire engine (`js/quest.js`, `css/styles.css`) is a direct copy of
Group 1's, unmodified apart from two new lens color palettes
(`.lens-owen`, `.lens-pranavi`). It's fully generic — the highlighter,
notes drawer, reflection/writing checks, progress bar, materials pool,
build checklist, and one-tap gate all work identically here; only the HTML
content is new.

No Day 1 game was added — the framework's mandatory-components list for
every Quest does not include one, so this stays a Discovery-only build.

## Verified

Gate (one-tap confirm + cross-kid isolation), materials pool → print slip,
model 3D rotation/pause, reflection checks (content + writing-check
pipeline), and progress bar — tested end-to-end on both kid pages via
headless browser before this was pushed.
