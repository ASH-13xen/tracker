"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { FoodItemCombobox } from "@/components/food/food-item-combobox";
import { apiPost } from "@/lib/utils/api-client";

const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
  { value: "other", label: "Other" },
];

function emptyItemState() {
  return { name: "", selectedItem: null, quantity: "1", calories: "" };
}

export function FoodEntryFormDialog({ open, onOpenChange, date, foodItems, onDone }) {
  const [mealType, setMealType] = useState("breakfast");
  const [item, setItem] = useState(emptyItemState);
  const [sessionAdded, setSessionAdded] = useState([]);
  const [saving, setSaving] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setMealType("breakfast");
      setItem(emptyItemState());
      setSessionAdded([]);
    }
  }

  function handleNameChange(name) {
    setItem((i) => ({ ...i, name, selectedItem: null }));
  }

  function handleSelectItem(foodItem) {
    const quantity = Number(item.quantity) || 1;
    setItem({
      name: foodItem.name,
      selectedItem: foodItem,
      quantity: String(quantity),
      calories: String(Math.round(foodItem.caloriesPerUnit * quantity)),
    });
  }

  function handleQuantityChange(value) {
    setItem((i) => {
      if (i.selectedItem) {
        const quantity = Number(value) || 0;
        return { ...i, quantity: value, calories: String(Math.round(i.selectedItem.caloriesPerUnit * quantity)) };
      }
      return { ...i, quantity: value };
    });
  }

  async function handleAddItem() {
    if (!item.name.trim() || !item.calories) return;
    setSaving(true);
    try {
      const created = await apiPost("/api/food", {
        date,
        mealType,
        description: item.name.trim(),
        quantity: Number(item.quantity) || 1,
        calories: Number(item.calories),
        foodItemId: item.selectedItem?._id ?? null,
      });
      setSessionAdded((list) => [...list, created]);
      setItem(emptyItemState());
      onDone();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add food entries</DialogTitle>
          <DialogDescription>
            Pick a meal, then add items one by one — keep adding without closing this.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Meal</Label>
            <Select value={mealType} onValueChange={setMealType}>
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

          <div className="rounded-xl border border-border/60 p-3">
            <Label className="mb-2 block">Item</Label>
            <div className="flex gap-2">
              <FoodItemCombobox
                value={item.name}
                onChange={handleNameChange}
                onSelectItem={handleSelectItem}
                items={foodItems}
                placeholder="e.g. Roti — type to see saved items"
              />
            </div>
            <div className="mt-2 flex gap-2">
              <div className="w-24">
                <Label className="mb-1 block text-xs text-muted-foreground">Quantity</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label className="mb-1 block text-xs text-muted-foreground">
                  Calories {item.selectedItem && "(auto)"}
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={item.calories}
                  onChange={(e) => setItem((i) => ({ ...i, calories: e.target.value }))}
                />
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              className="mt-3 w-full"
              disabled={saving || !item.name.trim() || !item.calories}
              onClick={handleAddItem}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add item
            </Button>
          </div>

          {sessionAdded.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Added just now</p>
              <ul className="space-y-1">
                {sessionAdded.map((entry) => (
                  <li
                    key={entry._id}
                    className="flex items-center justify-between rounded-lg bg-food/10 px-2.5 py-1.5 text-sm"
                  >
                    <span className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-food" />
                      {entry.description} {entry.quantity !== 1 && `×${entry.quantity}`}
                    </span>
                    <span className="text-xs text-muted-foreground">{entry.calories} kcal</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
