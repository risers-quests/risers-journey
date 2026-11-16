# LifeHub Foundations — Dynamic Math Diagnostic (Pilot Build)

A working, full-stack implementation of the diagnostic described in
`LifeHub_Foundations_-_Math_Diagnostic_Design_Document.pdf`: an adaptive
Grade 5 (Singapore Math) assessment that walks a CPA × Bloom's grid per
topic to tag each topic as **Mastered**, **Skill gap**, or **Procedural,
not conceptual** — instead of a single score — plus a separate,
standalone math-anxiety self-report questionnaire.

This build covers the **full Grade 5 syllabus**, in the same order as the
textbook's own table of contents — 15 topics covering all 14 chapters (the
"Fractions" chapter is split into the two topics the pilot originally
started with, per the design doc's Section 10 "suggested immediate next
step"): More on Large Numbers → Operations on Large Numbers → Factors and
Multiples → Fractions and Division → Four Operations of Fractions →
Decimals → Geometry → Measurement → Perimeter and Area → Volume and Nets
of Solids → Time and Temperature → Life Mathematics → Scales and
Directions → Data Handling → Patterns and Symmetry. Each topic depends on
the one directly before it, so the engine only unlocks a topic once its
immediate predecessor is mastered — a single linear building-blocks chain
matching how the textbook sequences the year (see `itemBank/topics.ts` for
why this is a deliberate simplification of the "true" prerequisite graph).

**Methodology note (read this before the rest):** the original design doc
proposed detecting anxiety *live, from within the math questions*, via a
"reframe probe" (silently re-presenting a struggled question later under
lower-stakes framing) and a raw hesitation-timing threshold. Neither is
backed by the actual published research: response-time as an anxiety
signal is inconsistent across studies, no validated millisecond threshold
exists anywhere in the literature, and there is no published protocol for
inferring anxiety live, item-by-item, from behaviour during a skill test.
This build has since moved to what the actual literature does instead:
**two separate instruments** — the adaptive skill test below, and a
standalone self-report questionnaire (wording adapted from the **Scale for
Early Mathematics Anxiety, SEMA** — validated for grades 3–6), reported
side by side rather than combined into one live signal. See *Two separate
instruments* below for the full reasoning and sourcing.

## Stack

- **Server**: Node.js + TypeScript + Express, persisted via
  [Turso](https://turso.tech) (libSQL — SQLite-compatible, accessible over
  the network) using `@libsql/client/web`, the pure HTTP/WebSocket build
  with no native binary. Local dev and production both talk to the same
  Turso database — a serverless function has no persistent local disk to
  keep a session's data alive between requests, so there's no local-only
  fallback (see *Deploying to Vercel* below for how to create the free-tier
  database both need).
- **Client**: React + TypeScript (Vite).
- No auth — this is a pilot/demo build, not a deployment-ready product (see
  *Open questions* below, carried over from the design doc).

## Running it

Needs a Turso database first (see *Deploying to Vercel* below for how to
create the free one) — copy `server/.env.example` to `server/.env` and fill
in `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`.

```bash
npm install          # installs both workspaces

# terminal 1
npm run dev:server   # http://localhost:4001

# terminal 2
npm run dev:client   # http://localhost:5173 (proxies /api to the server)
```

Open `http://localhost:5173`, enter a child's name, and take the
assessment. Toggle **"Hide engine internals"** on the assessment screen to
see the interface the way a child would (the CPA×Bloom grid, session map,
and engine trace are reviewer-only per the design doc's Screen 1
annotations — they are not meant for the child-facing production build).

### Simulating a full session without clicking through the UI

