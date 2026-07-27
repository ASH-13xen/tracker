"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { todayKey, addDaysToKey } from "@/lib/utils/date-helpers";
import { format, parseISO } from "date-fns";

export function DateNav({ date, onChange }) {
  const isToday = date === todayKey();
  const label = format(parseISO(date), "EEEE, d MMM yyyy");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              onClick={() => onChange(addDaysToKey(date, -1))}
              aria-label="Previous day"
            />
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>Previous day</TooltipContent>
      </Tooltip>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        {!isToday && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-foreground">
            Backdated view
          </span>
        )}
      </div>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              onClick={() => onChange(addDaysToKey(date, 1))}
              aria-label="Next day"
            />
          }
        >
          <ChevronRight className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>Next day</TooltipContent>
      </Tooltip>

      <Input
        type="date"
        value={date}
        max={todayKey()}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="w-[9.5rem]"
      />

      {!isToday && (
        <Button variant="ghost" size="sm" onClick={() => onChange(todayKey())}>
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Today
        </Button>
      )}
    </div>
  );
}
