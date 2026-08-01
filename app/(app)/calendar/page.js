"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from "lucide-react";
import { addMonths, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MonthGrid } from "@/components/calendar/month-grid";
import { EventFormDialog } from "@/components/calendar/event-form-dialog";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { apiPost, apiPatch, apiDelete } from "@/lib/utils/api-client";
import { todayKey } from "@/lib/utils/date-helpers";

export default function CalendarPage() {
  const { data: events, mutate } = useSWR("/api/calendar");
  const [monthDate, setMonthDate] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [defaultDate, setDefaultDate] = useState(todayKey());
  const [deleting, setDeleting] = useState(null);

  const eventsByDate = useMemo(() => {
    const map = new Map();
    for (const event of events || []) {
      if (!map.has(event.date)) map.set(event.date, []);
      map.get(event.date).push(event);
    }
    return map;
  }, [events]);

  async function handleSubmit(payload) {
    try {
      if (editing) await apiPatch(`/api/calendar/${editing._id}`, payload);
      else await apiPost("/api/calendar", payload);
      await mutate();
      toast.success(editing ? "Event updated" : "Event added");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDeleteConfirm() {
    try {
      await apiDelete(`/api/calendar/${deleting._id}`);
      await mutate();
      setDeleting(null);
      setFormOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <CalendarDays className="h-5 w-5 text-calendar" /> Calendar
          </h1>
          <p className="text-sm text-muted-foreground">
            Mark important dates — reminders surface on the dashboard a day ahead.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDefaultDate(todayKey());
            setFormOpen(true);
          }}
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add event
        </Button>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" size="icon" onClick={() => setMonthDate((d) => addMonths(d, -1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="w-40 text-center text-sm font-medium">{format(monthDate, "MMMM yyyy")}</p>
        <Button variant="outline" size="icon" onClick={() => setMonthDate((d) => addMonths(d, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {!events ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <MonthGrid
              monthDate={monthDate}
              eventsByDate={eventsByDate}
              onDayClick={(dateKey) => {
                setEditing(null);
                setDefaultDate(dateKey);
                setFormOpen(true);
              }}
              onEventClick={(event) => {
                setEditing(event);
                setFormOpen(true);
              }}
            />
          )}
        </CardContent>
      </Card>

      <EventFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        event={editing}
        defaultDate={defaultDate}
        onSubmit={handleSubmit}
        onDelete={(event) => setDeleting(event)}
      />
      <ConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete "${deleting?.title}"?`}
        description="This can't be undone."
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