`server/scripts/simulate.ts` drives the API end-to-end with a scripted
"child" that's deliberately weak on Pictorial word-problem items and
strong everywhere else, to exercise the climb/drop/procedural-check logic
and print the resulting report (it doesn't cover the separate anxiety
questionnaire, which isn't adaptive):

```bash
cd server && npm run dev &     # needs the server running
npm run simulate
```

## Deploying to Vercel (free tier)

The server is a single Express app exported for Vercel's Node runtime
(`server/api/index.ts`), with `server/vercel.json` rewriting every request
to it. To deploy the `server/` directory as its own Vercel project:

1. **Create a free Turso database** — install the Turso CLI or use
   [turso.tech](https://turso.tech) to sign up (free tier), then:
   ```bash
   turso db create lifehub-diagnostic
   turso db show lifehub-diagnostic --url        # → TURSO_DATABASE_URL
   turso db tokens create lifehub-diagnostic       # → TURSO_AUTH_TOKEN
   ```
2. In the Vercel project's **Settings → Environment Variables**, add
   `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` with the values from step 1.
3. Set the project's **Root Directory** to `server` (if not already).
4. Redeploy. The schema migration runs automatically on first request —
   no separate migration step needed.

Without those two env vars set, the server throws immediately on cold
start (`db.ts` requires them) rather than silently falling back to
something that would break just as badly — a serverless function's
filesystem is read-only outside `/tmp` and isn't shared across
invocations, so there's nowhere durable to put a local SQLite file anyway.

Two separate things were causing `FUNCTION_INVOCATION_FAILED` on the first
deploy attempts, in order: (1) `better-sqlite3` is a native addon that
isn't guaranteed to load in Vercel's runtime, and (2) even `@libsql/client`'s
*default* Node build statically pulls in a native `libsql` binary for its
local-file support — which can fail to load the same way even when only
used for a remote connection. Using `@libsql/client/web` (a pure
HTTP/WebSocket build with no native code at all) removes that risk
entirely — see `server/src/db.ts`.

The client (`client/`) deploys as a normal static Vite app on its own
Vercel project (or any static host). Set its `VITE_API_BASE_URL` env var
to the deployed server's URL plus `/api` (see `client/.env.example`) —
without it, the client calls a relative `/api` path that only resolves
correctly in local dev, where Vite's proxy handles it.

## How the design doc maps to this codebase

| Design doc concept | Where it lives |
|---|---|
| Skill Engine (climb/drop/mastery gate) | `server/src/engine/skillEngine.ts` |
| Synthesis layer → diagnosis tags + report | `server/src/engine/synthesis.ts` |
| CPA × Bloom's item bank | `server/src/itemBank/*` |
| Per-topic mastery loop (climb/drop) | `applyOutcome()` in `skillEngine.ts` |
| Prerequisite graph | `dependsOn` on each `Topic` in `itemBank/topics.ts` |
| Anxiety questionnaire (replaces the doc's live "reframe probe") | `server/src/itemBank/anxietyQuestionnaire.ts` |
| Screen 1 (assessment + side panel) | `client/src/screens/Assessment.tsx` |
| Screen 2 (diagnostic report) | `client/src/screens/Report.tsx` |
| Anxiety questionnaire screen | `client/src/screens/AnxietyCheck.tsx` |
| Palette / typography | `client/src/styles/theme.css` |

### A deliberate engine refinement beyond the doc's flowchart

The design doc's Section 05 flowchart tracks a single "current cell" per
topic and resets its struggle counter whenever *any* question clears. In
practice that lets the engine oscillate forever between a hard cell and
its easier back-probes without ever reaching a lag point — which defeats
the diagnostic's central case (a persistent, specific weak spot). This
build instead tracks a **frontier cell** (the real target the child must
prove they've cleared) separately from the **probe cell** (whatever's
being asked right now, which may sit below the frontier during
scaffolding). The struggle count only resets when the *frontier* itself
clears, so a genuinely stuck child reliably reaches the lag-point /
procedural-check machinery instead of looping. Progress is also gated on
**correctness alone**, not correctness *and* speed — real usage showed a
correct-but-thoughtful answer being treated as a struggle, which could
stall a topic indefinitely even when the child knew the material.

### The "procedural, not conceptual" mechanism

Section 04's central example — a child who computes correctly in Abstract
but can't represent the same relationship Pictorially — can't emerge from
pure forward climbing (Pictorial is always cleared before Abstract is ever
attempted). To make this diagnosable, the engine runs a one-time **Abstract
side-probe** on the exact struggled-on relationship after a topic's second
struggle. A correct answer there — computing symbolically what it just
failed to represent visually — is the procedural-without-conceptual
signature; the report's evidence line for that tag comes directly from
this probe plus the recorded per-representation accuracy. This mechanism
stayed unchanged through the anxiety-methodology rework below — it's
testing a CPA-representation gap (Singapore Math's own pedagogy), not an
anxiety signal, so it didn't need the same scrutiny.

## Two separate instruments, not one combined signal

**What changed, and why.** The design doc's original mechanism for
detecting anxiety was to watch behaviour *during* the math questions
themselves: a raw hesitation-timing threshold (a specific number of
seconds of "long pause" counted as an anxiety signal), and a "reframe
probe" that silently re-presented a struggled question later under
lower-stakes framing, checking whether performance recovered. Real usage
surfaced two problems with this:

1. **The timing threshold had no basis.** It was invented during
   implementation because the design doc doesn't specify one — and a web
   search of the actual published research (see sources below) found the
   relationship between response time and math anxiety is inconsistent
   across studies (some find anxious students respond slower; at least one
   finds anxiety affects accuracy but not response time at all). There is
   no validated millisecond cutoff anywhere in the literature.
2. **The reframe probe isn't a validated protocol.** The real, validated
   instruments for measuring math anxiety in children (AMAS, SEMA, MASC)
   are all short **self-report questionnaires**, administered as their own
   separate instrument — never interleaved live with a skill test the way
   this doc proposed. There's also a real methodological problem with
   same-session repetition specifically: a child who recognizes "this is
   the question I got wrong before" may feel *more* pressure, not less,
   and a recovered answer could just as easily reflect a practice effect
   (having seen the problem once already) as reduced anxiety — the design
   can't distinguish those.

**What this build does now.** Two genuinely separate instruments, matching
how the actual research does it:

- The **skill assessment** (unchanged in its CPA×Bloom mechanics) produces
  Mastered / Skill gap / Procedural-not-conceptual per topic, from
  correctness and representation-switching alone — no anxiety inference
  mixed in.
- A **standalone anxiety questionnaire** (`AnxietyCheck.tsx`,
  `anxietyQuestionnaire.ts`) runs afterward, as its own screen: 8 short
  items adapted from SEMA's two-factor structure (Numerical Processing
  anxiety — worry about the math itself; Situational/Performance anxiety —
  worry about being tested or watched), each answered on a simple 3-point
  scale. It is scored independently and shown in its own report section,
  explicitly *not* combined into the topic tags.

**Honesty about what's still approximate.** The SEMA-adapted wording and
two-factor structure are a genuine adaptation of a published, validated
instrument — but the specific Low/Moderate/Elevated scoring bands in
`synthesis.ts`'s `computeMathAnxiety()` are this build's own reasonable
split of the score range, not official published SEMA cutoffs (we
couldn't access the original scoring manual). Treat the level as a useful
read, not a clinical cutoff, until it can be validated against real pilot
data — which is exactly the kind of piloting Section 10 of the design doc
calls for.

Sources consulted for this change:
- [The Early Elementary School Abbreviated Math Anxiety Scale (EES-AMAS)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7253683/)
- [Assessing math anxiety in elementary schoolchildren via SEMA](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0255777)
- [Math anxiety in elementary students: timing and task complexity](https://www.sciencedirect.com/science/article/abs/pii/S0022440524000360)
- [Time on Their Side: visual timers and anticipatory anxiety](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12731990/)
- [Distinguishing math learning and evaluation anxiety (competing theoretical models)](https://pmc.ncbi.nlm.nih.gov/articles/PMC13326596/)

## The item bank's four representation kinds

The original two topics only ever needed two diagram types — a bar model
(`BarModelSpec`) for part-whole/sharing relationships, and grouped icons
(`ConcreteSpec`) for equal-groups scenarios — because both were fraction
topics. Covering the full syllabus meant three more topics don't fit
either: place value, geometry, measurement, time, and maps aren't
part-whole relationships. Rather than force those into a fraction-shaped
diagram, `server/src/types.ts` adds three more `Representation` kinds,
each with a matching client component:

| Kind | Component | Used for |
|---|---|---|
| `number-line` | `NumberLine.tsx` | Large numbers (rounding/ordering), decimals, measurement scales, time (24-hour line), temperature |
| `grid` | `Grid.tsx` | Multiplication/factor arrays, area, volume (one layer + stacking described in words), simple coordinate maps |
| `shape` | `Shape.tsx` | Geometry (labeled angles/sides), symmetry |

Two subskills have no natural diagram at all — "angles on a line/at a
point" in Geometry isn't a shape, and line graphs in Data Handling have no
dedicated component in this build. Rather than give a Pictorial cell
`representation: null` (which would defeat the point of that stage), those
subskills are pushed entirely into Abstract, where no picture was ever
expected; every Pictorial cell across all 15 topics has a real diagram. See
the comments in `geometry.ts`, `volumeAndNets.ts`, and `dataHandling.ts`.

## Concrete / Pictorial / Abstract have to actually look different

Early drafts of this item bank blurred the CPA stages: Pictorial prompts
often restated in prose exactly what the diagram already showed (e.g. "The
number line shows 243,000 — round it..."), and Abstract prompts were
frequently full word problems ("A factory produced 458,300 toys...")
instead of bare computation. That defeats the diagnostic's own premise —
if all three stages read like the same kind of question, a child's
performance can't actually distinguish "understands the concept only with
a manipulative" from "can compute symbolically with no support." Every
item in every topic was rewritten against two rules:

- **Pictorial prompts carry no information the diagram doesn't already
  show.** Every number, label, or fact needed to answer lives in the
  `representation` object (a marker label, a grid's `unitLabel`, a bar's
  `totalLabel`) — the prompt itself is just a short instruction ("What
  does the marked point round to?"), not a restated scenario. This also
  caught a second, more serious bug while fixing it: a few items narrated
  a *second* diagram ("Two arrays are shown...", "Rectangle B, not
  shown...") that never actually rendered, since each item only ever
  renders the one `representation` it's given. Those were rewritten to
  only ask about what's genuinely on screen.
- **Abstract prompts are bare expressions or minimal given/find
  notation, never a narrative.** "A shopkeeper buys 10 pens for ₹200..."
  became "CP: 10 items for ₹200 total. SP: ₹25 each. Profit or loss = ?"
  — same computation, no characters or scenario. `representation` stays
  `null` throughout, as before.

## Known simplifications (pilot scope, matching the doc's own open questions)

- **Item bank depth**: 1 authored item per CPA×Bloom cell (15 per topic,
  225 total across all 15 topics) rather than the multiple-items-per-cell
  the doc flags as an open statistical-confidence question (Section 10).
  The engine falls back gracefully but a revisited cell currently repeats
  its one item.
- **Lag threshold**: hard-coded at 4 consecutive struggles
  (`LAG_THRESHOLD` in `skillEngine.ts`), still just a starting assumption,
  not a validated number — needs real piloting.
- **Anxiety scoring bands**: our own approximation, not official SEMA
  norms — see *Two separate instruments* above.
- **No auth, no multi-session history, no teacher/remediation-system
  integration** — all flagged as unresolved in Section 10.
- **The prerequisite graph is a single linear chain**, matching the
  textbook's own chapter order, rather than the "real" dependency graph
  (e.g. Perimeter and Area doesn't strictly require Time and Temperature
  first). This makes one weak topic block everything after it in a single
  sitting — a reasonable tradeoff for a pilot testing "does the engine
  correctly diagnose one topic," but worth revisiting before this is used
  to plan a full year's remediation order.
- **Geometry/Patterns/Data Handling lean on lighter representations** than
  the original two fraction topics — see *The item bank's four
  representation kinds* above.
- **The default 40-question session cap** (`maxQuestions` in `state.ts`)
  was sized for a 2-topic pilot; across all 15 topics a child who clears
  everything on the first try reaches roughly topic 6–7 before the cap,
  same as any single diagnostic sitting wouldn't cover a full year's
  material in one go — not a bug, but worth knowing when reading a report
  with several "Not yet reached" topics.

## Project layout

```
server/
  api/index.ts      Vercel serverless entry point (exports the Express app)
  vercel.json        rewrites every request to api/index.ts
  src/
    itemBank/       topics.ts (the 15-topic prerequisite chain) + one file
                    per topic's 15 CPA×Bloom items + anxietyQuestionnaire.ts
    engine/         state, skillEngine, signalEngine (raw timing only), synthesis, view
    db.ts           Turso/libSQL client + schema migration
    sessionStore.ts persistence layer (async)
    app.ts          Express app (no .listen — shared by local + serverless)
    index.ts        local dev entry point (calls app.listen)
    routes.ts       REST API (skill assessment + separate anxiety-questionnaire endpoints)
  scripts/simulate.ts
client/
  src/
    screens/        Setup, Assessment, AnxietyCheck, Report
    components/      BarModel, ConcreteObjects, NumberLine, Grid, Shape,
                     CPABloomGrid, SessionMap, EngineTrace, PulseCheck,
                     BloomPyramid, ChildSummary
    styles/theme.css
    api.ts          fetch layer (VITE_API_BASE_URL-aware)
```
