"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DateNav } from "@/components/dashboard/date-nav";
import { FoodDayCard } from "@/components/food/food-day-card";
import { FoodEntryFormDialog } from "@/components/food/food-entry-form-dialog";
import { CalorieTrendChart } from "@/components/food/calorie-trend-chart";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { apiPost, apiPatch, apiDelete } from "@/lib/utils/api-client";
import { todayKey } from "@/lib/utils/date-helpers";

export default function FoodPage() {
  const [date, setDate] = useState(todayKey());
  const { data: day, mutate } = useSWR(`/api/food?date=${date}`);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function handleSubmit(payload) {
    try {
      if (editing) await apiPatch(`/api/food/${editing._id}`, payload);
      else await apiPost("/api/food", { ...payload, date });
      await mutate();
      toast.success(editing ? "Entry updated" : "Entry added");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDeleteConfirm() {
    try {
      await apiDelete(`/api/food/${deleting._id}`);
      await mutate();
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Food Log</h1>
        <p className="text-sm text-muted-foreground">
          Log every meal with a calorie count — daily totals are summed automatically.
        </p>
      </div>

      <DateNav date={date} onChange={setDate} />

      {!day ? (
        <Skeleton className="h-56 w-full" />
      ) : (
        <FoodDayCard
          day={day}
          onAdd={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          onEdit={(entry) => {
            setEditing(entry);
            setFormOpen(true);
          }}
          onDelete={(entry) => setDeleting(entry)}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Last 30 days</CardTitle>
        </CardHeader>
        <CardContent>
          <CalorieTrendChart />
        </CardContent>
      </Card>

      <FoodEntryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        entry={editing}
        onSubmit={handleSubmit}
      />
      <ConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this entry?"
        description="This can't be undone."
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
