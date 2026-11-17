export type CPAStage = "concrete" | "pictorial" | "abstract";
export type BloomLevel = "remember" | "understand" | "apply" | "analyze" | "evaluate";

export const BLOOM_ORDER: BloomLevel[] = ["remember", "understand", "apply", "analyze", "evaluate"];
export const CPA_ORDER: CPAStage[] = ["concrete", "pictorial", "abstract"];
export const BLOOM_CEILING: BloomLevel = "analyze";
export const ENTRY_CPA: CPAStage = "pictorial";
export const ENTRY_BLOOM: BloomLevel = "understand";

export interface BarModelSpec {
  kind: "bar-model";
  totalLabel: string;
  parts: number;
  highlightParts?: number;
  queryPartIndex?: number;
  segmentLabels?: string[];
  /**
   * For questions that combine two separate portions of the same whole
   * (e.g. "Raj eats 2/6, Mia eats 1/6 — how much together?"). Each entry
   * gets its own highlight color, in order, filling from the start of the
   * bar; any parts left over after all groups are unshaded. Takes priority
   * over highlightParts when present, since a single undifferentiated
   * highlight can't show two people's shares separately.
   */
  highlightGroups?: { count: number; label: string }[];
}

export interface ConcreteSpec {
  kind: "concrete";
  icon: string;
  itemCount: number;
  groups: number;
  groupLabel: string;
  /**
   * For questions describing a mixed collection (e.g. "3/8 red, 2/8 blue
   * marbles in one bag") where a single repeated icon can't show the
   * different subsets. Takes priority over icon/itemCount/groups when
   * present.
   */
  segments?: { icon: string; count: number; label: string }[];
  /** Pictograph key shown under the rows, e.g. "Each 💧 = 10 mm of rain". */
  key?: string;
}

export interface NumberLineSpec {
  kind: "number-line";
  min: number;
  max: number;
  step: number;
  markers: { value: number; label: string }[];
  /** Label only every nth tick (ends always labelled), so long numbers don't crowd. */
  labelEvery?: number;
  /** Shades a sub-range of the line, e.g. to show "between 4,000 and 5,000" while rounding. */
  highlightRange?: [number, number];
}

export interface GridSpec {
  kind: "grid";
  rows: number;
  cols: number;
  unitLabel?: string;
  /** Shades this many cells in reading order from the top-left — for area/array/factor-pair models. */
  shadedCells?: number;
  /** Named points on the grid (1-indexed row/col) — for simple coordinate/map-style items. */
  markers?: { row: number; col: number; label: string }[];
  /** Squares no bigger than about 44px (arrays with few squares), instead of filling the width. */
  compact?: boolean;
}

export type ShapeKind = "triangle" | "right-triangle" | "rectangle" | "square" | "circle" | "pentagon" | "parallelogram" | "right-trapezium";

export interface ShapeSpec {
  kind: "shape";
  shape: ShapeKind;
  sideLabels?: string[];
  angleLabels?: string[];
  note?: string;
}

export interface SharingSpec {
  /** Concrete sharing: `wholes` real objects, each cut into `people` equal slices; slice i of every object is person i's. */
  kind: "sharing";
  wholes: number;
  people: number;
  itemName: string;
  peopleLabel: string;
}

/**
 * Hands-on activities (the concrete stage, on screen). The child does
 * something (cuts and shares, builds a number, tiles an area); with
 * answerBy "activity" what they did *is* the answer and is marked by the
 * server; otherwise it comes before choosing an option.
 */
export interface ShareActivity {
  kind: "share";
  /** "share": the things and people are given; "build": the child chooses how many of each to make the fraction wholes/people. */
  mode: "share" | "build";
  wholes: number;
  people: number;
  itemOne: string;
  itemMany: string;
  personOne: string;
  peopleLabel: string;
}
/**
 * Hands-on grouping (Grade 4 Factors and Multiples): drag things (apples)
 * from a pile into baskets, or tap a basket to drop one in. No numbers on
 * screen: the child sees groups, not counters.
 *   "equal": share all `items` into `baskets` baskets as equally as possible
 *            (what can't be shared stays in the pile);
 *   "size":  put `size` in each basket, using as many baskets as needed;
 *   "find":  choose how many baskets so all `items` share out equally with
 *            none left, but not 1 basket, not 1 in each, and not `avoid`.
 */
export interface GroupActivity {
  kind: "group";
  mode: "equal" | "size" | "find";
  items: number;
  icon: string;
  itemMany: string;
  basketOne: string;
  /** Plural of basketOne, when it isn't just + "s" (e.g. "children"). */
  basketMany?: string;
  /** The container's picture (default a basket); "" for none (e.g. rows of tiles). */
  basketIcon?: string;
  /** "equal": how many baskets. */
  baskets?: number;
  /** "size": how many go in each basket; "size" shows this many empty baskets to fill. */
  size?: number;
  maxBaskets?: number;
  /** "find": basket counts that don't count as a new answer (e.g. one already shown). */
  avoid?: number[];
}

/** What the child did with the apples: how many in each basket (the rest stayed in the pile). */
export interface GroupInteraction {
  baskets: number[];
}

/**
 * Hands-on shading (Grade 8 percent, profit, interest): tap a square to
 * shade every square up to it, or use − / + one at a time. What is shaded
 * is the answer: `target` squares. `unit` says what one square is worth.
 */
