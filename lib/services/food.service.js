import * as repo from "@/lib/repositories/food.repository";
import * as activityLogRepo from "@/lib/repositories/activity-log.repository";
import { todayKey } from "@/lib/utils/date-helpers";

function withTotal(date, entries) {
  return {
    date,
    entries,
    totalCalories: entries.reduce((sum, e) => sum + e.calories, 0),
  };
}

export async function getDay(date) {
  const entries = await repo.getEntriesForDate(date);
  return withTotal(date, entries);
}

export async function getRange(startDate, endDate) {
  const entries = await repo.getEntriesInRange(startDate, endDate);
  const byDate = new Map();
  for (const e of entries) {
    if (!byDate.has(e.date)) byDate.set(e.date, []);
    byDate.get(e.date).push(e);
  }
  return Array.from(byDate.entries()).map(([date, dayEntries]) => withTotal(date, dayEntries));
}

export async function addEntry(data) {
  const dateKey = data.date ?? todayKey();
  const markedLater = dateKey !== todayKey();
  const created = await repo.createEntry({ ...data, date: dateKey, markedLater });
  await activityLogRepo.record(dateKey, "food", 1, `entry:${created._id}`);
  return created;
}

export const updateEntry = (id, data) => repo.updateEntry(id, data);
export const removeEntry = (id) => repo.deleteEntry(id);
