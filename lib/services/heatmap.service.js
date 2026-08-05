import * as activityLogRepo from "@/lib/repositories/activity-log.repository";
import * as dailyLogRepo from "@/lib/repositories/daily-log.repository";
import { toDateKey, todayKey, addDaysToKey, dayTypeForKey } from "@/lib/utils/date-helpers";
import { DASHBOARD_ACTIVITIES } from "@/lib/utils/constants";

// "Overall" reflects how many of the day's checklist boxes got checked —
// not the richer per-section activity log. Sundays have no checklist tasks
// (recovery day, food log only) so they're flagged unmarkable rather than
// scored 0, since 0 there doesn't mean "missed it".
export async function getOverallHeatmap(days = 371) {
  const end = todayKey();
  const start = addDaysToKey(end, -(days - 1));
  const logs = await dailyLogRepo.findByDateRange(start, end);
  const byDate = new Map(logs.map((l) => [l.date, l]));

  const result = [];
  let cursor = start;
  while (cursor <= end) {
    if (dayTypeForKey(cursor) === "sunday") {
      result.push({ date: cursor, count: 0, unmarkable: true });
    } else {
      const log = byDate.get(cursor);
      const count = log
        ? DASHBOARD_ACTIVITIES.filter((key) => log[key]?.done).length
        : 0;
      result.push({ date: cursor, count, unmarkable: false });
    }
    cursor = addDaysToKey(cursor, 1);
  }
  return result;
}

export async function getHeatmap(category, days = 365) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  const startKey = toDateKey(start);
  const endKey = toDateKey(end);

  const entries = await activityLogRepo.findInRange(
    startKey,
    endKey,
    category === "overall" ? undefined : category
  );

  const counts = new Map();
  for (const e of entries) {
    counts.set(e.date, (counts.get(e.date) || 0) + e.weight);
  }
  return Array.from(counts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}
