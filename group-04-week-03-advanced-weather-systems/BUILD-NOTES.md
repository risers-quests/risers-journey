# Build Notes — Group 04 / Week 03 / Advanced Weather Systems (Benjamin)

## Persona
**Atmospheric Circulation Forecaster** — an explicit callback to Benjamin's Week 1 circulatory-system framing (valves, pacemaker, blood circulation) reframed as the atmosphere's own circulation system: uneven solar heating creates pressure differences, and air circulates from high to low pressure the way blood circulates because of pressure differences the heart creates. The cover section, framing paragraph, and Day 2 build ("a falling barometer reading is the atmosphere's version of a weak pulse") all make this callback explicit. Week 2 was "Space Physics Connection" (orbital mechanics); this continues the pattern of applying Week 1's core body-system metaphor to a new domain each week.

## Files created
- `css/styles.css` — copied verbatim from `group-04-week-02-space-physics-connection/css/styles.css`, then only the `body.lens-benjamin` accent block was changed to a storm slate-gray (`--accent: #475569; --accent-dark: #1e293b; --accent-soft: #f1f5f9;`), distinct from Week 1/Week 2's indigo (`#4338ca`).
- `js/quest.js` — copied **verbatim, byte-for-byte** from `group-02-week-02-soil-formation/js/quest.js` (verified with `cmp`). Not modified. This is the generic reading+build+present engine (no `initCalcQuest`, no `initVideoGate` — those only exist in the Week 2 orbital-mechanics engine, so this page doesn't call them, matching Owen's page).
- `index.html` — solo-kid hub/name-gate, copied from the `group-04-week-01-circulatory-system` / `group-04-week-02-space-physics-connection` hub pattern, retexted, roster = Benjamin only.
- `benjamin/index.html` — the full quest page.
- `BUILD-NOTES.md` — this file.

## Reflection IDs and keyword groups (all inside Day 1, `refl-1`–`refl-19` range)
`refl-5` was deliberately skipped — `js/quest.js`'s `initProgressBar` treats a present `refl-5` as a special "Day 2 self-review" flag (see its comment: *"The self-review check (refl-5) doesn't exist on every kid's page"*). Since this quest doesn't have that concept, `refl-5` is omitted entirely, exactly like Owen's soil-formation page does.

| id | Section | Groups (all groups required; each group = OR of listed keywords) |
|---|---|---|
| refl-1 | 1. Air masses/fronts | [`cold front`,`warm front`] AND [`wedge(s)`,`lift(s)`,`slide(s)/sliding`,`push(es)`,`under`,`over`] |
| refl-2 | 1 | [`triangle(s)`,`cold`] AND [`semicircle(s)`,`warm`,`round(ed)`] |
| refl-3 | 1 | [`cold front`,`faster`] AND [`catches`,`catch up`,`catches up`] AND [`lift/lifted/lifts`,`off the ground`,`squeezed`] |
| refl-4 | 1 | [`stationary`,`not moving`,`doesn't move`,`stall(s)`,`stuck`] AND [`flood(ing)`,`days`,`same place`,`same spot`] |
| refl-6 | 2. Storms | [`low pressure`,`low-pressure`,`pressure`] AND [`rise(s)/rising`,`cool(s)`,`condense(s)`] |
| refl-7 | 2 | [`counterclockwise`] AND [`coriolis`,`rotation`,`spin`,`earth's rotation`] |
| refl-8 | 2 | [`jet stream`,`river of air`] AND [`temperature`,`contrast`,`difference`] AND [`stuck`,`loop`,`wavy`,`stall(s)`,`drought`,`flooding`] |
| refl-9 | 3. Severe weather | [`26.5`,`80`,`warm`,`temperature`] AND [`not`,`isn't`,`wrong`,`incorrect`,`does matter`,`matters`] |
| refl-10 | 3 (numeric — Saffir-Simpson) | [`category 4`,`cat 4`,`cat. 4`] AND [`130`,`156`] |
| refl-11 | 3 | [`wind shear`,`shear`] AND [`horizontal`,`sideways`,`tube`,`spinning`] AND [`tilt(s/ed)`,`stretch(es)`,`updraft`] |
| refl-12 | 3 (numeric — EF scale) | [`166`,`200`] AND [`damage`,`estimate(d)`,`survey(ed)`,`destroy(s/ed)`] |
| refl-14 | 4. Put together | [`satellite(s)`] AND [`radar`] AND [`balloon(s)`,`radiosonde`] AND [`model(s)`,`computer`] |
| refl-15 | 4 | [`doppler`,`radar`] AND [`speed`,`moving`,`rotation`,`toward`,`away`] |
| refl-16 | 4 (history) | [`bergen`,`fitzroy`,`tiros`,`fujita`,`saffir`] AND [`forecast(ing)`,`front(s)`,`satellite`,`scale`] |
| refl-17 | 4 (real-world) | [`evacuat*`,`warning`,`lead time`,`shelter`,`safety`] AND [`hurricane`,`tornado`,`storm`] |

Verified: the set of `id="refl-N"` textareas in the HTML and the set of `id: 'refl-N'` entries passed to `initReflectionChecks` are **identical** (15 ids each, diffed by script). All ids fall within `refl-1`–`refl-19`.

