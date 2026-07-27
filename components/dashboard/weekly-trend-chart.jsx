"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SERIES = [
  { key: "gate", label: "GATE", color: "var(--gate)" },
  { key: "dsa", label: "DSA", color: "var(--dsa)" },
  { key: "skill", label: "Skill", color: "var(--skill)" },
  { key: "exercise", label: "Exercise", color: "var(--exercise)" },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="space-y-1">
        {payload
          .filter((p) => p.value > 0)
          .map((p) => (
            <div key={p.dataKey} className="flex items-center gap-2 text-xs">
              <span
                className="inline-block h-[2px] w-3 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="font-semibold tabular-nums text-foreground">{p.value}</span>
              <span className="text-muted-foreground">
                {SERIES.find((s) => s.key === p.dataKey)?.label}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

function renderLegend() {
  return (
    <div className="mt-1 flex flex-wrap justify-center gap-4">
      {SERIES.map((s) => (
        <div key={s.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: s.color }}
          />
          {s.label}
        </div>
      ))}
    </div>
  );
}

export function WeeklyTrendChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="0" />
          <XAxis
            dataKey="weekLabel"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--accent)", opacity: 0.4 }} />
          <Legend content={renderLegend} />
          {SERIES.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={s.color}
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
