"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { apiPost, apiDelete } from "@/lib/utils/api-client";
import { todayKey } from "@/lib/utils/date-helpers";

export function TimeLog({ projectId, timeLogs, mutate }) {
  const [date, setDate] = useState(todayKey());
  const [hours, setHours] = useState("");
  const [note, setNote] = useState("");
  const [adding, setAdding] = useState(false);

  const totalHours = timeLogs.reduce((sum, t) => sum + t.hours, 0);

  async function handleAdd(e) {
    e.preventDefault();
    if (!hours) return;
    setAdding(true);
    try {
      await apiPost(`/api/projects/${projectId}/timelogs`, {
        date,
        hours: Number(hours),
        note,
      });
      setHours("");
      setNote("");
      await mutate();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  }

  async function removeLog(id) {
    try {
      await apiDelete(`/api/projects/timelogs/${id}`);
      await mutate();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-muted-foreground" /> Time log
        </CardTitle>
        <span className="text-sm font-medium tabular-nums text-muted-foreground">
          {totalHours}h total
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        <form onSubmit={handleAdd} className="flex flex-wrap gap-2">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" />
          <Input
            type="number"
            step="0.5"
            min="0"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Hours"
            className="w-24"
          />
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What did you work on?"
            className="flex-1"
          />
          <Button type="submit" disabled={adding || !hours}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Log
          </Button>
        </form>

        {timeLogs.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No time logged yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {timeLogs.map((log) => (
              <li
                key={log._id}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-accent/40"
              >
                <span className="w-20 shrink-0 text-xs text-muted-foreground">
                  {format(parseISO(log.date), "d MMM")}
                </span>
                <span className="w-10 shrink-0 text-sm font-medium tabular-nums">{log.hours}h</span>
                <span className="flex-1 truncate text-sm text-muted-foreground">{log.note}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => removeLog(log._id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
