# Build notes — Quest 3: Digestive System (group-02, Owen + Pranavi)

## Personas / lenses

- **Owen — "Gut Engineer"** (📏, amber `--accent:#d97706 / --accent-dark:#92400e / --accent-soft:#fffbeb`). Methodical/measuring framing, matching his Week 2 "Soil Engineer" instinct: build one real artifact and put a ruler to it. Reading register targets grade 6.
- **Pranavi — "Gut Systems Engineer"** (⏱️, red `--accent:#dc2626 / --accent-dark:#7f1d1d / --accent-soft:#fef2f2`). Comparison/timing framing, matching her Week 2 "Soil Systems Engineer" instinct: build two samples side by side and time them. Reading register targets grade 5 — shorter sentences, plainer words, but content is still split into 2–4 short paragraphs per section, not compressed into one block.
- Both colors are new and distinct from Week 2's teal/purple soil-formation lenses, and distinct from each other (warm amber vs. red).

## Builds (Day 2)

- **Owen:** a real, scaled rope/string model of the digestive tract. He picks his own scale, then cuts and labels four segments — esophagus (~25 cm real), stomach (~25–30 cm real), small intestine (~6 m real, by far the longest), large intestine (~1.5 m real) — and measures the finished model with a ruler/tape measure, calculating what percent of the total each segment is.
- **Pranavi:** a timed, side-by-side comparison of two same-size cracker pieces — one crushed with a spoon only (mechanical digestion alone) in Cup A, one chewed for ~30 seconds and mixed with real saliva (mechanical + chemical digestion, since salivary amylase starts breaking down starch immediately) in Cup B — then the same measured amount of water is poured into each and a stopwatch times how long each takes to break apart.
  - **Judgment call:** the real, well-documented classroom demo here is the "cracker taste test" (chewing a cracker ~1–2 minutes produces a noticeably sweet taste as salivary amylase converts starch to sugar — confirmed via search, this is a standard and safe classroom experiment). I adapted it into a **timed breakdown/dissolve comparison** instead of a taste comparison, to fit Pranavi's timing/comparison lens and to give her a real stopwatch-based measurement to log, parallel to her Week 2 drainage-race build. The physical result (chewed/saliva-mixed cracker breaking apart in water measurably faster than a merely spoon-crushed piece, due to the head start from amylase already having begun digesting the starch, plus better saturation from chewing) is a reasonable, safe, household-doable extrapolation of the real demo, but I have not personally verified exact timing numbers — flagging this as my own adaptation rather than a directly-sourced protocol, in case a reviewer wants to pilot-test it before it goes live.

## Videos

All three video IDs were confirmed as real, existing YouTube videos via web search (title + URL both returned directly by search), and are reused across both Owen's and Pranavi's pages:

1. `ZBZWgrfZFbU` — "Digestive System | The Dr. Binocs Show" (Peekaboo Kidz) — used in Day 1, Section 1 (the path).
2. `SD8kLAD1jnA` — "The Digestive System for Kids | A fun engaging overview of what happens when we eat!" — used in Day 1, Section 2 (mechanical vs. chemical digestion).
3. `JLzX_KSrxDc` — "Journey inside your body to see how digestion works | Digestive System for Kids | badgut.org" (Canadian Society of Intestinal Research) — used in Day 1, Section 3 (absorption).

No placeholders were needed — all three were confident matches from search results with clear, on-topic titles from identifiable kids'-education or health-nonprofit channels.

## Reflection IDs and keyword groups (for dashboard cross-check)

Both kids' pages use ids `refl-1` through `refl-16` for the same 16 underlying concepts (facts are identical between the two pages; only wording/reading level differs). **Pranavi's page additionally has `refl-17`**, a comparison-specific prediction question unique to her lens (parallel to how her soil-formation Week 2 page also had one extra id, `refl-19`, that Owen's page didn't).

