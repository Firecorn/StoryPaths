// Dates are stored as local YYYY-MM-DD strings.
export const todayKey = (d = new Date()) => d.toLocaleDateString('en-CA');

export function currentStreak(dates) {
  const set = new Set(dates);
  const d = new Date();
  if (!set.has(todayKey(d))) d.setDate(d.getDate() - 1); // today not played yet: streak still alive
  let n = 0;
  while (set.has(todayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/** Seven booleans, Monday first, for the M T W TH F S SU row. */
export function weekFlags(dates) {
  const set = new Set(dates);
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return set.has(todayKey(d));
  });
}
