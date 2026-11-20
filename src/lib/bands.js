// Reading bands used by the story JSON ("3-4", "5-6", "7-8") and the diagnostic.
export const BANDS = ['3-4', '5-6', '7-8'];

const BAND_GRADE = { '3-4': 3.5, '5-6': 5.5, '7-8': 7.5 };

export const gradeForBand = (band) => BAND_GRADE[band] ?? 5.5;

/** Learner's numeric target grade -> which band's version of the passage to show. */
export const bandForGrade = (grade) => (grade < 5 ? '3-4' : grade < 7 ? '5-6' : '7-8');

/** Pick the variant for this learner. Falls back to the nearest band the node actually has. */
export function pickBandVariant(variants, grade) {
  const want = bandForGrade(grade);
  if (variants[want]) return { band: want, ...variants[want] };
  const nearest = Object.keys(variants).sort(
    (a, b) => Math.abs(gradeForBand(a) - grade) - Math.abs(gradeForBand(b) - grade)
  )[0];
  return { band: nearest, ...variants[nearest] };
}

/** scoringRules looks like { "0-3": "3-4", "4-6": "5-6", "7-9": "7-8" } (score range -> band). */
export function bandForScore(score, rules) {
  for (const [range, band] of Object.entries(rules)) {
    const [lo, hi] = range.split('-').map(Number);
    if (score >= lo && score <= hi) return band;
  }
  return BANDS[0];
}

/** Fisher-Yates. The JSON always lists the correct answer first, so options must be shuffled before display. */
export function shuffle(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
