"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GraduationCap, Binary, Dumbbell, BrainCircuit, UtensilsCrossed } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const ROWS = [
  { key: "gate", label: "GATE Study", icon: GraduationCap, color: "gate" },
  { key: "dsa", label: "DSA", icon: Binary, color: "dsa" },
  { key: "exercise", label: "Exercise", icon: Dumbbell, color: "exercise", weekendOff: true },
  { key: "skill", label: "Skill", icon: BrainCircuit, color: "skill" },
  { key: "foodLogged", label: "Food Log", icon: UtensilsCrossed, color: "food" },
];

export function ChecklistCard({ dashboard, onToggle, pending }) {
  const listRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(listRef.current.children, {
        opacity: 0,
        x: -8,
        duration: 0.35,
        stagger: 0.06,
        ease: "power2.out",
      });
    },
    { dependencies: [dashboard?.date], scope: listRef }
  );

  if (!dashboard) return null;
  const { log, schedule, isWeekend } = dashboard;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Today&apos;s checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={listRef} className="space-y-1">
          {ROWS.map((row) => {
            const flag = log[row.key] || {};
            const Icon = row.icon;
            const disabled = row.weekendOff && isWeekend;
            const scheduleLabel = row.key === "foodLogged" ? "Log what you ate" : schedule[row.key];

            return (
              <div
                key={row.key}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-accent/40"
              >
                <Checkbox
                  checked={!!flag.done}
                  disabled={disabled || pending}
                  onCheckedChange={(checked) => onToggle(row.key, checked === true)}
                  className="h-5 w-5"
                />
                <Icon
                  className="h-4 w-4 shrink-0"
                  style={{ color: `var(--${row.color})` }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight">{row.label}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {disabled ? "Off today" : scheduleLabel}
                  </p>
                </div>
                {flag.done && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    {flag.markedLater && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="secondary" className="text-[10px]">
                            marked later
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          Backdated entry — logged after the fact
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {flag.doneAt && (
                      <span className="text-[11px] text-muted-foreground">
                        {format(new Date(flag.doneAt), "h:mm a")}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
