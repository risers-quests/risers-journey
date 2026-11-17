import { BLOOM_CEILING, BLOOM_ORDER, CPA_ORDER, BloomLevel, CPAStage, cellId } from "../types.js";
import { SessionState, logTrace } from "./state.js";
import { findItem, getItemById, getTopic, ALL_ITEMS } from "../itemBank/index.js";
import { generateItem, hasTemplate, isGenerated, signature } from "../itemBank/generate/index.js";
import { Item } from "../types.js";

const CLIMB_BLOOM_ORDER: BloomLevel[] = ["understand", "apply", "analyze"];
const LAG_THRESHOLD = 4;

export interface NextQuestion {
  item: Item;
  isProceduralCheck: boolean;
}

function cpaIndex(cpa: CPAStage) {
  return CPA_ORDER.indexOf(cpa);
}

function dropCpa(cpa: CPAStage): CPAStage {
  const idx = cpaIndex(cpa);
  return CPA_ORDER[Math.max(0, idx - 1)];
}

function stepCpaForward(cpa: CPAStage): CPAStage | null {
  // Forward climbing only ever runs pictorial -> abstract; concrete is a back-probe-only stage.
  if (cpa === "pictorial") return "abstract";
  if (cpa === "concrete") return "pictorial";
  return null; // already at abstract, nowhere further forward
}

/**
 * The question to ask for a cell. Never one this child has already had in
 * this test: generated topics make fresh numbers; hand-written topics pick
 * an unasked question (this cell, else the nearest cell). Returns null when
 * a hand-written topic has no unasked question left. Passing `state` marks
 * the question as asked.
 */
function findBestItem(topicId: string, cpa: CPAStage, bloom: BloomLevel, state?: SessionState, given?: Record<string, number>): Item | null {
  // Generated topics: a fresh question with numbers this child hasn't had.
  if (hasTemplate(topicId, cpa, bloom, state?.grade ?? 5)) {
    const asked = state?.topics[topicId]?.askedItemIds;
    const item = generateItem(topicId, cpa, bloom, { avoid: asked, given, grade: state?.grade ?? 5 });
    if (asked) asked.push(signature(item));
    return item;
  }
  const asked = state?.topics[topicId]?.askedItemIds ?? [];
  const fresh = ALL_ITEMS.filter((it) => it.topicId === topicId && !asked.includes(it.id));
  // This cell if unasked; otherwise the nearest unasked cell (same stage first).
  const distance = (it: Item) => Math.abs(CPA_ORDER.indexOf(it.cpa) - CPA_ORDER.indexOf(cpa)) * 10 + Math.abs(BLOOM_ORDER.indexOf(it.bloom) - BLOOM_ORDER.indexOf(bloom));
  const pick = [...fresh].sort((x, y) => distance(x) - distance(y))[0] ?? null;
  if (pick && state) state.topics[topicId]?.askedItemIds.push(pick.id);
  return pick;
}

/** A hand-written topic with no unasked question left: stop it where it stands rather than repeat. */
function endExhaustedTopic(state: SessionState, topicId: string) {
  const t = state.topics[topicId];
  t.status = "lag_point";
  t.lagPoints.push({ cpa: t.frontierCpa, bloom: t.frontierBloom, subskill: "", reason: "Ran out of fresh questions at this level (this topic's questions are not yet generated)." });
  logTrace(state, `${getTopic(topicId).shortLabel}: no unasked questions left — topic stopped here instead of repeating.`);
}

/** Picks whichever unlocked topic still has work left, in prerequisite order. */
function activeTopicId(state: SessionState): string | null {
  for (const topicId of state.topicOrder) {
    const t = state.topics[topicId];
    if (t.status === "in_progress") return topicId;
  }
  // nothing in_progress: try to unlock the next locked topic whose prerequisites are mastered
  for (const topicId of state.topicOrder) {
    const t = state.topics[topicId];
    if (t.status !== "locked") continue;
    const topic = getTopic(topicId);
    // A prerequisite from a strand not in this test is assumed known (the
    // report says so); otherwise it has to be mastered first.
    const prereqsMet = topic.dependsOn.every((dep) => !state.topics[dep] || state.topics[dep].status === "mastered");
    if (prereqsMet) {
      t.status = "in_progress";
      logTrace(state, `Prerequisites cleared → unlocked ${topic.name}.`);
      return topicId;
    }
  }
  return null;
}

