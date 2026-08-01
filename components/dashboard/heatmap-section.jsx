"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { startOfWeek, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeatmapGrid } from "@/components/dashboard/heatmap-grid";
import { OverallTrendChart } from "@/components/dashboard/overall-trend-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { fromDateKey } from "@/lib/utils/date-helpers";

const DAYS = 371; // 53 full weeks, GitHub-style

function buildWeeklyTrend(data) {
  const weeks = new Map();
  for (const { date, count } of data) {
    const weekStart = format(startOfWeek(fromDateKey(date)), "yyyy-MM-dd");
    if (!weeks.has(weekStart)) weeks.set(weekStart, { weekStart, count: 0 });
    weeks.get(weekStart).count += count;
  }
  return Array.from(weeks.values())
    .sort((a, b) => (a.weekStart < b.weekStart ? -1 : 1))
    .slice(-12)
    .map((w) => ({ ...w, weekLabel: format(fromDateKey(w.weekStart), "d MMM") }));
}

export function HeatmapSection() {
  const { data: overall } = useSWR(`/api/heatmap?category=overall&days=${DAYS}`);

  const trendData = useMemo(() => (overall ? buildWeeklyTrend(overall) : []), [overall]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity heatmap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!overall ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <HeatmapGrid data={overall} color="primary" label="Overall activity" days={DAYS} />
        )}

        {overall && (
          <div>
            <p className="mb-2 text-sm font-medium">Last 12 weeks</p>
            <OverallTrendChart data={trendData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
