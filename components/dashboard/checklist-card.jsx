"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  GraduationCap,
  Binary,
  Dumbbell,
  BrainCircuit,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const ROWS = [
  { key: "gate", label: "GATE Study", icon: GraduationCap, color: "gate" },
  { key: "dsa", label: "DSA", icon: Binary, color: "dsa" },
  { key: "exercise", label: "Exercise", icon: Dumbbell, color: "exercise" },
  { key: "skill", label: "Skill/Project", icon: BrainCircuit, color: "skill" },
  {
    key: "foodLogged",
    label: "Food Log",
    icon: UtensilsCrossed,
    color: "food",
  },
];

export function ChecklistCard({ dashboard, onToggle, pending }) {
  const listRef = useRef(null);

  useGSAP(
    () => {
      if (!listRef.current) return;
      gsap.from(listRef.current.children, {
        opacity: 0,
        x: -8,
        duration: 0.35,
        stagger: 0.06,
        ease: "power2.out",
      });
    },
    { dependencies: [dashboard?.date, dashboard?.dayType], scope: listRef },
  );

  if (!dashboard) return null;
  const { log, schedule, dayType } = dashboard;
  const rows = dayType === "sunday" ? [] : ROWS;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Today&apos;s checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={listRef} className={rows.length === 0 ? "" : "space-y-1"}>
          {rows.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Sparkles className="h-5 w-5 text-project" />
              <p className="text-sm font-medium">
                Recovery day — nothing to check off.
              </p>
              <p className="text-xs text-muted-foreground">
                Free day. Use the note to plan or wrap up unfinished work.
              </p>
            </div>
          ) : (
            rows.map((row) => {
              const flag = log[row.key] || {};
              const Icon = row.icon;
              const scheduleLabel =
                row.key === "foodLogged"
                  ? "Log what you ate"
                  : schedule[row.key];

              return (
                <div
                  key={row.key}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-accent/40"
                >
                  <Checkbox
                    checked={!!flag.done}
                    disabled={pending}
                    onCheckedChange={(checked) =>
                      onToggle(row.key, checked === true)
                    }
                    className="h-5 w-5"
                  />
                  <Icon
                    className="h-4 w-4 shrink-0"
                    style={{ color: `var(--${row.color})` }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight">
                      {row.label}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {scheduleLabel}
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
                          {format(
                            new Date(flag.doneAt),
                            flag.markedLater ? "d MMM, h:mm a" : "h:mm a",
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
