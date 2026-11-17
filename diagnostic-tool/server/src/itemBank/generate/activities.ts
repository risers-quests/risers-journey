import { Activity, GroupInteraction, PlaceValueInteraction, ShadeInteraction, ShareInteraction } from "../../types.js";
import { dropZeros } from "./moreOnLargeNumbers.js";

/**
 * Marks what a child did in an activity. Returns whether it's right and, if
 * not, which mistake it shows (codes from the topic's MISCONCEPTIONS).
 */
export function checkActivity(activity: Activity, interaction: unknown): { correct: boolean; misconception: string | null } {
  if (activity.kind === "share") return checkShare(activity, interaction as ShareInteraction);
  if (activity.kind === "place-value") return checkPlaceValue(activity, interaction as PlaceValueInteraction);
  if (activity.kind === "group") return checkGroup(activity, interaction as GroupInteraction);
  if (activity.kind === "shade" && activity.mode === "free") {
    const raw = (interaction as ShadeInteraction)?.cells;
    if (!Array.isArray(raw)) return { correct: false, misconception: null };
    const key = (cells: number[]) => [...new Set([...cells.map((c) => Math.floor(Number(c))), ...(activity.given ?? [])])].sort((a, b) => a - b).join(",");
    const got = key(raw);
    if (got === key(activity.targetCells ?? [])) return { correct: true, misconception: null };
    return { correct: false, misconception: activity.wrongSets?.find((w) => key(w.cells) === got)?.mistake ?? null };
  }
  if (activity.kind === "shade") {
    const v = Math.floor(Number((interaction as ShadeInteraction)?.shaded));
    if (!Number.isFinite(v)) return { correct: false, misconception: null };
    if (v === activity.target) return { correct: true, misconception: null };
    return { correct: false, misconception: activity.wrong?.find((w) => w.value === v)?.mistake ?? null };
  }
  return { correct: false, misconception: null };
}

function checkShare(a: Extract<Activity, { kind: "share" }>, it: ShareInteraction): { correct: boolean; misconception: string | null } {
  if (!it || !Array.isArray(it.plates) || !(it.slices >= 1)) return { correct: false, misconception: null };
  const plates = it.plates.map((n) => Math.max(0, Math.floor(Number(n) || 0)));
  const wholes = a.mode === "build" ? Math.floor(Number(it.wholes) || 0) : a.wholes;
  const people = a.mode === "build" ? Math.floor(Number(it.people) || 0) : a.people;
  if (wholes < 1 || people < 1 || plates.length !== people) return { correct: false, misconception: null };
  const pieces = wholes * it.slices;
  const dealt = plates.reduce((s, n) => s + n, 0);
  const leftover = pieces - dealt;
  const equal = plates.every((n) => n === plates[0]);

  if (a.mode === "build") {
    const rightFraction = wholes * a.people === a.wholes * people;
    const flipped = wholes * a.wholes === a.people * people && a.wholes !== a.people;
    if (!rightFraction) return { correct: false, misconception: flipped ? "fd-flips" : null };
  }
  if (leftover > 0) return { correct: false, misconception: "fd-whole-part-only" };
  if (!equal) return { correct: false, misconception: "fd-unequal-shares" };
  return { correct: true, misconception: null };
}

/** True when the activity has been done enough to choose an option (for "do, then choose" questions). */
export function activityStarted(it: ShareInteraction | undefined): boolean {
  return !!it && it.plates.some((n) => n > 0);
}

function checkPlaceValue(a: Extract<Activity, { kind: "place-value" }>, it: PlaceValueInteraction): { correct: boolean; misconception: string | null } {
  if (!it || !Array.isArray(it.counts) || it.counts.length !== a.columns.length) return { correct: false, misconception: null };
  const counts = it.counts.map((n) => Math.max(0, Math.floor(Number(n) || 0)));
  const v = counts.reduce((s, c, i) => s + c * a.columns[i], 0);
  const t = a.target;
  if (a.mode === "regroup") {
    if (v !== t) return { correct: false, misconception: "lnum-changes-value" };
    if (counts.some((c) => c > 9)) return { correct: false, misconception: "lnum-no-regroup" };
    return { correct: true, misconception: null };
  }
  if (v === t) return { correct: true, misconception: null };
  // The template listed what typical mistakes would give.
  if (a.wrong) return { correct: false, misconception: a.wrong.find((w) => w.value === v)?.mistake ?? null };
  if (a.mode === "build") {
    if (v === dropZeros(t)) return { correct: false, misconception: "lnum-drops-zero" };
    if (v === t * 10 || v * 10 === t) return { correct: false, misconception: "lnum-shifts-place" };
    return { correct: false, misconception: null };
  }
  // change: added p (= target - start) to the start number
  const from = a.start.reduce((s, c, i) => s + c * a.columns[i], 0);
  const p = t - from;
  if (v === from + p * 10 || v * 10 === from * 10 + p) return { correct: false, misconception: "lnum-wrong-column" };
  if (v === t - 10 * p) return { correct: false, misconception: "lnum-forgets-carry" };
  return { correct: false, misconception: null };
}

/** Grouping apples into baskets (Grade 4 Factors and Multiples). */
export function checkGroup(a: Extract<Activity, { kind: "group" }>, it: GroupInteraction): { correct: boolean; misconception: string | null } {
  if (!it || !Array.isArray(it.baskets)) return { correct: false, misconception: null };
  const b = it.baskets.map((n) => Math.max(0, Math.floor(Number(n) || 0)));
  const placed = b.reduce((s, n) => s + n, 0);
  if (placed > a.items) return { correct: false, misconception: null };
  const left = a.items - placed;
  if (a.mode === "equal") {
    const k = a.baskets ?? b.length;
    if (b.length !== k) return { correct: false, misconception: null };
    if (!b.every((n) => n === b[0])) return { correct: false, misconception: "fm-unequal-groups" };
    if (left >= k) return { correct: false, misconception: "fm-stops-early" };
    return { correct: true, misconception: null };
  }
  if (a.mode === "size") {
    const size = a.size ?? 1;
    const used = b.filter((n) => n > 0);
    if (used.some((n) => n !== size)) return { correct: false, misconception: "fm-unequal-groups" };
    if (left >= size) return { correct: false, misconception: "fm-stops-early" };
    return { correct: true, misconception: null };
  }
  // find: all shared equally, none left, a real new grouping
  const used = b.filter((n) => n > 0);
  if (left > 0) return { correct: false, misconception: used.length && used.every((n) => n === used[0]) ? "fm-not-a-factor" : "fm-stops-early" };
  if (!used.every((n) => n === used[0])) return { correct: false, misconception: "fm-unequal-groups" };
  if (used.length <= 1 || used[0] === 1 || (a.avoid ?? []).includes(used.length)) return { correct: false, misconception: "fm-trivial-grouping" };
  return { correct: true, misconception: null };
}

/** True when some apples have been moved (for "try it, then choose" questions). */
export function groupStarted(it: GroupInteraction | undefined): boolean {
  return !!it && Array.isArray(it.baskets) && it.baskets.some((n) => n > 0);
}
