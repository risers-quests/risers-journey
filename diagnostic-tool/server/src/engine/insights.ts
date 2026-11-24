import { isLanguage } from "../itemBank/topics.js";
import { SessionState } from "./state.js";
import { ResponseRecord } from "../sessionStore.js";
import { synthesizeReport, ReportData } from "./synthesis.js";
import { getTopic, topicName } from "../itemBank/index.js";
import { MISCONCEPTIONS } from "../itemBank/generate/index.js";
import { BLOOM_ORDER, CPA_ORDER, BloomLevel, CPAStage } from "../types.js";

/**
 * Insights: one plain reading of a finished test, which every report (the
 * on-site summary, the child's email, the staff email) is drawn from, so
 * they never disagree.
 *
 * A topic's status combines the skill engine's diagnosis with how sure the
 * child was ("How sure are you?" on every question):
 *   secure      mastered, and mostly sure when right
 *   fragile     mastered but often unsure, or "procedural, not conceptual"
 *   gap         a real skill gap
 *   notReached  held back by a gap it depends on
 * Confidence is read with right/wrong, never as anxiety: sure + wrong is a
 * firm misconception (the child doesn't know they're wrong).
 */

export type TopicStatus = "secure" | "fragile" | "gap" | "notReached";

export interface Confidence {
  sureRight: number;
  unsureRight: number;
  sureWrong: number;
  unsureWrong: number;
}

export interface TopicInsight {
  topicId: string;
  name: string;
  strand: string;
  status: TopicStatus;
  /** Why, in a few words, for staff. */
  why: string;
  confidence: Confidence;
  questions: number;
  /** The CPA x Bloom grid: "cleared" | "struggled" | "" per cell, CPA rows (concrete, pictorial, abstract) x Bloom columns. */
  grid: string[][];
  mistakes: { label: string; detail: string; childTip: string; count: number; sureCount: number }[];
  /** Where to start reteaching (gap/fragile), e.g. "concrete" — the stage the child got stuck at or below. */
  startAt: CPAStage | null;
  blockedBy: string[];
}

export interface Insights {
  childName: string;
  /** "Maths" or "English". */
  subject: string;
  date: string;
  strands: string[];
  questionCount: number;
  durationMinutes: number;
  topics: TopicInsight[];
  overall: Confidence;
  /** Staff: at most three things to do next, most important first. */
  actions: { topic: string; what: string; how: string }[];
  /** Child: the topic to learn next, one tip in kid language, and an everyday idea for parents. */
  nextForChild: { topic: string; tip: string; atHome: string } | null;
  anxiety: ReportData["mathAnxiety"];
}

/** Everyday things a parent can do at home, per topic (plain words, no school jargon). */
const AT_HOME: Record<string, string> = {
  "more-large-numbers": "Read big numbers aloud together: prices in an advert, a car's cost, a city's population. Ask which is bigger, and by how much.",
  "operations-large-numbers": "Add up a shopping bill together before the cashier does, then check who was right.",
  "g5-add": "Add up a shopping bill together before the cashier does, then check who was right.",
  "g5-sub": "Work out change together when paying in a shop: if we pay ₹2,000 for ₹1,365, what do we get back?",
  "g5-mult": "Work out costs together: 12 notebooks at ₹45 each, or a month's milk at ₹68 a day.",
  "g5-div": "Share costs together: a ₹1,560 bill split among 4 people, or how many ₹50 notes make ₹2,350.",
  "factors-multiples": "Arrange biscuits or coins into equal rows. How many different ways can 24 be laid out?",
  "fractions-division": "Share rotis, a pizza or a cake at dinner: if 3 rotis are shared by 4 people, how much does each get? Let them do the cutting.",
  "four-operations-fractions": "Cook with measuring cups: half a cup and a quarter cup together make how much?",
  "decimals": "Read prices with paise or a ruler's centimetres and millimetres together; compare 2.5 and 2.35.",
  "geometry": "Spot right angles and triangles around the house; fold paper to make angles.",
  "measurement": "Weigh and measure together in the kitchen: grams on a packet, millilitres in a bottle.",
  "perimeter-area": "Measure a room or table with steps or a tape: how far around it, and how many tiles would cover it?",
  "volume-nets": "Unfold an empty box to see its flat shape, then build boxes from small blocks.",
  "time-temperature": "Plan the day with the clock: if we leave at 4:15 and it takes 50 minutes, when do we arrive?",
  "life-mathematics": "Look at discounts in shops: what does 20% off a ₹500 shirt really cost?",
  "scales-directions": "Use a map or a phone map together: which way is north, and how far is it really?",
  "data-handling": "Keep a tally for a week (weather, steps, screen time) and draw a bar chart together.",
  "patterns-symmetry": "Look for patterns in rangoli, tiles or fabric; draw half a picture and let them mirror it.",
};

