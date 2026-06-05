/**
 * Compute the current consecutive-day completion streak from a list of
 * ISO timestamps when tasks were completed. A streak is "alive" if there
 * is at least one completion today or yesterday and continues backwards
 * through consecutive days.
 */
export function computeStreak(completedAt: (string | null | undefined)[]): number {
  const days = new Set<string>();
  for (const ts of completedAt) {
    if (!ts) continue;
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    days.add(d.toISOString().slice(0, 10));
  }
  if (days.size === 0) return 0;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const todayKey = today.toISOString().slice(0, 10);
  const yKey = yesterday.toISOString().slice(0, 10);

  let cursor: Date;
  if (days.has(todayKey)) cursor = today;
  else if (days.has(yKey)) cursor = yesterday;
  else return 0;

  let streak = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function lastNDays(n: number): string[] {
  const out: string[] = [];
  const d = new Date(); d.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d); x.setDate(d.getDate() - i);
    out.push(x.toISOString().slice(0, 10));
  }
  return out;
}
