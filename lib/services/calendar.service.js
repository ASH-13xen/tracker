import * as repo from "@/lib/repositories/calendar.repository";
import { todayKey, addDaysToKey } from "@/lib/utils/date-helpers";
import { CALENDAR_REMINDER_LEAD_DAYS } from "@/lib/utils/constants";

export const getAllEvents = () => repo.getAllEvents();
export const createEvent = (data) => repo.createEvent(data);
export const updateEvent = (id, data) => repo.updateEvent(id, data);
export const deleteEvent = (id) => repo.deleteEvent(id);

export async function getReminders() {
  const start = todayKey();
  const end = addDaysToKey(start, CALENDAR_REMINDER_LEAD_DAYS);
  return repo.getEventsInRange(start, end);
}
