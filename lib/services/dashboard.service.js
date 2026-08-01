import * as dailyLogRepo from "@/lib/repositories/daily-log.repository";
import * as activityLogRepo from "@/lib/repositories/activity-log.repository";
import * as revisionService from "@/lib/services/revision.service";
import * as calendarService from "@/lib/services/calendar.service";
import { todayKey, dayTypeForKey } from "@/lib/utils/date-helpers";
import { SCHEDULE } from "@/lib/utils/constants";

function emptyLog(dateKey) {
  return {
    date: dateKey,
    gate: {},
    dsa: {},
    exercise: {},
    skill: {},
    foodLogged: {},
    note: "",
  };
}

export async function getDashboard(dateKey = todayKey()) {
  const [log, dueForRevision, reminders] = await Promise.all([
    dailyLogRepo.findByDate(dateKey),
    revisionService.getDueForRevision(),
    calendarService.getReminders(),
  ]);
  const dayType = dayTypeForKey(dateKey);

  return {
    date: dateKey,
    dayType,
    schedule: {
      gate: SCHEDULE.gate[dayType],
      dsa: SCHEDULE.dsa[dayType],
      exercise: SCHEDULE.exercise[dayType],
      skill: SCHEDULE.skill[dayType],
    },
    log: log ?? emptyLog(dateKey),
    dueForRevision,
    reminders,
  };
}

export async function markActivity(activity, done, dateKey = todayKey()) {
  const now = new Date();
  const markedLater = dateKey !== todayKey();
  const update = {
    [`${activity}.done`]: done,
    [`${activity}.doneAt`]: done ? now : null,
    [`${activity}.markedLater`]: done ? markedLater : false,
  };
  const updated = await dailyLogRepo.upsertByDate(dateKey, update);

  if (done && activity === "exercise") {
    await activityLogRepo.record(dateKey, "exercise", 1, "dashboard-checkbox");
  }

  return updated;
}

export async function setNote(dateKey, note) {
  return dailyLogRepo.upsertByDate(dateKey, { note });
}