const STAGE_WORDS: Record<CPAStage, string> = {
  concrete: "real objects (cutting, sharing, counting)",
  pictorial: "pictures and bar models",
  abstract: "numbers and symbols",
};

/** English stages, as staff read them. */
const STAGE_WORDS_EN: Record<CPAStage, string> = {
  concrete: "hands-on work with real sentences (marking words, building sentences from cards)",
  pictorial: "marked-up sentences and passages",
  abstract: "the rule and the terms on their own",
};

const SHORT_STAGE_EN: Record<CPAStage, string> = { concrete: "hands-on", pictorial: "marked-sentence", abstract: "rule-only" };
const SHORT_STAGE: Record<CPAStage, string> = { concrete: "real-object", pictorial: "picture", abstract: "numbers-only" };

function emptyConfidence(): Confidence {
  return { sureRight: 0, unsureRight: 0, sureWrong: 0, unsureWrong: 0 };
}
function addConfidence(c: Confidence, r: ResponseRecord) {
  const sure = r.pulse === "sure";
  if (r.correct) sure ? c.sureRight++ : c.unsureRight++;
  else sure ? c.sureWrong++ : c.unsureWrong++;
}

export function buildInsights(state: SessionState, responses: ResponseRecord[], childName: string, grade: string, createdAt: string): Insights {
  const report = synthesizeReport(state, responses, childName, grade, createdAt);
  const overall = emptyConfidence();
  const topics: TopicInsight[] = report.topics.map((t) => {
    const rs = responses.filter((r) => r.topic_id === t.topicId && !r.is_procedural_check);
    const conf = emptyConfidence();
    rs.forEach((r) => addConfidence(conf, r));
    responses.filter((r) => r.topic_id === t.topicId).forEach((r) => addConfidence(overall, r));
    const right = conf.sureRight + conf.unsureRight;
    const unsureShare = right ? conf.unsureRight / right : 0;

    // Mistakes, with how many were made while "sure".
    const mistakes = new Map<string, { count: number; sureCount: number }>();
    for (const r of responses) {
      if (r.topic_id !== t.topicId || r.correct || !r.misconception || !MISCONCEPTIONS[r.misconception]) continue;
      const m = mistakes.get(r.misconception) ?? { count: 0, sureCount: 0 };
      m.count++;
      if (r.pulse === "sure") m.sureCount++;
      mistakes.set(r.misconception, m);
    }
    const mistakeList = [...mistakes.entries()]
      .sort((a, b) => b[1].sureCount - a[1].sureCount || b[1].count - a[1].count)
      .map(([code, m]) => ({ ...MISCONCEPTIONS[code], ...m }));

    const engine = state.topics[t.topicId];
    const grid = CPA_ORDER.map((cpa) => BLOOM_ORDER.map((bloom) => engine?.cellStatus[`${cpa}:${bloom}`] ?? ""));
    // The "knows the steps, not the idea" check is a numbers-only question
    // asked off the ladder: show it in the grid too, so the grid agrees
    // with the result it led to.
    for (const r of responses) {
      if (r.topic_id !== t.topicId || !r.is_procedural_check) continue;
      const row = CPA_ORDER.indexOf(r.cpa as CPAStage);
      const col = BLOOM_ORDER.indexOf(r.bloom as BloomLevel);
      if (row >= 0 && col >= 0 && !grid[row][col]) grid[row][col] = r.correct ? "cleared" : "struggled";
    }
    const lag = engine?.lagPoints[0];
    const startAt: CPAStage | null =
      t.tag === "skill_gap" ? (lag ? (CPA_ORDER[Math.max(0, CPA_ORDER.indexOf(lag.cpa) - 1)] as CPAStage) : "concrete") :
      t.tag === "procedural_not_conceptual" ? "pictorial" : null;

    let status: TopicStatus;
    let why: string;
    if (t.tag === "not_yet_reached") {
      status = "notReached";
      why = "Waits for a topic it builds on";
    } else if (t.tag === "skill_gap") {
      status = "gap";
      why = lag ? `Stuck on ${(isLanguage(state.subject) ? SHORT_STAGE_EN : SHORT_STAGE)[lag.cpa]} questions, at ${bloomLabel(lag.bloom)}` : "Couldn't get going";
    } else if (t.tag === "procedural_not_conceptual") {
      status = "fragile";
      why = isLanguage(state.subject) ? "Right in rules, not in real sentences: knows the rule, not how it works" : "Right in numbers, not in pictures: knows the steps, not the idea";
    } else if (unsureShare >= 0.4) {
      status = "fragile";
      why = `Mastered, but unsure on ${conf.unsureRight} of ${right} right answers`;
    } else {
      status = "secure";
      why = "Mastered with confidence";
    }

    return {
      topicId: t.topicId,
      name: t.name,
      strand: t.strand,
      status,
      why,
      confidence: conf,
      questions: rs.length,
      grid,
      mistakes: mistakeList,
      startAt,
      blockedBy: status === "notReached" ? getTopic(t.topicId).dependsOn.filter((d) => state.topics[d]).map((d) => topicName(d, state.grade)) : [],
    };
  });

  // What matters most, in one order used by staff actions and the child's
  // "next": real gaps (in book order, since later topics wait on them), then
  // "knows the steps, not the idea", then mastered-but-unsure; confident
  // mistakes ("sure but wrong") rank a topic higher within its group.
  const isProcedural = (t: TopicInsight) => t.why.startsWith("Right in ");
  const rank = (t: TopicInsight) =>
    (t.status === "gap" ? 0 : isProcedural(t) ? 10 : 20) - (t.confidence.sureWrong > 0 ? 5 : 0);
  const priority = topics
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t.status === "gap" || t.status === "fragile")
    .sort((x, y) => rank(x.t) - rank(y.t) || x.i - y.i)
    .map(({ t }) => t);

  const actions: Insights["actions"] = priority.map((t) => {
    const m = t.mistakes[0];
    if (t.status === "gap") {
      return {
        topic: t.name,
        what: m ? `Reteach lesson. Fix: ${m.label.toLowerCase()}${m.sureCount ? ` (made ${m.sureCount}× while sure)` : ""}.` : "Reteach lesson, from the start of the topic.",
        how: `Start with ${(isLanguage(report.subject) ? STAGE_WORDS_EN : STAGE_WORDS)[t.startAt ?? "concrete"]}, then move up.`,
      };
    }
    return isProcedural(t)
      ? { topic: t.name, what: `Meaning lesson: connect the method to what it means${m ? `. Fix: ${m.label.toLowerCase()}` : ""}.`, how: isLanguage(report.subject) ? "Have them mark the parts of real sentences from their reader and say why each is right." : "Have them draw or build each sum they can already calculate." }
      : { topic: t.name, what: "Confidence practice: they get it right but aren't sure.", how: "Short mixed practice; ask them to explain answers aloud." };
  });

  const first = priority[0];
  const tip = first?.mistakes[0]?.childTip;
  return {
    childName,
    subject: report.subject,
    date: new Date(createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    strands: report.strands,
    questionCount: report.questionCount,
    durationMinutes: report.durationMinutes,
    topics,
    overall,
    actions: actions.slice(0, 3),
    nextForChild: first ? { topic: first.name, tip: tip ?? "We'll practise this together, step by step.", atHome: AT_HOME[first.topicId] ?? (isLanguage(report.subject) ? "Read together for ten minutes a day, and talk about what you read: who, why, and what you'd have done." : "Talk about where this maths shows up in everyday life.") } : null,
    anxiety: report.mathAnxiety,
  };
}

export function bloomLabel(b: BloomLevel) {
  return b[0].toUpperCase() + b.slice(1);
}
