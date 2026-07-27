"use client";

import { RotateCw, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export function RevisionWidget({ items, onMarkRevised, pendingId }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <RotateCw className="h-4 w-4 text-muted-foreground" />
          Due for revision
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            Nothing due — you&apos;re caught up.
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Badge
                      className="text-[10px] uppercase"
                      style={{
                        backgroundColor: `color-mix(in oklch, var(--${item.category}) 20%, transparent)`,
                        color: `var(--${item.category})`,
                      }}
                    >
                      {item.category}
                    </Badge>
                    <span className="truncate text-sm font-medium">{item.subtopicName}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {[item.subjectName, item.topicName].filter(Boolean).join(" › ")} — due{" "}
                    {formatDistanceToNow(new Date(item.nextRevisionDue), { addSuffix: true })}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={pendingId === item.id}
                  onClick={() => onMarkRevised(item.category, item.id)}
                >
                  Mark revised
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
