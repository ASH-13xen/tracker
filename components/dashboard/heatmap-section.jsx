"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { startOfWeek, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HeatmapGrid } from "@/components/dashboard/heatmap-grid";
import { WeeklyTrendChart } from "@/components/dashboard/weekly-trend-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { fromDateKey } from "@/lib/utils/date-helpers";

const DAYS = 371; // 53 full weeks, GitHub-style

const CATEGORY_TABS = [
  { value: "overall", label: "Overall", color: "primary" },
  { value: "gate", label: "GATE", color: "gate" },
  { value: "dsa", label: "DSA", color: "dsa" },
  { value: "skill", label: "Skill", color: "skill" },
  { value: "exercise", label: "Exercise", color: "exercise" },
];

function buildWeeklyTrend(byCategory) {
  const weeks = new Map();
  for (const key of ["gate", "dsa", "skill", "exercise"]) {
    for (const { date, count } of byCategory[key] || []) {
      const weekStart = format(startOfWeek(fromDateKey(date)), "yyyy-MM-dd");
      if (!weeks.has(weekStart)) {
        weeks.set(weekStart, { weekStart, gate: 0, dsa: 0, skill: 0, exercise: 0 });
      }
      weeks.get(weekStart)[key] += count;
    }
  }
  return Array.from(weeks.values())
    .sort((a, b) => (a.weekStart < b.weekStart ? -1 : 1))
    .slice(-12)
    .map((w) => ({ ...w, weekLabel: format(fromDateKey(w.weekStart), "d MMM") }));
}

export function HeatmapSection() {
  const { data: overall } = useSWR(`/api/heatmap?category=overall&days=${DAYS}`);
  const { data: gate } = useSWR(`/api/heatmap?category=gate&days=${DAYS}`);
  const { data: dsa } = useSWR(`/api/heatmap?category=dsa&days=${DAYS}`);
  const { data: skill } = useSWR(`/api/heatmap?category=skill&days=${DAYS}`);
  const { data: exercise } = useSWR(`/api/heatmap?category=exercise&days=${DAYS}`);

  const loaded = overall && gate && dsa && skill && exercise;

  const trendData = useMemo(() => {
    if (!loaded) return [];
    return buildWeeklyTrend({ gate, dsa, skill, exercise });
  }, [loaded, gate, dsa, skill, exercise]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity heatmap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!loaded ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <Tabs defaultValue="overall">
            <TabsList>
              {CATEGORY_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="overall" className="pt-4">
              <HeatmapGrid data={overall} color="primary" label="Overall activity" days={DAYS} />
            </TabsContent>
            <TabsContent value="gate" className="pt-4">
              <HeatmapGrid data={gate} color="gate" label="GATE" days={DAYS} />
            </TabsContent>
            <TabsContent value="dsa" className="pt-4">
              <HeatmapGrid data={dsa} color="dsa" label="DSA" days={DAYS} />
            </TabsContent>
            <TabsContent value="skill" className="pt-4">
              <HeatmapGrid data={skill} color="skill" label="Skill" days={DAYS} />
            </TabsContent>
            <TabsContent value="exercise" className="pt-4">
              <HeatmapGrid data={exercise} color="exercise" label="Exercise" days={DAYS} />
            </TabsContent>
          </Tabs>
        )}

        {loaded && (
          <div>
            <p className="mb-2 text-sm font-medium">Last 12 weeks — GATE / DSA / Skill / Exercise</p>
            <WeeklyTrendChart data={trendData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