| id | Section | Required concept groups (ALL groups must have ≥1 hit) |
|---|---|---|
| refl-1 | 1. The path | [mouth/saliva/amylase/chew/chewing] + [small intestine/absorption/absorb] |
| refl-2 | 1. The path | [esophagus] + [peristalsis/wave/waves/squeeze/squeezing] |
| refl-3 | 1. The path | [liver/pancreas/gallbladder] + [bile/enzyme/enzymes] |
| refl-4 | 2. Mechanical vs. chemical | [mechanical/chew/chewing/grind/churn/churning] + [chemical/enzyme/enzymes/acid/bile] |
| refl-5 | 2. Mechanical vs. chemical | [acid/hydrochloric] + [kill/germs/bacteria/pepsin/protein] |
| refl-6 | 2. Mechanical vs. chemical | [bile] + [fat/emulsify/emulsifies/break up/droplets(/drops on Pranavi's page)] |
| refl-7 | 2. Mechanical vs. chemical | [churn/churning/muscle/muscles/squeeze] + [acid/enzyme/chemical] |
| refl-17 (Pranavi only) | 2. Mechanical vs. chemical | [chew/chewed/chewing/saliva] + [fast/faster/quicker/quickly] |
| refl-8 | 3. Absorption | [villi/villus] + [surface area/more surface/increase] |
| refl-9 | 3. Absorption | [blood/bloodstream/blood vessels] + [nutrient/nutrients/absorb/absorbed] |
| refl-10 | 3. Absorption | [water] + [waste/stool/feces/solid] |
| refl-11 | 3. Absorption | [small intestine/nutrient/nutrients] + [large intestine/water] |
| refl-12 | 4. Put together | [coil/coiled/fold/folded/pack/packed/loop/loops] + [space/fit/abdomen/small space] |
| refl-13 | 4. Put together | [stomach] + [small intestine] |
| refl-14 | 4. Put together | [mechanical/chew/churn] + [chemical/enzyme/acid/bile] + [absorb/absorption/villi/nutrient] |
| refl-15 | 4. Put together | [pancreas] + [insulin/blood sugar/hormone/hormones] |
| refl-16 | History (rereads to section 2) | [fistula/wound/opening/hole] + [observe/watch/see/study/chemical/acid] |

All ids fall within `refl-1`–`refl-19`, well inside the range `quest.js`'s progress-bar candidate list already knows about (`quest.js` itself is an unmodified, byte-identical copy of `group-02-week-02-soil-formation/js/quest.js` — verified with `diff`).

## History facts (all verified via web search before writing)

1. **1780s — Lazzaro Spallanzani.** Fed birds food in small perforated containers on a string, retrieved them, and concluded gastric juice chemically dissolves food — not just mechanical grinding.
2. **1824 — William Prout.** Identified the acid in gastric juice as hydrochloric acid (presented Dec. 11, 1823 at the Royal Society; published 1824).
3. **1822–1833 — William Beaumont.** Studied digestion directly through Alexis St. Martin's unhealed gastric fistula (from an 1822 accidental gunshot wound), publishing "Experiments and Observations on the Gastric Juice and the Physiology of Digestion" in 1833.
4. **1904 — Ivan Pavlov.** Won the Nobel Prize in Physiology or Medicine for his work on the nervous control of digestion — the first Nobel Prize ever awarded to a physiologist.

I'm confident in all four; sources returned consistent, specific dates and details across multiple independent search results (Britannica, NobelPrize.org, Science History Institute, and others).

## Numbers used for the digestive tract's real lengths

Adult approximate lengths (used consistently across both pages' reading, diagrams, and Owen's build): esophagus ~25 cm, stomach ~25–30 cm, small intestine ~6 m, large intestine ~1.5 m, whole tract ~9 m. These are commonly-cited classroom approximations; real sources vary somewhat (small intestine is reported anywhere from ~6–7.5 m depending on whether it's a relaxed cadaver measurement or a living-body-with-muscle-tone measurement). I used the median/commonly-rounded classroom figures rather than a single precise source, since exact GI length is genuinely variable between individuals and measurement methods — flagging this in case a reviewer wants tighter precision or a specific citation.

## Other judgment calls / things I could not verify further

- The two SVG diagrams (digestive tract stop-by-stop; the Day 2 build reference for each kid) are original schematic illustrations built for this quest, not anatomically precise renderings — styled the same way as the Week 2 soil-horizons diagram (labeled stacked rectangles + legend), which itself was schematic rather than photorealistic.
- Pranavi's Day 2 build reference diagram and Day 2 content render correctly but are intentionally blurred by the site's own `initDayLock` mechanism until Day 1's reflections are complete — confirmed this is expected/working behavior (from `quest.js`, copied verbatim), not a rendering bug, during the Playwright check below.

## Verification performed

1. `node --check` run against every inline `<script>` block on all four pages (`index.html`, `owen/index.html`, `pranavi/index.html`) — all pass.
2. Cross-checked every `refl-N` `<textarea>` id against every `initReflectionChecks` config id on both kid pages — exact match on both (16 ids on Owen's page, 17 on Pranavi's), and confirmed `group-02-week-03-digestive-system/js/quest.js` is byte-identical to `group-02-week-02-soil-formation/js/quest.js` via `diff`.
3. Installed Playwright + Chromium in this environment and loaded both kid pages locally via `python3 -m http.server`, with `localStorage.imm-l3-kid` pre-set to bypass the name gate, and the progress-sync Worker + LanguageTool endpoints mocked via `page.route()` so no real network calls were made. Confirmed: no page/console errors other than the sandbox's proxy blocking `youtube.com` iframe embeds (expected here — not a code issue, YouTube itself isn't reachable from this sandboxed environment); both kids' tract diagrams and Day 1 content render correctly and in their own distinct color themes; the match game (8 pairs), 3D model cube (6 faces), and Day 2 lock behavior all initialize correctly. Full-page and cropped element screenshots were reviewed visually.

## What was NOT touched

No files outside `group-02-week-03-digestive-system/` were read for editing purposes beyond the required reference reads of `group-02-week-02-soil-formation/` (owen/index.html, pranavi/index.html, index.html, css/styles.css, js/quest.js — all read-only) and a Playwright/Chromium install into the sandbox's global npm cache (not part of the repo). No staff repo, `dashboard/roster.js`, or other group folders were modified.
