import * as dailyLogRepo from "@/lib/repositories/daily-log.repository";
import * as activityLogRepo from "@/lib/repositories/activity-log.repository";
import * as revisionService from "@/lib/services/revision.service";
import * as calendarService from "@/lib/services/calendar.service";
import { todayKey, isWeekendKey } from "@/lib/utils/date-helpers";
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
  const weekend = isWeekendKey(dateKey);

  return {
    date: dateKey,
    isWeekend: weekend,
    schedule: {
      gate: weekend ? SCHEDULE.gate.weekend : SCHEDULE.gate.weekday,
      dsa: weekend ? SCHEDULE.dsa.weekend : SCHEDULE.dsa.weekday,
      exercise: weekend ? SCHEDULE.exercise.weekend : SCHEDULE.exercise.weekday,
      skill: weekend ? SCHEDULE.skill.weekend : SCHEDULE.skill.weekday,
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
