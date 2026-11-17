/**
 * Abstract questions are shown worksheet-style (big, monospace) when they
 * are a bare sum like "3.6 × 4 = ?". When they are a sentence ("What is the
 * average of 4, 8 and 12?") they are shown as normal text, so they read like
 * a question and not like code.
 */
export function abstractClass(prompt: string): string {
  return /[A-Za-z]{3,}/.test(prompt) ? "prompt-abstract is-words" : "prompt-abstract";
}
