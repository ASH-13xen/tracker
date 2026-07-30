"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { apiPost, apiPatch, apiDelete } from "@/lib/utils/api-client";

function emptyForm(item) {
  return {
    name: item?.name || "",
    caloriesPerUnit: item?.caloriesPerUnit ?? "",
    unit: item?.unit || "serving",
  };
}

function ItemFormDialog({ open, onOpenChange, item, onSubmit }) {
  const [form, setForm] = useState(() => emptyForm(item));
  const [prevOpen, setPrevOpen] = useState(open);
  const [saving, setSaving] = useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setForm(emptyForm(item));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.caloriesPerUnit) return;
    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        caloriesPerUnit: Number(form.caloriesPerUnit),
        unit: form.unit.trim() || "serving",
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
            <DialogTitle>{item ? "Edit food item" : "Add food item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">Name</Label>
              <Input
                autoFocus
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Roti"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="mb-2 block">Calories per unit</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.caloriesPerUnit}
                  onChange={(e) => setForm((f) => ({ ...f, caloriesPerUnit: e.target.value }))}
                  placeholder="e.g. 80"
                />
              </div>
              <div className="flex-1">
                <Label className="mb-2 block">Unit</Label>
                <Input
                  value={form.unit}
                  onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                  placeholder="piece, cup, gram…"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.name.trim() || !form.caloriesPerUnit}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function FoodItemsManager({ items, mutate }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function handleSubmit(payload) {
    try {
      if (editing) await apiPatch(`/api/food-items/${editing._id}`, payload);
      else await apiPost("/api/food-items", payload);
      await mutate();
      toast.success(editing ? "Item updated" : "Item added");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDeleteConfirm() {
    try {
      await apiDelete(`/api/food-items/${deleting._id}`);
      await mutate();
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="h-4 w-4 text-food" /> Food items
        </CardTitle>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add item
        </Button>
      </CardHeader>
      <CardContent>
        {!items || items.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No saved items yet — add ones you eat often so calories fill in automatically.
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li
                key={item._id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.caloriesPerUnit} kcal / {item.unit}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => {
                      setEditing(item);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => setDeleting(item)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <ItemFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editing}
        onSubmit={handleSubmit}
      />
      <ConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete "${deleting?.name}"?`}
        description="Entries you already logged with this item keep their saved calories."
        onConfirm={handleDeleteConfirm}
      />
    </Card>
  );
}
