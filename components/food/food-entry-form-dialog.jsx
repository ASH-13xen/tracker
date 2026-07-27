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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
  { value: "other", label: "Other" },
];

function emptyForm(entry) {
  return {
    mealType: entry?.mealType || "breakfast",
    description: entry?.description || "",
    calories: entry?.calories ?? "",
  };
}

export function FoodEntryFormDialog({ open, onOpenChange, entry, onSubmit }) {
  const [form, setForm] = useState(() => emptyForm(entry));
  const [prevOpen, setPrevOpen] = useState(open);
  const [saving, setSaving] = useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setForm(emptyForm(entry));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.description.trim() || !form.calories) return;
    setSaving(true);
    try {
      await onSubmit({
        mealType: form.mealType,
        description: form.description.trim(),
        calories: Number(form.calories),
      });
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
            <DialogTitle>{entry ? "Edit entry" : "Add food entry"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">Meal</Label>
              <Select
                value={form.mealType}
                onValueChange={(v) => setForm((f) => ({ ...f, mealType: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_TYPES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">What did you eat</Label>
              <Input
                autoFocus
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="e.g. 2 eggs, toast, coffee"
              />
            </div>
            <div>
              <Label className="mb-2 block">Calories</Label>
              <Input
                type="number"
                min="0"
                value={form.calories}
                onChange={(e) => setForm((f) => ({ ...f, calories: e.target.value }))}
                placeholder="e.g. 350"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.description.trim() || !form.calories}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
