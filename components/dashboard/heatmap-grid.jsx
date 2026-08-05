"use client";

import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { format, parseISO } from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toDateKey } from "@/lib/utils/date-helpers";

const CELL = 11;
const GAP = 3;

function bucketFor(count) {
  return Math.max(0, Math.min(count, 4));
}

const LEVEL_MIX = [0, 25, 50, 75, 100];

function buildWeeks(byDate, days) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  // Align the first column to the preceding Sunday so rows are true weekdays.
  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const cells = [];
  const cursor = new Date(gridStart);
  while (cursor <= end) {
    const key = toDateKey(cursor);
    const inRange = cursor >= start;
    const entry = byDate.get(key);
    cells.push({
      date: key,
      count: inRange ? entry?.count || 0 : null,
      unmarkable: inRange ? !!entry?.unmarkable : false,
      weekday: cursor.getDay(),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function HeatmapGrid({ data, color, label, days = 365 }) {
  const gridRef = useRef(null);
  const byDate = useMemo(() => new Map(data.map((d) => [d.date, d])), [data]);
  const weeks = useMemo(() => buildWeeks(byDate, days), [byDate, days]);

  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = null;
    weeks.forEach((week, i) => {
      const firstValid = week.find((c) => c.count !== null || c.unmarkable);
      if (!firstValid) return;
      const month = parseISO(firstValid.date).getMonth();
      if (month !== lastMonth) {
        labels.push({ index: i, text: format(parseISO(firstValid.date), "MMM") });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  useGSAP(
    () => {
      gsap.from(gridRef.current, { opacity: 0, y: 6, duration: 0.4, ease: "power2.out" });
    },
    { dependencies: [color], scope: gridRef }
  );

  const colorVar = `var(--${color})`;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span>Less</span>
          {LEVEL_MIX.map((mix, i) => (
            <span
              key={i}
              className="inline-block rounded-[2px]"
              style={{
                width: CELL,
                height: CELL,
                background:
                  mix === 0
                    ? "var(--muted)"
                    : `color-mix(in oklch, ${colorVar} ${mix}%, var(--card))`,
              }}
            />
          ))}
          <span>More</span>
          <span
            className="ml-2 inline-block rounded-[2px]"
            style={{
              width: CELL,
              height: CELL,
              backgroundImage:
                "repeating-linear-gradient(45deg, var(--border) 0, var(--border) 1px, transparent 1px, transparent 4px)",
            }}
          />
          <span>Recovery day</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div ref={gridRef} className="inline-block">
          <div
            className="mb-1 grid text-[10px] text-muted-foreground"
            style={{
              gridTemplateColumns: `repeat(${weeks.length}, ${CELL + GAP}px)`,
            }}
          >
            {weeks.map((_, i) => {
              const m = monthLabels.find((l) => l.index === i);
              return (
                <span key={i} className="truncate">
                  {m ? m.text : ""}
                </span>
              );
            })}
          </div>
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((cell, di) => {
                  if (cell.count === null && !cell.unmarkable) {
                    return (
                      <div key={di} style={{ width: CELL, height: CELL }} />
                    );
                  }
                  if (cell.unmarkable) {
                    return (
                      <Tooltip key={di}>
                        <TooltipTrigger
                          render={
                            <div
                              tabIndex={0}
                              className="rounded-xs outline-none transition-transform hover:scale-125 focus-visible:scale-125"
                              style={{
                                width: CELL,
                                height: CELL,
                                backgroundColor: "var(--muted)",
                                backgroundImage:
                                  "repeating-linear-gradient(45deg, var(--border) 0, var(--border) 1px, transparent 1px, transparent 4px)",
                              }}
                            />
                          }
                        />
                        <TooltipContent>
                          Recovery day — not tracked · {format(parseISO(cell.date), "d MMM yyyy")}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  const level = bucketFor(cell.count);
                  const bg =
                    level === 0
                      ? "var(--muted)"
                      : `color-mix(in oklch, ${colorVar} ${LEVEL_MIX[level]}%, var(--card))`;
                  return (
                    <Tooltip key={di}>
                      <TooltipTrigger
                        render={
                          <div
                            tabIndex={0}
                            className="rounded-xs outline-none transition-transform hover:scale-125 focus-visible:scale-125"
                            style={{ width: CELL, height: CELL, background: bg }}
                          />
                        }
                      />
                      <TooltipContent>
                        {cell.count} {cell.count === 1 ? "activity" : "activities"} ·{" "}
                        {format(parseISO(cell.date), "d MMM yyyy")}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