function dueProceduralCheck(state: SessionState, topicId: string) {
  const t = state.topics[topicId];
  const pc = t.proceduralCheck;
  if (pc && !pc.presented && state.seqCounter >= pc.scheduledAtSeq) return pc;
  return null;
}

/**
 * Returns null once the skill assessment itself is done — the caller
 * transitions to the separate anxiety questionnaire from there (see
 * routes.ts). This function only ever drives the CPA×Bloom skill test.
 */
export function selectNextQuestion(state: SessionState): NextQuestion | null {
  if (state.totalQuestions >= state.maxQuestions) return null;

  // Warm-up: easy items to calibrate baseline pace before the real assessment.
  if (state.phase === "warmup") {
    const askedSoFar = 2 - state.warmupRemaining;
    const topicForWarmup = state.topicOrder[askedSoFar % state.topicOrder.length];
    const item = findBestItem(topicForWarmup, "concrete", "remember", state);
    if (item) return { item, isProceduralCheck: false };
    state.phase = "assessment"; // no fresh warm-up question: skip straight to the test
    state.warmupRemaining = 0;
  }

  const topicId = activeTopicId(state);
  if (!topicId) return null; // nothing left to test — skill assessment complete
  const t = state.topics[topicId];

  // The procedural-vs-conceptual side-probe fires soon after a struggle —
  // this is a CPA-representation check (Singapore Math's own pedagogy), not
  // an anxiety-detection mechanism, so it stays.
  const pc = dueProceduralCheck(state, topicId);
  if (pc) {
    const item = pc.item ?? getItemById(pc.itemId);
    return { item, isProceduralCheck: true };
  }

  const item = findBestItem(topicId, t.probeCpa, t.probeBloom, state);
  if (!item) {
    endExhaustedTopic(state, topicId);
    return selectNextQuestion(state);
  }
  return { item, isProceduralCheck: false };
}

export interface OutcomeInput {
  topicId: string;
  cpa: CPAStage;
  bloom: BloomLevel;
  correct: boolean;
  isProceduralCheck: boolean;
  seq: number;
  /** The numbers the question was built from (generated topics), so the side-probe can re-ask the same ones. */
  params?: Record<string, number>;
}

export type LoopOutcome = "cleared" | "struggle" | "procedural_confirmed" | "procedural_ruled_out";

