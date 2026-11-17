export type CPAStage = "concrete" | "pictorial" | "abstract";
export type BloomLevel = "remember" | "understand" | "apply" | "analyze" | "evaluate";

export interface BarModelSpec {
  kind: "bar-model";
  totalLabel: string;
  parts: number;
  highlightParts?: number;
  queryPartIndex?: number;
  segmentLabels?: string[];
  highlightGroups?: { count: number; label: string }[];
}

export interface ConcreteSpec {
  kind: "concrete";
  icon: string;
  itemCount: number;
  groups: number;
  groupLabel: string;
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
  /** Label only every nth tick (ends always labelled). */
  labelEvery?: number;
  highlightRange?: [number, number];
}

export interface GridSpec {
  kind: "grid";
  rows: number;
  cols: number;
  unitLabel?: string;
  shadedCells?: number;
  markers?: { row: number; col: number; label: string }[];
  /** Squares no bigger than about 44px (arrays with few squares), instead of filling the width. */
  compact?: boolean;
  /** Colour exactly these squares (index = row × cols + col), for shapes that aren't filled in reading order. */
  cells?: number[];
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


/** Figures drawn on cards (Grade 4 Shapes), lettered A, B, C… */
export type FigureKind =
  | "open-curve" | "closed-curve" | "open-zigzag" | "open-v"
  | "triangle" | "square" | "rectangle" | "pentagon" | "hexagon" | "circle" | "oval"
  | "line" | "ray" | "segment"
  | "circle-radius" | "circle-diameter" | "circle-chord" | "circle-arc"
  | "net-cube-cross" | "net-cube-t" | "net-cube-steps" | "net-cube-z"
  | "net-not-row" | "net-not-square" | "net-not-l";

/** Pizzas cut into equal slices, some coloured (Grade 4 Fractions). */
export interface PieSpec {
  kind: "pie";
  pies: { slices: number; shaded: number; label?: string }[];
}

/** Figure cards, lettered in order (Grade 4 Shapes). */
export interface FiguresSpec {
  kind: "figures";
  items: { id: string; figure: FigureKind }[];
}

/** Colour slices of a pizza: cut it (unless `slices` is set), then tap slices to colour them. */
export interface PizzaActivity {
  kind: "pizza";
  pies: number;
  /** Fixed number of slices per pizza; null: the child chooses how to cut. */
  slices: number | null;
  /** The fraction to colour (equivalent fractions count as right). */
  target: { n: number; d: number };
  /** Fractions that typical mistakes would colour, so a wrong attempt is named. */
  wrong?: { n: number; d: number; mistake: string }[];
}
export interface PizzaInteraction {
  slices: number;
  coloured: number[];
}

/** Tap squares on a grid to colour them (Grade 4). */
export interface TilesActivity {
  kind: "tiles";
  rows: number;
  cols: number;
  /** "count": colour `target` squares; "rectangle": colour a rectangle of area `target` (and perimeter `perimeter`, if set). */
  mode: "count" | "rectangle";
  target: number;
  perimeter?: number;
  /** Squares coloured to start with (e.g. a shape to measure); they can't be changed. */
  given?: number[];
  wrong?: { value: number; mistake: string }[];
}
export interface TilesInteraction {
  cells: number[];
}

/** Tap the figure cards that fit the question. */
export interface PickActivity {
  kind: "pick";
  items: { id: string; figure: FigureKind }[];
  correct: string[];
  missMistake?: string;
  extraMistake?: string;
}
export interface PickInteraction {
  picked: string[];
}

/** Put weights on a scale, sticks along a line or jugs of water together to make an amount. */
export interface MeasureActivity {
  kind: "measure";
  what: "mass" | "length" | "capacity" | "discs";
  /** The smallest unit everything is counted in (g, cm or mL). */
  unit: string;
  pieces: { value: number; label: string }[];
  target: number;
  wrong?: { value: number; mistake: string }[];
}
export interface MeasureInteraction {
  counts: number[];
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


/**
 * English (Grade 8): a passage or sentences, as a picture of the language.
 * In each line, [[words]] are highlighted and ___ is a blank to fill.
 */
export interface TextSpec {
  kind: "text";
  lines: string[];
  /** A small label above the card, e.g. "Rahul said:" or the poem's title. */
  caption?: string;
}

/**
 * English hands-on: tap words in a sentence to mark them (the verb, the
 * dependent clause, where a comma goes). What is marked is the answer:
 * exactly the `target` words (indices into `tokens`).
 */
export interface WordsActivity {
  kind: "words";
  tokens: string[];
  target: number[];
  /** Other markings that are also right (e.g. "by him" as well as "him"). */
  alsoRight?: number[][];
  /** Patterns that typical mistakes would mark, so a wrong attempt is named. */
  wrongSets?: { cells: number[]; mistake: string }[];
}
export interface WordsInteraction {
  picked: number[];
}

/**
 * English hands-on: build a sentence from word tiles, in order. Spare tiles
 * (a wrong tense, "were" for "was") let a mistake show in what is built.
 * The answer is the built sentence, compared as text.
 */
export interface OrderActivity {
  kind: "order";
  tiles: string[];
  answers: string[];
  wrong?: { text: string; mistake: string }[];
  /** Word parts (re + write): the tiles join with no space, into one word. */
  glue?: boolean;
}
export interface OrderInteraction {
  order: number[];
}

export type Activity = WordsActivity | OrderActivity | ShareActivity | PlaceValueActivity | GroupActivity | ShadeActivity | PizzaActivity | TilesActivity | PickActivity | MeasureActivity;

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


export type Representation = TextSpec | BarModelSpec | ConcreteSpec | SharingSpec | PlaceValueChartSpec | BarsSpec | NumberLineSpec | GridSpec | ShapeSpec | FigureSpec | PieSpec | FiguresSpec | null;

export interface ClientChoice {
  id: string;
  text: string;
}

export interface ClientItem {
  id: string;
  topicId: string;
  cpa: CPAStage;
  bloom: BloomLevel;
  subskill: string;
  prompt: string;
  representation: Representation;
  choices: ClientChoice[];
  activity?: Activity;
  answerBy?: "choice" | "activity";
}

export interface GridCellView {
  cpa: string;
  bloom: string;
  status: "cleared" | "current" | "back-probe" | "untested";
}

export interface SessionMapEntry {
  topicId: string;
  name: string;
  status: string;
}

export interface NextQuestionResponse {
  done: boolean;
  nextPhase?: "anxiety_questionnaire" | "completed";
  phase?: "warmup" | "assessment" | "completed";
  seq?: number;
  questionNumber?: number;
  maxQuestions?: number;
  topicNumber?: number;
  topicCount?: number;
  isProceduralCheck?: boolean;
  breadcrumb?: string;
  topicName?: string;
  item?: ClientItem;
  grid?: GridCellView[];
  sessionMap?: SessionMapEntry[];
  engineTrace?: string[];
}

export interface AnswerResponse {
  correct: boolean;
  outcome: string;
  phase: string;
  totalQuestions: number;
  maxQuestions: number;
}

export interface AnxietyQuestion {
  id: string;
  text: string;
}

export type AnxietyLevel = "low" | "moderate" | "elevated";

export interface MathAnxietyResult {
  answered: boolean;
  overallScore: number;
  maxScore: number;
  level: AnxietyLevel;
  numericalScore: number;
  situationalScore: number;
  factorMax: number;
}

export type DiagnosisTag = "mastered" | "skill_gap" | "procedural_not_conceptual" | "not_yet_reached";

export interface TopicDiagnosis {
  topicId: string;
  name: string;
  strand: string;
  bloomCeiling: BloomLevel | null;
  tag: DiagnosisTag;
  cpaGapNote: string;
  evidence: string[];
  recommendation: string;
  mistakes?: { code: string; label: string; detail: string; count: number }[];
}

export interface ReportData {
  childName: string;
  grade: string;
  subject?: string;
  assessedAt: string;
  questionCount: number;
  durationMinutes: number;
  headline: string;
  subheadline: string;
  summary: { mastered: number; skillGap: number; proceduralNotConceptual: number; total: number };
  strands?: string[];
  assumedPrerequisites?: string[];
  bloomByStrand: { strand: string; assessed: boolean; deepest: BloomLevel | null }[];
  topics: TopicDiagnosis[];
  mathAnxiety: MathAnxietyResult;
  glossary: { tag: string; label: string; description: string }[];
}

export interface SessionStatus {
  sessionId: string;
  childName: string;
  phase: "warmup" | "assessment" | "anxiety_questionnaire" | "completed";
  questionsAnswered: number;
  topicNumber: number;
  topicCount: number;
  strands: string[];
  subject?: string;
  startedAt: string;
}
