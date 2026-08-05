import * as dailyLogRepo from "@/lib/repositories/daily-log.repository";
import { todayKey, addDaysToKey, dayTypeForKey } from "@/lib/utils/date-helpers";

export async function getHistory(days = 90) {
  const end = todayKey();
  const start = addDaysToKey(end, -(days - 1));
  const logs = await dailyLogRepo.findByDateRange(start, end);
  const map = new Map(logs.map((l) => [l.date, l.exercise]));

  const history = [];
  let cursor = start;
  while (cursor <= end) {
    history.push({
      date: cursor,
      done: !!map.get(cursor)?.done,
      isRecoveryDay: dayTypeForKey(cursor) === "sunday",
    });
    cursor = addDaysToKey(cursor, 1);
  }
  return history;
}

export function computeStreak(history) {
  let current = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    const day = history[i];
    if (day.isRecoveryDay) continue;
    if (day.done) current++;
    else break;
  }

  let longest = 0;
  let running = 0;
  for (const day of history) {
    if (day.isRecoveryDay) continue;
    if (day.done) {
      running++;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
  }

  return { current, longest };
}

export async function getSummary(days = 90) {
  const history = await getHistory(days);
  const streak = computeStreak(history);
  return { history, streak };
}
