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
  if (!count) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

const LEVEL_MIX = [0, 25, 50, 75, 100];

function buildWeeks(counts, days) {
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
    cells.push({
      date: key,
      count: inRange ? counts.get(key) || 0 : null,
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
  const counts = useMemo(() => new Map(data.map((d) => [d.date, d.count])), [data]);
  const weeks = useMemo(() => buildWeeks(counts, days), [counts, days]);

  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = null;
    weeks.forEach((week, i) => {
      const firstValid = week.find((c) => c.count !== null);
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
                  if (cell.count === null) {
                    return (
                      <div key={di} style={{ width: CELL, height: CELL }} />
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
