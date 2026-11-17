/**
 * Writing algebra the way the book prints it: terms joined with + and −
 * (a real minus sign), coefficients of 1 left out (x, not 1x), zero terms
 * dropped, powers as superscripts (x²).
 */

/** One term: coefficient and the letters part ("x²", "xy", "" for a number). */
export type Term = [number, string];

function one(c: number, v: string, first: boolean): string {
  const sign = c < 0 ? (first ? "−" : " − ") : first ? "" : " + ";
  const a = Math.abs(c);
  const body = v ? (a === 1 ? v : `${a}${v}`) : String(a);
  return sign + body;
}

/** "3x² − 2x + 5" from [[3, "x²"], [-2, "x"], [5, ""]]. */
export function expr(terms: Term[]): string {
  const t = terms.filter(([c]) => c !== 0);
  if (!t.length) return "0";
  return t.map(([c, v], i) => one(c, v, i === 0)).join("");
}

/** "(x + 3)", "(x − 3)", "(2x + 5)" */
export function bracket(a: number, v: string, b: number): string {
  return `(${expr([[a, v], [b, ""]])})`;
}

/** A number with a real minus sign. */
export const n = (x: number) => (x < 0 ? `−${Math.abs(x)}` : String(x));
