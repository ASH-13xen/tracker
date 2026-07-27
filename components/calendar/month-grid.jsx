"use client";

import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns";
import { toDateKey, todayKey } from "@/lib/utils/date-helpers";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthGrid({ monthDate, eventsByDate, onDayClick, onEventClick }) {
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(monthDate));
    const end = endOfWeek(endOfMonth(monthDate));
    return eachDayOfInterval({ start, end });
  }, [monthDate]);

  const today = todayKey();

  return (
    <div>
      <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = toDateKey(day);
          const inMonth = isSameMonth(day, monthDate);
          const isToday = key === today;
          const events = eventsByDate.get(key) || [];

          return (
            <button
              key={key}
              type="button"
              onClick={() => onDayClick(key)}
              className={cn(
                "flex min-h-20 flex-col items-start gap-1 rounded-lg border border-border/50 p-1.5 text-left transition-colors hover:border-calendar/40 hover:bg-calendar/5",
                !inMonth && "opacity-40"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-xs",
                  isToday && "bg-calendar text-white font-semibold"
                )}
              >
                {day.getDate()}
              </span>
              <div className="flex w-full flex-col gap-0.5">
                {events.slice(0, 2).map((event) => (
                  <span
                    key={event._id}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="truncate rounded bg-calendar/20 px-1 py-0.5 text-[10px] text-calendar hover:bg-calendar/30"
                  >
                    {event.title}
                  </span>
                ))}
                {events.length > 2 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{events.length - 2} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
