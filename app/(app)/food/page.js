"use client";

import { useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DateNav } from "@/components/dashboard/date-nav";
import { FoodDayCard } from "@/components/food/food-day-card";
import { FoodEntryFormDialog } from "@/components/food/food-entry-form-dialog";
import { EditFoodEntryDialog } from "@/components/food/edit-food-entry-dialog";
import { FoodItemsManager } from "@/components/food/food-items-manager";
import { CalorieTrendChart } from "@/components/food/calorie-trend-chart";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { apiPatch, apiDelete } from "@/lib/utils/api-client";
import { todayKey } from "@/lib/utils/date-helpers";

export default function FoodPage() {
  const [date, setDate] = useState(todayKey());
  const { data: day, mutate } = useSWR(`/api/food?date=${date}`);
  const { data: foodItems, mutate: mutateFoodItems } = useSWR("/api/food-items");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  function revalidateTrend() {
    globalMutate((key) => typeof key === "string" && key.startsWith("/api/food?start="));
  }

  async function handleDayChanged() {
    await mutate();
    revalidateTrend();
  }

  async function handleEditSubmit(payload) {
    try {
      await apiPatch(`/api/food/${editing._id}`, payload);
      await handleDayChanged();
      toast.success("Entry updated");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDeleteConfirm() {
    try {
      await apiDelete(`/api/food/${deleting._id}`);
      await handleDayChanged();
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
          onAdd={() => setFormOpen(true)}
          onEdit={(entry) => setEditing(entry)}
          onDelete={(entry) => setDeleting(entry)}
        />
      )}

      <FoodItemsManager items={foodItems} mutate={mutateFoodItems} />

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
        date={date}
        foodItems={foodItems || []}
        onDone={handleDayChanged}
      />
      <EditFoodEntryDialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        entry={editing}
        onSubmit={handleEditSubmit}
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
