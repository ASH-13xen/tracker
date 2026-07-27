"use client";

import { useEffect, useRef, useState } from "react";
import { NotebookPen, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function DailyNote({ date, note, onSave }) {
  const [value, setValue] = useState(note || "");
  const [saved, setSaved] = useState(true);
  const [prevDate, setPrevDate] = useState(date);
  const timeoutRef = useRef(null);

  if (date !== prevDate) {
    setPrevDate(date);
    setValue(note || "");
    setSaved(true);
  }

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  function handleChange(e) {
    const next = e.target.value;
    setValue(next);
    setSaved(false);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      await onSave(next);
      setSaved(true);
    }, 800);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <NotebookPen className="h-4 w-4 text-muted-foreground" />
          Daily note
        </CardTitle>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {saved ? (
            <>
              <Check className="h-3 w-3" /> saved
            </>
          ) : (
            "saving…"
          )}
        </span>
      </CardHeader>
      <CardContent>
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder="Anything worth remembering about today — why you skipped something, how a session went, etc."
          className="min-h-24 resize-none"
        />
      </CardContent>
    </Card>
  );
}
