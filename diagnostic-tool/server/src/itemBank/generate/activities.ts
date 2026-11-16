import { Activity, ShareInteraction } from "../../types.js";

/**
 * Marks what a child did in an activity. Returns whether it's right and, if
 * not, which mistake it shows (codes from the topic's MISCONCEPTIONS).
 */
export function checkActivity(activity: Activity, interaction: unknown): { correct: boolean; misconception: string | null } {
  if (activity.kind === "share") return checkShare(activity, interaction as ShareInteraction);
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
