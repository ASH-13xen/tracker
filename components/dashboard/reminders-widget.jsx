"use client";

import { CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { todayKey, addDaysToKey } from "@/lib/utils/date-helpers";
import { format, parseISO } from "date-fns";

export function RemindersWidget({ events }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarClock className="h-4 w-4 text-calendar" />
          Upcoming reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">Nothing on the calendar for tomorrow.</p>
        ) : (
          <ul className="space-y-2">
            {events.map((event) => {
              const when =
                event.date === todayKey()
                  ? "Today"
                  : event.date === addDaysToKey(todayKey(), 1)
                    ? "Tomorrow"
                    : format(parseISO(event.date), "d MMM");
              return (
                <li
                  key={event._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-calendar/25 bg-calendar/10 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{event.title}</p>
                    {event.description && (
                      <p className="truncate text-xs text-muted-foreground">{event.description}</p>
                    )}
                  </div>
                  <Badge className="shrink-0 bg-calendar/20 text-calendar">{when}</Badge>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