export function applyOutcome(state: SessionState, input: OutcomeInput): LoopOutcome {
  const t = state.topics[input.topicId];
  const topic = getTopic(input.topicId);
  t.questionsAsked += 1;
  state.totalQuestions += 1;

  if (input.isProceduralCheck && t.proceduralCheck) {
    t.proceduralCheck.presented = true;
    t.proceduralCheck.correct = input.correct;
    if (input.correct) {
      logTrace(state, `${topic.shortLabel}: computes correctly in Abstract despite the Pictorial struggle → procedural without conceptual grounding.`);
      return "procedural_confirmed";
    } else {
      logTrace(state, `${topic.shortLabel}: also missed the Abstract check → genuine gap, not just a representation issue.`);
      return "procedural_ruled_out";
    }
  }

  const atFrontier = input.cpa === t.frontierCpa && input.bloom === t.frontierBloom;

  // Progress is gated on correctness alone — a right answer that took a
  // moment to think through still counts as cleared.
  if (input.correct) {
    t.cellStatus[cellId({ cpa: input.cpa, bloom: input.bloom })] = "cleared";

    if (!atFrontier) {
      // Cleared a scaffolded back-probe, not the actual frontier — climb the probe
      // one step back toward the frontier, but the struggle count stays: the child
      // still hasn't proven they can clear the thing they're actually stuck on.
      const next = stepCpaForward(t.probeCpa);
      t.probeCpa = next && cpaIndex(next) <= cpaIndex(t.frontierCpa) ? next : t.frontierCpa;
      t.probeBloom = t.frontierBloom;
      logTrace(state, `${topic.shortLabel}: cleared the ${input.cpa}·${input.bloom} back-probe → re-approaching frontier via ${t.probeCpa}·${t.probeBloom}.`);
      return "cleared";
    }

    // CLEARED at the frontier itself — climb one cell and reset the struggle count.
    t.consecutiveStruggle = 0;
    const bloomIdx = CLIMB_BLOOM_ORDER.indexOf(t.frontierBloom);
    if (t.frontierBloom === BLOOM_CEILING || bloomIdx === CLIMB_BLOOM_ORDER.length - 1) {
      if (t.frontierCpa === "abstract") {
        t.status = "mastered";
        t.masteredAtSeq = input.seq;
        logTrace(state, `${topic.shortLabel}: Abstract·Analyze cleared → TOPIC MASTERED.`);
      } else {
        const next = stepCpaForward(t.frontierCpa)!;
        t.frontierCpa = next;
        t.frontierBloom = "understand";
        logTrace(state, `${topic.shortLabel}: Bloom ceiling hit at ${input.cpa} → stepping up to ${next}·Understand.`);
      }
    } else {
      t.frontierBloom = CLIMB_BLOOM_ORDER[bloomIdx + 1] ?? "analyze";
      logTrace(state, `${topic.shortLabel}: cleared ${input.cpa}·${input.bloom} → climbing to ${t.frontierCpa}·${t.frontierBloom}.`);
    }
    t.probeCpa = t.frontierCpa;
    t.probeBloom = t.frontierBloom;
    return "cleared";
  }

  // STRUGGLE — drop one cell and probe laterally. The struggle count tracks
  // the frontier, not the scaffolding, so it only resets on a real clear.
  t.cellStatus[cellId({ cpa: input.cpa, bloom: input.bloom })] = "struggled";
  t.consecutiveStruggle += 1;

  // After a second struggle while still below Abstract, run a quick side-probe:
  // can the child compute the identical relationship symbolically? A yes here is
  // the "procedural without conceptual grounding" signature from Section 04 —
  // a CPA-representation gap, distinct from a plain skill gap.
  if (!t.proceduralCheck && t.consecutiveStruggle === 2 && t.frontierCpa !== "abstract") {
    // A fresh question in symbols (new numbers): the same kind of relationship,
    // but nothing the child has just seen, so a right answer can't be recall.
    const abstractItem = findBestItem(input.topicId, "abstract", t.frontierBloom, state);
    if (abstractItem && abstractItem.cpa === "abstract") {
      t.proceduralCheck = {
        itemId: abstractItem.id,
        item: isGenerated(abstractItem) ? abstractItem : undefined,
        subskill: abstractItem.subskill,
        scheduledAtSeq: state.seqCounter + 1,
        presented: false,
        correct: null,
      };
      logTrace(state, `${topic.shortLabel}: queued an Abstract side-probe on the identical relationship to check for a memorized-but-not-understood pattern.`);
    }
  }

  if (t.consecutiveStruggle >= LAG_THRESHOLD) {
    t.status = "lag_point";
    t.lagPoints.push({
      cpa: t.frontierCpa,
      bloom: t.frontierBloom,
      subskill: findBestItem(input.topicId, t.frontierCpa, t.frontierBloom)?.subskill ?? "",
      reason: `No traction after ${LAG_THRESHOLD} questions around ${t.frontierCpa}·${t.frontierBloom}.`,
    });
    logTrace(state, `${topic.shortLabel}: LAG POINT logged at ${t.frontierCpa}·${t.frontierBloom} — moving to a different strand.`);
  } else if (t.probeCpa === "concrete") {
    // Already at the scaffolding floor — there's no lower CPA stage to drop to,
    // so re-asking the identical (concrete, frontierBloom) item would just repeat
    // the same question verbatim. Vary the Bloom level instead, cycling through
    // the concrete row's other authored items so each retry is a different question.
    const rotatedIdx = (BLOOM_ORDER.indexOf(t.frontierBloom) + t.consecutiveStruggle) % BLOOM_ORDER.length;
    t.probeBloom = BLOOM_ORDER[rotatedIdx];
    logTrace(state, `${topic.shortLabel}: struggle at the Concrete floor → varying to ${t.probeCpa}·${t.probeBloom} instead of repeating the same item.`);
  } else {
    t.probeCpa = dropCpa(t.probeCpa);
    t.probeBloom = t.frontierBloom;
    logTrace(state, `${topic.shortLabel}: struggle → dropped to ${t.probeCpa}·${t.probeBloom}, probing laterally.`);
  }

  return "struggle";
}

export function cellKeyLabel(cpa: CPAStage, bloom: BloomLevel) {
  return cellId({ cpa, bloom });
}
