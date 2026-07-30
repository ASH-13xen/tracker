"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function FoodItemCombobox({ value, onChange, onSelectItem, items, placeholder }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const matches =
    value.trim().length === 0
      ? items.slice(0, 6)
      : items
          .filter((item) => item.name.toLowerCase().includes(value.trim().toLowerCase()))
          .slice(0, 6);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1">
      <Input
        value={value}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
      />
      {open && matches.length > 0 && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-md">
          {matches.map((item) => (
            <button
              key={item._id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelectItem(item);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3 py-1.5 text-left text-sm hover:bg-accent/60"
              )}
            >
              <span>{item.name}</span>
              <span className="text-[11px] text-muted-foreground">
                {item.caloriesPerUnit} kcal/{item.unit}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
