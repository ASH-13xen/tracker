"use client";

import { Plus, Pencil, Trash2, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MEAL_LABEL = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  other: "Other",
};

export function FoodDayCard({ day, onAdd, onEdit, onDelete }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Flame className="h-4 w-4 text-food" />
          Food log
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="bg-food/20 text-food">{day?.totalCalories ?? 0} kcal</Badge>
          <Button size="sm" onClick={onAdd}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add entry
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!day || day.entries.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nothing logged for this day yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {day.entries.map((entry) => (
              <li
                key={entry._id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {MEAL_LABEL[entry.mealType]}
                    </Badge>
                    {entry.markedLater && (
                      <Badge variant="secondary" className="text-[9px]">
                        marked later
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm">{entry.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-medium tabular-nums">{entry.calories} kcal</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(entry)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => onDelete(entry)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
