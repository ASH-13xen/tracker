import * as activityLogRepo from "@/lib/repositories/activity-log.repository";
import { toDateKey } from "@/lib/utils/date-helpers";

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
