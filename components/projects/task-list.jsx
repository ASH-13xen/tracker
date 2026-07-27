"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, isPast, isToday } from "date-fns";
import { apiPost, apiPatch, apiDelete } from "@/lib/utils/api-client";

export function TaskList({ projectId, tasks, mutate }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    try {
      await apiPost(`/api/projects/${projectId}/tasks`, {
        title: title.trim(),
        dueDate: dueDate || null,
        order: tasks.length,
      });
      setTitle("");
      setDueDate("");
      await mutate();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  }

  async function toggleDone(task) {
    try {
      await apiPatch(`/api/projects/tasks/${task._id}`, { done: !task.done });
      await mutate();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function removeTask(task) {
    try {
      await apiDelete(`/api/projects/tasks/${task._id}`);
      await mutate();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <form onSubmit={handleAdd} className="flex flex-wrap gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task…"
            className="flex-1"
          />
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-40"
          />
          <Button type="submit" disabled={adding || !title.trim()}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add
          </Button>
        </form>

        {tasks.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No tasks yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {tasks.map((task) => {
              const due = task.dueDate ? new Date(task.dueDate) : null;
              const overdue = due && !task.done && isPast(due) && !isToday(due);
              return (
                <li
                  key={task._id}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/40"
                >
                  <Checkbox checked={task.done} onCheckedChange={() => toggleDone(task)} />
                  <span
                    className={`flex-1 text-sm ${task.done ? "text-muted-foreground line-through" : ""}`}
                  >
                    {task.title}
                  </span>
                  {due && (
                    <Badge variant={overdue ? "destructive" : "secondary"} className="text-[10px]">
                      {format(due, "d MMM")}
                    </Badge>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => removeTask(task)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
