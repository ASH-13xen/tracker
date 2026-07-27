"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  { value: "exam", label: "Exam" },
  { value: "deadline", label: "Deadline" },
  { value: "personal", label: "Personal" },
  { value: "general", label: "General" },
];

function emptyForm(event, defaultDate) {
  return {
    title: event?.title || "",
    date: event?.date || defaultDate,
    description: event?.description || "",
    category: event?.category || "general",
  };
}

export function EventFormDialog({ open, onOpenChange, event, defaultDate, onSubmit, onDelete }) {
  const [form, setForm] = useState(() => emptyForm(event, defaultDate));
  const [prevOpen, setPrevOpen] = useState(open);
  const [saving, setSaving] = useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setForm(emptyForm(event, defaultDate));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    setSaving(true);
    try {
      await onSubmit({ ...form, title: form.title.trim() });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{event ? "Edit event" : "Add event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">Title</Label>
              <Input
                autoFocus
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. GATE application deadline"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="mb-2 block">Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div className="flex-1">
                <Label className="mb-2 block">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Notes</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="min-h-16 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            {event && onDelete && (
              <Button
                type="button"
                variant="outline"
                className="mr-auto text-destructive hover:text-destructive"
                onClick={() => onDelete(event)}
              >
                Delete
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.title.trim()}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
