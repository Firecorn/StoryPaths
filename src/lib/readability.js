// Adaptive readability engine.
// 1. Score any passage with the Flesch-Kincaid grade-level formula.
// 2. Move the learner's target grade up/down based on their recent accuracy streak.
// 3. Serve the passage variant whose score is closest to that target.

export function countSyllables(word) {
  let w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const groups = w.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

/** Flesch-Kincaid grade = 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59 */
export function fleschKincaidGrade(text) {
  const words = text.match(/[A-Za-z']+/g) ?? [];
  if (!words.length) return 0;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length || 1;
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const grade = 0.39 * (words.length / sentences) + 11.8 * (syllables / words.length) - 15.59;
  return Math.max(0, Math.round(grade * 10) / 10);
}

/**
 * `recent` is an array of booleans (oldest -> newest).
 *  - 3+ correct in a row: step up half a grade
 *  - 2+ misses in a row:  step down a full grade
 */
export function nextTargetGrade(current, recent, { min = 2, max = 9 } = {}) {
  const last = recent[recent.length - 1];
  let run = 0;
  for (let i = recent.length - 1; i >= 0 && recent[i] === last; i--) run++;

  let next = current;
  if (last === true && run >= 3) next += 0.5;
  if (last === false && run >= 2) next -= 1;
  return Math.min(max, Math.max(min, next));
}

/** Pick the variant (array of strings) whose FK grade is closest to the target. */
export function pickVariant(variants, targetGrade) {
  const scored = variants.map((text) => ({ text, grade: fleschKincaidGrade(text) }));
  return scored.reduce((best, v) =>
    Math.abs(v.grade - targetGrade) < Math.abs(best.grade - targetGrade) ? v : best
  );
}
