import { format, parseISO, addDays as fnsAddDays, differenceInCalendarDays } from "date-fns";

export const DATE_KEY_FORMAT = "yyyy-MM-dd";

export function todayKey() {
  return format(new Date(), DATE_KEY_FORMAT);
}

export function toDateKey(date) {
  return format(date, DATE_KEY_FORMAT);
}

export function fromDateKey(dateKey) {
  return parseISO(dateKey);
}

export function addDaysToKey(dateKey, amount) {
  return toDateKey(fnsAddDays(fromDateKey(dateKey), amount));
}

export function isWeekendKey(dateKey) {
  const d = fromDateKey(dateKey).getDay();
  return d === 0 || d === 6;
}

export function dayTypeForKey(dateKey) {
  const d = fromDateKey(dateKey).getDay();
  if (d === 0) return "sunday";
  if (d === 6) return "saturday";
  return "weekday";
}

export function daysUntilKey(dateKey) {
  return differenceInCalendarDays(fromDateKey(dateKey), fromDateKey(todayKey()));
}

export function isBackdated(dateKey) {
  return dateKey !== todayKey() && daysUntilKey(dateKey) < 0;
}