export interface ShadeActivity {
  kind: "shade";
  rows: number;
  cols: number;
  target: number;
  unit?: string;
  /** Number the squares 1, 2, 3 … (e.g. the natural numbers in an inequation). */
  numbered?: boolean;
  /**
   * "fill" (default): tap a square to shade every square up to it; the
   * answer is how many. "free": tap any square on or off; the answer is
   * exactly which squares (targetCells, as indices in reading order).
   */
  mode?: "fill" | "free";
  /** free: squares already shaded at the start, which can't be changed. */
  given?: number[];
  targetCells?: number[];
  /** free: patterns that typical mistakes would give. */
  wrongSets?: { cells: number[]; mistake: string }[];
  /** free: a mirror line drawn on the grid (through the middle; "diagonal" is top-left to bottom-right). */
  mirror?: "vertical" | "horizontal" | "diagonal";
  /** free: a dot at the centre of the grid (turning). */
  centre?: boolean;
  /** Results of known mistakes, so a wrong amount is named. */
  wrong?: { value: number; mistake: string }[];
}

/** What the child shaded: how many squares. */
export interface ShadeInteraction {
  shaded: number;
  /** free mode: the squares shaded (given ones included). */
  cells?: number[];
}

export type Activity = ShareActivity | PlaceValueActivity | GroupActivity | ShadeActivity;

/** Hands-on place-value chart: tap + / − to put discs in columns; exchange 10 for 1 next door. */
export interface PlaceValueActivity {
  kind: "place-value";
  /** "build": make target from nothing; "regroup": rearrange the starting discs into 9-or-fewer per column, same number; "change": change the starting number into target. */
  mode: "build" | "regroup" | "change";
  /** Place value of each column, largest first (e.g. 100000 … 1). */
  columns: number[];
  start: number[];
  target: number;
  /** Results of known mistakes, so a wrong attempt is named (e.g. added without carrying). */
  wrong?: { value: number; mistake: string }[];
}

/** What the child did on a place-value chart: discs per column. */
export interface PlaceValueInteraction {
  counts: number[];
}

/** What the child did in a share activity. */
export interface ShareInteraction {
  wholes: number;
  people: number;
  slices: number;
  plates: number[];
  leftover: number;
}

export interface PlaceValueChartSpec {
  /** Pictorial: discs drawn in labelled place-value columns (values only in the column headers). */
  kind: "place-value-chart";
  columns: { label: string; count: number }[];
}

export interface BarsSpec {
  /** Bar model drawn to scale: one or more bars of parts (widths proportional to value); "ghost" parts are dashed (a difference); brace labels the whole of the first bar. */
  kind: "bars";
  bars: { name: string; parts: { value: number; label: string; ghost?: boolean }[] }[];
  brace?: { label: string };
}

/**
 * Geometry pictures (Grade 8): a polygon (regular or not, optionally the
 * triangles from one corner), a special quadrilateral (optionally with its
 * diagonals), a 3-D solid drawn in 2-D with hidden edges dashed, or a circle
 * with one part highlighted.
 */
export interface FigureSpec {
  kind: "figure";
  figure: "polygon" | "quad" | "solid" | "circle" | "pie" | "venn";
  /** venn: what is written in each region (elements, or a count), and which region is shaded. */
  venn?: { onlyA: string[]; both: string[]; onlyB: string[]; outside: string[]; shade?: "A" | "B" | "both" | "either" | "notA" | "onlyA" | "neither" };
  /** pie (a pie chart or a spinner): slices in order, sizes by value; label written in each. */
  slices?: { value: number; label: string }[];
  /** polygon */
  sides?: number;
  regular?: boolean;
  fan?: boolean;
  /** quad */
  quad?: "parallelogram" | "rectangle" | "rhombus" | "square" | "kite" | "trapezium" | "general" | "house";
  /** quad: a dashed height from the first corner down to the base, with this label. */
  heightLabel?: string;
  diagonals?: boolean;
  /** Halves of the diagonals from the corners to where they cross: [A, B, C, D] to O. */
  diagonalLabels?: string[];
  /** polygon / quad: labels at each corner (inside) and on each side (outside), in order. */
  angleLabels?: string[];
  sideLabels?: string[];
  vertexLabels?: string[];
  /** solid */
  solid?: "cube" | "cuboid" | "triangular-prism" | "pentagonal-prism" | "hexagonal-prism" | "square-pyramid" | "tetrahedron" | "pentagonal-pyramid" | "cylinder";
  /** circle: the part drawn and highlighted. */
  part?: "radius" | "diameter" | "chord" | "arc" | "sector" | "segment" | "two-chords" | "semicircle";
  /** circle: a length written on the highlighted part. */
  partLabel?: string;
  note?: string;
}

export type Representation = BarModelSpec | ConcreteSpec | SharingSpec | PlaceValueChartSpec | BarsSpec | NumberLineSpec | GridSpec | ShapeSpec | FigureSpec | null;

export interface Choice {
  id: string;
  text: string;
}

export interface Item {
  id: string;
  topicId: string;
  cpa: CPAStage;
  bloom: BloomLevel;
  subskill: string;
  prompt: string;
  representation: Representation;
  choices: Choice[];
  correctChoiceId: string;
  /** A hands-on activity (concrete stage). */
  activity?: Activity;
  /** "activity": the activity is the answer (no options); otherwise the options are. */
  answerBy?: "choice" | "activity";
}

export interface Topic {
  id: string;
  strand: string;
  name: string;
  shortLabel: string;
  dependsOn: string[];
  /** The Grade 4 book's own name for this chapter, where it differs. */
  grade4Name?: string;
  /** Set for a topic from another grade's book only (e.g. 8): never part of a Grade 5 strand test. */
  grade?: number;
}

export type DiagnosisTag = "mastered" | "skill_gap" | "procedural_not_conceptual" | "not_yet_reached";

export interface CellKey {
  cpa: CPAStage;
  bloom: BloomLevel;
}

export function cellId(cell: CellKey): string {
  return `${cell.cpa}:${cell.bloom}`;
}
