"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { todayKey, addDaysToKey, fromDateKey } from "@/lib/utils/date-helpers";

const RANGE_DAYS = 30;

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-foreground">
        {payload[0].value} kcal
      </p>
    </div>
  );
}

export function CalorieTrendChart() {
  const start = addDaysToKey(todayKey(), -(RANGE_DAYS - 1));
  const end = todayKey();
  const { data } = useSWR(`/api/food?start=${start}&end=${end}`);

  const chartData = useMemo(() => {
    const byDate = new Map((data || []).map((d) => [d.date, d.totalCalories]));
    const rows = [];
    let cursor = start;
    while (cursor <= end) {
      rows.push({
        date: cursor,
        label: format(fromDateKey(cursor), "d MMM"),
        calories: byDate.get(cursor) || 0,
      });
      cursor = addDaysToKey(cursor, 1);
    }
    return rows;
  }, [data, start, end]);

  if (!data) return <Skeleton className="h-56 w-full" />;

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="label"
            interval={4}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--food)", strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="calories"
            stroke="var(--food)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--food)", stroke: "var(--card)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
