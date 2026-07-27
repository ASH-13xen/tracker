"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { Flame, Trophy, Dumbbell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HeatmapGrid } from "@/components/dashboard/heatmap-grid";

const DAYS = 371;

function StatTile({ icon: Icon, label, value, suffix }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-exercise/15 text-exercise">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold tabular-nums">
            {value}
            {suffix && <span className="ml-1 text-sm font-normal text-muted-foreground">{suffix}</span>}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExercisePage() {
  const { data } = useSWR(`/api/exercise?days=${DAYS}`);

  const heatmapData = useMemo(
    () => (data ? data.history.map((h) => ({ date: h.date, count: h.done ? 1 : 0 })) : []),
    [data]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <Dumbbell className="h-5 w-5 text-exercise" /> Exercise
        </h1>
        <p className="text-sm text-muted-foreground">
          30 minutes a day, Monday to Friday. Mark it done from the dashboard.
        </p>
      </div>

      {!data ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatTile icon={Flame} label="Current streak" value={data.streak.current} suffix="days" />
          <StatTile icon={Trophy} label="Longest streak" value={data.streak.longest} suffix="days" />
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          {!data ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <HeatmapGrid data={heatmapData} color="exercise" label="Past year" days={DAYS} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
