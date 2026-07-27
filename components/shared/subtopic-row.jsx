"use client";

import { MoreVertical, RotateCw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";

function FlagCheckbox({ label, done, doneAt, markedLater, onChange }) {
  return (
    <label className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent/40">
      <Checkbox checked={!!done} onCheckedChange={(c) => onChange(c === true)} />
      <span className="text-xs text-muted-foreground">{label}</span>
      {done && markedLater && (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className="text-[9px]">
              later
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Backdated entry</TooltipContent>
        </Tooltip>
      )}
      {done && doneAt && (
        <span className="text-[10px] text-muted-foreground">
          {format(new Date(doneAt), "d MMM, h:mm a")}
        </span>
      )}
    </label>
  );
}

export function SubtopicRow({
  subtopic,
  onMarkTheory,
  onMarkPractice,
  onMarkRevised,
  onRename,
  onDelete,
  showRevision = false,
}) {
  const isDue =
    showRevision &&
    subtopic.nextRevisionDue &&
    new Date(subtopic.nextRevisionDue) <= new Date() &&
    (subtopic.theoryDone || subtopic.practiceDone);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-2">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        <span className="min-w-[8rem] text-sm">{subtopic.name}</span>
        <FlagCheckbox
          label="Theory"
          done={subtopic.theoryDone}
          doneAt={subtopic.theoryDoneAt}
          markedLater={subtopic.theoryMarkedLater}
          onChange={(checked) => onMarkTheory(checked)}
        />
        <FlagCheckbox
          label="Practice"
          done={subtopic.practiceDone}
          doneAt={subtopic.practiceDoneAt}
          markedLater={subtopic.practiceMarkedLater}
          onChange={(checked) => onMarkPractice(checked)}
        />
        {isDue && (
          <Badge className="gap-1 bg-exercise/20 text-exercise">
            <RotateCw className="h-3 w-3" /> due for revision
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1">
        {showRevision && (subtopic.theoryDone || subtopic.practiceDone) && (
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onMarkRevised}>
            Mark revised
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button size="icon" variant="ghost" className="h-7 w-7" />}>
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