## Build (Day 2)
A real, working **barometer**: a membrane (balloon / cut produce bag / rubber glove) stretched airtight over a jar, a straw taped flat to the membrane as a pointer, and an index-card scale behind the pointer's tip, read and logged at least twice over a real day. Chosen because it demonstrates a concept directly used in Day 1 Section 2 (falling pressure → approaching low-pressure system / storm) and gives a genuine, safe, repeatable measurement task rather than a one-shot demo. 5-step `build-checklist` + 4-row `justify-table` build log (`id="sec-plan"`) match the spec.

Materials pool has 5 required roles (Container / Membrane / Pointer / Scale-backing / Fastener), matching the "pick one from each column" pattern used elsewhere on the site.

## Videos
All three IDs were checked against live web search results with matching titles before embedding (no fabricated IDs):
1. **`5Cnx5Bzctas`** — "What are Weather Fronts? Warm Front, Cold front? | Weather Wise" (Weather Wise channel, Scott Sutherland). Used in Section 1.
2. **`_cUbV-zPDr8`** — "How Hurricanes Form" (National Geographic). Used in Section 3.
3. **`pSajNLBH7cA`** — "Tornadoes 101" (National Geographic). Used in Section 3.

No placeholder video blocks were needed — all three were confirmed via search-result titles matching exactly. I did not play the videos end-to-end (no video playback in this environment), so I can't personally vouch for every second of runtime content, only that the titles/channels/topics returned by search are real and on-topic. If a facilitator wants extra certainty before a live session, spot-checking these three links once is a reasonable precaution.

## Facts I'm most confident about (verified against known meteorology)
- Four front types and their basic mechanics (cold/warm/occluded/stationary).
- Low-pressure/high-pressure basics and Northern Hemisphere Coriolis-driven counterclockwise spiral into a low.
- Jet stream basics: formed by temperature contrast, steers surface storms, "blocking pattern" (wavy/stuck jet stream) link to prolonged drought/flooding.
- Hurricane formation: ≥26.5°C (80°F) ocean water threshold, latent-heat feedback loop, Coriolis-driven organization, weakening over land/cool water.
- Saffir-Simpson category wind thresholds (74 / 96 / 111 / 130 / 157 mph).
- Tornado formation via supercell mesocyclone + wind shear tilting a horizontal rotating column vertical, stretching/speeding it (angular-momentum "figure skater" analogy).
- Enhanced Fujita Scale is damage-survey-based, not directly measured, because instruments rarely survive a tornado's path; EF wind estimate bands used (EF4 ≈ 166–200 mph).
- History: Robert FitzRoy (1854, UK Meteorological Department, coined "forecast"); Bergen School / Vilhelm & Jacob Bjerknes polar front theory (1920s); TIROS-1 first weather satellite (1960); Ted Fujita's Fujita Scale (1971, refined to Enhanced Fujita in 2007) and Herbert Saffir/Robert Simpson's Saffir-Simpson scale (early 1970s).
- Forecasting tools: satellite imagery, Doppler radar's velocity (not just reflectivity) measurement enabling rotation/hook-echo detection, radiosonde weather balloons, numerical computer weather models.

## Things I had to simplify or make a judgment call on
- The front-symbol SVG diagram is a simplified, stylized version of real weather-map symbols (semicircles render as filled dot-like bumps rather than perfectly crisp half-circles at this small scale) — legible and directionally correct, but not a pixel-perfect meteorological chart symbol.
- "Occluded front" explanation uses the standard simplified cold-type-occlusion description (cold front undercutting, warm air fully lifted); it does not get into cold-type vs. warm-type occlusion distinctions, which is standard for this reading level and consistent with how the site's other quests simplify multi-variant science topics.
- EF-scale wind estimates are the commonly cited 3-second-gust bands; these are widely published NWS/NOAA estimates, not disputed, but I want to flag that EF-scale wind numbers are inherently estimates by design (the scale's own point), not lab-measured constants.
- I did not verify the three YouTube videos by watching them end-to-end (no video playback available in this environment) — only that search results independently returned matching titles/channels/topics. Recommend a quick facilitator spot-check before first live use, per standard practice.

## Verification performed before commit
1. Extracted all inline `<script>` blocks from `benjamin/index.html` and ran `node --check` on each — all pass.
2. Ran `node --check` on `js/quest.js` itself — passes.
3. Confirmed `js/quest.js` is byte-identical to `group-02-week-02-soil-formation/js/quest.js` via `cmp`.
4. Diffed the set of `refl-N` textarea ids against the set of ids in `initReflectionChecks` — identical (15/15), no orphans either direction.
5. Ran an HTML well-formedness check (Python `html.parser`, tracking a tag stack) — zero errors, empty stack at EOF (including the diagram's inline SVG).
6. Rendered the page with Playwright (Chromium), with `localStorage.imm-l3-kid = 'Benjamin'` pre-set and `/sync` + `/evaluate` + LanguageTool network calls mocked/blocked. No `pageerror` events in either normal mode or `?fac=1` facilitator mode. Screenshots confirmed: kid-gate unlocks correctly, storm-slate accent renders, progress bar shows the correct Day 1 (0/15) and Day 2 (0/5) totals, card-grids/diagram/timeline/model3d cube/materials pool/build day all render, and section/day locking behaves correctly (Day 2 content blurred/locked until Day 1 checks pass, and unlocked under facilitator mode).
