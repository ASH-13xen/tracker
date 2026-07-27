"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { todayKey } from "@/lib/utils/date-helpers";
import { apiPost } from "@/lib/utils/api-client";
import { CountdownTimer } from "@/components/dashboard/countdown-timer";
import { DateNav } from "@/components/dashboard/date-nav";
import { ChecklistCard } from "@/components/dashboard/checklist-card";
import { DailyNote } from "@/components/dashboard/daily-note";
import { RevisionWidget } from "@/components/dashboard/revision-widget";
import { RemindersWidget } from "@/components/dashboard/reminders-widget";
import { HeatmapSection } from "@/components/dashboard/heatmap-section";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [date, setDate] = useState(todayKey());
  const [pending, setPending] = useState(false);
  const [pendingRevisionId, setPendingRevisionId] = useState(null);

  const { data: dashboard, mutate } = useSWR(`/api/dashboard?date=${date}`);

  async function handleToggle(activity, done) {
    setPending(true);
    try {
      await apiPost("/api/dashboard/mark", { activity, done, date });
      await mutate();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPending(false);
    }
  }

  async function handleSaveNote(note) {
    try {
      await apiPost("/api/dashboard/note", { date, note });
      mutate((current) => (current ? { ...current, log: { ...current.log, note } } : current), {
        revalidate: false,
      });
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleMarkRevised(category, id) {
    setPendingRevisionId(id);
    try {
      await apiPost("/api/revisions", { category, id, date });
      await mutate();
      toast.success("Marked as revised — due again in 7 days");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPendingRevisionId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Your daily checklist and progress at a glance.
          </p>
        </div>
        <CountdownTimer />
      </div>

      <DateNav date={date} onChange={setDate} />

      {!dashboard ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChecklistCard dashboard={dashboard} onToggle={handleToggle} pending={pending} />
            <div className="space-y-6">
              <DailyNote date={date} note={dashboard.log.note} onSave={handleSaveNote} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <RevisionWidget
              items={dashboard.dueForRevision}
              onMarkRevised={handleMarkRevised}
              pendingId={pendingRevisionId}
            />
            <RemindersWidget events={dashboard.reminders} />
          </div>

          <HeatmapSection />
        </>
      )}
    </div>
  );
}
